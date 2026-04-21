import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertTriangle,
  ArrowRight,
  BadgeCheck,
  CheckCircle2,
  Clock3,
  Download,
  Eye,
  FileText,
  Filter,
  Globe2,
  Languages,
  LayoutDashboard,
  LocateFixed,
  Mail,
  MapPin,
  Menu,
  Phone,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  Store,
  Upload,
  Wallet,
  Wrench,
  X,
} from "lucide-react";

const CONFIG = {
  businessName: "Bid Check Pro",
  tagline: "Second-opinion contractor reviews that protect homeowners before they overpay.",
  email: "fredsaylor459@gmail.com",
  phone: "830-265-8430",
  cashAppHandle: "saylorfred",
  responsePromise: "Typically within 24 hours",
  defaultRadiusMiles: 100,
  zapierWebhookUrl: "",
  tradeDirectoryApiUrl: "",
  autoOpenPayment: false,
  adminPin: "4321",
  suppliers: {
    homeDepot: "https://www.homedepot.com/l/store-locator",
    lowes: "https://www.lowes.com/store/",
    ace: "https://www.acehardware.com/store-locator",
  },
};

const LEADS_KEY = "bcp_fullsuite_leads_v1";
const LAST_LEAD_KEY = "bcp_fullsuite_last_lead_v1";
const FILES_KEY = "bcp_fullsuite_uploads_v1";

const offers = [
  {
    id: "79",
    badge: "Fastest Entry",
    title: "Quick Bid Check",
    price: "$79",
    turnaround: "24-hour target",
    description: "For one quote, one contractor, and one clear expert opinion before you commit.",
    features: ["One quote review", "Pricing and scope red-flag scan", "Plain-English recommendation", "Best for small repairs"],
  },
  {
    id: "149",
    badge: "Best Seller",
    title: "Detailed Scope Review",
    price: "$149",
    turnaround: "Priority queue",
    description: "A stronger breakdown for homeowners comparing prices, scope gaps, and negotiation leverage.",
    featured: true,
    features: ["Line-item and scope analysis", "Questions to ask contractor", "Overcharge or under-scope flags", "Best for remodels and bigger repairs"],
  },
  {
    id: "349",
    badge: "High Stakes",
    title: "Decision Support",
    price: "$349",
    turnaround: "Highest priority",
    description: "For expensive projects where a wrong decision could cost thousands.",
    features: ["Large-project review support", "One follow-up strategy call", "Contractor question prep", "Best for roofing, foundation, insurance, full remodels"],
  },
];

const tradeCategories = [
  "General Contractor",
  "Roofing Contractor",
  "Plumber",
  "Electrician",
  "HVAC Contractor",
  "Foundation Repair",
  "Remodel Contractor",
  "Painter",
  "Flooring Contractor",
  "Drywall Contractor",
  "Water Damage Restoration",
  "Window Installer",
];

const copy = {
  en: {
    langName: "English",
    heroEyebrow: "Contractor quote protection",
    heroTitle: "Stop bad contractor bids before they drain your money.",
    heroText: "Upload the quote, explain the problem, and get a professional second opinion before you sign, pay a deposit, or get pressured into the wrong scope.",
    primaryCta: "Get My Bid Checked",
    secondaryCta: "Find Local Trades",
    startTitle: "Start your review",
    languageLabel: "Language",
    countryLabel: "Country / region",
    radiusLabel: "Search radius",
    detectLocation: "Use my location",
    successTitle: "Your request is ready",
    successText: "Your information has been saved. Complete payment below to lock in your review request.",
  },
  es: {
    langName: "Español",
    heroEyebrow: "Protección contra presupuestos",
    heroTitle: "Detén presupuestos malos antes de perder dinero.",
    heroText: "Sube el presupuesto y recibe una segunda opinión profesional antes de firmar o pagar un anticipo.",
    primaryCta: "Revisar mi presupuesto",
    secondaryCta: "Buscar contratistas",
    startTitle: "Empieza tu revisión",
    languageLabel: "Idioma",
    countryLabel: "País / región",
    radiusLabel: "Radio de búsqueda",
    detectLocation: "Usar mi ubicación",
    successTitle: "Tu solicitud está lista",
    successText: "Tu información fue guardada. Completa el pago para asegurar tu revisión.",
  },
};

