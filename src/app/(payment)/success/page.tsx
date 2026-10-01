import type { Metadata } from "next";

import { PaymentSuccess } from "@/components/modules/payments/PaymentSuccess";
import { getI18n } from "@/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getI18n();
  return { title: t.payments.success.metaTitle };
}

export default async function PaymentSuccessPage(props: PageProps<"/success">) {
  const { session_id } = await props.searchParams;
  return <PaymentSuccess sessionId={typeof session_id === "string" ? session_id : undefined} />;
}
