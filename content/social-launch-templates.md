# Social Media Launch Templates

Launch day posts. Adapt as needed.

---

## X / Twitter

### Post 1 — The Problem

> 40% of companies deploying AI agents can't track their ROI.
>
> Not because they don't care. Because agent failures are silent.
>
> A crashed API returns 500. A failing agent generates output that looks correct but is subtly wrong.
>
> We built AgentLens to fix this. Open source. Zero deps. Under 10 lines.
>
> github.com/baiym0822-oss/agentlens

### Post 2 — Demo

> What agent observability looks like with AgentLens:
>
> `npm install github:baiym0822-oss/agentlens`
>
> 3 lines of code. Terminal dashboard.
> Detected: debugger at 78% success, 3 consecutive failures, circuit breaker triggered.
>
> You now know more about your agents than 40% of companies.

### Post 3 — The Feature

> AgentLens circuit breaker:
>
> → Agent fails once: noise
> → Agent fails twice: hm
> → Agent fails 3x: ALERT 🚨
>
> Silent failure detection, no config needed.
> Open source. MIT. Works with any agent framework.
>
> github.com/baiym0822-oss/agentlens

---

## LinkedIn

### Full Post

> **AI Agent Observability: The Gap Nobody Talks About**
>
> If you're deploying AI agents in production, here's a statistic: 40% of companies cannot track their agents' ROI (CB Insights, 2026).
>
> The problem isn't that people don't care about observability. It's that agents fail differently than traditional software. No crash logs. No error codes. Just silently wrong output burning tokens in the background.
>
> After running a fleet of 19 AI agents, we got tired of flying blind. So we built AgentLens — an open-source observability layer specifically for AI agents.
>
> What it does:
> - Logs every agent invocation to JSONL (your data, your machine)
> - Terminal dashboard shows per-agent success rates, token costs, and latency
> - Circuit breaker: detects when an agent fails 3x consecutively
> - Zero dependencies. Framework-agnostic. MIT license.
>
> Getting started:
> ```
> npm install github:baiym0822-oss/agentlens
> ```
>
> 3 lines of code. You know more about your agents than 40% of companies.
>
> GitHub: https://github.com/baiym0822-oss/agentlens
> Landing: https://baiym0822-oss.github.io/agentlens/
>
> Built for developers who run AI agents every day. If you deploy agents, we'd love your feedback.

---

## Reddit (r/programming, r/MachineLearning)

### Title

> Show HN: AgentLens — Open-source observability for AI agents (MIT, zero deps)

### Body

> We run a fleet of 19 AI agents across multiple projects. After months of not knowing which agents were failing, burning tokens, or getting stuck, we built AgentLens.
>
> **What it does:**
> - Logs agent invocations to local JSONL files
> - Terminal dashboard with success rates, token costs, latency per agent
> - Circuit breaker detection (3 consecutive failures → alert)
> - CSV export for team sharing
> - Zero dependencies, works with any agent framework
>
> **Quick start:**
> ```js
> const { AgentLens } = require('agentlens');
> const lens = new AgentLens({ project: 'production' });
>
> // After each agent call:
> lens.log({ agent: 'executor', task_id: 'fix-bug', success: true, tokens: 5000 });
>
> // End of day:
> lens.dashboard();
> ```
>
> **Why not LangSmith/Arize/DIY?**
> - LangSmith: Heavy, LangChain-locked, paid
> - Arize: Enterprise, complex, expensive
> - DIY: You'll spend more time building observability than using your agents
>
> AgentLens is the lightest-weight option. 30 seconds to set up. Your data stays on your machine.
>
> **GitHub:** https://github.com/baiym0822-oss/agentlens
> **Landing:** https://baiym0822-oss.github.io/agentlens/
>
> MIT license. Cloud dashboard coming for teams (free tier available).
>
> Would love feedback from anyone deploying agents in production.