function buildCashAppLink(name, amount, projectType) {
  const safeName = (name || "Client").trim();
  const safeProject = (projectType || "Project review").trim().slice(0, 60);
  const note = `${safeName} - ${safeProject} - ${CONFIG.businessName}`;
  return `https://cash.app/$${CONFIG.cashAppHandle}/${amount}?note=${encodeURIComponent(note)}`;
}

function buildMapsSearch(query, coords) {
  const suffix = coords ? `${coords.lat},${coords.lng}` : "near me";
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${query} ${suffix}`)}`;
}

function formatCoords(coords) {
  if (!coords) return "Location not set";
  return `${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)}`;
}

function getHashPage() {
  if (typeof window === "undefined") return "home";
  return window.location.hash.replace("#", "") || "home";
}

function setHashPage(page) {
  if (typeof window !== "undefined") window.location.hash = page;
}

function readStorage(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function saveStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function StatCard({ value, label }) {
  return (
    <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5 shadow-xl">
      <div className="text-3xl font-black">{value}</div>
      <div className="mt-1 text-sm text-white/60">{label}</div>
    </div>
  );
}

function Field({ label, error, children }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-slate-900">{label}</label>
      {children}
      {error ? <p className="mt-2 text-sm text-red-600">{error}</p> : null}
    </div>
  );
}

