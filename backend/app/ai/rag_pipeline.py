"""
BizNova AI — Corrective RAG (CRAG) Pipeline
=============================================

This module implements the **Corrective Retrieval-Augmented Generation**
(CRAG) pipeline for document-based Q&A. Unlike standard RAG which blindly
passes retrieved chunks to the LLM, CRAG adds an intelligent grading step
that evaluates whether each retrieved chunk is actually relevant to the
user's question before using it for answer generation.

What is CRAG?
-------------
CRAG (Corrective RAG) was introduced in the paper "Corrective Retrieval
Augmented Generation" (Yan et al., 2024). It improves RAG accuracy by
adding three key stages after retrieval:

1. **Retrieve** — Perform semantic similarity search against the vector
   store (ChromaDB) to find candidate document chunks.

2. **Grade** — Use the LLM to evaluate each retrieved chunk for relevance
   to the user's question. Each chunk gets a grade:
   - ``"relevant"`` → The chunk directly helps answer the question.
   - ``"irrelevant"`` → The chunk is off-topic and should be discarded.

3. **Decide & Generate** — Based on grading results:
   - **CORRECT**: ≥50% of chunks are relevant → Use relevant chunks as
     context for the LLM to generate a grounded answer.
   - **INCORRECT**: 0% of chunks are relevant → Discard all chunks and
     generate an answer using the LLM's general knowledge.
   - **AMBIGUOUS**: Some chunks are relevant but <50% → Rewrite the query
     to be more specific and re-retrieve (one retry attempt).

Why CRAG Over Standard RAG?
----------------------------
Standard RAG suffers from:
- **Noise pollution**: Irrelevant chunks in the context confuse the LLM,
  leading to hallucinated or incorrect answers.
- **Blind trust**: The LLM treats all retrieved content as equally valid,
  even when the retrieval missed the mark.

CRAG solves this by adding a "quality check" on retrieved content before
generation. Think of it as a librarian who checks if the books pulled
from the shelf are actually relevant to your question before handing
them to you.

Pipeline Architecture
---------------------
::

    User Question
         │
         ▼
    ┌─────────────┐
    │  Retrieve    │  → ChromaDB similarity search (top 5 chunks)
    └─────┬───────┘
          │
          ▼
    ┌─────────────┐
    │   Grade      │  → LLM evaluates each chunk's relevance
    └─────┬───────┘
          │
          ├── CORRECT (≥50% relevant)
          │      │
          │      ▼
          │   Generate with relevant chunks as context
          │
          ├── AMBIGUOUS (some relevant, <50%)
          │      │
          │      ▼
          │   Rewrite query → Re-retrieve → Re-grade → Generate
          │
          └── INCORRECT (0% relevant)
                 │
                 ▼
              Generate without chunks (general knowledge)

Document Processing
-------------------
When a user uploads a document:
1. Text is extracted (PDF → text, or raw text files).
2. Text is split into overlapping chunks (800 chars, 200 overlap).
3. Each chunk is embedded using Gemini's embedding model.
4. Chunks are stored in ChromaDB (vectors) and SQLite (text).

Dependencies
------------
- ``chromadb``: Vector database for semantic similarity search.
- ``google-generativeai``: For embeddings and chunk grading.
- ``PyPDF2``: For extracting text from PDF documents.

Usage
-----
::

    crag = CRAGPipeline()

    # Process a document
    chunks = crag.process_document(file_bytes, "report.pdf", "pdf", user_id=1)

    # Answer a question using CRAG
    async for chunk in crag.query_stream("What is the revenue model?", user_id=1):
        print(chunk, end="")  # Streaming answer

    # Non-streaming query
    answer = await crag.query("What is the target market?", user_id=1)
"""

import chromadb
import google.generativeai as genai
from app.core.config import settings
import logging
import uuid
import json
import re

logger = logging.getLogger(__name__)

