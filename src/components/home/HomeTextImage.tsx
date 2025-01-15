import { Link } from "react-router-dom";
import { Button } from "../ui/button";

interface HomeTextImageProps {
  title: string;
  content: string;
  imgSrc: string;
  imgAlt: string;
  ctaHref?: string;
  ctaTitle?: string;
  revert?: boolean;
}

export const HomeTextImage = ({
  title,
  content,
  imgSrc,
  imgAlt,
  ctaHref,
  ctaTitle,
  revert = false,
}: HomeTextImageProps) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-12 my-8">
    <div className={`flex flex-col gap-4 ${revert ? "order-last" : ""}`}>
      <h2 className="text-3xl font-semibold text-foreground">{title} </h2>
      <p className="text-lg text-secondary-foreground">{content}</p>
      {ctaHref && ctaTitle && (
        <Button className="text-foreground mt-4 w-fit" rel="noreferrer">
          <Link to={ctaHref} className="text-primary-foreground">
            {ctaTitle}
          </Link>
        </Button>
      )}
    </div>
    <div className="flex flex-col gap-4 mx-auto">
      <img src={imgSrc} alt={imgAlt} className="w-full h-full bg-black" />
    </div>
  </div>
);
