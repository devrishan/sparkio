import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { isMockModeEnabled, mockMemberService } from '@/lib/mock-data';

export async function GET(request: NextRequest) {
  try {
    // Check if mock mode is enabled
    if (isMockModeEnabled()) {
      console.log('[Tasks] Using mock data');
      const mockResult = await mockMemberService.getTasks();
      
      if (mockResult.success && mockResult.data?.tasks) {
        const searchParams = request.nextUrl.searchParams;
        const limit = parseInt(searchParams.get('limit') || '50');
        const offset = parseInt(searchParams.get('offset') || '0');
        const isActive = searchParams.get('is_active');
        const difficulty = searchParams.get('difficulty');
        
        let filteredTasks = mockResult.data.tasks;
        
        // Apply filters
        if (isActive !== null) {
          filteredTasks = filteredTasks.filter(t => t.is_active === (isActive === 'true'));
        }
        if (difficulty) {
          filteredTasks = filteredTasks.filter(t => t.difficulty === difficulty);
        }
        
        // Apply pagination
        const total = filteredTasks.length;
        const paginatedTasks = filteredTasks.slice(offset, offset + limit);
        
        return NextResponse.json({
          success: true,
          tasks: paginatedTasks,
          pagination: {
            total,
            limit,
            offset,
            hasMore: offset + limit < total,
          },
        });
      }
    }

    // Try Prisma, but fall back to mock if it fails
    try {
      const searchParams = request.nextUrl.searchParams;
      const categoryId = searchParams.get('category_id');
      const isActive = searchParams.get('is_active');
      const difficulty = searchParams.get('difficulty');
      const limit = parseInt(searchParams.get('limit') || '50');
      const offset = parseInt(searchParams.get('offset') || '0');

      const where: any = {
        isDeleted: false,
      };

      if (categoryId) {
        where.categoryId = categoryId;
      }

      if (isActive !== null) {
        where.isActive = isActive === 'true' || isActive === '1';
      }

      if (difficulty) {
        where.difficulty = difficulty;
      }

      // Don't show expired tasks
      where.OR = [
        { expiresAt: null },
        { expiresAt: { gt: new Date() } },
      ];

      const [tasks, total] = await Promise.all([
        prisma.task.findMany({
          where,
          include: {
            category: {
              select: {
                id: true,
                name: true,
                slug: true,
              },
            },
          },
          orderBy: [
            { priority: 'desc' },
            { createdAt: 'desc' },
          ],
          take: limit,
          skip: offset,
        }),
        prisma.task.count({ where }),
      ]);

      return NextResponse.json({
        success: true,
        tasks: tasks.map((task) => ({
          id: task.id,
          title: task.title,
          slug: task.slug,
          description: task.description,
          reward_amount: Number(task.rewardAmount),
          reward_coins: task.rewardCoins,
          difficulty: task.difficulty,
          is_active: task.isActive,
          max_submissions: task.maxSubmissions,
          expires_at: task.expiresAt?.toISOString() || null,
          created_at: task.createdAt.toISOString(),
          category: {
            id: task.category.id,
            name: task.category.name,
            slug: task.category.slug,
          },
        })),
        pagination: {
          total,
          limit,
          offset,
          hasMore: offset + limit < total,
        },
      });
    } catch (prismaError) {
      console.error('[Tasks] Prisma error, falling back to mock data:', prismaError);
      // Fall back to mock data
      const mockResult = await mockMemberService.getTasks();
      if (mockResult.success && mockResult.data?.tasks) {
        return NextResponse.json({
          success: true,
          tasks: mockResult.data.tasks,
          pagination: {
            total: mockResult.data.tasks.length,
            limit: 50,
            offset: 0,
            hasMore: false,
          },
        });
      }
      throw prismaError;
    }
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch tasks' },
      { status: 500 },
    );
  }
}

