import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

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

    const dataDir = path.join(process.cwd(), "data");
    const dataPath = path.join(dataDir, "leads.json");

    // Ensure data directory exists
    await fs.mkdir(dataDir, { recursive: true });

    // Load existing leads
    let leads = [];
    try {
      const raw = await fs.readFile(dataPath, "utf8");
      leads = JSON.parse(raw);
    } catch {
      // File doesn't exist yet — start fresh
    }

    // Prepend newest lead
    leads.unshift(lead);
    await fs.writeFile(dataPath, JSON.stringify(leads, null, 2));

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Submit error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
