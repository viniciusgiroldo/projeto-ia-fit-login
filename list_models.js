import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load env vars
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '.env') });

const API_KEY = process.env.VITE_GEMINI_API_KEY;

if (!API_KEY) {
    console.error("❌ API Key not found in .env");
    process.exit(1);
}

const listModels = async () => {
    try {
        const genAI = new GoogleGenerativeAI(API_KEY);
        // There isn't a direct listModels method on the client instance in some versions,
        // but we can try to infer or use the model endpoint if supported.
        // Actually, the error message SUGGESTS calling ListModels. 
        // In the Node SDK, this is often done via a different manager or valid request.
        // Let's try to just instantiate a model and catch the error, OR use the API key to fetch via fetch/axios directly to the REST endpoint which is often more reliable for debugging "what do I have access to".

        console.log("🔍 Querying Google AI API for available models...");

        // Using direct REST call to listing endpoint to be sure
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`);
        const data = await response.json();

        if (data.models) {
            console.log("\n✅ MODELS AVAILABLE FOR YOUR KEY:");
            data.models.forEach(m => {
                if (m.supportedGenerationMethods && m.supportedGenerationMethods.includes('generateContent')) {
                    console.log(`- ${m.name.replace('models/', '')} (Supported)`);
                } else {
                    console.log(`- ${m.name} (Not for content generation)`);
                }
            });
        } else {
            console.error("❌ No models returned. Response:", data);
        }

    } catch (error) {
        console.error("❌ Error listing models:", error);
    }
};

listModels();
