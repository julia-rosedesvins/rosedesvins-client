import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import LandingPageLayout from '@/components/LandingPageLayout';
import RegionCard from '@/components/RegionCard';
import RegionsBackButton from './RegionsBackButton';
import { fetchParentRegionsPage } from '@/lib/seo/fetch-public';
import { JsonLdScript, collectionPageJsonLd } from '@/lib/seo/json-ld';
import { buildCanonical, slugify } from '@/lib/seo/site';
import { compareSearchMatch } from '@/lib/search-relevance';
import { getRegionDisplayName } from '@/lib/seo/region-metadata';
import heroImg from '/public/assets/chablis-vignoble-bourgogne.webp';

type PageProps = {
  searchParams: Promise<{ q?: string; all?: string }>;
};

export default async function RegionsPage({ searchParams }: PageProps) {
  const { q, all } = await searchParams;
  const searchQuery = q?.trim() || '';
  const showAll = all === '1' || all === 'true';
  const fetchLimit = showAll || searchQuery ? 1000 : 15;

  const data = await fetchParentRegionsPage(1, fetchLimit);
  let regions = data?.regions ?? [];
  const apiTotal = data?.total ?? regions.length;

  if (searchQuery) {
    regions = regions
      .filter((region) =>
        region.denom.toLowerCase().includes(searchQuery.toLowerCase()),
      )
      .sort((a, b) =>
        compareSearchMatch(searchQuery, a.denom, b.denom, a.slug, b.slug),
      );
  }

  const totalRegions = searchQuery ? regions.length : apiTotal;

  const collectionJsonLd = collectionPageJsonLd({
    name: 'Régions viticoles de France',
    path: '/regions',
    items: regions.map((region) => ({
      name: region.denom,
      url: buildCanonical(`/region/${region.slug || slugify(region.denom)}`),
    })),
  });

  const viewAllHref = searchQuery
    ? `/regions?q=${encodeURIComponent(searchQuery)}&all=1`
    : '/regions?all=1';

  return (
    <LandingPageLayout>
      <JsonLdScript data={collectionJsonLd} />

      <section className="relative text-white min-h-[300px]" style={{ transform: 'scaleX(-1)' }}>
        <div className="absolute inset-0 overflow-hidden">
          <Image
            src={heroImg}
            alt="Vignoble de Chablis en Bourgogne"
            fill
            priority
            quality={85}
            placeholder="blur"
            className="object-cover object-[center_0%]"
            sizes="(max-width: 768px) 100vw, 1920px"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[rgba(59,130,91,0.7)] to-[rgba(59,130,91,0.5)]" />
        </div>
        <div
          className="relative z-10 max-w-6xl mx-auto px-4 pt-4"
          style={{ transform: 'scaleX(-1)' }}
        >
          <RegionsBackButton />
        </div>

        <div
          className="relative z-10 max-w-6xl mx-auto px-4 pb-12 pt-8 flex items-center min-h-[250px]"
          style={{ transform: 'scaleX(-1)' }}
        >
          <div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              Un voyage au cœur des régions viticoles.
            </h1>
            <p className="text-lg md:text-xl max-w-3xl leading-relaxed">
              Au fil des routes des vins, ce sont les vignerons eux-mêmes qui vous ouvrent leurs portes.
              Entre paysages, patrimoine et passion partagée, découvrez la richesse et la diversité des
              vignobles français.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          {searchQuery && (
            <div className="mb-8 text-center">
              <p className="text-lg text-gray-600">
                Résultats de recherche pour :{' '}
                <span className="font-semibold text-[#318160]">&quot;{searchQuery}&quot;</span>
              </p>
            </div>
          )}

          <h2 className="text-2xl md:text-3xl font-bold text-[#318160] mb-12 text-center">
            Les régions viticoles françaises
          </h2>

          {regions.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-lg text-gray-600">
                {searchQuery
                  ? `Aucune région trouvée pour "${searchQuery}"`
                  : 'Aucune région disponible'}
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12 justify-items-center">
                {regions.map((region, index) => (
                  <RegionCard
                    key={region._id}
                    title={getRegionDisplayName(region.slug || region.denom, region.denom)}
                    image={region.thumbnailUrl || '/assets/loire-valley-new.jpg'}
                    href={`/region/${region.slug || encodeURIComponent(region.denom)}`}
                    priority={index < 6}
                  />
                ))}
              </div>

              <div className="text-center mt-16">
                {!showAll && !searchQuery && totalRegions > 15 && (
                  <Link href={viewAllHref}>
                    <Button className="bg-[#318160] hover:bg-[#1D6346] text-white px-8 py-3 rounded-lg font-semibold">
                      Voir tous les domaines ({totalRegions})
                    </Button>
                  </Link>
                )}
              </div>
            </>
          )}
        </div>
      </section>
    </LandingPageLayout>
  );
}
