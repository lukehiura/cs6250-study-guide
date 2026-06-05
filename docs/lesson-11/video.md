# Lesson 11: Applications (Video)

---

## Compare the bit rate for video, photos, and audio

| Media Type | Typical Bit Rate | Notes |
|-----------|-----------------|-------|
| **Audio** | 8 kbps – 320 kbps | Phone-quality (8 kbps) to high-fidelity music (320 kbps) |
| **Photos** | N/A (file-based) | A single 10 MP JPEG is ~3–5 MB; no continuous bit rate |
| **Video (SD)** | 1–5 Mbps | Standard definition video |
| **Video (HD 1080p)** | 5–20 Mbps | High definition |
| **Video (4K)** | 15–50 Mbps | Ultra-high definition |

Video consumes **orders of magnitude more bandwidth** than audio, which is why video dominates Internet traffic (Netflix, YouTube alone account for a large fraction of all Internet traffic).

---

## What are the characteristics of streaming stored video?

- **Pre-recorded content** — The entire video is available on the server before playback begins.
- **Buffering is possible** — The client can download ahead of the playback point, absorbing network variability.
- **Interactive controls** — Users can pause, rewind, fast-forward, and seek.
- **Delay-tolerant** — Initial buffering delay (a few seconds) is acceptable; jitter is absorbed by the playout buffer.
- **TCP is commonly used** — Reliability matters; lost frames cause visual artifacts. Retransmissions are acceptable because of buffering.

---

## What are the characteristics of streaming live audio and video?

- **Real-time generation** — Content is produced and consumed simultaneously.
- **Limited buffering** — Only a small buffer (seconds) is tolerable to maintain "liveness."
- **Higher delay sensitivity** — Users expect near-real-time delivery, but a few seconds of delay is acceptable (unlike conversational applications).
- **No rewind during live** — Users typically can't seek backward during live streams (though DVR functionality may be added).
- **Scalability challenges** — Many viewers simultaneously accessing the same stream (multicast or CDN-based distribution).

---

## What are the characteristics of conversational voice and video over IP?

- **Highly delay-sensitive** — End-to-end delay must be below **150 ms** for acceptable conversational quality; above **400 ms**, conversations become very difficult.
- **Tolerant of some loss** — Small amounts of packet loss (1–5%) can be concealed; retransmission is usually too slow.
- **Constant interaction** — Both parties transmit and receive simultaneously (full-duplex).
- **Jitter-sensitive** — Variation in delay must be smoothed by a playout buffer, but the buffer adds delay.
- **Low bandwidth** — Voice calls require only 8–64 kbps; video calls require 300 kbps – 5 Mbps.

---

## How does the encoding of analog audio work (in simple terms)?

1. **Sampling** — The continuous analog audio signal is measured at regular intervals (the sampling rate). By the Nyquist theorem, the sampling rate must be at least 2× the highest frequency in the signal (e.g., 8,000 Hz for telephone-quality 4 kHz audio, 44,100 Hz for CD-quality).
2. **Quantization** — Each sample value is rounded to the nearest level in a finite set of discrete levels (e.g., 256 levels for 8-bit quantization).
3. **Encoding** — Each quantized value is represented as a binary number (e.g., 8 bits per sample).

**Bit rate = sampling rate × bits per sample** (e.g., 8,000 × 8 = 64 kbps for PCM telephone audio).

---

## What are the three major categories of VoIP encoding schemes?

1. **Narrowband codecs** — Encode speech at low bit rates (8–16 kbps) with limited frequency range (300–3400 Hz). Example: G.729 (8 kbps), G.711 (64 kbps).

2. **Wideband codecs** — Encode speech at higher quality with a broader frequency range (50–7000 Hz), providing more natural-sounding audio. Example: G.722 (64 kbps), AMR-WB (6.6–23.85 kbps).

3. **Full-band/Super-wideband codecs** — Encode the full audio spectrum (up to 20 kHz), approaching music quality. Example: Opus (6–510 kbps, adaptive), AAC.

---

## What are the functions that signaling protocols are responsible for?

Signaling protocols handle:

1. **Session setup** — Establishing a call or media session between endpoints (finding the callee, negotiating parameters).
2. **Capability negotiation** — Agreeing on codecs, media types, and encoding parameters both endpoints support.
3. **Call management** — Handling hold, transfer, conference calling, and other in-call features.
4. **Session teardown** — Properly terminating the session when the call ends.

