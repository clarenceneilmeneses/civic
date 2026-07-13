"use client";

import EntityList, { StatusBadge } from "@/components/admin/EntityList";
import { Tag } from "@/components/ui";

export default function AdminDocumentsPage() {
  return (
    <EntityList
      table="documents"
      title="Documents & Forms"
      basePath="/admin/documents"
      searchColumns={["title", "description", "office"]}
      description="Full disclosure documents and downloadable forms."
      columns={[
        {
          key: "title",
          label: "Title",
          render: (r) => <span className="font-semibold text-navy">{r.title}</span>,
        },
        { key: "category", label: "Category", render: (r) => <Tag className="bg-sky text-navy">{r.category}</Tag> },
        { key: "office", label: "Office" },
        { key: "year", label: "Year" },
        { key: "status", label: "Status", render: (r) => <StatusBadge status={r.status} /> },
      ]}
    />
  );
}
