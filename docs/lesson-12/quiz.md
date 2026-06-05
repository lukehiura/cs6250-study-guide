---
tags:
  - lesson-12
  - cdns-dns-overlays
  - quiz
search:
  boost: 1.5
quiz:
  auto_number: true
  shuffle_answers: true
  disable_after_submit: false
---

# Lesson 12: Interactive Quiz

Practice CDN architecture, DNS-based mapping, and overlay concepts. New to this topic? Start with the [Plain-language guide](plain-language.md). For compact written review, use the [Quick Study Guide](quick-study-guide.md).

!!! info "Before you begin"
    <!-- mkdocs-quiz intro -->

---

## CDN motivation and placement

<quiz>
Which is a primary drawback of single-origin hosting?
- [ ] It always reduces latency
- [x] It creates scalability and single-point-of-failure risk
- [ ] It eliminates DDoS exposure
- [ ] It guarantees local delivery for all users

One server location concentrates load, failure risk, and attack surface.
</quiz>

<quiz>
A **Content Delivery Network (CDN)** is best defined as:
- [x] A distributed server infrastructure that serves content from nearby or well-performing locations
- [ ] A single authoritative DNS server
- [ ] A transport protocol replacing TCP
- [ ] A Layer 2 switching standard

CDNs improve latency, availability, and origin offload through geographic distribution.
</quiz>

<quiz>
The strategy that places many CDN servers inside access ISPs is called [[enter deep]].
---
This design improves proximity at the cost of greater operational complexity.
</quiz>

<quiz>
"Bring home" generally means:
- [x] Fewer large CDN clusters at major peering/IXP locations
- [ ] Every user runs a local CDN server
- [ ] No DNS required for content delivery
- [ ] CDN servers only at root DNS sites

Bring-home is easier to operate but may be farther from edge users.
</quiz>

---

## DNS-based request steering

<quiz>
In a CDN, DNS is commonly used to:
- [x] Map a client request to an edge cluster/server IP
- [ ] Perform TCP congestion control
- [ ] Replace HTTP segment requests
- [ ] Encrypt video frames

DNS is the primary control plane for large-scale initial request mapping.
</quiz>

<quiz>
Why can DNS mapping be imperfect?
- [ ] DNS cannot return IP addresses
- [x] Resolver location may differ from end-user location
- [ ] CDNs cannot measure latency
- [ ] DNS has no caching

CDNs often observe resolver identity, not exact client network position.
</quiz>

<quiz>
A CDN's two-step selection is typically: [[cluster]] selection first, then [[server]] selection.
---
Coarse DNS decision chooses region; fine-grained balancing picks machine inside region.
</quiz>

---

## Algorithms and overlays

<quiz>
Consistent hashing is valuable because:
- [x] Adding/removing servers remaps only a subset of keys
- [ ] It requires all keys to move every time
- [ ] It removes the need for caching
- [ ] It always gives exact equal load without virtual nodes

Limited remapping preserves cache locality during membership changes.
</quiz>

<quiz>
IP Anycast means:
- [x] Multiple sites announce the same IP prefix; routing picks a nearby instance
- [ ] One server holds many DNS records
- [ ] One host has multiple NICs in one LAN
- [ ] Packets always traverse identical paths

Anycast is widely used by CDNs and root DNS deployments.
</quiz>

<quiz>
An overlay network primarily helps by:
- [x] Selecting application-level paths that may outperform default Internet routes
- [ ] Eliminating the need for DNS hierarchy
- [ ] Forcing all traffic onto one transit ISP
- [ ] Replacing BGP globally

Overlays add a control layer above IP routing for performance and resilience tuning.
</quiz>

---

<!-- mkdocs-quiz results -->

