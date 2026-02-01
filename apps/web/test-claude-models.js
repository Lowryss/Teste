const Anthropic = require('@anthropic-ai/sdk');

const apiKey = "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";

console.log(`🔑 Testando Claude API com modelo básico...`);

const anthropic = new Anthropic({
    apiKey: apiKey,
});

(async () => {
    try {
        console.log("📡 Testando modelo claude-3-haiku-20240307...");
        const message = await anthropic.messages.create({
            model: "claude-3-haiku-20240307",
            max_tokens: 100,
            messages: [{
                role: "user",
                content: "Diga: Olá! Estou funcionando!"
            }]
        });

        const response = message.content[0].type === 'text' ? message.content[0].text : '';
        console.log("\n✅ SUCESSO TOTAL!");
        console.log("━".repeat(60));
        console.log(response);
        console.log("━".repeat(60));
        console.log("\n🎉 Claude API está FUNCIONANDO!");
        console.log("💰 Você tem US$ 5,00 de créditos!");
        console.log("🚀 Tarot e Numerologia agora têm IA REAL!");
    } catch (e) {
        console.log("\n❌ ERRO:", e.message);
        console.log("Status:", e.status);
        console.log("\nTentando outro modelo...");

        try {
            console.log("\n📡 Testando modelo claude-3-sonnet-20240229...");
            const message2 = await anthropic.messages.create({
                model: "claude-3-sonnet-20240229",
                max_tokens: 100,
                messages: [{
                    role: "user",
                    content: "Diga: Funcionando!"
                }]
            });

            const response2 = message2.content[0].type === 'text' ? message2.content[0].text : '';
            console.log("\n✅ SUCESSO com Sonnet!");
            console.log(response2);
        } catch (e2) {
            console.log("❌ Erro também:", e2.message);
        }
    }
})();
