import { NextResponse } from 'next/server'
import { adminDb, auth } from '@/lib/firebase-admin'
import { headers } from 'next/headers'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { decrementUserPoints } from '@/lib/points'
import { calculateNumerology } from '@/lib/numerology'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')
const model = genAI.getGenerativeModel({ model: 'gemini-pro' })

export async function POST(req: Request) {
    try {
        const authHeader = (await headers()).get('Authorization')
        if (!authHeader?.startsWith('Bearer ')) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

        const token = authHeader.split('Bearer ')[1]
        const decodedToken = await auth.verifyIdToken(token)
        const userId = decodedToken.uid

        const { fullName, birthDate } = await req.json()

        // Validações robustas
        if (!fullName || typeof fullName !== 'string' || fullName.trim().length === 0) {
            return NextResponse.json({ error: 'Nome completo é obrigatório' }, { status: 400 })
        }
        if (!birthDate || typeof birthDate !== 'string') {
            return NextResponse.json({ error: 'Data de nascimento é obrigatória' }, { status: 400 })
        }

        // Check Points
        const COST = 100
        const userRef = adminDb.collection('users').doc(userId)
        const userDoc = await userRef.get()
        if ((userDoc.data()?.cosmicPoints || 0) < COST) {
            return NextResponse.json({ error: 'Insufficient points' }, { status: 403 })
        }

        // Calculate Numbers Locally com tratamento de erro
        let nums
        try {
            nums = calculateNumerology(fullName.trim())
            if (!nums || typeof nums.destiny !== 'number') {
                throw new Error('Invalid numerology calculation')
            }
        } catch (calcError) {
            console.error('Numerology calculation error:', calcError)
            return NextResponse.json({
                error: 'Erro ao calcular numerologia. Verifique se o nome está correto.'
            }, { status: 400 })
        }

        // Life Path Calc com validação robusta
        let finalLifePath = 1
        try {
            const dateDigits = birthDate.replace(/[^0-9]/g, '')
            if (dateDigits.length < 6 || dateDigits.length > 8) {
                throw new Error('Invalid date format')
            }
            const lifePath = dateDigits.split('').reduce((a: any, b: any) => parseInt(a) + parseInt(b), 0)
            finalLifePath = lifePath
            while (finalLifePath > 9 && finalLifePath !== 11 && finalLifePath !== 22 && finalLifePath !== 33) {
                finalLifePath = finalLifePath.toString().split('').reduce((a: any, b: any) => parseInt(a) + parseInt(b), 0)
            }
        } catch (dateError) {
            console.error('Date calculation error:', dateError)
            return NextResponse.json({
                error: 'Formato de data inválido. Use DD/MM/AAAA ou AAAA-MM-DD.'
            }, { status: 400 })
        }

        // Generate Interpretation com fallback
        let content = ''
        try {
            const prompt = `
                Atue como um numerólogo experiente. Analise este perfil:
                - Nome: ${fullName}
                - Número de Destino/Expressão: ${nums.destiny}
                - Número da Alma: ${nums.soul}
                - Número da Personalidade: ${nums.personality}
                - Caminho de Vida (Data): ${finalLifePath}

                Gere uma análise "Mapa Numerológico Completo".
                Estrutura:
                1. **Suas Potencialidades** (Baseado no Destino e Caminho)
                2. **Seu Eu Interior** (Alma: O que te motive)
                3. **Como o mundo te vê** (Personalidade)
                4. **Missão de Vida** (Síntese)

                Use tom místico, inspirador e empático. Formate com HTML (<h3>, <p>, <strong>). Sem markdown.
            `

            const result = await model.generateContent(prompt)
            content = result.response.text()

            // Validação do conteúdo
            if (!content || content.trim().length < 50) {
                throw new Error('Generated content too short')
            }
        } catch (aiError) {
            console.error('AI Generation error:', aiError)
            // Fallback com conteúdo de qualidade
            content = `
                <h3>✨ Suas Potencialidades</h3>
                <p>Seu número de destino <strong>${nums.destiny}</strong> e caminho de vida <strong>${finalLifePath}</strong> revelam um ser único com talentos extraordinários. Você possui a capacidade inata de transformar desafios em oportunidades de crescimento.</p>

                <h3>💫 Seu Eu Interior</h3>
                <p>Seu número da alma <strong>${nums.soul}</strong> indica profundos desejos e motivações espirituais. Você busca autenticidade e conexão verdadeira em todas as áreas da vida.</p>

                <h3>🌟 Como o Mundo Te Vê</h3>
                <p>Seu número de personalidade <strong>${nums.personality}</strong> revela como você se apresenta ao mundo. Sua presença é marcante e as pessoas naturalmente reconhecem suas qualidades únicas.</p>

                <h3>🎯 Missão de Vida</h3>
                <p>Sua combinação numerológica indica uma missão de vida relacionada ao desenvolvimento pessoal e à capacidade de inspirar outros através de seu exemplo autêntico.</p>
            `
        }

        // Deduct & Save
        await decrementUserPoints(userId, COST)
        await userRef.collection('readings').add({
            type: 'numerology-map',
            title: 'Mapa Numerológico',
            content,
            numbers: { ...nums, lifePath: finalLifePath },
            createdAt: new Date()
        })

        return NextResponse.json({
            numbers: { ...nums, lifePath: finalLifePath },
            content
        })

    } catch (error) {
        console.error('Numerology map error:', error)
        return NextResponse.json({
            error: 'Erro ao gerar mapa numerológico. Tente novamente.'
        }, { status: 500 })
    }
}
