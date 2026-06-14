---
tags:
  - lesson-05
  - router-design
  - plain-language
search:
  boost: 2
---

# Lesson 5: Router Design (Part 1) — Plain-Language Guide

The simplest possible version of [Lesson 5](router-design-1.md). We explain ideas through **everyday situations** — sending a message, sorting mail, rush-hour traffic. Scheduling, QoS, and token buckets are in [Lesson 6](../lesson-06/router-design-2.md). When you want exam detail, use the **[Quick Study Guide](quick-study-guide.md)** or the **[Quiz](quiz.md)**.

---

## Summary

A **router** is the box that connects networks and forwards **packets** hop by hop. Every packet goes through a fast pipeline: **look up where it goes → move it inside the box → wait in line if needed → send it out the right port**.

Routers split work into two jobs. The **control plane** is the slow brain that builds the map (routing protocols, table updates). The **data plane** is the fast muscle that reads the map on every packet. Finding the right route uses **longest prefix match** — and **tries** are tree structures that make that search fast enough for wire speed.

---

## The one-sentence version

A router's data plane looks up each packet's destination, switches it across an internal fabric, queues it if the link is busy, and sends it out — while the control plane slowly builds the lookup table that tells it how.

---

## Scenario: you send a photo to a friend

Your phone uploads a photo. The packet leaves your Wi‑Fi, hits your home router, then your ISP's router, then more routers on the way to your friend.

**At each router, the same five steps happen:**

```
Packet arrives
    → Lookup: "Which port leads toward this destination?"
    → Switch: move it across the router's internal highway
    → Queue: wait if the outgoing link is busy
    → Schedule: pick which waiting packet goes next
    → Output: transmit on the wire
```

You never see any of this. It happens in **nanoseconds** per packet.

**Memory trick:** **Lookup → Switch → Queue → Schedule → Out.**

![Data-plane pipeline from lookup through switching, queuing, scheduling, and output](../images/router-data-plane-pipeline.png)

---

## Scenario: airport flight plan vs boarding gate

Think of a busy airport.

| | **Control plane** | **Data plane** |
|---|-------------------|----------------|
| **Who** | Airline ops center | Gate agents at each terminal |
| **Speed** | Slow — updates routes over minutes or hours | Fast — scan every boarding pass instantly |
| **Job** | Decide which flights exist and where they go | Move each passenger to the right gate |
| **In a router** | Runs OSPF/BGP, builds the forwarding table (**software**) | Looks up destination → forwards the packet (**hardware**) |

The ops center decides **what the map should say**. Gate agents **use** the map on every passenger without re-planning the whole airline. The data plane works on a **much shorter timescale** — every packet, not every routing update.

**Key takeaways:**

- **Routing** = control plane (build the map). Same idea as [Lesson 3](../lesson-03/intradomain-routing.md).
- **Forwarding** = data plane (read the map per packet).
- In **SDN** (later lessons), the "ops center" can live on a separate controller — same split, more centralized.

![Control plane versus data plane responsibilities inside a router](../images/router-control-data-plane.png)

---

## Scenario: what's inside the box?

When a packet hits a router, four parts do the work:

| Part | Everyday analogy | What it actually does |
|------|------------------|----------------------|
| **Input port** | Receiving dock | Gets bits off the wire; looks up destination in the **FIB** (Forwarding Information Base) |
| **Switching fabric** | Warehouse conveyor belt | Moves the packet from input to the right output |
| **Output port** | Loading dock | Buffers packets; sends them on the outgoing link |
| **Routing processor** | Back-office planner | Control plane — runs protocols, updates tables |

```
Packet in → [Input: lookup] → [Fabric] → [Output: queue + send] → next hop
                  ↑
           table built by control plane (OSPF, BGP, etc.)
```

---

## Scenario: rush hour inside the router

Imagine packets as cars trying to cross an intersection inside the router. Three designs for that intersection:

