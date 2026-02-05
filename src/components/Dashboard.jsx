import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { userService } from '../services/userService';

const Dashboard = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user: authUser } = useAuth();

    const [plan, setPlan] = useState(null);
    const [user, setUser] = useState(null); // Anamnese data
    const [loading, setLoading] = useState(true);
    const [selectedWorkout, setSelectedWorkout] = useState(null);
    const [showProfile, setShowProfile] = useState(false);
    const [activeSection, setActiveSection] = useState('home');

    useEffect(() => {
        const loadData = async () => {
            // Priority 1: Data passed via State (Fresh generation)
            if (location.state?.plan) {
                setPlan(location.state.plan);
                setUser(location.state.user);
                setLoading(false);
                return;
            }

            // Priority 2: Fetch from DB
            if (authUser) {
                try {
                    const { user: anamneseData, plan: planData } = await userService.getUserFullData(authUser.id);
                    if (anamneseData && planData) {
                        setPlan(planData);
                        setUser(anamneseData);
                    }
                } catch (error) {
                    console.error("Erro ao buscar dados:", error);
                } finally {
                    setLoading(false);
                }
            } else {
                // Not authenticated or no user yet, wait for AuthContext
                // (AuthContext handles its own loading, so authUser might be null briefly)
                if (authUser === null) {
                    // Could set loading false if we are sure auth is done, 
                    // but AuthContext usually provides a 'loading' flag too. 
                    // For now, let's just let it finish.
                }
            }
        };

        loadData();
    }, [location, authUser]);

    if (loading) {
        return (
            <div className="min-h-screen bg-brand-dark text-white flex items-center justify-center p-4 font-sans">
                <div className="animate-pulse text-brand-green font-bold text-xl uppercase tracking-widest">
                    Carregando seu plano...
                </div>
            </div>
        );
    }

    if (!plan) {
        return (
            <div className="min-h-screen bg-brand-dark text-white flex items-center justify-center p-4 font-sans">
                <div className="text-center">
                    <h2 className="text-all text-3xl font-display font-black italic mb-4">Nenhum plano encontrado</h2>
                    <p className="text-gray-400 mb-6">Parece que você ainda não gerou seu treino.</p>
                    <button onClick={() => navigate('/anamnese')} className="px-8 py-3 bg-brand-green text-black font-bold uppercase tracking-widest rounded-lg hover:scale-105 transition-transform">
                        Fazer Anamnese
                    </button>
                </div>
            </div>
        );
    }

    // Safe access helpers
    const getTreino = () => Array.isArray(plan.treino) ? plan.treino : [];
    const getDieta = () => Array.isArray(plan.dieta) ? plan.dieta : [];

    // Helper for Section Header
    const SectionHeader = ({ title, subtitle }) => (
        <div className="container mx-auto px-4 md:px-12 pt-24 pb-8 flex items-end justify-between border-b border-white/10 mb-8">
            <div>
                <button
                    onClick={() => setActiveSection('home')}
                    className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors mb-4 px-3 py-1 rounded-full hover:bg-white/5 w-fit"
                >
                    <span className="text-lg">←</span>
                    <span className="text-xs font-bold uppercase tracking-widest">Voltar ao Menu</span>
                </button>
                <h2 className="text-3xl md:text-5xl font-display font-black italic uppercase tracking-tighter">{title}</h2>
                <p className="text-brand-green font-bold uppercase tracking-wider text-sm mt-1">{subtitle}</p>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-brand-dark text-white overflow-x-hidden font-sans selection:bg-brand-green selection:text-black">
            {/* Navbar */}
            <nav className="fixed w-full z-50 bg-black/80 backdrop-blur-md border-b border-white/5 p-4 md:p-6 flex justify-between items-center transition-all duration-300">
                <img
                    src="https://joaotavarestreinador.my.canva.site/_assets/media/6c23a5114e94f984ad95afa59dd2fa38.png"
                    alt="#TEAMTAVARES"
                    className="h-8 md:h-10 cursor-pointer"
                    onClick={() => setActiveSection('home')}
                />
                <div
                    className="flex items-center space-x-4 cursor-pointer hover:bg-white/5 p-2 rounded-xl transition-colors group"
                    onClick={() => setShowProfile(true)}
                >
                    <div className="text-right hidden md:block group-hover:opacity-80">
                        <p className="text-sm font-bold text-white uppercase tracking-wider">{user?.nome || 'Atleta'}</p>
                        <p className="text-[10px] text-brand-green uppercase tracking-widest font-bold">Ver Perfil</p>
                    </div>
                    <div className="w-10 h-10 rounded-lg bg-white/10 border border-brand-green/30 flex items-center justify-center font-black text-brand-green shadow-[0_0_10px_rgba(0,200,83,0.3)]">
                        {user?.nome ? user.nome.charAt(0).toUpperCase() : 'U'}
                    </div>
                </div>
            </nav>

            {/* --- HOME VIEW --- */}
            {activeSection === 'home' && (
                <>
                    {/* Hero Section */}
                    <header className="relative min-h-[85vh] md:h-[80vh] w-full flex items-center overflow-hidden">
                        {/* Background Images */}
                        <div className="absolute inset-0 md:hidden bg-cover bg-center opacity-40 grayscale mix-blend-luminosity animate-fade-in" style={{ backgroundImage: 'url("https://joaotavarestreinador.my.canva.site/_assets/media/9e39533b3c8173e610efb681bad1be83.png")' }}></div>
                        <div className="hidden md:block absolute inset-0 bg-cover bg-center opacity-40 grayscale mix-blend-luminosity scale-105 animate-fade-in" style={{ backgroundImage: 'url("https://joaotavarestreinador.my.canva.site/_assets/media/9e39533b3c8173e610efb681bad1be83.png")', backgroundPosition: 'center 20%' }}></div>
                        <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-brand-dark/50 to-transparent z-10"></div>

                        <div className="relative z-20 container mx-auto px-4 md:px-12 flex flex-col justify-center h-full pt-32 pb-10">
                            <span className="inline-block py-1 px-3 w-fit border border-brand-green/30 bg-brand-green/5 rounded text-brand-green text-[10px] md:text-xs font-black tracking-[0.2em] mb-4 uppercase animate-slide-up">
                                {plan.nomePlano || 'PROTOCOLO PERSONALIZADO'}
                            </span>
                            <h1 className="text-4xl md:text-7xl font-display font-black mb-4 leading-[0.9] italic uppercase tracking-tighter animate-slide-up">
                                Bem-vindo, <span className="text-white text-transparent bg-clip-text bg-gradient-to-r from-brand-green to-white">{user?.nome?.split(' ')[0]}</span>
                            </h1>
                            <p className="text-sm md:text-base text-gray-400 max-w-xl mb-12 font-medium leading-relaxed animate-slide-up animation-delay-100">
                                {plan.resumoMotivacional || 'Seu plano exclusivo está pronto. Escolha uma área abaixo para começar.'}
                            </p>
                        </div>
                    </header>

                    {/* Banners Grid */}
                    <section className="container mx-auto px-4 md:px-12 pb-20 -mt-20 relative z-30">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* TREINOS Banner */}
                            <div
                                onClick={() => setActiveSection('treino')}
                                className="group relative h-64 md:h-96 rounded-2xl overflow-hidden cursor-pointer border border-white/10 hover:border-brand-green/50 transition-all shadow-2xl"
                            >
                                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1470&auto=format&fit=crop')] bg-cover bg-center opacity-50 group-hover:scale-105 transition-transform duration-700 grayscale group-hover:grayscale-0"></div>
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
                                <div className="absolute bottom-0 left-0 p-8">
                                    <h3 className="text-2xl lg:text-3xl font-display font-black italic uppercase text-white mb-1 group-hover:text-brand-green transition-colors">Treinos</h3>
                                    <div className="h-1 w-12 bg-white group-hover:bg-brand-green transition-colors rounded-full mb-2"></div>
                                    <p className="text-xs text-gray-400 uppercase tracking-widest font-bold">Ver Planilha</p>
                                </div>
                            </div>

                            {/* NUTRIÇÃO Banner */}
                            <div
                                onClick={() => setActiveSection('dieta')}
                                className="group relative h-64 md:h-96 rounded-2xl overflow-hidden cursor-pointer border border-white/10 hover:border-brand-green/50 transition-all shadow-2xl"
                            >
                                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=1453&auto=format&fit=crop')] bg-cover bg-center opacity-50 group-hover:scale-105 transition-transform duration-700 grayscale group-hover:grayscale-0"></div>
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
                                <div className="absolute bottom-0 left-0 p-8">
                                    <h3 className="text-2xl lg:text-3xl font-display font-black italic uppercase text-white mb-1 group-hover:text-brand-green transition-colors">Nutrição</h3>
                                    <div className="h-1 w-12 bg-white group-hover:bg-brand-green transition-colors rounded-full mb-2"></div>
                                    <p className="text-xs text-gray-400 uppercase tracking-widest font-bold">Ver Cardápio</p>
                                </div>
                            </div>

                            {/* PERFORMANCE Banner */}
                            <div
                                onClick={() => setActiveSection('performance')}
                                className="group relative h-64 md:h-96 rounded-2xl overflow-hidden cursor-pointer border border-white/10 hover:border-brand-green/50 transition-all shadow-2xl"
                            >
                                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1470&auto=format&fit=crop')] bg-cover bg-center opacity-50 group-hover:scale-105 transition-transform duration-700 grayscale group-hover:grayscale-0"></div>
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
                                <div className="absolute bottom-0 left-0 p-8">
                                    <h3 className="text-2xl lg:text-3xl font-display font-black italic uppercase text-white mb-1 group-hover:text-brand-green transition-colors">Performance</h3>
                                    <div className="h-1 w-12 bg-white group-hover:bg-brand-green transition-colors rounded-full mb-2"></div>
                                    <p className="text-xs text-gray-400 uppercase tracking-widest font-bold">Dados Científicos</p>
                                </div>
                            </div>
                        </div>
                    </section>
                </>
            )}

            {/* --- TREINO VIEW --- */}
            {activeSection === 'treino' && (
                <div className="animate-fade-in min-h-screen pb-20">
                    <SectionHeader title="Protocolo de Treino" subtitle="Sua rotina semanal" />

                    <div className="container mx-auto px-4 md:px-12 border-x border-white/5 bg-white/[0.02] min-h-screen pt-8">
                        <div className="flex space-x-6 overflow-x-auto pb-12 scrollbar-hide snap-x snap-mandatory">
                            {getTreino().map((dia, idx) => (
                                <div key={idx} onClick={() => setSelectedWorkout(dia)} className="snap-start flex-none w-80 md:w-96 bg-zinc-900/80 border border-white/10 rounded-2xl overflow-hidden relative group cursor-pointer hover:border-brand-green/50 transition-all duration-300 hover:-translate-y-2">
                                    <div className="h-40 bg-gray-800 relative overflow-hidden">
                                        <div className="absolute inset-0 bg-brand-green/20 mix-blend-overlay z-10"></div>
                                        <img
                                            src={`https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1470&auto=format&fit=crop&sig=${idx}`}
                                            className="w-full h-full object-cover opacity-60 group-hover:scale-110 transition-transform duration-700 grayscale group-hover:grayscale-0"
                                            alt="Treino"
                                        />
                                        <div className="absolute top-4 right-4 z-20 bg-black/80 px-3 py-1 rounded text-xs font-bold text-white border border-white/10">
                                            {dia?.duracao || '45-60 min'}
                                        </div>
                                        <div className="absolute bottom-4 left-4 z-20">
                                            <h3 className="font-display font-black text-2xl text-white italic uppercase leading-none">
                                                {(dia?.dia || 'Treino').split('-')[0]}
                                            </h3>
                                            <p className="text-xs text-brand-green font-bold uppercase tracking-wider">
                                                {(dia?.dia || 'Foco Total').split('-')[1] || 'Foco Total'}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="p-6 space-y-4">
                                        <ul className="space-y-4">
                                            {(dia?.exercicios || []).slice(0, 4).map((ex, i) => (
                                                <li key={i} className="flex justify-between items-center border-b border-white/5 pb-2 last:border-0">
                                                    <div className="pr-2">
                                                        <p className="text-sm font-bold text-gray-200 uppercase leading-tight">{ex?.nome || 'Exercício'}</p>
                                                        <p className="text-[10px] text-gray-500 uppercase mt-1">{ex?.obs || 'Execução Perfeita'}</p>
                                                    </div>
                                                    <div className="flex-shrink-0 w-12 h-12 rounded-full border-2 border-brand-green/30 bg-brand-green/5 flex items-center justify-center p-1 group-hover:border-brand-green transition-colors">
                                                        <span className="text-[10px] font-black text-brand-green text-center leading-none">{ex?.series || '3x10'}</span>
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation(); // Avoid triggering parent click
                                                setSelectedWorkout(dia);
                                            }}
                                            className="w-full py-3 bg-white/5 hover:bg-brand-green hover:text-black border border-white/10 rounded-lg text-xs font-bold uppercase tracking-widest transition-all"
                                        >
                                            Ver Detalhes
                                        </button>
                                    </div>
                                </div>
                            ))}
                            {getTreino().length === 0 && (
                                <div className="text-gray-500 italic p-4">Nenhum treino gerado.</div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* --- DIETA VIEW --- */}
            {activeSection === 'dieta' && (
                <div className="animate-fade-in min-h-screen pb-20">
                    <SectionHeader title="Nutrição Estratégica" subtitle="Combustível para resultado" />

                    <div className="container mx-auto px-4 md:px-12 border-x border-white/5 bg-white/[0.02] min-h-screen pt-8 pb-12">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {getDieta().map((ref, idx) => (
                                <div key={idx} className="bg-black border border-white/10 rounded-2xl p-6 hover:border-brand-green/30 transition-colors group h-full">
                                    <div className="flex justify-between items-start mb-6">
                                        <div className="w-12 h-12 rounded-full bg-brand-gray flex items-center justify-center text-brand-green">
                                            <span className="text-xl">🍽️</span>
                                        </div>
                                        <div className="text-right">
                                            <span className="block text-xs font-bold text-gray-500 uppercase tracking-widest">Opção {idx + 1}</span>
                                            {ref?.calorias && <span className="block text-[10px] font-bold text-brand-green mt-1">{ref.calorias}</span>}
                                        </div>
                                    </div>
                                    <h3 className="text-xl font-bold text-white uppercase mb-4 group-hover:text-brand-green transition-colors">{ref?.refeicao || 'Refeição'}</h3>
                                    <ul className="space-y-4">
                                        {(ref?.opcoes || []).map((op, i) => {
                                            const itemText = typeof op === 'string' ? op : op.item;
                                            const calories = typeof op === 'object' ? op.calorias : null;
                                            return (
                                                <li key={i} className="text-sm text-gray-400 flex flex-col space-y-1 border-l-2 border-white/10 pl-3">
                                                    <span className="leading-tight text-white font-medium">{itemText}</span>
                                                    {calories && <span className="text-[10px] text-brand-green font-bold uppercase tracking-wider">{calories}</span>}
                                                </li>
                                            );
                                        })}
                                    </ul>
                                </div>
                            ))}
                            {getDieta().length === 0 && (
                                <div className="text-gray-500 italic p-4">Nenhuma dieta gerada.</div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* --- PERFORMANCE VIEW --- */}
            {activeSection === 'performance' && (
                <div className="animate-fade-in min-h-screen pb-20">
                    <SectionHeader title="Ciência Aplicada" subtitle="Análise de Métricas" />

                    <div className="container mx-auto px-4 md:px-12 border-x border-white/5 bg-white/[0.02] min-h-screen pt-8 pb-12">
                        <div className="grid md:grid-cols-2 gap-12 items-start">
                            <div className="space-y-6">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="bg-white/5 p-6 rounded-xl border-l-4 border-brand-green">
                                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">TMB Estimada</h3>
                                        <p className="text-xl md:text-2xl font-display font-black text-white">{plan.analiseCientifica?.tmb || 'Calculando...'}</p>
                                    </div>
                                    <div className="bg-white/5 p-6 rounded-xl border-l-4 border-blue-500 overflow-hidden">
                                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Hidratação</h3>
                                        {/* FIX: CSS Overflow handling with flexible wrapper and font sizing */}
                                        <div className="flex flex-col">
                                            <p className="text-xl md:text-2xl font-display font-black text-white">
                                                {plan.analiseCientifica?.hidratacao?.split(' (')[0] || `${(parseFloat(user?.peso || 0) * 0.04).toFixed(1)} Litros`}
                                            </p>
                                            <p className="text-[10px] text-blue-300 font-bold uppercase tracking-wider mt-1 break-words leading-tight">
                                                (Recomendação: 40ml/kg)
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-white/5 p-6 rounded-xl border-l-4 border-white/20">
                                    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">Estratégia Hormonal & Lifestyle</h3>
                                    <p className="text-sm text-gray-300 leading-relaxed">{plan.analiseCientifica?.estrategiaHormonal || 'Análise em andamento...'}</p>
                                </div>
                            </div>

                            {/* Stats Visualization */}
                            <div className="relative bg-black/80 border border-white/10 p-8 rounded-2xl flex flex-col items-center justify-center min-h-[300px]">
                                <div className="absolute inset-0 bg-brand-green/5 blur-[50px] rounded-full"></div>
                                <div className="relative z-10 flex space-x-4 items-end h-40">
                                    <div className="w-8 bg-gray-800 rounded-t h-[60%] animate-pulse"></div>
                                    <div className="w-8 bg-gray-700 rounded-t h-[80%] animate-pulse animation-delay-100"></div>
                                    <div className="w-8 bg-brand-green shadow-[0_0_15px_rgba(0,200,83,0.5)] rounded-t h-[100%]"></div>
                                    <div className="w-8 bg-gray-700 rounded-t h-[70%] animate-pulse animation-delay-200"></div>
                                </div>
                                <p className="relative z-10 mt-6 text-center text-xs text-gray-500 uppercase tracking-widest font-bold">Potencial de Evolução</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Modals placed here to be on top of everything */}

            {/* Workout Details Modal (Netflix Style) */}
            {selectedWorkout && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/80 backdrop-blur-md animate-fade-in"
                        onClick={() => setSelectedWorkout(null)}
                    ></div>

                    {/* Modal Content */}
                    <div className="relative bg-zinc-900 border border-white/10 w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl shadow-black animate-slide-up">
                        <button
                            onClick={() => setSelectedWorkout(null)}
                            className="absolute top-4 right-4 z-50 p-2 bg-black/50 text-white rounded-full hover:bg-white hover:text-black transition-all"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                        </button>

                        <div className="grid md:grid-cols-[1fr_2fr]">
                            {/* Decorative Side (Image) - Visible on md+ */}
                            <div className="hidden md:block relative h-full min-h-[400px]">
                                <img
                                    src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=1470&auto=format&fit=crop"
                                    className="absolute inset-0 w-full h-full object-cover"
                                    alt="Workout Focus"
                                />
                                <div className="absolute inset-0 bg-brand-green/20 mix-blend-multiply"></div>
                                <div className="absolute inset-0 bg-gradient-to-r from-black/0 to-zinc-900"></div>
                            </div>

                            {/* Content Side */}
                            <div className="p-6 md:p-10">
                                <div className="mb-6 md:mb-8">
                                    <div className="flex items-center space-x-3 mb-2">
                                        <span className="px-3 py-1 text-[10px] font-black uppercase text-black bg-brand-green rounded tracking-widest">{selectedWorkout.duracao}</span>
                                        <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Foco do Dia</span>
                                    </div>
                                    <h2 className="text-2xl md:text-5xl font-display font-black italic uppercase leading-tight mb-4 break-words">{selectedWorkout.dia}</h2>
                                    <div className="h-1 w-20 bg-brand-green rounded-full"></div>
                                </div>

                                <div className="space-y-6">
                                    {(selectedWorkout.exercicios || []).map((ex, i) => (
                                        <div key={i} className="group border-b border-white/5 pb-4 last:border-0 hover:border-brand-green/30 transition-colors">
                                            <div className="flex flex-row justify-between items-start mb-2 gap-4">
                                                <div className="flex-1">
                                                    <h3 className="text-lg md:text-xl font-bold text-white uppercase group-hover:text-brand-green transition-colors leading-tight">{ex.nome}</h3>
                                                    <p className="text-sm text-gray-400 mt-1">
                                                        <span className="text-xs uppercase font-bold text-gray-600 mr-2">Dica:</span>
                                                        {ex.obs}
                                                    </p>
                                                </div>
                                                <div className="flex-shrink-0 w-16 h-16 rounded-full border-2 border-brand-green/30 bg-brand-green/5 flex flex-col items-center justify-center p-1 group-hover:border-brand-green group-hover:bg-brand-green/10 transition-all shadow-lg shadow-black/50">
                                                    <span className="text-[9px] text-gray-400 font-bold uppercase leading-none mb-0.5">Séries</span>
                                                    <span className="text-xs md:text-sm font-black text-brand-green text-center leading-none break-all">{ex.series}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-8 pt-6 border-t border-white/10 flex justify-end">
                                    <button
                                        onClick={() => setSelectedWorkout(null)}
                                        className="px-8 py-3 border border-white/20 hover:bg-white hover:text-black hover:border-white text-white font-bold uppercase tracking-widest rounded-lg transition-all text-sm"
                                    >
                                        Fechar Detalhes
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Profile Summary Modal */}
            {showProfile && (
                <div className="fixed inset-0 z-50 flex justify-end">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
                        onClick={() => setShowProfile(false)}
                    ></div>

                    {/* Side Panel */}
                    <div className="relative w-full max-w-md bg-brand-dark/95 border-l border-white/10 h-full overflow-y-auto shadow-2xl animate-slide-up md:animate-slide-left p-6 md:p-10">
                        <button
                            onClick={() => setShowProfile(false)}
                            className="absolute top-6 right-6 p-2 text-gray-400 hover:text-white transition-colors"
                        >
                            Esc <span className="sr-only">Fechar</span>
                        </button>

                        <div className="mb-10 text-center">
                            <div className="w-24 h-24 mx-auto bg-gray-800 rounded-full border-2 border-brand-green flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(0,200,83,0.3)]">
                                <span className="text-4xl font-black text-brand-green">{user?.nome ? user.nome.charAt(0).toUpperCase() : 'U'}</span>
                            </div>
                            <h2 className="text-2xl font-display font-black italic uppercase text-white">{user?.nome}</h2>
                            <p className="text-xs font-bold text-brand-green uppercase tracking-widest mt-1">Ficha do Atleta</p>
                        </div>

                        <div className="space-y-8">
                            <div>
                                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4 border-b border-white/10 pb-2">Dados Corporais</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-white/5 p-4 rounded-xl">
                                        <p className="text-[10px] text-gray-400 uppercase">Idade</p>
                                        <p className="text-lg font-bold text-white">{user?.idade} anos</p>
                                    </div>
                                    <div className="bg-white/5 p-4 rounded-xl">
                                        <p className="text-[10px] text-gray-400 uppercase">Peso</p>
                                        <p className="text-lg font-bold text-white">{user?.peso}kg</p>
                                    </div>
                                    <div className="bg-white/5 p-4 rounded-xl">
                                        <p className="text-[10px] text-gray-400 uppercase">Altura</p>
                                        <p className="text-lg font-bold text-white">{user?.altura}m</p>
                                    </div>
                                    <div className="bg-white/5 p-4 rounded-xl">
                                        <p className="text-[10px] text-gray-400 uppercase">TMB (Est.)</p>
                                        <p className="text-lg font-bold text-brand-green">{plan?.analiseCientifica?.tmb || '-'}</p>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4 border-b border-white/10 pb-2">Objetivo & Histórico</h3>
                                <div className="space-y-3">
                                    <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                                        <p className="text-[10px] text-gray-400 uppercase mb-1">Objetivo Principal</p>
                                        <p className="text-white font-medium">{user?.objetivo}</p>
                                    </div>
                                    <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                                        <p className="text-[10px] text-gray-400 uppercase mb-1">Experiência</p>
                                        <p className="text-white font-medium">{user?.nivelTreino}</p>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4 border-b border-white/10 pb-2">Saúde & Restrições</h3>
                                <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl space-y-3">
                                    <div>
                                        <p className="text-[10px] text-red-400 uppercase font-bold">Lesões / Dores</p>
                                        <p className="text-sm text-gray-300">{user?.dores === 'Sim' ? user?.ondeDores : 'Nenhuma relatada'}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-red-400 uppercase font-bold">Restrições Alimentares</p>
                                        <p className="text-sm text-gray-300">{user?.restricoesAlimentares === 'Sim' ? user?.quaisRestricoes : 'Nenhuma relatada'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Footer */}
            <footer className="py-8 text-center text-gray-600 text-xs font-bold uppercase tracking-[0.2em] border-t border-white/5">
                Powered by #TEAMTAVARES AI
            </footer>
        </div>
    );
};

export default Dashboard;
