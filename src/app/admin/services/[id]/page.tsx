"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { cacheGet, cacheSet } from "@/lib/adminCache";
import EntityForm from "@/components/admin/EntityForm";

type Option = { value: string; label: string };

export default function AdminServiceForm({
  params,
}: {
  params: { id: string };
}) {
  const [departments, setDepartments] = useState<Option[] | null>(
    () => cacheGet<Option[]>("options:departments") ?? null
  );

  useEffect(() => {
    if (departments) return;
    const supabase = createClient();
    supabase
      .from("departments")
      .select("id, name")
      .order("sort_order")
      .then(({ data }) => {
        const options = [
          { value: "", label: "— No department —" },
          ...(data ?? []).map((d) => ({ value: d.id, label: d.name })),
        ];
        cacheSet("options:departments", options);
        setDepartments(options);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!departments) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
      </div>
    );
  }

  return (
    <EntityForm
      table="services"
      id={params.id}
      title="service"
      listHref="/admin/services"
      fields={[
        { name: "title", label: "Service name", type: "text", required: true, full: true },
        { name: "department_id", label: "Department", type: "select", options: departments },
        { name: "sort_order", label: "Sort order", type: "number" },
        { name: "fee", label: "Fee", type: "text", placeholder: "e.g. Free, ₱100–₱300" },
        { name: "processing_time", label: "Processing time", type: "text", placeholder: "e.g. 3 working days" },
        { name: "summary", label: "Summary", type: "textarea" },
        {
          name: "steps",
          label: "How-to steps (one per line)",
          type: "lines",
          placeholder: "Secure a barangay clearance\nFill out the application form\n…",
          help: "Each line becomes a numbered step on the public page.",
        },
        { name: "form_url", label: "Downloadable form (PDF)", type: "file" },
      ]}
      defaults={{
        title: "",
        department_id: "",
        sort_order: 0,
        fee: "",
        processing_time: "",
        summary: "",
        steps: [],
        form_url: null,
      }}
    />
  );
}
