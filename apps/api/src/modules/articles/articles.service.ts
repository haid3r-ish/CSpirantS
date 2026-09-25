import { prisma, Prisma } from '@repo/db';
import { NotFoundError } from '../../core/errors.js';

export interface GetArticlesOptions {
  cursor?: string;
  limit?: number;
  category?: string;
  sourceId?: string;
  startDate?: string;
  endDate?: string;
  search?: string;
}

export async function getArticles(options: GetArticlesOptions) {
  const limit = options.limit || 20;
  
  const where: Prisma.ArticleWhereInput = {
    status: 'EXTRACTED',
  };

  if (options.category) {
    where.category = options.category;
  }
  
  if (options.sourceId) {
    where.sourceId = options.sourceId;
  }
  
  if (options.startDate || options.endDate) {
    where.discoveredAt = {};
    if (options.startDate) where.discoveredAt.gte = new Date(options.startDate);
    if (options.endDate) where.discoveredAt.lte = new Date(options.endDate);
  }
  
  if (options.search) {
    where.OR = [
      { title: { contains: options.search, mode: 'insensitive' } },
      { description: { contains: options.search, mode: 'insensitive' } }
    ];
  }

  const articles = await prisma.article.findMany({
    where,
    take: limit + 1,
    cursor: options.cursor ? { id: options.cursor } : undefined,
    orderBy: { discoveredAt: 'desc' },
    include: {
      source: {
        select: {
          id: true,
          name: true,
          domain: true
        }
      }
    }
  });

  let nextCursor: typeof options.cursor | undefined = undefined;
  if (articles.length > limit) {
    const nextItem = articles.pop();
    nextCursor = nextItem!.id;
  }

  return {
    articles,
    nextCursor,
  };
}

export async function getArticle(id: string) {
  const article = await prisma.article.findUnique({
    where: { id },
    include: {
      source: true,
    }
  });

  if (!article) {
    throw new NotFoundError('Article not found');
  }
  
  if (article.status !== 'EXTRACTED') {
    throw new NotFoundError('Article is not available');
  }

  return article;
}
