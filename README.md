# AgentLens

**Open-source AI agent observability. See what your agents are doing — and what's going wrong.**

```bash
npm install github:baiym0822-oss/agentlens
```

## Why

40% of companies deploying AI agents can't track their ROI. Not because they don't care — because agent failures are silent. No crash logs. No error codes. Just subtly wrong output burning tokens in the background.

AgentLens gives you visibility in under 10 lines of code.

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

// See the dashboard
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
🚨 Agent "debugger" failed 3x consecutively — circuit breaker triggered
```

## Features

- **Zero dependencies** — the core SDK pulls in nothing
- **JSONL logging** — your data stays on your machine
- **Terminal dashboard** — `lens.dashboard()` shows success rates, token costs, latency per agent
- **Circuit breaker** — detects when an agent fails 3x consecutively
- **CSV export** — one command to export everything
- **Framework-agnostic** — works with Claude Code, OpenAI Agents, LangChain, custom agents
- **Cloud dashboard** — optional team dashboards at [agentlens.dev](https://agentlens.dev)

## API

### `new AgentLens({ project, logDir? })`

Create a logger. Logs stored at `~/.agentlens/{project}-{date}.jsonl`.

### `lens.log(entry)`

Log an agent invocation.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `agent` | string | Yes | Agent name |
| `task_id` | string | Yes | Task identifier |
| `success` | boolean | No | Whether invocation succeeded (default true) |
| `tokens` | number | No | Tokens consumed |
| `duration_ms` | number | No | Duration in milliseconds |
| `retries` | number | No | Number of retries |
| `rollbacks` | number | No | Number of rollbacks |
| `irkx` | string | No | IRKX classification (I/R/K/X) |

### `lens.dashboard({ period? })`

Print ASCII dashboard. `period`: `'today'` (default) | `'week'` | `'all'`.

### `lens.exportCSV(filepath?)`

Export all metrics as CSV.

### `lens.sync({ apiKey?, endpoint? })`

Sync local metrics to the AgentLens cloud dashboard.

## Cloud Dashboard

Team dashboards, alerting, and historical analytics at [agentlens.dev](https://agentlens.dev) — built with Next.js 16 + Prisma 7.

| Plan | Price | Agents | History | Alerts |
|------|-------|--------|---------|--------|
| Free | $0 | 1 | 7 days | — |
| Starter | $29/mo | 10 | 30 days | Email |
| Pro | $99/mo | 50 | 90 days | Email + Slack |
| Team | $249/mo | Unlimited | 1 year | All channels |

## vs Alternatives

| | AgentLens | LangSmith | Arize |
|---|---|---|---|
| Dependencies | 0 | 50+ | 100+ |
| Framework lock-in | None | LangChain | LangChain/LlamaIndex |
| Data location | Your machine | Cloud | Cloud |
| Setup time | 30 seconds | 30 minutes | 2+ hours |
| License | MIT | Proprietary | Proprietary |
| Price | Free (SDK) | $39+/mo | $500+/mo |

## License

MIT — use it anywhere. The cloud dashboard at [agentlens.dev](https://agentlens.dev) is a separate paid product.

## Links

- [Landing page](https://baiym0822-oss.github.io/agentlens/)
- [Cloud dashboard](https://agentlens.dev)
- [npm install](https://github.com/baiym0822-oss/agentlens)
