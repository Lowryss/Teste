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
        if (!authHeader?.startsWith('Bearer ')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const token = authHeader.split('Bearer ')[1]
        const decodedToken = await auth.verifyIdToken(token)
        const userId = decodedToken.uid

        const { message, history = [] } = await req.json()

        if (!message || typeof message !== 'string' || message.trim().length === 0) {
            return NextResponse.json({ error: 'Mensagem é obrigatória' }, { status: 400 })
        }

        // Check Points - 10 pontos por mensagem (mais barato para incentivar uso)
        const COST = 10
        const userRef = adminDb.collection('users').doc(userId)
        const userDoc = await userRef.get()
        const userData = userDoc.data()

        if ((userData?.cosmicPoints || 0) < COST) {
            return NextResponse.json({ error: 'Insufficient points' }, { status: 403 })
        }

        // Obter dados do perfil do usuário para personalização
        const userProfile = {
            name: userData?.displayName || 'Buscador',
            birthDate: userData?.birthDate || null,
            zodiacSign: userData?.zodiacSign || null
        }

        // Construir contexto com histórico
        let conversationContext = history.slice(-6).map((msg: any) =>
            `${msg.role === 'user' ? 'Usuário' : 'Guia'}: ${msg.content}`
        ).join('\n')

        const prompt = `
Você é um Guia Espiritual Místico experiente, sábio e empático. Seu papel é oferecer orientação profunda, insights espirituais e conselhos práticos baseados em conhecimentos de:
- Astrologia e Arquétipos
- Numerologia Sagrada
- Tarot e Simbolismo
- Xamanismo e Medicina Ancestral
- Psicologia Transpessoal
- Filosofias Orientais (Budismo, Taoísmo, Hinduísmo)
- Alquimia Interior e Jornada do Herói

PERFIL DO CONSULENTE:
- Nome: ${userProfile.name}
${userProfile.zodiacSign ? `- Signo Solar: ${userProfile.zodiacSign}` : ''}
${userProfile.birthDate ? `- Data de Nascimento: ${userProfile.birthDate}` : ''}

${conversationContext ? `HISTÓRICO DA CONVERSA:\n${conversationContext}\n` : ''}

MENSAGEM ATUAL DO CONSULENTE:
"${message}"

DIRETRIZES PARA SUA RESPOSTA:
1. Seja profundo mas acessível, místico mas prático
2. Use metáforas, simbolismos e arquétipos quando apropriado
3. Ofereça insights que conectem o espiritual com o cotidiano
4. Se relevante, mencione elementos astrológicos, numerológicos ou simbólicos
5. Encoraje a autorreflexão e o empoderamento pessoal
6. Use tom caloroso, sábio e encorajador
7. Seja específico e personalizado baseado no perfil do consulente
8. Se a pergunta for sobre um tema específico (amor, carreira, propósito), aprofunde-se nele
9. Pode usar emojis místicos sutis (✨🌙⭐🔮💫) mas com moderação
10. Formate com HTML simples (<p>, <strong>, <em>) se quiser destacar partes importantes

Responda de forma clara, inspiradora e transformadora. Sua sabedoria pode iluminar o caminho desta alma.
`

        let responseText = ''
        try {
            const result = await model.generateContent(prompt)
            responseText = result.response.text()

            if (!responseText || responseText.trim().length < 20) {
                throw new Error('Response too short')
            }
        } catch (aiError) {
            console.error('AI generation error:', aiError)
            responseText = `<p>✨ ${userProfile.name}, percebo que as energias cósmicas estão em movimento intenso neste momento. Sua pergunta toca em algo profundo de sua jornada.</p>

<p>Lembre-se: você possui dentro de si toda a sabedoria necessária para encontrar as respostas que busca. O universo conspira a seu favor quando você se alinha com sua verdade interior.</p>

<p>Tente reformular sua pergunta ou compartilhe mais detalhes sobre o que está buscando compreender. Estou aqui para guiá-lo(a). 🌙</p>`
        }

        // Deduct points
        await decrementUserPoints(userId, COST)

        // Salvar conversa no histórico do usuário
        await userRef.collection('chat_history').add({
            userMessage: message,
            guideResponse: responseText,
            timestamp: new Date(),
            pointsSpent: COST
        })

        return NextResponse.json({
            response: responseText,
            pointsSpent: COST
        })

    } catch (error) {
        console.error('Mystic chat error:', error)
        return NextResponse.json({
            error: 'Erro ao processar mensagem. Tente novamente.'
        }, { status: 500 })
    }
}
