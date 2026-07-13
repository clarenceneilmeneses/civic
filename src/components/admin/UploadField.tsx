"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { FileText, Loader2, Trash2, UploadCloud } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function UploadField({
  value,
  onChange,
  bucket,
  accept,
  label,
}: {
  value: string | null;
  onChange: (url: string | null) => void;
  bucket: "images" | "documents";
  accept: string;
  label: string;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isImage = bucket === "images";

  async function upload(file: File) {
    setError(null);
    setUploading(true);
    const supabase = createClient();
    const path = `${new Date().getFullYear()}/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.\-_]/g, "")}`;
    const { error } = await supabase.storage.from(bucket).upload(path, file);
    setUploading(false);
    if (error) {
      setError(
        `Upload failed: ${error.message}. Make sure the "${bucket}" bucket exists (see supabase/schema.sql).`
      );
      return;
    }
    const {
      data: { publicUrl },
    } = supabase.storage.from(bucket).getPublicUrl(path);
    onChange(publicUrl);
  }

  return (
    <div>
      {value ? (
        <div className="flex items-center gap-4">
          {isImage ? (
            <div className="relative h-24 w-40 overflow-hidden rounded-lg border border-slate-200 bg-slate-100">
              <Image src={value} alt="Preview" fill className="object-cover" sizes="160px" />
            </div>
          ) : (
            <a
              href={value}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-royal hover:text-navy"
            >
              <FileText className="h-4 w-4" /> View uploaded file
            </a>
          )}
          <div className="flex flex-col gap-2">
            <button type="button" onClick={() => fileRef.current?.click()} className="btn-outline px-3 py-1.5 text-xs">
              <UploadCloud className="h-3.5 w-3.5" /> Replace
            </button>
            <button
              type="button"
              onClick={() => onChange(null)}
              className="btn px-3 py-1.5 text-xs text-brick hover:bg-brick/10"
            >
              <Trash2 className="h-3.5 w-3.5" /> Remove
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="flex w-full flex-col items-center gap-2 rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 px-4 py-8 text-sm font-medium text-slate-500 hover:border-azure hover:text-royal"
        >
          {uploading ? (
            <Loader2 className="h-6 w-6 animate-spin" />
          ) : (
            <UploadCloud className="h-6 w-6" />
          )}
          {uploading ? "Uploading…" : label}
        </button>
      )}
      <input
        ref={fileRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) upload(f);
          e.target.value = "";
        }}
      />
      {error && <p className="mt-2 text-sm font-medium text-brick">{error}</p>}
    </div>
  );
}
