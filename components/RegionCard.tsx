import Link from "next/link";
import Image, { StaticImageData } from "next/image";

interface RegionCardProps {
  title: string;
  image: string | StaticImageData;
  href?: string;
}

const RegionCard = ({ title, image, href }: RegionCardProps) => {
  const content = (
    <div className="flex flex-col items-center group cursor-pointer">
      <div className="relative w-48 h-48 rounded-full overflow-hidden mb-4 transition-transform duration-300 group-hover:scale-105 shadow-lg">
        <Image 
          src={image} 
          alt={title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 192px"
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