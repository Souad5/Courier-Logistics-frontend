import type { Metadata } from "next";

import { PaymentSuccess } from "@/components/modules/payments/PaymentSuccess";

export const metadata: Metadata = { title: "Payment successful" };

export default async function PaymentSuccessPage(props: PageProps<"/success">) {
  const { session_id } = await props.searchParams;
  return <PaymentSuccess sessionId={typeof session_id === "string" ? session_id : undefined} />;
}
