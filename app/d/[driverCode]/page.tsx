import AssignmentShell from "@/app/admin/driver-vehicle-assignment/_components/AssignmentShell";
import { fetchBookingRequestByDriverAssignmentCode } from "@/lib/bookingRequestService";

type PageProps = {
  params: Promise<{
    driverCode: string;
  }>;
};

export default async function ShortDriverAssignmentPage({ params }: PageProps) {
  const { driverCode } = await params;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

  let bookingId = driverCode;

  if (supabaseUrl && supabaseKey) {
    try {
      const record = await fetchBookingRequestByDriverAssignmentCode({
        supabaseUrl,
        supabaseKey,
        driverAssignmentCode: driverCode,
      });

      if (record?.id) {
        bookingId = record.id;
      }
    } catch (error) {
      console.log("Short driver assignment link resolve failed:", error);
    }
  }

  return <AssignmentShell bookingId={bookingId} forceDriverMode />;
}
