import { Button } from "@/components/ui/button";
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

            <div className="mt-6 flex justify-end">
                <Button variant="outline" className="px-8">
                    Enregistrer
                </Button>
            </div>
        </UserDashboardLayout>
    );
}