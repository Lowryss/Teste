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
        if (!authHeader?.startsWith('Bearer ')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const token = authHeader.split('Bearer ')[1]
        const decodedToken = await auth.verifyIdToken(token)
        const userId = decodedToken.uid

        const {
            person1Name,
            person1BirthDate,
            person1ZodiacSign,
            person2Name,
            person2BirthDate,
            person2ZodiacSign
        } = await req.json()

        // Validações
        if (!person1Name || !person2Name) {
            return NextResponse.json({ error: 'Nomes são obrigatórios' }, { status: 400 })
        }
        if (!person1BirthDate || !person2BirthDate) {
            return NextResponse.json({ error: 'Datas de nascimento são obrigatórias' }, { status: 400 })
        }

        // Check Points
        const COST = 150
        const userRef = adminDb.collection('users').doc(userId)
        const userDoc = await userRef.get()
        if ((userDoc.data()?.cosmicPoints || 0) < COST) {
            return NextResponse.json({ error: 'Insufficient points' }, { status: 403 })
        }

        // Calculate numerology for both
        let nums1, nums2
        try {
            nums1 = calculateNumerology(person1Name)
            nums2 = calculateNumerology(person2Name)
        } catch (error) {
            return NextResponse.json({
                error: 'Erro ao calcular numerologia dos nomes'
            }, { status: 400 })
        }

        const prompt = `
Você é um especialista em análise de compatibilidade amorosa e relacional, combinando astrologia, numerologia e psicologia de relacionamentos.

PERFIS:
PESSOA 1:
- Nome: ${person1Name}
- Data de Nascimento: ${person1BirthDate}
- Signo: ${person1ZodiacSign}
- Número de Destino: ${nums1.destiny}
- Número da Alma: ${nums1.soul}
- Número da Personalidade: ${nums1.personality}

PESSOA 2:
- Nome: ${person2Name}
- Data de Nascimento: ${person2BirthDate}
- Signo: ${person2ZodiacSign}
- Número de Destino: ${nums2.destiny}
- Número da Alma: ${nums2.soul}
- Número da Personalidade: ${nums2.personality}

RETORNE EM JSON:
{
  "overallScore": 85,
  "scoreBreakdown": {
    "emotional": 90,
    "intellectual": 80,
    "physical": 85,
    "spiritual": 88
  },
  "strengths": [
    "Ponto forte 1 do relacionamento",
    "Ponto forte 2 do relacionamento",
    "Ponto forte 3 do relacionamento",
    "Ponto forte 4 do relacionamento"
  ],
  "challenges": [
    "Desafio 1 a superar",
    "Desafio 2 a superar",
    "Desafio 3 a superar"
  ],
  "astrologicalAnalysis": "Análise profunda da compatibilidade astrológica entre os signos (3-4 parágrafos)",
  "numerologicalAnalysis": "Análise profunda da compatibilidade numerológica (3-4 parágrafos)",
  "relationshipDynamics": "Descrição da dinâmica do relacionamento e como vocês se complementam (3-4 parágrafos)",
  "loveAdvice": "Conselhos práticos para fortalecer o relacionamento (3-4 parágrafos)",
  "growthOpportunities": "Oportunidades de crescimento juntos (2-3 parágrafos)",
  "communication": {
    "style": "Estilo de comunicação entre vocês",
    "tips": ["Dica 1", "Dica 2", "Dica 3"]
  },
  "longTermPotential": "Análise do potencial de longo prazo (2-3 parágrafos)",
  "soulConnection": "Descrição da conexão de almas (2 parágrafos)"
}

DIRETRIZES:
1. Seja profundo, específico e personalizado
2. Use linguagem inspiradora mas realista
3. Equilibre pontos positivos com áreas de crescimento
4. Ofereça insights práticos e acionáveis
5. Conecte astrologia e numerologia de forma coesa
6. Scores devem ser de 0-100
7. IMPORTANTE: Retorne APENAS JSON válido, sem markdown

Gere a análise completa:
`

        let analysis: any = null
        try {
            const result = await model.generateContent(prompt)
            let text = result.response.text()

            // Limpar e extrair JSON
            text = text.replace(/```json/g, '').replace(/```/g, '').trim()
            const jsonMatch = text.match(/\{[\s\S]*\}/)
            if (jsonMatch) {
                text = jsonMatch[0]
            }

            analysis = JSON.parse(text)

            if (!analysis.overallScore || !analysis.strengths) {
                throw new Error('Invalid analysis structure')
            }
        } catch (parseError) {
            console.error('Compatibility analysis error:', parseError)
            // Fallback
            analysis = {
                overallScore: 75,
                scoreBreakdown: {
                    emotional: 78,
                    intellectual: 75,
                    physical: 72,
                    spiritual: 76
                },
                strengths: [
                    "Vocês compartilham valores fundamentais e visões de mundo compatíveis",
                    "Há uma química natural e facilidade na comunicação",
                    "Ambos possuem capacidade de crescimento e evolução juntos",
                    "Respeito mútuo e admiração pelas qualidades um do outro"
                ],
                challenges: [
                    "Possíveis diferenças no ritmo de vida e necessidades de espaço pessoal",
                    "Desafios na expressão de vulnerabilidade emocional",
                    "Necessidade de equilibrar individualidade com união"
                ],
                astrologicalAnalysis: `A combinação entre ${person1ZodiacSign} e ${person2ZodiacSign} cria uma dinâmica interessante e cheia de potencial. Cada signo traz qualidades únicas que podem se complementar de forma harmoniosa quando há compreensão mútua.`,
                numerologicalAnalysis: `Os números de destino ${nums1.destiny} e ${nums2.destiny} revelam caminhos de vida que podem se entrelaçar de forma significativa. Esta combinação numerológica sugere uma união que favorece o crescimento espiritual e pessoal de ambos.`,
                relationshipDynamics: `A dinâmica entre vocês é marcada por momentos de profunda conexão e compreensão mútua. Há um potencial natural para construir algo sólido e duradouro quando ambos investem no relacionamento.`,
                loveAdvice: `Cultivem a comunicação aberta e honesta. Celebrem as diferenças como oportunidades de aprendizado. Criem rituais e momentos especiais para fortalecer a conexão.`,
                growthOpportunities: `Juntos, vocês podem desenvolver maior inteligência emocional, expandir horizontes e apoiar os sonhos um do outro.`,
                communication: {
                    style: "Comunicação geralmente clara com momentos que requerem paciência extra",
                    tips: [
                        "Pratiquem escuta ativa sem julgamentos",
                        "Expressem gratidão regularmente",
                        "Criem espaço seguro para vulnerabilidade"
                    ]
                },
                longTermPotential: `O potencial de longo prazo é promissor quando há compromisso mútuo. A combinação de suas energias pode criar uma parceria que resiste ao tempo.`,
                soulConnection: `Existe uma conexão que transcende o superficial. Vocês podem ter se encontrado para aprender lições importantes e evoluir juntos nesta jornada.`
            }
        }

        // Deduct & Save
        await decrementUserPoints(userId, COST)
        await userRef.collection('readings').add({
            type: 'deep-compatibility',
            title: `Compatibilidade: ${person1Name} & ${person2Name}`,
            analysis,
            person1: { name: person1Name, birthDate: person1BirthDate, zodiacSign: person1ZodiacSign, numbers: nums1 },
            person2: { name: person2Name, birthDate: person2BirthDate, zodiacSign: person2ZodiacSign, numbers: nums2 },
            createdAt: new Date()
        })

        return NextResponse.json({
            analysis,
            person1Numbers: nums1,
            person2Numbers: nums2
        })

    } catch (error) {
        console.error('Deep compatibility error:', error)
        return NextResponse.json({
            error: 'Erro ao gerar análise de compatibilidade. Tente novamente.'
        }, { status: 500 })
    }
}
