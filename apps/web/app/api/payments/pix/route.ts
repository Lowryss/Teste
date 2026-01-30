import { NextRequest, NextResponse } from 'next/server'
import { PACKAGES } from '@/lib/shared/packages'

// PIX Payment via Efí Bank (Gerencianet)
// Documentation: https://dev.efipay.com.br/docs/APIs/API-Pix

export async function POST(req: NextRequest) {
    try {
        const { userId, packageId } = await req.json()

        if (!userId || !packageId) {
            return NextResponse.json({ error: 'Missing userId or packageId' }, { status: 400 })
        }

        const pkg = PACKAGES[packageId as keyof typeof PACKAGES]
        if (!pkg) {
            return NextResponse.json({ error: 'Invalid package' }, { status: 400 })
        }

        // For now, return a static PIX code since Efí requires certificate setup
        // In production, this would call the Efí API to generate a dynamic PIX

        const pixKey = process.env.EFI_PIX_KEY || 'pix@guiadocoracao.com'
        const priceInReais = (pkg.price / 100).toFixed(2)

        // Generate PIX Copia e Cola (static version for demo)
        // Format: BR.GOV.BCB.PIX key amount description
        const pixCopiaECola = `00020126360014BR.GOV.BCB.PIX0114${pixKey}5204000053039865406${priceInReais}5802BR5913GuiaCoracao6008SAOPAULO62070503***6304`

        return NextResponse.json({
            success: true,
            pixKey,
            pixCopiaECola,
            amount: priceInReais,
            packageName: pkg.name,
            points: pkg.points,
            userId,
            instructions: [
                'Abra o app do seu banco',
                'Escolha a opção Pix > Pix Copia e Cola',
                'Cole o código abaixo',
                'Confirme o pagamento',
                'Os pontos serão creditados automaticamente em até 5 minutos'
            ]
        })
    } catch (error: any) {
        console.error('PIX Error:', error)
        return NextResponse.json({ error: error.message || 'Falha na geração do PIX' }, { status: 500 })
    }
}
