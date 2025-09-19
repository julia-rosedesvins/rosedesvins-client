'use client';
import UserDashboardLayout from "@/components/userDashboard/UserDashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export default function UserContact() {
    return (
        <UserDashboardLayout title="Contact">
            <div className="mb-6 lg:mb-8">
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">Contact</h1>
                <p className="text-sm lg:text-base text-gray-600">Besoin d'aide ? Contactez notre équipe.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
                {/* Formulaire de contact */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg lg:text-xl">Envoyez-nous un message</CardTitle>
                        <CardDescription className="text-sm lg:text-base">
                            Nous vous répondrons dans les plus brefs délais.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4 lg:space-y-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="prenom" className="text-sm lg:text-base">Prénom</Label>
                                <Input 
                                    id="prenom" 
                                    placeholder="Votre prénom" 
                                    className="h-10 lg:h-9 text-sm lg:text-base"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="nom" className="text-sm lg:text-base">Nom</Label>
                                <Input 
                                    id="nom" 
                                    placeholder="Votre nom" 
                                    className="h-10 lg:h-9 text-sm lg:text-base"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-sm lg:text-base">Email</Label>
                            <Input 
                                id="email" 
                                type="email" 
                                placeholder="votre.email@exemple.com" 
                                className="h-10 lg:h-9 text-sm lg:text-base"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="sujet" className="text-sm lg:text-base">Sujet</Label>
                            <Input 
                                id="sujet" 
                                placeholder="Objet de votre message" 
                                className="h-10 lg:h-9 text-sm lg:text-base"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="message" className="text-sm lg:text-base">Message</Label>
                            <Textarea
                                id="message"
                                placeholder="Décrivez votre demande..."
                                className="min-h-[120px] lg:min-h-[100px] text-sm lg:text-base"
                            />
                        </div>

                        <Button 
                            className="w-full text-white hover:opacity-90 text-sm lg:text-base py-3 lg:py-2"
                            style={{ backgroundColor: '#3A7B59' }}
                        >
                            Envoyer le message
                        </Button>
                    </CardContent>
                </Card>

                {/* Informations de contact */}
                <div className="space-y-4 lg:space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg lg:text-xl">Informations de contact</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <h3 className="font-medium text-sm lg:text-base">Support technique</h3>
                                <p className="text-sm lg:text-base text-muted-foreground">support@rosedesvins.com</p>
                            </div>
                            <div className="space-y-2">
                                <h3 className="font-medium text-sm lg:text-base">Questions commerciales</h3>
                                <p className="text-sm lg:text-base text-muted-foreground">contact@rosedesvins.com</p>
                            </div>
                            <div className="space-y-2">
                                <h3 className="font-medium text-sm lg:text-base">Téléphone</h3>
                                <p className="text-sm lg:text-base text-muted-foreground">+33 1 23 45 67 89</p>
                            </div>
                        </CardContent>
                    </Card>
                    
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg lg:text-xl">Horaires d'assistance</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <div className="flex justify-between items-center">
                                <span className="text-sm lg:text-base">Lundi - Vendredi</span>
                                <span className="text-sm lg:text-base text-muted-foreground">9h - 18h</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm lg:text-base">Samedi</span>
                                <span className="text-sm lg:text-base text-muted-foreground">9h - 12h</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm lg:text-base">Dimanche</span>
                                <span className="text-sm lg:text-base text-muted-foreground">Fermé</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </UserDashboardLayout>
    );
}