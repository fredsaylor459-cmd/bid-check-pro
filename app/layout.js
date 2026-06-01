export const metadata = {
  title: "Bid Check Pro — Don't Overpay Your Contractor",
  description: "We check your contractor quote against real market rates before you sign.",
};
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0 }}>{children}</body>
    </html>
  );
}