**Example:** SIP (Session Initiation Protocol) and H.323 are common VoIP signaling protocols.

---

## What are three QoS VoIP metrics?

1. **End-to-end delay (latency)** — The total time from when audio is captured at the sender to when it's played at the receiver. Must be < 150 ms for good quality, < 400 ms for acceptable quality.

2. **Jitter (delay variation)** — The variation in packet arrival times. High jitter causes gaps or distortion in audio playback even if average delay is low.

3. **Packet loss rate** — The percentage of packets that never arrive. VoIP can tolerate 1–5% loss with concealment techniques, but higher loss degrades quality significantly.

---

## What kind of delays are included in "end-to-end delay"?

1. **Encoding delay** — Time to digitize and compress the audio.
2. **Packetization delay** — Time to fill a packet with enough audio samples.
3. **Transmission delay** — Time to push the packet bits onto the link (packet size / link bandwidth).
4. **Propagation delay** — Time for the signal to travel across the physical medium (distance / speed of light).
5. **Queuing delay** — Time spent waiting in router buffers.
6. **Processing delay** — Time for routers to process the packet header and make forwarding decisions.
7. **Playout (de-jitter) buffer delay** — Time spent in the receiver's buffer to smooth out jitter.
8. **Decoding delay** — Time to decompress and convert back to audio.

---

## How does "delay jitter" occur?

Delay jitter occurs because successive packets take **different paths or experience different queuing delays** through the network:

- Packets are queued behind different amounts of traffic at each router.
- Network load varies over time, so queuing delays fluctuate.
- Some packets may be routed along different paths (in networks with multi-path routing).
- Result: packets that were sent at regular intervals arrive at irregular intervals.

Even if the average delay is acceptable, high jitter means some packets arrive too late to be played at their scheduled time.

---

## What are the mitigation techniques for delay jitter?

1. **Playout buffer (de-jitter buffer)** — The receiver buffers incoming packets and plays them out at a **fixed rate** with a **fixed delay** from the timestamp. Packets arriving early wait in the buffer; packets arriving after their playout time are discarded.

2. **Adaptive playout** — The playout delay is dynamically adjusted based on observed network conditions. During silence periods, the buffer size can be changed without audible artifacts.

3. **Timestamps** — Each packet carries a timestamp indicating when its audio was generated, allowing the receiver to reconstruct the correct playback timing.

---

## Compare the three major methods for dealing with packet loss in VoIP protocols

| Method | Mechanism | Latency Impact | Bandwidth Impact | Quality |
|--------|-----------|---------------|-----------------|---------|
| **FEC** | Send redundant data so lost packets can be reconstructed | Moderate increase (must wait for FEC data) | Significant increase (redundancy overhead) | Good recovery for isolated losses |
| **Interleaving** | Spread each audio unit across multiple packets | Significant increase (must wait for all interleaved packets) | No increase | Spreads loss impact; each loss affects multiple units slightly |
| **Error Concealment** | Receiver generates replacement audio based on context | No increase | No increase | Acceptable for short losses; degrades with longer gaps |

---

## How does FEC (Forward Error Correction) deal with packet loss in VoIP? What are the tradeoffs?

FEC sends **redundant information** alongside the original data so that lost packets can be reconstructed without retransmission:

- **Simple FEC:** For every group of n packets, send an additional XOR parity packet. If any one packet in the group is lost, it can be reconstructed from the others + the parity.
- **Piggyback FEC:** Each packet carries a **lower-quality copy** of the previous packet's audio. If a packet is lost, the lower-quality version from the next packet can substitute.

**Tradeoffs:**

- **Pro:** Can recover lost packets without retransmission delay.
- **Con:** Increases bandwidth usage (sending redundant data).
- **Con:** Increases latency (must wait for the entire FEC group before reconstructing).
- **Con:** Cannot recover from burst losses exceeding the FEC capacity.

---

## How does interleaving deal with packet loss in VoIP/streaming stored audio? What are the tradeoffs?

Interleaving **reorders audio units before packetization** so that consecutive audio units are placed in different packets:

