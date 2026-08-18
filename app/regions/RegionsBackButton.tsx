"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function RegionsBackButton() {
    const router = useRouter();

    return (
        <Button
            onClick={() => router.back()}
            variant="outline"
            className="bg-white/10 border-white/30 text-white hover:bg-white/20 hover:text-white"
        >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour
        </Button>
    );
}
