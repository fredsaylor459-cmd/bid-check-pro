import "./globals.css";

export const metadata = {
  title: "Bid Check Pro — Don't Overpay Your Contractor",
  description:
    "Second-opinion contractor reviews that protect homeowners before they overpay. Call 830-265-8430.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
