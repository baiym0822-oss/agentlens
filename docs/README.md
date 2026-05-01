# AgentLens

**Open-source agent observability — log, track, and visualize your AI agent fleet.**

```bash
npm install agentlens
```

## Quick Start

```js
const { AgentLens } = require('agentlens');

const lens = new AgentLens({ project: 'my-ai-app' });

// Log every agent invocation
lens.log({
  agent: 'executor',
  task_id: 'fix-login-bug',
  success: true,
  tokens: 5000,
  duration_ms: 42000
});

// See what's happening
lens.dashboard();
```

Output:
```
╔══════════════════════════════════════════════════════════╗
║              AgentLens — Agent Dashboard                 ║
╠══════════════════════════════════════════════════════════╣
║ Agent                │ Success  │ Tokens     │ AvgTime  ║
║ executor             │ 94.2%    │ 82000      │ 42000ms  ║
║ code-reviewer        │ 99.1%    │ 31000      │ 18000ms  ║
║ debugger             │ 78.3%    │ 125000     │ 95000ms  ║ ← ⚠️
╚══════════════════════════════════════════════════════════╝
🚨 Agent "executor" failed 3x consecutively — circuit breaker triggered
```

## Why AgentLens?

You're deploying AI agents. They run autonomously. They fail silently.

- **40% of companies can't track AI agent ROI** (CB Insights 2026)
- **51% say monitoring agents at scale is their #1 blocker** (Dynatrace 2026)
- AgentLens provides the missing visibility — in under 10 lines of code.

## Features

- **Zero-dependency JSONL logging** — works with any agent framework
- **Built-in dashboard** — ASCII dashboard in terminal, no setup needed
- **Circuit breaker detection** — automatically flags failing agents
- **CSV export** — for spreadsheet analysis and sharing
- **Framework-agnostic** — Claude Code, OpenAI Agents, LangChain, custom agents
- **Cloud dashboard available** at [agentlens.dev](https://agentlens.dev) (coming soon)

## API

### `new AgentLens({ project, logDir? })`

Create a new metrics logger. Logs stored at `~/.agentlens/{project}-{date}.jsonl`.

### `lens.log({ agent, task_id, success?, tokens?, duration_ms?, retries?, rollbacks?, irkx? })`

Log an agent invocation. Returns the logged record.

### `lens.dashboard({ period? })`

Print ASCII dashboard. `period`: `'today'` | `'week'` | `'all'`.

### `lens.exportCSV(filepath?)`

Export all metrics as CSV.

## Cloud Dashboard

For team dashboards, alerting, and historical analytics: **[agentlens.dev](https://agentlens.dev)**

| Plan | Price | Features |
|------|-------|----------|
| Free | $0 | 1 agent, 7 days history |
| Starter | $29/mo | 10 agents, 30 days, email alerts |
| Pro | $99/mo | 50 agents, 90 days, custom dashboards |
| Team | $249/mo | Unlimited, SSO, priority support |

## License

MIT — open source, use anywhere. Cloud dashboard is a separate paid product.
