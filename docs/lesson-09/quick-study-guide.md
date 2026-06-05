---
tags:
  - lesson-09
  - security
  - bgp-hijacking
  - ddos
  - dns
  - quick-study
search:
  boost: 2
---

# Lesson 9: Quick Study Guide — Internet Security

Exam-focused review of Internet security topics from Lesson 9. Start with the [Plain-language guide](plain-language.md) if needed, then use the [full guide](security.md), and test with the [quiz](quiz.md).

---

## 1. Big picture

- Security analysis spans communication properties, routing attacks, and volumetric attacks.
- This lesson combines **DNS abuse**, **BGP hijacking**, and **DDoS**.
- Defenses often involve tradeoffs between rapid containment and service availability.
- Know both taxonomy (attack types) and mitigation mechanisms (e.g., ARTEMIS, blackholing).

!!! tip "Memory aid"
    **Detect fast, classify correctly, mitigate with least collateral damage.**

---

## 2. Secure communication properties

| Property | Definition | Typical mechanism |
|----------|------------|-------------------|
| **Confidentiality** | Only intended parties can read content | Encryption |
| **Integrity** | Data not modified in transit | MAC/signature |
| **Authentication** | Identity verification | Certificates/challenge-response |
| **Availability** | Service remains reachable | Redundancy + DDoS defense |

---

## 3. DNS-based delivery and abuse

| Topic | Key point |
|------|-----------|
| **RRDNS** | Rotates returned A records for coarse load spread |
| **CDN DNS steering** | Maps clients to better edge servers |
| **Fast flux** | Rapid DNS record changes hide malicious backend |
| **Double flux** | Rapid churn of both host and nameserver mappings |

---

## 4. Rogue network detection systems

| System | Inputs | Goal |
|--------|--------|------|
| **FIRE** | Botnet C2, phishing, spam, malware hosting feeds | Identify ASes with disproportionate malicious activity |
| **ASwatch** | BGP dynamics and control-plane behavior features | Classify suspicious AS behavior over time |

ASwatch phases:

1. Train model on known legit/rogue AS behavior
2. Operate continuously and score live AS activity

---

## 5. BGP hijacking taxonomy

### A) By affected prefix

- exact-prefix hijack
- sub-prefix hijack
- squatting

### B) By AS-path manipulation

- Type-0 (origin manipulation)
- Type-N (path-position manipulation)
- Type-U (upstream relationship manipulation)

### C) By data-plane impact

- blackholing
- eavesdropping
- imposture

!!! warning "Exam point"
    **Sub-prefix hijack is often the most immediately effective** due to longest-prefix preference.

---

## 6. BGP attack motivations

- spam sending from fresh address space
- credential/financial theft
- surveillance/espionage
- censorship and geopolitical manipulation
- denial of service
- accidental misconfiguration

---

## 7. ARTEMIS essentials

| Capability | Description |
|-----------|-------------|
| Real-time monitoring | Watches BGP feeds for unauthorized announcements of own prefixes |
| Operator-driven config | Known-good prefix/origin map defines expected behavior |
| Automated mitigation | Prefix deaggregation and AS-path poisoning |

Key findings emphasized:

- fast hijack detection
- mitigation in minutes without BGP redesign

---

## 8. DDoS structure and spoofing

| Component | Role |
|----------|------|
| Attacker/master | Issues attack commands |
| C2 infrastructure | Coordinates bot actions |
| Botnet/zombies | Generate flood traffic |
| Victim | Target resource/service |

**IP spoofing** helps hide origin and powers reflection/amplification patterns.

---

## 9. Reflection/amplification and defenses

Reflection pattern:

1. spoof victim source IP
2. send queries to amplifiers
3. amplifiers send larger replies to victim

Common amplifiers: DNS, NTP, memcached.

Defense options:

- scrubbing centers
- BGP blackholing (provider or IXP)
- ingress filtering (BCP38)
- rate limiting
- anycast

---

## 10. High-yield exam Q&A

### Four secure communication properties?

Confidentiality, integrity, authentication, and availability.

### RRDNS limitation?

Simple load spread, but no strong real-time awareness of path quality/server health.

### FIRE vs ASwatch in one line?

FIRE is feed-driven maliciousness scoring; ASwatch is BGP-behavior-driven classification.

### Why is sub-prefix hijack strong?

Routers prefer more-specific prefixes under longest-prefix match.

### Prefix hijack vs path hijack?

Prefix hijack announces stolen prefix; path hijack forges plausible AS-path relationship.

### ARTEMIS automated responses?

Prefix deaggregation and AS-path poisoning.

### DDoS reflection prerequisite?

Source IP spoofing and reachable amplifiers.

### Biggest drawback of blackholing?

It blocks legitimate traffic to the target prefix too.

---

## 11. Quick memory sheet

| Topic | Memory aid |
|------|-------------|
| Security properties | C-I-A-A: confidentiality, integrity, authentication, availability |
| Fast flux | DNS churn hides attacker infrastructure |
| FIRE | Malicious data feeds -> rogue AS scoring |
| ASwatch | BGP behavior fingerprints suspicious ASes |
| Sub-prefix hijack | More-specific wins |
| ARTEMIS | Detect own-prefix abuse, auto-mitigate quickly |
| Reflection attack | Spoof small in, large out to victim |
| Blackholing | Fast relief, high collateral damage |