| Design | Real-life feel | Can multiple packets move at once? |
|--------|----------------|-------------------------------------|
| **Memory** | One-lane bridge — cars take turns copying through a shared lot | **No** — one at a time |
| **Bus** | Single shared road everyone drives on | **No** — bus is shared |
| **Crossbar** | Many lanes with a traffic light matrix | **Yes** — if they want different exits |

**Why it matters:** If the inside of the router is slower than the line speed, packets pile up → delay and drops. Only **crossbar** can move **multiple packets at once** (as long as they don't fight for the same output).

![Crossbar switching fabric enabling parallel transfers to different outputs](../images/switching-via-crossbar.png)

---

## Scenario: sorting mail by zip code

Routers don't store every IP address. They store **prefixes** — blocks like `192.168.1.0/24` (think "everything starting with these bits").

When a packet arrives, the router finds the **most specific matching prefix**. That's **longest prefix match (LPM)** — longest match wins.

**Real example:**

Your router's table says:

| Prefix | Means | Send out |
|--------|-------|----------|
| `10.0.0.0/8` | All addresses starting with `10.` | Port 1 |
| `10.1.0.0/16` | All addresses starting with `10.1.` | Port 2 |

A packet to `10.1.2.3` matches **both** rules. The `/16` is more specific → **Port 2**.

**Postal analogy:** A letter to "90210-1234" matches both "902xx" and "90210-xxxxx." The longer, more specific zip wins.

**Why it's hard:** At 40 Gbps, the router might get only **1–2 memory lookups** per packet — not time to scan a whole phone book.

![Packet lookup in the FIB followed by switching across the router fabric](../images/router-lpm-packet-arrival.png)

---

## Scenario: the phone tree at customer service

How do routers search millions of prefixes that fast? With a **trie** (say "try") — a tree where each branch is a bit of the address.

**Unibit trie — one question at a time:**

Like a phone tree: "Press 0 or 1…" — one bit per step, up to **32 steps** for IPv4. The course uses nine prefixes (**P1–P9**) — the same ones from Practice Quiz 5-2:

| Prefix | Pattern |
|--------|---------|
| P1 | `101*` |
| P2 | `111*` |
| P3 | `11001*` |

To **store** P1 (`101*`): root → 1 → 0 → 1. To **store** P7 (`100000*`): root → 1 → then five 0-branches.

To **look up** a packet: walk the trie bit by bit, remember the **last prefix label** you pass (e.g., P4 `1*` before you reach P2 `111*`). When you can't go further, that last label is your longest match.

**Squares vs ovals in the diagram:**

| Shape | What it means |
|-------|---------------|
| **Square** | Normal node — choose **0** or **1**, one bit at a time |
| **Oval (P9)** | **Compressed branch** — only one valid path existed, so several bits are stored together (e.g. `01`); you must match them all at once |

**Why P3 became an oval:** P3 = `11001*`. After `110`, the next bits are always `0` then `1`, and no other prefix shares that stretch. Two one-way square nodes collapse into oval **P9** instead of wasting empty pointers.

**Why `10*` returns P4, not P8 or P1:** P8 = `100*` and P1 = `101*` — both need a **third** bit. Lookup for `10*` stops after 2 bits; the last label recorded is **P4** (`1*`) at depth 1. The `10` square is just a fork — P8 and P1 live one level deeper. **Rule:** a prefix appears where **its bits end**, not at every node you pass through.

**Problem:** 32 steps is too many at wire speed.

**Multibit trie — ask several bits at once:**

"Press 00, 01, 10, or 11" — jump **several bits per level** (the **stride**). Fewer steps = faster. But each node is bigger (more empty slots) = more memory.

| Approach | Speed | Memory |
|----------|-------|--------|
| **Unibit** | Up to 32 memory trips | Lean |
| **Multibit** | Fewer trips | Fatter nodes |

**Prefix expansion — when a short rule doesn't fit the stride:**

Suppose the stride is 2 bits but you have a rule for `11*`. You stretch it into `1100*`, `1101*`, `1110*`, `1111*`. If an expanded copy **collides** with a more-specific real entry, **drop the expanded copy** — the specific rule wins.

**Memory trick:** Unibit = **one question at a time**. Multibit = **multiple-choice at each level**. Prefix expansion = **stretch short rules to fit the quiz format**.

![Unibit trie for the P1–P9 prefix database](../images/unibit-trie-p1-p9-structure.png)

---

## Scenario: why your company got a /22 instead of a whole Class B

Old **classful** addressing gave you Class A, B, or C — often way too much or too little. **CIDR** (Classless Inter-Domain Routing) fixed that.

| Old problem | CIDR fix |
|-------------|----------|
| Company needs 500 addresses, gets 65,000 (Class B) | Give them exactly `/22` (~1,000 addresses) |
| Every small network gets its own table entry | **Aggregation** — combine many small blocks into one bigger announcement |

**Slash notation cheat sheet:**

| Slash | Mask (example) | Plain English |
|-------|----------------|---------------|
| `/24` | `255.255.255.0` | First 24 bits = network |
| `/16` | `255.255.0.0` | First 16 bits = network |
| `/8` | `255.0.0.0` | First 8 bits = network |

`/n` = first **n** bits identify the network block.

---

## Scenario: why routers are so hard to build

Four pressures from measurement studies and scaling trends:

| Pressure | What you notice | Why engineers care |
|----------|-----------------|-------------------|
| **Many concurrent flows** | No single "hot" destination | **Caching fails** in backbone routers — every packet needs lookup |
| **Small packets (TCP ACKs)** | Tiny packets flood the router | **Packets/sec** matters as much as Gbps |
| **Memory access count** | — | Lookup speed ≈ number of **memory accesses** (1–2 allowed at line rate) |
| **Prefix table growth** | Routing table keeps growing | 150k+ prefixes heading toward 500k–1M; fast **BGP updates** required |

**Memory tradeoff:** DRAM is cheap but too slow; SRAM/TCAM is fast but expensive and limited. That's why tries, multibit strides, and prefix expansion exist.

**Router bottleneck families** (each has causes and solutions explored later in the module):

| Bottleneck | Sample fix |
|------------|------------|
| Prefix lookups | Compressed multibit tries |
| Switching / HOL blocking | Crossbar + virtual output queues |
| Fair queueing | WFQ, deficit round robin |
| Security at scale | Bloom-filter traceback |

![Router input port, switching fabric, and output port with throughput and queuing challenges](../images/router-challenges-switch-fabric.png)

---

## The whole lesson on one napkin

```
You send a photo → every router: Lookup → Switch → Queue → Schedule → Out

Control plane = slow brain (builds the map via OSPF, BGP)
Data plane = fast muscle (reads the map per packet)

Inside the box: input ports | fabric | output ports | routing processor

Rush hour inside: memory (1 lane) | bus (1 lane) | crossbar (many lanes)

Mail sorting = longest prefix match (/16 beats /8)

Phone tree = trie lookup; multibit = fewer questions per level
Prefix expansion = stretch short rules; drop collisions

CIDR = right-sized address blocks + aggregation
```

---

## Where to go next

| You want… | Go here |
|-----------|---------|
| Full detail + study Q&A | [Lesson 5 — full guide](router-design-1.md) |
| Exam tables & short answers | [Quick Study Guide](quick-study-guide.md) |
| Practice | [Lesson 5 Quiz](quiz.md) |
| Scheduling, HOL, token bucket | [Lesson 6 — Part 2](../lesson-06/router-design-2.md) |
| How tables get built | [Lesson 3 — routing](../lesson-03/intradomain-routing.md) |

---

**Bottom line:** Routers forward at wire speed using a fast data-plane pipeline and trie-based longest-prefix lookup, while the control plane slowly installs the rules that make each lookup correct.
