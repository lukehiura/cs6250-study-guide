---
tags:
  - lesson-04
  - routing
  - bgp
  - plain-language
search:
  boost: 2
---

# Lesson 4: Interdomain Routing (BGP) — Plain-Language Guide

The simplest version of [Lesson 4](interdomain-routing.md). We explain ideas through **real trips on the Internet** — loading a show, paying your ISP, two companies swapping traffic for free. Inside-one-network routing is in [Lesson 3](../lesson-03/intradomain-routing.md). When you want exam tables and short answers, use the **[Quick Study Guide](quick-study-guide.md)** or the **[Quiz](quiz.md)**.

---

## Summary

The **Internet** is thousands of **separate networks** — Comcast, Google, your university, Netflix — each run by a different organization. **Inside** your network, routing finds a good path ([Lesson 3](../lesson-03/intradomain-routing.md)). **Between** networks, routing also follows **money and deals**. **BGP** (Border Gateway Protocol) is how networks tell neighbors *"I can reach these address blocks"* and pick which neighbor's path to use.

---

## The one-sentence version

BGP is how separate networks on the Internet tell each other what they can reach — and choose paths based on **who pays whom**, not just the shortest road.

---

## Scenario: you press play on Netflix

Your laptop does not "call Netflix" on one wire. Your request hops through several **organizations**:

```
Your laptop
  → home Wi‑Fi router
  → your ISP (e.g. Comcast)
  → maybe a regional ISP
  → maybe an Internet Exchange Point (IXP)
  → Netflix's network (CDN servers near you)
  → the show starts
```

Each hop might be a **different company**. Inside each company, routers use an **IGP** (like OSPF) — hallways inside the building. At the **edges**, where two companies meet, routers use **BGP** — which exit door and which neighbor you trust.

| Scope | Protocol | Plain English |
|-------|----------|---------------|
| **Inside one network** | **IGP** | Best path **inside our building** |
| **Between networks** | **BGP** | Which **neighbor's door** do we use to leave? |

**Memory trick:** **IGP = hallways inside the building. BGP = which exit door and which neighbor you trust.**

![Interconnection of ISPs — Tier 1, regional, access ISPs, IXPs, and content providers](../images/isp-interconnection.png)

---

## Scenario: your monthly Internet bill

Your home ISP (Tier-3 **access** provider) does not own cables to every website on Earth. It **pays** a bigger **regional** or **global** provider to carry traffic to the rest of the Internet. That deal is **customer–provider transit**:

- **You pay** your ISP.
- **Your ISP pays** its upstream provider.
- The provider agrees to carry traffic **both ways** — your requests out, replies back in.

Like hiring a delivery company that can reach every address in the world, not just your block.

| Who | Role | Real example |
|-----|------|--------------|
| **Tier-1 ISP** | Global backbone; peers with other Tier-1s | AT&T, NTT — the "highways" |
| **Tier-2 ISP** | Regional; buys from Tier-1 | Country-wide provider |
| **Tier-3 / access** | Sells to homes and small businesses | Your cable or fiber company |
| **CDN** | Content company runs its **own** network | Netflix, Google — servers close to you |

**Peering** is different: two networks agree to swap traffic **without paying each other** — but only for routes they're allowed to share (usually their own customers and themselves, not everything they learned from others). Works when traffic is roughly balanced.

![Autonomous Systems business relationships — transit and peering between ISPs and customers](../images/as-business-relationships.png)

---

## Scenario: Georgia Tech's network

An **Autonomous System (AS)** is one organization's network under **one set of rules** — one admin, one routing policy. Each AS has an **ASN** (Autonomous System Number), like an ID badge.

- **Inside** campus: routers use an **IGP** to find paths between buildings (Lesson 3).
- **At the border**: a few **border routers** talk **BGP** to Comcast, research networks, or peers.

One big company might run **several ASes** (different divisions, different policies). Border routers are the **front gates** where outside routing begins.

---

## Scenario: the rules of who tells whom

When a network learns a route, two questions matter for **money**:

1. **Export** — "Do I tell my neighbors about this route?"
2. **Import** — "If two neighbors both offer a path, which do I **prefer**?"

Think of it like a hotel concierge who only recommends certain exits:

| Route learned from | Tell who? | Why |
|--------------------|-----------|-----|
| **Customer** (pays you) | **Everyone** | You get paid to carry their traffic |
| **Peer** (free swap) | **Customers only** | Don't give free rides to other peers |
| **Provider** (you pay them) | **Customers only** | Same — no free transit for non-payers |

When picking between paths to the same destination, **prefer**:

```
Customer routes  >  Peer routes  >  Provider routes
```

**Key takeaway:** BGP paths are rarely the mathematically shortest. They follow **business rules**.

![Common inter-AS relationships — transit ($) and peering between ISPs and customers](../images/transit-peering-relationships.png)

---

## Scenario: two routers on a long phone call

**BGP** is the default language at network borders. Two border routers open a **BGP session** — a long-lived **TCP** connection, like a phone line that stays open.

- They exchange **UPDATE** messages: "I can reach this block of addresses" or **withdraw** a route when it goes away.
- **KEEPALIVE** messages say "I'm still here."
- Destinations are **prefixes** (blocks of IP addresses), not single laptops.

Important attributes on each route:

| Attribute | Plain English |
|-----------|---------------|
| **AS-PATH** | List of AS numbers the route passed through — stops loops; shorter often wins |
| **NEXT-HOP** | IP of the next router toward the destination — usually a **border router** |

