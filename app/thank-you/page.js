"use client";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Link from "next/link";
import Nav from "../components/Nav";

const CASHAPP_TAG = process.env.NEXT_PUBLIC_CASHAPP_TAG || "$YourCashTag";

function ThankYouContent() {
  const params = useSearchParams();
  const name = params.get("name") || "there";
  const email = params.get("email") || "";
  const jobType = params.get("jobType") || "Contractor Bid";

  return (
    <main style={{ background: "#06060a", minHeight: "100vh", paddingTop: 64 }}>
      <div style={{ maxWidth: 560, margin: "0 auto", padding: "72px 24px 100px", textAlign: "center" }}>

        {/* Icon */}
        <div style={{ fontSize: 60, marginBottom: 20 }}>✅</div>

        {/* Step indicator */}
        <div style={{ fontSize: 10, letterSpacing: 5, color: "#444", marginBottom: 18 }}>
          ⬡ STEP 2 OF 2
        </div>

        {/* Heading */}
        <h1 style={{ fontSize: 44, fontWeight: 900, marginBottom: 14 }}>
          <span className="chrome">Your request is ready</span>
        </h1>
        <p style={{ fontSize: 16, color: "#4a4a62", lineHeight: 1.75, marginBottom: 44 }}>
          Hi {name} — your lead is saved in our dashboard.
          <br />
          Complete payment below to lock your spot and get your analysis.
        </p>

        {/* Order Summary */}
        <div
          className="glass"
          style={{ borderRadius: 20, padding: "36px 32px", marginBottom: 20, textAlign: "left" }}
        >
          <div style={{ fontSize: 10, letterSpacing: 4, color: "#555", marginBottom: 24 }}>
            ORDER SUMMARY
          </div>

          {[
            ["Service", "Quick Bid Check"],
            ["Job Type", jobType || "—"],
            ["Email", email || "—"],
            ["Response Target", "Typically within 24 hours"],
          ].map(([label, value]) => (
            <div
              key={label}
              style={{
                display: "flex", justifyContent: "space-between",
                padding: "12px 0", borderBottom: "1px solid rgba(200,200,220,0.06)",
                fontSize: 14,
              }}
            >
              <span style={{ color: "#555" }}>{label}</span>
              <span style={{ color: "#ccc", fontWeight: 500 }}>{value}</span>
            </div>
          ))}

          {/* Total */}
          <div
            style={{
              display: "flex", justifyContent: "space-between",
              padding: "18px 0 0", fontSize: 20, fontWeight: 800,
            }}
          >
            <span style={{ color: "#666" }}>Total Due</span>
            <span
              style={{
                background: "linear-gradient(135deg, #bbb, #fff)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              $79
            </span>
          </div>
        </div>

        {/* Cash App Pay button */}
        <a
          href={`https://cash.app/${CASHAPP_TAG}/79`}
          target="_blank"
          rel="noopener noreferrer"
          style={{ textDecoration: "none", display: "block", marginBottom: 14 }}
        >
          <button
            className="btn-chrome"
            style={{ width: "100%", padding: 22, borderRadius: 14, fontSize: 18 }}
          >
            💰 Pay $79 via Cash App
          </button>
        </a>

        <Link href="/upload" style={{ fontSize: 13, color: "#333345", textDecoration: "none" }}>
          ← Edit my request
        </Link>

        {/* Contact */}
        <div
          style={{
            marginTop: 44,
            padding: "20px 24px",
            background: "rgba(255,255,255,0.02)",
            border: "1px solid rgba(200,200,220,0.05)",
            borderRadius: 12,
            fontSize: 13, color: "#3a3a50",
          }}
        >
          Questions? Call or text{" "}
          <a href="tel:8302658430" style={{ color: "#888" }}>830-265-8430</a>
          {" "}or email{" "}
          <a href="mailto:fredsaylor459@gmail.com" style={{ color: "#888" }}>
            fredsaylor459@gmail.com
          </a>
        </div>
      </div>
    </main>
  );
}

export default function ThankYou() {
  return (
    <>
      <Nav />
      <Suspense
        fallback={
          <div style={{ background: "#06060a", minHeight: "100vh", paddingTop: 120, textAlign: "center", color: "#333" }}>
            Loading...
          </div>
        }
      >
        <ThankYouContent />
      </Suspense>
    </>
  );
}
