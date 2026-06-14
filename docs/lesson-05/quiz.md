---
quiz:
  auto_number: True
  shuffle_answers: True
  disable_after_submit: False
tags:
  - lesson-05
  - router-design
  - quiz
search:
  boost: 1.5
---

# Lesson 5: Interactive Quiz

Router architecture, control vs data plane, switching fabrics, and longest-prefix match. New to the material? Start with the [Plain-language guide](plain-language.md). See the [Quick Study Guide](quick-study-guide.md).

!!! info "Before you begin"
    <!-- mkdocs-quiz intro -->

---

## Control plane vs data plane

<quiz>
In a **traditional router**, data plane functions are implemented in:
- [x] Hardware
- [ ] Software

Per-packet forwarding (lookup, switching, TTL/checksum) runs at line rate in hardware.
</quiz>

<quiz>
In a **traditional router**, control plane functions are implemented in:
- [x] Software
- [ ] Hardware

Routing protocols, table computation, and management run on the routing processor.
</quiz>

<quiz>
Which plane operates on a **shorter timescale**?
- [ ] Control
- [x] Data
- [ ] Management
- [ ] All planes operate on the same timescale

Data plane = nanoseconds per packet; control plane = protocol timers and topology changes.
</quiz>

<quiz>
**Computing paths based on a routing protocol** belongs to the:
- [x] Control plane
- [ ] Data plane

Building the map (OSPF, BGP, path computation) is slow, software-based control work.
</quiz>

<quiz>
**Decrementing TTL** and **recomputing the IP header checksum** on each packet belong to the:
- [ ] Control plane
- [x] Data plane

Inline per-packet header work happens on the fast hardware path.
</quiz>

<quiz>
**Forwarding packets according to installed rules in a middlebox** is a:
- [x] Data plane operation
- [ ] Control plane operation

Installing rules is control; executing them per packet is data plane.
</quiz>

<quiz>
The router **data plane** is primarily responsible for:
- [x] Per-packet forwarding lookups and fast path processing at line rate
- [ ] Running BGP and OSPF to exchange routes with neighbors
- [ ] SNMP configuration and management only
- [ ] Building the routing table once per hour

The **control plane** runs protocols and installs forwarding state; the **data plane** uses it on every packet.
</quiz>

<quiz>
Which operation belongs to the **control plane**?
- [ ] Longest-prefix match on every arriving packet
- [ ] Updating TTL and recomputing header checksum at line rate
- [x] Running OSPF to compute and install forwarding table entries
- [ ] Transferring packets across the switching fabric

Control plane = slow intelligence; data plane = fast forwarding.
</quiz>

<quiz>
The forwarding table used for per-packet decisions is often called the [[FIB]] (Forwarding Information Base).
---
Built by the control plane (from routing protocols); consulted by the data plane for LPM.
</quiz>

---

## Router components & pipeline

<quiz>
The correct high-level data-plane pipeline order is:
- [x] Lookup → switching → queuing → scheduling → output
- [ ] Scheduling → lookup → switching → output → queuing
- [ ] Output → lookup → switching only
- [ ] BGP → OSPF → DNS → ARP

Lookup picks the output port; fabric moves the packet; queues absorb contention.
</quiz>

<quiz>
Which component performs **longest-prefix match** on the destination IP?
- [x] Input port (data plane)
- [ ] Routing processor only
- [ ] Output port exclusively
- [ ] DNS resolver

Input ports terminate the link, lookup in the FIB, and forward into the fabric.
</quiz>

<quiz>
The **routing processor** runs routing protocols and maintains tables — it is part of the [[control]] plane.
---
Unlike hardware forwarding at input ports, the routing processor operates at slower timescales.
</quiz>

---

## Switching fabrics

<quiz>
Which switching design can transfer **multiple packets in parallel** across the fabric (when they use different output ports)?
- [ ] Switching via memory
- [ ] Switching via bus
- [x] Switching via crossbar
- [ ] None — all designs are strictly serial

Memory and bus: **one packet at a time**. Crossbar: parallel non-conflicting transfers.
</quiz>

<quiz>
**Switching via memory** is limited because:
- [x] Packets must be copied into shared memory — typically one at a time; memory bandwidth caps throughput
- [ ] Crossbar arbitration always blocks all inputs
- [ ] It cannot perform IP lookups
- [ ] It requires BGP on every input port

