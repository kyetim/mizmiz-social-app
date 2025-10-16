import { PrismaClient, CategoryType } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // Create Categories
  console.log('📂 Creating categories...')
  const categories = [
    {
      name: 'Mizah',
      slug: 'mizah',
      icon: '🎭',
      color: '#FFB6C1',
      description: 'Komik, eğlenceli ve güldüren içerikler',
      type: CategoryType.STANDARD,
    },
    {
      name: 'Spor',
      slug: 'spor',
      icon: '⚽',
      color: '#90EE90',
      description: 'Spor haberleri, maç sonuçları ve spor tartışmaları',
      type: CategoryType.STANDARD,
    },
    {
      name: 'Teknoloji',
      slug: 'teknoloji',
      icon: '💻',
      color: '#87CEEB',
      description: 'Teknoloji haberleri, yazılım ve donanım',
      type: CategoryType.STANDARD,
    },
    {
      name: 'Sanat',
      slug: 'sanat',
      icon: '🎨',
      color: '#DDA0DD',
      description: 'Resim, müzik, edebiyat ve sanat eserleri',
      type: CategoryType.STANDARD,
    },
    {
      name: 'Yemek',
      slug: 'yemek',
      icon: '🍴',
      color: '#FFD700',
      description: 'Yemek tarifleri, restoran önerileri',
      type: CategoryType.STANDARD,
    },
    {
      name: 'Gezi',
      slug: 'gezi',
      icon: '✈️',
      color: '#FFA07A',
      description: 'Seyahat tavsiyeleri ve gezi notları',
      type: CategoryType.STANDARD,
    },
    {
      name: 'Gündem',
      slug: 'gundem',
      icon: '📰',
      color: '#FF6347',
      description: 'Güncel haberler ve gündemdeki konular',
      type: CategoryType.STANDARD,
    },
    {
      name: 'Siyaset',
      slug: 'siyaset',
      icon: '🏛️',
      color: '#708090',
      description: 'Siyasi haberler ve tartışmalar',
      type: CategoryType.STANDARD,
    },
    {
      name: 'Eğitim',
      slug: 'egitim',
      icon: '📚',
      color: '#4682B4',
      description: 'Eğitim, öğrenme ve bilgi paylaşımı',
      type: CategoryType.STANDARD,
    },
    {
      name: 'Moda',
      slug: 'moda',
      icon: '👗',
      color: '#FF1493',
      description: 'Moda trendleri, stil önerileri',
      type: CategoryType.STANDARD,
    },
    {
      name: 'Oyun',
      slug: 'oyun',
      icon: '🎮',
      color: '#9370DB',
      description: 'Video oyunları, e-spor ve oyun haberleri',
      type: CategoryType.STANDARD,
    },
    {
      name: 'Müzik',
      slug: 'muzik',
      icon: '🎵',
      color: '#FF69B4',
      description: 'Müzik, şarkılar ve konserler',
      type: CategoryType.STANDARD,
    },
  ]

  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: {},
      create: category,
    })
  }
  console.log(`✅ Created ${categories.length} categories`)

  // Create Vibes
  console.log('😊 Creating vibes...')
  const vibes = [
    {
      name: 'Pozitif',
      slug: 'positive',
      icon: '😊',
      color: '#FFD700',
      description: 'Mutlu, neşeli ve pozitif enerji veren içerikler',
    },
    {
      name: 'Tartışmalı',
      slug: 'controversial',
      icon: '🔥',
      color: '#FF4500',
      description: 'Tartışma yaratabilecek, polarize edici içerikler',
    },
    {
      name: 'Düşündürücü',
      slug: 'thoughtful',
      icon: '💭',
      color: '#6A5ACD',
      description: 'Derin, düşünmeye sevk eden içerikler',
    },
    {
      name: 'Eğlenceli',
      slug: 'fun',
      icon: '😂',
      color: '#FF69B4',
      description: 'Hafif, eğlenceli ve keyifli içerikler',
    },
    {
      name: 'Üzücü',
      slug: 'sad',
      icon: '😢',
      color: '#4682B4',
      description: 'Duygusal, hüzünlü içerikler',
    },
    {
      name: 'Öfke',
      slug: 'angry',
      icon: '💢',
      color: '#DC143C',
      description: 'Öfke, rahatsızlık içeren içerikler',
    },
    {
      name: 'İlham Verici',
      slug: 'inspiring',
      icon: '✨',
      color: '#FFD700',
      description: 'Motive edici, ilham verici içerikler',
    },
    {
      name: 'Bilgilendirici',
      slug: 'informative',
      icon: '📖',
      color: '#20B2AA',
      description: 'Eğitici, bilgi veren içerikler',
    },
  ]

  for (const vibe of vibes) {
    await prisma.vibe.upsert({
      where: { slug: vibe.slug },
      update: {},
      create: vibe,
    })
  }
  console.log(`✅ Created ${vibes.length} vibes`)

  console.log('🎉 Seed completed successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