**Security came later.** BGP was built for **scale and policy**, not to stop lies. A mistaken or malicious announcement can redirect traffic worldwide. (Real example: misconfigured routes have briefly sent huge chunks of traffic to the wrong place.)

---

## Scenario: inside the company vs at the front gate

Two flavors of BGP:

| Type | Between | Job |
|------|---------|-----|
| **eBGP** | Routers in **different** ASes | Learn routes from **outside** neighbors |
| **iBGP** | Routers in the **same** AS | Spread those outside routes **inside** the AS |

**iBGP is not an IGP.** They work together:

1. **BGP** picks which **border router** to use for an outside address.
2. **IGP** finds how to **reach** that border router inside your network.

![eBGP between AS1–AS2–AS3; iBGP within AS2](../images/ibgp-ebgp-as-sessions.png)

---

## Scenario: picking which exit door

When several BGP routes reach the same prefix, routers compare them step by step (exam detail in the [full guide](interdomain-routing.md) and [quick study](quick-study-guide.md)). Two knobs you hear about constantly:

### LocalPref — you control **outbound** traffic

Set **inside your network**. **Higher number = more preferred exit.**

Example: Your company connects to both **Provider A** (cheap) and **Provider B** (backup). You set a **higher LocalPref** on A's routes → all internal routers send traffic out through A unless A is down.

Typical pattern: customer routes beat peer routes beat provider routes — encoded as higher LocalPref numbers.

### MED — neighbor hints about **inbound** traffic

**MED** (Multi-Exit Discriminator) is your **neighbor** saying: "Please send traffic **into** my network through **this** link." You may honor it or ignore it. Only compare MED from the **same** neighbor.

**Memory trick:** **LocalPref = your choice of exit. MED = their suggestion for entry.**

![BGP decision process — seven-step attribute comparison](../images/bgp-decision-process-steps.png)

---

## Scenario: the network swap meet (IXP)

An **IXP** (Internet Exchange Point) is a **physical building** full of switches where many networks plug in and exchange traffic **locally** — Paris-to-Paris traffic should not fly to Virginia and back.

Why networks join:

- **Cheaper** — peering often beats buying transit for heavy traffic between locals.
- **Faster** — shorter paths, lower delay.
- **Keep local traffic local.**

To join: get an **ASN**, bring a **BGP-capable router**, plug into the IXP switch, sign their agreement. You pay for the **port**; swapping traffic is usually settlement-free.

![DE-CIX Frankfurt (2012) — core sites and distributed colocation facilities](../images/de-cix-frankfurt.png)

---

## Scenario: one mailing list instead of 100 phone calls

At a big IXP, if every network set up BGP with every other network, connections grow explosively (100 networks → thousands of sessions).

A **route server** fixes that:

- Each member connects **once** to the route server.
- The server collects routes, applies **filters**, and gives each member a tailored view.
- **Data packets** still flow **directly** between members on the switch — the route server only handles **control** (BGP messages), not your Netflix stream.

![Multilateral vs bilateral BGP peering at an IXP](../images/multilateral-bilateral-peering.png)

---

## Scenario: when someone announces the wrong roads

BGP is powerful but fragile:

| Problem | What happens in real life |
|---------|---------------------------|
| **Misconfiguration** | One wrong UPDATE can spread globally; traffic takes a weird detour or black hole |
| **Route hijacking** | Someone claims to own an address block they don't — traffic can be steered to them |
| **Huge route tables** | Routers need more memory; decisions slow down |
| **Flapping routes** | A link up/down/up floods UPDATE messages |

Networks defend with **route filters**, **prefix limits**, **aggregation**, and **flap damping**. Fixes like **RPKI** help verify who really owns a prefix — adoption is slow.

**Key takeaway:** A BGP mistake in **one** network can affect **everyone**.

---

## The whole lesson on one napkin

```
You stream Netflix:  laptop → ISP → maybe IXP → CDN  (many organizations)

Inside one org:      IGP = hallways
Between orgs:        BGP = which neighbor and which exit

Deals:               Customer pays provider (transit) | Peering = limited free swap
Money rules:         Export customers to all; peers/providers to customers only
                     Import: customer > peer > provider

BGP session:         Long TCP call; UPDATE + WITHDRAW; prefixes not single hosts
                     AS-PATH (loop check) | NEXT-HOP (border router)

eBGP:                Between ASes — learn outside routes
iBGP:                Inside AS — spread eBGP info (NOT a replacement for IGP)

Pick route:          LocalPref (your exit) → AS-PATH → … → IGP cost ("hot potato")
MED:                 Neighbor's hint for entry — optional

IXP:                 Local meet-up; cheaper, faster peering
Route server:        One BGP session to many peers; data still goes direct
Risks:               Misconfig / hijack spreads fast; filters and RPKI help
```

---

## Where to go next

| You want… | Go here |
|-----------|---------|
| Full detail + all study questions | [Lesson 4 — full guide](interdomain-routing.md) |
| Exam tables & short answers | [Quick Study Guide](quick-study-guide.md) |
| Practice | [Lesson 4 Quiz](quiz.md) |
| Routing inside one network | [Lesson 3 — Intradomain Routing](../lesson-03/intradomain-routing.md) |
| Plain-language Lesson 3 | [Lesson 3 plain-language](../lesson-03/plain-language.md) |

---

**Bottom line:** BGP lets thousands of separate networks share reachability and pick paths based on **business deals and policy**, not just the shortest road — and IXPs plus route servers make that cooperation possible at global scale.
