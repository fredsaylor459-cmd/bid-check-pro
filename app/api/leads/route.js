import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

export async function GET(req) {
  const auth = req.headers.get("authorization");
  const adminPass = process.env.ADMIN_PASSWORD || "admin830";

  if (auth !== `Bearer ${adminPass}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const dataPath = path.join(process.cwd(), "data", "leads.json");
    const raw = await fs.readFile(dataPath, "utf8");
    return NextResponse.json(JSON.parse(raw));
  } catch {
    return NextResponse.json([]);
  }
}
