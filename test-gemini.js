const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require('fs');
const path = require('path');

// Carregar .env.local na unha
const envPath = path.join('apps', 'web', '.env.local');
let apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
    try {
        const envContent = fs.readFileSync(envPath, 'utf8');
        const match = envContent.match(/GEMINI_API_KEY=([^\r\n]+)/);
        if (match) {
            apiKey = match[1].trim();
        }
    } catch (e) {
        console.error("Erro lendo .env.local", e.message);
    }
}

if (!apiKey) {
    console.error("❌ GEMINI_API_KEY não encontrada.");
    process.exit(1);
}

console.log(`🔑 Testando chave: ${apiKey.substring(0, 5)}...${apiKey.substring(apiKey.length - 4)}`);

const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

async function run() {
    try {
        const prompt = "Diga 'Olá, Astros!' se estiver me ouvindo.";
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        console.log("✅ Resposta da IA:", text);
    } catch (error) {
        console.error("❌ Erro na API Gemini:", error.message);
    }
}

run();
