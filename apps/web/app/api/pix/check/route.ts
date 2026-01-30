import { NextRequest, NextResponse } from 'next/server';
import EfiPay from 'sdk-node-apis-efi';
import path from 'path';
import fs from 'fs';
import { db } from '@/lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';

// Endpoint para verificar e processar pagamento Pix pendente
// Chamado pelo frontend após pagamento

export async function POST(request: NextRequest) {
    try {
        const { txid, userId } = await request.json();

        if (!txid || !userId) {
            return NextResponse.json({ error: 'txid e userId são obrigatórios' }, { status: 400 });
        }

        console.log(`🔍 [PIX CHECK] Verificando pagamento: txid=${txid}, userId=${userId}`);

        // 1. Verificar se já foi processado
        const txRef = db.collection('transactions').doc(txid);
        const txDoc = await txRef.get();

        if (!txDoc.exists) {
            return NextResponse.json({ error: 'Transação não encontrada' }, { status: 404 });
        }

        const txData = txDoc.data();

        if (txData?.status === 'paid') {
            console.log(`✅ [PIX CHECK] Já pago anteriormente`);
            return NextResponse.json({
                status: 'paid',
                message: 'Pagamento já foi processado!',
                points: txData.points
            });
        }

        // 2. Configurar SDK Efí
        const certEnv = process.env.EFI_CERTIFICATE_PEM || '';
        let certPath = '';

        const possiblePaths = [
            path.resolve(process.cwd(), certEnv),
            path.resolve(process.cwd(), '../../.p12'),
            path.resolve(process.cwd(), '../../cert-efi.p12'),
        ];

        for (const p of possiblePaths) {
            if (fs.existsSync(p)) {
                certPath = p;
                break;
            }
        }

        if (!certPath) {
            console.error('❌ [PIX CHECK] Certificado não encontrado');
            return NextResponse.json({ error: 'Configuração do servidor' }, { status: 500 });
        }

        const options = {
            sandbox: false,
            client_id: process.env.EFI_CLIENT_ID as string,
            client_secret: process.env.EFI_CLIENT_SECRET as string,
            certificate: certPath,
            validateMtls: false
        };

        const efi = new EfiPay(options);

        // 3. Consultar status na Efí
        console.log(`🔄 [PIX CHECK] Consultando status na Efí...`);

        const params = { txid };
        const cob = await efi.pixDetailCharge(params);

        console.log(`📋 [PIX CHECK] Status Efí: ${cob.status}`);

        // Status possíveis: ATIVA, CONCLUIDA, REMOVIDA_PELO_USUARIO_RECEBEDOR, REMOVIDA_PELO_PSP
        if (cob.status === 'CONCLUIDA') {
            console.log(`💰 [PIX CHECK] Pagamento confirmado! Creditando pontos...`);

            // 4. Processar pagamento
            if (txData?.userId && txData?.points) {
                await db.runTransaction(async (t) => {
                    const userRef = db.collection('users').doc(txData.userId);

                    t.update(userRef, {
                        cosmicPoints: FieldValue.increment(txData.points),
                        totalPointsPurchased: FieldValue.increment(txData.points)
                    });

                    t.update(txRef, {
                        status: 'paid',
                        paidAt: FieldValue.serverTimestamp(),
                        efiStatus: cob.status
                    });
                });

                console.log(`🎉 [PIX CHECK] ${txData.points} pontos creditados!`);

                return NextResponse.json({
                    status: 'paid',
                    message: 'Pagamento confirmado! Pontos creditados.',
                    points: txData.points
                });
            }
        }

        // Ainda não pago
        return NextResponse.json({
            status: cob.status,
            message: 'Aguardando pagamento...'
        });

    } catch (error: any) {
        console.error('❌ [PIX CHECK] Erro:', error);
        return NextResponse.json({
            error: error?.error_description || error?.message || 'Erro ao verificar pagamento'
        }, { status: 500 });
    }
}
