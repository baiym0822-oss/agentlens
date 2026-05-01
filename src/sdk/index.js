#!/usr/bin/env node
/**
 * AgentLens SDK — lightweight agent observability.
 * Log your agent invocations to JSONL, generate dashboards.
 *
 * Usage:
 *   const { AgentLens } = require('agentlens');
 *   const lens = new AgentLens({ project: 'my-agent-app' });
 *   lens.log({ agent: 'executor', success: true, tokens: 5000, duration: 30 });
 *   lens.dashboard(); // prints performance dashboard
 */

const fs = require('fs');
const path = require('path');
const os = require('os');

class AgentLens {
  constructor(opts = {}) {
    this.project = opts.project || 'default';
    this.logDir = opts.logDir || path.join(os.homedir(), '.agentlens');
    this.logFile = path.join(this.logDir, `${this.project}-${this._date()}.jsonl`);
    this.metricsFile = path.join(this.logDir, `metrics-${this.project}.jsonl`);
    this._ensureDir();
  }

  _ensureDir() {
    if (!fs.existsSync(this.logDir)) {
      fs.mkdirSync(this.logDir, { recursive: true });
    }
  }

  _date() {
    return new Date().toISOString().slice(0, 10);
  }

  /**
   * Log an agent invocation.
   * @param {Object} entry
   * @param {string} entry.agent - Agent name (e.g., 'executor', 'code-reviewer')
   * @param {string} entry.task_id - Task identifier
   * @param {string} [entry.session_id] - Session identifier
   * @param {boolean} entry.success - Whether the invocation succeeded
   * @param {number} [entry.tokens] - Estimated tokens consumed
   * @param {number} [entry.duration_ms] - Duration in milliseconds
   * @param {number} [entry.retries] - Number of retries
   * @param {number} [entry.rollbacks] - Number of rollbacks
   * @param {string} [entry.irkx] - IRKX classification (I/R/K/X)
   * @param {Object} [entry.meta] - Arbitrary metadata
   */
  log(entry) {
    const record = {
      ...entry,
      agent: entry.agent || 'unknown',
      task_id: entry.task_id || 'unknown',
      session_id: entry.session_id || this._sessionId(),
      timestamp: new Date().toISOString(),
      success: entry.success ?? true,
      tokens: entry.tokens || 0,
      duration_ms: entry.duration_ms || 0,
      retries: entry.retries || 0,
      rollbacks: entry.rollbacks || 0,
      irkx: entry.irkx || 'I',
    };

    fs.appendFileSync(this.logFile, JSON.stringify(record) + '\n');
    fs.appendFileSync(this.metricsFile, JSON.stringify(record) + '\n');
    return record;
  }

