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
**Policing** differs from **shaping** because policing usually:
- [x] Drops or marks excess traffic instead of delaying it
- [ ] Adds delay to smooth all traffic
- [ ] Creates VOQs
- [ ] Runs BGP path selection

Shaping buffers excess packets; policing enforces by discard/mark.
</quiz>

---

<!-- mkdocs-quiz results -->

---

!!! tip "Keep studying"
    - [Plain-language guide](plain-language.md)
    - [Quick Study Guide](quick-study-guide.md)
    - [Lesson 6 full guide](router-design-2.md)
    - [Lesson 7 (SDN Part 1)](../lesson-07/sdn-1.md)
