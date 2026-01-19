import Link from "next/link";
import { Button } from "@/components/ui/button";
import LandingPageLayout from "@/components/LandingPageLayout";

const Experiences = () => {
    const activities = [
        {
            id: 1,
            title: "Dégustations",
            image: "/assets/degustation-vin.jpg",
            description: "Découvrez les saveurs uniques des vins français"
        },
        {
            id: 2,
            title: "Visites de cave",
            image: "/assets/cave-visite.jpg",
            description: "Explorez les secrets des caves traditionnelles"
        },
        {
            id: 3,
            title: "Atelier d'œnologie",
            image: "/assets/atelier-oenologie.jpg",
            description: "Apprenez l'art de la dégustation avec des experts"
        },
        {
            id: 4,
            title: "Food & Wine",
            image: "/assets/food-wine.jpg",
            description: "Mariages mets et vins d'exception"
        },
        {
            id: 5,
            title: "Balades à vélo & trottinettes",
            image: "/assets/velo-vignes.jpg",
            description: "Parcourez les vignobles de manière éco-responsable"
        },
        {
            id: 6,
            title: "Pique-nique dans les vignes",
            image: "/assets/pique-nique-vignes.jpg",
            description: "Moments authentiques au cœur des vignobles"
        },
        {
            id: 7,
            title: "Yoga dans les vignes",
            image: "/assets/yoga-vignes.jpeg",
            description: "Détente et bien-être au milieu des vignobles"
        },
        {
            id: 8,
            title: "Murder Mystery",
            image: "/assets/murder-mystery.png",
            description: "Une enquête palpitante dans les vignes"
        },
        {
            id: 9,
            title: "Escape game dans une cave",
            image: "/assets/gift-escape-game-cave.jpg",
            description: "Résolvez des énigmes dans l'univers d'une cave"
        }
    ];

    return (
        <LandingPageLayout>

            {/* Hero Section */}
            <section
                className="relative bg-cover bg-center text-white py-20"
                style={{
                    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.4)), url(/assets/wine-cellar.jpg)`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center center',
                    backgroundRepeat: 'no-repeat'
                }}
            >
                <div className="max-w-6xl mx-auto px-4">
                    <h1 className="text-4xl md:text-5xl font-bold mb-6 max-w-3xl">
                        Des expériences façonnées par la passion des vignerons.
                    </h1>
                    <p className="text-lg md:text-xl max-w-4xl leading-relaxed">
                        Visites de cave, dégustations, cours d'œnologie, balades à vélo, pique-nique
                        dans les vignes... : découvrez le vin directement auprès de ceux qui le créent
                        et vivez des moments authentiques. Chaque activité est une rencontre avec
                        un vigneron passionné et une façon unique de découvrir son univers.
                    </p>
                </div>
            </section>

            {/* Activities Section */}
            <section className="py-16 px-4 bg-white">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-3xl md:text-4xl font-bold text-primary text-center mb-16">
                        Les activités œnotouristiques
                    </h2>

                    {/* Activities Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 mb-16">
                        {activities.map((activity) => (
                            <Link
                                key={activity.id}
                                href={activity.id === 2 ? "/experiences/cave-visits" : "#"}
                                className="text-center block hover:opacity-80 transition-opacity"
                            >
                                <h3 className="text-xl font-semibold text-[#318160] mb-6">
                                    {activity.title}
                                </h3>
                                <div className="relative w-64 h-64 mx-auto mb-4">
                                    <img
                                        src={activity.image}
                                        alt={activity.title}
                                        className="w-full h-full object-cover rounded-full border-4 border-[#318160]/20 shadow-lg"
                                    />
                                </div>
                            </Link>
                        ))}
                    </div>

                    {/* Call to Action */}
                    <div className="text-center">
                        <Link href="/regions">
                            <Button className="bg-[#318160] hover:bg-[#1D6346] text-white px-8 py-3 rounded-lg font-semibold text-lg">
                                Voir tous les domaines
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>
        </LandingPageLayout>
    );
};

export default Experiences;