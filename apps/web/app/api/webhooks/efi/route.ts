import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';

// GET handler para validação do webhook pela Efí
export async function GET() {
    console.log('🔔 [EFI WEBHOOK] GET - Validação de webhook recebida');
    return new Response('Webhook Efí ativo', { status: 200 });
}

export async function POST(request: Request) {
    console.log('🔔 [EFI WEBHOOK] POST - Notificação recebida!');

    try {
        const rawBody = await request.text();
        console.log('📦 [EFI WEBHOOK] Body raw:', rawBody);

        let body;
        try {
            body = JSON.parse(rawBody);
        } catch {
            console.log('⚠️ [EFI WEBHOOK] Body não é JSON, pode ser validação');
            return NextResponse.json({ ok: true });
        }

        console.log('📦 [EFI WEBHOOK] Body parsed:', JSON.stringify(body, null, 2));

        // O Efí manda um objeto com array 'pix' contendo os pagamentos
        // Ex: { pix: [ { txid: "...", valor: "...", horario: "..." } ] }
        const { pix } = body;

        if (!pix || !Array.isArray(pix)) {
            console.log('ℹ️ [EFI WEBHOOK] Sem array pix, pode ser validação inicial');
            return NextResponse.json({ ok: true });
        }

        console.log(`📋 [EFI WEBHOOK] ${pix.length} pagamento(s) recebido(s)`);

        for (const payment of pix) {
            const { txid, valor } = payment;
            console.log(`💰 [EFI WEBHOOK] Processando pagamento: txid=${txid}, valor=${valor}`);

            // 1. Buscar transação pendente
            const txRef = db.collection('transactions').doc(txid);
            const txDoc = await txRef.get();

            if (!txDoc.exists) {
                console.warn(`⚠️ [EFI WEBHOOK] Transação Pix não encontrada: ${txid}`);
                continue;
            }

            const txData = txDoc.data();
            console.log(`📄 [EFI WEBHOOK] Dados da transação:`, JSON.stringify(txData, null, 2));

            if (txData?.status === 'paid') {
                console.log(`✅ [EFI WEBHOOK] Transação ${txid} já processada.`);
                continue;
            }

            // 2. Creditar Pontos (Transação Atômica)
            if (txData?.userId && txData?.points) {
                console.log(`🎯 [EFI WEBHOOK] Creditando ${txData.points} pontos ao user ${txData.userId}`);

                await db.runTransaction(async (t) => {
                    const userRef = db.collection('users').doc(txData.userId);

                    t.update(userRef, {
                        cosmicPoints: FieldValue.increment(txData.points),
                        totalPointsPurchased: FieldValue.increment(txData.points)
                    });

                    t.update(txRef, {
                        status: 'paid',
                        paidAt: FieldValue.serverTimestamp(),
                        efiRaw: payment // Salvar dados brutos do webhook para auditoria
                    });
                });
                console.log(`🎉 [EFI WEBHOOK] Pontos creditados com sucesso!`);
            } else {
                console.warn(`⚠️ [EFI WEBHOOK] Dados incompletos: userId=${txData?.userId}, points=${txData?.points}`);
            }
        }

        return NextResponse.json({ status: 'success' });

    } catch (error) {
        console.error('❌ [EFI WEBHOOK] Erro:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
