---
quiz:
  auto_number: true
  shuffle_answers: true
  disable_after_submit: false
---

# Lesson 5: Interactive Quiz

Router architecture, control vs data plane, switching fabrics, and longest-prefix match. New to the material? Start with the [Plain-language guide](plain-language.md). See the [Quick Study Guide](quick-study-guide.md).

!!! info "Before you begin"
    <!-- mkdocs-quiz intro -->

---

## Control plane vs data plane

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

## Longest prefix match & CIDR

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
Compared to **fixed-stride** multibit tries, **variable-stride** tries offer:
- [x] Better memory/lookup tradeoffs per subtree at the cost of more complex implementation
- [ ] No memory accesses during lookup
- [ ] Identical structure at every level with no optimization
- [ ] Elimination of prefix expansion

Variable stride tunes stride per level based on prefix density.
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

<!-- mkdocs-quiz results -->

---

!!! tip "Keep studying"
    - [Plain-language guide](plain-language.md)
    - [Full Lesson 5 guide](router-design-1.md)
    - [Quick Study Guide](quick-study-guide.md)
    - [Lesson 6 — Part 2 (scheduling, QoS)](../lesson-06/router-design-2.md)