- Instead of packet 1 containing units [1,2,3,4], the units are spread: packet 1 = [1,5,9,13], packet 2 = [2,6,10,14], etc.
- If a packet is lost, the missing units are spread across the audio timeline rather than creating one large gap.
- The loss is less noticeable because each gap is short and surrounded by valid audio.

**Tradeoffs:**

- **Pro:** No bandwidth overhead (no redundant data).
- **Pro:** Loss impact is distributed over time, reducing perceptual impact.
- **Con:** Significantly increases latency — the receiver must buffer enough packets to de-interleave (reconstruct original order).
- **Con:** Not suitable for highly interactive (conversational) applications due to added delay.

---

## How does the error concealment technique deal with packet loss in VoIP?

Error concealment is a **receiver-side technique** that generates a replacement for lost audio without any help from the sender:

1. **Repetition** — Repeat the last successfully received audio packet. Works well for short losses since adjacent audio is often similar.
2. **Interpolation** — Use audio from both before and after the gap to generate a smooth transition. Better quality but requires buffering subsequent packets.
3. **Silence substitution** — Replace the gap with silence. Simple but produces audible gaps.
4. **Pattern matching** — Use speech models to predict what the lost audio likely sounded like.

Error concealment works well for **short losses** (< 20–40 ms) but degrades rapidly with longer gaps.

---

## What developments led to the popularity of consuming media content over the Internet?

1. **Increased bandwidth** — Broadband adoption (DSL, cable, fiber) made streaming feasible.
2. **Video compression advances** — Codecs like H.264 and H.265/HEVC dramatically reduced bandwidth requirements.
3. **CDN infrastructure** — Content delivery networks placed servers close to users, reducing latency and buffering.
4. **HTTP-based streaming** — Adoption of HTTP for video delivery (using existing web infrastructure) simplified deployment.
5. **Mobile devices** — Smartphones and tablets created new consumption contexts.
6. **Business model innovation** — Subscription services (Netflix, Spotify) and ad-supported models (YouTube) made content accessible.

---

## Provide a high-level overview of adaptive video streaming

Adaptive video streaming dynamically adjusts video quality based on network conditions:

1. The video is encoded at **multiple quality levels (bitrates)** and divided into short **chunks** (2–10 seconds each).
2. A **manifest file** (MPD in DASH) lists the available bitrates and chunk URLs.
3. The client downloads chunks sequentially, choosing the **bitrate for each chunk** based on current network conditions.
4. If bandwidth is high → select higher bitrate (better quality).
5. If bandwidth drops → switch to lower bitrate (avoid buffering/stalling).
6. The client uses a **bitrate adaptation algorithm** to make these decisions based on measured throughput, buffer level, or both.

---

## (Optional) What are two ways to achieve efficient video compression?

1. **Spatial compression (Intra-frame)** — Exploit redundancy within a single frame. Adjacent pixels often have similar values; transform-based compression (like DCT in JPEG) can represent these efficiently. This is applied to I-frames.

2. **Temporal compression (Inter-frame)** — Exploit redundancy between successive frames. Much of the image stays the same between frames; only the differences (motion vectors + residuals) need to be encoded. This uses P-frames and B-frames.

---

## (Optional) What are the four steps of JPEG compression?

1. **Color space transformation** — Convert from RGB to YCbCr (luminance + chrominance). Human vision is less sensitive to chrominance, so it can be subsampled.
2. **Discrete Cosine Transform (DCT)** — Divide the image into 8×8 blocks and apply DCT to each block, converting spatial data to frequency coefficients.
3. **Quantization** — Divide frequency coefficients by a quantization matrix and round to integers. High-frequency components (less visually important) are quantized more aggressively. This is the lossy step.
4. **Entropy encoding** — Apply lossless compression (Huffman or arithmetic coding) to the quantized coefficients.

---

## (Optional) Explain video compression and temporal redundancy using I-, B-, and P-frames

- **I-frame (Intra-coded)** — A complete image compressed independently (like a JPEG). Serves as a reference point; no dependencies on other frames.
- **P-frame (Predicted)** — Encoded as the **difference from the previous I-frame or P-frame**. Contains motion vectors and residual data. Much smaller than I-frames.
- **B-frame (Bidirectional predicted)** — Encoded using references from **both a previous and a future frame**. Achieves the highest compression because it can interpolate between two reference frames. Smallest of the three types.

