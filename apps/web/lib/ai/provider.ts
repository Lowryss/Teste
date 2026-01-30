import { GoogleGenerativeAI } from '@google/generative-ai'

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')

export type AIProvider = 'gemini' | 'openai' | 'claude'

export interface AIRequest {
    provider?: AIProvider
    prompt: string
    systemPrompt?: string
    temperature?: number
    maxTokens?: number
}

export async function generateAIResponse({
    provider = 'gemini',
    prompt,
    systemPrompt,
    temperature = 0.7,
    maxTokens = 1000
}: AIRequest): Promise<string> {
    try {
        if (!process.env.GEMINI_API_KEY && provider === 'gemini') {
            throw new Error('GEMINI_API_KEY not configured')
        }

        if (provider === 'gemini') {
            const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-lite' })

            // Combine system prompt if provided (Gemini Pro doesn't support system instruction directly in v1 yet effectively same way as OpenAI, but we can prepend)
            const fullPrompt = systemPrompt
                ? `${systemPrompt}\n\n---\n\nUser Request: ${prompt}`
                : prompt

            const result = await model.generateContent({
                contents: [{ role: 'user', parts: [{ text: fullPrompt }] }],
                generationConfig: {
                    temperature,
                    maxOutputTokens: maxTokens,
                }
            })

            const response = result.response.text()
            if (!response) throw new Error('Empty response from AI')

            return response
        }

        // Fallback/Other providers implementation would go here
        throw new Error(`Provider ${provider} not implemented`)
    } catch (error) {
        console.error('AI generation error:', error)
        if (error instanceof Error) return Promise.reject(error)
        return Promise.reject(new Error('Failed to generate AI response'))
    }
}
