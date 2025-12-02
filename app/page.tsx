import SingleBookingFlow from "@/components/single-booking-flow";
import FullScreenDialog from "@/components/ui/full-screen-dialog";


export default function Home() {
  return (
    <FullScreenDialog>
      <SingleBookingFlow />
    </FullScreenDialog>
  );
}
