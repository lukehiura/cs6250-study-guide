# Lesson 12: Applications (CDNs and Overlay Networks)

---

## What is the drawback to using the traditional approach of having a single, publicly accessible web server?

A single web server suffers from:

1. **Single point of failure** — If the server goes down, the entire service is unavailable.
2. **Scalability limits** — One server has finite CPU, memory, and bandwidth; it cannot handle millions of simultaneous users.
3. **High latency for distant users** — Users far from the server experience high round-trip times and slow downloads.
4. **Network congestion** — All traffic converges on one network path, creating bottlenecks.
5. **Vulnerability to DDoS** — A single target is easy to overwhelm with attack traffic.

---

## What is a CDN?

A **Content Delivery Network (CDN)** is a geographically distributed network of servers that delivers content to users from the **nearest or best-performing server**. CDNs cache and serve content (web pages, videos, images, APIs) from edge locations close to end users.

**Key benefits:**

- Reduced latency (content served from nearby servers).
- Reduced load on the origin server.
- Improved availability and redundancy.
- DDoS mitigation through traffic distribution.

**Major CDNs:** Akamai, Cloudflare, Amazon CloudFront, Fastly.

---

## What are the six major challenges that Internet applications face?

1. **Peering point congestion** — Bottlenecks at interconnection points between networks.
2. **Bandwidth limitations** — Insufficient capacity on last-mile or backbone links.
3. **Inefficient routing** — BGP may not choose the fastest or most reliable path.
4. **Unreliable networks** — Packet loss, jitter, and outages affect quality.
5. **Scalability** — Handling flash crowds and viral content spikes.
6. **Application limitations and platform diversity** — Supporting diverse client devices, browsers, and network conditions.

---

## What are the major shifts that have impacted the evolution of the Internet ecosystem?

1. **Shift from text to multimedia** — Web content evolved from text-based pages to rich media (video, interactive apps), dramatically increasing bandwidth demands.
2. **Rise of cloud computing** — Applications moved from on-premises to cloud data centers, changing traffic patterns.
3. **Mobile revolution** — Smartphones became the primary Internet access device, introducing new constraints (variable bandwidth, battery, screen size).
4. **Content consolidation** — A small number of major content providers (Google, Netflix, Facebook, Amazon) generate the majority of Internet traffic.
5. **Flattening of the Internet hierarchy** — Large content providers connect directly to access ISPs and IXPs, bypassing traditional transit providers.
6. **Increasing importance of latency** — Users expect instant responses; even small delays impact engagement and revenue.

---

## Compare the "enter deep" and "bring home" approach to CDN server placement

### Enter Deep (Akamai's approach)

- **Deploy servers inside access ISPs** — Place servers deep within the networks of hundreds of ISPs worldwide.
- **Closer to users** — Reduces latency and traverses fewer network hops.
- **More servers, more locations** — Hundreds of thousands of servers in thousands of locations.
- **Higher management complexity** — Many small deployments to maintain.

### Bring Home (Limelight's approach)

- **Deploy fewer, larger server clusters** at key Internet exchange points and major peering locations.
- **Fewer locations** — Tens of large data centers rather than thousands of small deployments.
- **Simpler management** — Fewer sites to operate and maintain.
- **Potentially higher latency** — Servers are farther from end users compared to "enter deep."

---

## What is the role of DNS in the way a CDN operates?

DNS is the **primary mechanism** through which CDNs redirect users to the optimal edge server:

