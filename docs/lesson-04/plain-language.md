# Lesson 4: Interdomain Routing (BGP) — Plain-Language Guide

The simplest possible version of [Lesson 4](interdomain-routing.md). No jargon unless we explain it right away. Inside-one-company routing is in [Lesson 3](../lesson-03/intradomain-routing.md). When you want exam detail, use the **[Quick Study Guide](quick-study-guide.md)** or the **[Quiz](quiz.md)**.

---

## Summary

The **Internet** is not one big network. It is thousands of **separate networks** run by different companies, schools, and governments. Each network needs to know: *"How do I reach addresses in other networks?"*

**Inside** your network, routing is mostly about finding a **good path**. **Between** networks, routing is also about **money, deals, and rules**. The main tool for that is **BGP** (Border Gateway Protocol). It lets networks **share which address blocks they can reach** and **pick paths based on business deals**, not just "shortest route."

**IXPs** (Internet Exchange Points) are big meeting places where networks connect and swap traffic. **Route servers** help hundreds of networks peer without setting up a separate connection to every single one.

---

## The one-sentence version

BGP is how separate networks on the Internet tell each other what they can reach — and choose paths based on **who pays whom**, not just the shortest road.

---

## Where does this fit?

Remember from Lesson 3:

| Scope | Protocol | Plain English |
|-------|----------|---------------|
| **Inside one network** | **IGP** (OSPF, RIP) | "Best path **inside our building**" |
| **Between networks** | **BGP** | "Which **neighbor's door** do we use to leave?" |

**Real trip:**

```
Your laptop → your company network → your ISP → maybe more ISPs → CDN → web server
```

Each hop might be a **different organization**. BGP runs at the **edges** where networks meet.

**Memory trick:** **IGP = hallways inside the building. BGP = which exit door and which neighbor you trust.**

---

## The Internet is a network of networks

The Internet is an **ecosystem** — many players working together and competing at the same time.

![Interconnection of ISPs — Tier 1, regional, access ISPs, IXPs, and content providers](../images/isp-interconnection.png)

### Who is on the Internet?

| Player | What they do | Plain example |
|--------|--------------|---------------|
| **Tier-1 ISP** | Global backbone; connects to all other Tier-1s | AT&T, NTT — the "highways" of the Internet |
| **Tier-2 ISP** | Regional — buys access from Tier-1 | A provider for a whole country or region |
| **Tier-3 / access ISP** | Sells Internet to homes and small businesses | Your local cable or fiber company |
| **IXP** | A physical place where many networks plug in and swap traffic | Like a huge network swap meet (~500 worldwide) |
| **CDN** | Content company builds its own network to deliver video fast | Netflix, Google — servers close to users |

**Key takeaways:**

- **ISPs** come in sizes — big global backbones down to your neighborhood provider.
- **IXPs** let networks meet locally instead of sending everything through a far-away provider.
- **CDNs** put copies of content near users to save money and speed things up.

### Competition and cooperation

![Competition and cooperation — customer-provider relationships across ISP tiers](../images/competition-cooperation-networks.png)

- Networks **compete** for customers (you pick Comcast or AT&T).
- But they must **cooperate** too — no single company owns the whole Internet.
- Small networks usually **pay** bigger ones to reach the rest of the world.
- **Peering** = two networks agree to swap traffic **without paying each other** (when it makes sense for both).

**Other useful words:**

- **PoP (Point of Presence)** — a place in a provider's network where customers plug in.
- **Multi-homing** — connecting to **more than one** provider so you have a backup.
- **Settlement-free peering** — direct traffic swap with **no money** changing hands.

### Flat vs hierarchical

**Old shape:** traffic went **up** to big providers, then **down** again — like a pyramid.

**Today:** IXPs and CDNs let smaller networks connect **directly** to big ones or to each other. The shape is getting **flatter**.

---

## What is an Autonomous System (AS)?

