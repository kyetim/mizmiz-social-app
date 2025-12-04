import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('🧹 Starting database cleanup...')

    // Delete in order of dependencies (child tables first)

    console.log('🗑️  Deleting Notifications...')
    await prisma.notification.deleteMany({})

    console.log('🗑️  Deleting Messages...')
    await prisma.message.deleteMany({})

    console.log('🗑️  Deleting Conversations...')
    await prisma.conversation.deleteMany({})

    console.log('🗑️  Deleting Comments...')
    await prisma.comment.deleteMany({})

    console.log('🗑️  Deleting Likes...')
    await prisma.like.deleteMany({})

    console.log('🗑️  Deleting Post Categories & Vibes...')
    await prisma.categoryVote.deleteMany({})
    await prisma.vibeVote.deleteMany({})
    await prisma.postCategory.deleteMany({})
    await prisma.postVibe.deleteMany({})

    console.log('🗑️  Deleting Posts...')
    await prisma.post.deleteMany({})

    console.log('🗑️  Deleting Follows...')
    await prisma.follow.deleteMany({})

    console.log('🗑️  Deleting Refresh Tokens...')
    await prisma.refreshToken.deleteMany({})

    console.log('🗑️  Deleting User Preferences...')
    await prisma.userCategoryPreference.deleteMany({})
    await prisma.userVibePreference.deleteMany({})
    await prisma.userGamification.deleteMany({})

    // Optional: Delete Users
    // If you want to keep users, comment out the next lines
    console.log('🗑️  Deleting Users...')
    await prisma.user.deleteMany({})

    console.log('✨ Database cleanup completed! Static data (Categories, Vibes) preserved.')
}

main()
    .catch((e) => {
        console.error('❌ Cleanup failed:', e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
