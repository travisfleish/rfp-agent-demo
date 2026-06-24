type LogoVariant = "horizontal" | "vertical" | "wordmark" | "marque";
type LogoColor = "blue" | "white";

interface GeniusLogoProps {
  variant?: LogoVariant;
  color?: LogoColor;
  className?: string;
  alt?: string;
}

const logoMap: Record<LogoVariant, Record<LogoColor, string>> = {
  horizontal: {
    blue: "/logos/GENIUS_SPORTS_HORIZONTAL_BLUE_RGB.svg",
    white: "/logos/GENIUS_SPORTS_HORIZONTAL_WHITE_RGB.svg",
  },
  vertical: {
    blue: "/logos/GENIUS_SPORTS_VERTICAL_BLUE_RGB.svg",
    white: "/logos/GENIUS_SPORTS_VERTICAL_WHITE_RGB.svg",
  },
  wordmark: {
    blue: "/logos/GENIUS_SPORTS_WORDMARK_BLUE_RGB.svg",
    white: "/logos/GENIUS_SPORTS_WORDMARK_WHITE_RGB.svg",
  },
  marque: {
    blue: "/logos/GENIUS_SPORTS_MARQUE_BLUE_RGB.svg",
    white: "/logos/GENIUS_SPORTS_MARQUE_WHITE_RGB.svg",
  },
};

export function GeniusLogo({
  variant = "horizontal",
  color = "blue",
  className = "",
  alt = "Genius Sports",
}: GeniusLogoProps) {
  const src = logoMap[variant][color];

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} className={className} />
  );
}
