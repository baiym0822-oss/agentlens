import Link from "next/link";

export default function LandingPage() {
  return (
    <>
      {/* Hero */}
      <section className="px-6 pt-32 pb-20 text-center max-w-3xl mx-auto">
        <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight leading-tight mb-6">
          <span className="bg-gradient-to-br from-white to-indigo-400 bg-clip-text text-transparent">
            See what your AI agents are doing.
          </span>
        </h1>
        <p className="text-lg text-zinc-400 max-w-xl mx-auto mb-10 leading-relaxed">
          Open-source agent observability. Log, track, and visualize your agent
          fleet in under 10 lines of code. Detect silent failures before your
          customers do.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-500 text-white font-semibold shadow-lg shadow-indigo-500/25 hover:bg-indigo-400 hover:-translate-y-0.5 transition-all"
          >
            Open Dashboard
          </Link>
          <a
            href="https://github.com/baiym0822-oss/agentlens"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#131320] border border-[#1e1e35] text-white font-semibold hover:border-indigo-500 transition-all"
          >
            View on GitHub
          </a>
        </div>
      </section>

      {/* Terminal mockup */}
      <div className="max-w-2xl mx-auto px-6 mb-16">
        <div className="bg-[#131320] border border-[#1e1e35] rounded-xl overflow-hidden shadow-2xl shadow-black/40">
          <div className="bg-[#1a1a2e] px-4 py-3 flex gap-2">
            <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
            <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
            <div className="w-3 h-3 rounded-full bg-[#28c840]" />
          </div>
          <div className="p-6 font-mono text-sm text-[#a0a0c0] leading-relaxed overflow-x-auto">
            <span className="text-indigo-400">$</span> npx agentlens
            dashboard
            {"\n\n"}
            ╔════════════════════════════════════════════════════╗{"\n"}
            ║&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;AgentLens
            — Agent
            Dashboard&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            ║{"\n"}
            ╠════════════════════════════════════════════════════╣{"\n"}
            ║{" "}
            <span className="text-green-400">
              executor&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            </span>{" "}
            │{" "}
            <span className="text-green-400">
              94.2%&nbsp;&nbsp;&nbsp;&nbsp;
            </span>{" "}
            │ 82,000&nbsp;&nbsp;&nbsp;&nbsp; │ 42s&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ║{"\n"}
            ║{" "}
            <span className="text-green-400">
              code-reviewer&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            </span>{" "}
            │{" "}
            <span className="text-green-400">
              99.1%&nbsp;&nbsp;&nbsp;&nbsp;
            </span>{" "}
            │ 31,000&nbsp;&nbsp;&nbsp;&nbsp; │ 18s&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ║{"\n"}
            ║{" "}
            <span className="text-yellow-400">
              debugger&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            </span>{" "}
            │{" "}
            <span className="text-yellow-400">
              78.3%&nbsp;&nbsp;&nbsp;&nbsp;
            </span>{" "}
            │ 125,000&nbsp;&nbsp;&nbsp; │ 95s&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ║ ← ⚠️{"\n"}
            ╠════════════════════════════════════════════════════╣{"\n"}
            ║ Total agents: 7&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            ║{"\n"}
            ║ Total invocations:
            1,247&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            ║{"\n"}
            ╚════════════════════════════════════════════════════╝{"\n\n"}
            <span className="text-yellow-400">
              {"  "}🚨 Agent &quot;debugger&quot; failed 3x consecutively
            </span>
            {"\n"}
            <span className="text-yellow-400">
              {"  "}&nbsp;&nbsp;&nbsp;&nbsp;Circuit breaker triggered at
              2026-05-01T14:32:00Z
            </span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 px-6 mb-20">
        {[
          ["&lt;10", "Lines of code to integrate"],
          ["0", "External dependencies"],
          ["JSONL", "Data format — open, portable, yours"],
          ["MIT", "Open source license"],
        ].map(([number, label]) => (
          <div
            key={label}
            className="bg-[#131320] border border-[#1e1e35] rounded-xl p-6 text-center"
          >
            <div className="text-2xl font-extrabold bg-gradient-to-br from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              {number}
            </div>
            <div className="text-zinc-500 mt-2 text-sm">{label}</div>
          </div>
        ))}
      </div>

      {/* Features */}
      <section className="max-w-4xl mx-auto px-6 mb-20">
        <h2 className="text-3xl font-bold text-center mb-12">
          Stop flying blind
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              title: "Real-time Dashboard",
              desc: "Terminal dashboard. No setup, no servers, no config. Just npm install and run.",
            },
            {
              title: "Silent Failure Detection",
              desc: "Circuit breaker built-in. Agent fails 3x consecutively? You know immediately.",
            },
            {
              title: "Cost Attribution",
              desc: "Track token usage per agent, per task, per project. Know where your AI budget goes.",
            },
            {
              title: "Framework Agnostic",
              desc: "Works with Claude Code, OpenAI Agents, LangChain, or your own custom framework.",
            },
            {
              title: "CSV Export",
              desc: "One command exports everything to CSV. Share with your team.",
            },
            {
              title: "Cloud Dashboard",
              desc: "Team dashboards, historical analytics, email alerts. For when you outgrow the terminal.",
            },
          ].map((f) => (
            <div
              key={f.title}
              className="bg-[#131320] border border-[#1e1e35] rounded-xl p-6"
            >
              <h3 className="font-semibold mb-2">{f.title}</h3>
              <p className="text-zinc-500 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Install */}
      <section className="max-w-2xl mx-auto px-6 mb-20 text-center">
        <h2 className="text-3xl font-bold mb-6">Start in 30 seconds</h2>
        <code className="block bg-[#131320] border border-[#1e1e35] rounded-xl py-4 px-6 font-mono text-indigo-400 text-lg mb-4">
          npm install agentlens
        </code>
        <p className="text-zinc-500 text-sm mb-8">
          AgentLens is open source (MIT). The cloud dashboard is how we make
          money.
        </p>
        <Link
          href="/pricing"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#131320] border border-[#1e1e35] text-white font-semibold hover:border-indigo-500 transition-all"
        >
          View Pricing
        </Link>
      </section>

      {/* Footer */}
      <footer className="text-center py-12 border-t border-[#1e1e35] text-zinc-600 text-sm mt-auto">
        <div className="flex gap-6 justify-center mb-4">
          <a
            href="https://github.com/baiym0822-oss/agentlens"
            className="hover:text-zinc-400 transition-colors"
          >
            GitHub
          </a>
          <Link href="/pricing" className="hover:text-zinc-400 transition-colors">
            Pricing
          </Link>
          <Link href="/dashboard" className="hover:text-zinc-400 transition-colors">
            Dashboard
          </Link>
        </div>
        AgentLens — Built by people who run AI agents every day.
      </footer>
    </>
  );
}
