import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/firebase-admin'
import { FieldValue } from 'firebase-admin/firestore'

// Daily bonus configuration
const DAILY_BONUS = {
    basePoints: 2,
    streakBonus: 1, // Extra point per streak day (up to 7)
    maxStreak: 7
}

export async function POST(req: NextRequest) {
    try {
        const { userId } = await req.json()

        if (!userId) {
            return NextResponse.json({ error: 'userId is required' }, { status: 400 })
        }

        const userRef = db.collection('users').doc(userId)
        const userDoc = await userRef.get()

        if (!userDoc.exists) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 })
        }

        const userData = userDoc.data()!
        const now = new Date()
        const today = now.toISOString().split('T')[0] // YYYY-MM-DD

        // Check if already claimed today
        const lastClaimDate = userData.lastDailyBonusDate
        if (lastClaimDate === today) {
            return NextResponse.json({
                error: 'Bonus already claimed today',
                alreadyClaimed: true,
                nextClaimAt: getNextMidnight()
            }, { status: 400 })
        }

        // Calculate streak
        let currentStreak = userData.dailyStreak || 0
        const yesterday = new Date(now)
        yesterday.setDate(yesterday.getDate() - 1)
        const yesterdayStr = yesterday.toISOString().split('T')[0]

        if (lastClaimDate === yesterdayStr) {
            // Consecutive day - increase streak
            currentStreak = Math.min(currentStreak + 1, DAILY_BONUS.maxStreak)
        } else {
            // Streak broken - reset to 1
            currentStreak = 1
        }

        // Calculate bonus points
        const streakBonus = Math.min(currentStreak - 1, DAILY_BONUS.maxStreak - 1) * DAILY_BONUS.streakBonus
        const totalBonus = DAILY_BONUS.basePoints + streakBonus

        // Update user
        await userRef.update({
            cosmicPoints: FieldValue.increment(totalBonus),
            dailyStreak: currentStreak,
            lastDailyBonusDate: today,
            totalDailyBonusClaimed: FieldValue.increment(1)
        })

        return NextResponse.json({
            success: true,
            pointsAwarded: totalBonus,
            basePoints: DAILY_BONUS.basePoints,
            streakBonus,
            currentStreak,
            maxStreak: DAILY_BONUS.maxStreak,
            message: getStreakMessage(currentStreak)
        })

    } catch (error: any) {
        console.error('Daily bonus error:', error)
        return NextResponse.json({ error: error.message || 'Failed to claim bonus' }, { status: 500 })
    }
}

function getNextMidnight(): string {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    tomorrow.setHours(0, 0, 0, 0)
    return tomorrow.toISOString()
}

function getStreakMessage(streak: number): string {
    const messages = [
        'Sua jornada cósmica começa hoje!',
        'Dois dias consecutivos! As estrelas sorriem para você.',
        'Três dias! Sua energia está crescendo.',
        'Quatro dias! O universo nota sua dedicação.',
        'Cinco dias! Você está em sintonia com o cosmos.',
        'Seis dias! Sua luz interior brilha intensamente.',
        'Sete dias! Você alcançou a harmonia celestial! 🌟'
    ]
    return messages[Math.min(streak - 1, messages.length - 1)]
}
