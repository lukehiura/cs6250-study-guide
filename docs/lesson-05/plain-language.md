# Lesson 5: Router Design (Part 1) — Plain-Language Guide

The simplest possible version of [Lesson 5](router-design-1.md). No jargon unless we explain it right away. Scheduling, QoS, and token buckets are in [Lesson 6](../lesson-06/router-design-2.md). When you want exam detail, use the **[Quick Study Guide](quick-study-guide.md)** or the **[Quiz](quiz.md)**.

---

## Summary

A **router** connects networks and moves **packets** hop by hop. Every packet goes through a fast pipeline: **look up where it goes → move it inside the box → wait in line if needed → send it out the right port**.

Routers split work into two jobs. The **control plane** is the slow brain (routing protocols, building tables). The **data plane** is the fast muscle (lookup every packet in nanoseconds). Finding the right route uses **longest prefix match** — and **tries** are tree structures that make that search fast enough for line-rate speeds.

---

## The one-sentence version

A router's data plane looks up each packet's destination, switches it across an internal fabric, queues it if the link is busy, and sends it out — while the control plane slowly builds the lookup table that tells it how.

---

## What does a router actually do?

When your browser talks to a web server, packets pass through **routers** at each network boundary.

**Per packet, the router:**

1. **Lookup** — "Which output port leads toward this destination?"
2. **Switching** — Move the packet across the router's internal "mini-network"
3. **Queuing** — Wait in a buffer if the output link is busy
4. **Scheduling** — Pick which waiting packet goes next
5. **Output** — Transmit on the wire

**Memory trick:** **Lookup → Switch → Queue → Schedule → Out.**

---

## Two brains: control plane vs data plane

| | **Control plane** | **Data plane** |
|---|-------------------|----------------|
| **Speed** | Slow (seconds, minutes) | Fast (nanoseconds per packet) |
| **Job** | Run OSPF/BGP, build routing tables | Lookup destination → forward |
| **Nickname** | The planner | The worker |
| **Where** | Routing processor (often software) | Input ports + hardware |

The control plane decides **what** the forwarding table should say. The data plane **uses** that table on every packet without thinking hard.

In **SDN** (later lessons), the control plane can live on a separate controller — same idea, more centralized.

**Key takeaways:**

- **Routing** = control plane (build the map).
- **Forwarding** = data plane (read the map per packet).
- Same split you learned in [Lesson 3](../lesson-03/intradomain-routing.md).

---

## What's inside a router?

| Part | Job in plain English |
|------|----------------------|
| **Input ports** | Receive bits; look up destination in **FIB**; maybe queue if fabric is slow |
| **Switching fabric** | Internal highway connecting inputs to outputs |
| **Output ports** | Buffer packets; send on the outgoing link |
| **Routing processor** | Control plane — protocols, table updates, management |

```
Packet in → [Input: lookup] → [Fabric] → [Output: queue + send] → next hop
                  ↑
           FIB built by control plane (OSPF, BGP, etc.)
```

---

## How routers move packets inside (switching fabrics)

Three classic designs:

| Type | How it works | Parallel packets? |
|------|--------------|-------------------|
| **Memory** | Copy packet to shared memory, copy out | **No** — one at a time |
| **Bus** | Shared bus; one packet crosses at a time | **No** — bus is shared |
| **Crossbar** | Matrix of connections; many paths at once | **Yes** — if outputs differ |

