import Stripe from "stripe";
import { NextResponse } from "next/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const PRICES = { basic: 7900, pro: 14900, premium: 34900 };
const NAMES = {
  basic: "Bid Check Pro — Basic Report",
  pro: "Bid Check Pro — Pro Report",
  premium: "Bid Check Pro — Premium Report",
};

export async function POST(req) {
  try {
    const { tier, customerEmail } = await req.json();
    if (!PRICES[tier]) return NextResponse.json({ error: "Invalid tier" }, { status: 400 });
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: customerEmail || undefined,
      line_items: [{ quantity: 1, price_data: { currency: "usd", unit_amount: PRICES[tier], product_data: { name: NAMES[tier], description: "Contractor bid analysis — delivered within 24 hours" } } }],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/success?tier=${tier}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}`,
      metadata: { tier },
    });
    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Stripe error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
