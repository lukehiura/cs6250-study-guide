---
tags:
  - lesson-06
  - router-design
  - packet-classification
  - scheduling
  - qos
  - quiz
search:
  boost: 1.5
quiz:
  auto_number: true
  shuffle_answers: true
  disable_after_submit: false
---

# Lesson 6: Interactive Quiz

Packet classification, scheduling, HOL blocking, and traffic shaping/policing. New to this lesson? Start with the [Plain-language guide](plain-language.md), then use the [Quick Study Guide](quick-study-guide.md) and [full guide](router-design-2.md).

!!! info "Before you begin"
    <!-- mkdocs-quiz intro -->

---

## Classification algorithms

<quiz>
Packet classification differs from basic destination forwarding because it:
- [x] Matches on multiple header fields such as source, destination, and ports
- [ ] Uses only the destination prefix and nothing else
- [ ] Avoids all rule tables
- [ ] Requires no memory lookups

Classification is multi-field matching for policy, not just destination-based forwarding.
</quiz>

<quiz>
Which of the following is **not** an example of packet classification?
- [ ] A firewall filtering traffic by source IP
- [ ] DiffServ reserving bandwidth between source and destination
- [ ] Routing video traffic from S1 to D via a specific link
- [x] Forwarding a packet using only destination IP longest-prefix match

LPM on destination IP alone is basic forwarding — not packet classification.
</quiz>

<quiz>
In the Router R example, the rule that **drops all traffic from S2** regardless of destination is an example of:
- [x] A security/firewall policy enforced through packet classification
- [ ] Longest-prefix match forwarding
- [ ] Token bucket rate limiting
- [ ] VOQ scheduling

Packet classification enables policies beyond simple forwarding, including security rules.
</quiz>

<quiz>
**Linear search** of a 10,000-rule firewall database at 1 memory access per rule costs:
- [ ] 100 nsec
- [ ] 10 μsec
- [x] 1 msec (1,000,000 nsec)
- [ ] 1 nsec

1 access/rule × 10,000 rules × ~100 ns/access = ~1 ms worst case.
</quiz>

<quiz>
With a **90% cache hit rate** for packet classification, a cache lookup costing 100 nsec and a linear search costing 1 msec, the **average search time** is:
- [ ] 100 nsec
- [ ] 1 msec
- [x] ~0.1 msec
- [ ] 10 nsec

0.9 × 100 ns + 0.1 × 1,000,000 ns = 90 ns + 100,000 ns ≈ 0.1 msec — still slow.
</quiz>

<quiz>
**MPLS** and **DiffServ** use which simple packet classification approach at intermediate routers?
- [ ] Linear search per packet
- [ ] Set-pruning tries
- [x] Passing labels — classify once at the edge, intermediate nodes apply the label
- [ ] Backtracking

MPLS labels are set at ingress; core routers forward on the label without re-classifying.
</quiz>

<quiz>
In set-pruning tries, why must the source trie for destination `00*` include rules beyond just R₄ and R₅?
- [ ] Because R₄ and R₅ don't exist in the database
- [x] Because `0*` also matches `00*`, so rules R₁, R₂, R₃, R₇ with destination `0*` are also compatible
- [ ] Because backtracking requires storing all rules everywhere
- [ ] Because grid of tries mandates it

Any destination prefix that is an ancestor of `00*` is also compatible — their source rules must be included.
</quiz>

<quiz>
In two-dimensional classification tries, **set-pruning** generally offers:
- [x] Faster lookup with higher memory usage
- [ ] Slower lookup with lower memory usage
- [ ] No lookup tradeoffs at all
- [ ] Guaranteed zero rule duplication

Set-pruning replicates compatible rules to reduce search time.
</quiz>

<quiz>
The approach that stores each rule once and may search ancestor tries during lookup is [[backtracking]].
---
Backtracking reduces memory duplication but can increase lookup time.
</quiz>

