---
tags:
  - lesson-12
  - cdns-dns-overlays
  - quick-study
search:
  boost: 2
---

# Lesson 12: Quick Study Guide — CDNs, DNS, and Overlay Networks

Dense exam review. Need a simpler first pass? Start with the [Plain-language guide](plain-language.md). Full detail: [Lesson 12 guide](cdns-overlay.md). Practice: [Lesson 12 Quiz](quiz.md).

---

## 1. Big picture

- Centralized hosting does not scale globally for modern media workloads.
- CDNs solve this with distributed caches and request steering.
- DNS is the primary front-door control for mapping users to CDN clusters.
- Overlays can improve path performance beyond default BGP-selected routes.

!!! tip "Memory aid"
    **Place content near users; place users on good paths.**

---

## 2. Why single-origin design breaks

| Limitation | Consequence |
|---|---|
| Single failure domain | Outage risk |
| Limited compute/bandwidth | Capacity bottlenecks |
| Long geographic paths | High latency |
| Concentrated target | Easier DDoS disruption |

---

## 3. CDN placement strategies

| Strategy | Deployment pattern | Strength | Weakness |
|---|---|---|---|
| Enter deep | Many ISP-embedded sites | Very low user latency | Operational complexity |
| Bring home | Fewer large PoPs/IXPs | Simpler operations | Potentially longer last-mile path |

---

## 4. DNS role in CDN operation

1. Client resolves CDN-backed hostname.
2. CDN authoritative DNS chooses an edge cluster.
3. DNS returns selected edge IP.
4. Client connects to that edge.

Selection signals can include resolver geography, measured RTT/loss, cluster load, and cache state.

!!! warning "Exam point"
    Resolver IP is not always user IP; DNS mapping can be suboptimal.

---

## 5. Two-layer server selection

| Layer | Mechanism | Decision timescale |
|---|---|---|
| Coarse-grained | DNS cluster mapping | TTL-cached, slower to update |
| Fine-grained | In-cluster load balancing / HTTP logic | Near real time |

Challenge: DNS TTL tradeoff (freshness vs query overhead).

---

## 6. Cluster and server selection metrics

| Metric | Used for |
|---|---|
| RTT/latency | User responsiveness |
| Throughput | Sustained media delivery |
| Packet loss | Path quality |
| Server load | Capacity balancing |
| Cache availability | Avoid origin fetch delays |
| Path stability | Robustness over time |

---

## 7. Consistent hashing essentials

- Hash servers and content keys onto one ring.
- Assign each key to next server clockwise.
- Server churn remaps only a subset of keys.
- Virtual nodes reduce load imbalance.

**Exam phrase:** consistent hashing minimizes remapping and protects cache locality.

---

## 8. DNS fundamentals (review within CDN context)

| Concept | Key point |
|---|---|
| Hierarchy | Root -> TLD -> authoritative |
| Query styles | Client recursive; resolver iterative |
| Caching | TTL lowers latency/load but can become stale |
| Resource records | `(Name, Value, Type, TTL)` |
| Anycast | Same IP announced at many sites for nearest routing |

---

## 9. Overlay networking purpose

- Build application-controlled paths above IP routing.
- Route around poor/default paths.
- Improve latency, reliability, or throughput for selected flows.
- Useful when BGP policy paths are not performance-optimal.

---

## 10. High-yield exam Q&A

### Why is a single public server a weak architecture at Internet scale?
It concentrates failure, load, and attack surface while adding long-distance latency.

### Define CDN in one sentence.
A distributed edge infrastructure that serves content from near or well-performing servers.

### What is DNS doing in CDN request steering?
Selecting and returning edge cluster/server IPs for client requests.

### Why can "nearest geographic cluster" fail?
Geographic closeness may not match network path quality or resolver location.

### What are the two selection stages in CDNs?
Cluster selection first, then in-cluster server selection.

### What is the enter deep strategy?
Deploy many servers inside access ISPs to minimize user latency.

### What is consistent hashing used for in CDNs?
Stable key-to-server assignment with limited remapping during membership changes.

### Why do CDNs care about DNS TTL?
TTL controls responsiveness of remapping versus DNS control-plane cost.

### What is Anycast's role?
It lets one service IP map clients to topologically close instances.

### Why use overlays at all?
To choose better application paths than default policy-driven Internet routing.

---

## 11. Quick memory sheet

| Topic | Memory aid |
|---|---|
| CDN motivation | **Single origin cannot be global-first** |
| Steering pipeline | **DNS pick cluster -> LB pick server** |
| Placement | **Enter deep = near users; bring home = fewer hubs** |
| Caching tradeoff | **TTL short = agile, TTL long = cheap** |
| Overlay value | **Bypass bad default paths** |

