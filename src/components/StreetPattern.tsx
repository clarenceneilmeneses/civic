// Subtle line-art street-map background texture. Decorative only —
// low-contrast thin strokes, never placed behind body text.
// Tiled via CSS background-image rather than an SVG <pattern> (WebKit
// rasterizes <pattern> tiles with visible seams on 2x/3x screens), and
// every path enters/exits opposite tile edges at the same coordinate so
// the artwork wraps without a visible tear at 220px boundaries.
const TILE = `<svg xmlns="http://www.w3.org/2000/svg" width="220" height="220" viewBox="0 0 220 220"><g fill="none" stroke="#C8CFD8" stroke-width="1"><path d="M0 40 L90 34 L220 40"/><path d="M0 110 L70 104 L150 116 L220 110"/><path d="M0 178 L110 170 L220 178"/><path d="M36 0 L42 90 L36 220"/><path d="M120 0 L112 70 L124 150 L120 220"/><path d="M188 0 L182 110 L188 220"/><path d="M42 90 L112 70"/><path d="M124 150 L182 110"/><path d="M70 104 L42 90"/><path d="M150 116 L124 150"/></g><g fill="none" stroke="#DEE3E9" stroke-width="0.7"><path d="M0 72 L110 66 L220 72"/><path d="M0 146 L110 152 L220 146"/><path d="M78 0 L82 110 L78 220"/><path d="M156 0 L152 110 L156 220"/></g><circle cx="112" cy="70" r="5" fill="none" stroke="#C8CFD8" stroke-width="1"/></svg>`;

const TILE_URL = `url("data:image/svg+xml,${encodeURIComponent(TILE)}")`;

export default function StreetPattern({
  className = "",
  opacity = 0.5,
}: {
  className?: string;
  opacity?: number;
}) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 ${className}`}
      style={{
        opacity,
        backgroundImage: TILE_URL,
        backgroundSize: "220px 220px",
      }}
    />
  );
}