<quiz>
**Grid of tries** improves on backtracking by:
- [ ] Storing every rule at every destination node
- [ ] Eliminating source tries entirely
- [x] Precomputing **switch pointers** that skip directly to the next candidate source trie on failure
- [ ] Using MPLS labels instead of tries

Switch pointers avoid re-traversing the destination trie during source lookup failures.
</quiz>

<quiz>
In the grid-of-tries example (destination `001`, source `001`), after the source trie at `D = 00` fails, the algorithm:
- [ ] Restarts from the root
- [ ] Drops the packet
- [x] Follows a precomputed switch pointer to the next candidate source trie
- [ ] Performs a linear search

Switch pointers are precomputed so the search jumps directly without backtracking up the destination trie.
</quiz>

<quiz>
In two-dimensional classification tries, **set-pruning** generally offers:
- [x] Faster lookup with higher memory usage
- [ ] Slower lookup with lower memory usage
- [ ] No lookup tradeoffs at all
- [ ] Guaranteed zero rule duplication

Set-pruning replicates compatible rules to reduce search time.
</quiz>

<quiz>
The approach that stores each rule once and may search ancestor tries during lookup is [[backtracking]].
---
Backtracking reduces memory duplication but can increase lookup time.
</quiz>

---

## Queuing and crossbar scheduling

<quiz>
The **take-a-ticket** algorithm causes head-of-line blocking because:
- [x] All inputs queue for the same output in order — C is blocked behind A and B even when other outputs are free
- [ ] Outputs never grant tickets
- [ ] It uses virtual output queues
- [ ] Crossbar crosspoints can only be on or off

Take-a-ticket serializes access per output; inputs waiting for a busy output block all traffic behind them.
</quiz>

<quiz>
In the take-a-ticket example (A, B, C → outputs 1, 2, 3, 4), input **C** first connects to output 1 in:
- [ ] Round 1
- [ ] Round 2
- [x] Round 3
- [ ] Round 4

C is blocked by A (T1) and B (T2) — it waits two full rounds before its ticket T3 is served.
</quiz>

<quiz>
**Head-of-line (HOL) blocking** means:
- [x] The front packet blocks packets behind it even if those target idle outputs
- [ ] Every queue is always empty
- [ ] Only output queues can overflow
- [ ] Packets are reordered by default

HOL blocking wastes available switching opportunities.
</quiz>

<quiz>
A primary method to avoid HOL blocking at switch inputs is:
- [ ] Bigger single FIFO queues
- [x] Virtual Output Queues (VOQs)
- [ ] Random packet drops only
- [ ] Turning off crossbar arbitration

VOQs separate queued packets by intended output.
</quiz>

<quiz>
Parallel Iterative Matching (PIM) uses the phase order:
- [x] Request -> Grant -> Accept
- [ ] Accept -> Request -> Grant
- [ ] Grant -> Accept -> Request
- [ ] Queue -> Drop -> Retry

PIM coordinates many input/output matches in parallel rounds.
</quiz>

---

## Scheduling and fairness

<quiz>
**FIFO with tail drop** is the simplest scheduling method. When the output buffer is full:
- [ ] Important packets are forwarded first
- [ ] The oldest packet is dropped
- [x] Incoming packets at the **tail** are dropped regardless of importance
- [ ] All queues are flushed

Tail drop is fast but indiscriminate — it cannot distinguish critical from bulk traffic.
</quiz>

<quiz>
A **flow** in the context of router scheduling is:
- [ ] Any packet arriving at a router
- [x] A stream of packets traveling the same route from source to destination requiring the same service
- [ ] A BGP route advertisement
- [ ] A control plane message

Flows are identified by packet header fields (e.g., source/dest port, IP pair).
</quiz>

<quiz>
Which of the following is **not** a reason to use scheduling beyond FIFO with tail drop?
- [ ] Router support for congestion
- [ ] Providing QoS guarantees to flows
- [ ] Fair sharing of links among competing flows
- [x] Reducing the number of routing table entries