Early design; needs ~2× line rate memory bandwidth (write + read) per packet.
</quiz>

<quiz>
On a shared **bus** interconnect inside a router:
- [ ] Unlimited packets cross simultaneously
- [x] Only one packet can use the bus at a time
- [ ] Packets never need output queues
- [ ] Longest-prefix match is skipped

Bus arbitration serializes transfers — simple but becomes a bottleneck.
</quiz>

---

## LPM forwarding table lookups

<quiz>
In a **traditional router**, traffic forwarding is based on:
- [x] Destination IP address only
- [ ] Source IP address only
- [ ] Both source and destination IP addresses

Traditional LPM uses dest IP → output port. Source-based and multi-field matching is packet classification (Lesson 6).
</quiz>

<quiz>
**Forwarding table lookup — three packets, same table.**

| Prefix | Output |
|--------|--------|
| `11100000 00*` | A |
| `11100000 01000000*` | B |
| `1110000*` | C |
| `11100001 1*` | D |
| otherwise | E |

Destination: **`10001000 11110001 01010001 11110101`**
- [x] E
- [ ] A
- [ ] C
- [ ] D

Starts with `1000…` — no `111…` prefix matches at all. Falls to **otherwise → E**.
</quiz>

<quiz>
Same forwarding table. Destination: **`11100001 01000000 11000011 00111100`**
- [ ] A
- [ ] B
- [x] C
- [ ] D
- [ ] E

First 7 bits = `1110000` → C ✓. Bit 8 = `1` → not `1110000000` (A needs bits 8–9 = `00`). Bit 9 = `0` → not D (`11100001 1*` needs bit 9 = `1`). Longest match = C (7 bits).
</quiz>

<quiz>
Same forwarding table. Destination: **`11100001 10000000 00010001 01110111`**
- [ ] A
- [ ] B
- [ ] C
- [x] D
- [ ] E

First 9 bits = `111000011` → matches D (`11100001 1*`, 9 bits). Beats C (7 bits). **D wins**.
</quiz>

---

## Longest prefix match & CIDR

<quiz>
In the P1–P9 unibit trie database, prefix **P1** (`101*`) is reached from the root by following:
- [ ] 0 → 1 → 0
- [x] 1 → 0 → 1
- [ ] 1 → 1 → 0
- [ ] 1 → 0 → 0

P1 = bit1 **1**, bit2 **0**, bit3 **1** from the root.
</quiz>

<quiz>
In a unibit trie, when lookup fails (empty pointer), the correct longest-prefix match is:
- [ ] The first prefix encountered on the path
- [x] The **last** valid prefix recorded along the path
- [ ] Always the default route
- [ ] The shortest matching prefix

Walk the trie, record prefixes at each node, return the **last** one when the path ends.
</quiz>

<quiz>
**P4** (`1*`) and **P2** (`111*`) coexist in a unibit trie because:
- [x] The shorter prefix is stored on the path toward the longer (more specific) prefix
- [ ] Only one of them can exist in any trie
- [ ] P4 replaces P2 at the leaf
- [ ] P2 is stored at the root only

Substring prefixes live on the path to more-specific entries — P4 is encountered before P2 when tracing `111…`.
</quiz>

<quiz>
Node **P9** in the course unibit trie is an example of:
- [ ] A multibit stride of 9
- [x] **One-way branch compression** for prefix P3 (`11001*`)
- [ ] The default route
- [ ] A BGP update timer

P9 compresses the single-child nodes after `110` on the path to P3.
</quiz>

<quiz>
If a forwarding table contains `101*`, `111*`, and `11001*`, the destination `11001001…` matches:
- [x] `11001*` (longest / most specific)
- [ ] `111*` only
- [ ] `101*` only
- [ ] No prefix — use default

First 5 bits are `11001` → P3 wins over shorter matches.
</quiz>

<quiz>
If a forwarding table contains `10.0.0.0/8` and `10.1.0.0/16`, the destination `10.1.2.3` should match:
- [x] `10.1.0.0/16` (longest / most specific match)
- [ ] `10.0.0.0/8` only
- [ ] Neither — exact host match required
- [ ] Both equally — router picks randomly

**Longest-prefix match (LPM):** most specific matching prefix wins.
</quiz>

<quiz>
**CIDR** was introduced primarily to:
- [x] Allow variable-length prefixes and reduce address waste and routing table growth
- [ ] Replace TCP with UDP
- [ ] Eliminate the need for routers
- [ ] Mandate that all prefixes be exactly /24

