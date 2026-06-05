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

The simplest version of [Lesson 3](intradomain-routing.md). No jargon unless we explain it right away. Routing between companies is in [Lesson 4](../lesson-04/interdomain-routing.md). For exam detail, use the **[Quick Study Guide](quick-study-guide.md)** or **[Quiz](quiz.md)**.

---

## Summary

**Routers** are like mail sorters inside one company’s network. They need to know the **best path** for each packet.

There are two slow jobs and one fast job:

- **Routing** (slow) — routers talk to each other and **build a map** of the best paths.
- **Forwarding** (fast) — each packet **looks up the map** and goes to the next stop.

Inside one company, **IGP** picks paths. Between companies, **BGP** picks the next company ([Lesson 4](../lesson-04/interdomain-routing.md)).

Two main ways to build the map:

- **Link-state** — everyone shares the full map (used by **OSPF**).
- **Distance-vector** — routers only gossip with neighbors (used by **RIP**).

---

## The one-sentence version

Routers inside one network slowly **build a map of the best paths**, then **use that map instantly** for every packet so data finds the cheapest way to its destination.

---

## Where does routing fit?

TCP gets data to the right **app** on the right **computer**.

But each packet still needs to know: **which router is next?**

That job belongs to the **network layer (IP)**. Packets hop from router to router until they arrive.

**Example trip:**

```
Your laptop → company routers → ISP routers → web server network → server
```

Each part is run by a different group. Each group has its **own** path rules.

**Key takeaways:**

- **Transport (TCP)** = the whole trip, start to finish.
- **Routing (IP)** = one hop at a time.

**Memory trick:** **Transport = door to door. Routing = one hallway at a time.**

---

## One company = one network group

An **Autonomous System (AS)** is one network run by one organization under one routing policy. Examples: your company, your ISP, or a CDN data center.

| Where | Who picks the path | Plain English |
|-------|-------------------|---------------|
| **Inside one AS** | **IGP** (Internal Gateway Protocol) | Best path **inside our building** |
| **Between ASes** | **BGP** (Border Gateway Protocol) | Which **neighbor’s door** to use next |

**How a real request works:**

1. Your browser sends a packet.
2. **IGP** finds the path to the **border router** (the exit door).
3. **BGP** picks the next ISP.
4. This repeats until the packet reaches the server’s network.
5. **IGP** delivers it to the server.

If the destination is **outside** your network, **IGP** gets you to the exit. **BGP** handles the rest.

**Key takeaways:**

- **IGP** = routing **inside** one organization.
- **Border router** = the door between inside and outside.
- **BGP** = routing **between** organizations ([Lesson 4](../lesson-04/interdomain-routing.md)).

**Memory trick:** **IGP = hallways inside the building. BGP = which exit door and which neighbor you trust.**

---

## Forwarding vs routing

Every router does **both** jobs. They run at very different speeds.

| | **Forwarding** | **Routing** |
|---|----------------|-------------|
| **Also called** | Data plane | Control plane |
| **Speed** | Very fast — every packet | Slow — when things change |
| **Job** | Look up where to send this packet | Learn the network and **build the lookup table** |
| **Feels like** | Following GPS turn-by-turn | Drawing the whole map |

**Forwarding** uses a **forwarding table**. It answers: “To reach this address, send the packet out port 2.”

**Routing** runs programs like **OSPF** or **RIP**. When a link breaks, routers update their tables until everyone agrees on new paths. That agreement is called **convergence**.

**Key takeaways:**

- **Routing** draws the map (slow, in the background).
- **Forwarding** drives using the map (fast, per packet).
- **Forwarding table** = the cheat sheet each packet reads.

**Memory trick:** **Routing draws the map. Forwarding drives the car.**

---

## Two ways to build the map

Both methods find the **cheapest path** (lowest total **link cost**). They just share info in different ways.

| | **Link-state** | **Distance-vector** |
|---|----------------|----------------------|
| **What each router knows** | The **full map** (same everywhere) | Only what **neighbors** say |
| **Main math** | **Dijkstra’s algorithm** | **Bellman-Ford** rule |
| **How they talk** | Send **LSAs** to everyone (“here are my links!”) | Send **distance lists** to neighbors only |
| **Real-world example** | **OSPF** | **RIP** |
| **When a link breaks** | Usually fixes **fast** | Can be **slow** (count-to-infinity problem) |

**Key takeaways:**

- **Link-state** = everyone has the same map.
- **Distance-vector** = gossip with neighbors only.
- **Link cost** = how “expensive” a wire is (delay, speed, or admin choice).

**Memory trick:** **Link-state = shared map. Distance-vector = neighbor gossip only.**

---

## Link-state routing — share the map, run Dijkstra

### How it works (5 steps)

1. Each router learns its **local links** and their **costs**.
2. Routers **flood LSAs** (link-state ads). Everyone builds the same **link-state database**.
3. Each router draws a **graph**: dots = routers, lines = links with costs.
4. Each router runs **Dijkstra’s algorithm** starting from **itself**.
5. Each router writes the **next hop** in its forwarding table — the **first stop** on the best path.