1. When a user requests `content.example.com`, the DNS resolution chain eventually reaches the **CDN's authoritative DNS server**.
2. The CDN's DNS server selects the best edge server based on the client's location (inferred from the client's DNS resolver IP), server load, health, and network conditions.
3. The DNS response contains the **IP address of the selected edge server**.
4. The client connects to that edge server and downloads the content.

DNS enables the CDN to make per-request decisions about which server should handle each client, without any client-side changes.

---

## What are the two main steps in CDN server selection?

1. **Cluster selection** — Determine which **server cluster** (geographic location / data center) should serve the client. This is typically done via DNS-based redirection.

2. **Server selection** — Within the chosen cluster, determine which **specific server** should handle the request. This is done via load balancers using methods like consistent hashing, round-robin, or least-connections.

---

## What is the simplest approach to selecting a cluster? What are the limitations?

The simplest approach is **geographically closest cluster selection** — pick the cluster nearest to the client's estimated location (based on the DNS resolver's IP address or client subnet).

**Limitations:**

- **Geographic proximity ≠ network proximity** — The closest cluster may not have the best network path (routing may be circuitous).
- **DNS resolver location ≠ client location** — Some clients use remote DNS resolvers (e.g., Google DNS 8.8.8.8), causing the CDN to select a suboptimal cluster.
- **Ignores server load** — The closest cluster might be overloaded while a slightly farther cluster has spare capacity.
- **Ignores network conditions** — Doesn't account for congestion, packet loss, or link failures on the path.

---

## What metrics could be considered when using measurements to select a cluster?

1. **Network latency (RTT)** — Measured round-trip time between the client and candidate clusters.
2. **Available bandwidth** — Throughput achievable between the client and cluster.
3. **Packet loss rate** — Quality of the network path.
4. **Server load** — CPU utilization, connection count, and available capacity at each cluster.
5. **Content availability** — Whether the requested content is cached at the cluster.
6. **Path stability** — How reliable the network path has been recently.

---

## How are the metrics for cluster selection obtained?

1. **Active probing** — The CDN sends periodic probe packets (ICMP pings, TCP SYN/ACK) to DNS resolvers or client networks to measure latency and loss.
2. **Passive measurement** — Analyze existing traffic: measure download times, connection quality, and error rates from real client sessions.
3. **Client-side measurement** — JavaScript or media player instrumentation reports actual user experience metrics back to the CDN.
4. **Network tomography** — Infer internal network conditions from end-to-end measurements.
5. **BGP data** — Use routing information to understand network topology and path characteristics.

---

## Explain the distributed system that uses a 2-layered system. What are the challenges?

The **2-layered CDN selection system** works as follows:

1. **Coarse-grained layer (DNS-based)** — DNS maps the client to a **regional cluster** based on geographic/network proximity. This decision is made at the DNS resolution time and lasts until the DNS TTL expires.

2. **Fine-grained layer (HTTP-based)** — Within the cluster, an HTTP redirect or load balancer selects the **specific server** based on real-time server load, content availability, and connection state.

**Challenges:**

