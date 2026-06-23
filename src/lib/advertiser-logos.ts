const ADVERTISER_LOGOS: Record<string, string> = {
  nike: "/logos/nike.svg",
  fanduel: "/logos/fanduel.svg",
  toyota: "/logos/toyota.svg",
};

export function getAdvertiserLogo(advertiser: string): string | undefined {
  return ADVERTISER_LOGOS[advertiser.trim().toLowerCase()];
}