function NavButton({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-2xl px-4 py-2 text-sm font-semibold transition ${active ? "bg-white text-slate-950" : "text-white/75 hover:bg-white/10"}`}
    >
      {children}
    </button>
  );
}

export default function BidCheckProFullSuite() {
  const browserLang = typeof navigator !== "undefined" ? navigator.language.slice(0, 2).toLowerCase() : "en";
  const initialLang = copy[browserLang] ? browserLang : "en";

  const [page, setPage] = useState(getHashPage());
  const [mobileOpen, setMobileOpen] = useState(false);
  const [lang, setLang] = useState(initialLang);
  const [country, setCountry] = useState("");
  const [coords, setCoords] = useState(null);
  const [locationError, setLocationError] = useState("");
  const [radiusMiles, setRadiusMiles] = useState(CONFIG.defaultRadiusMiles);
  const [submitted, setSubmitted] = useState(false);
  const [paymentLink, setPaymentLink] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [errors, setErrors] = useState({});
  const [files, setFiles] = useState([]);
  const [leads, setLeads] = useState([]);
  const [adminPinInput, setAdminPinInput] = useState("");
  const [adminOpen, setAdminOpen] = useState(false);
  const [leadSearch, setLeadSearch] = useState("");
  const [leadFilter, setLeadFilter] = useState("all");
  const [form, setForm] = useState({
    name: "",
    contact: "",
    service: "149",
    projectType: "",
    budget: "",
    timeline: "ASAP",
    details: "",
  });

  const ui = copy[lang] || copy.en;
  const selectedOffer = useMemo(() => offers.find((item) => item.id === form.service) || offers[1], [form.service]);

  useEffect(() => {
    const onHashChange = () => setPage(getHashPage());
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  useEffect(() => {
    const savedLead = readStorage(LAST_LEAD_KEY, null);
    const savedFiles = readStorage(FILES_KEY, []);
    const storedLeads = readStorage(LEADS_KEY, []);
    if (savedLead) {
      setForm((prev) => ({ ...prev, ...savedLead }));
      setLang(savedLead.lang || initialLang);
      setCountry(savedLead.country || "");
      setCoords(savedLead.coords || null);
      setPaymentLink(savedLead.paymentLink || "");
    }
    setFiles(savedFiles);
    setLeads(storedLeads);
  }, [initialLang]);

  useEffect(() => {
    setHashPage(page);
  }, [page]);

  function updateField(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
    }
  }

  function validate() {
    const nextErrors = {};
    if (!form.name.trim()) nextErrors.name = "Enter your name.";
    if (!form.contact.trim()) nextErrors.contact = "Add your phone or email.";
    if (!form.projectType.trim()) nextErrors.projectType = "Add the project type.";
    if (!form.details.trim() || form.details.trim().length < 14) nextErrors.details = "Add more detail so the review starts with real context.";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;
    setIsSending(true);

    const payload = {
      id: `lead_${Date.now()}`,
      ...form,
      businessName: CONFIG.businessName,
      lang,
      country,
      coords,
      radiusMiles,
      paymentLink: buildCashAppLink(form.name, form.service, form.projectType || form.details),
      files,
      status: "new",
      savedAt: new Date().toISOString(),
    };

    try {
      const nextLeads = [payload, ...readStorage(LEADS_KEY, [])];
      saveStorage(LEADS_KEY, nextLeads);
      saveStorage(LAST_LEAD_KEY, payload);
      setLeads(nextLeads);
      setPaymentLink(payload.paymentLink);
      if (CONFIG.zapierWebhookUrl) {
        await fetch(CONFIG.zapierWebhookUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }
      setSubmitted(true);
      setPage("thank-you");
      if (CONFIG.autoOpenPayment) window.open(payload.paymentLink, "_blank", "noopener,noreferrer");
    } finally {
      setIsSending(false);
    }
  }

  function handleFilesSelected(e) {
    const selected = Array.from(e.target.files || []).map((file) => ({
      id: `${file.name}-${file.size}-${Date.now()}`,
      name: file.name,
      size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
      type: file.type || "File",
      uploadedAt: new Date().toISOString(),
    }));
    const next = [...files, ...selected];
    setFiles(next);
    saveStorage(FILES_KEY, next);
  }

  function detectLocation() {
    setLocationError("");
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      setLocationError("Geolocation is not supported on this device.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => setCoords({ lat: position.coords.latitude, lng: position.coords.longitude }),
      (error) => setLocationError(error.message || "Location permission denied."),
      { enableHighAccuracy: true, maximumAge: 300000, timeout: 10000 }
    );
  }

  function exportLeads() {
    const rows = [
      ["id", "name", "contact", "service", "projectType", "budget", "timeline", "status", "country", "savedAt"],
      ...leads.map((lead) => [lead.id, lead.name, lead.contact, lead.service, lead.projectType, lead.budget, lead.timeline, lead.status, lead.country, lead.savedAt]),
    ];
    const csv = rows.map((row) => row.map((cell) => `"${String(cell || "").replaceAll('"', '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "bid-check-pro-leads.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  function updateLeadStatus(id, status) {
    const next = leads.map((lead) => (lead.id === id ? { ...lead, status } : lead));
    setLeads(next);
    saveStorage(LEADS_KEY, next);
  }

  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      const matchesSearch = [lead.name, lead.contact, lead.projectType, lead.details].join(" ").toLowerCase().includes(leadSearch.toLowerCase());
      const matchesFilter = leadFilter === "all" ? true : lead.status === leadFilter;
      return matchesSearch && matchesFilter;
    });
  }, [leads, leadSearch, leadFilter]);

  const pages = [
    { id: "home", label: "Home" },
    { id: "upload", label: "Upload" },
    { id: "thank-you", label: "Thank You" },
    { id: "admin", label: "Admin" },
  ];

  const supplierCards = [
    { name: "Home Depot", href: CONFIG.suppliers.homeDepot, note: "Official store locator" },
    { name: "Lowe’s", href: CONFIG.suppliers.lowes, note: "Official store locator" },
    { name: "Ace Hardware", href: CONFIG.suppliers.ace, note: "Official store locator" },
    { name: "Lumber Yard", href: buildMapsSearch("lumber yard", coords), note: "Local map search" },
  ];

  return (
    <div className="min-h-screen bg-[#08111f] text-white">
      <div className="absolute inset-x-0 top-0 -z-10 h-[42rem] bg-[radial-gradient(circle_at_top,rgba(251,146,60,0.24),transparent_28%),radial-gradient(circle_at_30%_18%,rgba(59,130,246,0.18),transparent_30%),linear-gradient(180deg,rgba(8,17,31,0.98),rgba(8,17,31,1))]" />

      <header className="sticky top-0 z-40 border-b border-white/10 bg-slate-950/75 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4 md:px-10 lg:px-12">
          <div>
            <div className="text-[11px] uppercase tracking-[0.35em] text-orange-200/70">Full site suite</div>
            <div className="text-xl font-semibold">{CONFIG.businessName}</div>
          </div>

          <div className="hidden items-center gap-2 md:flex">
            {pages.map((item) => (
              <NavButton key={item.id} active={page === item.id} onClick={() => setPage(item.id)}>
                {item.label}
              </NavButton>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <a href={`tel:${CONFIG.phone.replace(/[^\d+]/g, "")}`} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/80 transition hover:bg-white/10">
              {CONFIG.phone}
            </a>
            <button onClick={() => setPage("home")} className="inline-flex items-center gap-2 rounded-2xl bg-orange-500 px-4 py-2 text-sm font-semibold text-white shadow-2xl transition hover:scale-[1.02]">
              {ui.primaryCta}
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          <button className="rounded-2xl border border-white/10 bg-white/5 p-2 md:hidden" onClick={() => setMobileOpen((v) => !v)}>
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
        {mobileOpen ? (
          <div className="border-t border-white/10 px-6 py-4 md:hidden">
            <div className="grid gap-2">
              {pages.map((item) => (
                <button key={item.id} onClick={() => { setPage(item.id); setMobileOpen(false); }} className="rounded-2xl bg-white/5 px-4 py-3 text-left font-semibold hover:bg-white/10">
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        ) : null}
      </header>

      <AnimatePresence mode="wait">
        {page === "home" && (
          <motion.div key="home" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -18 }}>
            <section className="mx-auto max-w-7xl px-6 pb-12 pt-12 md:px-10 lg:px-12 lg:pb-20 lg:pt-16">
              <div className="grid items-center gap-10 lg:grid-cols-[1.08fr_0.92fr]">
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full border border-orange-400/20 bg-orange-400/10 px-4 py-2 text-sm text-orange-100">
                    <ShieldCheck className="h-4 w-4" />
                    {ui.heroEyebrow}
                  </div>
                  <h1 className="mt-5 max-w-4xl text-4xl font-semibold leading-tight md:text-6xl">{ui.heroTitle}</h1>
                  <p className="mt-5 max-w-2xl text-base leading-7 text-white/70 md:text-lg">{ui.heroText}</p>
                  <div className="mt-7 flex flex-wrap gap-3">
                    <button onClick={() => setPage("upload")} className="inline-flex items-center gap-2 rounded-2xl bg-orange-500 px-5 py-3 font-semibold text-white shadow-2xl transition hover:scale-[1.02]">
                      {ui.primaryCta}
                      <ArrowRight className="h-4 w-4" />
                    </button>
                    <a href="#local-trades" className="rounded-2xl border border-white/15 bg-white/5 px-5 py-3 font-semibold text-white transition hover:bg-white/10">
                      {ui.secondaryCta}
                    </a>
                  </div>
                  <div className="mt-8 grid gap-3 sm:grid-cols-3">
                    <StatCard value="24h" label="Response target" />
                    <StatCard value="3" label="Offer tiers" />
                    <StatCard value="1" label="Fast payment path" />
                  </div>
                </div>

                <div className="rounded-[2rem] border border-white/10 bg-white/5 p-5 shadow-2xl backdrop-blur-xl">
                  <div className="rounded-[1.75rem] border border-white/10 bg-[#0b1729] p-6">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <div className="text-xs uppercase tracking-[0.3em] text-orange-200/70">Revenue system</div>
                        <div className="mt-2 text-2xl font-semibold">Professional money-first website flow</div>
                      </div>
                      <div className="rounded-2xl bg-white px-4 py-3 text-lg font-black text-slate-950">BCP</div>
                    </div>
                    <div className="mt-6 space-y-3">
                      {["Landing page for paid urgency", "Dedicated upload page", "Thank-you and payment page", "Admin lead dashboard with export"].map((item) => (
                        <div key={item} className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/80">
                          <BadgeCheck className="mt-0.5 h-4 w-4 shrink-0 text-orange-300" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="mx-auto max-w-7xl px-6 py-16 md:px-10 lg:px-12">
              <div className="max-w-2xl">
                <div className="text-sm uppercase tracking-[0.3em] text-orange-200/70">Pricing</div>
                <h2 className="mt-2 text-3xl font-semibold md:text-4xl">Pick the review level that matches the risk</h2>
              </div>
              <div className="mt-8 grid gap-6 lg:grid-cols-3">
                {offers.map((offer) => (
                  <motion.div key={offer.id} whileHover={{ y: -5 }} className={`rounded-[2rem] border p-6 shadow-2xl ${offer.featured ? "border-orange-400/40 bg-white text-slate-950" : "border-white/10 bg-white/5 text-white"}`}>
                    <div className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${offer.featured ? "bg-orange-100 text-orange-700" : "bg-white/10 text-white/75"}`}>{offer.badge}</div>
                    <h3 className="mt-4 text-2xl font-semibold">{offer.title}</h3>
                    <div className="mt-2 text-4xl font-black">{offer.price}</div>
                    <div className={`mt-1 text-sm ${offer.featured ? "text-slate-500" : "text-white/60"}`}>{offer.turnaround}</div>
                    <div className="mt-5 space-y-3">
                      {offer.features.map((feature) => (
                        <div key={feature} className="flex items-start gap-3 text-sm">
                          <BadgeCheck className={`mt-0.5 h-4 w-4 shrink-0 ${offer.featured ? "text-orange-500" : "text-orange-300"}`} />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                    <button onClick={() => { updateField("service", offer.id); setPage("upload"); }} className={`mt-6 inline-flex w-full items-center justify-center rounded-2xl px-4 py-3 text-sm font-semibold transition ${offer.featured ? "bg-slate-950 text-white hover:opacity-90" : "border border-white/15 bg-white/10 hover:bg-white/15"}`}>
                      Choose {offer.title}
                    </button>
                  </motion.div>
                ))}
              </div>
            </section>

            <section id="local-trades" className="mx-auto max-w-7xl px-6 py-16 md:px-10 lg:px-12">
              <div className="grid gap-6 lg:grid-cols-[0.92fr_1.08fr]">
                <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-2xl">
                  <h2 className="text-3xl font-semibold">Find local trades and suppliers</h2>
                  <p className="mt-4 text-white/70">Useful action layer for homeowners who want backup quotes now.</p>
                  <div className="mt-5 grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-white/85">{ui.countryLabel}</label>
                      <input value={country} onChange={(e) => setCountry(e.target.value)} className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 outline-none focus:border-orange-400" placeholder="United States, Canada, UK..." />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-white/85">{ui.radiusLabel}</label>
                      <input type="number" min="5" max="250" value={radiusMiles} onChange={(e) => setRadiusMiles(Number(e.target.value) || CONFIG.defaultRadiusMiles)} className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 outline-none focus:border-orange-400" />
                    </div>
                  </div>
                  <div className="mt-4 flex flex-wrap items-center gap-3">
                    <button onClick={detectLocation} className="inline-flex items-center gap-2 rounded-2xl bg-orange-500 px-5 py-3 font-semibold text-white shadow-xl transition hover:scale-[1.02]">
                      <LocateFixed className="h-4 w-4" />
                      {ui.detectLocation}
                    </button>
                    <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/75">
                      <MapPin className="mr-2 inline h-4 w-4 text-orange-300" />
                      {formatCoords(coords)}
                    </div>
                  </div>
                  {locationError ? <p className="mt-3 text-sm text-rose-300">{locationError}</p> : null}
                  <div className="mt-6 grid gap-3 sm:grid-cols-2">
                    {supplierCards.map((item) => (
                      <a key={item.name} href={item.href} target="_blank" rel="noopener noreferrer" className="rounded-2xl border border-white/10 bg-white/5 p-4 transition hover:border-orange-400 hover:bg-white/10">
                        <div className="flex items-center gap-3">
                          <Store className="h-5 w-5 text-orange-300" />
                          <div>
                            <div className="font-semibold">{item.name}</div>
                            <div className="text-sm text-white/55">{item.note}</div>
                          </div>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>

                <div className="rounded-[2rem] border border-white/10 bg-white p-6 text-slate-950 shadow-2xl">
                  <h3 className="text-2xl font-semibold">Trade searches</h3>
                  <div className="mt-5 grid gap-3 sm:grid-cols-2">
                    {tradeCategories.map((trade) => (
                      <a key={trade} href={buildMapsSearch(`${trade} within ${radiusMiles} miles`, coords)} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between rounded-2xl border border-slate-200 px-4 py-3 text-sm font-medium transition hover:border-orange-400 hover:bg-orange-50">
                        <span className="flex items-center gap-2">
                          <Wrench className="h-4 w-4 text-orange-500" />
                          {trade}
                        </span>
                        <ArrowRight className="h-4 w-4" />
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          </motion.div>
        )}

        {page === "upload" && (
          <motion.div key="upload" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -18 }} className="mx-auto max-w-7xl px-6 py-12 md:px-10 lg:px-12">
            <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
              <div className="rounded-[2rem] bg-white p-6 text-slate-950 shadow-2xl md:p-8">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <div className="text-sm uppercase tracking-[0.3em] text-orange-500">Upload + lead capture</div>
                    <h2 className="mt-2 text-3xl font-semibold">{ui.startTitle}</h2>
                  </div>
                  <div className="rounded-2xl bg-orange-50 px-4 py-3 text-right">
                    <div className="text-xs uppercase tracking-[0.2em] text-slate-500">Selected</div>
                    <div className="text-lg font-bold">{selectedOffer.title}</div>
                    <div className="text-sm text-slate-500">{selectedOffer.price}</div>
                  </div>
                </div>
                <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
                  <div className="grid gap-4 md:grid-cols-2">
                    <Field label="Full name" error={errors.name}>
                      <input value={form.name} onChange={(e) => updateField("name", e.target.value)} className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-orange-400" placeholder="Your name" />
                    </Field>
                    <Field label="Phone or email" error={errors.contact}>
                      <input value={form.contact} onChange={(e) => updateField("contact", e.target.value)} className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-orange-400" placeholder="Best way to reach you" />
                    </Field>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <Field label={ui.languageLabel}>
                      <div className="relative">
                        <Languages className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                        <select value={lang} onChange={(e) => setLang(e.target.value)} className="w-full rounded-2xl border border-slate-200 px-11 py-3 outline-none transition focus:border-orange-400">
                          {Object.entries(copy).map(([code, item]) => <option key={code} value={code}>{item.langName}</option>)}
                        </select>
                      </div>
                    </Field>
                    <Field label={ui.countryLabel}>
                      <input value={country} onChange={(e) => setCountry(e.target.value)} className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-orange-400" placeholder="Country / region" />
                    </Field>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <Field label="Review level">
                      <select value={form.service} onChange={(e) => updateField("service", e.target.value)} className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-orange-400">
                        {offers.map((offer) => <option key={offer.id} value={offer.id}>{offer.title} ({offer.price})</option>)}
                      </select>
                    </Field>
                    <Field label="Project type" error={errors.projectType}>
                      <input value={form.projectType} onChange={(e) => updateField("projectType", e.target.value)} className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-orange-400" placeholder="Roof, remodel, foundation..." />
                    </Field>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <Field label="Estimated budget">
                      <input value={form.budget} onChange={(e) => updateField("budget", e.target.value)} className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-orange-400" placeholder="Optional" />
                    </Field>
                    <Field label="Timeline">
                      <select value={form.timeline} onChange={(e) => updateField("timeline", e.target.value)} className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-orange-400">
                        <option>ASAP</option>
                        <option>This week</option>
                        <option>1–2 weeks</option>
                        <option>Just planning</option>
                      </select>
                    </Field>
                  </div>
                  <Field label="Project details" error={errors.details}>
                    <textarea value={form.details} onChange={(e) => updateField("details", e.target.value)} className="min-h-36 w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-orange-400" placeholder="What quote did you receive, what feels off, and what do you want checked?" />
                  </Field>
                  <div className="rounded-[1.5rem] border border-dashed border-slate-300 bg-slate-50 p-5">
                    <div className="flex items-center gap-3 text-slate-700">
                      <Upload className="h-5 w-5 text-orange-500" />
                      <div>
                        <div className="font-semibold">Upload quotes, photos, invoices, screenshots</div>
                        <div className="text-sm text-slate-500">This demo stores file names locally so the flow feels production-ready.</div>
                      </div>
                    </div>
                    <input type="file" multiple onChange={handleFilesSelected} className="mt-4 block w-full text-sm" />
                    {files.length > 0 ? (
                      <div className="mt-4 space-y-2">
                        {files.map((file) => (
                          <div key={file.id} className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm">
                            <span className="flex items-center gap-2"><FileText className="h-4 w-4 text-orange-500" />{file.name}</span>
                            <span className="text-slate-500">{file.size}</span>
                          </div>
                        ))}
                      </div>
                    ) : null}
                  </div>
                  <button type="submit" disabled={isSending} className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 py-4 font-semibold text-white transition hover:opacity-95 disabled:opacity-70">
                    {isSending ? "Preparing payment..." : `Continue with ${selectedOffer.title}`}
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </form>
              </div>

              <div className="space-y-6">
                <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-2xl">
                  <div className="text-sm uppercase tracking-[0.3em] text-orange-200/70">Why this page converts</div>
                  <div className="mt-5 space-y-3 text-sm text-white/75">
                    {["Keeps the visitor focused on one action", "Collects the project story before payment", "Lets them upload proof fast", "Moves them directly to the thank-you payment step"].map((item) => (
                      <div key={item} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">{item}</div>
                    ))}
                  </div>
                </div>
                <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-2xl">
                  <h3 className="text-2xl font-semibold">Direct contact</h3>
                  <div className="mt-4 space-y-3 text-sm text-white/75">
                    <a href={`mailto:${CONFIG.email}`} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 hover:bg-white/10"><Mail className="h-4 w-4 text-orange-300" />{CONFIG.email}</a>
                    <a href={`tel:${CONFIG.phone.replace(/[^\d+]/g, "")}`} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 hover:bg-white/10"><Phone className="h-4 w-4 text-orange-300" />{CONFIG.phone}</a>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {page === "thank-you" && (
          <motion.div key="thank-you" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -18 }} className="mx-auto max-w-5xl px-6 py-16 md:px-10 lg:px-12">
            <div className="rounded-[2rem] border border-emerald-400/20 bg-white p-8 text-slate-950 shadow-2xl md:p-10">
              <div className="flex items-start gap-4">
                <CheckCircle2 className="mt-1 h-8 w-8 text-emerald-600" />
                <div>
                  <div className="text-sm uppercase tracking-[0.3em] text-emerald-600">Thank you page</div>
                  <h2 className="mt-2 text-4xl font-semibold">{ui.successTitle}</h2>
                  <p className="mt-3 max-w-2xl text-slate-600">{submitted ? ui.successText : "Your lead is saved in the dashboard. Use the payment button below to complete checkout and lock your spot."}</p>
                </div>
              </div>
              <div className="mt-8 grid gap-4 md:grid-cols-3">
                <div className="rounded-[1.5rem] bg-slate-50 p-5"><div className="text-sm text-slate-500">Selected offer</div><div className="mt-1 text-xl font-bold">{selectedOffer.title}</div></div>
                <div className="rounded-[1.5rem] bg-slate-50 p-5"><div className="text-sm text-slate-500">Price</div><div className="mt-1 text-xl font-bold">{selectedOffer.price}</div></div>
                <div className="rounded-[1.5rem] bg-slate-50 p-5"><div className="text-sm text-slate-500">Response target</div><div className="mt-1 text-xl font-bold">{CONFIG.responsePromise}</div></div>
              </div>
              <div className="mt-8 flex flex-wrap gap-3">
                <a href={paymentLink || buildCashAppLink(form.name, form.service, form.projectType || form.details)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-2xl bg-emerald-600 px-5 py-3 font-semibold text-white shadow-xl transition hover:scale-[1.02]">
                  Pay Now via Cash App
                  <ArrowRight className="h-4 w-4" />
                </a>
                <button onClick={() => setPage("upload")} className="rounded-2xl border border-slate-300 px-5 py-3 font-semibold text-slate-700 transition hover:bg-slate-50">Edit request</button>
              </div>
            </div>
          </motion.div>
        )}

        {page === "admin" && (
          <motion.div key="admin" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -18 }} className="mx-auto max-w-7xl px-6 py-12 md:px-10 lg:px-12">
            {!adminOpen ? (
              <div className="mx-auto max-w-xl rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-2xl">
                <div className="flex items-center gap-3">
                  <LayoutDashboard className="h-6 w-6 text-orange-300" />
                  <h2 className="text-3xl font-semibold">Admin dashboard</h2>
                </div>
                <p className="mt-3 text-white/65">Simple lock screen for lead management. Change the PIN in CONFIG before launch.</p>
                <input type="password" value={adminPinInput} onChange={(e) => setAdminPinInput(e.target.value)} className="mt-5 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 outline-none focus:border-orange-400" placeholder="Enter admin PIN" />
                <button onClick={() => setAdminOpen(adminPinInput === CONFIG.adminPin)} className="mt-4 inline-flex items-center gap-2 rounded-2xl bg-orange-500 px-5 py-3 font-semibold text-white">
                  Open dashboard
                  <ArrowRight className="h-4 w-4" />
                </button>
                {adminPinInput && adminPinInput !== CONFIG.adminPin ? <p className="mt-3 text-sm text-rose-300">Wrong PIN.</p> : null}
              </div>
            ) : (
              <div className="space-y-6">
                <div className="grid gap-4 md:grid-cols-4">
                  <StatCard value={String(leads.length)} label="Total leads" />
                  <StatCard value={String(leads.filter((x) => x.status === "new").length)} label="New" />
                  <StatCard value={String(leads.filter((x) => x.status === "paid").length)} label="Paid" />
                  <StatCard value={String(leads.filter((x) => x.status === "done").length)} label="Done" />
                </div>

                <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-2xl">
                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                      <div className="text-sm uppercase tracking-[0.3em] text-orange-200/70">Lead manager</div>
                      <h3 className="mt-2 text-2xl font-semibold">Search, filter, export</h3>
                    </div>
                    <button onClick={exportLeads} className="inline-flex items-center gap-2 rounded-2xl bg-white px-4 py-3 font-semibold text-slate-950">
                      <Download className="h-4 w-4" />
                      Export CSV
                    </button>
                  </div>
                  <div className="mt-5 grid gap-4 md:grid-cols-[1fr_220px]">
                    <div className="relative">
                      <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/45" />
                      <input value={leadSearch} onChange={(e) => setLeadSearch(e.target.value)} className="w-full rounded-2xl border border-white/10 bg-white/5 px-11 py-3 outline-none focus:border-orange-400" placeholder="Search name, contact, project..." />
                    </div>
                    <div className="relative">
                      <Filter className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/45" />
                      <select value={leadFilter} onChange={(e) => setLeadFilter(e.target.value)} className="w-full rounded-2xl border border-white/10 bg-white/5 px-11 py-3 outline-none focus:border-orange-400">
                        <option value="all">All statuses</option>
                        <option value="new">New</option>
                        <option value="paid">Paid</option>
                        <option value="done">Done</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="grid gap-4">
                  {filteredLeads.length === 0 ? (
                    <div className="rounded-[2rem] border border-white/10 bg-white/5 p-8 text-white/65">No leads yet.</div>
                  ) : filteredLeads.map((lead) => (
                    <div key={lead.id} className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-2xl">
                      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <div className="text-xl font-semibold">{lead.name}</div>
                            <span className="rounded-full bg-white/10 px-3 py-1 text-xs uppercase tracking-[0.2em] text-white/70">{lead.status}</span>
                          </div>
                          <div className="mt-2 text-sm text-white/65">{lead.contact} • {lead.projectType} • {lead.country || "No region"}</div>
                          <div className="mt-2 text-sm text-white/50">Saved {new Date(lead.savedAt).toLocaleString()}</div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <a href={lead.paymentLink} target="_blank" rel="noopener noreferrer" className="rounded-2xl bg-white px-4 py-2 text-sm font-semibold text-slate-950">Open payment</a>
                          <button onClick={() => updateLeadStatus(lead.id, "paid")} className="rounded-2xl border border-white/10 px-4 py-2 text-sm font-semibold hover:bg-white/10">Mark paid</button>
                          <button onClick={() => updateLeadStatus(lead.id, "done")} className="rounded-2xl border border-white/10 px-4 py-2 text-sm font-semibold hover:bg-white/10">Mark done</button>
                        </div>
                      </div>
                      <div className="mt-5 grid gap-4 lg:grid-cols-[1fr_300px]">
                        <div className="rounded-[1.5rem] border border-white/10 bg-black/10 p-4">
                          <div className="text-sm uppercase tracking-[0.2em] text-orange-200/70">Lead details</div>
                          <div className="mt-3 grid gap-2 text-sm text-white/75">
                            <div><span className="text-white">Offer:</span> {lead.service}</div>
                            <div><span className="text-white">Budget:</span> {lead.budget || "Not provided"}</div>
                            <div><span className="text-white">Timeline:</span> {lead.timeline}</div>
                            <div><span className="text-white">Files:</span> {lead.files?.length || 0}</div>
                            <div className="pt-2 text-white/70">{lead.details}</div>
                          </div>
                        </div>
                        <div className="rounded-[1.5rem] border border-white/10 bg-black/10 p-4">
                          <div className="flex items-center gap-2 text-sm uppercase tracking-[0.2em] text-orange-200/70"><Eye className="h-4 w-4" />Uploads</div>
                          <div className="mt-3 space-y-2 text-sm text-white/75">
                            {(lead.files || []).length > 0 ? lead.files.map((file) => (
                              <div key={file.id} className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2">{file.name}</div>
                            )) : <div className="text-white/50">No files listed.</div>}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <footer className="mx-auto max-w-7xl px-6 pb-12 pt-4 text-white/60 md:px-10 lg:px-12">
        <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <div className="text-lg font-semibold text-white">{CONFIG.businessName}</div>
              <p className="mt-2 text-sm">{CONFIG.tagline}</p>
            </div>
            <div className="text-sm">
              <div className="flex items-center gap-2"><Mail className="h-4 w-4 text-orange-300" />{CONFIG.email}</div>
              <div className="mt-2 flex items-center gap-2"><Phone className="h-4 w-4 text-orange-300" />{CONFIG.phone}</div>
            </div>
            <div className="text-sm">
              <div className="flex items-center gap-2"><Globe2 className="h-4 w-4 text-orange-300" />Multi-page premium build</div>
              <div className="mt-2 flex items-center gap-2"><Clock3 className="h-4 w-4 text-orange-300" />{CONFIG.responsePromise}</div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