**Key takeaway:** Only **crossbar** can move **multiple packets at once** (as long as they don't fight for the same output).

**Why it matters:** If the inside of the router is slower than the line speed, packets pile up → delay and drops.

---

## Longest prefix match (LPM)

Routers don't store every IP address. They store **prefixes** — blocks like `192.168.1.0/24`.

When a packet arrives, the router finds the **most specific matching prefix** (longest match wins).

**Example:** Table has `10.0.0.0/8` and `10.1.0.0/16`. Destination `10.1.2.3` matches both — pick `/16` (more specific).

**Why it's hard:** Not a simple exact match — you search variable-length prefixes at **line rate** (billions of bits per second).

---

## Tries — fast lookup trees

A **trie** (say "try") is a tree where each branch is a bit of the address.

### Unibit trie

- Walk **one bit at a time** — 0 = left, 1 = right.
- Remember the **last valid prefix** you passed (that's your longest match).
- Worst case: **32 steps** for IPv4.

**Problem:** At 40 Gbps you might get only **1–2 memory accesses** per lookup — 32 is too many.

### Multibit trie

- Jump **several bits per level** (stride = 2, 4, 8…).
- Fewer steps = faster.
- **Tradeoff:** each node is bigger (more empty slots) = more memory.

### Prefix expansion

Shorter prefixes don't always land on stride boundaries. **Prefix expansion** stretches them:

- `11*` with stride 2 → `1100*`, `1101*`, `1110*`, `1111*`
- If an expanded prefix **collides** with a more-specific real entry → **drop the expanded copy**

**Key takeaways:**

- **Unibit** = simple, up to 32 memory trips.
- **Multibit** = fewer trips, more memory.
- **Prefix expansion** = make short prefixes fit the stride; collisions favor the more-specific rule.

---

## CIDR — why prefixes aren't all /8, /16, /24

**CIDR** (Classless Inter-Domain Routing) replaced old **classful** addressing (Class A/B/C).

**Why it mattered:**

- **Less waste** — give a company `/22` instead of a whole Class B.
- **Smaller routing tables** — **aggregation** (combine small prefixes into one bigger announcement).

**Notation cheat sheet:**

| Slash | Mask (example) |
|-------|------------------|
| `/24` | `255.255.255.0` |
| `/16` | `255.255.0.0` |
| `/20` | `255.255.240.0` |

`/n` = first **n** bits are the network part.

---

## Why routers are hard to build

| Bottleneck | Plain English |
|------------|---------------|
| **Lookup speed** | LPM on 900k+ prefixes in nanoseconds |
| **Memory** | DRAM too slow; SRAM fast but small; TCAM fast but power-hungry |
| **Fabric throughput** | Inside must keep up with all ports combined |
| **Output contention** | Many inputs want the same output → queues |

**Traffic facts that shape design:**

1. **Bursty** — averages lie; need buffers for spikes.
2. **Small packets** — lookups/sec matter as much as Gbps.
3. **Uneven prefix lengths** — algorithms must handle /8 through /32.
4. **Hot destinations** — a few prefixes carry most traffic → caching helps.

---

## Official study questions — plain-language answers

### Router components?

Input ports, switching fabric, output ports, routing processor (control plane).

### Forwarding function?

Extract destination IP → **LPM** in FIB → send through fabric to output port. Data plane, line rate.

### Control plane purpose?

Run routing protocols, compute forwarding tables, network management. Slow, software-ish.

### Switching types — which parallel?

Memory and bus: **one at a time**. Crossbar: **multiple** if different outputs.

### Two fundamental router problems?

(1) Links got faster faster than lookup/switch silicon. (2) Routing tables keep growing.

### Why multibit tries?

Unibit = up to 32 memory accesses; line rate allows almost none. Multibit = fewer levels.

### Prefix expansion?

Stretch short prefixes to stride length; drop expanded entries that collide with more-specific ones.

### Variable vs fixed stride?

**Fixed** = simpler. **Variable** = tune memory vs speed per subtree — more complex.

---

## The whole lesson on one napkin

```
Router pipeline: Lookup → Switch → Queue → Schedule → Out

Control plane: slow, builds FIB (OSPF, BGP)
Data plane: fast, LPM per packet

Components: input ports | fabric | output ports | routing processor

Switching: memory (1) | bus (1) | crossbar (many if different outputs)

LPM: longest matching prefix wins (/16 beats /8)

Tries: tree on address bits; remember last prefix on path
Unibit: 1 bit/step, up to 32
Multibit: stride > 1, fewer steps, more memory
Prefix expansion: align to stride; drop collisions

CIDR: variable-length prefixes, aggregation, less waste
```

---

## Where to go next

| You want… | Go here |
|-----------|---------|
| Full detail + study Q&A | [Lesson 5 — full guide](router-design-1.md) |
| Exam tables & Q&A | [Quick Study Guide](quick-study-guide.md) |
| Practice | [Lesson 5 Quiz](quiz.md) |
| Scheduling, HOL, token bucket | [Lesson 6 — Part 2](../lesson-06/router-design-2.md) |
| How tables get built | [Lesson 3 — routing](../lesson-03/intradomain-routing.md) |

---

**Bottom line:** Routers forward at wire speed using a fast data-plane pipeline and trie-based longest-prefix lookup, while the control plane slowly installs the rules that make each lookup correct.
