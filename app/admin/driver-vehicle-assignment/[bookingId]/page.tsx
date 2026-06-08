import AssignmentShell from "../_components/AssignmentShell";

type PageProps = {
  params: Promise<{
    bookingId: string;
  }>;
};

export default async function DriverVehicleAssignmentPage({
  params,
}: PageProps) {
  const { bookingId } = await params;

  return <AssignmentShell bookingId={bookingId} />;
}
