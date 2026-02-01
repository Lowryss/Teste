const { GoogleGenerativeAI } = require("@google/generative-ai");

// Usar a chave diretamente
const apiKey = "AIzaSyCFOsdoBOh3FnNvsSYoetMGf8k2e--bwps";

console.log(`Testando chave: ${apiKey.substring(0, 10)}...${apiKey.slice(-5)}`);

const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

(async () => {
    try {
        console.log("Enviando prompt de teste...");
        const result = await model.generateContent("Responda apenas: OK");
        const response = result.response;
        const text = response.text();
        console.log("✅ SUCESSO! Resposta:", text);
    } catch (e) {
        console.log("❌ ERRO:", e.message);
        if (e.response) {
            console.log("Detalhes:", JSON.stringify(e.response, null, 2));
        }
    }
})();
