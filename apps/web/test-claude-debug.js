const Anthropic = require('@anthropic-ai/sdk');

const apiKey = "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";

console.log(`🔑 Testando Claude API...`);

const anthropic = new Anthropic({
    apiKey: apiKey,
});

(async () => {
    try {
        console.log("📡 Enviando prompt...");
        const message = await anthropic.messages.create({
            model: "claude-3-5-sonnet-20241022",
            max_tokens: 50,
            messages: [{
                role: "user",
                content: "Oi"
            }]
        });

        console.log("\n✅ SUCESSO!");
        console.log(message.content[0].text);
    } catch (e) {
        console.log("\n❌ ERRO COMPLETO:");
        console.log("Tipo:", e.constructor.name);
        console.log("Mensagem:", e.message);
        console.log("Status:", e.status);

        if (e.message && e.message.includes('credit')) {
            console.log("\n💳 PROBLEMA: Conta sem créditos!");
            console.log("Solução: Adicione um método de pagamento em:");
            console.log("https://console.anthropic.com/settings/billing");
        }
    }
})();