# ─── Constants ────────────────────────────────────────────────────────────────
CHUNK_SIZE = 800        # Characters per chunk
CHUNK_OVERLAP = 200     # Overlap between consecutive chunks
TOP_K = 5               # Number of chunks to retrieve
RELEVANCE_THRESHOLD = 0.5  # Minimum ratio of relevant chunks for CORRECT decision


class CRAGPipeline:
    """
    Corrective Retrieval-Augmented Generation pipeline for document Q&A.

    This class orchestrates the entire CRAG workflow:
    - Document ingestion (text extraction, chunking, embedding)
    - Retrieval (ChromaDB similarity search)
    - Grading (LLM-based relevance evaluation)
    - Corrective decision (CORRECT / AMBIGUOUS / INCORRECT)
    - Generation (streaming or non-streaming)

    The pipeline maintains a ChromaDB instance with persistent storage
    so that document embeddings survive server restarts.

    Attributes:
        chroma_client (chromadb.PersistentClient): ChromaDB client with
            on-disk storage in the ``./chroma_db`` directory.
    """

    def __init__(self):
        """
        Initialize the CRAG pipeline with a persistent ChromaDB client.

        ChromaDB data is stored in ``./chroma_db`` relative to the backend
        working directory. This means embeddings persist across server
        restarts — no need to re-embed documents.
        """
        genai.configure(api_key=settings.GEMINI_API_KEY)
        self.chroma_client = chromadb.PersistentClient(path="./chroma_db")

    def _get_collection(self, user_id: int) -> chromadb.Collection:
        """
        Get or create a ChromaDB collection for a specific user.

        Each user gets their own collection so document embeddings are
        isolated. Collection names follow the pattern ``user_{id}_docs``.

        Args:
            user_id (int): The database ID of the user.

        Returns:
            chromadb.Collection: The user's ChromaDB collection, created
                if it doesn't already exist.
        """
        collection_name = f"user_{user_id}_docs"
        return self.chroma_client.get_or_create_collection(
            name=collection_name,
            metadata={"description": f"Documents for user {user_id}"},
        )

    # ─── Document Processing ─────────────────────────────────────────────

    def extract_text(self, file_bytes: bytes, file_type: str) -> str:
        """
        Extract plain text from an uploaded file.

        Supports PDF and plain text files. PDF extraction uses PyPDF2
        to read all pages and concatenate their text content.

        Args:
            file_bytes (bytes): Raw bytes of the uploaded file.
            file_type (str): File extension/type — ``'pdf'`` or ``'txt'``.

        Returns:
            str: Extracted text content from the file.

        Raises:
            ValueError: If the file type is not supported.
        """
        if file_type == "pdf":
            try:
                import PyPDF2
                import io

                reader = PyPDF2.PdfReader(io.BytesIO(file_bytes))
                text = ""
                for page in reader.pages:
                    page_text = page.extract_text()
                    if page_text:
                        text += page_text + "\n"
                return text.strip()
            except Exception as e:
                logger.error(f"PDF extraction error: {e}")
                raise ValueError(f"Failed to extract text from PDF: {str(e)}")
        elif file_type in ("txt", "text", "md"):
            return file_bytes.decode("utf-8", errors="ignore").strip()
        else:
            raise ValueError(f"Unsupported file type: {file_type}. Use PDF or TXT.")

    def split_text(self, text: str) -> list[str]:
        """
        Split text into overlapping chunks for embedding.

        Uses a simple character-based splitting strategy with overlap to
        ensure that information spanning chunk boundaries is captured in
        at least one chunk. The overlap acts as a "sliding window" so
        context is not lost at split points.

        For example, with CHUNK_SIZE=800 and CHUNK_OVERLAP=200:
        - Chunk 1: characters 0-799
        - Chunk 2: characters 600-1399  (200 char overlap with chunk 1)
        - Chunk 3: characters 1200-1999 (200 char overlap with chunk 2)
        - etc.

        Args:
            text (str): The full extracted text to split.

        Returns:
            list[str]: List of text chunks, each approximately
                CHUNK_SIZE characters long. Empty chunks are filtered out.
        """
        chunks = []
        start = 0
        while start < len(text):
            end = start + CHUNK_SIZE
            chunk = text[start:end].strip()
            if chunk:
                chunks.append(chunk)
            start += CHUNK_SIZE - CHUNK_OVERLAP
        return chunks

    def embed_and_store(
        self, chunks: list[str], document_id: int, user_id: int
    ) -> list[str]:
        """
        Embed text chunks and store them in ChromaDB.

        Each chunk is assigned a unique ID in the format
        ``doc_{document_id}_chunk_{index}``. The chunks are added to the
        user's ChromaDB collection along with metadata (document ID,
        chunk index) for filtering and retrieval.

        ChromaDB automatically generates embeddings using its default
        embedding function (Sentence Transformers). We store the chunk
        text as the document and the unique ID for cross-referencing
        with our SQLite database.

        Args:
            chunks (list[str]): List of text chunks to embed.
            document_id (int): The SQLite ID of the parent Document.
            user_id (int): The user who owns this document.

        Returns:
            list[str]: List of ChromaDB IDs assigned to each chunk.
                These IDs are stored in the ``DocumentChunk.chroma_id``
                field for cross-referencing.
        """
        collection = self._get_collection(user_id)
        chroma_ids = []

        for i, chunk in enumerate(chunks):
            chroma_id = f"doc_{document_id}_chunk_{i}"
            chroma_ids.append(chroma_id)

        # Batch add to ChromaDB
        if chunks:
            collection.add(
                ids=chroma_ids,
                documents=chunks,
                metadatas=[
                    {"document_id": document_id, "chunk_index": i}
                    for i in range(len(chunks))
                ],
            )
            logger.info(
                f"Stored {len(chunks)} chunks for document {document_id} "
                f"(user {user_id})"
            )

        return chroma_ids

    def delete_document_chunks(self, document_id: int, user_id: int):
        """
        Remove all chunks for a document from ChromaDB.

        Called when a user deletes a document. Finds all chunk IDs
        matching the document and removes them from the vector store.

        Args:
            document_id (int): The SQLite ID of the document to remove.
            user_id (int): The user who owns the document.
        """
        collection = self._get_collection(user_id)
        try:
            # Get all chunks for this document
            results = collection.get(
                where={"document_id": document_id},
            )
            if results["ids"]:
                collection.delete(ids=results["ids"])
                logger.info(
                    f"Deleted {len(results['ids'])} chunks for document {document_id}"
                )
        except Exception as e:
            logger.error(f"Error deleting chunks: {e}")

    # ─── Retrieval ────────────────────────────────────────────────────────

    def retrieve(self, query: str, user_id: int, top_k: int = TOP_K) -> list[dict]:
        """
        Retrieve the most relevant document chunks for a query.

        Performs semantic similarity search in the user's ChromaDB
        collection. Returns the top-K most similar chunks along with
        their metadata and distance scores.

        Args:
            query (str): The user's question to search for.
            user_id (int): The user whose documents to search.
            top_k (int): Number of top results to return. Default 5.

        Returns:
            list[dict]: List of retrieved chunks, each containing:
                - ``id`` (str): ChromaDB chunk ID
                - ``content`` (str): The chunk text
                - ``metadata`` (dict): Includes document_id, chunk_index
                - ``distance`` (float): Similarity distance (lower = more similar)

            Returns empty list if no documents exist for the user.
        """
        collection = self._get_collection(user_id)

        try:
            # Check if collection has any documents
            if collection.count() == 0:
                return []

            results = collection.query(
                query_texts=[query],
                n_results=min(top_k, collection.count()),
            )

            chunks = []
            if results["documents"] and results["documents"][0]:
                for i in range(len(results["documents"][0])):
                    chunks.append({
                        "id": results["ids"][0][i],
                        "content": results["documents"][0][i],
                        "metadata": results["metadatas"][0][i] if results["metadatas"] else {},
                        "distance": results["distances"][0][i] if results["distances"] else 0,
                    })

            logger.info(f"Retrieved {len(chunks)} chunks for query: {query[:50]}...")
            return chunks
        except Exception as e:
            logger.error(f"Retrieval error: {e}")
            return []

    # ─── Grading (Core of CRAG) ──────────────────────────────────────────

    async def grade_chunk(self, chunk_content: str, query: str) -> str:
        """
        Grade a single retrieved chunk for relevance to the query.

        This is the core of the CRAG system. An LLM evaluates whether
        a chunk of text is relevant to answering the user's question.
        The LLM acts as a "relevance judge" and returns a binary grade.

        The grading prompt is carefully engineered to produce consistent
        ``"relevant"`` or ``"irrelevant"`` responses without explanation,
        making it easy to parse programmatically.

        Args:
            chunk_content (str): The text content of the retrieved chunk.
            query (str): The user's original question.

        Returns:
            str: Either ``"relevant"`` or ``"irrelevant"``.
                Defaults to ``"irrelevant"`` if the LLM response cannot
                be parsed (fail-safe behavior).
        """
        grading_prompt = f"""You are a relevance grading expert. Your job is to evaluate whether
a document chunk is relevant to answering a user's question.

## User Question:
{query}

## Document Chunk:
{chunk_content}

## Instructions:
- If the chunk contains information that would help answer the question, respond with: relevant
- If the chunk does NOT contain useful information for the question, respond with: irrelevant
- Respond with ONLY one word: either "relevant" or "irrelevant"
- Do NOT explain your reasoning.

Grade:"""

        try:
            model = genai.GenerativeModel("gemini-2.0-flash")
            response = model.generate_content(
                grading_prompt,
                generation_config={"temperature": 0.0, "max_output_tokens": 10},
            )
            grade = response.text.strip().lower()
            return "relevant" if "relevant" in grade and "irrelevant" not in grade else "irrelevant"
        except Exception as e:
            logger.error(f"Grading error: {e}")
            return "irrelevant"  # Fail-safe: treat as irrelevant

    async def grade_chunks(
        self, chunks: list[dict], query: str
    ) -> tuple[list[dict], list[dict]]:
        """
        Grade all retrieved chunks and separate into relevant/irrelevant.

        Iterates through all retrieved chunks and grades each one using
        the LLM. Returns two lists: relevant chunks (to use for generation)
        and irrelevant chunks (to discard).

        Args:
            chunks (list[dict]): Retrieved chunks from ``retrieve()``.
            query (str): The user's question.

        Returns:
            tuple[list[dict], list[dict]]: A tuple of (relevant_chunks,
                irrelevant_chunks). Each chunk dict contains ``id``,
                ``content``, ``metadata``, ``distance``.
        """
        relevant = []
        irrelevant = []

        for chunk in chunks:
            grade = await self.grade_chunk(chunk["content"], query)
            if grade == "relevant":
                relevant.append(chunk)
            else:
                irrelevant.append(chunk)

        logger.info(
            f"CRAG Grading: {len(relevant)} relevant, "
            f"{len(irrelevant)} irrelevant out of {len(chunks)} total"
        )
        return relevant, irrelevant

    # ─── Query Rewriting (for AMBIGUOUS case) ─────────────────────────────

    async def rewrite_query(self, original_query: str) -> str:
        """
        Rewrite an ambiguous query to be more specific for re-retrieval.

        When the CRAG grading result is AMBIGUOUS (some chunks relevant
        but less than the threshold), this function rewrites the user's
        question to be more specific and targeted, then the pipeline
        re-retrieves with the improved query.

        The rewriting prompt asks the LLM to make the question more
        specific and detailed while preserving the original intent.

        Args:
            original_query (str): The user's original question that
                produced ambiguous retrieval results.

        Returns:
            str: A rewritten, more specific version of the query.
                Falls back to the original query if rewriting fails.
        """
        rewrite_prompt = f"""You are a search query optimizer. Rewrite the following question
to be more specific and detailed for document retrieval.

Original question: {original_query}

Rewrite it to be more targeted and specific. Return ONLY the rewritten question, nothing else.

Rewritten question:"""

        try:
            model = genai.GenerativeModel("gemini-2.0-flash")
            response = model.generate_content(
                rewrite_prompt,
                generation_config={"temperature": 0.3, "max_output_tokens": 200},
            )
            rewritten = response.text.strip()
            logger.info(f"Query rewritten: '{original_query}' → '{rewritten}'")
            return rewritten
        except Exception as e:
            logger.error(f"Query rewrite error: {e}")
            return original_query

    # ─── CRAG Decision Logic ─────────────────────────────────────────────

    async def crag_retrieve_and_grade(
        self, query: str, user_id: int
    ) -> tuple[str, list[dict]]:
        """
        Execute the full CRAG retrieval-grading-correction pipeline.

        This is the main CRAG entry point that implements the three-way
        decision logic:

        1. Retrieve top-K chunks from ChromaDB
        2. Grade each chunk for relevance
        3. Decide:
           - **CORRECT** (≥50% relevant): Return relevant chunks
           - **AMBIGUOUS** (1-49% relevant): Rewrite query, re-retrieve,
             re-grade, then return whatever is relevant
           - **INCORRECT** (0% relevant): Return empty list → LLM uses
             general knowledge

        Args:
            query (str): The user's question.
            user_id (int): The user whose documents to search.

        Returns:
            tuple[str, list[dict]]: A tuple of:
                - decision (str): ``"correct"``, ``"ambiguous"``, or ``"incorrect"``
                - relevant_chunks (list[dict]): The chunks to use for generation
                  (empty list for ``"incorrect"`` decision).
        """
        # Step 1: Retrieve
        chunks = self.retrieve(query, user_id)

        if not chunks:
            logger.info("CRAG: No documents found for user, using general knowledge")
            return "incorrect", []

        # Step 2: Grade
        relevant, irrelevant = await self.grade_chunks(chunks, query)

        total = len(chunks)
        relevant_ratio = len(relevant) / total if total > 0 else 0

        # Step 3: Decide
        if relevant_ratio >= RELEVANCE_THRESHOLD:
            # CORRECT — enough relevant chunks found
            logger.info(f"CRAG Decision: CORRECT ({len(relevant)}/{total} relevant)")
            return "correct", relevant

        elif len(relevant) > 0:
            # AMBIGUOUS — some relevant but below threshold
            # Attempt query rewriting and re-retrieval
            logger.info(
                f"CRAG Decision: AMBIGUOUS ({len(relevant)}/{total} relevant). "
                f"Rewriting query..."
            )
            rewritten_query = await self.rewrite_query(query)
            retry_chunks = self.retrieve(rewritten_query, user_id)

            if retry_chunks:
                retry_relevant, _ = await self.grade_chunks(retry_chunks, query)
                if retry_relevant:
                    # Combine original relevant + new relevant (deduplicate)
                    seen_ids = {c["id"] for c in relevant}
                    for c in retry_relevant:
                        if c["id"] not in seen_ids:
                            relevant.append(c)
                            seen_ids.add(c["id"])

            return "ambiguous", relevant

        else:
            # INCORRECT — nothing relevant found
            logger.info(f"CRAG Decision: INCORRECT (0/{total} relevant)")
            return "incorrect", []

    # ─── Answer Generation ────────────────────────────────────────────────

    def _build_crag_prompt(
        self, query: str, relevant_chunks: list[dict], decision: str
    ) -> str:
        """
        Build the generation prompt incorporating CRAG context.

        Constructs different prompts based on the CRAG decision:
        - **CORRECT/AMBIGUOUS**: Includes relevant chunks as context and
          instructs the LLM to answer based on the document content.
        - **INCORRECT**: No context provided; instructs the LLM to answer
          from general knowledge and be transparent about it.

        Args:
            query (str): The user's original question.
            relevant_chunks (list[dict]): Relevant chunks from CRAG grading.
            decision (str): The CRAG decision (correct/ambiguous/incorrect).

        Returns:
            str: Complete prompt ready for LLM generation.
        """
        if relevant_chunks and decision != "incorrect":
            context = "\n\n---\n\n".join(
                [f"[Chunk {i+1}]: {c['content']}" for i, c in enumerate(relevant_chunks)]
            )
            return f"""You are BizNova AI — an expert business advisor. Answer the user's question
based on the following document excerpts. Be specific, cite information from the documents,
and provide actionable insights.

## Retrieved Document Context:
{context}

## CRAG Confidence: {decision.upper()}
{"The retrieved context is highly relevant. Base your answer primarily on these documents." if decision == "correct" else "Some context was found but relevance is mixed. Use the documents where applicable and supplement with your general knowledge."}

## User Question:
{query}

## Instructions:
1. Answer based on the document content above
2. If the documents contain specific numbers, facts, or strategies, cite them
3. Be concise but comprehensive (2-4 paragraphs)
4. Use bullet points for lists
5. If the documents don't fully answer the question, say so and provide general advice

Answer:"""
        else:
            return f"""You are BizNova AI — an expert business advisor. The user asked a question
about their uploaded documents, but no relevant information was found in the documents.

## User Question:
{query}

## Instructions:
1. Let the user know that the uploaded documents don't contain specific information about their question
2. Provide your best general knowledge answer to help them
3. Suggest what kind of document might contain the answer they're looking for
4. Be helpful and constructive

Answer:"""

    async def query(self, query: str, user_id: int) -> str:
        """
        Execute a CRAG query and return the complete answer (non-streaming).

        Runs the full pipeline: retrieve → grade → decide → generate.

        Args:
            query (str): The user's question about their documents.
            user_id (int): The user whose documents to search.

        Returns:
            str: The complete generated answer text.
        """
        decision, relevant_chunks = await self.crag_retrieve_and_grade(query, user_id)
        prompt = self._build_crag_prompt(query, relevant_chunks, decision)

        model = genai.GenerativeModel("gemini-2.0-flash")
        response = model.generate_content(
            prompt,
            generation_config={"temperature": 0.7, "max_output_tokens": 4096},
        )
        return response.text

    async def query_stream(self, query: str, user_id: int):
        """
        Execute a CRAG query and stream the answer chunk by chunk.

        Same as ``query()`` but yields text chunks for real-time streaming.
        Used by the SSE chat endpoint to provide typewriter-effect responses
        for document Q&A.

        Args:
            query (str): The user's question about their documents.
            user_id (int): The user whose documents to search.

        Yields:
            str: Text chunks as they arrive from the Gemini API.
        """
        decision, relevant_chunks = await self.crag_retrieve_and_grade(query, user_id)
        prompt = self._build_crag_prompt(query, relevant_chunks, decision)

        model = genai.GenerativeModel("gemini-2.0-flash")
        try:
            response = model.generate_content(
                prompt,
                generation_config={"temperature": 0.7, "max_output_tokens": 4096},
                stream=True,
            )
            for chunk in response:
                if chunk.text:
                    yield chunk.text
        except Exception as e:
            logger.error(f"CRAG streaming error: {e}")
            yield f"\n\n⚠️ Error: {str(e)}"

    def get_user_document_count(self, user_id: int) -> int:
        """
        Check how many document chunks a user has in ChromaDB.

        Used to determine whether to offer CRAG-based answers or
        regular chat answers.

        Args:
            user_id (int): The user to check.

        Returns:
            int: Number of chunks in the user's collection. 0 if no
                documents have been uploaded.
        """
        collection = self._get_collection(user_id)
        return collection.count()


# ─── Module-level singleton ──────────────────────────────────────────────────
# Reuse the same CRAGPipeline instance across requests to avoid
# re-initializing ChromaDB on every request.
crag_pipeline = CRAGPipeline()
