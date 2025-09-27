import { Button } from "@/components/ui/button";
import Link from "next/link";


export default async function BookingWidgetPage(
    { params }: { params: Promise<{ id: string, service_id: string }> }
) {
    const { id, service_id } = await params;

    return (
        <div className="flex min-h-screen items-center justify-center bg-[#E8D6C9]">
            <div className="text-center">
                <h1 className="mb-4 text-4xl font-bold text-[#3A7E53]">Expériences Vinicoles</h1>
                <p className="text-xl text-muted-foreground mb-8">Découvrez nos caves et dégustations authentiques</p>
                <Link href={`/if/booking-widget/${id}/${service_id}/reservation`}>
                    <Button size="lg" className="bg-[#3A7E53] hover:bg-[#2C5D3D] text-white px-8 py-3 text-lg">
                        Voir nos expériences
                    </Button>
                </Link>
            </div>
        </div>
    )
}
