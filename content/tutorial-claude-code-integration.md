# How to Monitor Claude Code Agents with AgentLens

*Published: May 2026 | AgentLens*

---

Claude Code orchestrates multiple agents — executor, code-reviewer, debugger, planner, and more. Each one consumes tokens, succeeds or fails, and contributes to (or detracts from) your overall productivity.

But Claude Code doesn't natively tell you:
- Which agents fail most often
- Where your token budget actually goes
- When an agent gets stuck in a failure loop

AgentLens plugs this gap in under 10 lines of code.

## The Setup

Install AgentLens in your Claude Code project:

```bash
npm install agentlens
```

Create a small wrapper that logs every agent invocation:

```js
// agent-tracker.js
const { AgentLens } = require('agentlens');

const lens = new AgentLens({ project: 'claude-code-agents' });

function trackInvocation(agent, taskId, result) {
  return lens.log({
    agent,
    task_id: taskId,
    success: result.success,
    tokens: result.tokens || 0,
    duration_ms: result.duration_ms || 0,
    retries: result.retries || 0,
    rollbacks: result.rollbacks || 0,
    irkx: result.irkx || 'I'
  });
}

// Daily dashboard
function dailyReport() {
  lens.dashboard({ period: 'today' });
}

// Weekly rollup
function weeklyReport() {
  lens.dashboard({ period: 'week' });
  lens.exportCSV(`./reports/weekly-${new Date().toISOString().slice(0, 10)}.csv`);
}

module.exports = { trackInvocation, dailyReport, weeklyReport };
```

## Integrating with Claude Code Agent Types

Claude Code uses different agent types for different tasks. Here's how to track each one:

### Executor Agent

The executor writes and modifies code. Track it at the task level:

```js
// After executor completes a task
trackInvocation('executor', taskId, {
  success: exitCode === 0 && !hadRollback,
  tokens: estimatedTokens,
  duration_ms: Date.now() - startTime,
  rollbacks: rollbackCount,
  irkx: 'R'  // Code changes are reversible via git
});
```

### Code Reviewer Agent

The reviewer checks code quality. Track per-review success:

```js
trackInvocation('code-reviewer', taskId, {
  success: review.findings.filter(f => f.severity === 'CRITICAL').length === 0,
  tokens: review.usage?.total_tokens || 0,
  duration_ms: reviewTime,
});
```

### Planner Agent

The planner produces specifications. Track plan quality:

```js
trackInvocation('planner', taskId, {
  success: !neededReplan,
  tokens: planTokens,
  duration_ms: planTime,
  irkx: 'I'  // Planning is idempotent
});
```

## The Dashboard After a Day of Claude Code

After a full day of development with Claude Code, your dashboard might look like this:

```
╔══════════════════════════════════════════════════════════╗
║              AgentLens — Agent Dashboard                 ║
║              claude-code-agents | 2026-05-01             ║
╠══════════════════════════════════════════════════════════╣
║ Agent                │ Success  │ Tokens     │ AvgTime  ║
╠══════════════════════════════════════════════════════════╣
║ code-reviewer        │ 97.2%    │ 28000      │ 15000ms  ║
║ debugger             │ 71.4%    │ 95000      │ 78000ms  ║ ← ⚠️
║ executor             │ 91.3%    │ 156000     │ 52000ms  ║
║ planner              │ 88.9%    │ 34000      │ 22000ms  ║
╠══════════════════════════════════════════════════════════╣
║ Total agents: 4                                          ║
║ Total invocations: 87                                    ║
╚══════════════════════════════════════════════════════════╝

  🚨 Agent "debugger" failed 3x consecutively
     Circuit breaker triggered at 2026-05-01T15:42:00Z
```

**What this tells you**: Your debugger is struggling. 71.4% success rate. 95K tokens burned. Three consecutive failures triggered the circuit breaker. Time to investigate whether the debugger's prompts need tuning.

## Automating Daily Reports

Add a cron job to get a daily dashboard:

```bash
# Run at 6pm daily
0 18 * * * node -e "require('./agent-tracker').dailyReport()" >> ~/agent-reports.log
```

Or hook it into your Claude Code session end:

```js
// In your Claude Code session cleanup
process.on('exit', () => {
  dailyReport();
  weeklyReport(); // Also exports CSV on Fridays
});
```

## What You'll Learn After a Week

After tracking for a week, patterns emerge:

1. **Which agent costs the most** — Is your executor burning 60% of tokens? Expected.
2. **Which agent fails most** — Debugger at 71% means something is wrong.
3. **Latency trends** — Is the planner getting slower? Maybe your task descriptions are getting more complex.
4. **Failure patterns** — Do failures cluster around specific task types?

These insights directly inform where to invest your optimization time.

## Going Further

- **Per-project tracking**: Use different `project` names for different Claude Code projects
- **Team dashboards**: Share CSV exports with your team
- **Cloud dashboard**: When you need historical analytics across multiple developers, check out [agentlens.dev](https://agentlens.dev)

---

*AgentLens is open source (MIT). [Star on GitHub](https://github.com/baiym0822-oss/agentlens). Built by people who run Claude Code agents every day.*
