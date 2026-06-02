import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import Anthropic from "@anthropic-ai/sdk";
import { Resend } from "resend";

// ─── AI Bid Analysis ───────────────────────────────────────────────────────────
async function analyzeBid(name, jobType, description) {
  try {
    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    const msg = await client.messages.create({
      model: "claude-3-haiku-20240307",
      max_tokens: 1024,
      messages: [
        {
          role: "user",
          content: `You are a professional contractor bid analyst helping homeowners avoid overpaying.

Analyze this contractor bid and provide a clear, friendly report.

Customer: ${name}
Job Type: ${jobType || "General contractor work"}
Quote Details: ${description}

Write a professional report with these sections:
1. 💰 PRICE VERDICT — Is this fair, high, or low? Give a fair price range estimate.
2. 🚩 RED FLAGS — List up to 3 specific concerns with this quote (or say "None detected" if it looks clean).
3. 🤝 NEGOTIATION TIPS — 3 specific things they should ask or negotiate on.
4. ✅ BOTTOM LINE — One sentence summary of what they should do.

Keep it friendly, specific, and actionable. No fluff. This person is about to sign a contract.`,
        },
      ],
    });
    return msg.content[0].text;
  } catch (err) {
    console.error("AI analysis error:", err);
    return null;
  }
}

// ─── Email Report to Customer ─────────────────────────────────────────────────
async function emailCustomer(name, email, jobType, analysis) {
  if (!process.env.RESEND_API_KEY || !email) return;
  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const analysisHtml = analysis
      ? analysis.replace(/\n/g, "<br/>")
      : "Your analysis is being prepared and will arrive shortly.";

    await resend.emails.send({
      from: "Bid Check Pro <onboarding@resend.dev>",
      to: email,
      subject: `Your Bid Analysis Report — ${jobType || "Contractor Quote"}`,
      html: `
        <div style="background:#06060a;color:#e8e8f0;font-family:system-ui,sans-serif;padding:40px;max-width:600px;margin:0 auto">
          <div style="text-align:center;margin-bottom:32px">
            <div style="font-size:11px;letter-spacing:4px;color:#888;margin-bottom:8px">⬡ BID CHECK PRO</div>
            <h1 style="font-size:28px;font-weight:900;color:#fff;margin:0">Your Analysis is Ready</h1>
          </div>
          <div style="background:rgba(255,255,255,0.05);border:1px solid rgba(200,200,220,0.12);border-radius:16px;padding:32px;margin-bottom:24px">
            <p style="color:#888;font-size:14px;margin:0 0 20px">Hi ${name},</p>
            <p style="color:#888;font-size:14px;margin:0 0 24px">Here's your professional analysis for your <strong style="color:#e8e8f0">${jobType || "contractor"}</strong> quote:</p>
            <div style="background:rgba(0,0,0,0.3);border-radius:12px;padding:24px;font-size:15px;line-height:1.8;color:#ccc">
              ${analysisHtml}
            </div>
          </div>
          <div style="background:rgba(255,215,0,0.06);border:1px solid rgba(255,215,0,0.15);border-radius:12px;padding:20px;margin-bottom:24px;text-align:center">
            <p style="color:#aaa;font-size:13px;margin:0">Questions? Call or text us at <a href="tel:8302658430" style="color:#e8e8f0">830-265-8430</a></p>
          </div>
          <p style="color:#444;font-size:12px;text-align:center;margin:0">© 2026 Bid Check Pro · Protecting homeowners before they overpay</p>
        </div>
      `,
    });
  } catch (err) {
    console.error("Customer email error:", err);
  }
}

