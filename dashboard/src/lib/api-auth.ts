import { prisma } from './prisma'

export async function validateApiKey(apiKey: string) {
  const user = await prisma.user.findUnique({
    where: { apiKey },
    select: { id: true, email: true, plan: true },
  })
  return user
}

export async function getOrCreateProject(userId: string, name: string) {
  const existing = await prisma.project.findUnique({
    where: { userId_name: { userId, name } },
  })
  if (existing) return existing

  return prisma.project.create({
    data: { userId, name },
  })
}
