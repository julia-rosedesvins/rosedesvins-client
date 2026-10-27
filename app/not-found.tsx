import Link from "next/link";
import { Home, MapPin, Compass } from "lucide-react";
import { Button } from "@/components/ui/button";
import LandingPageLayout from "@/components/LandingPageLayout";
import { NOINDEX_METADATA } from "@/lib/seo/site";
import { fetchAllParentRegions } from "@/lib/seo/fetch-public";

export const metadata = NOINDEX_METADATA;

export default async function NotFound() {
  const regions = (await fetchAllParentRegions()).slice(0, 6);

  return (
    <LandingPageLayout>
      <div className="min-h-[calc(100vh-200px)] flex items-center justify-center px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <div className="mb-8 flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-[#318160]/10 rounded-full blur-3xl"></div>
              <div className="relative bg-[#318160]/5 rounded-full p-8">
                <Compass className="h-24 w-24 text-[#318160]" strokeWidth={1.5} />
              </div>
            </div>
          </div>

          <p className="text-sm font-semibold tracking-widest text-[#318160] mb-3">
            ERREUR 404
          </p>

          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Cette page n&apos;existe pas
          </h1>

          <p className="text-lg text-gray-600 mb-12 max-w-xl mx-auto">
            La page que vous recherchez a peut-être été déplacée, supprimée, ou
            n&apos;a jamais existé. Retournez à l&apos;accueil ou explorez nos
            domaines viticoles.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/" className="w-full sm:w-auto">
              <Button
                size="lg"
                className="w-full bg-[#318160] hover:bg-[#1D6346] text-white"
              >
                <Home className="w-5 h-5 mr-2" />
                Page d&apos;accueil
              </Button>
            </Link>

            <Link href="/regions" className="w-full sm:w-auto">
              <Button
                size="lg"
                variant="outline"
                className="w-full border-[#318160] text-[#318160] hover:bg-[#318160] hover:text-white transition-colors"
              >
                <MapPin className="w-5 h-5 mr-2" />
                Explorer les régions
              </Button>
            </Link>
          </div>

          {regions.length > 0 && (
            <div className="mt-16 pt-12 border-t border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">
                Régions populaires :
              </h2>
              <div className="flex flex-wrap justify-center gap-3">
                {regions.map((region) => (
                  <Link
                    key={region._id}
                    href={`/region/${region.slug || encodeURIComponent(region.denom)}`}
                    className="px-6 py-3 bg-white border-2 border-gray-200 hover:border-[#318160] hover:text-[#318160] rounded-full text-gray-700 font-medium transition-all hover:shadow-md"
                  >
                    {region.denom}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </LandingPageLayout>
  );
}
