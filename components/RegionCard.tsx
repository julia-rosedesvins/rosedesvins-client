import Link from "next/link";
import Image, { StaticImageData } from "next/image";

interface RegionCardProps {
  title: string;
  image: string | StaticImageData;
  href?: string;
  /** Pass true for the first 3 visible slides so they load eagerly */
  priority?: boolean;
}

/** External URLs (S3, http) are served directly — no Next.js proxy needed. */
const isExternalUrl = (url: string): boolean =>
  url.startsWith('http://') || url.startsWith('https://');

const RegionCard = ({ title, image, href, priority = false }: RegionCardProps) => {
  const imageUrl = typeof image === 'string' ? image : image.src;
  const external = isExternalUrl(imageUrl);

  const content = (
    <div className="flex flex-col items-center group cursor-pointer">
      <div className="relative w-64 h-64 md:w-72 md:h-72 rounded-full overflow-hidden mb-4 shadow-[0_8px_30px_rgba(0,0,0,0.25)]">
        <Image
          src={imageUrl}
          alt={title}
          fill
          // External S3 URLs: skip Next.js proxy (avoids 500s from missing config),
          // image is served directly from S3 which has its own CDN cache.
          // Local assets: go through Next.js optimizer for WebP + resizing.
          unoptimized={external}
          priority={priority}
          sizes="(max-width: 768px) 256px, 288px"
          className="object-cover"
        />
      </div>
      <h3 className="text-lg font-semibold text-[#264035] text-center">
        {title}
      </h3>
    </div>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }

  return content;
};

export default RegionCard;
