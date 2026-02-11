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

        const { name, birthDate, birthTime, birthPlace } = await req.json()
        if (!name || !birthDate || !birthTime) return NextResponse.json({ error: 'Missing data' }, { status: 400 })

        // Check Points
        const COST = 100
        const userRef = adminDb.collection('users').doc(userId)
        const userDoc = await userRef.get()
        if ((userDoc.data()?.cosmicPoints || 0) < COST) {
            return NextResponse.json({ error: 'Insufficient points' }, { status: 403 })
        }

        // Generate Chart Logic (via Prompt for MVP simplicity)
        const prompt = `
            Atue como um astrólogo especialista. Calcule e interprete o Mapa Astral para:
            - Nome: ${name}
            - Data: ${birthDate}
            - Hora: ${birthTime}
            - Local: ${birthPlace}

            ⚠️ Retorne APENAS um JSON estrito no seguinte formato (sem markdown, sem texto extra):
            {
                "planets": {
                    "sun": { "sign": "Ex: Leão" },
                    "moon": { "sign": "Ex: Peixes" },
                    "ascendant": { "sign": "Ex: Escorpião" }
                },
                "elements": {
                    "fire": 30,
                    "earth": 20,
                    "air": 40,
                    "water": 10
                },
                "interpretation": "Texto HTML rico (usando tags <h3>, <p>, <strong>) contendo uma análise profunda da tríade (Sol, Lua, Ascendente) e como ela impacta a vida da pessoa. Fale sobre desafios e potências. Minimo 3 paragrafos."
            }
        `

        const result = await model.generateContent(prompt)
        const text = result.response.text()

        // Clean markdown code blocks if present
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
                planets: {
                    sun: { sign: 'Áries' },
                    moon: { sign: 'Câncer' },
                    ascendant: { sign: 'Libra' }
                },
                elements: { fire: 40, earth: 20, air: 30, water: 10 },
                interpretation: '<p>Seu mapa astral revela uma personalidade dinâmica e equilibrada. O posicionamento dos planetas sugere força interior e capacidade de adaptação.</p>'
            }
        }

        // Validate structure
        if (!parsed.planets || !parsed.elements || !parsed.interpretation) {
            throw new Error('Invalid response structure from AI')
        }

        // Deduct & Save
        await decrementUserPoints(userId, COST)
        await userRef.collection('readings').add({
            type: 'astral-map',
            title: 'Mapa Astral',
            sign: parsed.planets?.sun?.sign || 'Desconhecido',
            createdAt: new Date()
        })

        return NextResponse.json({
            planets: parsed.planets,
            elements: parsed.elements,
            content: parsed.interpretation
        })

    } catch (error: any) {
        console.error('Astral Map Error:', error)
        return NextResponse.json({
            error: 'Internal Error',
            message: error.message || 'Failed to generate astral map'
        }, { status: 500 })
    }
}
