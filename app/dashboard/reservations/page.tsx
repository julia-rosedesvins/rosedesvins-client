import { CalendarSection } from "@/components/CalendarSection";
import { ReservationsList } from "@/components/ReservationsList";
import UserDashboardLayout from "@/components/userDashboard/UserDashboardLayout";
import { DateProvider } from "@/contexts/DateContext";

export default function UserReservation() {
    return (
        <UserDashboardLayout title="Réservations">
            <DateProvider>
                <CalendarSection />
                <ReservationsList />
            </DateProvider>
        </UserDashboardLayout>
    );
}