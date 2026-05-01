import { prisma } from "@/lib/prisma";
import { AlertTriangle, CheckCircle, Activity, BarChart3 } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 86400000);

  const metrics = await prisma.metric.findMany({
    where: { timestamp: { gte: weekAgo } },
    orderBy: { timestamp: "desc" },
  });

  // Aggregate by agent
  const agents: Record<
    string,
    {
      total: number;
      success: number;
      tokens: number;
      durationMs: number;
      retries: number;
      rollbacks: number;
    }
  > = {};

  for (const m of metrics) {
    if (!agents[m.agent]) {
      agents[m.agent] = {
        total: 0,
        success: 0,
        tokens: 0,
        durationMs: 0,
        retries: 0,
        rollbacks: 0,
      };
    }
    agents[m.agent].total++;
    if (m.success) agents[m.agent].success++;
    agents[m.agent].tokens += m.tokens;
    agents[m.agent].durationMs += m.durationMs;
    agents[m.agent].retries += m.retries;
    agents[m.agent].rollbacks += m.rollbacks;
  }

  // Circuit breaker alerts
  const alerts: string[] = [];
  const sorted = [...metrics].sort(
    (a, b) => a.timestamp.getTime() - b.timestamp.getTime()
  );
  const consecutive: Record<string, number> = {};
  for (const m of sorted) {
    if (m.success) {
      consecutive[m.agent] = 0;
    } else {
      consecutive[m.agent] = (consecutive[m.agent] || 0) + 1;
      if (consecutive[m.agent] >= 3) {
        alerts.push(
          `Agent "${m.agent}" failed 3x consecutively at ${m.timestamp.toISOString()}`
        );
        consecutive[m.agent] = 0;
      }
    }
  }

  const totalSuccess = metrics.filter((m) => m.success).length;
  const successRate =
    metrics.length > 0
      ? ((totalSuccess / metrics.length) * 100).toFixed(1)
      : "N/A";
  const totalTokens = metrics
    .reduce((sum, m) => sum + m.tokens, 0)
    .toLocaleString();

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-1">Agent Dashboard</h1>
        <p className="text-zinc-500 text-sm">Last 7 days</p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-[#131320] border border-[#1e1e35] rounded-xl p-5">
          <div className="flex items-center gap-2 text-zinc-500 text-xs mb-2 uppercase tracking-wide">
            <Activity className="w-3.5 h-3.5" />
            Invocations
          </div>
          <div className="text-2xl font-bold">{metrics.length}</div>
        </div>
        <div className="bg-[#131320] border border-[#1e1e35] rounded-xl p-5">
          <div className="flex items-center gap-2 text-zinc-500 text-xs mb-2 uppercase tracking-wide">
            <CheckCircle className="w-3.5 h-3.5" />
            Success Rate
          </div>
          <div className="text-2xl font-bold text-green-400">
            {successRate}%
          </div>
        </div>
        <div className="bg-[#131320] border border-[#1e1e35] rounded-xl p-5">
          <div className="flex items-center gap-2 text-zinc-500 text-xs mb-2 uppercase tracking-wide">
            <BarChart3 className="w-3.5 h-3.5" />
            Total Tokens
          </div>
          <div className="text-2xl font-bold">{totalTokens}</div>
        </div>
        <div className="bg-[#131320] border border-[#1e1e35] rounded-xl p-5">
          <div className="flex items-center gap-2 text-zinc-500 text-xs mb-2 uppercase tracking-wide">
            <AlertTriangle className="w-3.5 h-3.5" />
            Agents Tracked
          </div>
          <div className="text-2xl font-bold">{Object.keys(agents).length}</div>
        </div>
      </div>

      {/* Alerts */}
      {alerts.length > 0 && (
        <div className="mb-8 bg-red-500/10 border border-red-500/30 rounded-xl p-4">
          <div className="flex items-center gap-2 text-red-400 font-semibold mb-2">
            <AlertTriangle className="w-4 h-4" />
            Circuit Breaker Alerts
          </div>
          {alerts.map((a, i) => (
            <div key={i} className="text-sm text-red-300/80 font-mono">
              {a}
            </div>
          ))}
        </div>
      )}

      {/* Agent table */}
      <div className="bg-[#131320] border border-[#1e1e35] rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#1e1e35] text-zinc-500 text-xs uppercase tracking-wide">
                <th className="text-left py-3 px-4 font-medium">Agent</th>
                <th className="text-right py-3 px-4 font-medium">Total</th>
                <th className="text-right py-3 px-4 font-medium">Success</th>
                <th className="text-right py-3 px-4 font-medium">Tokens</th>
                <th className="text-right py-3 px-4 font-medium">Avg Time</th>
                <th className="text-right py-3 px-4 font-medium">Retries</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(agents)
                .sort(([, a], [, b]) => b.total - a.total)
                .map(([name, data]) => {
                  const rate =
                    data.total > 0
                      ? ((data.success / data.total) * 100).toFixed(1)
                      : "N/A";
                  const avgTime =
                    data.total > 0
                      ? `${Math.round(data.durationMs / data.total)}ms`
                      : "N/A";
                  const isLow =
                    data.total >= 3 && data.success / data.total < 0.7;
                  return (
                    <tr
                      key={name}
                      className={`border-b border-[#1e1e35] ${
                        isLow ? "bg-yellow-500/5" : ""
                      }`}
                    >
                      <td className="py-3 px-4 flex items-center gap-2">
                        {isLow ? (
                          <AlertTriangle className="w-4 h-4 text-yellow-400" />
                        ) : (
                          <CheckCircle className="w-4 h-4 text-green-400" />
                        )}
                        <span className="font-mono font-medium">{name}</span>
                      </td>
                      <td className="text-right py-3 px-4 text-zinc-300">
                        {data.total}
                      </td>
                      <td
                        className={`text-right py-3 px-4 font-mono ${
                          isLow ? "text-yellow-400" : "text-green-400"
                        }`}
                      >
                        {rate}%
                      </td>
                      <td className="text-right py-3 px-4 text-zinc-300 font-mono">
                        {data.tokens.toLocaleString()}
                      </td>
                      <td className="text-right py-3 px-4 text-zinc-400 font-mono">
                        {avgTime}
                      </td>
                      <td className="text-right py-3 px-4 text-zinc-400">
                        {data.retries}
                      </td>
                    </tr>
                  );
                })}
              {Object.keys(agents).length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-zinc-500">
                    No agent data yet. Start logging with the AgentLens SDK.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick start */}
      <div className="mt-8 bg-[#131320] border border-[#1e1e35] rounded-xl p-6">
        <h2 className="font-semibold mb-3">Send metrics from your SDK</h2>
        <code className="block bg-[#0a0a0f] rounded-lg p-4 text-sm text-indigo-400 font-mono overflow-x-auto">
          {`curl -X POST https://agentlens.dev/api/metrics/ingest \\
  -H "Content-Type: application/json" \\
  -H "x-api-key: YOUR_API_KEY" \\
  -d '{
    "project": "my-app",
    "metrics": [{
      "agent": "executor",
      "task_id": "task-1",
      "success": true,
      "tokens": 5000,
      "duration_ms": 42000
    }]
  }'`}
        </code>
      </div>
    </div>
  );
}
