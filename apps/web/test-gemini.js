const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require('fs');
const path = require('path');

// Carregar .env.local
const envPath = path.join(__dirname, '.env.local');
let apiKey = "";

try {
    const envContent = fs.readFileSync(envPath, 'utf8');
    const match = envContent.match(/GEMINI_API_KEY=([^\r\n]+)/);
    if (match) {
        apiKey = match[1].trim();
        // Remover aspas manuais se existirem e nao foram removidas pelo regex (que pega tudo ate quebra de linha)
        if ((apiKey.startsWith('"') && apiKey.endsWith('"')) || (apiKey.startsWith("'") && apiKey.endsWith("'"))) {
            apiKey = apiKey.slice(1, -1);
        }
    }
} catch (e) {
    console.error("Erro lendo arquivo:", e.message);
}

if (!apiKey) {
    console.log("CHAVE NAO ENCONTRADA");
    process.exit(1);
}

console.log(`Chave Lida (Length: ${apiKey.length}): [${apiKey.substring(0, 3)}...${apiKey.slice(-3)}]`);

const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

(async () => {
    try {
        console.log("Enviando prompt...");
        const result = await model.generateContent("Oi");
        console.log("Resposta:", result.response.text());
    } catch (e) {
        if (e.message.includes("API key not valid")) {
            console.log("❌ ERRO: Chave rejeitada pelo Google (400 Bad Request).");
        } else {
            console.log("ERRO GEMINI:", e.toString());
        }
    }
})();