CIDR replaced classful A/B/C with flexible prefix lengths and enables **aggregation**.
</quiz>

<quiz>
The netmask for a `/24` prefix in dotted decimal is [[255.255.255.0]].
---
24 leading 1-bits: `11111111.11111111.11111111.00000000`.
</quiz>

---

## Tries & prefix expansion

<quiz>
In the nodes a–h practice trie, lookup for prefix `00*` returns node:
- [x] **a** (last stored prefix is `0*` at a; no prefix stored at path `00`)
- [ ] c
- [ ] e
- [ ] A white internal node

Walk 0 → a, then 0 → white (no prefix). Longest match so far = **a**.
</quiz>

<quiz>
In the nodes a–h practice trie, lookup for `00011*` returns node:
- [ ] e
- [ ] g
- [x] **h**
- [ ] a

Trace: 0→a, 0→white, 0→e, 1→white, 1→**h** at path `00011`.
</quiz>

<quiz>
In a **unibit trie** for IPv4 forwarding, worst-case lookup requires up to:
- [x] 32 steps (one per address bit)
- [ ] 8 steps always
- [ ] 1 step — trie is a hash table
- [ ] 256 steps per octet only

Unibit = one bit per level → O(W) where W = address width.
</quiz>

<quiz>
**Multibit tries** are used because:
- [x] They reduce trie depth and memory accesses compared to unibit tries at high line rates
- [ ] They eliminate the need for any memory
- [ ] They replace longest-prefix match with exact match only
- [ ] They are required by BGP only, not forwarding

Tradeoff: fewer accesses but **wider, sparser** nodes → more memory.
</quiz>

<quiz>
With **stride 3**, prefix **P3 = 1*** expands to four length-3 prefixes. After collision checking against P1=`101*`, P3 is associated with:
- [x] `100*`, `110*`, and `111*` only
- [ ] `100*`, `101*`, `110*`, and `111*`
- [ ] `001*` and `011*` only
- [ ] `10*` and `110*`

P3 expands to `100*`, `101*`, `110*`, `111*` — but `101*` collides with P1 and is **dropped**.
</quiz>

<quiz>
**Prefix expansion** in a multibit trie is needed because:
- [x] Shorter prefixes must be aligned to the fixed stride length at each trie level
- [ ] BGP cannot advertise prefixes shorter than /24
- [ ] It removes the need for longest-prefix match
- [ ] It converts IPv4 to IPv6 automatically

Example: stride 2 expands `11*` into `1100*`, `1101*`, `1110*`, `1111*`.
</quiz>

<quiz>
When an expanded prefix **collides** with an existing more-specific prefix in the table, the correct action is to:
- [x] Drop the expanded copy — the more-specific entry wins
- [ ] Delete the more-specific entry
- [ ] Merge them into a default route only
- [ ] Restart the routing protocol

See the 3-bit stride expansion table in the full lesson (P4, P6 examples).
</quiz>

<quiz>
A multibit trie is __________ than a unibit trie for the same database and requires __________ memory accesses per lookup.
- [x] Faster (shallower); fewer
- [ ] Slower; more
- [ ] Faster; more
- [ ] The same speed; the same number of

Stride k reduces trie depth → fewer memory accesses per lookup.
</quiz>

<quiz>
**Fixed-length** multibit tries (after prefix expansion) can support an arbitrary number of prefix lengths.
- [ ] True
- [x] False

Expansion leaves only lengths that are **multiples of the stride** (e.g., stride 3 → lengths 3, 6, 9, …).
</quiz>

<quiz>
In the Quiz 5-5 variable-stride trie, prefix **a** (`0*`) appears at which nodes?
- [x] **n2 and n3** (both children under bit 0 at the root)
- [ ] n2 only
- [ ] n1 only
- [ ] n2 and n4

`0*` matches both `00…` and `01…` — label **both** subtrees.
</quiz>

<quiz>
In the Quiz 5-5 variable-stride trie, prefix **b** (`01000*`) is stored at node:
- [ ] n9
- [ ] n6
- [x] **n16**
- [ ] n2

Path: n1(`01`) → n3(`00`) → n6(`0`) → **n16**.
</quiz>