An **Autonomous System (AS)** is a group of routers run by **one organization** under **one set of rules**.

- Could be an ISP, a university, Netflix, or your company.
- Each AS has a unique **ASN** (Autonomous System Number) — like a network's ID badge.
- One big company might run **several ASes** for different parts of the business.

**Key takeaways:**

- **AS** = one admin, one routing policy.
- **Border routers** sit at the edge and talk BGP to neighbors.
- Inside the AS, routers still use an **IGP** (Lesson 3) for internal paths.

---

## Business relationships: who pays whom?

![Autonomous Systems business relationships — transit and peering between ISPs and customers](../images/as-business-relationships.png)

Two main deal types:

### Customer–provider (transit)

- The **customer pays** the **provider**.
- The provider carries the customer's traffic **to the rest of the Internet** — both **in** and **out**.
- Like paying a delivery company to reach every address in the world.

**Key takeaways:**

- **Customer** buys reachability.
- **Provider** sells it and forwards traffic in both directions.

### Peering

- Two networks **usually do not pay** each other.
- They only share routes for **themselves and their own customers** — not everything they learned from others.
- Works when traffic is **roughly balanced** — not one side sending way more than the other.
- **Tier-1** networks only peer with others their size.
- **Smaller ISPs** peer to save money when lots of traffic goes between them.

### How providers charge

| Method | Plain English |
|--------|---------------|
| **Fixed price** | Flat monthly fee up to a speed cap |
| **95th percentile** | Sample speed every few minutes; bill based on the **95th highest** reading (ignore short spikes) |

Providers like carrying **customer traffic** — that is how they make money. Sometimes routing rules are set up to **send more traffic through a paying link**.

---

## Import and export rules (the money rules in routing)

When a network learns a route, it must decide:

1. **Export** — "Do I tell my neighbors about this route?"
2. **Import** — "Which neighbor's route do I **prefer** for the same destination?"

![Common inter-AS relationships — transit ($) and peering between ISPs and customers](../images/transit-peering-relationships.png)

### Export rules (what you advertise)

| Learned from | Tell who? | Why |
|--------------|-----------|-----|
| **Customer** | **Everyone** (customers, peers, providers) | You get **paid** to carry their traffic — more ads = more money |
| **Peer** | **Customers only** | Don't give free rides to other peers or providers |
| **Provider** | **Customers only** | Same — no free transit for non-payers |

```
Routes learned from:          Export to:
  Customer  ──────────────→  Everyone
  Peer      ──────────────→  Customers only
  Provider  ──────────────→  Customers only
```

### Import rules (which route you pick)

When two neighbors both offer a path to the same place, **prefer**:

1. **Customer** routes first (keep their traffic on your network)
2. **Peer** routes second (usually free)
3. **Provider** routes last (costs money — use when you must)

```
Import preference:
  Customer routes  >  Peer routes  >  Provider routes
```

**Key takeaways:**

- **BGP paths are rarely the shortest** — they follow **business rules**.
- **Golden rule:** Only carry someone else's traffic for free if your deal says so.

---

## What is BGP?

**BGP** (Border Gateway Protocol) is the **default language** networks use to talk **across borders**.

### Why BGP was built

| Goal | Plain English |
|------|---------------|
| **Scale** | Work even with thousands of networks and millions of routes |
| **Express policy** | Let each network set its own rules privately |
| **Cooperation** | Let rivals share reachability without sharing secrets |

**Security came later.** BGP was **not** designed to stop lies or attacks. Bad configs or fake announcements can still break parts of the Internet. Fixes like **RPKI** exist but spread slowly.

### BGP basics

- Two routers form a **BGP session** — a long-lived **TCP** connection (like a phone line that stays open).
- They start with an **OPEN** message.
- Then they swap **UPDATE** messages (new routes or **withdrawals** when a route goes away).
- **KEEPALIVE** messages say "I'm still here."

