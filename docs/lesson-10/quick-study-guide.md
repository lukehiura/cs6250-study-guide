---
tags:
  - lesson-10
  - censorship-surveillance
  - quick-study
search:
  boost: 2
---

# Lesson 10: Quick Study Guide — Internet Surveillance and Censorship

Condensed review for exams. Need a gentler first pass? Start with the [Plain-language guide](plain-language.md). Full detail is in the [Lesson 10 guide](surveillance-censorship.md). Practice with the [Quiz](quiz.md).

---

## 1. Big picture

- Censorship targets Internet chokepoints: DNS, routing, packet forwarding, or transport sessions.
- DNS manipulation is common because it happens before content delivery.
- National systems (for example, the **Great Firewall of China**) combine multiple techniques.
- Measurement is difficult because local vantage points are scarce and censorship changes quickly.

!!! tip "Memory aid"
    **Detect -> disrupt -> deny** at different layers (DNS, IP, transport, routing).

---

## 2. Core techniques

| Technique | Mechanism | Strength | Limitation |
|---|---|---|---|
| Packet dropping | Drop packets by IP/port/policy | Simple and cheap | Coarse; overblocking |
| DNS poisoning/injection | Return forged DNS answers | Easy to deploy at resolver path | Circumventable; collateral damage |
| DPI | Inspect payload for keywords/signatures | Fine-grained filtering | Expensive; weakened by encryption |
| TCP reset injection | Send forged RST to endpoints | Fast session termination | Race dependent; can be bypassed |
| Routing disruption | Withdraw/filter BGP prefixes | Broad impact | Very blunt instrument |

---

## 3. DNS injection workflow

1. Monitor DNS queries in transit.
2. Match query against blocked domain set.
3. Inject forged answer before legitimate response.
4. Client accepts first response and caches it.

!!! warning "Exam point"
    DNS injection is a **timing race**. The fake response does not need to be "more correct," only faster.

---

## 4. GFW properties to remember

| Property | Why exam-relevant |
|---|---|
| National scale | Operates across a very large user base |
| Multi-technique | DNS, IP blocking, DPI, resets, routing controls |
| Dynamic policy | Blocklists and behaviors change over time |
| Distributed enforcement | Multiple ISP/backbone enforcement points |
| Overblocking risk | Collateral damage is common |

---

## 5. Overblocking patterns

- Domain-level blocks remove good and bad content together.
- Shared IP hosting causes unrelated services to fail.
- Keyword and wildcard rules can trigger false positives.

**High-yield phrase:** coarse controls create collateral damage.

---

## 6. Measurement systems

| System | Focus | Key idea |
|---|---|---|
| **Augur** | Connectivity disruption | Infer reachability using remote IP ID side channels |
| **Iris** | DNS manipulation | Compare global resolver answers with content/cert/infra metrics |

---

## 7. Iris metrics (post-annotation)

1. **Consistency:** compare with trusted and peer resolvers.
2. **HTTP content:** detect block pages or mismatched content.
3. **TLS cert validity:** incorrect IPs often fail certificate checks.
4. **Infrastructure clues:** known censorship IPs/ASNs.

Classification confidence increases when several independent metrics disagree with expected behavior.

---

## 8. High-yield exam Q&A

### What are the three DNS injection steps?
Monitoring, blocked-domain detection, then forged-response injection.

### Why is DNS censorship popular?
DNS is an upstream chokepoint and relatively cheap to manipulate.

### Which techniques tend to overblock?
DNS poisoning and IP-level packet filtering are especially prone to collateral damage.

### What does DPI add beyond IP blocking?
Content-aware filtering, but with higher compute and privacy cost.

### Why are resets effective?
Forged RST packets can immediately terminate active TCP sessions.

### Why is global censorship measurement difficult?
Limited safe vantage points, rapidly changing policies, and ambiguity between censorship and outages.

### What does Augur detect?
IP/routing reachability disruption without requiring probes inside censored networks.

### What does Iris detect?
Manipulated DNS answers via global resolver comparisons and multi-signal classification.

### How can routing disruption censor content?
By withdrawing/filtering BGP routes to prefixes, making destinations unreachable.

### Why can encrypted traffic reduce DPI effectiveness?
Payload visibility is reduced, so keyword/content matching becomes harder.

---

## 9. Quick memory sheet

| Topic | Memory aid |
|---|---|
| Censorship layers | **DNS -> IP -> content -> TCP -> BGP** |
| DNS injection | **Win the race, poison the cache** |
| Overblocking | **Coarse filters, broad damage** |
| Augur | **Remote inference of reachability** |
| Iris | **Resolver diversity + multi-metric checks** |

