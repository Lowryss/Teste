import { NextResponse } from 'next/server'
import { adminDb, auth } from '@/lib/firebase-admin'
import { headers } from 'next/headers'
import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')
const model = genAI.getGenerativeModel({ model: 'gemini-pro' })

// GET - Listar entradas do diário
export async function GET(req: Request) {
    try {
        const authHeader = (await headers()).get('Authorization')
        if (!authHeader?.startsWith('Bearer ')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const token = authHeader.split('Bearer ')[1]
        const decodedToken = await auth.verifyIdToken(token)
        const userId = decodedToken.uid

        const userRef = adminDb.collection('users').doc(userId)
        const entriesSnapshot = await userRef
            .collection('journal_entries')
            .orderBy('createdAt', 'desc')
            .limit(20)
            .get()

        const entries = entriesSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            createdAt: doc.data().createdAt.toDate().toISOString()
        }))

        return NextResponse.json({ entries })

    } catch (error) {
        console.error('Journal GET error:', error)
        return NextResponse.json({
            error: 'Erro ao buscar entradas do diário'
        }, { status: 500 })
    }
}

// POST - Criar nova entrada com comentário da IA
export async function POST(req: Request) {
    try {
        const authHeader = (await headers()).get('Authorization')
        if (!authHeader?.startsWith('Bearer ')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const token = authHeader.split('Bearer ')[1]
        const decodedToken = await auth.verifyIdToken(token)
        const userId = decodedToken.uid

        const { content, mood } = await req.json()

        if (!content || typeof content !== 'string' || content.trim().length === 0) {
            return NextResponse.json({ error: 'Conteúdo é obrigatório' }, { status: 400 })
        }

        const userRef = adminDb.collection('users').doc(userId)
        const userDoc = await userRef.get()
        const userData = userDoc.data()

        const userProfile = {
            name: userData?.displayName || 'Buscador',
            zodiacSign: userData?.zodiacSign || null
        }

        // Gerar comentário místico da IA
        const prompt = `
Você é um Guia Espiritual sábio e empático que lê e comenta entradas de diário.

PERFIL DO AUTOR:
- Nome: ${userProfile.name}
${userProfile.zodiacSign ? `- Signo: ${userProfile.zodiacSign}` : ''}

HUMOR ATUAL: ${mood || 'neutro'}

ENTRADA DO DIÁRIO:
"${content}"

TAREFA:
Ofereça um comentário breve mas profundo (2-3 parágrafos) que:
1. Valide os sentimentos e experiências compartilhadas
2. Ofereça uma perspectiva espiritual ou insight profundo
3. Conecte com sabedoria universal, arquétipos ou símbolos se apropriado
4. Encoraje autorreflexão e crescimento
5. Termine com uma afirmação ou mensagem inspiradora

Tom: Caloroso, sábio, encorajador e místico
Formatação: HTML simples (<p>, <strong>, <em>)

Escreva seu comentário:
`

        let aiComment = ''
        try {
            const result = await model.generateContent(prompt)
            aiComment = result.response.text()

            if (!aiComment || aiComment.trim().length < 20) {
                throw new Error('Comment too short')
            }
        } catch (aiError) {
            console.error('AI comment generation error:', aiError)
            aiComment = `<p><strong>✨ ${userProfile.name}</strong>, suas palavras carregam a essência de sua jornada única.</p>

<p>Cada momento que você registra aqui é uma semente plantada no jardim de sua consciência. Continue cultivando esta prática sagrada de autorreflexão - ela é uma ponte entre seu eu presente e seu eu mais elevado.</p>

<p><em>Lembre-se: você está exatamente onde precisa estar em sua jornada. 🌙</em></p>`
        }

        // Salvar entrada
        const entry = {
            content: content.trim(),
            mood: mood || 'neutral',
            aiComment,
            createdAt: new Date()
        }

        const docRef = await userRef.collection('journal_entries').add(entry)

        return NextResponse.json({
            entry: {
                id: docRef.id,
                ...entry,
                createdAt: entry.createdAt.toISOString()
            }
        })

    } catch (error) {
        console.error('Journal POST error:', error)
        return NextResponse.json({
            error: 'Erro ao criar entrada do diário'
        }, { status: 500 })
    }
}
