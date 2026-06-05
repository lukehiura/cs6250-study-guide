---
tags:
  - lesson-09
  - security
  - bgp-hijacking
  - ddos
  - dns
  - quiz
search:
  boost: 1.5
quiz:
  auto_number: true
  shuffle_answers: true
  disable_after_submit: false
---

# Lesson 9: Interactive Quiz

Internet security properties, DNS abuse, BGP hijacking, and DDoS defense. Review the [Plain-language guide](plain-language.md), [Quick Study Guide](quick-study-guide.md), and [full guide](security.md).

!!! info "Before you begin"
    <!-- mkdocs-quiz intro -->

---

## Secure communication and DNS behavior

<quiz>
Which property ensures that only intended parties can understand message contents?
- [x] Confidentiality
- [ ] Availability
- [ ] Routing convergence
- [ ] Prefix aggregation

Confidentiality is typically achieved through encryption.
</quiz>

<quiz>
In Round Robin DNS (RRDNS), load distribution occurs mainly because:
- [x] DNS answer order rotates among multiple IP addresses
- [ ] Clients always receive only one static A record forever
- [ ] Routers perform BGP-based server CPU balancing
- [ ] NTP controls edge-server selection

RRDNS is simple and coarse; it does not fully account for real-time health/load.
</quiz>

<quiz>
Fast-flux service networks hide malicious infrastructure by rapidly changing [[dns]] mappings to compromised hosts.
---
Short DNS TTLs and rotating records make takedown and attribution harder.
</quiz>

---

## Detection systems and BGP hijacking

<quiz>
FIRE identifies potentially rogue networks by aggregating signals such as:
- [x] Botnet C2, phishing, malware, and spam data sources
- [ ] CPU temperature metrics only
- [ ] Optical attenuation values only
- [ ] DNSSEC key lengths only

FIRE combines multiple external abuse indicators at AS scale.
</quiz>

<quiz>
Which hijack type usually attracts traffic most reliably due to routing behavior?
- [x] Sub-prefix hijacking
- [ ] Exact-prefix hijacking always less preferred
- [ ] Squatting always less preferred than default route
- [ ] Type-U always fails globally

Routers generally prefer the most-specific prefix (longest-prefix match).
</quiz>

<quiz>
A BGP attack where the attacker claims to be the legitimate prefix origin is often called [[type-0]] manipulation.
---
Type-0 focuses on origin-AS falsification.
</quiz>

---

## ARTEMIS and mitigation

<quiz>
ARTEMIS is designed primarily to:
- [x] Detect and mitigate hijacks of the operator's own prefixes in near real time
- [ ] Replace DNS with a new naming protocol
- [ ] Remove all peering relationships
- [ ] Encrypt all BGP updates globally

ARTEMIS is operator-driven and does not require global protocol replacement.
</quiz>

<quiz>
Which pair is used by ARTEMIS as automated mitigation techniques?
- [x] Prefix deaggregation and AS-path poisoning
- [ ] NAT traversal and MPLS labeling
- [ ] DRR and token bucket shaping
- [ ] VOQ and PIM

Deaggregation attracts traffic back; path poisoning can limit attacker propagation.
</quiz>

---

## DDoS and blackholing tradeoffs

<quiz>
In reflection/amplification attacks, spoofing is useful because it:
- [x] Causes third-party servers to send responses to the victim
- [ ] Prevents any packet from reaching the victim
- [ ] Forces all BGP routers to reject updates
- [ ] Makes packets immune to filtering

The victim receives amplified traffic from legitimate external services.
</quiz>

<quiz>
A major drawback of provider- or IXP-based BGP blackholing is:
- [x] Legitimate traffic to the target prefix is dropped along with attack traffic
- [ ] It cannot be triggered quickly
- [ ] It always requires replacing routers
- [ ] It only works for DNS traffic

Blackholing is effective for relief but can be intentionally service-disruptive.
</quiz>

---

<!-- mkdocs-quiz results -->

---

!!! tip "Keep studying"
    - [Plain-language guide](plain-language.md)
    - [Quick Study Guide](quick-study-guide.md)
    - [Lesson 9 full guide](security.md)
    - [Practice Questions](../practice-questions.md)
