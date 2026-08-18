import { slugify } from '@/lib/seo/site';

export interface RegionPageMetadata {
  title: string;
  description: string;
}

export const REGION_PAGE_METADATA: Record<string, RegionPageMetadata> = {
  touraine: {
    title: "Touraine : Dégustations de vin et châteaux de la Loire",
    description:
      "Réservez dégustations, visites de cave troglodytique et activités œnotouristiques dans les domaines de Touraine, classée au patrimoine de l'UNESCO.",
  },
  anjou: {
    title: "Anjou : Dégustation de vin entre Loire et coteaux",
    description:
      "Réservez dégustations et visites de cave dans les domaines viticoles d'Anjou, terre du célèbre Rosé d'Anjou et du cépage Chenin, entre Loire et coteaux.",
  },
  saumur: {
    title: "Saumur : Dégustation de vin de Chenin et Cabernet Franc",
    description:
      "Découvrez et dégustez la diversité des vins et visitez les cave troglodytiques, de Saumur fines bulles à Saumur Champigny.",
  },
  'muscadet-sevre-et-maine': {
    title: "Muscadet : Dégustation de vin de Melon de Bourgogne",
    description:
      "Réservez dégustations et visites de cave dans les domaines viticoles du Muscadet Sèvre et Maine, terre du Melon de Bourgogne et des vins élevés sur lie.",
  },
  jura: {
    title: "Jura : Dégustation de vin entre vignes et vin jaune",
    description:
      "Réservez dégustations et visites de cave dans les domaines du Jura : vin jaune, vin de paille et autres typicités des 7 appellations d'un vignoble unique.",
  },
  beaujolais: {
    title: "Beaujolais : Dégustation de Gamay et ses 10 crus",
    description:
      "Réservez dégustations et visites de cave dans les domaines viticoles du Beaujolais, terre du Gamay, des 10 crus et du célèbre Beaujolais Nouveau.",
  },
  bordeaux: {
    title: "Bordeaux : Dégustation de vin et châteaux Bordelais",
    description:
      "Réservez dégustations et visites de cave dans les domaines de Bordeaux, le plus grand vignoble de France, entre Pomerol, Saint-Émilion et Sauternes.",
  },
  bourgogne: {
    title: "Bourgogne : Dégustation de Pinot Noir et Chardonnay",
    description:
      "Réservez dégustations et visites de cave dans les domaines de Bourgogne, terre du Pinot Noir et du Chardonnay, entre climats et caves d'exception.",
  },
  'chateauneuf-du-pape': {
    title: "Châteauneuf-du-Pape : Dégustation de vin et de Grenache",
    description:
      "Réservez dégustations et visites de cave dans les domaines de Châteauneuf-du-Pape, terre du Grenache et célèbre pour ses galets roulés.",
  },
  'cotes-du-rhone': {
    title: "Côtes du Rhône : Dégustation de Syrah puissants",
    description:
      "Réservez dégustations et visites de cave sur la terre de la Syrah, dans les domaines de Côte-Rôtie, Hermitage et Cornas, sans oublier Condrieu avec le Viognier.",
  },
  languedoc: {
    title: "Languedoc : Dégustation entre vignes et garrigue",
    description:
      "Réservez dégustations et visites de cave dans les domaines du Languedoc, Pic Saint Loup, Minervois, Picpoul, entre garrigue et vignes méditerranéennes.",
  },
  'cotes-du-roussillon': {
    title: "Côtes du Roussillon : Dégustation de vins doux naturels",
    description:
      "Réservez dégustations et visites de cave dans les domaines viticoles du Roussillon, terre des vins doux naturels de Banyuls et Maury, au coeur des vignes catalanes.",
  },
  'cotes-d-auvergne': {
    title: "Côtes d'Auvergne : Dégustation de vin sur terre volcanique",
    description:
      "Réservez dégustations et visites de cave dans les domaines viticoles des Côtes d'Auvergne, vignoble volcanique au pied de la Chaîne des Puys.",
  },
  'menetou-salon': {
    title: "Menetou-Salon : Dégustation de Sauvignon et Pinot Noir",
    description:
      "Réservez dégustations et visites de cave dans les domaines viticoles de Menetou-Salon, terre du Sauvignon Blanc et du Pinot Noir sur calcaire kimméridgien.",
  },
  quincy: {
    title: "Quincy : Dégustation de vin Sauvignon",
    description:
      "Réservez dégustations et visites de cave dans les domaines viticoles de Quincy, 100% Sauvignon Blanc sur terrasses sablo-graveleuses de la Loire.",
  },
  reuilly: {
    title: "Reuilly : Dégustation de vin et visites du Berry",
    description:
      "Réservez dégustations et visites de cave dans les domaines viticoles de Reuilly, appellation aux 3 couleurs, entre Sauvignon Blanc et rosé de Pinot Gris.",
  },
  sancerre: {
    title: "Sancerre : Dégustation de vin Sauvignon",
    description:
      "Réservez dégustations et visites de cave à Sancerre, référence mondiale du Sauvignon Blanc, entre silex et paysages vallonnés.",
  },
  corse: {
    title: "Corse : Dégustation de vin Nielluccio et Sciacarello",
    description:
      "Réservez dégustations et visites de cave dans les domaines viticoles de Corse, terre du Nielluccio et du Sciacarello, entre maquis et Méditerranée.",
  },
  alsace: {
    title: "Alsace : Dégustation de vin Riesling et Gewurztraminer",
    description:
      "Réservez dégustations et visites de cave dans les domaines viticoles d'Alsace, terre du Riesling et du Gewurztraminer, à l'ombre des Vosges.",
  },
  'cotes-de-provence': {
    title: "Côtes de Provence : Dégustation de vin Rosé de Provence",
    description:
      "Réservez dégustations et visites de cave dans les domaines de Provence, capitale mondiale du rosé profitant d'un climat modéré par la Méditerranée.",
  },
};

