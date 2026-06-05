---
tags:
  - lesson-10
  - censorship-surveillance
  - quiz
search:
  boost: 1.5
quiz:
  auto_number: true
  shuffle_answers: true
  disable_after_submit: false
---

# Lesson 10: Interactive Quiz

Practice Internet censorship and surveillance concepts. New to the material? Start with the [Plain-language guide](plain-language.md). For compact written review, use the [Quick Study Guide](quick-study-guide.md).

!!! info "Before you begin"
    <!-- mkdocs-quiz intro -->

---

## Censorship techniques

<quiz>
Which censorship method forges DNS replies so that clients cache incorrect answers?
- [ ] Packet dropping
- [x] DNS injection/poisoning
- [ ] HTTP redirection
- [ ] Pure BGP peering

DNS manipulation works early in the connection process and can redirect users before real content is reached.
</quiz>

<quiz>
**Deep Packet Inspection (DPI)** is best described as:
- [ ] Only checking source and destination IP fields
- [x] Inspecting packet payloads to match keywords or signatures
- [ ] Encrypting all traffic end-to-end
- [ ] A DNS caching algorithm

DPI provides finer-grained filtering than IP-only rules but is computationally expensive.
</quiz>

<quiz>
Blocking by shared IP address is vulnerable to [[overblocking]].
---
Many unrelated domains can share one IP, so coarse IP blocks create collateral damage.
</quiz>

---

## DNS injection and race behavior

<quiz>
In DNS injection, the forged answer must:
- [x] Arrive before the legitimate response
- [ ] Contain a valid TLS certificate
- [ ] Come from the root server
- [ ] Use UDP port 80

The attack is fundamentally a timing race.
</quiz>

<quiz>
The three high-level stages are: [[monitoring]], [[detection]], and [[injection]].
---
The censor monitors queries, detects blocked domains, then injects forged replies.
</quiz>

<quiz>
Which statement is most accurate?
- [ ] DNS censorship always blocks only specific pages
- [x] DNS censorship often blocks at domain granularity
- [ ] DNS censorship cannot affect caching behavior
- [ ] DNS censorship requires BGP hijacking

Domain-level intervention is simple but tends to be coarse.
</quiz>

---

## Measurement and systems

<quiz>
Why is censorship measurement often limited?
- [x] Safe, persistent in-country vantage points are hard to obtain
- [ ] DNS has no cache
- [ ] BGP does not support prefixes
- [ ] Packet loss never occurs on the Internet

Measurement needs coverage, safety, and stable vantage points, which are difficult in censored regions.
</quiz>

<quiz>
Augur is mainly used to infer:
- [ ] Video codec quality
- [x] Connectivity disruption using remote side channels
- [ ] HTTP cache hit rates only
- [ ] Browser rendering performance

Augur can detect filtering/routing disruptions without direct local deployment.
</quiz>

<quiz>
Iris primarily studies [[DNS]] manipulation by querying distributed resolvers.
---
It combines resolver comparisons with HTTP/TLS/infrastructure metrics for classification.
</quiz>

<quiz>
Which pair is correctly matched?
- [x] Routing disruption -> BGP announcement/filter manipulation
- [ ] DPI -> physical cable damage
- [ ] DNS poisoning -> ARP-only updates
- [ ] TCP resets -> encryption at rest

Routing disruption targets path reachability by changing route visibility.
</quiz>

---

<!-- mkdocs-quiz results -->

