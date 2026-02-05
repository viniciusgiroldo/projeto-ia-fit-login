import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { userService } from '../services/userService';
import { supabase } from '../services/supabase';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);

  const { signIn, signUp, user: authUser } = useAuth();
  const navigate = useNavigate();

  // Auto-redirect if already logged in
  useEffect(() => {
    const checkSession = async () => {
      if (authUser) {
        try {
          // Attempt to check strict logic
          const hasData = await userService.hasAnamnese(authUser.id);
          if (hasData) {
            navigate('/dashboard');
          } else {
            navigate('/anamnese');
          }
        } catch (error) {
          console.error("Erro verificação sessão:", error);
          // FALLBACK: If DB fails, assume they are a valid user and send to Dashboard
          // Dashboard handles its own "No Plan" state gracefully.
          navigate('/dashboard');
        }
      }
      setCheckingSession(false);
    };

    checkSession();
  }, [authUser, navigate]);

  // REMOVED Anti-Flicker early returns to prevent "Disappearing Form" issue on Safari
  // The form will render, and if a session exists, the useEffect above will handle the redirect.
  // This prioritizes VISIBILITY over preventing a minor flicker.

  const handleAuth = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        await signIn(email, password);
        // Check if user has data
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const hasData = await userService.hasAnamnese(user.id);
          if (hasData) {
            navigate('/dashboard');
          } else {
            navigate('/anamnese');
          }
        }
      } else {
        await signUp(email, password, fullName);
        navigate('/anamnese');
      }
    } catch (err) {
      console.error(err);
      setError(err.message || 'Ocorreu um erro. Verifique seus dados.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-brand-dark p-4 font-sans text-white relative overflow-hidden isolate transform-gpu">

      {/* Background Ambience */}
      <div className="absolute inset-0 z-0 opacity-20">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-brand-green rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-brand-gray rounded-full blur-[100px]"></div>
      </div>

      <div className="w-full max-w-md bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-10">

        <div className="p-8 text-center pb-0">
          <h1 className="font-display text-4xl font-black tracking-tighter uppercase italic">
            #TEAM<span className="text-brand-green">TAVARES</span>
          </h1>
          <p className="text-gray-400 mt-2 font-medium tracking-wide uppercase text-xs">
            Consultoria de Elite & Performance
          </p>
        </div>

        {/* Toggle Logic */}
        <div className="flex p-2 m-8 bg-black/40 rounded-lg">
          <button
            onClick={() => { setIsLogin(true); setError(''); }}
            className={`flex-1 py-2 text-sm font-bold uppercase tracking-wider rounded-md transition-all duration-300 ${isLogin ? 'bg-brand-green text-black shadow-lg shadow-brand-green/20' : 'text-gray-500 hover:text-white'}`}
          >
            Entrar
          </button>
          <button
            onClick={() => { setIsLogin(false); setError(''); }}
            className={`flex-1 py-2 text-sm font-bold uppercase tracking-wider rounded-md transition-all duration-300 ${!isLogin ? 'bg-brand-green text-black shadow-lg shadow-brand-green/20' : 'text-gray-500 hover:text-white'}`}
          >
            Cadastrar
          </button>
        </div>

        <div className="px-8 pb-8">
          {error && (
            <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded text-xs text-red-200 font-bold uppercase tracking-wide text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleAuth} className="space-y-5">
            {!isLogin && (
              <div>
                <label className="block text-xs font-bold uppercase text-brand-green mb-1 tracking-wider">Nome Completo</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green transition-all"
                  placeholder="SEU NOME"
                  required
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-bold uppercase text-brand-green mb-1 tracking-wider">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green transition-all"
                placeholder="SEU EMAIL DE ACESSO"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-brand-green mb-1 tracking-wider">Senha</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green transition-all"
                placeholder="••••••••"
                required
                minLength={6}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-brand-green hover:bg-green-400 text-black font-black uppercase text-lg tracking-widest py-4 rounded-lg shadow-lg shadow-brand-green/20 hover:shadow-brand-green/40 transition-all transform hover:-translate-y-1 mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Carregando...' : (isLogin ? 'Acessar Portal' : 'Iniciar Transformação')}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-[10px] text-gray-500 uppercase tracking-widest">
              Protegido por #TEAMTAVARES Security
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
