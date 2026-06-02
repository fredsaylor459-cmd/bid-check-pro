import { redirect } from "next/navigation";

// Old success page — now redirects to /thank-you
export default function Success() {
  redirect("/thank-you");
}
