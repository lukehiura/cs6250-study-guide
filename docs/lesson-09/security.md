# Lesson 9: Internet Security

---

## What are the properties of secure communication?

1. **Confidentiality** — Only the sender and intended receiver can understand the message content. Achieved through encryption.
2. **Integrity** — The message has not been altered in transit. Achieved through message authentication codes (MACs) or digital signatures.
3. **Authentication** — The sender and receiver can confirm each other's identity. Achieved through certificates, shared secrets, or challenge-response protocols.
4. **Availability** — The communication service must be accessible when needed. Threatened by Denial of Service attacks.

---

## How does Round Robin DNS (RRDNS) work?

RRDNS is a load distribution technique where a DNS server has **multiple A records** (IP addresses) for a single domain name. On each query, the server **rotates the order** of the returned addresses.

- Clients typically use the first address in the list, so rotation distributes traffic across multiple servers.
- Simple to implement but provides only coarse load distribution.
- Does not account for server health, geographic proximity, or actual load.

---

## How does DNS-based content delivery work?

CDNs use DNS to direct users to the optimal content server:

1. A user requests content (e.g., `video.example.com`).
2. The DNS resolution is handled by the CDN's **authoritative DNS server**.
3. The CDN's DNS server examines the client's **local DNS resolver IP** to estimate the client's location.
4. It returns the IP address of the **nearest or best-performing CDN edge server**.
5. The client connects to that edge server and downloads the content.

This enables the CDN to dynamically route users to different servers based on geography, server load, and network conditions — all through DNS responses.

---

## How do Fast-Flux Service Networks work?

Fast-Flux Service Networks are a technique used by **botnets and malicious actors** to hide the location of their servers:

1. A domain name is associated with a **rapidly changing set of IP addresses** (with very low TTL values, e.g., 300 seconds).
2. These IP addresses belong to **compromised machines (bots)** that act as proxies.
3. When a client connects, it reaches a bot, which **relays** the traffic to the actual hidden backend server.
4. The constantly changing DNS records make it extremely difficult to take down the service or identify the real server.

**Single-flux:** Only the A records change rapidly.
**Double-flux:** Both the A records and the NS (nameserver) records change, adding another layer of indirection.

---

## What are the main data sources used by FIRE to identify rogue networks?

**FIRE (FInding Rogue nEtworks)** uses multiple data sources to identify networks likely hosting malicious activity:

1. **Botnet command and control (C&C) server data** — Known C&C IP addresses from monitoring services.
2. **Drive-by-download server lists** — IPs hosting exploit kits and malware distribution sites.
3. **Phishing server lists** — Known phishing infrastructure.
4. **Spam trap data** — IP addresses sending spam.

FIRE aggregates these sources to compute a "malicious activity score" for each network (ASN). Networks with disproportionately high malicious activity relative to their size are flagged as potentially rogue.

---

## Describe the 2 phases of ASwatch

ASwatch monitors global BGP routing activity to learn control plane behavior of networks:

### Phase 1: Training Phase

- Analyze the BGP routing behavior of **known legitimate and known rogue/bullet-proof ASes**.
- Extract features from BGP data: rewiring activity (frequent changes in upstream providers), IP prefix announcements/withdrawals, BGP update patterns.
- Train a machine learning classifier to distinguish legitimate from rogue routing behavior.

### Phase 2: Operational Phase

- Continuously monitor BGP data for all ASes in real time.
- Apply the trained classifier to compute a **reputation score** for each AS.
- Flag ASes whose routing behavior resembles that of known rogue networks (e.g., frequent provider changes, short-lived prefix announcements).

---

## What are 3 classes of features used to determine the likelihood of a security breach within an organization?

1. **Mismanagement symptoms** — Indicators of poor network hygiene: open recursive DNS resolvers, misconfigured mail servers (lack of SPF/DKIM), untrusted HTTPS certificates, unpatched DNS servers.

2. **Malicious activity** — Evidence of active compromise: spam sending, phishing hosting, botnet participation, scanning activity originating from the network.

3. **Security incident reports** — Historical breach data and vulnerability disclosures associated with the organization's IP address space.

---

## (BGP hijacking) What is the classification by affected prefix?

- **Exact prefix hijacking** — The attacker announces the **exact same prefix** as the victim (e.g., victim announces `10.0.0.0/16`, attacker also announces `10.0.0.0/16`). Some ASes may prefer the attacker's route depending on AS path length and policies.

- **Sub-prefix hijacking** — The attacker announces a **more specific (longer) prefix** that falls within the victim's address space (e.g., victim announces `10.0.0.0/16`, attacker announces `10.0.0.0/24`). Due to longest prefix match, the attacker's more specific route is preferred by all routers, making this more effective.

