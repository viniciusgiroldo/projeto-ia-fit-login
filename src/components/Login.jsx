import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    navigate('/anamnese');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-dark p-4 font-sans text-white relative overflow-hidden">

      {/* Background Ambience */}
      <div className="absolute inset-0 z-0 opacity-20">
        {/* Green Glow Top Left */}
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-brand-green rounded-full blur-[120px]"></div>
        {/* Dark Glow Bottom Right */}
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-brand-gray rounded-full blur-[100px]"></div>
      </div>

      <div className="w-full max-w-md bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-10">

        {/* Header Section */}
        <div className="p-8 text-center pb-0">
          <h1 className="font-display text-4xl font-black tracking-tighter uppercase italic">
            #TEAM<span className="text-brand-green">TAVARES</span>
          </h1>
          <p className="text-gray-400 mt-2 font-medium tracking-wide uppercase text-xs">
            Consultoria de Elite & Performance
          </p>
        </div>

        {/* Toggle (Login/Register) */}
        <div className="flex p-2 m-8 bg-black/40 rounded-lg">
          <button
            onClick={() => setIsLogin(true)}
            className={`flex-1 py-2 text-sm font-bold uppercase tracking-wider rounded-md transition-all duration-300 ${isLogin ? 'bg-brand-green text-black shadow-lg shadow-brand-green/20' : 'text-gray-500 hover:text-white'
              }`}
          >
            Entrar
          </button>
          <button
            onClick={() => setIsLogin(false)}
            className={`flex-1 py-2 text-sm font-bold uppercase tracking-wider rounded-md transition-all duration-300 ${!isLogin ? 'bg-brand-green text-black shadow-lg shadow-brand-green/20' : 'text-gray-500 hover:text-white'
              }`}
          >
            Cadastrar
          </button>
        </div>

        {/* Form Section */}
        <div className="px-8 pb-8">
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-xs font-bold uppercase text-brand-green mb-1 tracking-wider">Email</label>
              <input
                type="email"
                className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green transition-all"
                placeholder="SEU MELHOR EMAIL"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-brand-green mb-1 tracking-wider">Senha</label>
              <input
                type="password"
                className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green transition-all"
                placeholder="••••••••"
              />
            </div>

            {!isLogin && (
              <div>
                <label className="block text-xs font-bold uppercase text-brand-green mb-1 tracking-wider">Código de Acesso</label>
                <input
                  type="text"
                  className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green transition-all"
                  placeholder="CÓDIGO VIP"
                />
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-brand-green hover:bg-green-400 text-black font-black uppercase text-lg tracking-widest py-4 rounded-lg shadow-lg shadow-brand-green/20 hover:shadow-brand-green/40 transition-all transform hover:-translate-y-1 mt-4"
            >
              {isLogin ? 'Acessar Portal' : 'Iniciar Transformação'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <a href="#" className="text-xs text-gray-500 hover:text-brand-green uppercase tracking-wide transition-colors">
              Esqueceu sua senha?
            </a>
          </div>
        </div>
      </div>

      {/* Footer / Copyright */}
      <div className="absolute bottom-4 text-center w-full">
        <p className="text-[10px] text-gray-700 uppercase tracking-[0.2em] font-bold">
          Powered by #TEAMTAVARES AI
        </p>
      </div>
    </div>
  );
};

export default Login;
