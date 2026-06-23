import { redirect } from "next/navigation";
import { fetchBookingRequestByTripShortCode } from "@/lib/bookingRequestService";

export default async function ShortTripPage({
  params,
}: {
  params: Promise<{ tripCode: string }>;
}) {
  const { tripCode } = await params;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

  if (!supabaseUrl || !supabaseKey) redirect("/");

  const booking = await fetchBookingRequestByTripShortCode({
    supabaseUrl,
    supabaseKey,
    tripShortCode: tripCode,
  });

  if (!booking?.id) redirect("/");

  redirect(`/driver-trip?id=${encodeURIComponent(booking.id)}`);
}