  _sessionId() {
    const key = 'AGENTLENS_SESSION_ID';
    if (!process.env[key]) {
      process.env[key] = `session-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    }
    return process.env[key];
  }

  /**
   * Print an ASCII dashboard of agent performance.
   * @param {Object} [opts]
   * @param {string} [opts.period] - 'today' | 'week' | 'all' (default: 'today')
   */
  dashboard(opts = {}) {
    const period = opts.period || 'today';
    const entries = this._loadEntries(period);

    if (entries.length === 0) {
      console.log('No agent data found for period:', period);
      console.log('Start logging with: lens.log({ agent: "my-agent", success: true, tokens: 1000 })');
      return { agents: {}, total: 0 };
    }

    const agents = {};
    for (const e of entries) {
      if (!agents[e.agent]) {
        agents[e.agent] = { success: 0, total: 0, tokens: 0, duration_ms: 0, retries: 0, rollbacks: 0 };
      }
      agents[e.agent].total++;
      if (e.success) agents[e.agent].success++;
      agents[e.agent].tokens += e.tokens || 0;
      agents[e.agent].duration_ms += e.duration_ms || 0;
      agents[e.agent].retries += e.retries || 0;
      agents[e.agent].rollbacks += e.rollbacks || 0;
    }

    // Detect circuit breaker events
    const alerts = this._detectAlerts(entries);

    console.log('╔══════════════════════════════════════════════════════════╗');
    console.log('║              AgentLens — Agent Dashboard                 ║');
    console.log(`║              ${this.project} | ${new Date().toISOString().slice(0, 10)}             ║`);
    console.log('╠══════════════════════════════════════════════════════════╣');
    console.log(`║ ${'Agent'.padEnd(20)} │ ${'Success'.padEnd(8)} │ ${'Tokens'.padEnd(10)} │ ${'AvgTime'.padEnd(8)} ║`);
    console.log('╠══════════════════════════════════════════════════════════╣');

    for (const [name, data] of Object.entries(agents).sort()) {
      const rate = data.total > 0 ? `${(data.success / data.total * 100).toFixed(1)}%` : 'N/A';
      const avgTime = data.total > 0 ? `${Math.round(data.duration_ms / data.total)}ms` : 'N/A';
      const flag = (data.total >= 3 && data.success / data.total < 0.7) ? ' ⚠️' : '';
      console.log(`║ ${name.padEnd(20)} │ ${rate.padEnd(8)} │ ${String(data.tokens).padEnd(10)} │ ${avgTime.padEnd(8)} ║${flag}`);
    }

    console.log('╠══════════════════════════════════════════════════════════╣');
    console.log(`║ Total agents: ${Object.keys(agents).length.toString().padEnd(40)} ║`);
    console.log(`║ Total invocations: ${entries.length.toString().padEnd(33)} ║`);
    console.log('╚══════════════════════════════════════════════════════════╝');

    if (alerts.length > 0) {
      console.log('\n  🚨 ALERTS:');
      for (const alert of alerts) {
        console.log(`  ${alert}`);
      }
    }

    return { agents, total: entries.length, alerts };
  }

  _loadEntries(period) {
    const entries = [];
    const files = fs.readdirSync(this.logDir).filter(f => f.startsWith(this.project));

    let cutoff = 0;
    if (period === 'today') cutoff = Date.now() - 86400000;
    else if (period === 'week') cutoff = Date.now() - 7 * 86400000;

    for (const file of files) {
      try {
        const content = fs.readFileSync(path.join(this.logDir, file), 'utf-8');
        for (const line of content.trim().split('\n')) {
          if (!line) continue;
          const entry = JSON.parse(line);
          const ts = new Date(entry.timestamp).getTime();
          if (!cutoff || ts >= cutoff) entries.push(entry);
        }
      } catch (_) {}
    }
    return entries;
  }

  _detectAlerts(entries) {
    const alerts = [];
    const consecutive = {};
    const sorted = entries.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

    for (const e of sorted) {
      if (e.success) {
        consecutive[e.agent] = 0;
      } else {
        consecutive[e.agent] = (consecutive[e.agent] || 0) + 1;
        if (consecutive[e.agent] >= 3) {
          alerts.push(`Agent "${e.agent}" failed 3x consecutively at ${e.timestamp} — circuit breaker triggered`);
          consecutive[e.agent] = 0;
        }
      }
    }
    return alerts;
  }

  /**
   * Sync local metrics to the AgentLens cloud dashboard.
   * Requires an API key from agentlens.dev.
   * @param {Object} [opts]
   * @param {string} [opts.apiKey] - API key (defaults to AGENTLENS_API_KEY env var)
   * @param {string} [opts.endpoint] - Cloud endpoint (defaults to https://agentlens.dev/api/metrics/ingest)
   */
  async sync(opts = {}) {
    const apiKey = opts.apiKey || process.env.AGENTLENS_API_KEY;
    if (!apiKey) {
      throw new Error('API key required. Set AGENTLENS_API_KEY env var or pass { apiKey } option.');
    }

    const endpoint = opts.endpoint || 'https://agentlens.dev/api/metrics/ingest';
    const entries = this._loadEntries('all');
    if (entries.length === 0) {
      return { synced: 0 };
    }

    // Use built-in https (Node.js native)
    const https = require('https');
    const { URL } = require('url');
    const url = new URL(endpoint);

    const body = JSON.stringify({
      project: this.project,
      metrics: entries.map((e) => ({
        agent: e.agent,
        task_id: e.task_id,
        session_id: e.session_id,
        success: e.success,
        tokens: e.tokens,
        duration_ms: e.duration_ms,
        retries: e.retries,
        rollbacks: e.rollbacks,
        irkx: e.irkx,
        meta: e.meta,
        timestamp: e.timestamp,
      })),
    });

    return new Promise((resolve, reject) => {
      const req = https.request(
        {
          hostname: url.hostname,
          port: url.port || 443,
          path: url.pathname,
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': apiKey,
            'Content-Length': Buffer.byteLength(body),
          },
        },
        (res) => {
          let data = '';
          res.on('data', (chunk) => (data += chunk));
          res.on('end', () => {
            try {
              resolve(JSON.parse(data));
            } catch {
              reject(new Error(`Sync failed (${res.statusCode}): ${data}`));
            }
          });
        }
      );
      req.on('error', reject);
      req.write(body);
      req.end();
    });
  }

  /**
   * Export all metrics as CSV (for spreadsheet analysis).
   */
  exportCSV(filepath) {
    const entries = this._loadEntries('all');
    const headers = ['timestamp', 'agent', 'task_id', 'success', 'tokens', 'duration_ms', 'retries', 'rollbacks', 'irkx'];
    const lines = [headers.join(',')];
    for (const e of entries) {
      lines.push(headers.map(h => e[h] ?? '').join(','));
    }
    const dest = filepath || path.join(this.logDir, `${this.project}-export.csv`);
    fs.writeFileSync(dest, lines.join('\n'));
    return dest;
  }
}

module.exports = { AgentLens };

// CLI: node -e "const {AgentLens}=require('./index');new AgentLens({project:'my-agents'}).dashboard()"
if (require.main === module) {
  const lens = new AgentLens({ project: process.argv[2] || 'default' });
  lens.dashboard({ period: process.argv[3] || 'today' });
}
