import Link from "next/link";

export default function Nav() {
  return (
    <nav
      style={{
        position: "fixed",
        top: 0, left: 0, right: 0,
        zIndex: 100,
        height: 64,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 28px",
        background: "rgba(6, 6, 10, 0.88)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        borderBottom: "1px solid rgba(200, 200, 220, 0.07)",
      }}
    >
      {/* Logo */}
      <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 10 }}>
        <div
          style={{
            width: 34, height: 34, borderRadius: 8,
            background: "linear-gradient(135deg, #666, #ccc 40%, #888)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 17,
            boxShadow: "0 2px 10px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.3)",
          }}
        >
          ⬡
        </div>
        <span
          style={{
            fontWeight: 800, fontSize: 13, letterSpacing: 2.5,
            background: "linear-gradient(90deg, #888, #d8d8d8, #aaa, #eeeeee, #999)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          BID CHECK PRO
        </span>
      </Link>

      {/* Right side */}
      <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
        <a href="tel:8302658430" className="nav-phone">
          📞 830-265-8430
        </a>
        <Link href="/upload" style={{ textDecoration: "none" }}>
          <button className="btn-chrome" style={{ padding: "9px 20px", borderRadius: 8, fontSize: 13 }}>
            Get My Bid Checked
          </button>
        </Link>
      </div>
    </nav>
  );
}
