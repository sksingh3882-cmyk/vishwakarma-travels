import { redirect } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

function makeShortCode(id: string) {
  return (
    "VT" +
    String(id)
      .replace(/[^0-9]/g, "")
      .slice(-5)
      .padStart(5, "0")
  );
}

export default async function Page({ params }: { params: { code: string } }) {
  const code = String(params.code || "").toUpperCase();

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data } = await supabase
    .from("booking_requests")
    .select("id");

  const booking = data?.find((item) => makeShortCode(item.id) === code);

  if (!booking) redirect("/");

  redirect(`/driver-trip?id=${booking.id}`);
}
