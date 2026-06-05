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
| Speed | Slow (protocol timers) | Per-packet (ns) |
| Job | OSPF/BGP, compute FIB, SNMP/config | LPM, forward, checksum/TTL |
| Location | Routing processor | Input ports + hardware |
| SDN | Can be centralized controller | Devices execute installed rules |

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

### Unibit

- One bit per level; 0/1 branches.
- Track **last valid prefix** along path → LPM.
- Worst case **O(W)** steps (W=32 IPv4).

### Multibit

- Stride **s** bits per level → up to $2^s$ children per node.
- Fewer memory accesses; **larger/sparser** nodes.

### Prefix expansion

- Expand shorter prefixes to stride-aligned lengths.
- **Collision** with more-specific entry → **drop expanded copy**.
- Trade: **memory** for **lookup speed**.

### Fixed vs variable stride

| | Fixed stride | Variable stride |
|---|--------------|-----------------|
| Implementation | Simpler | More complex |
| Memory | May waste on sparse levels | Optimize per subtree |
| Lookups | Uniform depth per level | Fewer accesses where dense |

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

## 8. Traffic characteristics (design consequences)

1. **Bursty** → need buffers; design for peaks.
2. **Small packets common** → **packets/sec** stresses lookup, not just Gbps.
3. **Non-uniform prefix lengths** → LPM structures must handle /8–/32.
4. **Few hot prefixes carry most traffic** → **caching** popular FIB entries helps.

---

## 9. Bottlenecks & fundamental problems

**Two fundamental problems:**

1. Link speeds grew faster than per-packet processing (lookup harder than exact match).
2. Routing table size growth (900k+ prefixes).

**Bottlenecks:**

- LPM at line rate
- Memory: DRAM slow, SRAM limited, TCAM fast but costly
- Fabric throughput vs aggregate input rate
- Output port contention → queuing, HOL blocking (detail in Lesson 6)

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
Multibit trie: stride s, 2^s children, fewer accesses, more memory
Prefix expansion: pad to stride; drop on collision with specific prefix

CIDR: /n variable prefixes; aggregation; /24→255.255.255.0

Traffic: bursty, small packets, uneven prefix lengths, hot spots
Bottlenecks: lookup speed, memory type, fabric, output contention
```
