const Anthropic = require('@anthropic-ai/sdk');

const apiKey = "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";

console.log(`🔑 Testando Claude API com a chave fornecida...`);

const anthropic = new Anthropic({
    apiKey: apiKey,
});

(async () => {
    try {
        console.log("📡 Enviando prompt de teste...");
        const message = await anthropic.messages.create({
            model: "claude-3-5-sonnet-20241022",
            max_tokens: 100,
            messages: [{
                role: "user",
                content: "Responda apenas: Olá! Estou funcionando perfeitamente para o Guia do Coração! ✨"
            }]
        });

        const response = message.content[0].type === 'text' ? message.content[0].text : '';
        console.log("\n✅ SUCESSO TOTAL! Resposta do Claude:");
        console.log("━".repeat(60));
        console.log(response);
        console.log("━".repeat(60));
        console.log("\n🎉 Claude API está 100% FUNCIONAL!");
        console.log("🚀 Seu Tarot e Numerologia agora têm IA de verdade!");
    } catch (e) {
        console.log("\n❌ ERRO:", e.message);
        console.log("\nDetalhes:", e);
    }
})();