Scheduling addresses delay, fairness, and congestion — not routing table size.
</quiz>

<quiz>
FIFO with tail drop is often insufficient for QoS because it:
- [x] Treats all packets similarly and may drop critical traffic under congestion
- [ ] Eliminates all queue delay
- [ ] Guarantees per-flow bandwidth
- [ ] Never drops packets

FIFO is simple but not policy-aware.
</quiz>

<quiz>
In Deficit Round Robin (DRR), the **deficit counter**:
- [x] Carries unused credit to future rounds
- [ ] Resets to a random value each round
- [ ] Stores destination prefixes
- [ ] Tracks only dropped packets

DRR uses quantum plus carried credit to handle variable packet sizes fairly.
</quiz>

<quiz>
The per-flow DRR parameter that represents allocated service share is called [[quantum]].
---
Larger quantum generally means more service opportunity each round.
</quiz>

---

## Bit-by-bit round robin and DRR

<quiz>
In **bit-by-bit round robin**, the rate of round-number increase $dR/dt$ is:
- [ ] Proportional to the number of active flows
- [x] Inversely proportional to the number of active flows ($\mu / N$)
- [ ] Constant regardless of flow count
- [ ] Equal to the link speed

More active flows → each flow's round finishes more slowly → $dR/dt = \mu/N$.
</quiz>

<quiz>
In **packet-level fair queuing**, which packet is chosen to transmit next?
- [ ] The largest packet
- [ ] The packet that arrived most recently
- [x] The packet with the **smallest finishing round number** F(i)
- [ ] A randomly chosen packet

Smallest F = most starved during previous round — emulates bit-by-bit fairness.
</quiz>

<quiz>
The main drawback of packet-level fair queuing compared to DRR is:
- [ ] It cannot provide bandwidth guarantees
- [x] It requires a priority queue with O(log N) complexity — too expensive at gigabit speeds
- [ ] It cannot handle variable-size packets
- [ ] It has no deficit counter

Finding the minimum finishing time across N flows needs a priority queue update per packet.
</quiz>

<quiz>
In **Deficit Round Robin**, if a flow's queue is emptied during its turn, the deficit counter $D_i$ is:
- [ ] Carried over to the next round
- [x] Reset to 0
- [ ] Set to the quantum $Q_i$
- [ ] Doubled

Unused credit is only kept if packets remain; empty queues reset $D_i$ to 0.
</quiz>

<quiz>
In DRR with quantum Q = 500, after round 1 for F1 (packets: 200, 750), the deficit $D_1$ is:
- [ ] 0
- [ ] 500
- [x] 300
- [ ] 250

Send 200 (fits in 500); 750 > 300 remaining → $D_1 = 500 - 200 = 300$.
</quiz>

---

## Traffic control: token and leaky bucket

<quiz>
Which statement is correct?
- [x] Token bucket allows bounded bursts while enforcing an average rate
- [ ] Token bucket enforces a strictly constant output rate only
- [ ] Leaky bucket always permits unlimited bursts
- [ ] Policing always buffers excess traffic

Token bucket is defined by rate R and burst size B.
</quiz>

<quiz>
**Token bucket shaping** requires one queue per flow because:
- [x] A flow with a full token bucket would otherwise be delayed by flows with empty buckets
- [ ] BGP requires per-flow queues
- [ ] The leaky bucket mandates it
- [ ] DRR cannot coexist with token buckets

Different flows have different token availability — mixing them in one queue causes unfair delays.
</quiz>

<quiz>
**Token bucket policing** differs from token bucket **shaping** in that policing:
- [x] **Drops** packets when no tokens are available, allowing a single shared queue
- [ ] Buffers packets until tokens arrive
- [ ] Requires a separate queue per flow
- [ ] Only applies to UDP traffic

Policing = drop on no token; shaping = wait (buffer) for token.
</quiz>

