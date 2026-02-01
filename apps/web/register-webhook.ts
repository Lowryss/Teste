/**
 * Script para registrar o webhook Efí (Pix)
 * Execute com: npx tsx register-webhook.ts
 */
import EfiPay from 'sdk-node-apis-efi';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';

// Carregar variáveis do .env.local
dotenv.config({ path: path.resolve(__dirname, '.env.local') });

async function registerWebhook() {
    console.log('🔧 Registrando webhook Efí (Pix)...\n');

    const clientId = process.env.EFI_CLIENT_ID;
    const clientSecret = process.env.EFI_CLIENT_SECRET;
    const pixKey = process.env.EFI_PIX_KEY;

    if (!clientId || !clientSecret || !pixKey) {
        console.error('❌ Credenciais Efí não configuradas!');
        process.exit(1);
    }

    // Resolver caminho do certificado
    const possiblePaths = [
        path.resolve(__dirname, '../../.p12'),
        path.resolve(__dirname, '../../cert-efi.p12'),
        path.resolve(__dirname, 'cert-efi.p12'),
    ];

    let certPath = '';
    for (const p of possiblePaths) {
        if (fs.existsSync(p)) {
            certPath = p;
            break;
        }
    }

    if (!certPath) {
        console.error('❌ Certificado P12 não encontrado!');
        process.exit(1);
    }

    console.log(`📜 Certificado: ${certPath}`);
    console.log(`🔑 Chave Pix: ${pixKey}\n`);

    const options = {
        sandbox: false, // Produção
        client_id: clientId,
        client_secret: clientSecret,
        certificate: certPath,
        validateMtls: false
    };

    const efi = new EfiPay(options);

    // URL do webhook (ngrok)
    // IMPORTANTE: Altere esta URL para a URL atual do ngrok
    const webhookUrl = process.argv[2];

    if (!webhookUrl) {
        console.error('❌ Uso: npx tsx register-webhook.ts <URL_DO_WEBHOOK>');
        console.error('   Exemplo: npx tsx register-webhook.ts https://seu-ngrok.ngrok-free.dev/api/webhooks/efi');
        process.exit(1);
    }

    console.log(`📡 Registrando webhook: ${webhookUrl}\n`);

    try {
        // Registrar webhook para a chave Pix
        const params = {
            chave: pixKey
        };

        const body = {
            webhookUrl: webhookUrl
        };

        const result = await efi.pixConfigWebhook(params, body);

        console.log('✅ WEBHOOK REGISTRADO COM SUCESSO!');
        console.log('Resultado:', JSON.stringify(result, null, 2));

    } catch (error: any) {
        console.error('❌ Erro ao registrar webhook:');
        console.error('   Mensagem:', error?.error_description || error?.message || error);

        if (error?.error === 'webhook_invalido') {
            console.log('\n💡 Dica: A URL do webhook deve ser HTTPS e acessível publicamente.');
        }

        process.exit(1);
    }
}

registerWebhook();