Destinations are **prefixes** — blocks of IP addresses (like `203.0.113.0/24`), not single computers.

**Key route info (attributes):**

| Attribute | What it means |
|-----------|---------------|
| **AS-PATH** | List of AS numbers the route passed through — stops loops; shorter path often wins |
| **NEXT-HOP** | IP of the next router toward the destination — usually a **border router** |

---

## eBGP vs iBGP — two flavors of BGP

![eBGP and iBGP sessions across AS1, AS2, and AS3](../images/ebgp-ibgp-sessions.png)

| Type | Between | Job |
|------|---------|-----|
| **eBGP** | Routers in **different** ASes | Learn routes from **outside** neighbors |
| **iBGP** | Routers in the **same** AS | Spread those outside routes **inside** the AS |

![eBGP between AS1–AS2–AS3; iBGP within AS2](../images/ibgp-ebgp-as-sessions.png)

**Inside one AS**, iBGP often uses a **full mesh** — every border router talks BGP to every other BGP router in that AS.

![iBGP full mesh within an AS; eBGP to neighboring ASes](../images/ibgp-ebgp-full-mesh.png)

### iBGP is NOT an IGP

| | **IGP** (OSPF, RIP) | **iBGP** |
|---|---------------------|----------|
| **Job** | Find best path **inside** the AS | Share **outside** routes learned at the border |
| **Metric** | Link cost, hop count | Policy (business rules) |

They work **together:**

1. **BGP** picks which border router to use for an outside address.
2. **IGP** finds how to **reach** that border router inside your network.

---

## How a router picks the best BGP route

![BGP decision process — router model](../images/bgp-decision-process-router.png)

**Pipeline:**

```
Receive messages → Import filters → Pick best route → Install in forwarding table → Export to neighbors
```

When several routes reach the same prefix, the router compares them **step by step**:

![BGP decision process — seven-step attribute comparison](../images/bgp-decision-process-steps.png)

