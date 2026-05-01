# AgentLens — See what your AI agents are doing, and what's going wrong

**Open-source AI agent observability. Zero dependencies. Under 10 lines of code.**

---

## Maker Comment

Hey Product Hunt,

I built AgentLens because I kept running into the same problem: I'd ship a feature that uses AI agents, then hours later discover it had been silently failing because an agent hit a rate limit, returned malformed JSON, or spiraled into a retry loop. The logs were there, buried somewhere. I just never found them in time.

Last month I talked to a handful of teams deploying agents in production. Roughly 40% of them couldn't answer "how many agent calls actually succeeded this week?" That number stuck with me.

AgentLens is the tool I wanted. No SDK vendor lock-in. No YAML config ceremony. You drop a few lines into your Node.js app, and it starts writing structured JSONL traces to disk. A terminal dashboard shows you what's happening right now — calls per minute, token costs ticking up, failure rates. If the same agent fails three times in a row, it flags it as a likely circuit-breaker scenario and tells you before your users do.

It's MIT-licensed, framework-agnostic, and the core SDK has exactly zero dependencies. If you're deploying Claude Code agents, LangChain pipelines, or OpenAI Agent SDK workflows, it works the same way.

Would love to hear what breaks when you plug it into your stack. That's honestly the fastest way this gets better.

— Bai

---

## Description

### The Problem

AI agents are non-deterministic black boxes running inside your application. When they fail, they usually fail silently: a misparsed tool call, an exhausted context window, a downstream API timeout. Most teams piece together traces from scattered logs, if they catch the failure at all. 40% of companies deploying AI agents today cannot measure their ROI — not because the value isn't there, but because they have no visibility into what the agents are actually doing.

### The Solution

AgentLens is a lightweight observability SDK that attaches to your AI agent invocation layer and writes structured JSONL traces locally. No cloud dependency, no agent framework lock-in. You run a single terminal command and get a real-time dashboard of agent activity, failure patterns, and cost trends.

### Features

- **Real-time terminal dashboard** — calls/sec, success/failure rates, token consumption, cost estimates, all updating live in your terminal
- **Circuit breaker detection** — 3 consecutive failures from the same agent automatically triggers an alert so you catch systemic issues before users report them
- **Token cost tracking** — per-agent, per-model cost attribution so you can answer "what's our OpenAI bill this week?" without spreadsheets
- **CSV export** — dump traces for analysis in pandas, Excel, or your existing data pipeline
- **Framework-agnostic** — works with Claude Code, LangChain, OpenAI Agent SDK, Vercel AI SDK, or raw API calls
- **Zero dependencies** — the core SDK pulls in nothing. Install it, trace it, move on.
- **MIT licensed** — use it anywhere, no strings

---

## What Makes It Different

Most agent observability tools are cloud-first SaaS platforms that require you to route your traces through their infrastructure. AgentLens flips that: **everything runs locally by default**. JSONL files on disk. Terminal dashboard. No data leaves your machine unless you opt into the cloud dashboard.

The other difference is integration cost. The core instrumentation is a single-digit number of lines:

```js
import { AgentLens } from 'agentlens';
const lens = new AgentLens({ app: 'my-app' });

// Wrap any agent call
const result = await lens.trace('support-bot', async () => {
  return await myAgent.invoke(prompt);
});
```

That's it. Structured traces, error capture, latency measurement, and token counting — all from that one wrapper. No middleware registration. No configuration file. No provider-specific plugins to install.

The terminal dashboard is a single command:

```bash
npx agentlens dashboard
```

You get a live TUI showing throughput, errors, costs, and circuit breaker alerts. It reads the same JSONL files your app writes, so there's no separate ingestion pipeline.

---

## Links

- **GitHub** — https://github.com/baiym0822-oss/agentlens
- **Landing page** — https://baiym0822-oss.github.io/agentlens/
- **Install** — `npm install github:baiym0822-oss/agentlens`
- **License** — MIT
- **Pricing** — SDK: free forever. Cloud dashboard: $0 (hobby) / $29 (pro) / $99 (team) / $249 (enterprise)

---

## Quick Stats

| | |
|---|---|
| Lines of code to instrument | < 10 |
| Dependencies | 0 |
| License | MIT |
| Frameworks supported | Any Node.js agent framework |
| Cloud required | No (opt-in) |

---

*Built for developers who want to know what their agents are doing before their users do.*
