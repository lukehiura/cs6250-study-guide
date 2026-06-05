---
tags:
  - lesson-10
  - censorship-surveillance
  - plain-language
search:
  boost: 2
---

# Lesson 10: Internet Surveillance and Censorship — Plain-Language Guide

The simplest accurate version of [Lesson 10](surveillance-censorship.md). For fast exam review, use the [Quick Study Guide](quick-study-guide.md). To test yourself, use the [Quiz](quiz.md). This lesson connects to media delivery in [Lesson 11](../lesson-11/video.md), where censorship pressure often moves to streaming platforms.

!!! tip "Exam prep"
    Focus on three anchors: **where filtering happens**, **how DNS injection races legitimate replies**, and **why measurement is hard without local vantage points**.

---

## Summary

**Internet censorship** blocks or distorts access to online content. A censor can act at several chokepoints, including DNS, IP routing, packet filtering, and TCP reset injection. The **Great Firewall (GFW)** combines multiple methods at national scale, which makes both blocking and accidental overblocking likely.

Researchers study censorship with remote and distributed methods such as **Augur** (connectivity disruption from outside) and **Iris** (global DNS manipulation detection).

---

## The one-sentence version

Censorship systems win by controlling key network chokepoints (especially DNS and routing), while measurement systems try to infer those controls despite limited visibility.

---

## Where censors can intervene

| Chokepoint | What the censor does | Typical effect |
|---|---|---|
| **DNS** | Returns fake or wrong answers | User goes to wrong IP or block page |
| **IP/packet filtering** | Drops traffic by IP, port, or policy | Connection silently fails |
| **DPI** (Deep Packet Inspection) | Looks inside packet payload for keywords | Targeted blocking/reset |
| **TCP reset injection** | Sends forged RST packets | Connection is force-closed |
| **Routing manipulation** | Withdraws or filters BGP routes | Prefix becomes unreachable |

**Memory trick:** **Name, path, content, connection, route** (DNS, filtering, DPI, reset, BGP).

---

## DNS injection in plain terms

DNS is often easiest to attack because it is the first step before fetching content.

1. User asks DNS for a blocked domain.
2. Censor sees the query.
3. Censor sends a forged answer quickly.
4. Client accepts the first answer and caches it.
5. Legitimate answer arrives too late.

This is a **race condition**: the forged response only needs to arrive first.

---

## Why overblocking happens

Blocking is often done at coarse granularity:

- Domain-level blocking can remove both banned and harmless pages.
- IP-level blocking can affect many unrelated domains on shared hosting.
- Wildcard or broad keyword rules can catch innocent traffic.

!!! warning "Exam point"
    **Overblocking** is not a side detail; it is a central tradeoff in censorship systems.

---

## Why censorship measurement is hard

| Challenge | Why it matters |
|---|---|
| Limited in-country vantage points | Hard to run measurements safely and continuously |
| Rapid policy changes | Yesterday's block list may be wrong today |
| Many techniques in parallel | DNS-only tools miss routing or packet filtering |
| Ground-truth ambiguity | Outage vs censorship can look similar |

---

## Two key measurement systems

### Augur (connectivity disruption)

- Uses remote side channels (IP ID behavior) to infer reachability.
- Detects whether traffic between internal hosts and external servers is blocked.
- Useful when researchers cannot deploy local probes in censored networks.

### Iris (DNS manipulation)

- Queries many open resolvers worldwide.
- Compares response consistency, TLS cert validity, and fetched content.
- Uses multiple signals (and ML) to classify manipulated answers.

---

## The whole lesson on one napkin

```
Censorship toolbox:
DNS poisoning/injection | packet filtering | DPI | TCP resets | routing disruption

GFW style = multiple methods at scale + rapid policy changes

Core tradeoff:
More aggressive filtering -> more collateral damage (overblocking)

Measurement challenge:
Need evidence without reliable local visibility

Augur -> connectivity disruption via remote side channels
Iris  -> DNS manipulation via global resolver comparison
```

---

## Where to go next

| You want... | Go here |
|---|---|
| Full details and full study Q&A | [Lesson 10 full guide](surveillance-censorship.md) |
| Condensed exam tables + short answers | [Quick Study Guide](quick-study-guide.md) |
| Interactive practice | [Lesson 10 Quiz](quiz.md) |
| Next lesson: streaming and adaptation | [Lesson 11 full guide](../lesson-11/video.md) |

