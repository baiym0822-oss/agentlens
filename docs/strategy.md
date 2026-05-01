# AgentLens — Product Strategy

## One-Liner
The simplest way for AI agent teams to see what their agents are doing — and what's going wrong.

## Problem
40% of companies deploying AI agents can't track their ROI. 51% say monitoring and managing agents at scale is their biggest blocker. Most teams don't know an agent has silently failed until a customer complains.

## Solution
A lightweight dashboard that shows every agent invocation, success rate, cost, and failures — in real time. The agent version of `htop`.

## Target Customer
- Solo developers and small teams building with AI agents (Claude Code, OpenAI Agents SDK, LangChain, etc.)
- 2-50 person startups who deployed agents and lost visibility
- Indie hackers running automated businesses on agents

## Unique Advantage
We built the exact same metrics system for ourselves (240+ Claude Code skills, 19 OMC agents). We live the problem. Our product is extracted from our own pain.

## Pricing
| Plan | Price | What |
|------|-------|------|
| Free | $0 | 1 agent, 7 day history, open-source SDK |
| Starter | $29/mo | 10 agents, 30 day history, email alerts |
| Pro | $99/mo | 50 agents, 90 day history, custom dashboards, API access |
| Team | $249/mo | Unlimited agents, SSO, priority support |

## Acquisition Strategy
1. Open-source the metrics SDK on GitHub → organic developer adoption
2. SEO/GEO content: "AI agent monitoring", "agent observability", "Claude Code monitoring"
3. Content engine: blog + tutorials + comparisons (continuous output)
4. Product Hunt launch when dashboard is live

## MVP Scope
- Agent metrics SDK (Node.js, simple JSONL logging)
- Web dashboard (read JSONL, display agent performance)
- Landing page with email capture
- 3 blog posts for SEO foundation

## Tech Stack
- SDK: Node.js + TypeScript (npm publishable)
- Dashboard: Next.js + SQLite (lightweight)
- Landing: Static HTML/CSS (fast, SEO-optimized)
- Hosting: Vercel (free tier to start)
