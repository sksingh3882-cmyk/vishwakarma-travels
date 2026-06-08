import AssignmentShell from "@/app/admin/driver-vehicle-assignment/_components/AssignmentShell";

type PageProps = {
  params: Promise<{
    bookingId: string;
  }>;
};

export default async function DriverVehicleAssignmentPage({ params }: PageProps) {
  const { bookingId } = await params;

  return <AssignmentShell bookingId={bookingId} forceDriverMode />;
}
