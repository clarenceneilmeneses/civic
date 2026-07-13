"use client";

import EntityList, { StatusBadge } from "@/components/admin/EntityList";
import { Tag } from "@/components/ui";
import { formatDate, LEGISLATION_KIND_LABELS } from "@/lib/utils";

export default function AdminLegislationPage() {
  return (
    <EntityList
      table="legislation"
      title="Legislation"
      basePath="/admin/legislation"
      searchColumns={["title", "number", "summary"]}
      orderBy="date_approved"
      description="Ordinances, resolutions, executive orders, administrative orders, and proclamations."
      columns={[
        { key: "number", label: "Number", render: (r) => <span className="font-bold text-slate-600">{r.number}</span> },
        {
          key: "title",
          label: "Title",
          render: (r) => <span className="font-semibold text-navy">{r.title}</span>,
        },
        {
          key: "kind",
          label: "Kind",
          render: (r) => <Tag className="bg-sky text-navy">{LEGISLATION_KIND_LABELS[r.kind]}</Tag>,
        },
        { key: "date_approved", label: "Approved", render: (r) => formatDate(r.date_approved) },
        { key: "status", label: "Status", render: (r) => <StatusBadge status={r.status} /> },
      ]}
    />
  );
}
