/**
 * Script para testar conexão com a API Efí (Pix)
 * Execute com: npx tsx test-efi.ts
 */
import EfiPay from 'sdk-node-apis-efi';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';

// Carregar variáveis do .env.local
dotenv.config({ path: path.resolve(__dirname, '.env.local') });

async function testEfiConnection() {
    console.log('🔍 Testando conexão com Efí (Pix)...\n');

    // 1. Verificar credenciais
    const clientId = process.env.EFI_CLIENT_ID;
    const clientSecret = process.env.EFI_CLIENT_SECRET;
    const pixKey = process.env.EFI_PIX_KEY;
    const certPath = process.env.EFI_CERTIFICATE_PEM;

    console.log('📋 Configuração:');
    console.log(`  CLIENT_ID: ${clientId ? '✅ Configurado' : '❌ FALTANDO'}`);
    console.log(`  CLIENT_SECRET: ${clientSecret ? '✅ Configurado' : '❌ FALTANDO'}`);
    console.log(`  PIX_KEY: ${pixKey || '❌ FALTANDO'}`);
    console.log(`  CERTIFICATE: ${certPath || '❌ FALTANDO'}`);
    console.log('');

    if (!clientId || !clientSecret) {
        console.error('❌ Credenciais da Efí não configuradas!');
        process.exit(1);
    }

    // 2. Verificar certificado
    let resolvedCertPath = '';

    // Tentar vários caminhos possíveis
    const possiblePaths = [
        path.resolve(__dirname, certPath || ''),
        path.resolve(__dirname, '..', '..', 'cert-efi.p12'),
        path.resolve(__dirname, 'cert-efi.p12'),
        'c:\\dev\\Projeto teste\\cert-efi.p12'
    ];

    for (const p of possiblePaths) {
        if (fs.existsSync(p)) {
            resolvedCertPath = p;
            break;
        }
    }

    if (!resolvedCertPath) {
        console.error('❌ Certificado P12 não encontrado!');
        console.log('Caminhos tentados:', possiblePaths);
        process.exit(1);
    }

    console.log(`📜 Certificado encontrado: ${resolvedCertPath}\n`);

    // 3. Configurar SDK
    const options = {
        sandbox: true, // IMPORTANTE: true para homologação
        client_id: clientId,
        client_secret: clientSecret,
        certificate: resolvedCertPath,
        validateMtls: false
    };

    try {
        const efi = new EfiPay(options);

        // 4. Testar autenticação listando webhooks (operação leve)
        console.log('🔄 Tentando autenticar com a API Efí...');

        // Tenta criar uma cobrança de teste (1 centavo)
        const body = {
            calendario: {
                expiracao: 60, // 1 minuto (para teste rápido)
            },
            valor: {
                original: '0.01',
            },
            chave: pixKey || '',
            solicitacaoPagador: 'Teste de conexão API'
        };

        const cob = await efi.pixCreateImmediateCharge({}, body);

        console.log('\n✅ CONEXÃO SUCESSO!');
        console.log('📦 Cobrança de teste criada:');
        console.log(`   TXID: ${cob.txid}`);
        console.log(`   Status: ${cob.status}`);
        console.log(`   Valor: R$ ${cob.valor.original}`);

        // Gerar QR Code
        const qr = await efi.pixGenerateQRCode({ id: cob.loc.id });
        console.log(`   QR Code: ${qr.qrcode.substring(0, 50)}...`);

        console.log('\n🎉 A integração Pix está funcionando corretamente!');

    } catch (error: any) {
        console.error('\n❌ ERRO na conexão com Efí:');
        console.error('   Mensagem:', error?.error_description || error?.message || error);

        if (error?.error === 'invalid_client') {
            console.log('\n💡 Dica: Verifique se CLIENT_ID e CLIENT_SECRET estão corretos.');
        }
        if (error?.message?.includes('certificate')) {
            console.log('\n💡 Dica: O certificado pode estar inválido ou expirado.');
        }

        process.exit(1);
    }
}

testEfiConnection();