- **DNS TTL caching** — DNS responses are cached, so the mapping can become stale if conditions change. Short TTLs increase DNS load; long TTLs reduce responsiveness.
- **DNS resolver granularity** — The DNS-based layer sees the resolver's IP, not the client's IP, potentially making suboptimal cluster choices.
- **Consistency** — Ensuring the two layers make compatible decisions (e.g., the DNS layer shouldn't send a client to a cluster where the fine-grained layer will redirect them elsewhere).
- **Scalability** — The fine-grained layer must handle high request rates within each cluster.

---

## What are the strategies for server selection? What are the limitations?

1. **Round-robin** — Distribute requests evenly across servers. *Limitation:* Ignores server load and content availability.

2. **Least connections** — Send requests to the server with the fewest active connections. *Limitation:* Doesn't account for request complexity or server heterogeneity.

3. **Consistent hashing** — Hash the content URL to determine the server. *Limitation:* Adding/removing servers can cause cache misses (mitigated by virtual nodes).

4. **Weighted selection** — Assign weights based on server capacity. *Limitation:* Weights may not reflect real-time conditions.

5. **Latency-based** — Select the server with the lowest measured latency to the client. *Limitation:* Requires active measurement infrastructure.

---

## What is consistent hashing? How does it work?

Consistent hashing maps both **servers and content** to positions on a circular hash ring:

1. Hash each server identifier to a point on the ring.
2. Hash each content key (URL) to a point on the ring.
3. To find which server handles a given key, walk **clockwise** from the key's position until you reach a server.
4. That server is responsible for that key.

**When a server is added:** Only the keys between the new server and its predecessor need to be remapped — all other mappings remain unchanged.

**When a server is removed:** Only that server's keys need to be redistributed to the next server clockwise.

**Virtual nodes:** Each physical server is mapped to multiple positions on the ring, improving load balance and reducing variance.

**Key property:** Adding or removing a server only affects **O(K/n)** keys (where K = total keys, n = number of servers), compared to traditional hashing where all keys may need remapping.

---

## Why would a centralized design with a single DNS server not work?

1. **Single point of failure** — If the DNS server crashes, the entire Internet's name resolution fails.
2. **Traffic volume** — Billions of DNS queries per day cannot be handled by a single server.
3. **Distant users** — Users far from the server would experience high latency for every DNS query.
4. **Maintenance** — A single database of all Internet domain names would be enormous and difficult to maintain and update.

---

## What are the main steps that a host takes to use DNS?

1. The application calls a resolver function (e.g., `getaddrinfo()`) with a hostname.
2. The **local DNS resolver** (configured on the host or via DHCP) checks its **cache** for a recent answer.
3. If not cached, the resolver queries a **root DNS server** to find the authoritative server for the top-level domain (e.g., `.com`).
4. The resolver queries the **TLD server** (e.g., `.com` server) to find the authoritative server for the specific domain (e.g., `example.com`).
5. The resolver queries the **authoritative DNS server** for the actual IP address.
6. The authoritative server returns the answer (e.g., `A` record with IP address).
7. The resolver **caches** the result (with the specified TTL) and returns it to the application.
8. The application connects to the returned IP address.

---

## What are the services offered by DNS, apart from hostname resolution?

1. **Mail server lookup (MX records)** — Maps a domain to its mail servers.
2. **Canonical name aliasing (CNAME records)** — Maps an alias to the canonical (real) hostname.
3. **Load distribution** — Multiple A records for the same hostname enable round-robin load balancing.
4. **Reverse DNS lookup (PTR records)** — Maps an IP address to a hostname.
5. **Service discovery (SRV records)** — Identifies servers for specific services (e.g., SIP, LDAP).
6. **Text records (TXT records)** — Store arbitrary text, used for SPF, DKIM, domain verification.

---

## What is the structure of the DNS hierarchy? Why does DNS use a hierarchical scheme?

**Structure (top-down):**

1. **Root servers** — 13 named root server systems (A through M), replicated via anycast to hundreds of locations worldwide.
2. **Top-Level Domain (TLD) servers** — Handle `.com`, `.org`, `.net`, `.edu`, country codes (`.uk`, `.jp`), etc.
3. **Authoritative DNS servers** — Managed by individual organizations; hold the actual DNS records for their domains.

**Why hierarchical:**

- **Scalability** — No single server needs to know all DNS records; each level handles a portion.
- **Distributed management** — Each organization manages its own authoritative servers.
- **Caching effectiveness** — Higher-level responses (root, TLD) are highly cacheable; most queries never reach the root.
- **Fault tolerance** — Failure of one server affects only a portion of the namespace.

---

## What is the difference between iterative and recursive DNS queries?

**Iterative query:**

- The client asks a DNS server, which responds with a **referral** (the address of another server to ask) if it doesn't have the answer.
- The client then queries the referred server directly.
- The client does the work of following the chain.

**Recursive query:**

- The client asks a DNS server, which **takes responsibility** for resolving the entire query.
- The server queries other servers on behalf of the client and returns the final answer.
- The client only interacts with one server (its local resolver).

In practice, the **client makes a recursive query** to its local resolver, and the local resolver uses **iterative queries** to walk the DNS hierarchy.

---

## What is DNS caching?

DNS caching stores recently resolved DNS answers at various points in the resolution chain:

- **Local resolver cache** — The client's configured DNS resolver caches answers.
- **Application/OS cache** — The operating system or browser caches DNS results.
- **Intermediate resolvers** — ISP resolvers cache answers for all their clients.

Each cached record has a **TTL (Time-To-Live)** that specifies how long it can be cached. When the TTL expires, the resolver must re-query the authoritative server.

**Benefits:** Dramatically reduces DNS query traffic and latency. Most DNS queries are served from cache.
**Risk:** Stale data if the authoritative record changes before the TTL expires.

---

## What is a DNS resource record?

A DNS resource record (RR) is a **single entry in the DNS database**. It maps a name to a value with associated type and TTL information.

**Format:** `(Name, Value, Type, TTL)`

---

## What are the most common types of resource records?

| Type | Name | Value | Purpose |
|------|------|-------|---------|
| **A** | Hostname | IPv4 address | Map hostname to IPv4 address |
| **AAAA** | Hostname | IPv6 address | Map hostname to IPv6 address |
| **CNAME** | Alias | Canonical name | Map an alias to the real hostname |
| **MX** | Domain | Mail server hostname | Identify mail server for a domain |
| **NS** | Domain | Authoritative nameserver | Identify nameserver for a domain |
| **PTR** | IP address | Hostname | Reverse DNS lookup |
| **TXT** | Domain | Arbitrary text | SPF, DKIM, domain verification |
| **SOA** | Domain | Zone authority info | Start of Authority for a DNS zone |
| **SRV** | Service | Server hostname + port | Service discovery |

---

## Describe the DNS message format

DNS messages have a standard format used for both **queries and responses**:

1. **Header (12 bytes):**
    - **ID** — 16-bit identifier matching queries to responses.
    - **Flags** — QR (query/response), Opcode, AA (authoritative answer), TC (truncated), RD (recursion desired), RA (recursion available), RCODE (response code).
    - **Count fields** — Number of entries in each subsequent section (questions, answers, authority, additional).

2. **Question section** — The query: name being looked up, query type (A, MX, etc.), and query class (usually IN for Internet).

3. **Answer section** — Resource records answering the query.

4. **Authority section** — NS records pointing to authoritative servers for the domain.

5. **Additional section** — Supplementary records (e.g., A records for nameservers listed in the authority section, providing their IP addresses).

---

## What is IP Anycast?

IP Anycast is a routing technique where **multiple servers share the same IP address**, and the network routes each client to the **nearest server** (by routing metric):

- The same IP address is announced via BGP from multiple locations worldwide.
- Routers naturally direct traffic to the closest announcement (shortest AS path, lowest IGP cost).
- Used extensively by **DNS root servers** and **CDNs** for geographic load distribution.

**Benefits:**

- Automatic geographic load balancing.
- DDoS resilience (attack traffic is distributed across locations).
- Reduced latency (clients reach the nearest instance).

**Limitations:**

- Not ideal for stateful protocols (TCP connections may break if routing changes mid-connection).
- Limited control over which server a client reaches.

---

## What is HTTP Redirection?

HTTP Redirection is a technique where a server responds to a client's HTTP request with a **redirect response** (HTTP 301 or 302) pointing to a different URL:

1. The client sends an HTTP request to the origin server (or a CDN load balancer).
2. The server evaluates the client's characteristics (IP address, geographic location, device type).
3. The server responds with a **3xx redirect** to the URL of the optimal edge server.
4. The client follows the redirect and downloads content from the specified server.

**Advantages:**

- Server has full context about the request (headers, cookies, client IP).
- More granular than DNS-based selection.

**Disadvantages:**

- **Extra round trip** — The redirect adds latency (one additional HTTP request/response cycle).
- **Visible to the user** — The URL changes in the browser.
- **Scales poorly** — Every initial request must reach the central server.

CDNs typically prefer **DNS-based redirection** for the initial connection, with HTTP redirection used as a secondary mechanism.
