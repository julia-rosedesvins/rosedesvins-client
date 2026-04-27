import Link from "next/link";
import { StaticImageData } from "next/image";

interface RegionCardProps {
  title: string;
  image: string | StaticImageData;
  href?: string;
  /** Pass true for the first 3 visible slides so they load eagerly */
  priority?: boolean;
}

const RegionCard = ({ title, image, href, priority = false }: RegionCardProps) => {
  const imageUrl = typeof image === 'string' ? image : image.src;

  const content = (
    <div className="flex flex-col items-center group cursor-pointer">
      <div className="relative w-64 h-64 md:w-72 md:h-72 rounded-full overflow-hidden mb-4 shadow-[0_8px_30px_rgba(0,0,0,0.25)]">
        <img
          src={imageUrl}
          alt={title}
          className="object-cover w-full h-full"
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          fetchPriority={priority ? "high" : "low"}
          width={288}
          height={288}
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
