---
tags:
  - lesson-05
  - router-design
  - quick-study
search:
  boost: 2
---

# Lesson 5: Quick Study Guide — Router Design (Part 1)

Condensed review for exams. New to the material? Start with the **[Plain-language guide](plain-language.md)**. Full detail: [Lesson 5 guide](router-design-1.md). Practice: [Lesson 5 Quiz](quiz.md). Part 2 (scheduling, QoS): [Lesson 6](../lesson-06/router-design-2.md).

---

## 1. Big picture

- Router **data-plane pipeline:** **lookup → switching → queuing → scheduling → output**.
- **Control plane** builds **FIB** (slow); **data plane** does **LPM** per packet (line rate).
- Part 1 focus: architecture, switching fabrics, **longest-prefix match**, **tries**, **prefix expansion**.
- Part 2 ([Lesson 6](../lesson-06/router-design-2.md)): classification, HOL/VOQ, crossbar scheduling, token/leaky bucket.

!!! tip "Memory aid"
    **Lookup → Switch → Queue → Schedule → Out.** Control plane feeds the lookup table.

---

## 2. Control plane vs data plane

| | Control plane | Data plane |
|---|---------------|------------|
| **Implementation** | **Software** (routing processor) | **Hardware** (input ports, fabric) |
| Speed | Slow (protocol timers) | Per-packet (ns) — **shorter timescale** |
| Job | OSPF/BGP, compute FIB, SNMP/config | LPM, forward, checksum/TTL |
| Location | Routing processor | Input ports + hardware |
| SDN | Can be centralized controller | Devices execute installed rules |

### Classify operations (Canvas practice quiz)

| Operation | Plane |
|-----------|-------|
| Computing paths based on a protocol | **Control** |
| Running protocols to build a routing table | **Control** |
| Running Spanning Tree protocol | **Control** |
| Configuring a middlebox (load balancing logic) | **Control** |
| Forwarding packets at Layer 3 | **Data** |
| Switching packets across the fabric | **Data** |
| Decrementing TTL | **Data** |
| Computing IP header checksum | **Data** |
| Forwarding per installed middlebox rules | **Data** |

---

## 3. Router components

| Component | Functions |
|-----------|-----------|
| **Input ports** | Line termination, link-layer processing, **LPM lookup**, input queuing if fabric contended |
| **Switching fabric** | Moves packets input → output |
| **Output ports** | Queuing/buffering, scheduling, link-layer transmit |
| **Routing processor** | Routing protocols, forwarding table computation, management |

---

## 4. Switching fabrics

| Type | Mechanism | Parallel transfers? | Bottleneck |
|------|-----------|---------------------|------------|
| **Memory** | Copy to shared memory → copy out | **No** (one at a time) | Memory bandwidth (~2× line rate) |
| **Bus** | Shared bus; labeled output port | **No** (one at a time) | Bus bandwidth |
| **Crossbar** | 2N interconnect; configurable pairs | **Yes** (different outputs) | Same-output arbitration |

!!! warning "Exam point"
    Only **crossbar** can send **multiple packets in parallel** across the fabric (if destinations differ).

---

## 5. Longest prefix match (LPM)

- FIB stores **prefixes** (CIDR), not individual hosts.
- Multiple matches → choose **longest (most specific)** prefix.
- Hard because: variable length + **line-rate** requirement + **900k+** Internet prefixes.

---

## 6. Tries

### Unibit (P1–P9 database)

| Prefix | Pattern |
|--------|---------|
| P1 | `101*` |
| P2 | `111*` |
| P3 | `11001*` |
| P4 | `1*` |
| P5 | `0*` |
| P6 | `1000*` |
| P7 | `100000*` |
| P8 | `100*` |

- One bit per level; 0/1 pointers from root.
- Track **last valid prefix** on path → LPM when search fails.
- **Substring rule:** shorter prefix (P4 `1*`) stored on path to longer (P2 `111*`).
- **Square** = normal 0/1 branch; **oval (P9)** = compressed one-way branch (match multi-bit label at once).
- **One-way branches** compressed (P9 = `01` on path to P3 — no other prefix shares `110` then `01`).
- **Prefix stored where its bits end** — `10*` → **P4** (`1*`), not P8 (`100*`) or P1 (`101*`); need 3rd bit for those.
- Worst case **O(32)** memory accesses for IPv4.

**LPM walk:** trace bits → record prefixes on path → on failure, return last recorded.

### Multibit

- **Stride k** → $2^k$ children per node; fewer levels than unibit.
- **Why:** 32 unibit accesses × ~60 ns ≈ **1.92 μs** — too slow at wire speed.
- **Fixed** vs **variable** stride tries.

### Prefix expansion (controlled)

- Pad prefixes to **multiples of stride length**.
- **Collision** with existing entry → **drop expanded copy**.
- More entries, fewer distinct lengths → faster indexing.

**Quiz example (stride 3):** P3=`1*` → `100*`, `110*`, `111*` (`101*` dropped — P1 owns it). P2=`0*` → `000*`, `001*`, `010*`, `011*`.