// ─── Email Alert to Admin ─────────────────────────────────────────────────────
async function emailAdmin(lead, analysis) {
  if (!process.env.RESEND_API_KEY) return;
  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const analysisText = analysis || "AI analysis not available.";

    await resend.emails.send({
      from: "Bid Check Pro <onboarding@resend.dev>",
      to: "fredsaylor459@gmail.com",
      subject: `🔔 New Lead: ${lead.name} — ${lead.jobType || "Bid Check"}`,
      html: `
        <div style="font-family:system-ui,sans-serif;padding:32px;max-width:600px">
          <h2 style="margin:0 0 20px">New Bid Check Lead</h2>
          <table style="width:100%;border-collapse:collapse">
            <tr><td style="padding:8px 0;color:#666;width:120px">Name</td><td style="padding:8px 0;font-weight:600">${lead.name}</td></tr>
            <tr><td style="padding:8px 0;color:#666">Email</td><td style="padding:8px 0"><a href="mailto:${lead.email}">${lead.email}</a></td></tr>
            <tr><td style="padding:8px 0;color:#666">Phone</td><td style="padding:8px 0">${lead.phone || "—"}</td></tr>
            <tr><td style="padding:8px 0;color:#666">Job Type</td><td style="padding:8px 0">${lead.jobType || "—"}</td></tr>
            <tr><td style="padding:8px 0;color:#666">Submitted</td><td style="padding:8px 0">${new Date(lead.date).toLocaleString()}</td></tr>
          </table>
          <hr style="margin:20px 0;border:none;border-top:1px solid #eee"/>
          <h3 style="margin:0 0 12px">Quote Details</h3>
          <p style="color:#444;line-height:1.6">${lead.description}</p>
          <hr style="margin:20px 0;border:none;border-top:1px solid #eee"/>
          <h3 style="margin:0 0 12px">AI Analysis Sent to Customer</h3>
          <p style="color:#444;line-height:1.6;white-space:pre-wrap">${analysisText}</p>
        </div>
      `,
    });
  } catch (err) {
    console.error("Admin email error:", err);
  }
}

// ─── Social Media via Zapier ──────────────────────────────────────────────────
async function postToSocial(lead) {
  if (!process.env.ZAPIER_WEBHOOK_URL) return;
  try {
    const post = `🏠 Just helped another homeowner protect their wallet!\n\nSomeone got their ${lead.jobType || "contractor"} bid analyzed — saving them from overpaying.\n\nGet YOUR bid checked for just $79 ⬇️\nbid-check-pro.vercel.app\n\n#BidCheckPro #HomeImprovement #ContractorTips #DontOverpay #HomeRepair`;

    await fetch(process.env.ZAPIER_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        post_text: post,
        job_type: lead.jobType || "contractor work",
        timestamp: lead.date,
        site_url: "https://bid-check-pro.vercel.app",
      }),
    });
  } catch (err) {
    console.error("Zapier webhook error:", err);
  }
}

// ─── Main Handler ─────────────────────────────────────────────────────────────
export async function POST(req) {
  try {
    const fd = await req.formData();
    const file = fd.get("file");

    const lead = {
      id: Date.now().toString(),
      name: fd.get("name") || "",
      email: fd.get("email") || "",
      phone: fd.get("phone") || "",
      jobType: fd.get("jobType") || "",
      description: fd.get("description") || "",
      file: file?.name || null,
      date: new Date().toISOString(),
      paid: false,
    };

    // 1. Save lead to file
    const dataDir = path.join(process.cwd(), "data");
    const dataPath = path.join(dataDir, "leads.json");
    await fs.mkdir(dataDir, { recursive: true });
    let leads = [];
    try {
      const raw = await fs.readFile(dataPath, "utf8");
      leads = JSON.parse(raw);
    } catch {}
    leads.unshift(lead);
    await fs.writeFile(dataPath, JSON.stringify(leads, null, 2));

    // 2. Run AI analysis + send emails + post social (all in parallel)
    const [analysis] = await Promise.allSettled([
      analyzeBid(lead.name, lead.jobType, lead.description),
    ]);

    const analysisText = analysis.status === "fulfilled" ? analysis.value : null;

    // Fire and forget — don't block the response
    Promise.allSettled([
      emailCustomer(lead.name, lead.email, lead.jobType, analysisText),
      emailAdmin(lead, analysisText),
      postToSocial(lead),
    ]);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Submit error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
