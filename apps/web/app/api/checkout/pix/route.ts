import { NextResponse } from 'next/server';
import EfiPay from 'sdk-node-apis-efi';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { db } from '@/lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';

export async function POST(request: Request) {
    try {
        const { amount, points, userId, packageId, packageName } = await request.json();

        if (!amount || !userId || !points) {
            return NextResponse.json({ error: 'Dados inválidos' }, { status: 400 });
        }

        if (!process.env.EFI_CLIENT_ID || !process.env.EFI_CLIENT_SECRET) {
            console.warn('Efí Credentials missing');
            // Mock para teste visual se sem credenciais (remover em prod)
            // return NextResponse.json({ txid: 'mock_txid', qr_code: '000201...', imagem_qrcode: '', valor: '0.00' });
            return NextResponse.json({ error: 'Pagamento Pix indisponível (Credentials missing).' }, { status: 503 });
        }

        // 1. Setup Certificado (Lógica Híbrida: Arquivo P12, String PEM ou Base64)
        const certEnv = process.env.EFI_CERTIFICATE_PEM || '';
        let certPath = '';

        if (certEnv.trim().endsWith('.p12') && !certEnv.includes('\n')) {
            // Modo Arquivo P12 (Caminho) - Apenas se não tiver quebras de linha (não confundir com conteúdo)
            const tryPath1 = path.resolve(process.cwd(), certEnv);
            const tryPath2 = path.resolve(process.cwd(), '../../cert-efi.p12');
            const tryPath3 = path.resolve(process.cwd(), 'cert-efi.p12');
            const tryPath4 = path.resolve(process.cwd(), '../../.p12');

            if (fs.existsSync(tryPath1)) certPath = tryPath1;
            else if (fs.existsSync(tryPath4)) certPath = tryPath4;
            else if (fs.existsSync(tryPath2)) certPath = tryPath2;
            else if (fs.existsSync(tryPath3)) certPath = tryPath3;
            else {
                console.error('Certificado P12 não encontrado nos caminhos tentados:', [tryPath1, tryPath2, tryPath3]);
                return NextResponse.json({ error: 'Certificado Pix não encontrado no servidor.' }, { status: 500 });
            }
        } else {
            // Modo Conteúdo (ENV) - Base64 ou PEM Text
            const isPem = certEnv.includes('BEGIN CERTIFICATE') || certEnv.includes('BEGIN PRIVATE KEY');
            const ext = isPem ? 'pem' : 'p12';
            certPath = path.join(os.tmpdir(), `efi_cert_${Date.now()}.${ext}`);

            try {
                if (isPem) {
                    // Texto PEM direto
                    fs.writeFileSync(certPath, certEnv);
                } else {
                    // Assume Base64 do arquivo binário P12
                    const buffer = Buffer.from(certEnv, 'base64');
                    fs.writeFileSync(certPath, buffer);
                }
            } catch (err) {
                console.error('Erro ao escrever certificado temporário:', err);
                return NextResponse.json({ error: 'Falha ao processar certificado seguro.' }, { status: 500 });
            }
        }

        // 2. Configurar SDK
        const options = {
            sandbox: false, // PRODUÇÃO - Pix real
            client_id: process.env.EFI_CLIENT_ID,
            client_secret: process.env.EFI_CLIENT_SECRET,
            certificate: certPath,
            validateMtls: false // Opcional, desativa validação estrita se der erro de cadeia
        };

        const efi = new EfiPay(options);

        // 3. Criar Cobrança Pix Imediata
        const body = {
            calendario: {
                expiracao: 3600, // 1 hora
            },
            valor: {
                original: (amount / 100).toFixed(2),
            },
            chave: process.env.EFI_PIX_KEY || 'SUA_CHAVE_PIX_TESTE',
            solicitacaoPagador: `Pontos Cósmicos - ${packageName}`,
            infoAdicionais: [
                { nome: "UserID", valor: userId }
            ]
        };

        const cob = await efi.pixCreateImmediateCharge({}, body);

        // 4. Salvar Pendência no Firestore
        await db.collection('transactions').doc(cob.txid).set({
            userId,
            packageId,
            amount: amount / 100,
            points: points,
            status: 'pending',
            gateway: 'efi',
            createdAt: FieldValue.serverTimestamp()
        });

        // 5. Gerar QR Code
        const params = {
            id: cob.loc.id
        };

        const qrCode = await efi.pixGenerateQRCode(params);

        return NextResponse.json({
            txid: cob.txid,
            qr_code: qrCode.qrcode,
            imagem_qrcode: qrCode.imagemQrcode,
            valor: cob.valor.original
        });

    } catch (error: any) {
        console.error('Erro ao gerar Pix:', error);
        // Erro detalhado do Efí costuma vir em error?.error ou error?.error_description
        const msg = error?.error_description || error?.message || 'Erro desconhecido';
        return NextResponse.json(
            { error: `Erro Pix: ${msg}` },
            { status: 500 }
        );
    }
}
