---
tags:
  - lesson-10
  - security
  - censorship
---

# Lesson 10: Internet Surveillance and Censorship

!!! tip "Exam prep"
    New to the material? Start with the **[Plain-language guide](plain-language.md)**. Need a condensed review? See the **[Quick Study Guide](quick-study-guide.md)**. For interactive practice, try the **[Lesson 10 Quiz](quiz.md)**.

---

## What is DNS censorship?

DNS censorship is a technique used by governments or organizations to **block access to certain websites or content** by interfering with the DNS resolution process. Instead of returning the correct IP address for a requested domain, the censored DNS system returns an **incorrect address** (pointing to a block page), **no address**, or **an error**.

Since DNS is the first step in accessing any web resource, manipulating it is an effective chokepoint for censorship.

---

## What are the properties of the GFW (Great Firewall of China)?

The Great Firewall of China is one of the most sophisticated censorship systems:

1. **Operates at scale** — Filters traffic for the entire country (billions of requests).
2. **Uses multiple techniques** — DNS injection, IP blocking, deep packet inspection, connection resets, keyword filtering.
3. **Bidirectional** — Censors both **inbound** (content entering China) and **outbound** (content leaving China) traffic.
4. **Dynamic** — The censored content list changes over time; new filtering rules can be deployed quickly.
5. **Distributed** — Filtering occurs at multiple points in the network (backbone routers, ISP-level, application-level).
6. **Over-blocking tendency** — Due to the aggressive techniques, legitimate traffic is sometimes inadvertently blocked.

---

## How does DNS injection work?

DNS injection is a censorship technique where the censor **monitors DNS queries** and, for blacklisted domains, **injects a forged DNS response** before the legitimate response arrives:

1. A user sends a DNS query for a blocked domain.
2. The query passes through the censor's network infrastructure.
3. The censor detects the query matches a blocked domain.
4. The censor **injects a fake DNS response** with an incorrect IP address (or a block page IP) directly to the user.
5. The fake response arrives **before** the legitimate response from the actual DNS server.
6. The user's resolver accepts the first (forged) response and caches it.
7. The legitimate response arrives later but is **ignored** (since the resolver already has an answer).

---

## What are the three steps involved in DNS injection?

1. **Monitoring** — The censor inspects DNS queries passing through its network infrastructure (typically at backbone routers).
2. **Detection** — The censor matches the queried domain against a list of censored domains.
3. **Injection** — For matched queries, the censor injects a forged DNS response with an incorrect IP address, racing to reach the client before the legitimate response.

---

## List five DNS censorship techniques and briefly describe their working principles

1. **Packet Dropping** — The censor identifies and drops packets based on IP addresses, keywords in the content, or other header fields. Blocked traffic simply never arrives at its destination.

2. **DNS Poisoning** — The censor manipulates DNS responses to return incorrect IP addresses for censored domains, redirecting users to block pages or non-existent addresses.

3. **Content Inspection (Deep Packet Inspection)** — The censor examines the **payload** of packets in real time, looking for blacklisted keywords or content. Matching connections are disrupted or blocked.

4. **Blocking with Resets** — The censor sends **TCP RST (reset) packets** to both endpoints of a connection, causing the connection to terminate. Often triggered by content inspection finding blacklisted keywords.

5. **Immediate Reset of Connections** — Similar to blocking with resets, but the censor immediately terminates new connections to known censored IP addresses without even inspecting content.

---

## Which DNS censorship technique is susceptible to overblocking?

**DNS Poisoning** is particularly susceptible to overblocking because:

- It operates at the **domain level**, not the content level. Blocking a domain blocks **all content** on that domain, including legitimate, non-censored content.
- Shared hosting means many websites share the same IP or domain, so blocking one site can inadvertently block others.
- Wildcard blocking (e.g., blocking `*.example.com`) can block legitimate subdomains.

**IP-based blocking** also causes overblocking when many domains share the same IP address (virtual hosting).

---

## What are the strengths and weaknesses of the "packet dropping" DNS censorship technique?

**Strengths:**

- **Simple to implement** — Basic filtering based on IP addresses or header fields.
- **Low computational cost** — No need to inspect packet contents (when IP-based).
- **Effective** — Dropped packets prevent communication entirely.

**Weaknesses:**

- **Overblocking** — Blocking an IP address affects all services on that IP (shared hosting).
- **Collateral damage** — Legitimate traffic sharing the same path or IP is also dropped.
- **Easily circumvented** — Users can change IP addresses, use VPNs, or use proxy servers.

---

## What are the strengths and weaknesses of the "DNS poisoning" DNS censorship technique?

**Strengths:**

- **Low cost** — Only requires modifying DNS responses, not inspecting all traffic.
- **Broad coverage** — Affects all users relying on the censored DNS infrastructure.
- **Easy to deploy** — Can be implemented at the ISP level by modifying DNS resolvers.

**Weaknesses:**

