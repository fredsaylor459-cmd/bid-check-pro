import { NextResponse } from "next/server";

// Stripe checkout removed — payments now via Cash App
export async function POST() {
  return NextResponse.json(
    { error: "Stripe checkout is no longer active. Please use Cash App." },
    { status: 410 }
  );
}