<quiz>
The **leaky bucket** produces what kind of output regardless of input burstiness?
- [ ] Saw-toothed output matching input bursts
- [x] Constant, uniform output at the leak rate r
- [ ] Output only when the bucket is full
- [ ] Variable output based on number of active flows

Leaky bucket = constant drain rate r, smoothing any bursty input into steady output.
</quiz>

<quiz>
**Policing** differs from **shaping** because policing usually:
- [x] Drops or marks excess traffic instead of delaying it
- [ ] Adds delay to smooth all traffic
- [ ] Creates VOQs
- [ ] Runs BGP path selection

Shaping buffers excess packets; policing enforces by discard/mark.
</quiz>

---

## Canvas practice quiz (Lesson 6)

<quiz>
Using packet classification techniques we can perform packet forwarding based on multiple criteria, and not just based on destination IP address.
- [x] True
- [ ] False

Packet classification matches packets against rules involving source IP, destination IP, ports, protocol, and other fields — not just the destination address used in LPM.
</quiz>

<quiz>
The backtracking approach has a higher cost in terms of time, whereas the set-pruning approach has a higher cost in terms of memory.
- [x] True
- [ ] False

Set-pruning stores source prefixes at every ancestor destination — high memory, fast lookup. Backtracking stores each rule once — low memory, but must search up the destination trie.
</quiz>

<quiz>
The grid of tries technique offers a "middle ground" approach, merging the backtracking and the set-pruning techniques.
- [x] True
- [ ] False

Grid of tries uses precomputed **switch pointers** to skip failed source tries without fully backtracking — trading a small amount of memory for much faster search than backtracking.
</quiz>

<quiz>
The head-of-line blocking refers to the problem when an entire queue remains blocked because the head of the queue is blocked.
- [x] True
- [ ] False

In take-a-ticket scheduling, if the head packet is waiting on a busy output, every packet behind it in the same queue must wait — even if their destinations are idle.
</quiz>

<quiz>
One technique to avoid head of line blocking is with parallel iterative matching.
- [x] True
- [ ] False

PIM breaks each input's single queue into **virtual output queues (VOQs)** and matches inputs to outputs in parallel Request → Grant → Accept rounds, so the queue behind a blocked head can still make progress.
</quiz>

<quiz>
With parallel iterative matching, the input links are "matched" with output links in a fixed manner that stays the same as the rounds are progressing.
- [ ] True
- [x] False

PIM grants are chosen **randomly** each round — outputs pick a random requesting input, and inputs pick a random granted output. The matching changes every round.
</quiz>

<quiz>
With the token bucket traffic approach, we can still have bursts of traffic entering the network, but these bursts are capped.
- [x] True
- [ ] False

Token bucket allows a burst up to **B bits** (the bucket capacity) at any rate the sender chooses, while enforcing an average rate of **R** tokens per second.
</quiz>

<quiz>
With the leaky bucket approach, we only allow the traffic to enter the network at a configured rate.
- [x] True
- [ ] False

The leaky bucket outputs at a **constant rate r** regardless of input rate — it enforces a uniform, smooth flow into the network.
</quiz>

<quiz>
Traffic policers target to limit traffic bursts to a configured max, whereas traffic shapers target to smooth out the overall rate.
- [x] True
- [ ] False

Policer: drops/marks excess above the configured rate (burst limiting). Shaper: buffers excess and delays it, producing a smooth constant output rate.
</quiz>

<quiz>
With the leaky bucket we can still have discarded packets.
- [x] True
- [ ] False

If the bucket (buffer) is **full** when a packet arrives, that packet is **non-conforming** and dropped — the bucket cannot absorb unlimited bursts.
</quiz>

---

<!-- mkdocs-quiz results -->

---

!!! tip "Keep studying"
    - [Plain-language guide](plain-language.md)
    - [Quick Study Guide](quick-study-guide.md)
    - [Lesson 6 full guide](router-design-2.md)
    - [Lesson 7 (SDN Part 1)](../lesson-07/sdn-1.md)
