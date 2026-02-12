import { NextResponse } from 'next/server'
import { adminDb, auth } from '@/lib/firebase-admin'
import { headers } from 'next/headers'
import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')
const model = genAI.getGenerativeModel({ model: 'gemini-pro' })

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
        const userDoc = await userRef.get()
        const userData = userDoc.data()

        const today = new Date().toISOString().split('T')[0]

        // Verificar se já gerou ritual hoje
        const ritualsSnapshot = await userRef
            .collection('daily_rituals')
            .where('date', '==', today)
            .limit(1)
            .get()

        if (!ritualsSnapshot.empty) {
            // Retornar ritual existente
            const existingRitual = ritualsSnapshot.docs[0].data()
            return NextResponse.json({
                ritual: existingRitual,
                cached: true
            })
        }

        // Gerar novo ritual personalizado
        const userProfile = {
            name: userData?.displayName || 'Buscador',
            zodiacSign: userData?.zodiacSign || 'desconhecido',
            birthDate: userData?.birthDate || null
        }

        const dayOfWeek = new Date().toLocaleDateString('pt-BR', { weekday: 'long' })
        const currentMonth = new Date().toLocaleDateString('pt-BR', { month: 'long' })

        const prompt = `
Você é um Mestre Espiritual que cria rituais diários personalizados. Gere um ritual único e transformador para hoje.

PERFIL DO PRATICANTE:
- Nome: ${userProfile.name}
- Signo: ${userProfile.zodiacSign}
- Dia: ${dayOfWeek}
- Mês: ${currentMonth}

ESTRUTURA DO RITUAL (RETORNE EM JSON):
{
  "affirmation": "Uma afirmação poderosa para o dia (1 frase inspiradora)",
  "meditation": {
    "title": "Título da meditação",
    "description": "Descrição da prática meditativa (2-3 parágrafos)",
    "duration": "5-10 min"
  },
  "crystal": {
    "name": "Nome do cristal recomendado",
    "properties": "Propriedades místicas do cristal",
    "howToUse": "Como usar o cristal hoje"
  },
  "color": {
    "name": "Cor do dia",
    "meaning": "Significado energético da cor",
    "suggestion": "Como incorporar a cor no dia"
  },
  "practice": {
    "title": "Prática recomendada",
    "description": "Atividade espiritual para hoje (2-3 parágrafos)",
    "time": "Melhor momento do dia"
  },
  "intention": "Intenção do dia (1-2 frases focadas)",
  "moonPhase": "Fase da lua e seu significado para hoje",
  "element": "Elemento regente do dia (Fogo/Terra/Ar/Água) e sua influência"
}

DIRETRIZES:
1. Personalize baseado no signo e perfil
2. Seja específico e prático
3. Use linguagem inspiradora mas acessível
4. Conecte com energias astrológicas e lunares atuais
5. Ofereça práticas realizáveis no dia a dia
6. IMPORTANTE: Retorne APENAS o JSON válido, sem markdown, sem codigo com backticks, sem texto adicional

Gere um ritual completo e transformador:
`

        let ritual: any = null
        try {
            const result = await model.generateContent(prompt)
            let text = result.response.text()

            // Limpar markdown e extrair JSON
            text = text.replace(/```json/g, '').replace(/```/g, '').trim()
            const jsonMatch = text.match(/\{[\s\S]*\}/)
            if (jsonMatch) {
                text = jsonMatch[0]
            }

            ritual = JSON.parse(text)

            // Validar estrutura
            if (!ritual.affirmation || !ritual.meditation || !ritual.crystal) {
                throw new Error('Invalid ritual structure')
            }
        } catch (parseError) {
            console.error('Ritual generation error:', parseError)
            // Fallback ritual de qualidade
            ritual = {
                affirmation: `Hoje, eu me conecto com minha essência ${userProfile.zodiacSign === 'desconhecido' ? 'cósmica' : `de ${userProfile.zodiacSign}`} e permito que minha luz interior brilhe.`,
                meditation: {
                    title: "Meditação da Presença Radiante",
                    description: `Encontre um lugar tranquilo e sente-se confortavelmente. Feche os olhos e respire profundamente três vezes. Visualize uma luz dourada envolvendo todo seu ser. Esta luz representa sua essência divina. A cada respiração, sinta essa luz se expandindo, preenchendo cada célula do seu corpo com vitalidade e paz. Permaneça nesta visualização por alguns minutos, simplesmente sendo.`,
                    duration: "5-10 min"
                },
                crystal: {
                    name: "Quartzo Rosa",
                    properties: "Pedra do amor incondicional e cura emocional. Traz paz, compaixão e abertura do coração.",
                    howToUse: "Segure o cristal sobre seu coração durante a meditação ou carregue-o no bolso ao longo do dia."
                },
                color: {
                    name: "Rosa Suave",
                    meaning: "Representa amor próprio, ternura e cura emocional. Traz energias de acolhimento e compaixão.",
                    suggestion: "Use uma peça de roupa rosa, acenda uma vela rosa, ou visualize esta cor durante a meditação."
                },
                practice: {
                    title: "Gratidão Matinal",
                    description: "Ao acordar, antes de pegar o celular, dedique 3 minutos para listar mentalmente três coisas pelas quais você é grato(a). Podem ser coisas simples: o conforto da cama, a luz do sol, o ar que você respira. Sinta genuinamente a gratidão em seu coração. Esta prática eleva sua vibração e prepara você para um dia harmonioso.",
                    time: "Logo ao acordar"
                },
                intention: "Escolho amar e honrar a mim mesmo(a) em cada momento deste dia. Permito que a gratidão guie meus passos.",
                moonPhase: "A Lua está em seu ciclo natural, lembrando-nos da impermanência e renovação constante da vida.",
                element: "Água - Elemento da intuição, emoções e fluidez. Hoje, permita-se fluir com os eventos sem resistência."
            }
        }

        // Salvar ritual no Firestore
        await userRef.collection('daily_rituals').add({
            ...ritual,
            date: today,
            createdAt: new Date()
        })

        return NextResponse.json({
            ritual,
            cached: false
        })

    } catch (error) {
        console.error('Daily ritual error:', error)
        return NextResponse.json({
            error: 'Erro ao gerar ritual diário. Tente novamente.'
        }, { status: 500 })
    }
}
