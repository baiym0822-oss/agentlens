import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { validateApiKey, getOrCreateProject } from '@/lib/api-auth'

export async function POST(request: NextRequest) {
  const apiKey = request.headers.get('x-api-key')
  if (!apiKey) {
    return Response.json({ error: 'Missing x-api-key header' }, { status: 401 })
  }

  const user = await validateApiKey(apiKey)
  if (!user) {
    return Response.json({ error: 'Invalid API key' }, { status: 401 })
  }

  const body = await request.json()
  const { project: projectName, metrics } = body

  if (!projectName || !metrics || !Array.isArray(metrics)) {
    return Response.json(
      { error: 'Invalid body. Expected { project: string, metrics: Array }' },
      { status: 400 }
    )
  }

  const project = await getOrCreateProject(user.id, projectName)

  const created = await Promise.all(
    metrics.map((m) =>
      prisma.metric.create({
        data: {
          projectId: project.id,
          agent: m.agent || 'unknown',
          taskId: m.task_id || 'unknown',
          sessionId: m.session_id,
          success: m.success ?? true,
          tokens: m.tokens || 0,
          durationMs: m.duration_ms || 0,
          retries: m.retries || 0,
          rollbacks: m.rollbacks || 0,
          irkx: m.irkx || 'I',
          meta: m.meta ? JSON.stringify(m.meta) : null,
        },
      })
    )
  )

  return Response.json({ ingested: created.length })
}
