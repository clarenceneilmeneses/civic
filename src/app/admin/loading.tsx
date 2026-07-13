import { Loader2 } from "lucide-react";

export default function AdminLoading() {
  return (
    <div className="flex h-[60vh] items-center justify-center">
      <Loader2 className="h-7 w-7 animate-spin text-slate-400" />
    </div>
  );
}
