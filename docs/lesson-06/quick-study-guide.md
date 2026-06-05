---
tags:
  - lesson-06
  - router-design
  - packet-classification
  - scheduling
  - qos
  - quick-study
search:
  boost: 2
---

# Lesson 6: Quick Study Guide — Router Design (Part 2)

Condensed exam review for Part 2. Start with the **[Plain-language guide](plain-language.md)** if needed, then use the [full guide](router-design-2.md), and finish with the [quiz](quiz.md).

---

## 1. Big picture

- Part 2 extends router design from destination lookup to **classification, scheduling, and rate control**.
- Core tradeoffs: **lookup speed vs memory**, and **throughput vs fairness**.
- Classification structures: set-pruning tries, backtracking, and grid of tries.
- Scheduling structures: VOQ + PIM to avoid HOL blocking.
- Rate controls: token bucket and leaky bucket, with shaping vs policing.

!!! tip "Memory aid"
    **Classify -> Queue smartly -> Schedule fairly -> Rate-limit safely.**

---

## 2. Packet classification approaches

| Approach | Core idea | Speed | Memory |
|----------|-----------|-------|--------|
| **Set-pruning tries** | Duplicate compatible rules per destination trie node | Fast | High |
| **Backtracking** | Store each rule once; revisit ancestors during lookup | Slow | Low |
| **Grid of tries** | Add switch pointers to skip repeated backtracking | Fast(er) | Moderate |

**Jargon:** A **trie** is a prefix tree used for fast matching of bit strings.

---

## 3. Scheduling and HOL blocking

| Topic | Key point |
|------|-----------|
| **HOL blocking** | Head packet blocks packets behind it, even if those could go to idle outputs |
| **VOQ** | One queue per output at each input; removes single-FIFO HOL issue |
| **Take-a-ticket** | Ordered and fair-ish, but can waste parallel opportunities |
| **PIM** | Request -> Grant -> Accept across inputs/outputs each round |

!!! warning "Exam point"
    HOL blocking is primarily fixed by **VOQ**, not by simply making FIFO faster.

---

## 4. FIFO, fair queuing, and DRR

| Scheduler | Strength | Weakness |
|-----------|----------|----------|
| **FIFO + tail drop** | Very simple and fast | No service differentiation |
| **Packet-level fair queuing** | Strong fairness conceptually | Higher computation overhead |
| **Deficit Round Robin (DRR)** | Good fairness with low complexity | Needs careful quantum tuning |

**DRR terms:**

- **Quantum (Qᵢ):** credit assigned per round to flow i
- **Deficit counter (Dᵢ):** leftover credit carried into next round

---

## 5. Traffic shaping and policing

| Mechanism | Behavior on excess traffic | Typical effect |
|-----------|----------------------------|----------------|
| **Policing** | Drop or mark | Strict enforcement, possible loss |
| **Shaping** | Buffer and delay | Smoother output, added delay |

### Token bucket vs leaky bucket

| Algorithm | What it controls |
|----------|-------------------|
| **Token bucket (R, B)** | Average rate R with burst tolerance B |
| **Leaky bucket** | Near-constant drain rate (traffic smoothing) |

---

## 6. Cross-lesson connections

- Lesson 5 explains router architecture and longest-prefix match basics.
- Lesson 6 adds policy-aware forwarding and fairness mechanisms.
- Lesson 7 moves control logic outward into **SDN** controllers.

---

## 7. High-yield exam Q&A

### Why is packet classification needed beyond longest-prefix match?

Because policy decisions (security, QoS, traffic engineering) depend on multiple header fields, not only destination prefix.

### Main tradeoff between set-pruning and backtracking?

Set-pruning spends memory to gain speed; backtracking saves memory and pays in lookup time.

### What exactly causes HOL blocking?

A busy destination for the head packet in a single input FIFO, which blocks later packets even if their destinations are free.

### Why are VOQs important?

They isolate waiting by destination, enabling unrelated packets to progress.

### What are PIM's three phases?

Request, Grant, Accept.

### Why is FIFO with tail drop insufficient for QoS?

It cannot prioritize critical flows and drops packets blindly when full.

### What does DRR approximate well?

Fair sharing across variable packet sizes with efficient implementation.

### Token bucket in one sentence?

It limits average rate while allowing bounded bursts up to bucket size B.

### Leaky bucket in one sentence?

It smooths bursty traffic into a steadier output rate.

### Policing vs shaping one-liner?

Policing discards or marks excess; shaping buffers excess.

---

## 8. Quick memory sheet

| Topic | Memory aid |
|------|-------------|
| Classification | Destination-only is too weak for policy |
| Set-pruning | Fast but memory-hungry |
| Backtracking | Memory-light but slower |
| Grid of tries | Shortcut pointers reduce backtracking cost |
| HOL blocking | One blocked head can waste many opportunities |
| VOQ | One queue per output per input |
| PIM | Request -> Grant -> Accept |
| DRR | Quantum + deficit carry-over |
| Token bucket | Avg rate R, burst B |
| Leaky bucket | Smooth constant-ish drain |
