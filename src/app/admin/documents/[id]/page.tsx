"use client";

import EntityForm from "@/components/admin/EntityForm";
import { DOCUMENT_CATEGORIES } from "@/lib/utils";

export default function AdminDocumentForm({
  params,
}: {
  params: { id: string };
}) {
  return (
    <EntityForm
      table="documents"
      id={params.id}
      title="document"
      listHref="/admin/documents"
      fields={[
        { name: "title", label: "Title", type: "text", required: true, full: true },
        {
          name: "category",
          label: "Category",
          type: "select",
          options: DOCUMENT_CATEGORIES.map((c) => ({ value: c, label: c })),
        },
        { name: "office", label: "Issuing office", type: "text" },
        { name: "year", label: "Year", type: "number" },
        {
          name: "status",
          label: "Status",
          type: "select",
          options: [
            { value: "draft", label: "Draft" },
            { value: "published", label: "Published (admins only)" },
          ],
        },
        { name: "description", label: "Description", type: "textarea" },
        { name: "file_url", label: "File (PDF)", type: "file" },
      ]}
      defaults={{
        title: "",
        category: "Forms",
        office: "",
        year: new Date().getFullYear(),
        status: "draft",
        description: "",
        file_url: null,
      }}
    />
  );
}
