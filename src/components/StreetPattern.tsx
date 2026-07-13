// Subtle line-art street-map background texture. Decorative only —
// low-contrast thin strokes, never placed behind body text.
export default function StreetPattern({
  className = "",
  opacity = 0.5,
}: {
  className?: string;
  opacity?: number;
}) {
  return (
    <svg
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
      style={{ opacity }}
    >
      <defs>
        <pattern
          id="streets"
          width="220"
          height="220"
          patternUnits="userSpaceOnUse"
        >
          <g fill="none" stroke="#C8CFD8" strokeWidth="1">
            <path d="M0 40 L90 34 L220 46" />
            <path d="M0 110 L70 104 L150 116 L220 108" />
            <path d="M0 178 L110 170 L220 182" />
            <path d="M36 0 L42 90 L34 220" />
            <path d="M120 0 L112 70 L124 150 L116 220" />
            <path d="M188 0 L182 110 L192 220" />
            <path d="M42 90 L112 70" />
            <path d="M124 150 L182 110" />
            <path d="M70 104 L42 90" />
            <path d="M150 116 L124 150" />
          </g>
          <g fill="none" stroke="#DEE3E9" strokeWidth="0.7">
            <path d="M0 72 L220 66" />
            <path d="M0 146 L220 152" />
            <path d="M78 0 L82 220" />
            <path d="M156 0 L152 220" />
          </g>
          <circle cx="112" cy="70" r="5" fill="none" stroke="#C8CFD8" strokeWidth="1" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#streets)" />
    </svg>
  );
}
