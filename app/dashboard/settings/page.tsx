import { AgendaSection } from "@/components/userDashboard/AgendaSection";
import { AvailabilitySection } from "@/components/userDashboard/AvailabilitySection";
import { NotificationSection } from "@/components/userDashboard/NotificationSection";
import { PaymentSection } from "@/components/userDashboard/PaymentSection";
import UserDashboardLayout from "@/components/userDashboard/UserDashboardLayout";

export default function UserSettings() {
    return (
        <UserDashboardLayout title="Paramètres">
            <AgendaSection />
            <AvailabilitySection />
            <NotificationSection />
            <PaymentSection />
        </UserDashboardLayout>
    );
}