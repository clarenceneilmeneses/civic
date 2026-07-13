// Custom brand icon: a rounded map pin filled with a stained-glass mosaic of
// city blocks (palette blues/oranges/yellows) and a yellow plaza ring near the
// top — inspired by minimalist map-art posters of Batangas City.
export default function BrandMark({
  className = "h-9 w-9",
  title = "Batangas Youth Civic Hub",
}: {
  className?: string;
  title?: string;
}) {
  return (
    <svg
      viewBox="0 0 64 64"
      className={className}
      role="img"
      aria-label={title}
    >
      <defs>
        <clipPath id="pinClip">
          <path d="M32 3C18.7 3 9 12.9 9 25.6 9 41.5 28.2 58.3 31 60.6a1.6 1.6 0 0 0 2 0C35.8 58.3 55 41.5 55 25.6 55 12.9 45.3 3 32 3Z" />
        </clipPath>
      </defs>

      {/* mosaic city blocks, clipped to the pin */}
      <g clipPath="url(#pinClip)">
        <rect x="6" y="0" width="52" height="64" fill="#A8D5EE" />
        <polygon points="6,0 34,0 30,14 6,18" fill="#F6B93B" />
        <polygon points="34,0 58,0 58,16 42,18 38,10" fill="#4D9FD6" />
        <polygon points="6,18 26,15 29,27 6,30" fill="#2B6CB0" />
        <polygon points="42,18 58,16 58,32 44,33 40,26" fill="#F6B93B" />
        <polygon points="6,30 24,28 26,40 10,44" fill="#E8762C" />
        <polygon points="44,33 58,32 58,46 46,50 40,42" fill="#E8762C" />
        <polygon points="26,40 40,38 44,52 30,58" fill="#4D9FD6" />
        <polygon points="10,44 26,42 30,58 18,64" fill="#F6B93B" />
        <polygon points="30,58 46,50 40,64 30,64" fill="#2B6CB0" />
        {/* thin street lines */}
        <g stroke="#FFFFFF" strokeWidth="1.6" strokeLinecap="round" fill="none" opacity="0.9">
          <path d="M4 18 L60 14" />
          <path d="M6 31 L58 29" />
          <path d="M8 44 L56 44" />
          <path d="M27 2 L33 62" />
          <path d="M43 6 L41 58" />
          <path d="M14 4 L20 60" />
        </g>
        {/* plaza ring near the top */}
        <circle cx="35" cy="21" r="8.5" fill="none" stroke="#F6B93B" strokeWidth="5" />
        <circle cx="35" cy="21" r="3.2" fill="#FFFFFF" />
      </g>

      {/* pin outline */}
      <path
        d="M32 3C18.7 3 9 12.9 9 25.6 9 41.5 28.2 58.3 31 60.6a1.6 1.6 0 0 0 2 0C35.8 58.3 55 41.5 55 25.6 55 12.9 45.3 3 32 3Z"
        fill="none"
        stroke="#14477D"
        strokeWidth="3"
        strokeLinejoin="round"
      />
    </svg>
  );
}