**Typical GOP (Group of Pictures):** I B B P B B P B B I ...

---

## (Optional) Why is video compression unable to use P-frames all the time?

1. **Error propagation** — P-frames depend on previous frames. If a frame is lost or corrupted, the error propagates through all subsequent P-frames until the next I-frame.
2. **Random access** — I-frames are needed as entry points for seeking. Without I-frames, a viewer seeking to a specific point would have to decode from the beginning.
3. **Drift** — Small quantization errors accumulate over long chains of P-frames, gradually degrading quality.
4. **Channel switching** — When changing channels or starting a new stream, the decoder needs an I-frame to begin decoding.

---

## (Optional) What is the difference between constant bitrate encoding and variable bitrate encoding (CBR vs VBR)?

**CBR (Constant Bitrate):**

- Maintains a **fixed bitrate** throughout the video.
- Simple scenes get more bits than needed (wasteful); complex scenes get fewer bits than needed (quality drops).
- Useful for **streaming over fixed-capacity channels**.

**VBR (Variable Bitrate):**

- Bitrate **varies based on content complexity**.
- Simple scenes → lower bitrate; complex scenes → higher bitrate.
- Achieves **better overall quality** at the same average bitrate.
- More efficient use of bandwidth but requires **buffering** to handle rate variations.

---

## Which protocol is preferred for video content delivery — UDP or TCP? Why?

**TCP** is preferred for modern video content delivery:

- **HTTP-based streaming** (DASH, HLS) runs over TCP.
- TCP provides **reliable delivery** — video codecs expect complete data; random missing bytes cause decoder errors.
- TCP's congestion control is **network-friendly**.
- TCP passes through **firewalls and NATs** easily (port 80/443).
- **Buffering** absorbs TCP's retransmission delays — the playout buffer hides occasional latency spikes.

UDP was used historically for real-time applications (RTP/RTSP) but modern adaptive streaming over HTTP/TCP has largely replaced it for video-on-demand and even many live streaming scenarios.

---

## What was the original vision of the application-level protocol for video content delivery, and why was HTTP chosen eventually?

**Original vision:** Dedicated streaming protocols like **RTP (Real-time Transport Protocol)** over **RTSP (Real Time Streaming Protocol)** using **UDP**. These provided fine-grained control over media delivery, including server-side rate control and transport-level optimizations for real-time media.

**Why HTTP was chosen:**

1. **Firewall/NAT traversal** — HTTP (port 80/443) passes through virtually all firewalls and NATs; RTSP/RTP often gets blocked.
2. **Existing infrastructure** — HTTP leverages the massive existing web infrastructure: CDNs, caches, load balancers, and proxies.
3. **Simplicity** — No special server software needed; standard web servers can serve video chunks.
4. **Client-side control** — HTTP puts the adaptation logic on the client, simplifying the server and improving scalability.
5. **No server-side state** — Each HTTP request is stateless, making it easier to scale with CDNs.

---

## Summarize how progressive download works

Progressive download is a simple HTTP-based video delivery method:

1. The client sends an HTTP request for the video file.
2. The server sends the video as a regular file download over HTTP/TCP.
3. The client begins **playing the video before the download completes** — as soon as enough data is buffered.
4. The video is downloaded at the **maximum available bandwidth**, regardless of playback rate.
5. If download rate > playback rate → buffer fills up (good).
6. If download rate < playback rate → playback stalls (rebuffering).

**Limitations:** No bitrate adaptation; wastes bandwidth if the user stops watching early; no quality adjustment based on network conditions.

---

## How to handle network and user device diversity?

Adaptive bitrate (ABR) streaming addresses diversity:

1. **Encode at multiple bitrates** — The same video is encoded at several quality levels (e.g., 240p, 480p, 720p, 1080p, 4K).
2. **Device-appropriate selection** — The client selects a bitrate appropriate for its screen resolution and processing capability.
3. **Network-appropriate selection** — The client measures available bandwidth and selects a bitrate that the network can sustain without rebuffering.
4. **Manifest file** — The server provides a manifest listing all available bitrates and chunk URLs; the client selects dynamically.

---

## How does the bitrate adaptation work in DASH?

**DASH (Dynamic Adaptive Streaming over HTTP):**