- **Overblocking** — Entire domains are blocked, including legitimate content.
- **Easily circumvented** — Users can switch to uncensored DNS resolvers (e.g., 8.8.8.8, 1.1.1.1) or use DNS-over-HTTPS (DoH).
- **Collateral damage** — Can affect users outside the censoring country if the poisoned responses propagate.

---

## What are the strengths and weaknesses of the "content inspection" DNS censorship technique?

**Strengths:**

- **Fine-grained** — Can block specific pages or content rather than entire domains.
- **Keyword-based** — Can detect and block content containing specific blacklisted terms.
- **Difficult to evade** — Examines actual packet content, not just headers.

**Weaknesses:**

- **Computationally expensive** — DPI at scale requires significant processing power.
- **Encryption defeats it** — HTTPS/TLS encrypts content, making inspection impossible without breaking encryption.
- **Latency** — Inspecting packet contents adds delay to connections.
- **Privacy concerns** — Requires examining all traffic, not just suspicious traffic.

---

## What are the strengths and weaknesses of the "blocking with resets" DNS censorship technique?

**Strengths:**

- **Effective** — TCP RST packets immediately terminate connections.
- **Selective** — Can be triggered only when blacklisted content is detected (combined with DPI).
- **Low bandwidth cost** — Only small RST packets need to be injected.

**Weaknesses:**

- **Requires content inspection** — Must first detect the offending content before sending RSTs.
- **Race condition** — The RST must arrive before the data is delivered; fast connections may partially succeed.
- **Circumventable** — Endpoints can be configured to ignore RST packets from certain sources, or use encrypted connections.

---

## What are the strengths and weaknesses of the "immediate reset of connections" DNS censorship technique?

**Strengths:**

- **Fast** — No need to inspect content; connections are immediately terminated based on the destination IP or SNI (Server Name Indication).
- **Low overhead** — Simpler than full DPI; just monitors connection setup.
- **Proactive** — Blocks connections before any content is exchanged.

**Weaknesses:**

- **Overblocking** — Blocks all connections to a destination regardless of content, affecting legitimate traffic.
- **Coarse-grained** — Cannot distinguish between censored and non-censored content on the same server.
- **Circumventable** — VPNs and tunneling can hide the true destination.

---

## Why is our understanding of censorship around the world relatively limited? What are the challenges?

1. **Diverse methods** — Different countries use different censorship techniques, making it hard to develop universal measurement tools.
2. **Dynamic censorship** — Blocked content and methods change frequently; one-time measurements quickly become outdated.
3. **Legal and ethical risks** — Researchers and volunteers in censored countries face legal risks for probing censorship infrastructure.
4. **Lack of vantage points** — Measurements require infrastructure inside the censored country, which is difficult to obtain and maintain.
5. **Opacity** — Censorship systems are deliberately opaque; operators don't publish their methods or blocklists.
6. **Scale** — The Internet is vast; comprehensively measuring censorship across all protocols, all domains, and all countries is infeasible.
7. **Ground truth** — It's difficult to establish what is "definitely censored" vs. what is a network failure or misconfiguration.

---

## What are the limitations of main censorship detection systems?

1. **Require vantage points inside censored networks** — Most systems need volunteers or infrastructure within the censored country.
2. **Limited scale** — Can only test a subset of domains and protocols.
3. **Snapshot-based** — Provide point-in-time measurements rather than continuous monitoring.
4. **Single protocol focus** — Many systems only detect DNS-based censorship, missing IP blocking, DPI, or other techniques.
5. **Ethical concerns** — Probing from within censored countries can put users at risk.
6. **Cannot distinguish censorship from network failures** — Packet loss, routing changes, or server outages may look like censorship.

---

## What kind of disruptions does Augur focus on identifying?

Augur focuses on identifying **Internet-wide connectivity disruptions** caused by:

- **IP-based filtering** — When a country or network blocks access to specific IP addresses.
- **Routing-based disruption** — When routes to certain destinations are withdrawn or manipulated.

Augur operates **remotely** without requiring vantage points inside the censored network. It uses **side-channel measurements** by observing how IP ID counters change on machines inside the censored network to infer whether those machines can still reach external destinations.

---

## How does Iris counter the issue of lack of diversity while studying DNS manipulation?

Iris addresses the diversity problem through:

1. **Global DNS resolver infrastructure** — Uses a large number of **open DNS resolvers** distributed worldwide as vantage points, rather than relying on dedicated infrastructure in each country.
2. **Cross-country comparisons** — Compares DNS responses from resolvers in different countries to identify inconsistencies.

**Steps in the Iris process:**

1. **Identify open DNS resolvers** globally.
2. **Query each resolver** for a set of test domains and control domains.
3. **Collect and annotate responses** — Record the returned IP addresses.
4. **Compare responses** across resolvers to detect manipulation.
5. **Apply metrics and machine learning** to classify responses as legitimate or manipulated.

---

## What are the steps involved in the global measurement process using DNS resolvers?