**Best path** = the path with the **lowest total cost**.

### Dijkstra in simple words

You are at router **u**. You want the cheapest way to every other router.

**Symbols exams use:**

| Symbol | Meaning |
|--------|---------|
| **D(v)** | Best cost from u to v so far |
| **p(v)** | The router before v on that best path |
| **N′** | Routers whose best path is **locked in** |
| **c(u,v)** | Cost of the direct wire between u and v |

**Steps:**

1. Start at yourself. Give neighbors their direct wire cost. Everyone else starts at infinity (∞).
2. Pick the unknown router with the **smallest cost**. Lock it in.
3. Check its neighbors: “Is going through this router cheaper?” Update if yes.
4. Repeat until every router is locked in.

**Result:** a shortest-path **tree** from you → forwarding table = first hop on each branch.

### Quick example

Wire costs: u–x=1, u–v=2, u–w=5, x–y=1, y–w=1.

From **u**, the cheap way to **w** is **not** the direct wire (cost 5). It is u→x→y→w (cost 1+1+1 = **3**). So the next hop to w is **x**.

### Speed of Dijkstra (for exams)

Basic Dijkstra checks all unknown routers each round. That is **O(n²)** — grows with the square of router count **n**.

With a **priority queue**, it can be **O(n log n)** — faster on big networks.

**Key takeaways:**

- **LSA** = “here are my links” message.
- **Dijkstra** = pick cheapest unknown router, one at a time.
- **Next hop** = the first router on the best path.

---

## OSPF — link-state in the real world

**OSPF** (Open Shortest Path First) is the main **link-state** protocol companies use inside their networks.

| Feature | Simple meaning |
|---------|----------------|
| **How it works** | Share map → run Dijkstra → install next hops |
| **Areas** | Big networks split into **sections** |
| **Backbone (area 0)** | The special middle section that connects all areas |
| **ABR** | **Area Border Router** — a door between an area and the backbone |
| **Between areas** | Traffic goes: area → ABR → backbone → ABR → destination area |
| **LSDB** | The shared map database all routers build |
| **Refresh** | LSAs resent about every 30 minutes; new links sent right away |

### Inside a router

```
OSPF messages  →  CPU builds map, runs Dijkstra
Your web data  →  Fast chips read table and forward (NOT through CPU!)
```

**Important:** Your normal internet traffic does **not** go through the router’s brain (CPU). Only **control messages** do. Data uses the **forwarding table** on fast hardware.

**When something changes:**

1. New LSA arrives → update the map database.
2. Run Dijkstra → update the forwarding table.
3. New packets use the new paths.

**Key takeaways:**

- **OSPF** = real-world link-state routing.
- **Area 0** = the backbone that ties areas together.
- **SPF** = the Dijkstra run that finds shortest paths.

---

## Distance-vector routing — gossip with neighbors

No full map. Each router only knows:

> “My best cost to every place — plus what my **neighbors** told me.”

### The Bellman-Ford rule

For router **x** trying to reach place **y**:

**My cost to y = the minimum of: (wire cost to neighbor v) + (v’s cost to y)**

Pick the **cheapest neighbor**.

### The loop

1. Start with costs to **direct neighbors** only.
2. Send your **distance list** to neighbors.
3. When you hear news, recalculate.
4. If anything changed, tell your neighbors.
5. Stop when nothing changes → **converged**.

### Three-router example (x, y, z)

Wire costs: x–y = 2, y–z = 1, x–z = 7.

| Round | What happens |
|-------|--------------|
| **1** | x only knows direct wires. x thinks z costs **7**. |
| **2** | x hears from y. Path x→y→z costs 2+1 = **3**. That beats 7! Next hop to z = **y**. |
| **3** | Nothing improves → **done**. |

**Key takeaways:**

- **Distance vector** = a list of “my cost to each destination.”
- **Bellman-Ford** = pick the best neighbor, add their cost.
- Routers only talk to **neighbors**, not the whole network.

---

## Good news vs bad news

### Good news (link gets cheaper) ✅

When costs **drop**, routers spread the update in just a **few rounds**. Fast and easy.

### Bad news (link breaks or gets expensive) ❌

This causes **count-to-infinity**.

**Story:** Routers x, y, and z. The y–x wire breaks. y can’t reach x directly anymore.

1. But **z still says** “I can reach x for cost 5” (old, wrong info — that path went through y).
2. **y** thinks: “I’ll go to x through z!” Cost = 1+5 = **6**.
3. **z** hears y say “x costs 6” and thinks: “I’ll go through y!” Cost = 1+6 = **7**.
4. Packets **bounce in a loop**. Costs creep up: 6, 7, 8, 9… one step per round.

| | Good news | Bad news |
|---|-----------|----------|
| **Speed** | Few rounds | Many rounds |
| **Why** | Lower numbers spread fast | Old wrong info causes loops |

**Key takeaways:**

- **Good news** (cheaper links) spreads **fast**.
- **Bad news** (broken links) spreads **slow**.
- **Count-to-infinity** = costs keep going up in a loop.

---