| Step | Check | Who sets it | Plain English |
|------|-------|-------------|---------------|
| 1 | **Highest LocalPref** | Your AS | Which exit do **we** like best? |
| 2 | **Shortest AS-PATH** | Neighbors | Fewer AS hops in the path |
| 3 | **Lowest origin type** | Protocol | How the route was born (IGP best) |
| 4 | **Lowest MED** | Neighbor | Neighbor's hint for **where to enter** their network |
| 5 | **eBGP over iBGP** | Protocol | Prefer routes learned directly from outside |
| 6 | **Lowest IGP cost to border** | Your AS | **Hot potato** — nearest exit ([Lesson 3](../lesson-03/intradomain-routing.md#hot-potato-routing)) |
| 7 | **Lowest router ID** | Protocol | Tiebreaker |

### LocalPref — controlling **outbound** traffic

**LocalPref** is set **inside your network**. **Higher number = more preferred.**

![LocalPref example — AS B learns destination x via AS A and AS C](../images/bgp-localpref-attribute.png)

Example: Network B learns about destination X from both A and C. B sets a **higher LocalPref** on A's route → all internal routers send traffic out through A.

Typical ranges by relationship:

![LocalPref ranges by relationship — customer, peer, provider, backup](../images/bgp-localpref-ranges.png)

| Relationship | LocalPref range (example) |
|--------------|---------------------------|
| Customer | 90–99 (best) |
| Peer | 80–89 |
| Provider | 70–79 |
| Backup link | 60–69 |

This encodes **customer > peer > provider** in one number.

### MED — hint for **inbound** traffic

**MED** (Multi-Exit Discriminator) is a **suggestion from your neighbor**: "Please send traffic into my network through **this** link."

- You set different MED values on different border routers.
- The **other** network may follow it — or **ignore** it.
- Only compares MED from the **same** neighbor.

**Key takeaways:**

- **LocalPref** = you control **where traffic leaves** your network.
- **MED** = neighbor suggests **where traffic enters** theirs.

---

## BGP problems: mistakes and growth

BGP is powerful but fragile.

| Problem | What happens |
|---------|--------------|
| **Misconfiguration** | Wrong route announced → floods of UPDATE messages → instability |
| **Churn** | Routes flapping up and down → routers overload |
| **Huge tables** | Too many prefixes → more memory and slower decisions |
| **No built-in trust** | Anyone can claim to own an address block (**hijacking**) |

**Guards networks use:**

| Tool | Plain English |
|------|---------------|
| **Route filters** | Block routes you should not accept or send |
| **Prefix limits** | Cap how many routes one neighbor can send |
| **Aggregation** | Advertise bigger blocks instead of tiny ones |
| **Flap damping** | Temporarily ignore routes that keep changing |
| **Default route** | Small networks may only need "send everything to provider" |

**Key takeaway:** A BGP mistake in **one** network can spread **worldwide**.

---

## Internet Exchange Points (IXPs)

An **IXP** is a **physical building** (really, a room full of switches) where many networks plug in and exchange traffic **locally**.

![DE-CIX Frankfurt (2012) — core sites and distributed colocation facilities](../images/de-cix-frankfurt.png)

### Why IXPs matter

- **Keep local traffic local** — Paris-to-Paris traffic should not fly to Virginia and back.
- **Save money** — peering is often cheaper than buying transit.
- **Faster** — shorter paths, lower delay.
- **Traffic hub** — big IXPs handle as much data as Tier-1 ISPs.
- **Security help** — can spot and block attack traffic (DDoS).
- **Innovation** — route servers, research, extra services.

### How to join an IXP

1. Get a public **ASN**.
2. Bring a **BGP-capable router**.
3. Plug a cable into the **IXP switch**.
4. Sign the IXP's **terms and conditions**.

**Costs:** setup fee, monthly **port fee** (faster port = more money), maybe membership. Traffic swap itself is usually **free** (settlement-free).

### Peering modes at an IXP

| Mode | Plain English |
|------|---------------|
| **Public peering** | Everyone on the shared switch; swap traffic per BGP deals |
| **Private peering** | Two networks get a **dedicated wire** between them for heavy traffic |
| **Bilateral** | You set up BGP **directly** with each peer you want |
| **Multilateral (route server)** | One BGP session to the **route server** → reach many peers |
| **Remote peering** | Pay a reseller to reach an IXP **without** moving equipment there |

---

## Route servers — peering without N² connections

**Problem:** If 100 networks each connect to every other network, you need **thousands** of BGP sessions. That does not scale.

**Solution:** A **route server** sits in the middle.

![Multilateral vs bilateral BGP peering at an IXP](../images/multilateral-bilateral-peering.png)

| Mode | Sessions | Scales? |
|------|----------|---------|
| **Bilateral** | Every pair connects | No — grows as N² |
| **Route server** | Each network → one session to RS | Yes — grows as N |

![BIRD route server — Master RIB, AS-specific RIBs, import/export filters](../images/bird-route-server.png)

**How it works:**

1. Each member advertises routes **to the route server**.
2. **Import filters** check: "Is this member allowed to announce this prefix?"
3. Good routes go into a **master table**.
4. **Export filters** check: "Does member X want member Y to see this route?"
5. Each member gets a **custom view** of routes.

**Important:** The route server only handles **control** (BGP messages). **Actual data packets** flow **directly** between members on the switch — not through the route server.

---

## How BGP and IGP build the forwarding table

Four steps to forward a packet to an outside address:

1. **BGP** picks the best external route (decision process above).
2. That route names an **exit border router** (NEXT-HOP).
3. Entry goes in the **forwarding table**: "To reach this prefix, go toward that border router."
4. **IGP** carries the packet **across your AS** to that border router.

---

## Official study questions — plain-language answers

### ISPs, IXPs, and CDNs?

- **ISPs** sell connectivity (Tier-1 global → Tier-3 local).
- **IXPs** are meeting places to swap traffic without long detours.
- **CDNs** are content companies' own networks (Netflix, Google).

### What is an AS?

One organization's network with one routing policy. Has an **ASN**. Uses **IGP** inside, **BGP** at borders.

### Business relationships?

1. **Customer–provider (transit)** — customer pays; provider reaches the whole Internet.
2. **Peering** — no payment; limited route sharing; balanced traffic.
3. **Sibling** — two ASes, same owner; share everything freely.

### Import/export rules?

- **Export customer routes** to everyone.
- **Export peer/provider routes** to customers only.
- **Import:** prefer customer > peer > provider.

### BGP design goals?

Scale, express policy, allow cooperation. **Security added later** (RPKI, etc.).

### eBGP vs iBGP?

- **eBGP** — between different ASes; learns outside routes.
- **iBGP** — inside same AS; spreads eBGP info; full mesh common.

### iBGP vs IGP?

**IGP** computes internal paths. **iBGP** only distributes external reachability.

### BGP decision steps?

LocalPref → AS-PATH → origin → MED → eBGP over iBGP → IGP cost → router ID.

### LocalPref vs MED?

- **LocalPref** — your choice of **outbound** exit (higher wins).
- **MED** — neighbor's hint for **inbound** entry (lower wins if you honor it).

### Main BGP challenges?

Misconfigs, update storms, huge tables, weak security. Fixes: filters, limits, aggregation, flap damping.

### What is an IXP?

Physical switch fabric where ASes peer locally. Needs ASN, BGP router, port, agreement.

### Route server?

Collects routes from all members, applies filters, gives each member a tailored view — **O(n)** sessions instead of **O(n²)**. Data plane stays direct between peers.

### Hot potato?

When BGP ties, pick the border router with **lowest IGP cost** from where you are — get traffic off your network fast.

---

## The whole lesson on one napkin

```
Internet:     Network of networks — compete AND cooperate
AS:           One org, one policy, ASN; BGP at borders, IGP inside

Deals:        Customer pays provider (transit) | Peering = free swap (limited routes)
Money rules:  Export customers to all; peers/providers to customers only
              Import: customer > peer > provider

BGP:          TCP sessions; UPDATE + WITHDRAW; prefixes not single hosts
              AS-PATH (loop check) | NEXT-HOP (border router)

eBGP:         Between ASes — learn outside routes
iBGP:         Inside AS — spread eBGP routes (full mesh)
              NOT an IGP — IGP still finds path to border

Pick route:   LocalPref → AS-PATH → origin → MED → eBGP>iBGP → IGP cost → router ID
LocalPref:    Higher = preferred EXIT (outbound)
MED:          Neighbor hint for ENTRY (inbound) — optional

Risks:        Misconfig spreads globally; filters, limits, damping, aggregation
IXP:          Local meet-up; cheaper, faster peering
Route server: One session to many peers; control only — data goes direct
```

---

## Where to go next

| You want… | Go here |
|-----------|---------|
| Full detail + diagrams | [Lesson 4 — full guide](interdomain-routing.md) |
| Exam tables & Q&A | [Quick Study Guide](quick-study-guide.md) |
| Practice | [Lesson 4 Quiz](quiz.md) |
| Routing inside one network | [Lesson 3 — Intradomain Routing](../lesson-03/intradomain-routing.md) |
| Plain-language version of Lesson 3 | [Lesson 3 plain-language](../lesson-03/plain-language.md) |
| Router hardware & algorithms | [Lesson 5](../lesson-05/router-design-1.md) ([Plain-language guide](../lesson-05/plain-language.md), [quick guide](../lesson-05/quick-study-guide.md)) |

---

**Bottom line:** BGP lets thousands of separate networks share reachability and pick paths based on **business deals and policy**, not just the shortest road — and IXPs plus route servers make that cooperation possible at global scale.
