import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const project = searchParams.get('project') || 'default'
  const period = searchParams.get('period') || 'week'

  const cutoff = new Date()
  if (period === 'today') cutoff.setDate(cutoff.getDate() - 1)
  else if (period === 'week') cutoff.setDate(cutoff.getDate() - 7)
  else cutoff.setFullYear(2000)

  const metrics = await prisma.metric.findMany({
    where: {
      project: { name: project },
      timestamp: { gte: cutoff },
    },
    orderBy: { timestamp: 'desc' },
    take: 1000,
  })

  // Aggregate by agent
  const agents: Record<string, {
    total: number
    success: number
    tokens: number
    durationMs: number
    retries: number
    rollbacks: number
  }> = {}

  for (const m of metrics) {
    if (!agents[m.agent]) {
      agents[m.agent] = { total: 0, success: 0, tokens: 0, durationMs: 0, retries: 0, rollbacks: 0 }
    }
    agents[m.agent].total++
    if (m.success) agents[m.agent].success++
    agents[m.agent].tokens += m.tokens
    agents[m.agent].durationMs += m.durationMs
    agents[m.agent].retries += m.retries
    agents[m.agent].rollbacks += m.rollbacks
  }

  // Detect circuit breaker alerts
  const alerts: string[] = []
  const sorted = [...metrics].sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime())
  const consecutive: Record<string, number> = {}
  for (const m of sorted) {
    if (m.success) {
      consecutive[m.agent] = 0
    } else {
      consecutive[m.agent] = (consecutive[m.agent] || 0) + 1
      if (consecutive[m.agent] >= 3) {
        alerts.push(`Agent "${m.agent}" failed 3x consecutively at ${m.timestamp.toISOString()}`)
        consecutive[m.agent] = 0
      }
    }
  }

  return Response.json({ agents, alerts, total: metrics.length, period })
}
