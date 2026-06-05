---
tags:
  - lesson-03
  - routing
  - ospf
  - igp
  - plain-language
search:
  boost: 2
---

# Lesson 3: Intradomain Routing — Plain-Language Guide

The simplest version of [Lesson 3](intradomain-routing.md). We explain ideas through **real situations** — loading a page at work, a fiber cut on campus, a small office network. Routing between companies is [Lesson 4](../lesson-04/interdomain-routing.md). For exam detail, use the **[Quick Study Guide](quick-study-guide.md)** or **[Quiz](quiz.md)**.

---

## Summary

When you open a website, your packet hops through **routers**. Each router must answer one question fast: **which wire is next?**

Two jobs, two speeds:

- **Routing** (slow) — routers talk and **build a map** of good paths.
- **Forwarding** (fast) — every packet **reads the map** and moves on.

Inside one organization, **IGP** (Internal Gateway Protocol) picks paths. Between organizations, **BGP** picks the next neighbor ([Lesson 4](../lesson-04/interdomain-routing.md)).

The two main ways to build the map: **link-state** (everyone shares the full picture — **OSPF**) and **distance-vector** (routers only gossip with neighbors — **RIP**).

---

## The one-sentence version

Routers inside one network slowly **build a map of the best paths**, then **use that map instantly** for every packet.

---

## Scenario: you load a page at work

You are on company Wi‑Fi. You open `news.ycombinator.com`. Your laptop does not know the whole Internet — it sends the packet to the **default gateway** (your office router).

```
Your laptop → office routers → border router → ISP → … → Hacker News server
```

Each hop is a different organization's problem:

| Leg of the trip | Who decides the path | Plain English |
|-----------------|----------------------|---------------|
| Inside your company | **IGP** (OSPF or RIP) | Best route **inside our building** |
| At the company edge | **BGP** | Which **neighbor's door** to use next |
| Inside the ISP | **IGP** again | Same story, different owner |

**TCP** (Lesson 2) cares about the whole trip to the server. **Routing** cares about **one hop at a time**.

**Memory trick:** **Transport = door to door. Routing = one hallway at a time.**

---

## Scenario: the router's two jobs

Think of GPS on your phone:

| Job | Feels like | When it runs |
|-----|------------|--------------|
| **Routing** (control plane) | Drawing the map | When a road closes or traffic patterns change |
| **Forwarding** (data plane) | Turn-by-turn directions | Every single packet, instantly |

Your web traffic does **not** go through the router's CPU. The router's brain builds a **forwarding table** ("to reach 10.0.5.0, send out port 3"). Fast chips read that table for each packet.

When a link breaks, routing protocols **converge** — routers agree on new paths, update the table, and forwarding picks up the new routes.

**Memory trick:** **Routing draws the map. Forwarding drives the car.**

---

## Scenario: a fiber cut on a big campus

Georgia Tech–size network: dozens of buildings, hundreds of routers. A backhoe hits fiber between two buildings.

**Link-state (OSPF)** is what most big networks use:

1. The routers on either side of the cut shout: **"My link is down!"** (link-state advertisements, or **LSAs**).
2. Every router in the area gets the same updated **map**.
3. Each router runs **Dijkstra's algorithm** — "from me, what's the cheapest path to everywhere now?"
4. Forwarding tables update. Traffic reroutes in seconds to minutes.

Nobody asks every neighbor for gossip. Everyone works from the **same shared map**, like every driver getting the same updated Waze screenshot.

| Real-world fit | Protocol | Why |
|----------------|----------|-----|
| University, ISP, big company | **OSPF** | Fast recovery; scales with **areas** (each campus section has its own map; a **backbone** ties them together) |
| Small office, lab, legacy gear | **RIP** | Simple hop counting; fine when the network is tiny |

**Memory trick:** **Link-state = shared map. Distance-vector = neighbor gossip only.**

For Dijkstra symbols, worked graphs, and OSPF area diagrams, see the **[full guide](intradomain-routing.md)**.

---

## Scenario: three routers in a small office (distance-vector)

