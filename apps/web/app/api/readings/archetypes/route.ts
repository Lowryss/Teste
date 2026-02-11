import { NextResponse } from 'next/server'
import { adminDb, auth } from '@/lib/firebase-admin'
import { headers } from 'next/headers'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { decrementUserPoints } from '@/lib/points'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')
const model = genAI.getGenerativeModel({ model: 'gemini-pro' })

export async function POST(req: Request) {
    try {
        const authHeader = (await headers()).get('Authorization')
        if (!authHeader?.startsWith('Bearer ')) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

        const token = authHeader.split('Bearer ')[1]
        const decodedToken = await auth.verifyIdToken(token)
        const userId = decodedToken.uid

        const { name, birthDate } = await req.json()
        if (!name || !birthDate) return NextResponse.json({ error: 'Missing data' }, { status: 400 })

        // Check Points
        const COST = 100
        const userRef = adminDb.collection('users').doc(userId)
        const userDoc = await userRef.get()
        if ((userDoc.data()?.cosmicPoints || 0) < COST) {
            return NextResponse.json({ error: 'Insufficient points' }, { status: 403 })
        }

        // Generate Archetype Logic
        const prompt = `
            Atue como um analista Junguiano Místico.
            Analise o perfil: Nome: ${name}, Data: ${birthDate}.

            Identifique o Arquétipo Dominante (ex: O Herói, O Criador, O Sábio, O Rebelde, O Amante, etc..).
            
            ⚠️ Retorne APENAS um JSON estrito:
            {
                "archetype": "Nome do Arquétipo",
                "traits": {
                    "light": "Uma qualidade luminosa (ex: Coragem)",
                    "shadow": "Uma qualidade sombria (ex: Arrogância)"
                },
                "content": "Texto HTML rico (<h3>, <p>) explicando a jornada deste arquétipo, seus desafios atuais e como evoluir."
            }
        `

        const result = await model.generateContent(prompt)
        const text = result.response.text()

        const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim()
        const parsed = JSON.parse(jsonStr)

        // Deduct & Save
        await decrementUserPoints(userId, COST)
        await userRef.collection('readings').add({
            type: 'archetype',
            title: 'Arquétipo Dominante',
            archetype: parsed.archetype,
            createdAt: new Date()
        })

        return NextResponse.json(parsed)

    } catch (error) {
        console.error(error)
        return NextResponse.json({ error: 'Internal Error' }, { status: 500 })
    }
}
