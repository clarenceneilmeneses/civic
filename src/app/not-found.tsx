import Link from "next/link";
import BrandMark from "@/components/BrandMark";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-5 bg-cream/40 px-4 text-center">
      <BrandMark className="h-20 w-20" title="" />
      <h1 className="font-display text-4xl font-bold tracking-tight text-navy">
        Page not found
      </h1>
      <p className="max-w-md text-slate-600">
        The page you're looking for doesn't exist or may have been moved.
      </p>
      <Link href="/" className="btn-primary">
        Back to home
      </Link>
    </div>
  );
}