- **Squatting** — The attacker announces a prefix that is **not currently announced** by anyone (e.g., allocated but unused address space).

---

## (BGP hijacking) What is the classification by AS-Path announcement?

- **Type-0 (Origin AS attack)** — The attacker changes the **origin AS** in the BGP announcement, claiming to be the legitimate origin of the prefix.

- **Type-N (Path manipulation)** — The attacker manipulates the AS path by inserting themselves at position N in the path, making it appear as though they have a legitimate path to the prefix.

- **Type-U (Upstream AS manipulation)** — The attacker claims to be an upstream provider of the victim AS, creating a plausible-looking but fake path.

---

## (BGP hijacking) What is the classification by data plane traffic manipulation?

- **Blackholing (Dropped traffic)** — The attacker attracts traffic via the hijacked route and **drops** all packets. The victim's service becomes unreachable.

- **Eavesdropping (Intercepted traffic)** — The attacker intercepts the traffic, **inspects or copies** it, and then forwards it to the legitimate destination. This is harder to detect because the service still works.

- **Imposture (Impersonation)** — The attacker attracts traffic and **responds as if it were the legitimate server**, potentially serving malicious content or collecting credentials.

---

## What are the causes or motivations behind BGP attacks?

1. **Spam delivery** — Hijack unused IP space to send spam from addresses with no bad reputation, then release them.
2. **Cryptocurrency theft** — Redirect traffic to cryptocurrency exchanges or mining pools.
3. **Surveillance and espionage** — Intercept traffic for intelligence gathering (state-sponsored attacks).
4. **Censorship** — Governments hijacking routes to block access to certain content.
5. **Denial of service** — Blackhole a victim's traffic to make their services unreachable.
6. **Financial gain** — Redirect traffic to phishing sites or intercept financial transactions.
7. **Accidental** — Misconfigurations that inadvertently announce incorrect routes (e.g., the Pakistan/YouTube incident).

---

## Explain the scenario of prefix hijacking

1. AS-Victim legitimately announces prefix `P` (e.g., `130.0.0.0/16`) to its neighbors via BGP.
2. AS-Attacker also announces prefix `P` (or a more specific sub-prefix) without authorization.
3. Neighboring ASes receive **two competing BGP announcements** for the same prefix.
4. Depending on AS path length, routing policies, and geographic proximity, some ASes will prefer the attacker's route.
5. Traffic destined for the victim's network is now **redirected** to the attacker.
6. The attacker can blackhole the traffic, inspect it, or impersonate the victim.

---

## Explain the scenario of hijacking a path

1. AS-Victim announces prefix `P` with AS path `[Victim]`.
2. AS-Attacker announces `P` with a **fabricated AS path** like `[Attacker, Victim]`, claiming to be one hop away from the victim.
3. ASes receiving both announcements may prefer the attacker's path if it appears shorter or if policies favor it.
4. Traffic follows the attacker's fake path and reaches the attacker's network.
5. The attacker can then forward the traffic to the actual victim (for eavesdropping) or drop it (for DoS).

This is harder to detect than prefix hijacking because the AS path looks plausible.

---

## What are the key ideas behind ARTEMIS?

ARTEMIS is a system for **detecting and mitigating BGP prefix hijacking**:

1. **Network operator-driven** — The victim network itself runs ARTEMIS, without requiring cooperation from other ASes.
2. **Real-time BGP monitoring** — Continuously monitors BGP data feeds (RIPE RIS, RouteViews) for unauthorized announcements of its prefixes.
3. **Automated mitigation** — Upon detecting a hijack, ARTEMIS can automatically respond to reclaim the hijacked prefix.
4. **Configuration-based** — Operators specify their legitimate prefixes and origin ASes; any deviation triggers an alert.

---

## What are the two automated techniques used by ARTEMIS to protect against BGP hijacking?

1. **Prefix deaggregation** — When a hijack is detected, the victim announces **more specific (longer) prefixes** that cover the hijacked prefix. Due to longest prefix match, these more specific routes attract traffic back to the legitimate origin, effectively countering the hijack.

2. **AS path poisoning** — The victim includes the **attacker's ASN in the AS path** of its announcements. BGP loop detection causes the attacker's AS to reject these routes, preventing the attacker from propagating the hijacked route further.

---

## What are two findings from ARTEMIS?

1. **Fast detection** — ARTEMIS can detect prefix hijacking within **seconds to a few minutes** by monitoring public BGP data streams, which is significantly faster than manual detection methods.

