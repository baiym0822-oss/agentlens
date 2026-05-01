# How to Monitor Your AI Agents in Under 10 Minutes

*Published: May 2026 | AgentLens*

---

You've got AI agents running. Maybe they're Claude Code agents, OpenAI assistants, LangChain pipelines, or custom orchestration. They do work. They consume tokens. They fail — sometimes silently.

Here's how to get visibility in under 10 minutes, with zero platform accounts and zero dependencies.

## Step 1: Install (10 seconds)

```bash
npm install agentlens
```

That's it. No config files. No API keys. No database.

## Step 2: Add Logging (2 minutes)

Find where your agent invocations happen. Add one line after each call:

```js
const { AgentLens } = require('agentlens');
const lens = new AgentLens({ project: 'my-agent-app' });

// After each agent invocation:
lens.log({
  agent: 'executor',
  task_id: 'fix-login-bug',
  success: true,
  tokens: 4200,
  duration_ms: 35000
});

lens.log({
  agent: 'code-reviewer',
  task_id: 'fix-login-bug',
  success: true,
  tokens: 1800,
  duration_ms: 12000
});

lens.log({
  agent: 'debugger',
  task_id: 'fix-login-bug',
  success: false,
  tokens: 8000,
  duration_ms: 60000,
  retries: 2
});
```

**The `agent` field is how you'll slice your data.** Use consistent names: `executor`, `code-reviewer`, `debugger`, `planner` — whatever maps to your actual agents.

**The `task_id` field groups related invocations.** If executor, reviewer, and debugger all worked on "fix-login-bug", use the same task_id to see the full picture.

**The `success` field drives alerts.** Be honest here — a false positive costs more than a missed success.

## Step 3: See Your Dashboard (10 seconds)

```bash
node -e "const {AgentLens}=require('agentlens');new AgentLens({project:'my-agent-app'}).dashboard()"
```

Output:

```
╔══════════════════════════════════════════════════════════╗
║              AgentLens — Agent Dashboard                 ║
║              my-agent-app | 2026-05-01                   ║
╠══════════════════════════════════════════════════════════╣
║ Agent                │ Success  │ Tokens     │ AvgTime  ║
╠══════════════════════════════════════════════════════════╣
║ code-reviewer        │ 99.1%    │ 31000      │ 12000ms  ║
║ debugger             │ 78.3%    │ 125000     │ 95000ms  ║ ← ⚠️
║ executor             │ 94.2%    │ 82000      │ 42000ms  ║
╠══════════════════════════════════════════════════════════╣
║ Total agents: 3                                          ║
║ Total invocations: 247                                   ║
╚══════════════════════════════════════════════════════════╝

  🚨 Agent "debugger" failed 3x consecutively
     Circuit breaker triggered at 2026-05-01T14:32:00Z
```

Three things to notice immediately:
1. **Debugger's success rate is 78.3%** — below healthy range
2. **Debugger burned 125K tokens** — the most expensive agent is the least reliable
3. **Circuit breaker fired** — 3 consecutive failures, something is systematically wrong

## Step 4: Export for Analysis (5 seconds)

```js
const path = lens.exportCSV();
console.log(path); // ~/.agentlens/my-agent-app-export.csv
```

Open in Excel, Google Sheets, or pipe into any analytics tool. JSONL means your data is always yours.

## Beyond the Basics

### Different time periods

```js
lens.dashboard({ period: 'today' });  // default
lens.dashboard({ period: 'week' });   // last 7 days
lens.dashboard({ period: 'all' });    // everything
```

### Custom log directory

```js
const lens = new AgentLens({
  project: 'production',
  logDir: '/var/log/agents'  // default: ~/.agentlens
});
```

### Track rollbacks and IRKX classification

```js
lens.log({
  agent: 'executor',
  task_id: 'deploy-migration',
  success: false,
  tokens: 12000,
  rollbacks: 1,
  irkx: 'R'  // Reversible action
});
```

## Where Your Data Lives

```
~/.agentlens/
├── my-agent-app-2026-05-01.jsonl   # Today's logs
├── metrics-my-agent-app.jsonl       # All-time rollup
└── my-agent-app-export.csv          # CSV export
```

JSONL means every line is valid JSON. You can `cat`, `grep`, `jq`, or pipe into any data pipeline. No vendor lock-in, ever.

## Next Steps

1. Add `lens.log()` after every agent invocation in your code
2. Run `lens.dashboard()` at the end of your day
3. Set up a cron job to export CSV weekly
4. When your agent fleet outgrows the terminal, check out the cloud dashboard at [agentlens.dev](https://agentlens.dev)

---

*AgentLens is open source (MIT). [Star on GitHub](https://github.com/baiym0822-oss/agentlens). Questions? Open an issue.*
