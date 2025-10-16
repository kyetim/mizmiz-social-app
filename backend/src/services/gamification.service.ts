import { prisma } from '../lib/prisma'
import {
  UserGamificationResponse,
  LeaderboardEntry,
  Badge,
} from '../interfaces/gamification.interface'


// Badge definitions
const BADGE_DEFINITIONS: Omit<Badge, 'earned' | 'earnedAt'>[] = [
  {
    id: 'rookie',
    name: 'Acemi Kategorizör',
    description: 'İlk 50 oyunu tamamla',
    icon: '🥉',
    requirement: '50 oy',
  },
  {
    id: 'enthusiast',
    name: 'Kategori Meraklısı',
    description: '200 oy tamamla',
    icon: '🥈',
    requirement: '200 oy',
  },
  {
    id: 'master',
    name: 'Kategori Ustası',
    description: '1000 oy tamamla',
    icon: '🥇',
    requirement: '1000 oy',
  },
  {
    id: 'humor_expert',
    name: 'Mizah Uzmanı',
    description: 'Mizah kategorisinde %90+ doğruluk',
    icon: '🎭',
    requirement: 'Mizah: 90% doğruluk',
  },
  {
    id: 'sports_expert',
    name: 'Spor Hakemi',
    description: 'Spor kategorisinde %90+ doğruluk',
    icon: '⚽',
    requirement: 'Spor: 90% doğruluk',
  },
  {
    id: 'tech_expert',
    name: 'Teknoloji Gurusu',
    description: 'Teknoloji kategorisinde %90+ doğruluk',
    icon: '💻',
    requirement: 'Teknoloji: 90% doğruluk',
  },
]

function calculateBadges(
  gamification: any,
  existingBadges: Badge[]
): Badge[] {
  const badges: Badge[] = []

  BADGE_DEFINITIONS.forEach((badgeDef) => {
    const existing = existingBadges.find((b) => b.id === badgeDef.id)

    let earned = false

    // Check badge requirements
    switch (badgeDef.id) {
      case 'rookie':
        earned = gamification.totalVotes >= 50
        break
      case 'enthusiast':
        earned = gamification.totalVotes >= 200
        break
      case 'master':
        earned = gamification.totalVotes >= 1000
        break
      // Category expert badges would require more complex logic
      default:
        earned = false
    }

    badges.push({
      ...badgeDef,
      earned,
      earnedAt: existing?.earnedAt,
    })
  })

  return badges
}

export const gamificationService = {
  // Get or create user gamification stats
  async getUserGamification(
    userId: string
  ): Promise<UserGamificationResponse> {
    let gamification = await prisma.userGamification.findUnique({
      where: { userId },
    })

    if (!gamification) {
      gamification = await prisma.userGamification.create({
        data: {
          userId,
          totalVotes: 0,
          accurateVotes: 0,
          categoryExpertiseScore: 0,
          badges: [],
          weeklyVotes: 0,
          weeklyAccuracy: 0,
        },
      })
    }

    // Parse badges and check for new ones
    const existingBadges = (gamification.badges as any) || []
    const badges = calculateBadges(gamification, existingBadges)

    return {
      ...gamification,
      badges,
    } as any
  },

  // Update gamification stats after a vote
  async updateAfterVote(
    userId: string,
    wasAccurate: boolean
  ): Promise<void> {
    const gamification = await prisma.userGamification.findUnique({
      where: { userId },
    })

    if (!gamification) {
      await prisma.userGamification.create({
        data: {
          userId,
          totalVotes: 1,
          accurateVotes: wasAccurate ? 1 : 0,
          categoryExpertiseScore: wasAccurate ? 1 : 0,
          weeklyVotes: 1,
          weeklyAccuracy: wasAccurate ? 1 : 0,
        },
      })
    } else {
      const newTotalVotes = gamification.totalVotes + 1
      const newAccurateVotes = gamification.accurateVotes + (wasAccurate ? 1 : 0)
      const accuracy = newAccurateVotes / newTotalVotes

      // Expertise score: accuracy * log(total votes)
      const expertiseScore =
        accuracy * Math.log10(Math.max(1, newTotalVotes)) * 100

      await prisma.userGamification.update({
        where: { userId },
        data: {
          totalVotes: newTotalVotes,
          accurateVotes: newAccurateVotes,
          categoryExpertiseScore: expertiseScore,
          weeklyVotes: { increment: 1 },
          weeklyAccuracy: wasAccurate ? { increment: 1 } : undefined,
        },
      })

      // Check for new badges
      const updatedGamification = await prisma.userGamification.findUnique({
        where: { userId },
      })

      if (updatedGamification) {
        const existingBadges = (updatedGamification.badges as any) || []
        const newBadges = calculateBadges(updatedGamification, existingBadges)

        // Save newly earned badges
        const earnedBadges = newBadges.filter(
          (b) =>
            b.earned &&
            !existingBadges.find((eb: Badge) => eb.id === b.id && eb.earned)
        )

        if (earnedBadges.length > 0) {
          const allBadges = existingBadges.map((eb: Badge) => {
            const newBadge = newBadges.find((nb) => nb.id === eb.id)
            if (newBadge?.earned && !eb.earned) {
              return { ...newBadge, earnedAt: new Date() }
            }
            return eb
          })

          // Add completely new badges
          earnedBadges.forEach((badge) => {
            if (!allBadges.find((b: Badge) => b.id === badge.id)) {
              allBadges.push({ ...badge, earnedAt: new Date() })
            }
          })

          await prisma.userGamification.update({
            where: { userId },
            data: {
              badges: allBadges as any,
            },
          })
        }
      }
    }
  },

  // Get leaderboard
  async getLeaderboard(limit: number = 50): Promise<LeaderboardEntry[]> {
    const gamifications = await prisma.userGamification.findMany({
      take: limit,
      orderBy: {
        categoryExpertiseScore: 'desc',
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            avatarUrl: true,
          },
        },
      },
    })

    return gamifications.map((g, index) => ({
      userId: g.userId,
      username: g.user.username,
      avatarUrl: g.user.avatarUrl,
      categoryExpertiseScore: g.categoryExpertiseScore,
      totalVotes: g.totalVotes,
      accurateVotes: g.accurateVotes,
      rank: index + 1,
      badges: (g.badges as any) || [],
    }))
  },

  // Reset weekly stats (should be called via cron job)
  async resetWeeklyStats(): Promise<void> {
    await prisma.userGamification.updateMany({
      data: {
        weeklyVotes: 0,
        weeklyAccuracy: 0,
      },
    })
  },

  // Update user ranks (should be called periodically)
  async updateRanks(): Promise<void> {
    const gamifications = await prisma.userGamification.findMany({
      orderBy: {
        categoryExpertiseScore: 'desc',
      },
    })

    for (let i = 0; i < gamifications.length; i++) {
      await prisma.userGamification.update({
        where: { id: gamifications[i].id },
        data: { rank: i + 1 },
      })
    }
  },
}

