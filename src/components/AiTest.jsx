import React, { useEffect, useState } from 'react';
import { generateFitnessPlan } from '../services/aiService';

const AiTest = () => {
    const [status, setStatus] = useState('Idle');
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);

    const mockUser = {
        nome: 'Debug User',
        idade: '35',
        sexo: 'Feminino',
        altura: '1.65',
        peso: '80',
        objetivo: 'Emagrecimento',
        tentouAntes: 'Sim',
        oQueTentou: 'Dieta cetogênica, mas falhei',
        doencas: 'Sim',
        quaisDoencas: 'Resistência à Insulina',
        medicamentos: 'Não',
        dores: 'Sim',
        ondeDores: 'Joelho direito (condromalácia)',
        liberadoMedico: 'Sim',
        horasSono: 'Menos de 6h', // Test hormonal logic
        estresse: 'Alto', // Test cortisol logic
        trabalho: 'Sentado(a)',
        praticaExercicio: 'Não',
        alimentacaoHoje: 'Ruim',
        refeicoesDia: '2–3',
        restricoesAlimentares: 'Não',
        orcamento: 'Baixo (R$ 300 - R$ 600)', // Test budget logic
        comprometimento: '8'
    };

    useEffect(() => {
        const runTest = async () => {
            setStatus('Running AI Request...');
            try {
                const plan = await generateFitnessPlan(mockUser);
                setResult(plan);
                setStatus('Success');
            } catch (err) {
                console.error(err);
                setError(err.message + (err.stack ? '\n' + err.stack : ''));
                setStatus('Failed');
            }
        };

        runTest();
    }, []);

    return (
        <div className="p-10 bg-gray-900 text-white min-h-screen font-mono">
            <h1 className="text-2xl font-bold mb-4">AI Integration Diagnostic</h1>

            <div className="mb-6 p-4 border border-gray-700 rounded">
                <h2 className="text-xl mb-2">Status: <span className={status === 'Success' ? 'text-green-400' : status === 'Failed' ? 'text-red-400' : 'text-blue-400'}>{status}</span></h2>
            </div>

            {error && (
                <div className="mb-6 p-4 bg-red-900/50 border border-red-500 rounded text-red-200 whitespace-pre-wrap">
                    <h3 className="font-bold mb-2">Error Details:</h3>
                    {error}
                </div>
            )}

            {result && (
                <div className="p-4 bg-green-900/20 border border-green-500 rounded">
                    <h3 className="font-bold mb-2 text-green-400">Success! Generated JSON:</h3>
                    <pre className="text-xs overflow-auto max-h-[500px]">
                        {JSON.stringify(result, null, 2)}
                    </pre>
                </div>
            )}

            <div className="mt-8">
                <h3 className="font-bold mb-2 text-gray-400">Mock Data Used:</h3>
                <pre className="text-xs text-gray-500">
                    {JSON.stringify(mockUser, null, 2)}
                </pre>
            </div>
        </div>
    );
};

export default AiTest;
