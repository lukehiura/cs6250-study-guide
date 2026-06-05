---
tags:
  - lesson-11
  - video-streaming-voip
  - quick-study
search:
  boost: 2
---

# Lesson 11: Quick Study Guide — Video Streaming and VoIP

Exam-first review. Need simpler explanations first? Use the [Plain-language guide](plain-language.md). Full detail is in the [Lesson 11 guide](video.md). Practice with the [Quiz](quiz.md).

---

## 1. Big picture

- Media traffic classes have different tolerances: stored, live, conversational.
- Voice/video quality depends on delay, jitter, and loss, not just throughput.
- Modern Internet video delivery is mainly HTTP/TCP-based adaptive streaming (DASH/HLS-style).
- ABR algorithms trade off quality, rebuffering risk, and stability.

!!! tip "Memory aid"
    **S-L-C:** Stored = smooth, Live = fresh, Conversational = immediate.

---

## 2. Media type and bitrate comparison

| Media | Typical bit rate | Notes |
|---|---|---|
| Voice (telephony) | ~8-64 kbps | Codec dependent |
| Music/high-fidelity audio | 128-320 kbps (compressed) | Higher quality audio |
| SD video | ~1-5 Mbps | Baseline streaming |
| HD video (1080p) | ~5-20 Mbps | Mainstream streaming |
| 4K video | ~15-50 Mbps | Bandwidth intensive |

---

## 3. Application classes and constraints

| Class | User expectation | Retransmission tolerance |
|---|---|---|
| Stored streaming | Minimal stalls, quality consistency | Moderate (buffer can hide delay) |
| Live streaming | Reasonable liveness + continuity | Limited |
| Conversational VoIP/video | Natural dialogue timing | Very low (late packets are useless) |

---

## 4. VoIP QoS metrics and delay components

### Core metrics

- **End-to-end delay**
- **Jitter**
- **Packet loss**

### Delay budget components

| Component | Description |
|---|---|
| Encoding | Capture/compression time |
| Packetization | Time to fill packet payload |
| Transmission | Serialization onto link |
| Propagation | Physical travel time |
| Queueing/processing | Router waiting + handling |
| Playout + decode | Receiver smoothing and rendering |

!!! warning "Exam point"
    For conversational media, a packet that arrives after playout time is effectively lost.

---

## 5. Loss mitigation methods

| Method | Latency impact | Bandwidth impact | Best use |
|---|---|---|---|
| FEC | Medium | High | Isolated losses, no retransmit |
| Interleaving | High | Low | Spread burst-loss damage |
| Error concealment | Low | Low | Short gaps at receiver |

---

## 6. Adaptive video streaming (DASH)

1. Pre-encode multiple bitrate representations.
2. Segment each representation into short chunks.
3. Publish MPD manifest with available options.
4. Client estimates network/buffer state.
5. Choose next segment bitrate adaptively.

**ABR inputs:** throughput estimate, buffer occupancy, recent download times, network hints.

---

## 7. Rate-based adaptation pitfalls

| Error | Effect |
|---|---|
| Over-estimation | Bitrate too high -> buffer drains -> stall |
| Under-estimation | Bitrate too low -> poor quality, unused capacity |

ON-OFF download patterns can bias throughput estimates by shrinking TCP behavior between requests.

---

## 8. Why HTTP/TCP for mainstream video

- Better deployability through firewalls/NAT.
- Reuses existing web/CDN ecosystem.
- Stateless request model scales well.
- Reliability complements buffered playback.

---

## 9. High-yield exam Q&A

### What distinguishes stored, live, and conversational media?
Stored tolerates startup delay, live prioritizes freshness, conversational prioritizes minimal delay.

### Name three core VoIP QoS metrics.
Delay, jitter, and packet loss.

### Why is jitter harmful even when average delay is fine?
Irregular arrivals cause playout gaps unless buffered; extra buffering adds delay.

### What does a playout buffer do?
It smooths packet timing by delaying playback and discarding late packets.

### Compare FEC and concealment in one line.
FEC spends sender bandwidth; concealment spends receiver inference quality.

### Why can interleaving hurt conversational quality?
It increases buffering delay, which is costly for two-way interaction.

### What is DASH?
Dynamic Adaptive Streaming over HTTP: per-segment bitrate selection using a manifest.

### What are adaptation goals?
Maximize quality, avoid rebuffering, reduce oscillations, keep startup delay low.

### Why did HTTP beat RTP/RTSP in deployment?
Operational compatibility with existing web infrastructure and middleboxes.

### What causes rate-based ABR over-estimation?
Rapidly changing bandwidth and optimistic throughput sampling.

---

## 10. Quick memory sheet

| Topic | Memory aid |
|---|---|
| Media classes | **Stored smooths, live tracks now, calls need immediacy** |
| QoS triad | **Delay-Jitter-Loss** |
| Jitter handling | **Buffer early, drop late** |
| ABR loop | **Measure -> choose -> download -> repeat** |
| Delivery stack | **CDN + HTTP/TCP + segmented bitrate ladder** |

