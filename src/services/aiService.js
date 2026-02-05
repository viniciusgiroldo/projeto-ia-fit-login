import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the API with the key (will be set in .env)
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

export const generateFitnessPlan = async (userData) => {
  console.log("🚀 Iniciando geração de plano...");

  if (!API_KEY) {
    console.error("❌ API Key não encontrada! Verifique o arquivo .env");
    throw new Error("Chave de API não configurada. Verifique o console.");
  }
  console.log("✅ API Key detectada:", API_KEY.substring(0, 5) + "...");

  const modelsToTry = ["gemini-2.0-flash", "gemini-flash-latest"];
  let lastError = null;

  const prompt = `
    # CONTEXTO
    Você é o TREINADOR #TEAMTAVARES. Um especialista de elite em Bodybuilding, Musculação e Alta Performance e Nutrição Esportiva.
    Seu foco NÃO é "fitness genérico".Seu foco é RESULTADO ESTÉTICO E FORÇA(Musculação).
    O aluno vai treinar em ACADEMIA(Musculação), a menos que deixe explícito que não pode.

    # DADOS DO ALUNO(Anamnese)
  Nome: ${userData.nome}
  Idade: ${userData.idade}
  Sexo: ${userData.sexo}
  Altura: ${userData.altura}
  Peso: ${userData.peso} kg
  Objetivo: ${userData.objetivo}
  Experiência: ${userData.tentouAntes === 'Sim' ? 'Já tentou antes: ' + userData.oQueTentou : 'Iniciante'}
    
    # SAÚDE E LIMITAÇÕES(CRÍTICO)
  Doenças: ${userData.doencas === 'Sim' ? userData.quaisDoencas : 'Nenhuma'}
  Medicamentos: ${userData.medicamentos === 'Sim' ? userData.quaisMedicamentos : 'Nenhum'}
  Lesões / Dores: ${userData.dores === 'Sim' ? userData.ondeDores : 'Nenhuma'} (SE HOUVER DOR, NÃO PASSE EXERCÍCIOS QUE AGRAVEM A REGIÃO, MAS SUBSTITUA POR VARIANTES SEGURAS NA MUSCULAÇÃO)
    Liberado por médico: ${userData.liberadoMedico}

    # ESTILO DE VIDA
  Sono: ${userData.horasSono}
  Estresse: ${userData.estresse}
  Trabalho: ${userData.trabalho}
    Atividade Atual: ${userData.praticaExercicio === 'Sim' ? userData.qualExercicio : 'Sedentário'}
    Alimentação Atual: ${userData.alimentacaoHoje} (${userData.refeicoesDia} refeições / dia)
    Restrições Alimentares: ${userData.restricoesAlimentares === 'Sim' ? userData.quaisRestricoes : 'Nenhuma'}
  Intolerâncias: ${userData.intolerancias || 'Nenhuma'}
    Orçamento para Dieta: ${userData.orcamento || 'Não informado'} (Use alimentos base da musculação: Arroz, Frango, Ovos, Whey, Aveia, dependendo do orçamento)
  Horário de Treino: ${userData.horarioTreino || 'Não informado'} (Ajuste pré/pós treino conforme este horário)
  Nível de Treino: ${userData.nivelTreino || 'Não informado'} (Adapte o volume e complexidade do treino para este nível)
  Comprometimento: ${userData.comprometimento}/10

    # CIÊNCIA E FISIOLOGIA(Analise Profunda)
  1. Calcule a Taxa Metabólica Basal(TMB) e o Gasto Calórico Total.
  2. Defina os Macros para o objetivo(ex: Hipertrofia = 2g / kg proteina; Deficit = proteina alta, carbo moderado / baixo).
  3. Hidratação: OBRIGATÓRIO calcular: Peso do aluno * 40ml. (Ex: 80kg * 40ml = 3.2 Litros).
  4. Hormônios: Se estresse alto ou sono ruim, sugira fitoterápicos naturais comuns(ex: Ashwagandha, Magnésio - APENAS SUGESTÃO) ou estratégias de higiene do sono.

    # DIRETRIZES TÉCNICAS(TREINO - MUSCULAÇÃO)
  1. O treino DEVE SER DE MUSCULAÇÃO(Splits: A / B, A / B / C ou A / B / C / D).
  2. Nada de "Polichinelos" ou "Caminhada no lugar" como exercício principal.
  3. Use nomes técnicos: "Supino Inclinado com Halteres", "Leg Press 45", "Puxada Alta", "Elevação Lateral".
  4. Indique Séries e Repetições(ex: 4x 10 - 12, 3x 15 falha).
  5. Se o aluno for iniciante, foque em adaptação e execução.Se avançado, use técnicas(Drop - set, Rest - pause).

    # FORMATO DE SAÍDA(OBRIGATÓRIO - JSON)
    Responda APENAS com um JSON válido.
    {
    "nomePlano": "Nome Impactante (ex: Protocolo Hypertrophy 20D)",
      "resumoMotivacional": "Texto curto, direto e motivador estilo 'treinador exigente'.",
        "analiseCientifica": {
      "tmb": "XXXX kcal",
        "hidratacao": "X.X Litros (Recomendação: 40ml/kg)",
        "estrategiaHormonal": "Explicação técnica e direta."
    },
    "treino": [
      {
        "dia": "Treino A - Peitoral e Tríceps (Foco em Carga)",
        "duracao": "50-60 min",
        "exercicios": [
          { "nome": "Supino Reto (Barra ou Halter)", "series": "4x 8-10", "obs": "Controle a descida (3seg)" }
        ]
      },
      ... (Gere a divisão correta para 20 dias ou ciclo semanal)
    ],
      "dieta": [
        {
          "refeicao": "Café da Manhã",
          "opcoes": [
            { "item": "3 Ovos Inteiros", "calorias": "210 kcal" },
            { "item": "50g Queijo Minas", "calorias": "120 kcal" }
             // Gere sempre mostrando as calorias de CADA item individualmente
          ]
        },
        ... (Gere Cafe, Almoço, Lanche, Jantar - SEM horários fixos, apenas a ordem)
      ]
  }
  `;

  for (const modelName of modelsToTry) {
    try {
      console.log(`🔄 Tentando modelo: ${modelName}...`);
      const genAI = new GoogleGenerativeAI(API_KEY);
      const model = genAI.getGenerativeModel({ model: modelName });

      console.log("📩 Enviando prompt...");
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      console.log(`📥 Resposta recebida com ${modelName}!`);

      // Robust JSON extraction: Find the first '{' and last '}'
      const firstBrace = text.indexOf('{');
      const lastBrace = text.lastIndexOf('}');

      let cleanedText = text;
      if (firstBrace !== -1 && lastBrace !== -1) {
        cleanedText = text.substring(firstBrace, lastBrace + 1);
      }

      // Sanitize JSON: Remove common issues
      cleanedText = cleanedText
        // Remove JavaScript-style comments (// ...)
        .replace(/\/\/.*$/gm, '')
        // Remove multi-line comments (/* ... */)
        .replace(/\/\*[\s\S]*?\*\//g, '')
        // Remove trailing commas before ] or }
        .replace(/,(\s*[}\]])/g, '$1')
        // Fix common issues with newlines in strings
        .trim();

      try {
        const json = JSON.parse(cleanedText);
        console.log("✨ JSON parseado com sucesso!");
        return json; // Success! Return immediately.
      } catch (parseError) {
        console.error(`❌ Erro de JSON com ${modelName}:`, parseError);
        console.error(`Texto problemático (primeiros 500 chars):`, cleanedText.substring(0, 500));
        lastError = parseError;
      }

    } catch (apiError) {
      console.warn(`⚠️ Falha com modelo ${modelName}:`, apiError.message);
      lastError = apiError;
      // Continue to next model in loop
    }
  }

  // If loop finishes without returning, throw the last error
  console.error("❌ Todos os modelos falharam.");
  throw lastError || new Error("Falha ao gerar plano com todos os modelos disponíveis. Tente novamente mais tarde.");
};
