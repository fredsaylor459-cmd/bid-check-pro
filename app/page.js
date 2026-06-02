import Link from "next/link";
import Nav from "./components/Nav";

const STEPS = [
  {
    n: "01",
    title: "Submit Your Quote",
    desc: "Upload your contractor bid or describe the job. Takes under 2 minutes.",
    icon: "📋",
  },
  {
    n: "02",
    title: "We Analyze It",
    desc: "Our experts compare your quote against real local market rates and flag every red flag.",
    icon: "🔍",
  },
  {
    n: "03",
    title: "Get Your Report",
    desc: "Receive a full analysis within 24 hours — with negotiation tips and a fair price range.",
    icon: "📄",
  },
];

const FEATURES = [
  "Bid price vs. local market rates",
  "Fair price range for your job",
  "Top red flags in your quote",
  "Negotiation starting point",
  "Full PDF report delivered",
];

export default function Home() {
  return (
    <>
      <Nav />
      <main style={{ background: "#06060a", minHeight: "100vh", paddingTop: 64 }}>

        {/* ─── HERO ─── */}
        <section
          className="bg-grid"
          style={{ padding: "110px 24px 90px", textAlign: "center" }}
        >
          <div style={{ maxWidth: 780, margin: "0 auto" }}>
            {/* Badge */}
            <div
              style={{
                display: "inline-flex", alignItems: "center",
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(200,200,220,0.09)",
                borderRadius: 100, padding: "6px 20px", marginBottom: 36,
              }}
            >
              <span style={{ fontSize: 10, letterSpacing: 4, color: "#666" }}>
                ⚡ PROFESSIONAL BID ANALYSIS
              </span>
            </div>

            {/* Headline */}
            <h1
              style={{
                fontSize: "clamp(44px, 7.5vw, 84px)",
                fontWeight: 900, lineHeight: 1.04, marginBottom: 24,
              }}
            >
              <span className="chrome">Don&apos;t sign that</span>
              <br />
              <span style={{ color: "#e8e8f0" }}>contractor bid yet.</span>
            </h1>

            <p
              style={{
                fontSize: 18, color: "#4a4a62",
                maxWidth: 500, margin: "0 auto 52px", lineHeight: 1.75,
              }}
            >
              Second-opinion contractor reviews that protect homeowners
              before they overpay.
            </p>

            {/* CTAs */}
            <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
              <Link href="/upload" style={{ textDecoration: "none" }}>
                <button
                  className="btn-chrome"
                  style={{ padding: "18px 48px", borderRadius: 12, fontSize: 16 }}
                >
                  Get My Bid Checked →
                </button>
              </Link>
              <a href="tel:8302658430" style={{ textDecoration: "none" }}>
                <button
                  className="btn-ghost"
                  style={{ padding: "18px 32px", borderRadius: 12, fontSize: 16 }}
                >
                  📞 Call 830-265-8430
                </button>
              </a>
            </div>

            {/* Trust line */}
            <div
              style={{
                marginTop: 48, display: "flex",
                gap: 32, justifyContent: "center", flexWrap: "wrap",
              }}
            >
              {[
                "✓ Report in 24 hours",
                "✓ Money-back guarantee",
                "✓ We never contact your contractor",
              ].map((t) => (
                <span key={t} style={{ fontSize: 13, color: "#333345" }}>{t}</span>
              ))}
            </div>
          </div>
        </section>

        {/* ─── HOW IT WORKS ─── */}
        <section style={{ maxWidth: 1080, margin: "0 auto", padding: "80px 24px" }}>
          <div style={{ textAlign: "center", marginBottom: 60 }}>
            <h2 style={{ fontSize: 40, fontWeight: 800, marginBottom: 12 }}>
              <span className="chrome">How It Works</span>
            </h2>
            <p style={{ color: "#4a4a62", fontSize: 16 }}>Simple. Fast. Protecting your wallet.</p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: 24,
            }}
          >
            {STEPS.map((s) => (
              <div
                key={s.n}
                className="glass"
                style={{ padding: "36px 30px", borderRadius: 18 }}
              >
                <div style={{ fontSize: 32, marginBottom: 20 }}>{s.icon}</div>
                <div
                  style={{
                    fontSize: 10, fontWeight: 700, letterSpacing: 3, marginBottom: 14,
                    background: "linear-gradient(90deg, #666, #bbb)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  STEP {s.n}
                </div>
                <h3 style={{ fontSize: 20, fontWeight: 700, color: "#e8e8f0", marginBottom: 12 }}>
                  {s.title}
                </h3>
                <p style={{ fontSize: 14, color: "#4a4a62", lineHeight: 1.75 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ─── PRICING ─── */}
        <section style={{ maxWidth: 480, margin: "0 auto", padding: "40px 24px 100px", textAlign: "center" }}>
          <h2 style={{ fontSize: 38, fontWeight: 800, marginBottom: 44 }}>
            <span className="chrome">Simple Pricing</span>
          </h2>

          <div
            className="glass"
            style={{ padding: "52px 40px", borderRadius: 22, position: "relative", overflow: "hidden" }}
          >
            {/* Top gloss highlight */}
            <div
              style={{
                position: "absolute", top: 0, left: 0, right: 0, height: "45%",
                background: "linear-gradient(180deg, rgba(255,255,255,0.04) 0%, transparent 100%)",
                pointerEvents: "none",
              }}
            />

            <div style={{ fontSize: 10, letterSpacing: 5, color: "#555", marginBottom: 20 }}>
              QUICK BID CHECK
            </div>

            {/* Price */}
            <div
              style={{
                fontSize: 80, fontWeight: 900, lineHeight: 1,
                background: "linear-gradient(180deg, #fff 0%, #888 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                marginBottom: 8,
              }}
            >
              $79
            </div>
            <div style={{ fontSize: 14, color: "#4a4a62", marginBottom: 40 }}>
              Typically within 24 hours
            </div>

            {/* Feature list */}
            <ul style={{ listStyle: "none", padding: 0, marginBottom: 44, textAlign: "left" }}>
              {FEATURES.map((f) => (
                <li
                  key={f}
                  style={{
                    display: "flex", gap: 14, alignItems: "flex-start",
                    padding: "11px 0",
                    borderBottom: "1px solid rgba(200,200,220,0.06)",
                    fontSize: 14, color: "#aaa",
                  }}
                >
                  <span
                    style={{
                      flexShrink: 0,
                      background: "linear-gradient(135deg, #777, #ccc)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                      fontWeight: 700,
                    }}
                  >
                    ✓
                  </span>
                  {f}
                </li>
              ))}
            </ul>

            <Link href="/upload" style={{ textDecoration: "none", display: "block" }}>
              <button
                className="btn-chrome"
                style={{ width: "100%", padding: 20, borderRadius: 12, fontSize: 17 }}
              >
                Get My Bid Checked →
              </button>
            </Link>
          </div>
        </section>

        {/* ─── FOOTER ─── */}
        <footer
          style={{
            borderTop: "1px solid rgba(200,200,220,0.06)",
            padding: "44px 24px",
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontSize: 11, fontWeight: 700, letterSpacing: 3,
              color: "#333", marginBottom: 16,
            }}
          >
            BID CHECK PRO
          </div>
          <div style={{ display: "flex", gap: 28, justifyContent: "center", flexWrap: "wrap", marginBottom: 20 }}>
            <a
              href="mailto:fredsaylor459@gmail.com"
              style={{ fontSize: 13, color: "#3a3a50", textDecoration: "none" }}
            >
              fredsaylor459@gmail.com
            </a>
            <a
              href="tel:8302658430"
              style={{ fontSize: 13, color: "#3a3a50", textDecoration: "none" }}
            >
              830-265-8430
            </a>
          </div>
          <div style={{ fontSize: 12, color: "#252535" }}>
            © {new Date().getFullYear()} Bid Check Pro · Protecting homeowners before they overpay
          </div>
        </footer>
      </main>
    </>
  );
}