const REGION_SLUG_ALIASES: Record<string, string> = {
  'vin-de-corse-ou-corse': 'corse',
  corse: 'corse',
  corsica: 'corse',
};

const REGION_DISPLAY_NAMES: Record<string, string> = {
  corse: 'Corse',
};

function normalizeRegionSlug(slug: string): string {
  return slug.replace(/-\d+$/, '');
}

export function resolveRegionSlugAlias(slug: string): string {
  const normalized = normalizeRegionSlug(slug.trim().toLowerCase());
  return REGION_SLUG_ALIASES[normalized] ?? normalized;
}

export function getRegionDisplayName(slug: string, denom: string): string {
  const metadataKey = resolveRegionSlugAlias(slug);
  if (REGION_DISPLAY_NAMES[metadataKey]) {
    return REGION_DISPLAY_NAMES[metadataKey];
  }

  const ouParts = denom.split(/\s+ou\s+/i);
  if (ouParts.length > 1) {
    const shortName = ouParts[ouParts.length - 1]?.trim();
    if (shortName) return shortName;
  }

  return denom;
}

function collectMetadataKeys(raw: string): string[] {
  const trimmed = raw.trim();
  if (!trimmed) return [];

  const keys = new Set<string>();
  const lower = trimmed.toLowerCase();
  const slugified = slugify(trimmed);
  const variants = [
    lower,
    normalizeRegionSlug(lower),
    slugified,
    normalizeRegionSlug(slugified),
  ];

  for (const variant of variants) {
    keys.add(variant);
    keys.add(resolveRegionSlugAlias(variant));
  }

  const ouParts = trimmed.split(/\s+ou\s+/i);
  if (ouParts.length > 1) {
    const shortName = ouParts[ouParts.length - 1]?.trim();
    if (shortName) {
      const shortSlug = slugify(shortName);
      keys.add(shortSlug);
      keys.add(resolveRegionSlugAlias(shortSlug));
    }
  }

  return [...keys];
}

export function getRegionPageMetadata(
  ...candidates: Array<string | null | undefined>
): RegionPageMetadata | undefined {
  for (const candidate of candidates) {
    if (!candidate) continue;
    for (const key of collectMetadataKeys(candidate)) {
      const metadata = REGION_PAGE_METADATA[key];
      if (metadata) return metadata;
    }
  }
  return undefined;
}
