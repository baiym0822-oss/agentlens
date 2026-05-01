const { PrismaBetterSqlite3 } = require('@prisma/adapter-better-sqlite3');
const { PrismaClient } = require('../src/generated/prisma/client');

const prisma = new PrismaClient({
  adapter: new PrismaBetterSqlite3({ url: 'file:./dev.db' })
});

async function main() {
  const user = await prisma.user.upsert({
    where: { email: 'demo@agentlens.dev' },
    update: {},
    create: {
      email: 'demo@agentlens.dev',
      name: 'Demo User',
      plan: 'free',
      apiKey: 'al_demo_1234567890',
    },
  });
  console.log('User:', user.id);

  const project = await prisma.project.upsert({
    where: { userId_name: { userId: user.id, name: 'agentlens-demo' } },
    update: {},
    create: { userId: user.id, name: 'agentlens-demo' },
  });
  console.log('Project:', project.id);

  await prisma.metric.deleteMany({ where: { projectId: project.id } });

  const agents = ['executor', 'code-reviewer', 'debugger', 'planner', 'verifier'];
  const now = Date.now();
  const successRates = { executor: 0.92, 'code-reviewer': 0.98, debugger: 0.72, planner: 0.88, verifier: 0.95 };
  const tokenRanges = { executor: [2000, 8000], 'code-reviewer': [500, 3000], debugger: [3000, 15000], planner: [1000, 5000], verifier: [500, 2000] };

  const metrics = [];
  for (let i = 0; i < 200; i++) {
    const agent = agents[i % agents.length];
    const offset = Math.floor(Math.random() * 7 * 86400000);
    const timestamp = new Date(now - offset);
    const success = Math.random() < (successRates[agent] || 0.9);
    const [min, max] = tokenRanges[agent] || [500, 5000];
    const tokens = Math.floor(Math.random() * (max - min) + min);
    const durationMs = Math.floor(Math.random() * 90000 + 5000);

    metrics.push({
      projectId: project.id, agent,
      taskId: `task-${Math.floor(i / 3)}`,
      sessionId: `session-${Math.floor(Math.random() * 20)}`,
      success, tokens, durationMs,
      retries: success ? 0 : Math.floor(Math.random() * 3),
      rollbacks: Math.random() < 0.08 ? 1 : 0,
      irkx: ['I', 'R', 'K'][Math.floor(Math.random() * 3)],
      timestamp,
    });
  }

  await prisma.metric.createMany({ data: metrics });
  console.log(`Inserted ${metrics.length} metrics`);

  // Circuit breaker demo: 3 consecutive debugger failures
  const baseTime = now - 3600000;
  for (let j = 0; j < 3; j++) {
    await prisma.metric.create({
      data: {
        projectId: project.id, sessionId: 'session-cb-test',
        agent: 'debugger', taskId: 'cb-demo', success: false,
        tokens: 8000 + j * 2000, durationMs: 60000 + j * 15000,
        retries: 0, rollbacks: 0, irkx: 'R',
        timestamp: new Date(baseTime - j * 3600000),
      },
    });
  }
  console.log('Added 3 consecutive debugger failures');

  console.log('\nSeed complete! API Key: al_demo_1234567890');
}

main().catch(console.error).finally(() => prisma.$disconnect());
