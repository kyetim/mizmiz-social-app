import { VibeResponse, CreateVibeDTO, UpdateVibeDTO } from '../interfaces/category.interface'
import { prisma } from '../lib/prisma'

export const vibeService = {
  // Get all vibes
  async getAllVibes(isActive?: boolean): Promise<VibeResponse[]> {
    const where: any = {}

    if (isActive !== undefined) {
      where.isActive = isActive
    }

    const vibes = await prisma.vibe.findMany({
      where,
      orderBy: {
        postsCount: 'desc',
      },
    })

    return vibes as VibeResponse[]
  },

  // Get vibe by ID
  async getVibeById(id: string): Promise<VibeResponse | null> {
    const vibe = await prisma.vibe.findUnique({
      where: { id },
    })

    return vibe as VibeResponse | null
  },

  // Get vibe by slug
  async getVibeBySlug(slug: string): Promise<VibeResponse | null> {
    const vibe = await prisma.vibe.findUnique({
      where: { slug },
    })

    return vibe as VibeResponse | null
  },

  // Create vibe (Admin only)
  async createVibe(data: CreateVibeDTO): Promise<VibeResponse> {
    // Check if slug already exists
    const existing = await prisma.vibe.findUnique({
      where: { slug: data.slug },
    })

    if (existing) {
      throw new Error('Vibe with this slug already exists')
    }

    const vibe = await prisma.vibe.create({
      data: {
        name: data.name,
        slug: data.slug,
        icon: data.icon,
        color: data.color,
        description: data.description,
      },
    })

    return vibe as VibeResponse
  },

  // Update vibe (Admin only)
  async updateVibe(id: string, data: UpdateVibeDTO): Promise<VibeResponse> {
    const vibe = await prisma.vibe.findUnique({
      where: { id },
    })

    if (!vibe) {
      throw new Error('Vibe not found')
    }

    // If slug is being updated, check if it's unique
    if (data.slug && data.slug !== vibe.slug) {
      const existing = await prisma.vibe.findUnique({
        where: { slug: data.slug },
      })

      if (existing) {
        throw new Error('Vibe with this slug already exists')
      }
    }

    const updated = await prisma.vibe.update({
      where: { id },
      data,
    })

    return updated as VibeResponse
  },

  // Delete vibe (Admin only)
  async deleteVibe(id: string): Promise<void> {
    const vibe = await prisma.vibe.findUnique({
      where: { id },
    })

    if (!vibe) {
      throw new Error('Vibe not found')
    }

    await prisma.vibe.delete({
      where: { id },
    })
  },
}

