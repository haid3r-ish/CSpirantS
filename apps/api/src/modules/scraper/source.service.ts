import { prisma } from '@repo/db';
import type { Prisma } from '@repo/db';

export interface GetSourcesOptions {
  isActive?: boolean;
  dedupeGroup?: string;
}

export async function getSources(options: GetSourcesOptions = {}) {
  const where: Prisma.ScraperSourceWhereInput = {};
  
  if (options.isActive !== undefined) {
    where.isActive = options.isActive;
  }
  if (options.dedupeGroup !== undefined) {
    where.dedupeGroup = options.dedupeGroup;
  }
  
  return prisma.scraperSource.findMany({
    where,
  });
}

export async function getSourceById(id: string) {
  return prisma.scraperSource.findUnique({
    where: { id },
  });
}

export async function createSource(data: { name: string; domain: string }) {
  return prisma.scraperSource.create({
    data,
  });
}

export async function updateSource(id: string, data: Prisma.ScraperSourceUpdateInput) {
  return prisma.scraperSource.update({
    where: { id },
    data,
  });
}

export async function deactivateSource(id: string) {
  return prisma.scraperSource.update({
    where: { id },
    data: { isActive: false },
  });
}
