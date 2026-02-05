import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { generateFitnessPlan } from '../services/aiService';
import { useAuth } from '../contexts/AuthContext';
import { userService } from '../services/userService';

const Anamnese = () => {
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(0);
    const [isGenerating, setIsGenerating] = useState(false);
    const [formData, setFormData] = useState({
        nome: '',
        idade: '',
        sexo: '',
        altura: '',
        peso: '',
        cidade: '',
        objetivo: '',
        tentouAntes: '',
        oQueTentou: '',
        doencas: '',
        quaisDoencas: '',
        medicamentos: '',
        quaisMedicamentos: '',
        dores: '',
        ondeDores: '',
        liberadoMedico: '',
        horasSono: '',
        estresse: '',
        trabalho: '',
        praticaExercicio: '',
        qualExercicio: '',
        frequenciaExercicio: '',
        alimentacaoHoje: '',
        refeicoesDia: '',
        restricoesAlimentares: '',
        quaisRestricoes: '',
        intolerancias: '',
        alcool: '',
        agua: '',
        comprometimento: '',
        dispostoSeguir: '',
        observacoes: '',
        orcamento: '',
        horarioTreino: '',
        nivelTreino: ''
    });

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const steps = [
        // Step 1: Dados Pessoais
        {
            title: "QUEM É VOCÊ?",
            subtitle: "Vamos construir a sua melhor versão.",
            questions: [
                { type: 'text', label: 'Nome completo', field: 'nome' },
                { type: 'number', label: 'Idade', field: 'idade' },
                { type: 'radio', label: 'Sexo', field: 'sexo', options: ['Feminino', 'Masculino', 'Outro'] },
                { type: 'text', label: 'Altura (ex: 1.70)', field: 'altura' },
                { type: 'number', label: 'Peso atual (kg)', field: 'peso' },
                { type: 'text', label: 'Cidade/Estado', field: 'cidade' },
            ]
        },
        // Step 2: Objetivo
        {
            title: "O OBJETIVO",
            subtitle: "Onde você quer chegar nos próximos 20 dias?",
            questions: [
                { type: 'radio', label: 'Qual é o foco principal?', field: 'objetivo', options: ['Emagrecimento', 'Ganho de massa muscular'] },
                { type: 'radio', label: 'Já tentou isso antes?', field: 'tentouAntes', options: ['Sim', 'Não'] },
                { type: 'text', label: 'Se sim, o que fez?', field: 'oQueTentou', condition: (data) => data.tentouAntes === 'Sim' },
            ]
        },
        // Step 3: Saúde
        {
            title: "RAIO-X DE SAÚDE",
            subtitle: "Segurança em primeiro lugar.",
            questions: [
                { type: 'radio', label: 'Alguma doença diagnosticada?', field: 'doencas', options: ['Não', 'Sim'] },
                { type: 'text', label: 'Qual(is)?', field: 'quaisDoencas', condition: (data) => data.doencas === 'Sim' },
                { type: 'radio', label: 'Toma medicamentos contínuos?', field: 'medicamentos', options: ['Não', 'Sim'] },
                { type: 'text', label: 'Qual(is)?', field: 'quaisMedicamentos', condition: (data) => data.medicamentos === 'Sim' },
                { type: 'radio', label: 'Sente dores ou tem lesões?', field: 'dores', options: ['Não', 'Sim'] },
                { type: 'text', label: 'Onde?', field: 'ondeDores', condition: (data) => data.dores === 'Sim' },
                { type: 'radio', label: 'Liberado(a) por médico para treinar?', field: 'liberadoMedico', options: ['Sim', 'Não'] },
            ]
        },
        // Step 4: Rotina
        {
            title: "ROTINA & DESCanso",
            subtitle: "O resultado vem da consistência.",
            questions: [
                { type: 'radio', label: 'Horas de sono por noite:', field: 'horasSono', options: ['Menos de 6h', '6–7h', '7–8h', 'Mais de 8h'] },
                { type: 'radio', label: 'Qual horário prefere treinar?', field: 'horarioTreino', options: ['Manhã', 'Tarde', 'Noite'] },
                { type: 'radio', label: 'Nível de estresse:', field: 'estresse', options: ['Baixo', 'Moderado', 'Alto'] },
                { type: 'radio', label: 'Rotina de trabalho:', field: 'trabalho', options: ['Sentado(a)', 'Em pé', 'Alternando'] },
            ]
        },
        // Step 5: Experiência
        {
            title: "EXPERIÊNCIA",
            subtitle: "Seu histórico de batalha.",
            questions: [
                { type: 'radio', label: 'Como você considera seu nível de treino?', field: 'nivelTreino', options: ['Iniciante', 'Intermediário', 'Avançado'] },
                { type: 'radio', label: 'Treina atualmente?', field: 'praticaExercicio', options: ['Não', 'Sim'] },
                { type: 'text', label: 'O que você faz?', field: 'qualExercicio', condition: (data) => data.praticaExercicio === 'Sim' },
                { type: 'radio', label: 'Frequência semanal:', field: 'frequenciaExercicio', options: ['1–2x', '3–4x', '5x ou mais'] },
            ]
        },
        // Step 6: Nutrição
        {
            title: "NUTRIÇÃO",
            subtitle: "O combustível do sucesso.",
            questions: [
                { type: 'radio', label: 'Qualidade da alimentação hoje:', field: 'alimentacaoHoje', options: ['Ruim', 'Regular', 'Boa'] },
                { type: 'radio', label: 'Refeições por dia:', field: 'refeicoesDia', options: ['2–3', '4–5', '6 ou mais'] },
                { type: 'radio', label: 'Restrições alimentares?', field: 'restricoesAlimentares', options: ['Não', 'Sim'] },
                { type: 'text', label: 'Quais?', field: 'quaisRestricoes', condition: (data) => data.restricoesAlimentares === 'Sim' },
                { type: 'text', label: 'Intolerâncias/Alergias:', field: 'intolerancias' },
                { type: 'radio', label: 'Consumo de álcool:', field: 'alcool', options: ['Não', 'Raramente', 'Frequentemente'] },
                { type: 'radio', label: 'Consumo de água:', field: 'agua', options: ['Menos de 1L', '1–2L', 'Mais de 2L'] },
            ]
        },
        // Step 7: Finalização
        {
            title: "COMPROMISSO",
            subtitle: "Estamos quase lá.",
            questions: [
                { type: 'radio', label: 'Investimento mensal disponível:', field: 'orcamento', options: ['Baixo (R$ 300 - R$ 600)', 'Médio (R$ 600 - R$ 1.000)', 'Alto (Acima de R$ 1.000)'] },
                { type: 'radio', label: 'Comprometimento (0-10):', field: 'comprometimento', options: ['0–4', '5–7', '8–10'] },
                { type: 'radio', label: 'Vai seguir o plano?', field: 'dispostoSeguir', options: ['Sim', 'Com adaptações', 'Não'] },
                { type: 'textarea', label: 'Algo mais que eu deva saber?', field: 'observacoes' },
            ]
        }
    ];

    const currentQuestions = steps[currentStep].questions.filter(q => !q.condition || q.condition(formData));
    const progress = ((currentStep + 1) / steps.length) * 100;

    const { user, loading: authLoading } = useAuth();

    // Allow rendering but block "Next" if auth is loading? 
    // Actually Anamnese is public-ish but needs user to save.
    // We can let them fill it out, and just check user availability at the end.
    // But to be safe, if we need user ID, let's wait or handle it.

    const handleNext = async () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(prev => prev + 1);
            window.scrollTo(0, 0);
        } else {
            setIsGenerating(true);
            try {
                if (authLoading) {
                    alert("Aguarde a verificação de autenticação...");
                    setIsGenerating(false);
                    return;
                }

                if (!user) {
                    alert('Erro de autenticação. Por favor, faça login novamente.');
                    navigate('/');
                    setIsGenerating(false);
                    return;
                }

                const plan = await generateFitnessPlan(formData);

                // SAVE TO DB
                if (user) {
                    await userService.saveAnamnese(user.id, formData);
                    await userService.savePlan(user.id, plan);
                }

                navigate('/dashboard', { state: { plan, user: formData } });
            } catch (error) {
                console.error('Erro:', error);
                alert(`Erro: ${error.message}. Tente novamente.`);
            } finally {
                setIsGenerating(false);
            }
        }
    };

    const handleBack = () => {
        if (currentStep > 0) setCurrentStep(prev => prev - 1);
    };

    if (isGenerating) {
        return (
            <div className="min-h-screen bg-brand-dark flex flex-col items-center justify-center p-4 text-center font-sans">
                <div className="relative w-32 h-32 mb-8">
                    {/* Ring glow */}
                    <div className="absolute inset-0 bg-brand-green/20 rounded-full blur-xl animate-pulse"></div>
                    <div className="absolute inset-0 rounded-full border-4 border-gray-800"></div>
                    <div className="absolute inset-0 rounded-full border-4 border-t-brand-green border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
                    {/* Logo/Icon center */}
                    {/* Logo/Icon center */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <img src="https://joaotavarestreinador.my.canva.site/_assets/media/6c23a5114e94f984ad95afa59dd2fa38.png" className="w-16 opacity-80" alt="Loading" />
                    </div>
                </div>
                <h2 className="text-3xl font-display font-black text-white italic uppercase tracking-tighter mb-4">
                    PROCESSANDO DADOS
                </h2>
                <p className="text-gray-400 max-w-md text-sm uppercase tracking-widest animate-pulse">
                    Nossa IA está desenhando seu plano de elite...
                </p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-brand-dark text-white font-sans flex flex-col relative overflow-x-hidden selection:bg-brand-green selection:text-black">

            {/* Ambient Background */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-green/5 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-brand-gray/20 rounded-full blur-[120px]"></div>
            </div>

            {/* Navbar Simple */}
            <div className="relative z-10 w-full p-6 flex justify-between items-center border-b border-white/5 bg-black/20 backdrop-blur-md">
                <img src="https://joaotavarestreinador.my.canva.site/_assets/media/6c23a5114e94f984ad95afa59dd2fa38.png" alt="#TEAMTAVARES" className="h-8 md:h-10" />
                <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-widest text-gray-500">
                    <span>Fase {currentStep + 1}</span>
                    <span className="text-gray-700">/</span>
                    <span>{steps.length}</span>
                </div>
            </div>

            {/* Main Content */}
            <div className="relative z-10 flex-1 flex flex-col max-w-3xl mx-auto w-full p-6 md:p-12">

                {/* Progress Bar */}
                <div className="w-full h-1 bg-gray-800 rounded-full mb-12 overflow-hidden">
                    <div
                        className="h-full bg-brand-green shadow-[0_0_10px_rgba(0,200,83,0.5)] transition-all duration-500 ease-out"
                        style={{ width: `${progress}%` }}
                    ></div>
                </div>

                {/* Question Header */}
                <div className="mb-10 animate-fade-in">
                    <h1 className="font-display text-4xl md:text-5xl font-black italic uppercase tracking-tighter text-white mb-2">
                        {steps[currentStep].title}
                    </h1>
                    <p className="text-gray-400 text-sm md:text-base font-medium uppercase tracking-wide">
                        {steps[currentStep].subtitle}
                    </p>
                </div>

                {/* Questions Form */}
                <div className="space-y-8 animate-slide-up">
                    {currentQuestions.map((q, idx) => (
                        <div key={idx} className="group">
                            <label className="block text-xs font-bold uppercase text-brand-green tracking-wider mb-3">
                                {q.label}
                            </label>

                            {q.type === 'text' || q.type === 'number' ? (
                                <input
                                    type={q.type}
                                    value={formData[q.field] || ''}
                                    placeholder="DIGITE AQUI..."
                                    onChange={(e) => handleChange(q.field, e.target.value)}
                                    className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-4 text-white placeholder-gray-700 focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green transition-all"
                                />
                            ) : q.type === 'textarea' ? (
                                <textarea
                                    value={formData[q.field] || ''}
                                    placeholder="ESCREVA AQUI..."
                                    onChange={(e) => handleChange(q.field, e.target.value)}
                                    className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-4 text-white placeholder-gray-700 focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green transition-all h-32 resize-none"
                                />
                            ) : q.type === 'radio' ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {q.options.map((opt) => (
                                        <label key={opt} className={`cursor-pointer relative overflow-hidden group`}>
                                            <input
                                                type="radio"
                                                name={q.field}
                                                value={opt}
                                                checked={formData[q.field] === opt}
                                                onChange={(e) => handleChange(q.field, e.target.value)}
                                                className="peer sr-only"
                                            />
                                            <div className="w-full p-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all peer-checked:border-brand-green peer-checked:bg-brand-green/10 peer-checked:shadow-[0_0_15px_rgba(0,200,83,0.1)]">
                                                <span className="text-gray-300 font-medium peer-checked:text-white peer-checked:font-bold uppercase text-sm tracking-wide">
                                                    {opt}
                                                </span>
                                            </div>
                                        </label>
                                    ))}
                                </div>
                            ) : null}
                        </div>
                    ))}
                </div>

                {/* Navigation Buttons */}
                <div className="flex items-center justify-between mt-16 pt-8 border-t border-white/5">
                    <button
                        onClick={handleBack}
                        disabled={currentStep === 0}
                        className={`px-6 py-3 text-sm font-bold uppercase tracking-wider transition-colors ${currentStep === 0 ? 'opacity-0 pointer-events-none' : 'text-gray-500 hover:text-white'
                            }`}
                    >
                        Voltar
                    </button>

                    <button
                        onClick={handleNext}
                        className="bg-brand-green hover:bg-green-400 text-black font-black uppercase tracking-widest py-4 px-10 rounded-xl shadow-lg shadow-brand-green/20 hover:shadow-brand-green/40 hover:-translate-y-1 transition-all"
                    >
                        {currentStep === steps.length - 1 ? 'GERAR PLANO ⚡️' : 'PRÓXIMO'}
                    </button>
                </div>

            </div>
        </div>
    );
};

export default Anamnese;