1. The video is divided into short **segments/chunks** (typically 2–10 seconds).
2. Each segment is encoded at **multiple bitrates** and stored on the server.
3. A **Media Presentation Description (MPD)** file describes the available representations (bitrates, resolutions, codecs) and segment URLs.
4. The client downloads the MPD, then sequentially requests segments via HTTP GET.
5. For each segment, the client's **ABR algorithm** selects the bitrate based on:
    - Estimated available bandwidth.
    - Current buffer level.
    - Other signals.
6. The client can switch bitrates at **every segment boundary**, adapting to changing conditions.

---

## What are the goals of bitrate adaptation?

1. **Maximize video quality** — Select the highest sustainable bitrate.
2. **Minimize rebuffering (stalls)** — Avoid buffer underruns that cause playback interruptions.
3. **Minimize quality oscillations** — Avoid rapid back-and-forth switching between quality levels, which is visually distracting.
4. **Minimize startup delay** — Begin playback as quickly as possible.
5. **Fairness** — When multiple streams share a bottleneck, each should get a reasonable share of bandwidth.

---

## What are the different signals that can serve as an input to a bitrate adaptation algorithm?

1. **Throughput estimates** — Measured download rate of recent segments.
2. **Buffer occupancy** — Current level of the playout buffer (in seconds of video).
3. **Segment download time** — How long the last segment took to download.
4. **Buffer filling rate** — Rate at which the buffer is growing.
5. **Buffer depletion rate** — Rate at which the buffer is being consumed (playback rate).
6. **Network-level signals** — RTT, loss rate, congestion indicators.
7. **Video content complexity** — Bitrate requirements vary by content.

---

## Explain buffer-filling rate and buffer-depletion rate calculation

**Buffer-filling rate** — The rate at which new video data enters the buffer:

$$\text{filling rate} = \text{download throughput (bits/sec)} \div \text{selected bitrate (bits/sec)} \times \text{playback rate}$$

If throughput = 10 Mbps and the selected bitrate is 5 Mbps, the buffer fills at 2× real-time.

**Buffer-depletion rate** — The rate at which video data is consumed from the buffer for playback. During normal playback, this equals the **playback rate** (typically 1× real-time).

**Buffer stable when:** filling rate ≥ depletion rate.
**Buffer draining when:** filling rate < depletion rate → risk of rebuffering.

---

## What steps does a simple rate-based adaptation algorithm perform?

1. **Download a segment** at the current selected bitrate.
2. **Measure the download throughput** (segment size / download time).
3. **Estimate available bandwidth** (e.g., use a moving average of recent throughput measurements).
4. **Select the next segment's bitrate** — choose the highest available bitrate that is **below the estimated bandwidth** (with a safety margin).
5. **Repeat** for each subsequent segment.

---

## Explain the problem of bandwidth over-estimation with rate-based adaptation

When the algorithm **overestimates** available bandwidth:

1. The client selects a **bitrate higher than what the network can support**.
2. The segment takes longer to download than the segment's playback duration.
3. The **buffer drains** during the download.
4. If this continues, the buffer empties → **rebuffering event** (playback stalls).
5. After stalling, the algorithm measures lower throughput and reduces bitrate — but the damage (user-perceived stall) is already done.

Over-estimation can occur due to:

- Network conditions changing faster than the moving average adapts.
- TCP's behavior: throughput can temporarily spike when the congestion window opens, giving a misleadingly high measurement.
- Shared bottlenecks where competing flows cause rapid bandwidth fluctuations.

---

## Explain the problem of bandwidth under-estimation with rate-based adaptation

When the algorithm **underestimates** available bandwidth:

1. The client selects a **lower bitrate than the network can support**.
2. Video quality is **unnecessarily low** — the user experiences worse quality than they could.
3. The buffer fills up excessively (since download rate >> playback rate at the low bitrate).
4. Available bandwidth is **wasted**.

Under-estimation can occur due to:

- Conservative estimation (large safety margins).
- TCP slow start effects: the first segment after a pause may download slowly, dragging down the average.
- **ON-OFF pattern**: the client finishes downloading a segment quickly, pauses (buffer is full), then starts the next download — but TCP's congestion window has shrunk during the pause, leading to a slow start and artificially low throughput measurement.