1. **Resolver discovery** — Identify open DNS resolvers worldwide through scanning.
2. **Domain selection** — Choose a set of domains to test (both known-censored and known-uncensored control domains).
3. **Query distribution** — Send DNS queries for each domain to each resolver.
4. **Response collection** — Record the IP addresses and other records returned by each resolver.
5. **Data annotation** — Label responses with geographic, network, and organizational information.
6. **Analysis** — Compare responses across resolvers to identify inconsistencies indicative of DNS manipulation.

---

## What metrics does Iris use to identify DNS manipulation once data annotation is complete?

1. **Consistency metrics** — Compare the DNS response from a resolver against:
    - Responses from **trusted resolvers** (e.g., Google DNS, Cloudflare DNS).
    - Responses from **other resolvers in the same country**.
    - The **expected IP address set** for the domain.

2. **HTTP content metrics** — Fetch the web page at the returned IP and compare it to the expected content. Block pages have distinctive content.

3. **Certificate metrics** — Check if the returned IP serves a valid TLS certificate for the queried domain. Manipulated responses typically don't have valid certificates.

4. **Infrastructure metrics** — Check if the returned IP belongs to known censorship infrastructure (e.g., known block-page IPs).

**Condition for declaring manipulation:** A response is declared manipulated if it **fails multiple independent metrics** — i.e., the returned IP doesn't match expected IPs, doesn't serve the correct content, and doesn't have a valid certificate.

---

## How to identify DNS manipulation via machine learning with Iris?

Iris uses the collected metrics as **features** to train a machine learning classifier:

1. **Feature extraction** — For each DNS response, compute features including: consistency with control resolvers, HTTP content similarity, TLS certificate validity, IP geolocation, ASN of returned IP, etc.
2. **Labeled training data** — Use known examples of manipulated and non-manipulated responses (from control domains and known-censored domains).
3. **Classifier training** — Train a supervised classifier (e.g., random forest, SVM) on the labeled data.
4. **Classification** — Apply the trained model to new, unlabeled DNS responses to predict whether they represent manipulation.

The ML approach is valuable because it can detect manipulation even when individual metrics are ambiguous, by combining weak signals across multiple features.

---

## How is it possible to achieve connectivity disruption using the routing disruption approach?

Routing disruption achieves connectivity disruption by manipulating **BGP routing**:

1. **Route withdrawal** — An AS withdraws its BGP announcement for a prefix, making the prefix unreachable from parts of the Internet.
2. **Route filtering** — An AS or ISP filters BGP announcements for certain prefixes, preventing neighbors from learning routes to those destinations.
3. **Route poisoning** — An AS announces routes with artificially long AS paths or community tags that cause downstream routers to reject them.

This is a blunt instrument that affects all traffic to the targeted prefixes.

---

## How is it possible to achieve connectivity disruption using the packet filtering approach?

Packet filtering disrupts connectivity by **dropping packets at routers** based on:

- **Destination IP address** — Drop all packets to censored destinations.
- **Source IP address** — Drop all packets from specific sources.
- **Protocol or port** — Block specific protocols (e.g., drop all traffic on port 443 to block HTTPS to a site).
- **Content (DPI)** — Drop packets containing specific keywords or patterns.

Unlike routing disruption, packet filtering can be more granular (blocking specific IP ranges rather than entire prefixes) but requires more processing at each router.

---

## Explain a scenario of connectivity disruption detection in the case when no filtering occurs

Augur's detection relies on **IP ID side channels**:

1. Augur identifies a **reflector** (a machine inside the target network that uses globally incrementing IP IDs).
2. Augur sends **probe packets** to the reflector from outside and observes the IP ID values.
3. Augur also sends **spoofed packets** (with the reflector's IP as source) to a target server, causing the server to respond to the reflector.
4. **When no filtering occurs:** The reflector's IP ID increments normally from both Augur's probes and the server's responses. Augur observes **larger IP ID increments** than expected from its own probes alone, indicating that the server's responses are reaching the reflector — connectivity exists.

---

## Explain a scenario of connectivity disruption detection in the case of inbound blocking

1. Augur sends spoofed packets (source = reflector's IP) to the target server.
2. The target server sends responses to the reflector.
3. **Inbound blocking:** The censor's firewall **drops the server's responses** before they reach the reflector.
4. The reflector's IP ID only increments from Augur's direct probes — **no additional increments** from the server's responses.
5. Augur infers that **inbound traffic from the server to the reflector is being blocked**.

---

## Explain a scenario of connectivity disruption detection in the case of outbound blocking

1. Augur sends spoofed packets (source = reflector's IP) to the target server.
2. **Outbound blocking:** The censor's firewall **blocks the spoofed packets from leaving** the reflector's network (or blocks them en route to the server).
3. The server never receives the spoofed packets and therefore never sends responses.
4. The reflector's IP ID only increments from Augur's direct probes — **no additional increments**.
5. To distinguish outbound from inbound blocking, Augur can send probes from **different vantage points** and compare results. If the reflector can reach other servers but not the target, it's likely outbound filtering specific to that destination.
