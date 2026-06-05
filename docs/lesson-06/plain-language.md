---
tags:
  - lesson-06
  - router-design
  - packet-classification
  - scheduling
  - qos
  - plain-language
search:
  boost: 2
---

# Lesson 6: Router Design (Part 2) — Plain-Language Guide

This is the simplest version of [Lesson 6](router-design-2.md). If you want exam detail, use the **[Quick Study Guide](quick-study-guide.md)** and then test yourself with the **[Quiz](quiz.md)**.

!!! tip "Exam prep"
    Study in this order: **[Full guide](router-design-2.md)** -> **[Quick Study Guide](quick-study-guide.md)** -> **[Quiz](quiz.md)**. Need Part 1 review first? Go back to [Lesson 5](../lesson-05/router-design-1.md).

---

## Summary

Part 2 explains how routers do more than destination lookup. They also do **packet classification** (matching on multiple header fields), smart **scheduling** (choosing which packet goes next), and **traffic control** (token bucket and leaky bucket).

The big idea is a tradeoff triangle: **speed, memory, and fairness**. Faster lookup often uses more memory. Fairer scheduling often needs better queue design.

---

## The one-sentence version

A modern router is like a busy airport: it checks each packet's "ticket type," picks takeoff order to avoid runway jams, and enforces speed limits so one flow cannot dominate everyone else.

---

## Why packet classification exists

In Lesson 5, forwarding mostly means destination-based lookup. In real networks, that is not enough.

Routers also need to classify traffic by more fields:

- source and destination IP address
- source and destination port
- protocol or flags

That is called **packet classification**: matching a packet against policy rules, not just destination routes.

| Need | Example |
|------|---------|
| **Security** | Firewall drops packets from blocked sources |
| **Quality of Service (QoS)** | Voice traffic gets lower delay |
| **Traffic engineering** | Video flows take a preferred path |

---

## Three ways to classify quickly

### Set-pruning tries

Very fast lookup, but expensive memory use. Rules get copied into many places.

### Backtracking tries

Store each rule once, so memory is lower. But lookup is slower because the search may walk back up ancestors.

### Grid of tries

A middle ground. It adds precomputed "jump pointers" to skip wasted backtracking steps.

**Memory trick:** Set-pruning = **fast but fat**. Backtracking = **lean but slow**. Grid = **balanced**.

---

## Why simple queues fail: HOL blocking

**Head-of-line (HOL) blocking** means the first packet in line blocks packets behind it, even when those later packets could go to idle outputs.

That happens with one FIFO queue per input in a crossbar switch.

To fix it, routers use **Virtual Output Queues (VOQs)**: one queue per output at each input.

| Queue design | Result |
|-------------|--------|
| One FIFO per input | HOL blocking hurts throughput |
| **VOQ per output** | Avoids HOL, enables better parallel sends |

---

## Two scheduling ideas to remember

### Take-a-ticket

Fair in a simple sense, but can still cause waiting chains and poor parallelism.

### Parallel Iterative Matching (PIM)

Runs rounds of **request -> grant -> accept** so many non-conflicting input/output pairs can send in parallel.

**Key takeaway:** PIM with VOQs is the practical "avoid HOL and keep crossbar busy" strategy.

---

## FIFO vs fair scheduling

### FIFO with tail drop

Easy and fast, but all packets are treated alike. Important traffic can be dropped when buffers fill.

### Deficit Round Robin (DRR)

Each flow gets a **quantum** (credit) and a **deficit counter**. If a flow cannot send a big packet now, leftover credit carries to next round.

That gives near-fair bandwidth with low computational cost.

---

## Policing vs shaping (token bucket and leaky bucket)

**Policing** enforces limits by dropping or marking excess traffic.  
**Shaping** enforces limits by delaying excess traffic in a queue.

### Token bucket

Tokens arrive at rate **R** and bucket size is **B**. A flow can burst while tokens exist, but long-term average follows R.

### Leaky bucket

Output is drained at a near-constant rate, smoothing bursts.

| Mechanism | What happens to excess traffic? |
|----------|----------------------------------|
| **Policing** | Drop or mark it |
| **Shaping** | Buffer and send later |

!!! warning "Exam point"
    **Token bucket allows bursts (up to B).** **Leaky bucket smooths to a steady rate.** Students often mix these up.

---

## High-yield plain-language Q&A

### Why does packet classification need multiple fields?

Because destination-only lookup cannot express firewall rules, QoS priorities, or fine-grained policy.

### Why is HOL blocking bad?

One blocked packet at queue front can waste output capacity, lowering total switch throughput.

### Why is DRR popular?

It gives practical fairness with O(1)-style round-robin behavior, which is hardware-friendly.

### What is the policing vs shaping difference in one line?

Policing drops excess; shaping delays excess.

---

## The whole lesson on one napkin

```
Classify packets by many fields -> apply policy
Set-pruning: fast, big memory
Backtracking: less memory, slower
Grid: shortcuts, balanced tradeoff

HOL blocking: one FIFO queue can stall useful packets
VOQ + PIM (request/grant/accept): better parallel scheduling

FIFO tail drop: simple, unfair under congestion
DRR: fair-share with quantum + deficit counters

Token bucket: average rate R, burst up to B
Leaky bucket: smoother constant output rate
Policing = drop/mark | Shaping = buffer/delay
```

---

## Where to go next

| You want... | Go here |
|-------------|---------|
| Full details and examples | [Lesson 6 full guide](router-design-2.md) |
| Fast exam review | [Quick Study Guide](quick-study-guide.md) |
| Practice questions | [Lesson 6 Quiz](quiz.md) |
| Router architecture basics | [Lesson 5](../lesson-05/router-design-1.md) |
| SDN control/data-plane shift | [Lesson 7](../lesson-07/sdn-1.md) |
