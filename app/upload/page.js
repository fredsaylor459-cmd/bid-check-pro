"use client";
import { useState } from "react";
import Nav from "../components/Nav";

const JOB_TYPES = [
  "Roofing",
  "HVAC / Air Conditioning",
  "Plumbing",
  "Electrical",
  "Flooring",
  "Kitchen Remodel",
  "Bathroom Remodel",
  "Painting",
  "Landscaping / Lawn",
  "Foundation / Structural",
  "General Contractor",
  "Other",
];

export default function Upload() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    jobType: "",
    description: "",
  });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function set(key) {
    return (e) => setForm((f) => ({ ...f, [key]: e.target.value }));
  }

  async function submit(e) {
    e.preventDefault();
    if (!form.name || !form.email || !form.description) {
      setError("Please fill in your name, email, and job description.");
      return;
    }
    setLoading(true);
    setError("");

    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, v));
    if (file) fd.append("file", file);

    try {
      const res = await fetch("/api/submit", { method: "POST", body: fd });
      const data = await res.json();
      if (data.success) {
        window.location.href = `/thank-you?name=${encodeURIComponent(form.name)}&email=${encodeURIComponent(form.email)}&jobType=${encodeURIComponent(form.jobType)}`;
      } else {
        setError(data.error || "Something went wrong. Please try again.");
      }
    } catch {
      setError("Connection error. Please try again.");
    }
    setLoading(false);
  }

  return (
    <>
      <Nav />
      <main style={{ background: "#06060a", minHeight: "100vh", paddingTop: 64 }}>
        <div style={{ maxWidth: 640, margin: "0 auto", padding: "64px 24px 100px" }}>

          {/* Header */}
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <div style={{ fontSize: 10, letterSpacing: 5, color: "#444", marginBottom: 18 }}>
              ⬡ STEP 1 OF 2
            </div>
            <h1 style={{ fontSize: 42, fontWeight: 900, marginBottom: 14 }}>
              <span className="chrome">Submit Your Bid</span>
            </h1>
            <p style={{ fontSize: 15, color: "#4a4a62", lineHeight: 1.7, maxWidth: 440, margin: "0 auto" }}>
              Tell us about your contractor quote. We&apos;ll analyze it and get back
              to you within 24 hours.
            </p>
          </div>

          {/* Form card */}
          <div className="glass" style={{ padding: "44px 40px", borderRadius: 22 }}>
            <form onSubmit={submit}>

              {/* Name + Email row */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
                <div>
                  <label style={{ fontSize: 11, color: "#555", letterSpacing: 1.5, display: "block", marginBottom: 8 }}>
                    YOUR NAME *
                  </label>
                  <input
                    className="field"
                    value={form.name}
                    onChange={set("name")}
                    placeholder="John Smith"
                    required
                  />
                </div>
                <div>
                  <label style={{ fontSize: 11, color: "#555", letterSpacing: 1.5, display: "block", marginBottom: 8 }}>
                    EMAIL *
                  </label>
                  <input
                    className="field"
                    type="email"
                    value={form.email}
                    onChange={set("email")}
                    placeholder="you@email.com"
                    required
                  />
                </div>
              </div>

              {/* Phone + Job Type row */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
                <div>
                  <label style={{ fontSize: 11, color: "#555", letterSpacing: 1.5, display: "block", marginBottom: 8 }}>
                    PHONE
                  </label>
                  <input
                    className="field"
                    type="tel"
                    value={form.phone}
                    onChange={set("phone")}
                    placeholder="(830) 000-0000"
                  />
                </div>
                <div>
                  <label style={{ fontSize: 11, color: "#555", letterSpacing: 1.5, display: "block", marginBottom: 8 }}>
                    JOB TYPE
                  </label>
                  <select className="field" value={form.jobType} onChange={set("jobType")}>
                    <option value="">Select type...</option>
                    {JOB_TYPES.map((j) => (
                      <option key={j} value={j}>{j}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Description */}
              <div style={{ marginBottom: 16 }}>
                <label style={{ fontSize: 11, color: "#555", letterSpacing: 1.5, display: "block", marginBottom: 8 }}>
                  QUOTE DETAILS *
                </label>
                <textarea
                  className="field"
                  rows={5}
                  value={form.description}
                  onChange={set("description")}
                  placeholder="Describe the job and what the contractor quoted. Include line items, total price, timeline, and anything that seems off."
                  required
                  style={{ resize: "vertical" }}
                />
              </div>

              {/* File upload */}
              <div style={{ marginBottom: 36 }}>
                <label style={{ fontSize: 11, color: "#555", letterSpacing: 1.5, display: "block", marginBottom: 8 }}>
                  ATTACH BID / PHOTO (optional)
                </label>
                <label
                  htmlFor="file-input"
                  style={{
                    display: "block",
                    border: "2px dashed rgba(200,200,220,0.13)",
                    borderRadius: 12, padding: "28px 20px",
                    textAlign: "center", cursor: "pointer",
                    background: file ? "rgba(255,255,255,0.03)" : "transparent",
                    transition: "all 0.2s",
                  }}
                >
                  <input
                    id="file-input"
                    type="file"
                    accept="image/*,.pdf"
                    onChange={(e) => setFile(e.target.files[0])}
                    style={{ display: "none" }}
                  />
                  {file ? (
                    <span style={{ fontSize: 14, color: "#aaa" }}>📎 {file.name}</span>
                  ) : (
                    <>
                      <div style={{ fontSize: 28, marginBottom: 10 }}>📸</div>
                      <div style={{ fontSize: 13, color: "#3a3a52" }}>
                        Click to attach a photo or PDF of your bid
                      </div>
                    </>
                  )}
                </label>
              </div>

              {/* Error banner */}
              {error && (
                <div
                  style={{
                    background: "rgba(200,50,50,0.08)",
                    border: "1px solid rgba(200,100,100,0.18)",
                    borderRadius: 10, padding: "12px 16px", marginBottom: 20,
                    fontSize: 14, color: "#f87171",
                  }}
                >
                  ⚠ {error}
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="btn-chrome"
                style={{ width: "100%", padding: 20, borderRadius: 12, fontSize: 16 }}
              >
                {loading ? "Submitting..." : "Submit My Bid for Review →"}
              </button>

              <div style={{ textAlign: "center", marginTop: 16, fontSize: 12, color: "#2a2a3a" }}>
                🔒 Your info is private · We never contact your contractor
              </div>
            </form>
          </div>
        </div>
      </main>
    </>
  );
}
