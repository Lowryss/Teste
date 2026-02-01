const { GoogleGenerativeAI } = require("@google/generative-ai");

// Testar a NOVA chave
const apiKey = "AIzaSyBoULplv0RfJlpUs9oReaa9AvK1odP4d18";

console.log(`🔑 Testando NOVA chave: ${apiKey.substring(0, 10)}...${apiKey.slice(-5)}`);

const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

(async () => {
    try {
        console.log("Enviando prompt de teste...");
        const result = await model.generateContent("Responda apenas: OK");
        const response = result.response;
        const text = response.text();
        console.log("✅ SUCESSO! Resposta:", text);
        console.log("\n🎉 A chave está funcionando perfeitamente!");
    } catch (e) {
        console.log("❌ ERRO:", e.message);
        console.log("\nDetalhes completos do erro:");
        console.log(e);
    }
})();