<quiz>
Compared to **fixed-stride** multibit tries, **variable-stride** tries offer:
- [x] Better memory/lookup tradeoffs per subtree at the cost of more complex implementation
- [ ] No memory accesses during lookup
- [ ] Identical structure at every level with no optimization
- [ ] Elimination of prefix expansion

Variable stride tunes stride per level based on prefix density.
</quiz>

<quiz>
~250,000 concurrent flows in a backbone router implies that **caching** forwarding entries:
- [ ] Is highly effective because flows repeat
- [x] Works poorly — too many short-lived flows to cache efficiently
- [ ] Eliminates the need for tries
- [ ] Only helps the control plane

Many concurrent flows defeat flow-level caching in backbone routers.
</quiz>

<quiz>
Prefix lookup speed at line rate is primarily limited by:
- [ ] BGP update frequency only
- [x] The number of memory accesses per lookup
- [ ] Output port scheduling only
- [ ] Spanning Tree convergence time

Lookup cost is dominated by memory accesses — often only 1–2 allowed per packet at wire speed.
</quiz>

<quiz>
A sample solution for the **prefix lookup** bottleneck is:
- [ ] Shared bus switching
- [x] Compressed multibit tries
- [ ] Spanning Tree protocol
- [ ] SNMP polling

Multibit tries reduce trie depth and memory accesses; VOQ/crossbar address switching bottlenecks.
</quiz>

---

## Bottlenecks & traffic characteristics

<quiz>
Which is NOT typically cited as a fundamental router design challenge?
- [ ] Line speeds growing faster than lookup/switch capability
- [ ] Growth of the global routing table (900k+ prefixes)
- [x] DNS TTL values being too long for web caching
- [ ] Output port contention and internal queuing

Router stress comes from speed, table size, and contention — not DNS TTL.
</quiz>

<quiz>
A key consequence of **bursty** Internet traffic is that:
- [x] Routers need buffers and must handle peak arrival rates, not just averages
- [ ] Every packet is exactly the same size
- [ ] Lookup tables shrink over time
- [ ] Crossbar fabrics become unnecessary

Bursts → queues fill → delay and possible loss if buffers overflow.
</quiz>

<quiz>
Because many Internet packets are **small**, router design must worry about:
- [x] Lookups per second (packet rate), not only raw bits per second
- [ ] Only optical fiber compatibility
- [ ] Eliminating the control plane entirely
- [ ] IPv6-only forwarding with no IPv4

Small packets (e.g., TCP ACKs) → high **packet rate** stresses lookup engines.
</quiz>

<quiz>
For fast line-rate lookups, **DRAM** is often considered too [[slow]] compared to SRAM or TCAM.
---
DRAM: high capacity but slow; SRAM: fast but expensive/limited; TCAM: fast parallel match but power-hungry.
</quiz>

---

## P1–P9 trie lookups

<quiz>
Using the P1–P9 unibit trie, what is the longest prefix match for `111*`?
- [x] P2
- [ ] P4
- [ ] P5

Trace: 1 → P4; 1 → node; 1 → **P2** (`111*`). P2 is the last prefix on the path.
</quiz>

<quiz>
Using the P1–P9 unibit trie, what is the longest prefix match for `11011*`?
- [ ] P2
- [ ] P4
- [ ] P5
- [x] P9

Trace: 1 → P4; 1 → node; 0 → P9 branch (`110`). Bit 4 = `1`, bit 5 = `1` — P3 (`11001*`) needs bit 4 = `0`, so P3 is not reached. Last match = **P9** (`110`, 3 bits).
</quiz>

<quiz>
Using the P1–P9 unibit trie, what is the longest prefix match for `10*`?
- [ ] P1
- [x] P4
- [ ] P8
- [ ] None

Trace: 1 → **P4** (`1*`); 0 → internal node (no stored prefix). P8 (`100*`) needs a third bit. Last match = **P4**.
</quiz>

<quiz>
**By stride**, we refer to the number of bits checked at every step when traversing a trie.
- [x] True
- [ ] False

Stride k → each node has up to $2^k$ children; fewer levels than unibit.
</quiz>

---

<!-- mkdocs-quiz results -->

---

!!! tip "Keep studying"
    - [Plain-language guide](plain-language.md)
    - [Full Lesson 5 guide](router-design-1.md)
    - [Quick Study Guide](quick-study-guide.md)
    - [Lesson 6 — Part 2 (scheduling, QoS)](../lesson-06/router-design-2.md)
