import { CategoryType } from '@prisma/client'
import {
  CategoryResponse,
  CreateCategoryDTO,
  UpdateCategoryDTO,
} from '../interfaces/category.interface'
import { prisma } from '../lib/prisma'

export const categoryService = {
  // Get all categories
  async getAllCategories(filters?: {
    type?: CategoryType
    isActive?: boolean
  }): Promise<CategoryResponse[]> {
    const where: any = {}

    if (filters?.type) {
      where.type = filters.type
    }

    if (filters?.isActive !== undefined) {
      where.isActive = filters.isActive
    }

    // Check temporal categories and update isActive
    const now = new Date()
    await prisma.category.updateMany({
      where: {
        type: CategoryType.TEMPORAL,
        endDate: {
          lt: now,
        },
        isActive: true,
      },
      data: {
        isActive: false,
      },
    })

    await prisma.category.updateMany({
      where: {
        type: CategoryType.TEMPORAL,
        startDate: {
          lte: now,
        },
        endDate: {
          gte: now,
        },
        isActive: false,
      },
      data: {
        isActive: true,
      },
    })

    const categories = await prisma.category.findMany({
      where,
      orderBy: [{ type: 'asc' }, { postsCount: 'desc' }],
    })

    return categories as CategoryResponse[]
  },

  // Get category by ID
  async getCategoryById(id: string): Promise<CategoryResponse | null> {
    const category = await prisma.category.findUnique({
      where: { id },
    })

    return category as CategoryResponse | null
  },

  // Get category by slug
  async getCategoryBySlug(slug: string): Promise<CategoryResponse | null> {
    const category = await prisma.category.findUnique({
      where: { slug },
    })

    return category as CategoryResponse | null
  },

  // Create category (Admin only)
  async createCategory(data: CreateCategoryDTO): Promise<CategoryResponse> {
    // Check if slug already exists
    const existing = await prisma.category.findUnique({
      where: { slug: data.slug },
    })

    if (existing) {
      throw new Error('Category with this slug already exists')
    }

    const category = await prisma.category.create({
      data: {
        name: data.name,
        slug: data.slug,
        icon: data.icon,
        color: data.color,
        description: data.description,
        type: data.type || CategoryType.STANDARD,
        startDate: data.startDate,
        endDate: data.endDate,
      },
    })

    return category as CategoryResponse
  },

  // Update category (Admin only)
  async updateCategory(
    id: string,
    data: UpdateCategoryDTO
  ): Promise<CategoryResponse> {
    const category = await prisma.category.findUnique({
      where: { id },
    })

    if (!category) {
      throw new Error('Category not found')
    }

    // If slug is being updated, check if it's unique
    if (data.slug && data.slug !== category.slug) {
      const existing = await prisma.category.findUnique({
        where: { slug: data.slug },
      })

      if (existing) {
        throw new Error('Category with this slug already exists')
      }
    }

    const updated = await prisma.category.update({
      where: { id },
      data,
    })

    return updated as CategoryResponse
  },

  // Delete category (Admin only)
  async deleteCategory(id: string): Promise<void> {
    const category = await prisma.category.findUnique({
      where: { id },
    })

    if (!category) {
      throw new Error('Category not found')
    }

    await prisma.category.delete({
      where: { id },
    })
  },

  // Get trending categories
  async getTrendingCategories(limit: number = 10): Promise<CategoryResponse[]> {
    const categories = await prisma.category.findMany({
      where: {
        isActive: true,
        type: CategoryType.STANDARD,
      },
      orderBy: {
        postsCount: 'desc',
      },
      take: limit,
    })

    return categories as CategoryResponse[]
  },

  // Get temporal categories (active or upcoming)
  async getTemporalCategories(): Promise<CategoryResponse[]> {
    const now = new Date()

    const categories = await prisma.category.findMany({
      where: {
        type: CategoryType.TEMPORAL,
        OR: [
          {
            isActive: true,
          },
          {
            startDate: {
              gte: now,
            },
          },
        ],
      },
      orderBy: {
        startDate: 'asc',
      },
    })

    return categories as CategoryResponse[]
  },
}

