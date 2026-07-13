import BrandMark from "@/components/BrandMark";

export default function Loading() {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 py-20">
      <BrandMark className="h-16 w-16 animate-bounce" title="Loading" />
      <p className="text-sm font-medium text-slate-500">Loading…</p>
    </div>
  );
}