2. **Effective mitigation** — The combination of prefix deaggregation and path poisoning can recover hijacked traffic within **a few minutes** without requiring changes to BGP itself or cooperation from other networks.

---

## Explain the structure of a DDoS attack

A **Distributed Denial of Service (DDoS)** attack consists of:

1. **Attacker/Master** — The adversary who orchestrates the attack.
2. **Command and Control (C&C) infrastructure** — Servers or channels the attacker uses to coordinate the bot network.
3. **Bot army (Zombies)** — A large number of compromised machines (botnets) that generate attack traffic.
4. **Victim** — The target server or network whose resources are overwhelmed.

**Attack flow:**

1. The attacker compromises many machines (via malware, phishing, etc.) to form a botnet.
2. The attacker issues a command through the C&C infrastructure.
3. All bots simultaneously flood the victim with traffic (SYN floods, UDP floods, HTTP floods, etc.).
4. The victim's resources (bandwidth, CPU, memory, connection state) are exhausted, denying service to legitimate users.

---

## What is spoofing, and how is it related to a DDoS attack?

**IP spoofing** is the practice of forging the source IP address in a packet header to disguise the sender's identity.

In DDoS attacks, spoofing is used to:

- **Hide the identity** of the attacking bots, making it harder to trace and filter the attack.
- Enable **reflection and amplification attacks** — spoofed packets with the victim's IP as the source are sent to servers, which send their (larger) responses to the victim.
- **Circumvent source-based filtering** — randomized spoofed addresses bypass simple IP-based block lists.

---

## Describe a Reflection and Amplification attack

1. The attacker sends requests to public servers (DNS, NTP, memcached) with the **source IP spoofed** to be the victim's IP address.
2. The servers process the requests and send **responses to the victim** (the spoofed source address).
3. **Amplification** occurs because the response is much larger than the request (amplification factor):
    - DNS: up to ~50× amplification
    - NTP: up to ~556× amplification
    - Memcached: up to ~51,000× amplification
4. The victim is flooded with massive response traffic from legitimate servers.

**Why effective:** The attacker leverages the bandwidth and processing of legitimate third-party servers; the attack traffic appears to come from legitimate sources.

---

## What are the defenses against DDoS attacks?

1. **Traffic scrubbing services** — Third-party services (e.g., Cloudflare, Akamai) that filter attack traffic before it reaches the victim.
2. **BGP blackholing** — Announcing the victim's prefix to upstream providers with a community tag requesting them to drop all traffic to that prefix.
3. **Rate limiting** — Limiting the rate of incoming packets per source or protocol.
4. **Ingress filtering (BCP38)** — ISPs filter packets with spoofed source addresses at the network edge.
5. **Anycast** — Distributing the victim's service across many locations to absorb attack traffic.
6. **Over-provisioning** — Having more bandwidth than an attacker can generate.
7. **IXP blackholing** — Using IXP infrastructure to drop attack traffic closer to the source.

---

## Explain provider-based blackholing

In provider-based blackholing:

1. The victim detects a DDoS attack on its prefix.
2. The victim sends a BGP announcement to its **upstream ISP** with a special community tag (blackhole community).
3. The ISP, upon receiving this announcement, drops all traffic destined for the victim's prefix at **its edge routers** (before the traffic enters the ISP's core network).
4. This stops attack traffic from reaching the victim but also **drops all legitimate traffic** to the blackholed prefix.

The victim sacrifices all connectivity to the attacked prefix in exchange for protecting the rest of its infrastructure from being overwhelmed.

---

## Explain IXP blackholing

IXP blackholing is similar to provider-based blackholing but leverages **Internet Exchange Points**:

1. The victim signals the IXP (via BGP with a blackhole community) to drop traffic to its attacked prefix.
2. The IXP installs drop rules on its switching fabric for packets destined to the victim's prefix.
3. Attack traffic is dropped **at the IXP level**, closer to the traffic sources and before it transits the victim's ISP.

**Advantages over provider-based blackholing:**

- **More granular** — Some IXPs support blackholing from specific source ASes, reducing collateral damage.
- **Broader reach** — An IXP aggregates many networks, so blackholing at the IXP filters traffic from multiple sources simultaneously.

---

## What is one of the major drawbacks of BGP blackholing?

The major drawback is that blackholing is **indiscriminate** — it drops **all traffic** to the targeted prefix, including legitimate traffic. This means the attacker effectively achieves their goal of making the victim's service unreachable, even though the victim initiated the blackholing.

The victim must choose between:

- Being overwhelmed by attack traffic (without blackholing).
- Being unreachable to everyone (with blackholing).

More sophisticated solutions like traffic scrubbing can distinguish attack traffic from legitimate traffic, but they are more expensive and complex.
