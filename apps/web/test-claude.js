const Anthropic = require('@anthropic-ai/sdk');

// Cole sua chave aqui quando tiver
const apiKey = process.env.ANTHROPIC_API_KEY || "COLE_SUA_CHAVE_AQUI";

console.log(`🔑 Testando Claude API...`);

const anthropic = new Anthropic({
    apiKey: apiKey,
});

(async () => {
    try {
        console.log("Enviando prompt de teste...");
        const message = await anthropic.messages.create({
            model: "claude-3-5-sonnet-20241022",
            max_tokens: 100,
            messages: [{
                role: "user",
                content: "Responda apenas: Olá, estou funcionando perfeitamente!"
            }]
        });

        const response = message.content[0].type === 'text' ? message.content[0].text : '';
        console.log("✅ SUCESSO! Resposta:", response);
        console.log("\n🎉 Claude API está funcionando perfeitamente!");
    } catch (e) {
        console.log("❌ ERRO:", e.message);
        console.log("\nVerifique se:");
        console.log("1. A chave API está correta");
        console.log("2. Você tem créditos disponíveis na conta Anthropic");
        console.log("3. A chave tem permissões corretas");
    }
})();
