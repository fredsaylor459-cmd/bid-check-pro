"use client";
import { useState } from "react";

function StatCard({ label, value, accent }) {
  return (
    <div
      className="glass"
      style={{ padding: "24px 28px", borderRadius: 16, minWidth: 140 }}
    >
      <div style={{ fontSize: 32, fontWeight: 900, color: accent || "#e8e8f0", marginBottom: 4 }}>
        {value}
      </div>
      <div style={{ fontSize: 12, color: "#444", letterSpacing: 1 }}>{label}</div>
    </div>
  );
}

export default function Admin() {
  const [password, setPassword] = useState("");
  const [authed, setAuthed] = useState(false);
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function login(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/leads", {
        headers: { Authorization: `Bearer ${password}` },
      });
      if (res.ok) {
        const data = await res.json();
        setLeads(data);
        setAuthed(true);
      } else {
        setError("Incorrect password.");
      }
    } catch {
      setError("Connection error. Try again.");
    }
    setLoading(false);
  }

  /* ─── LOGIN SCREEN ─── */
  if (!authed) {
    return (
      <main
        style={{
          background: "#06060a", minHeight: "100vh",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontFamily: "system-ui, sans-serif", padding: 24,
        }}
      >
        <div style={{ width: "100%", maxWidth: 360 }}>
          <div style={{ textAlign: "center", marginBottom: 44 }}>
            <div style={{ fontSize: 10, letterSpacing: 5, color: "#444", marginBottom: 16 }}>
              ⬡ BID CHECK PRO
            </div>
            <h1
              style={{
                fontSize: 36, fontWeight: 900,
                background: "linear-gradient(90deg, #777, #ddd, #aaa)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Admin
            </h1>
          </div>

          <div
            className="glass"
            style={{ padding: "36px 32px", borderRadius: 20 }}
          >
            <form onSubmit={login}>
              <label style={{ fontSize: 11, color: "#555", letterSpacing: 1.5, display: "block", marginBottom: 10 }}>
                PASSWORD
              </label>
              <input
                className="field"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                required
                style={{ marginBottom: 20 }}
              />
              {error && (
                <div style={{ fontSize: 13, color: "#f87171", marginBottom: 16 }}>⚠ {error}</div>
              )}
              <button
                type="submit"
                disabled={loading}
                className="btn-chrome"
                style={{ width: "100%", padding: 15, borderRadius: 10, fontSize: 15 }}
              >
                {loading ? "Signing in..." : "Sign In →"}
              </button>
            </form>
          </div>
          <div style={{ textAlign: "center", marginTop: 20, fontSize: 12, color: "#2a2a38" }}>
            Default password: admin830
          </div>
        </div>
      </main>
    );
  }

  /* ─── DASHBOARD ─── */
  const paid = leads.filter((l) => l.paid).length;
  const unpaid = leads.length - paid;
  const revenue = paid * 79;

  return (
    <main
      style={{
        background: "#06060a", minHeight: "100vh",
        fontFamily: "system-ui, sans-serif",
        padding: "40px 24px 80px",
      }}
    >
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>

        {/* Header */}
        <div style={{ marginBottom: 40 }}>
          <div style={{ fontSize: 10, letterSpacing: 5, color: "#444", marginBottom: 12 }}>
            ⬡ BID CHECK PRO
          </div>
          <h1
            style={{
              fontSize: 36, fontWeight: 900,
              background: "linear-gradient(90deg, #888, #ddd, #aaa)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              marginBottom: 32,
            }}
          >
            Leads Dashboard
          </h1>

          {/* Stats */}
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
            <StatCard label="TOTAL LEADS" value={leads.length} />
            <StatCard label="PAID" value={paid} accent="#4ade80" />
            <StatCard label="PENDING" value={unpaid} accent="#fbbf24" />
            <StatCard
              label="REVENUE"
              value={`$${revenue.toLocaleString()}`}
              accent="#e8e8f0"
            />
          </div>
        </div>

        {/* Leads list */}
        {leads.length === 0 ? (
          <div
            style={{
              background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(200,200,220,0.06)",
              borderRadius: 16, padding: "80px 40px",
              textAlign: "center", color: "#333",
            }}
          >
            No leads yet. Share your site to get started.
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {leads.map((lead) => (
              <div
                key={lead.id}
                style={{
                  background: "rgba(255,255,255,0.02)",
                  border: "1px solid rgba(200,200,220,0.07)",
                  borderRadius: 16, padding: "24px 28px",
                }}
              >
                {/* Top row */}
                <div
                  style={{
                    display: "flex", justifyContent: "space-between",
                    alignItems: "flex-start", flexWrap: "wrap", gap: 12, marginBottom: 16,
                  }}
                >
                  <div>
                    <div style={{ fontSize: 18, fontWeight: 700, color: "#e8e8f0", marginBottom: 6 }}>
                      {lead.name}
                    </div>
                    <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
                      <a
                        href={`mailto:${lead.email}`}
                        style={{ fontSize: 13, color: "#555", textDecoration: "none" }}
                      >
                        ✉ {lead.email}
                      </a>
                      {lead.phone && (
                        <a
                          href={`tel:${lead.phone}`}
                          style={{ fontSize: 13, color: "#555", textDecoration: "none" }}
                        >
                          📞 {lead.phone}
                        </a>
                      )}
                      {lead.jobType && (
                        <span style={{ fontSize: 13, color: "#444" }}>🔧 {lead.jobType}</span>
                      )}
                    </div>
                  </div>

                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 12, color: "#333", marginBottom: 8 }}>
                      {new Date(lead.date).toLocaleString()}
                    </div>
                    <div
                      style={{
                        display: "inline-block",
                        fontSize: 10, fontWeight: 700, letterSpacing: 1.5,
                        padding: "4px 12px", borderRadius: 100,
                        background: lead.paid
                          ? "rgba(50,200,100,0.08)"
                          : "rgba(200,160,50,0.08)",
                        border: `1px solid ${lead.paid ? "rgba(50,200,100,0.18)" : "rgba(200,160,50,0.18)"}`,
                        color: lead.paid ? "#4ade80" : "#fbbf24",
                      }}
                    >
                      {lead.paid ? "✓ PAID" : "PENDING"}
                    </div>
                  </div>
                </div>

                {/* Description */}
                {lead.description && (
                  <p
                    style={{
                      fontSize: 13, color: "#444", lineHeight: 1.7,
                      padding: "14px 18px",
                      background: "rgba(255,255,255,0.02)",
                      borderRadius: 10, margin: 0,
                    }}
                  >
                    {lead.description}
                  </p>
                )}

                {/* File */}
                {lead.file && (
                  <div style={{ marginTop: 10, fontSize: 12, color: "#333" }}>
                    📎 {lead.file}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
