"use client";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

const TIER_TURNAROUND = {
  basic: "24 hours",
  pro: "12 hours",
  premium: "6 hours",
};

function SuccessContent() {
  const params = useSearchParams();
  const tier = params.get("tier") || "basic";
  const turnaround = TIER_TURNAROUND[tier] || "24 hours";
  const tierLabel = tier.charAt(0).toUpperCase() + tier.slice(1);

  return (
    <div>
      <div style={{ fontSize: 72, marginBottom: 16 }}>✅</div>
      <h1 style={{ fontSize: 40, fontWeight: 900, color: "#FFD700", marginBottom: 12 }}>Payment Confirmed!</h1>
      <p style={{ color: "#888", fontSize: 16, maxWidth: 400, margin: "0 auto 12px", lineHeight: 1.6 }}>
        Your <strong style={{ color: "#fff" }}>{tierLabel} Report</strong> is being prepared. You'll receive your analysis within{" "}
        <strong style={{ color: "#FFD700" }}>{turnaround}</strong> at the email you provided.
      </p>
      <p style={{ color: "#555", fontSize: 14 }}>
        Questions? Email <span style={{ color: "#FFD700" }}>support@bidcheckpro.com</span>
      </p>
    </div>
  );
}

export default function Success() {
  return (
    <main style={{ background: "#0a0a0f", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "system-ui, sans-serif", color: "#fff", textAlign: "center", padding: 24 }}>
      <Suspense fallback={<div style={{ color: "#888" }}>Loading...</div>}>
        <SuccessContent />
      </Suspense>
    </main>
  );
}
