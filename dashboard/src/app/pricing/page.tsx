import Link from "next/link";

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    features: [
      "1 agent",
      "7 days history",
      "Terminal dashboard",
      "CSV export",
      "Community support",
    ],
    cta: "Get Started",
    href: "/dashboard",
    featured: false,
  },
  {
    name: "Starter",
    price: "$29",
    period: "/month",
    features: [
      "10 agents",
      "30 days history",
      "Cloud dashboard",
      "Email alerts",
      "API access",
      "Priority support",
    ],
    cta: "Start Free Trial",
    href: "/signup?plan=starter",
    featured: true,
  },
  {
    name: "Pro",
    price: "$99",
    period: "/month",
    features: [
      "50 agents",
      "90 days history",
      "Custom dashboards",
      "Team access",
      "Slack integration",
      "Advanced analytics",
      "Priority support",
    ],
    cta: "Start Free Trial",
    href: "/signup?plan=pro",
    featured: false,
  },
  {
    name: "Team",
    price: "$249",
    period: "/month",
    features: [
      "Unlimited agents",
      "1 year history",
      "Custom dashboards",
      "SSO / SAML",
      "Audit logs",
      "Dedicated support",
      "Custom integrations",
      "SLA guarantee",
    ],
    cta: "Contact Sales",
    href: "mailto:sales@agentlens.dev",
    featured: false,
  },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen">
      <header className="flex items-center justify-between px-6 py-4 border-b border-[#1e1e35]">
        <Link href="/" className="font-bold text-lg text-indigo-400">
          AgentLens
        </Link>
        <nav className="flex gap-6 text-sm text-zinc-400">
          <Link href="/dashboard" className="hover:text-white transition-colors">
            Dashboard
          </Link>
          <Link href="/pricing" className="text-white transition-colors">
            Pricing
          </Link>
          <a
            href="https://github.com/baiym0822-oss/agentlens"
            className="hover:text-white transition-colors"
          >
            GitHub
          </a>
        </nav>
      </header>

      <section className="px-6 pt-20 pb-12 text-center max-w-3xl mx-auto">
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4">
          Simple, transparent pricing
        </h1>
        <p className="text-lg text-zinc-400 max-w-xl mx-auto">
          Start free. Upgrade when your agent fleet grows. The SDK is and always
          will be MIT open source.
        </p>
      </section>

      <div className="max-w-5xl mx-auto px-6 pb-20 grid md:grid-cols-4 gap-6">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`rounded-xl border p-6 flex flex-col ${
              plan.featured
                ? "border-indigo-500 bg-[#131320] ring-1 ring-indigo-500/30"
                : "border-[#1e1e35] bg-[#0a0a0f]"
            }`}
          >
            {plan.featured && (
              <div className="text-xs font-semibold text-indigo-400 mb-3 uppercase tracking-wide">
                Most Popular
              </div>
            )}
            <div className="text-lg font-bold mb-1">{plan.name}</div>
            <div className="flex items-baseline gap-1 mb-4">
              <span className="text-3xl font-extrabold">{plan.price}</span>
              <span className="text-zinc-500 text-sm">{plan.period}</span>
            </div>
            <ul className="space-y-2 mb-8 flex-1">
              {plan.features.map((f) => (
                <li key={f} className="text-sm text-zinc-400 flex items-start gap-2">
                  <span className="text-green-400 mt-0.5">/</span>
                  {f}
                </li>
              ))}
            </ul>
            <a
              href={plan.href}
              className={`block text-center py-2.5 rounded-lg font-semibold text-sm transition-all ${
                plan.featured
                  ? "bg-indigo-500 text-white hover:bg-indigo-400"
                  : "bg-[#131320] border border-[#1e1e35] text-white hover:border-indigo-500"
              }`}
            >
              {plan.cta}
            </a>
          </div>
        ))}
      </div>

      <footer className="text-center py-12 border-t border-[#1e1e35] text-zinc-600 text-sm">
        <div className="flex gap-6 justify-center mb-4">
          <a
            href="https://github.com/baiym0822-oss/agentlens"
            className="hover:text-zinc-400 transition-colors"
          >
            GitHub
          </a>
          <Link href="/dashboard" className="hover:text-zinc-400 transition-colors">
            Dashboard
          </Link>
        </div>
        AgentLens — Built by people who run AI agents every day.
      </footer>
    </div>
  );
}