### Fixed vs variable stride

| | Fixed stride | Variable stride |
|---|--------------|-----------------|
| Stride per level | Same **k** everywhere | **k** encoded in each pointer |
| Prefix lengths | Multiples of **k** only | Multiples of **k** per node |
| Memory | More entries (e.g., 8-entry node for 2 remaining bits) | **Fewer entries** — tune per subtree |
| Optimization | Simpler | **Dynamic programming** for optimal strides |
| Lookup | Fewer accesses than unibit | Fewer accesses + less memory than fixed |

**Fixed stride 3 lookup:** remember last prefix on pointer chain; stop at empty pointer (`001` → P5; `100000` → P7).

**Variable stride quiz (n1–n17):** a→**n2,n3**; d→**n4,n5**; c→**n8,n9**; b→n16; e→n10; f→n12; g→n13; h→n14; i→n15; rest **none**. Short prefixes label **every** matching child subtree.

**After expansion (stride s):** new prefixes only at lengths that are multiples of s per trie level (e.g., stride 8 on IPv4 → lengths 8, 16, 24, 32).

---

## 7. CIDR & prefix notation

**CIDR** — classless variable-length prefixes; enables **aggregation** and reduces waste vs Class A/B/C.

| `/n` | Mask example |
|------|--------------|
| `/24` | `255.255.255.0` |
| `/16` | `255.255.0.0` |
| `/20` | `255.255.240.0` (`11110000` in 3rd octet) |

`192.168.1.0/24` = address `192.168.1.0`, mask `255.255.255.0`.

---

## 8. Traffic observations → lookup design

| Observation | Inference |
|-------------|-----------|
| ~250k concurrent flows | Caching **poor** in backbone routers |
| ~50% TCP ACKs (40 bytes) | **Wire-speed** lookup on small packets |
| Lookup = memory accesses | Speed measured by **# of accesses** |
| Prefix lengths /8–/32 | Naive LPM ≈ **24 accesses** |
| 150k+ prefixes (→ 500k–1M) | Tables must scale |
| Unstable BGP/multicast | Fast **updates** (ms–s) |
| High speeds need SRAM | **Minimize memory** |

**Four takeaways:** (1) many flows → no caching; (2) memory accesses dominate speed; (3) fast BGP updates; (4) SRAM vs DRAM tradeoff.

---

## 9. Bottlenecks & fundamental problems

**Fundamental problems:**

1. **Bandwidth/population scaling** — more devices, traffic, faster links.
2. **Services at high speeds** — QoS, security, measurement at line rate.

**Bottleneck → sample solution:**

| Bottleneck | Sample solution |
|------------|-----------------|
| Prefix lookups | Compressed multibit tries |
| Packet classification | Decision trees; CAM parallelism |
| Switching / HOL | Crossbar; **VOQ** |
| Fair queueing | WFQ; DRR; DiffServ |
| Security | Bloom-filter traceback |

Prefix lookups: LPM at line rate. Memory: DRAM slow, SRAM limited, TCAM fast but costly. Fabric: aggregate input rate vs crossbar throughput.

---

## 10. High-yield exam Q&A

### Router components?

Input ports, switching fabric, output ports, routing processor.

### Forwarding function?

Dest IP → **LPM** in FIB → output port → fabric. **Data plane**, line rate.

### Input vs output port functions?

**Input:** terminate line, link processing, lookup, optional input queue. **Output:** queue/schedule, link encapsulation, transmit.

### Control plane purpose?

Routing protocols, FIB computation, management — slow, software-based.

### Tasks in a router?

Lookup, switching, queuing, header validation/checksum, route processing, scheduling.

### Switching types — parallel?

Memory **no**, bus **no**, crossbar **yes** (non-conflicting outputs).

### Why multibit tries?

Unibit = up to 32 accesses; line rate allows ~1–2. Multibit reduces depth.

### Prefix expansion?

Align prefixes to stride; drop expansions that collide with more-specific entries.

### CIDR why?

Address exhaustion, table growth, **route aggregation**.

### Variable vs fixed stride?

Fixed = simpler; variable = memory/speed tuning, harder to implement.

---

## 11. One-page cheat sheet

```
Pipeline: Lookup → Switch → Queue → Schedule → Out
Control = build FIB | Data = LPM per packet

Components: input | fabric | output | routing processor

Switching: memory (1) | bus (1) | crossbar (parallel if diff outputs)

LPM: longest match wins; prefixes not hosts

Unibit trie: 1 bit/level, O(32), track last prefix on path
Multibit trie: stride $s$, $2^s$ children, fewer accesses, more memory
Prefix expansion: pad to stride; drop on collision with specific prefix

CIDR: /n variable prefixes; aggregation; /24→255.255.255.0

Traffic: bursty, small packets, uneven prefix lengths, hot spots
Bottlenecks: lookup speed, memory type, fabric, output contention
```
