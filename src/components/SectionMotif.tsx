// Per-section line-art textures. Each motif echoes what its section is about:
// a corkboard weave behind the pinned notices, a calendar grid behind events,
// newsprint column rules behind the news feed.
//
// Same rules as StreetPattern: tiled via CSS background-image (not an SVG
// <pattern>, which WebKit rasterizes with visible seams on 2x/3x screens), and
// every stroke sits fully inside its tile so nothing is clipped at the edges.
// Decorative only — low contrast, never behind body copy at full strength.

const url = (svg: string) => `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;

const MOTIFS = {
  // Corkboard: a sparse diagonal weave of pin-holes for the City Board.
  board: {
    size: 28,
    image: url(
      `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 28 28"><g fill="#B99A3E"><circle cx="7" cy="7" r="1.1"/><circle cx="21" cy="21" r="1.1"/></g></svg>`
    ),
  },
  // Calendar: a plain month grid for the events section.
  calendar: {
    size: 52,
    image: url(
      `<svg xmlns="http://www.w3.org/2000/svg" width="52" height="52" viewBox="0 0 52 52"><g fill="none" stroke="#D3DAE3" stroke-width="1"><path d="M0.5 0 V52"/><path d="M0 0.5 H52"/></g></svg>`
    ),
  },
  // Newsprint: bare column rules for the featured-news feed.
  news: {
    size: 132,
    image: url(
      `<svg xmlns="http://www.w3.org/2000/svg" width="132" height="12" viewBox="0 0 132 12"><path d="M0.5 0 V12" fill="none" stroke="#DCE2EA" stroke-width="1"/></svg>`
    ),
  },
} as const;

export type MotifName = keyof typeof MOTIFS;

export default function SectionMotif({
  name,
  className = "",
  opacity = 0.5,
  /** Fades the texture out at the top and bottom so it never collides with
   *  the section edges. */
  fade = true,
}: {
  name: MotifName;
  className?: string;
  opacity?: number;
  fade?: boolean;
}) {
  const motif = MOTIFS[name];
  const mask = "linear-gradient(to bottom, transparent, #000 18%, #000 82%, transparent)";

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 ${className}`}
      style={{
        opacity,
        backgroundImage: motif.image,
        backgroundSize:
          name === "news" ? `${motif.size}px 12px` : `${motif.size}px ${motif.size}px`,
        ...(fade
          ? { WebkitMaskImage: mask, maskImage: mask }
          : {}),
      }}
    />
  );
}

/**
 * Concentric signal rings — a call radiating out. Sits behind the emergency
 * hotlines, anchored to the 911 card rather than tiled across the section.
 */
export function SignalRings({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 400 400"
      fill="none"
      className={`pointer-events-none absolute ${className}`}
    >
      <g stroke="currentColor" strokeWidth="1">
        <circle cx="200" cy="200" r="60" opacity="0.5" />
        <circle cx="200" cy="200" r="110" opacity="0.36" />
        <circle cx="200" cy="200" r="160" opacity="0.24" />
        <circle cx="200" cy="200" r="210" opacity="0.14" />
        <circle cx="200" cy="200" r="260" opacity="0.08" />
      </g>
    </svg>
  );
}
