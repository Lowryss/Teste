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

        const { birthDate } = await req.json()
        if (!birthDate) return NextResponse.json({ error: 'Missing data' }, { status: 400 })

        // Check Points
        const COST = 100
        const userRef = adminDb.collection('users').doc(userId)
        const userDoc = await userRef.get()
        if ((userDoc.data()?.cosmicPoints || 0) < COST) {
            return NextResponse.json({ error: 'Insufficient points' }, { status: 403 })
        }

        // Generate Shamanic Reading Logic
        const prompt = `
            Atue como um Xamã experiente em Astrologia Xamânica (Roda de Cura).
            Analise a data de nascimento: ${birthDate}

            Identifique o Totem Animal, Mineral (Pedra), Vegetal (Planta) e Direção da Roda Medicinale correspondente a esta data.
            
            ⚠️ Retorne APENAS um JSON estrito no seguinte formato:
            {
                "totem": {
                    "animal": "Ex: Falcão",
                    "stone": "Ex: Opala",
                    "plant": "Ex: Dente de Leão",
                    "direction": "Ex: Leste",
                    "mantra": "Uma frase curta de poder deste animal."
                },
                "content": "Texto HTML rico (<h3>, <p>, <strong>) explicando profundamente a medicina deste animal de poder, suas características, desafios e como a pessoa pode ativar essa energia em sua vida."
            }
        `

        const result = await model.generateContent(prompt)
        const text = result.response.text()

        let jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim()

        // Try to extract JSON if it's wrapped in text
        const jsonMatch = jsonStr.match(/\{[\s\S]*\}/)
        if (jsonMatch) {
            jsonStr = jsonMatch[0]
        }

        let parsed
        try {
            parsed = JSON.parse(jsonStr)
        } catch (parseError) {
            console.error('JSON Parse Error:', parseError)
            console.error('Received text:', text)

            // Fallback: Create default response
            parsed = {
                totem: {
                    animal: 'Águia',
                    stone: 'Quartzo Claro',
                    plant: 'Sálvia',
                    direction: 'Leste',
                    mantra: 'Vejo além do horizonte e me elevo com sabedoria.'
                },
                content: '<p>Seu totem animal representa força, visão e liberdade. Conecte-se com essa energia através da meditação e contemplação da natureza.</p>'
            }
        }

        // Validate structure
        if (!parsed.totem || !parsed.content) {
            throw new Error('Invalid response structure from AI')
        }

        // Deduct & Save
        await decrementUserPoints(userId, COST)
        await userRef.collection('readings').add({
            type: 'shamanic-map',
            title: 'Mapa Xamânico',
            totem: parsed.totem?.animal || 'Desconhecido',
            createdAt: new Date()
        })

        return NextResponse.json(parsed)

    } catch (error: any) {
        console.error('Shamanic Map Error:', error)
        return NextResponse.json({
            error: 'Internal Error',
            message: error.message || 'Failed to generate shamanic map'
        }, { status: 500 })
    }
}
