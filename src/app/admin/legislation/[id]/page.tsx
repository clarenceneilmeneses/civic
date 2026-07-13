"use client";

import EntityForm from "@/components/admin/EntityForm";
import { LEGISLATION_KIND_LABELS } from "@/lib/utils";

export default function AdminLegislationForm({
  params,
}: {
  params: { id: string };
}) {
  return (
    <EntityForm
      table="legislation"
      id={params.id}
      title="legislation"
      listHref="/admin/legislation"
      fields={[
        {
          name: "kind",
          label: "Kind",
          type: "select",
          options: Object.entries(LEGISLATION_KIND_LABELS).map(([value, label]) => ({ value, label })),
        },
        { name: "number", label: "Number", type: "text", required: true, placeholder: "e.g. CO 2026-015" },
        { name: "title", label: "Title", type: "text", required: true, full: true },
        { name: "date_approved", label: "Date approved", type: "date" },
        {
          name: "status",
          label: "Status",
          type: "select",
          options: [
            { value: "draft", label: "Draft" },
            { value: "published", label: "Published (admins only)" },
          ],
        },
        { name: "summary", label: "Summary", type: "textarea" },
        { name: "pdf_url", label: "Full text (PDF)", type: "file" },
      ]}
      defaults={{
        kind: "ordinance",
        number: "",
        title: "",
        date_approved: "",
        status: "draft",
        summary: "",
        pdf_url: null,
      }}
    />
  );
}
