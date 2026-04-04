import os
import pathlib

base_dir = "backend"

dirs = [
    f"{base_dir}/app/api/dependencies",
    f"{base_dir}/app/api/routes",
    f"{base_dir}/app/core",
    f"{base_dir}/app/db/models",
    f"{base_dir}/app/db/repositories",
    f"{base_dir}/app/db/migrations",
    f"{base_dir}/app/schemas",
    f"{base_dir}/app/services",
    f"{base_dir}/app/ai",
    f"{base_dir}/app/ai/prompts",
    f"{base_dir}/app/ai/tools",
    f"{base_dir}/tests",
]

files = [
    f"{base_dir}/app/__init__.py",
    f"{base_dir}/app/main.py",
    f"{base_dir}/app/api/__init__.py",
    f"{base_dir}/app/api/routes/__init__.py",
    f"{base_dir}/app/api/routes/auth.py",
    f"{base_dir}/app/api/routes/users.py",
    f"{base_dir}/app/api/routes/ideas.py",
    f"{base_dir}/app/api/routes/analysis.py",
    f"{base_dir}/app/api/routes/chat.py",
    f"{base_dir}/app/core/__init__.py",
    f"{base_dir}/app/core/config.py",
    f"{base_dir}/app/core/security.py",
    f"{base_dir}/app/db/__init__.py",
    f"{base_dir}/app/db/session.py",
    f"{base_dir}/app/schemas/__init__.py",
    f"{base_dir}/app/schemas/user.py",
    f"{base_dir}/app/services/__init__.py",
    f"{base_dir}/app/services/auth_service.py",
    f"{base_dir}/app/services/business_service.py",
    f"{base_dir}/app/ai/__init__.py",
    f"{base_dir}/app/ai/llm_client.py",
    f"{base_dir}/app/ai/rag_pipeline.py",
    f"{base_dir}/requirements.txt",
    f"{base_dir}/.env",
    f"{base_dir}/.gitignore",
    f"{base_dir}/README.md"
]

for d in dirs:
    pathlib.Path(d).mkdir(parents=True, exist_ok=True)

for f in files:
    pathlib.Path(f).touch(exist_ok=True)
    
print("Backend structure created successfully!")
