---
tags:
  - lesson-04
  - routing
  - bgp
  - quick-study
search:
  boost: 2
---

# Lesson 4: Quick Study Guide — Interdomain Routing (BGP)

Condensed review for exams. New to the material? Start with the **[Plain-language guide](plain-language.md)**. Full detail: [Lesson 4 guide](interdomain-routing.md). Practice: [Lesson 4 Quiz](quiz.md). IGP (inside one AS): [Lesson 3](../lesson-03/intradomain-routing.md).

---

## 1. Big picture

- **Inside one AS:** **IGP** (OSPF, RIP) finds good internal paths.
- **Between ASes:** **BGP** exchanges **prefix reachability** and applies **policy** (money, peering deals).
- Interdomain routing is rarely “shortest path” — it reflects **business relationships** and traffic engineering.
- **BGP** is the de facto **interdomain** protocol; path-vector with **AS-PATH** loop prevention.

!!! tip "Memory aid"
    **IGP = hallways inside the building. BGP = which exit door and which neighbor you trust.**

---

## 2. Internet ecosystem

| Player | Role |
|--------|------|
| **Tier-1 ISP** | Global backbone; settlement-free peering with other Tier-1s; ~dozen worldwide |
| **Tier-2** | Regional; buys transit from Tier-1 |
| **Tier-3 / access** | Connects end users |
| **IXP** | Physical switch fabric where ASes meet and exchange traffic locally (~500 worldwide) |
| **CDN** | Content provider’s own network (Google, Netflix) for cheap/fast delivery |

**Also know:** **PoP** (customer connection point), **multi-homing** (multiple providers), **settlement-free peering** (no payment for direct exchange).

Topology: historically **hierarchical**; **flattening** as IXPs/CDNs let smaller networks connect directly.

---

## 3. Autonomous System (AS)

- Group of routers under **one administrative authority** with one routing policy.
- Identified by **ASN** (Autonomous System Number).
- One org may run **multiple ASes** (business separation, traffic engineering).
- **Border routers** run **eBGP** to neighbors; internal routers use **IGP** + often **iBGP**.

---

## 4. Business relationships

| Relationship | Payment | Route sharing |
|--------------|---------|---------------|
| **Customer–provider (transit)** | Customer pays provider | Provider carries customer traffic **both directions** to/from rest of Internet |
| **Peering** | Usually settlement-free | Limited: own prefixes + **own customers** only — not provider/peer routes |
| **Sibling** | Same owner | Freely exchange all routes |

**Provider charging:** fixed fee within bandwidth cap, or **95th percentile** of periodic samples (ignore top 5% spikes).

**Peering caveats:** valid while traffic not **highly asymmetric**; Tier-1 peers need similar size; smaller ISPs peer to save transit costs.

---

## 5. Import and export policy

**Golden rule:** Only carry transit traffic if you get **paid** (or peering deal allows it).

### Export (what you advertise)

| Learned from | Export to |
|--------------|-----------|
| **Customer** | Everyone (customers, peers, providers) |
| **Peer** | Customers only |
| **Provider** | Customers only |

### Import (which route you prefer)

**Customer routes > Peer routes > Provider routes**

Implemented in practice via **LocalPref** ranges (e.g., customer 90–99, peer 80–89, provider 70–79).

---

## 6. BGP design goals

**Original:**

1. **Scalability** — thousands of ASes, large tables, convergence in reasonable time, loop-free paths.
2. **Express routing policies** — attributes + filters; each AS decides **independently** and **confidentially**.
3. **Allow cooperation** — local decisions while interconnecting competing networks.

**Added later — Security:** not in original design; attacks, misconfig, faults → RPKI, BGPsec, prefix registries (slow adoption).

---

## 7. BGP protocol basics

- **BGP peers** = routers exchanging routes over semi-permanent **TCP** session (port 179).
- **OPEN** starts session; **UPDATE** announces or **withdraws** routes; **KEEPALIVE** maintains session.
- Destinations = **prefixes** (e.g., `203.0.113.0/24`), not individual hosts.

**Key attributes:**

| Attribute | Role |
|-----------|------|
| **AS-PATH** | List of ASNs traversed; loop detection; shorter often wins |
| **NEXT-HOP** | IP of next router toward dest — usually **border router** for external routes |

---

## 8. eBGP vs iBGP

| | **eBGP** | **iBGP** |
|---|----------|----------|
| **Between** | Routers in **different** ASes | Routers in **same** AS |
| **Purpose** | Learn routes from **outside** neighbors | Spread eBGP-learned routes **inside** AS |
| **Topology** | One session per neighbor AS | Often **full mesh** (each BGP router ↔ every other) |
| **AS-PATH** | Prepends local ASN | Does not prepend |
| **vs IGP** | — | **Not an IGP** — does not compute internal shortest paths |

**Together:** BGP picks **which border** to use; **IGP** finds path **to** that border (FIB build).

---

