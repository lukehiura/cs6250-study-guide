# Lesson 4: Interdomain Routing (BGP)

How autonomous systems exchange reachability and apply **policy** at Internet scale. Intradomain (IGP) material is in **[Lesson 3](lesson-03-intradomain-routing.md)**.

---

## What is the difference between forwarding and routing?

See [Lesson 3 — Forwarding vs routing](lesson-03-intradomain-routing.md#forwarding-vs-routing).

---

## Describe the relationships between ISPs, IXPs, and CDNs

- **ISPs (Internet Service Providers)** provide Internet connectivity. They are organized in tiers: Tier-1 (global backbone, peer with all other Tier-1s), Tier-2 (regional, buy transit from Tier-1), and Tier-3/Access ISPs (connect end users).
- **IXPs (Internet Exchange Points)** are physical locations where multiple networks interconnect and exchange traffic directly, avoiding transit costs. They reduce latency and improve performance.
- **CDNs (Content Delivery Networks)** distribute content across geographically dispersed servers. They connect to ISPs and IXPs to place content close to users.

These three form the modern Internet ecosystem: ISPs carry traffic, IXPs enable efficient peering, and CDNs optimize content delivery.

---

## What is an AS?

An **Autonomous System (AS)** is a large network or group of networks under a single administrative domain that presents a unified routing policy to the Internet. Each AS is identified by a unique **AS Number (ASN)**.

Examples: A large ISP, a university network, or a major corporation's network.

---

## What kind of relationship does an AS have with other parties?

1. **Provider-Customer** — The customer pays the provider for transit (access to the rest of the Internet). Traffic flows: provider carries customer's traffic to/from the Internet.
2. **Peer-to-Peer** — Two ASes agree to exchange traffic between their respective customers for free (settlement-free peering). Neither pays the other.
3. **Sibling** — Two ASes owned by the same organization that freely exchange all traffic.

**Export rules based on relationships:**

- Routes learned from **customers** → advertise to everyone (profitable).
- Routes learned from **peers/providers** → advertise only to customers (not profitable to carry transit traffic for free).

---

## What is BGP?

**BGP (Border Gateway Protocol)** is the de facto **interdomain routing protocol** of the Internet. It enables ASes to exchange reachability information and apply routing policies.

- BGP is a **path-vector protocol** — routes include the full AS path, which helps detect and prevent loops.
- BGP uses **TCP** (port 179) for reliable message exchange between peers.
- BGP supports **policy-based routing** — ASes can filter and prioritize routes based on business relationships.

---

## How does an AS determine what rules to import/export?

ASes use BGP policies driven by **business relationships**:

**Import (route selection):**

1. Prefer routes learned from **customers** (revenue-generating).
2. Then routes from **peers** (free, but limited).
3. Last, routes from **providers** (costly transit).

**Export (route advertisement):**

- Routes from customers → advertise to **everyone** (customers, peers, providers).
- Routes from peers → advertise only to **customers**.
- Routes from providers → advertise only to **customers**.

This follows the principle: **an AS only wants to carry transit traffic if it gets paid for it.**

---

## What were the original design goals of BGP? What was considered later?

**Original goals:**

- **Scalability** — Handle the growing number of ASes and prefixes.
- **Policy expressiveness** — Allow ASes to implement business-driven routing decisions.
- **Cooperation under competing interests** — Enable routing between independently operated networks.

**Later considerations:**

- **Security** — BGP was not originally designed with authentication, leading to vulnerabilities like prefix hijacking. RPKI and BGPsec were developed later.
- **Convergence speed** — Improving the time it takes for routing changes to propagate.

---

## What are the basics of BGP?

- **BGP sessions:** Two BGP routers (peers) establish a TCP connection and exchange routing information.
- **UPDATE messages:** Announce new routes or withdraw previously announced routes.
- **Route attributes:** Each route carries attributes like AS_PATH, NEXT_HOP, LOCAL_PREF, MED (Multi-Exit Discriminator).
- **Decision process:** BGP uses a sequential decision process to select the best route from multiple candidates.

---

## What is the difference between iBGP and eBGP?

| Feature | eBGP | iBGP |
|---------|------|------|
| **Between** | Routers in **different** ASes | Routers in the **same** AS |
| **Purpose** | Exchange routes between ASes | Distribute external routes within an AS |
| **AS_PATH** | Prepends the AS number | Does not modify AS_PATH |
| **Next-hop** | Typically changes | Typically preserved (unchanged) |
| **Full mesh** | Not required | Required (or use route reflectors) |

---

## What is the difference between iBGP and IGP-like protocols (RIP or OSPF)?

| Feature | iBGP | IGP (RIP/OSPF) |
|---------|------|-----------------|
| **Purpose** | Distribute externally learned BGP routes within the AS | Compute intradomain shortest paths |
| **Scope** | Carries interdomain routing info | Carries intradomain routing info |
| **Metrics** | Policy-based (LOCAL_PREF, AS_PATH, etc.) | Cost/hop-based metrics |
| **Convergence** | Slower (relies on IGP for internal reachability) | Faster |

They serve complementary roles: IGP handles internal routing; iBGP distributes external routes learned via eBGP.

---

## How does a router use the BGP decision process to choose which routes to import?

The BGP decision process is a **sequential tiebreaking** procedure:

1. **Highest LOCAL_PREF** — Prefer routes with the highest local preference (set by local policy).
2. **Shortest AS_PATH** — Prefer routes traversing fewer ASes.
3. **Lowest origin type** — IGP < EGP < Incomplete.
4. **Lowest MED** — Multi-Exit Discriminator (if from the same neighboring AS).
5. **eBGP over iBGP** — Prefer externally learned routes.
6. **Lowest IGP cost to NEXT_HOP** — Hot potato routing ([Lesson 3](lesson-03-intradomain-routing.md#hot-potato-routing)).
7. **Lowest router ID** — Final tiebreaker.

---

## What are the 2 main challenges with BGP? Why?

1. **Misconfigurations** — BGP configuration is complex and manual. Small errors can cause widespread routing problems (e.g., accidentally announcing someone else's prefixes, route leaks). There's no built-in mechanism to verify the correctness of announcements.

2. **Security / Lack of authentication** — BGP was designed without strong security. Any AS can announce any prefix, leading to **prefix hijacking** attacks. Solutions like RPKI (Resource Public Key Infrastructure) are being deployed but adoption is gradual.

---

## What is an IXP?

An **Internet Exchange Point (IXP)** is a physical infrastructure where multiple networks (ISPs, CDNs, content providers) interconnect to exchange traffic directly via peering, rather than through transit providers.

---

## What are four reasons for IXPs' increased popularity?

1. **Cost savings** — Peering is cheaper than paying transit providers.
2. **Performance** — Direct interconnection reduces latency and packet loss.
3. **Keeps local traffic local** — Traffic between nearby networks doesn't need to traverse distant backbone links.
4. **Expanded services** — Modern IXPs offer route servers, DDoS mitigation, DNS hosting, and other value-added services.

---

## Which services do IXPs provide?

- **Public peering** — Shared switching fabric for traffic exchange.
- **Private peering** — Dedicated cross-connects between specific members.
- **Route servers** — Simplify peering by centralizing BGP session management.
- **DDoS mitigation** — Blackholing and scrubbing services.
- **DNS root server hosting** — Hosting instances of root DNS servers.
- **Time synchronization (NTP)** services.

---

## How does a route server work?

A route server at an IXP acts as a **centralized BGP session broker**:

1. Instead of establishing bilateral BGP sessions with every other member (O(n²) sessions), each member peers with the **route server** (O(n) sessions).
2. The route server collects routes from all members and redistributes them according to each member's peering policies.
3. The route server does **not** forward data traffic — it only handles BGP control plane messages. Data still flows directly between members through the IXP switching fabric.

---

## What is hot potato routing?

See [Lesson 3 — Hot potato routing](lesson-03-intradomain-routing.md#hot-potato-routing). At the BGP level, step 6 of the decision process uses **lowest IGP cost to NEXT_HOP**.

---

## How does a router process advertisements?

- **Link-state (OSPF):** The router checks if the LSA is new. If so, it updates its link-state database, re-floods the LSA to neighbors, and reruns Dijkstra's algorithm to recompute the forwarding table.
- **Distance vector (RIP):** The router compares the advertised costs with its current table. If a better path is found (lower cost via the advertising neighbor), it updates its table and propagates the change to its own neighbors.

---

## What is the Routing Information Protocol (RIP)?

See [Lesson 3 — RIP](lesson-03-intradomain-routing.md#rip-routing-information-protocol).

---

## What is the Open Shortest Path First (OSPF) protocol?

See [Lesson 3 — OSPF](lesson-03-intradomain-routing.md#ospf-open-shortest-path-first).

---

**Previous:** [Lesson 3 — Intradomain Routing](lesson-03-intradomain-routing.md)
