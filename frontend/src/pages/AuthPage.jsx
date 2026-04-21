import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { User, Lock, Mail, ArrowRight, Eye, EyeOff } from 'lucide-react';

function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const navigate = useNavigate();
  const { login, signup, isLoading } = useApp();

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    setEmail('');
    setPassword('');
    setFullName('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isLogin) {
      const success = await login(email, password);
      if (success) navigate('/dashboard');
    } else {
      const success = await signup(email, password, fullName);
      if (success) {
        // Switch to login mode after successful signup
        setIsLogin(true);
        setPassword('');
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark-950 p-4">
      <div className="w-full max-w-4xl min-h-[550px] flex rounded-3xl overflow-hidden glass-card shadow-glow-lg border-dark-700/50 relative md:my-8">
        
        {/* Left Side: Form Section */}
        <div className="w-full md:w-1/2 p-8 md:p-10 flex flex-col justify-center bg-dark-900/80 backdrop-blur-xl relative z-10 border-r border-dark-800/50">
          <div className="max-w-md w-full mx-auto">
            <div className="mb-8 text-center">
              <h1 className="font-display font-black text-4xl mb-2 gradient-text">BizNova</h1>
              <p className="text-dark-400 text-sm">{isLogin ? 'Sign in to continue your journey' : 'Create an account to get started'}</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div className="relative">
                  <User className="w-5 h-5 text-dark-400 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input 
                    type="text" 
                    placeholder="Full Name" 
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full py-2.5 pl-12 pr-4 bg-dark-800/50 border border-dark-600 rounded-xl text-white placeholder-dark-400 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all"
                    id="fullname-input"
                  />
                </div>
              )}

              <div className="relative">
                <Mail className="w-5 h-5 text-dark-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input 
                  type="email" 
                  placeholder="Email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full py-2.5 pl-12 pr-4 bg-dark-800/50 border border-dark-600 rounded-xl text-white placeholder-dark-400 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all"
                  required
                  id="email-input"
                />
              </div>

              <div className="relative">
                <Lock className="w-5 h-5 text-dark-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  placeholder="Password (min 8 characters)" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full py-2.5 pl-12 pr-10 bg-dark-800/50 border border-dark-600 rounded-xl text-white placeholder-dark-400 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all"
                  required
                  minLength={8}
                  maxLength={20}
                  id="password-input"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-dark-400 hover:text-white transition-colors"
                  tabIndex="-1"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              {isLogin && (
                <div className="flex justify-end pt-2">
                  <a href="#" className="text-sm text-brand-400 hover:text-brand-300 transition-colors">
                    Forgot password?
                  </a>
                </div>
              )}

              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full py-3.5 mt-4 rounded-full bg-gradient-to-r from-brand-600 to-purple-600 text-white font-bold tracking-wide hover:shadow-glow hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
                id="auth-submit-btn"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    {isLogin ? 'Signing in...' : 'Creating account...'}
                  </>
                ) : (
                  <>
                    {isLogin ? 'Login' : 'Sign Up'}
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-dark-300 text-sm">
                {isLogin ? "Don't have an account? " : "Already have an account? "}
                <button onClick={toggleAuthMode} className="text-brand-400 font-semibold hover:text-brand-300 hover:underline transition-all">
                  {isLogin ? 'Sign Up' : 'Login'}
                </button>
              </p>
            </div>

            <div className="my-6 flex items-center gap-4">
              <div className="flex-1 h-px bg-dark-700"></div>
              <span className="text-dark-500 text-sm">or continue with</span>
              <div className="flex-1 h-px bg-dark-700"></div>
            </div>

            <div className="flex gap-4">
              <button onClick={() => alert("Google Login will be implemented in the next phase!")} type="button" className="flex-1 py-2.5 rounded-xl border border-dark-700 bg-dark-800/50 hover:bg-dark-700 flex items-center justify-center gap-2 transition-colors group">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                <span className="text-sm font-medium text-dark-200 group-hover:text-white">Google</span>
              </button>
              <button onClick={() => alert("Apple Login will be implemented in the next phase!")} type="button" className="flex-1 py-2.5 rounded-xl border border-dark-700 bg-dark-800/50 hover:bg-dark-700 flex items-center justify-center gap-2 transition-colors group">
                <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.477 2 2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.989C18.343 21.129 22 16.99 22 12c0-5.523-4.477-10-10-10z"/>
                </svg>
                <span className="text-sm font-medium text-dark-200 group-hover:text-white">Apple</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Side: Welcome Banner */}
        <div className="hidden md:flex w-1/2 bg-gradient-to-br from-brand-600 via-purple-700 to-dark-900 p-12 flex-col justify-center relative overflow-hidden">
          {/* Decorative background elements */}
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-white opacity-5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
          <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-brand-400 opacity-20 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4"></div>
          
          <div className="relative z-10 text-right text-white max-w-sm ml-auto">
            <h2 className="text-5xl font-black mb-6 font-display leading-tight">
              {isLogin ? "WELCOME BACK!" : "JOIN US TODAY!"}
            </h2>
            <p className="text-brand-100 text-lg leading-relaxed">
              {isLogin 
                ? "Dive back into BizNova and let AI continue empowering your business intelligence journey."
                : "Create an account to start generating tailored business plans and getting cutting edge market insights."}
            </p>
          </div>
          
          {/* Custom slanted divider to match the image */}
          <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
            <div className="absolute top-0 left-0 w-32 h-full bg-dark-900/80 backdrop-blur-xl border-r border-dark-800/50 shadow-[10px_0_30px_rgba(0,0,0,0.5)] transform -skew-x-[15deg] -translate-x-16"></div>
          </div>
        </div>
        
      </div>
    </div>
  );
}

export default AuthPage;