## 9. BGP decision process (path selection)

Pipeline: **Receive** → **Import filters** → **Decision** → **Install FIB** → **Export**

Compare routes **attribute-by-attribute** until one wins:

| Step | Attribute | Who controls |
|------|-----------|--------------|
| 1 | **Highest LocalPref** | Local AS — **outbound** exit preference |
| 2 | **Shortest AS-PATH** | Neighbor |
| 3 | **Lowest origin type** | Protocol (IGP < EGP < Incomplete) |
| 4 | **Lowest MED** | Neighbor — **inbound** entry hint (same neighbor only) |
| 5 | **eBGP over iBGP** | Protocol |
| 6 | **Lowest IGP cost to NEXT-HOP** | Local AS — **hot potato** ([Lesson 3](../lesson-03/intradomain-routing.md#hot-potato-routing)) |
| 7 | **Lowest router ID** | Tiebreak |

### LocalPref vs MED

- **LocalPref** — set **inside your AS**; **higher = preferred**; controls **outbound** exit.
- **MED** — set by **neighbor**; **lower = preferred** if honored; suggests **inbound** entry point; **suggestion only**.

---

## 10. BGP challenges

| Problem | Mitigation |
|---------|------------|
| **Misconfiguration** | Route filters, prefix limits |
| **Update storms / churn** | **Flap damping** (suppress unstable prefixes) |
| **Table growth** | Aggregation, filtering long prefixes, default routes (small ASes) |
| **Weak authentication** | RPKI, BGPsec (gradual) |

!!! warning "Exam point"
    BGP errors **do not stay local** — they propagate to neighbors and can cause global instability.

---

## 11. IXPs and route servers

**IXP** — physical infrastructure (switches in colo) where **participant ASes** exchange traffic locally.

**Why peer at IXP:** keep local traffic local, lower cost, lower latency, DDoS visibility, innovation hub.

**Peering modes:** public (shared fabric), private (dedicated cross-connect), bilateral (pairwise BGP), **multilateral** (via **route server**), remote peering.

**Route server problem:** bilateral peering = **O(n²)** sessions.

**Route server solution:** each AS → **one** session to RS = **O(n)**.

- RS maintains **Master RIB** + **per-AS RIBs**.
- **Import filters** — can this member advertise this prefix?
- **Export filters** — can member Z see member X’s route?
- RS = **control plane only**; **data traffic flows directly** between participants on the fabric.

---

## 12. High-yield exam Q&A

### ISPs, IXPs, and CDNs?

**ISPs** sell connectivity (tiered). **IXPs** are local meet-up points for traffic exchange. **CDNs** are content networks for efficient delivery.

### What is an AS?

Routers under one admin authority, one policy, unique **ASN**. **IGP** inside, **BGP** at borders.

### Transit vs peering?

**Transit:** customer pays; full reachability both ways. **Peering:** no payment; limited route ads (own + customers).

### Import/export rules?

Export **customer** routes to all; **peer/provider** routes to **customers only**. Import: **customer > peer > provider**.

### eBGP vs iBGP?

**eBGP** between ASes learns external routes. **iBGP** inside AS disseminates them (full mesh typical). **iBGP ≠ IGP**.

### BGP decision steps?

LocalPref → AS-PATH → origin → MED → eBGP>iBGP → IGP cost → router ID.

### LocalPref vs MED?

**LocalPref** = your **outbound** exit (higher wins). **MED** = neighbor’s **inbound** hint (lower wins if honored).

### Main BGP challenges?

Misconfigs, churn, table growth, lack of built-in security. Mitigations: filters, limits, aggregation, flap damping.

### What is an IXP?

Switch fabric where ASes interconnect locally; needs ASN, BGP router, port, GTC.

### How does a route server work?

Collects routes, applies import/export filters per member, advertises tailored views — scales peering without N² bilateral sessions. Data plane stays direct.

### Hot potato?

BGP step 6: pick egress with **lowest IGP cost** to NEXT-HOP border router.

---

## 13. One-page cheat sheet

```
IGP inside AS | BGP between ASes (policy-driven, not just shortest)

AS: one admin, ASN, border routers run eBGP

Transit: customer pays provider (both directions)
Peering: free, limited routes (own + customers), balanced traffic

Export: customer→all | peer/provider→customers only
Import: customer > peer > provider

BGP: TCP sessions, UPDATE/withdraw, prefixes
AS-PATH (loops, length) | NEXT-HOP (border router)

eBGP: between ASes | iBGP: spread external routes inside (full mesh)
iBGP ≠ IGP — IGP routes TO border; BGP picks WHICH border

Decision: LocalPref → AS-PATH → origin → MED → eBGP>iBGP → IGP cost → router ID
LocalPref: higher = preferred EXIT | MED: neighbor hint for ENTRY

Risks: global propagation of misconfig; flap damping, filters, aggregation
IXP: local peering hub | Route server: O(n) sessions, control only
```