Three routers — **x**, **y**, **z** — in a row. Wire costs: x–y = 2, y–z = 1, x–z = 7 (direct link is expensive).

Router **x** wants to reach **z**. At first it only knows its direct wires: "z costs **7**."

Then **y** tells x: "I can reach z for cost **1**." x thinks: go to y first (cost 2), then y's path (cost 1) → total **3**. That beats the direct wire. Done.

That is **distance-vector**: each router keeps a list — **"my best cost to every place"** — and only talks to **neighbors**. The math rule is **Bellman-Ford**: pick the neighbor where `(wire cost to neighbor) + (neighbor's cost to destination)` is smallest.

**RIP** (Routing Information Protocol) is the classic real-world example: count **hops** (each wire = 1), max **15** hops, **16 means unreachable**, updates about every **30 seconds** on **UDP port 520**.

---

## Scenario: when bad news travels slowly (count-to-infinity)

Good news spreads fast. A link gets **cheaper**? Everyone updates in a few rounds.

**Bad news** is the problem. The x–y wire **breaks**, but **z** still tells y: "I can reach x for cost 5" (stale — that path used to go through y).

1. **y** thinks: "I'll reach x through z!" Cost = 1 + 5 = **6**.
2. **z** hears y say "x costs 6" and thinks: "I'll go through y!" Cost = 1 + 6 = **7**.
3. Costs creep up: 6, 7, 8, 9… Packets can **loop** until the numbers get high enough that everyone gives up.

That is **count-to-infinity**. It is why distance-vector can be **slow** after a failure.

**Poison reverse** is a partial fix: if z reaches x **through** y, z tells y "x is unreachable." That stops simple two-router loops. Bigger loops need more tricks (split horizon in RIP).

| What happened | How fast? | Why |
|---------------|-----------|-----|
| Link got **cheaper** | Few rounds | Lower numbers win immediately |
| Link **broke** | Many rounds | Old, wrong paths linger |

---

## Scenario: your ISP has two exits (hot potato)

A big ISP connects to the rest of the Internet through several **border routers** — say San Francisco and New York. **BGP** (Lesson 4) may say both exits are equally good for reaching Netflix.

**Hot potato routing:** pick the exit with the **lowest internal cost** from where you are **right now**. A router in Dallas might send traffic out San Francisco (internal cost 9) instead of New York (cost 10).

Goal: get the packet **off your network fast**. Trade-off: the global trip might not be optimal — you optimized **your** hallways, not the whole Internet.

---

## Link-state vs distance-vector — at a glance

| Question | Link-state (**OSPF**) | Distance-vector (**RIP**) |
|----------|----------------------|---------------------------|
| What each router knows | **Full map** (per area) | Only what **neighbors** say |
| How they talk | Flood **LSAs** to everyone | Swap cost lists with **neighbors** |
| After a link break | Usually **fast** | Can hit **count-to-infinity** |
| Typical home | Campus, ISP, enterprise | Small LAN, legacy |

---

## The whole lesson on one napkin

```
Scope:     IGP inside one AS | BGP between ASes (Lesson 4)
Jobs:      Routing = build map (slow) | Forwarding = use map (fast)

Link-state:  share map → Dijkstra → next hops (OSPF, big networks)
DV:          neighbor gossip → Bellman-Ford → next hops (RIP, small LAN)

DV trap:     good news = fast | bad news = count-to-infinity
Fix:         poison reverse (helps 2-router loops)

RIP:         hop count, max 15, 16 = too far
OSPF:        areas + backbone, shared map per area

Hot potato:  BGP says exits tie → pick nearest exit by internal cost
```

---

## Where to go next

| You want… | Go here |
|-----------|---------|
| Full detail + diagrams | [Lesson 3 — full guide](intradomain-routing.md) |
| Exam tables & Q&A | [Quick Study Guide](quick-study-guide.md) |
| Practice | [Lesson 3 Quiz](quiz.md) |
| Routing between companies | [Lesson 4 — BGP](../lesson-04/interdomain-routing.md) |
