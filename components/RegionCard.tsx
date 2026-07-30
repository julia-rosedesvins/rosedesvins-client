import Link from "next/link";
import Image, { StaticImageData } from "next/image";

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
      <div className="relative w-64 h-64 md:w-72 md:h-72 rounded-2xl overflow-hidden mb-4 shadow-sm">
        <Image
          src={imageUrl}
          alt={title}
          fill
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