## Poison reverse — a white lie to stop loops

**Idea:** If **z** reaches **x** through **y**, then **z tells y**: “x is unreachable (∞).”

Now y won’t send x-traffic through z. This breaks simple **two-router** loops.

**Limits:** Works for **2-router** loops. **3 or more routers** in a loop? This alone may not fix it.

Used with **split horizon** in **RIP**.

**Key takeaways:**

- **Poison reverse** = tell a neighbor “that place is unreachable” if you use them to get there.
- It stops some loops but not all.

---

## RIP — distance-vector with hop count

**RIP** (Routing Information Protocol) is a simple distance-vector protocol for small networks.

| Fact | Value |
|------|--------|
| **How it measures distance** | **Hop count** (each wire = 1 hop) |
| **Max hops** | **15**; **16 means “too far”** (∞) |
| **Updates** | About every 30 seconds, plus when something changes |
| **Runs on** | **UDP port 520** |
| **Neighbor timeout** | No message for **180 seconds** → neighbor is dead |

**Merge rule:** If a neighbor’s path is shorter, update your table: `your hops = 1 + neighbor’s hops`.

**Problems:** Slow to fix breaks. Can loop (count-to-infinity). Fixed partly by poison reverse and split horizon.

**Key takeaways:**

- **RIP** = distance-vector with simple hop counting.
- **16 hops = infinity** in RIP.
- Good for **small** networks, not huge ones.

---

## Hot potato routing — toss it out the nearest door

Big networks use **IGP inside** and **BGP at the borders**.

When sending traffic **outside** your network, you may have **several exit routers**. BGP may say they are all equally good.

**Hot potato:** Pick the exit with the **lowest internal cost** from where you are now. Get the packet **off your network fast**.

**Example:** A router in Dallas can exit through San Francisco (internal cost 9) or New York (cost 10). BGP says both are fine → pick **San Francisco** (cheaper trip inside your network).

| Good | Bad |
|------|-----|
| Simple; uses paths you already know | The full trip might not be the best globally |
| Saves bandwidth inside your network | A cost change can shift traffic to a different exit |

**Key takeaways:**

- **Hot potato** = nearest exit when BGP says exits are tied.
- Goal: **less traffic stuck inside your network**.

---

## Link-state vs distance-vector — side by side

| Question | Link-state (OSPF) | Distance-vector (RIP) |
|----------|-------------------|----------------------|
| Full map? | **Yes** (per area) | **No** — neighbors only |
| Main algorithm | Dijkstra | Bellman-Ford |
| Messages | Flood LSAs | Lists to neighbors |
| Bad link news | Usually fast | Count-to-infinity risk |

---

## Study questions — simple answers

**Forwarding vs routing?**

- **Routing** = slow, builds the map.
- **Forwarding** = fast, uses the map per packet.

**Main idea of link-state?**

- Everyone gets the **same map** → each router runs **Dijkstra** → writes **next hops**.

**Main idea of distance-vector?**

- Neighbors swap **cost lists** → update with **Bellman-Ford** → no full map.

**Dijkstra complexity?**

- **O(n²)** basic version. **O(n log n)** with a heap.

**When does count-to-infinity happen?**

- When a link **fails** or gets **more expensive**. Routers trust stale paths and costs creep up in a loop.

**How does poison reverse help?**

- Tell a neighbor “unreachable” for a place you reach **through them**. Breaks **2-node** loops.

**What is RIP? OSPF?**

- **RIP** = distance-vector, hop count, max 15.
- **OSPF** = link-state, areas + backbone, Dijkstra.

**What is hot potato?**

- When BGP exits tie, pick the border with **lowest internal cost** from your location.

**How does a router handle updates?**

- **OSPF:** new LSA → update map → flood → Dijkstra → update forwarding table.
- **RIP:** neighbor has better cost → update list → tell your neighbors.

---

## The whole lesson on one napkin

```
Scope:        IGP inside one AS | BGP between ASes (Lesson 4)
Jobs:         Routing = build map (slow) | Forwarding = use map (fast)

Link-state:   flood LSAs → same map → Dijkstra → next hops (OSPF)
DV:           neighbor gossip → Bellman-Ford → next hops (RIP)

Dijkstra:     grow N′, pick min D, relax neighbors; O(n²) naive
Bellman-Ford: my cost = min over neighbors { wire cost + their cost }

DV traps:     good news = fast | bad news = count-to-infinity
Fix:          poison reverse (2-node loops); split horizon in RIP

RIP:          hops, max 15, 16=∞, UDP 520
OSPF:         areas, backbone 0, ABRs, LSDB, SPF, FIB

Hot potato:   BGP tie → lowest IGP cost to exit
```

---

## Where to go next

| You want… | Go here |
|-----------|---------|
| Full detail + diagrams | [Lesson 3 — full guide](intradomain-routing.md) |
| Exam tables & Q&A | [Quick Study Guide](quick-study-guide.md) |
| Practice | [Lesson 3 Quiz](quiz.md) |
| Routing between companies | [Lesson 4 — BGP](../lesson-04/interdomain-routing.md) |
