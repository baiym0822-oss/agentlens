import { PrismaClient } from '../src/generated/prisma/client'
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'

const prisma = new PrismaClient({
  adapter: new PrismaBetterSqlite3({ url: 'file:./dev.db' })
})

async function main() {
  // Create demo user
  const user = await prisma.user.upsert({
    where: { email: 'demo@agentlens.dev' },
    update: {},
    create: {
      email: 'demo@agentlens.dev',
      name: 'Demo User',
      plan: 'free',
      apiKey: 'al_demo_1234567890',
    },
  })
  console.log('User:', user.id)

  // Create project
  const project = await prisma.project.upsert({
    where: { userId_name: { userId: user.id, name: 'agentlens-demo' } },
    update: {},
    create: {
      userId: user.id,
      name: 'agentlens-demo',
    },
  })
  console.log('Project:', project.id)

  // Delete old metrics
  await prisma.metric.deleteMany({ where: { projectId: project.id } })

  // Generate 200 realistic metrics over the past 7 days
  const agents = ['executor', 'code-reviewer', 'debugger', 'planner', 'verifier']
  const now = Date.now()

  const metrics = []
  for (let i = 0; i < 200; i++) {
    const agent = agents[i % agents.length]
    const offset = Math.floor(Math.random() * 7 * 86400000)
    const timestamp = new Date(now - offset)

    // Realistic success rates per agent
    const successRates = {
      executor: 0.92,
      'code-reviewer': 0.98,
      debugger: 0.72,
      planner: 0.88,
      verifier: 0.95,
    }
    const success = Math.random() < (successRates[agent] || 0.9)

    // Token ranges per agent
    const tokenRanges = {
      executor: [2000, 8000],
      'code-reviewer': [500, 3000],
      debugger: [3000, 15000],
      planner: [1000, 5000],
      verifier: [500, 2000],
    }
    const [min, max] = tokenRanges[agent] || [500, 5000]
    const tokens = Math.floor(Math.random() * (max - min) + min)

    const durationMs = Math.floor(Math.random() * 90000 + 5000)

    metrics.push({
      projectId: project.id,
      agent,
      taskId: `task-${Math.floor(i / 3)}`,
      sessionId: `session-${Math.floor(Math.random() * 20)}`,
      success,
      tokens,
      durationMs,
      retries: success ? 0 : Math.floor(Math.random() * 3),
      rollbacks: Math.random() < 0.08 ? 1 : 0,
      irkx: ['I', 'R', 'K'][Math.floor(Math.random() * 3)],
      timestamp,
    })
  }

  await prisma.metric.createMany({ data: metrics })
  console.log(`Inserted ${metrics.length} metrics`)

  // Ensure some consecutive failures for circuit breaker demo
  const debuggerFails = [
    { agent: 'debugger', taskId: 'cb-demo', success: false, tokens: 8000, durationMs: 60000, timestamp: new Date(now - 3600000) },
    { agent: 'debugger', taskId: 'cb-demo', success: false, tokens: 9500, durationMs: 75000, timestamp: new Date(now - 3000000) },
    { agent: 'debugger', taskId: 'cb-demo', success: false, tokens: 12000, durationMs: 90000, timestamp: new Date(now - 2400000) },
  ]
  for (const m of debuggerFails) {
    await prisma.metric.create({
      data: {
        projectId: project.id,
        sessionId: 'session-cb-test',
        retries: 0,
        rollbacks: 0,
        irkx: 'R',
        ...m,
      },
    })
  }
  console.log('Added 3 consecutive debugger failures for circuit breaker demo')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
