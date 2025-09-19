import { CalendarSection } from "@/components/CalendarSection";
import { ReservationsList } from "@/components/ReservationsList";
import UserDashboardLayout from "@/components/userDashboard/UserDashboardLayout";

export default function UserReservation() {
    return (
        <UserDashboardLayout title="Réservations">
            <CalendarSection />
            <ReservationsList />
        </UserDashboardLayout>
    );
}