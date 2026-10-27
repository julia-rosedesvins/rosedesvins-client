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
      <div className="relative w-64 h-64 md:w-72 md:h-72 rounded-2xl overflow-hidden shadow-sm">
        <Image
          src={imageUrl}
          alt={title}
          fill
          priority={priority}
          sizes="(max-width: 768px) 256px, 288px"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-transparent" />
        <h3 className="absolute bottom-0 left-0 right-0 p-3 md:p-4 text-[27px] leading-tight font-semibold text-white text-center">
          {title}
        </h3>
      </div>
    </div>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }

  return content;
};

export default RegionCard;
