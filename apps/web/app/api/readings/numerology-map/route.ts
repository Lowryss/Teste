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
        if (!fullName || !birthDate) return NextResponse.json({ error: 'Missing data' }, { status: 400 })

        // Check Points
        const COST = 100
        const userRef = adminDb.collection('users').doc(userId)
        const userDoc = await userRef.get()
        if ((userDoc.data()?.cosmicPoints || 0) < COST) {
            return NextResponse.json({ error: 'Insufficient points' }, { status: 403 })
        }

        // Calculate Numbers Locally
        const nums = calculateNumerology(fullName)
        // Simple Life Path Calc (simplified for MVP, ideally should be in lib too)
        const lifePath = birthDate.replace(/[^0-9]/g, '').split('').reduce((a: any, b: any) => parseInt(a) + parseInt(b), 0)
        let finalLifePath = lifePath
        while (finalLifePath > 9 && finalLifePath !== 11 && finalLifePath !== 22 && finalLifePath !== 33) {
            finalLifePath = finalLifePath.toString().split('').reduce((a: any, b: any) => parseInt(a) + parseInt(b), 0)
        }

        // Generate Interpretation
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
        const content = result.response.text()

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
        console.error(error)
        return NextResponse.json({ error: 'Internal Error' }, { status: 500 })
    }
}
