"use client";
import { useState } from "react";

const TIERS = [
  {
    id: "basic",
    name: "Basic",
    price: "$79",
    featured: false,
    desc: "Best for single trade jobs under $5,000",
    features: [
      "Bid price vs. local market rates",
      "Fair price range for your job",
      "Top 3 red flags in your quote",
      "Negotiation starting point",
      "PDF report in 24 hours",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    price: "$149",
    featured: true,
    desc: "Full analysis + contractor background check",
    features: [
      "Everything in Basic",
      "Contractor license verification",
      "BBB + review score check",
      "3 alternative contractor suggestions",
      "Line-item quote breakdown",
      "Priority 12-hour turnaround",
    ],
  },
  {
    id: "premium",
    name: "Premium",
    price: "$349",
    featured: false,
    desc: "Full service for large jobs over $10K",
    features: [
      "Everything in Pro",
      "Custom negotiation script",
      "2 alternative quotes sourced",
      "30-min advisor call",
      "Contract clause review",
      "6-hour priority turnaround",
    ],
  },
];

export default function Home() {
  const [loading, setLoading] = useState(null);
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");

  async function checkout(tierId) {
    setLoading(tierId);
    setError("");
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tier: tierId, customerEmail: email || undefined }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setError("Something went wrong. Please try again.");
      }
    } catch (e) {
      setError("Connection error. Please try again.");
    }
    setLoading(null);
  }

  return (
    <main style={{ background: "#0a0a0f", minHeight: "100vh", fontFamily: "system-ui, sans-serif", color: "#fff", padding: "0 16px 60px" }}>
      {/* Hero */}
      <div style={{ textAlign: "center", padding: "60px 0 40px" }}>
        <div style={{ color: "#FFD700", fontSize: 12, letterSpacing: 4, marginBottom: 16 }}>⚡ BID CHECK PRO</div>
        <h1 style={{ fontSize: 48, fontWeight: 900, marginBottom: 16, lineHeight: 1.1 }}>
          Don't sign that contractor<br />
          <span style={{ color: "#FFD700" }}>bid yet.</span>
        </h1>
        <p style={{ color: "#888", fontSize: 16, maxWidth: 480, margin: "0 auto 24px" }}>
          We check your quote against real market rates and tell you exactly what's fair — before you overpay.
        </p>
        {/* Optional email pre-fill for Stripe */}
        <input
          type="email"
          placeholder="Your email (optional — for your receipt)"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{
            background: "#111118",
            border: "1px solid #1e1e2e",
            borderRadius: 8,
            color: "#fff",
            fontSize: 14,
            padding: "10px 16px",
            width: "100%",
            maxWidth: 340,
            outline: "none",
          }}
        />
      </div>

      {/* Error banner */}
      {error && (
        <div style={{ background: "#2a1010", border: "1px solid #f87171", borderRadius: 8, padding: "12px 16px", maxWidth: 800, margin: "0 auto 20px", color: "#f87171", fontSize: 14 }}>
          ⚠ {error}
        </div>
      )}

      {/* Pricing cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 20, maxWidth: 900, margin: "0 auto" }}>
        {TIERS.map((tier) => (
          <div
            key={tier.id}
            style={{
              background: tier.featured ? "#13100a" : "#111118",
              border: `1px solid ${tier.featured ? "#FFD700" : "#1e1e2e"}`,
              borderRadius: 16,
              padding: "32px 24px",
              display: "flex",
              flexDirection: "column",
              position: "relative",
            }}
          >
            {tier.featured && (
              <div style={{ position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)", background: "#FFD700", color: "#0a0a0f", fontSize: 10, fontWeight: 700, padding: "4px 14px", borderRadius: 20, letterSpacing: 2, whiteSpace: "nowrap" }}>
                MOST POPULAR
              </div>
            )}
            <div style={{ fontSize: 11, color: tier.featured ? "#FFD700" : "#666", letterSpacing: 3, marginBottom: 8 }}>
              {tier.name.toUpperCase()}
            </div>
            <div style={{ fontSize: 52, fontWeight: 900, marginBottom: 4 }}>{tier.price}</div>
            <div style={{ fontSize: 13, color: "#666", marginBottom: 24 }}>{tier.desc}</div>
            <ul style={{ listStyle: "none", padding: 0, margin: "0 0 32px", flex: 1 }}>
              {tier.features.map((f) => (
                <li key={f} style={{ fontSize: 14, color: "#aaa", padding: "8px 0", borderBottom: "1px solid #1a1a28", display: "flex", gap: 10 }}>
                  <span style={{ color: tier.featured ? "#FFD700" : "#34d399" }}>✓</span> {f}
                </li>
              ))}
            </ul>
            <button
              onClick={() => checkout(tier.id)}
              disabled={!!loading}
              style={{
                width: "100%",
                padding: 16,
                borderRadius: 10,
                border: "none",
                background: tier.featured ? "#FFD700" : "#1e1e2e",
                color: tier.featured ? "#0a0a0f" : "#fff",
                fontSize: 15,
                fontWeight: 700,
                cursor: loading ? "not-allowed" : "pointer",
                opacity: loading && loading !== tier.id ? 0.5 : 1,
              }}
            >
              {loading === tier.id ? "Opening checkout..." : `Get ${tier.name} Report →`}
            </button>
          </div>
        ))}
      </div>

      {/* Footer trust line */}
      <div style={{ textAlign: "center", marginTop: 40, color: "#444", fontSize: 13 }}>
        🔒 Secure checkout via Stripe · Results in 24 hours · Money-back guarantee
      </div>
    </main>
  );
}
