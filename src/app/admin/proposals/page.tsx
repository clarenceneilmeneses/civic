"use client";

import EntityList, { StatusBadge } from "@/components/admin/EntityList";
import { Tag } from "@/components/ui";
import { formatDate } from "@/lib/utils";

export default function AdminProposalsPage() {
  return (
    <EntityList
      table="proposals"
      title="Proposals"
      basePath="/admin/proposals"
      searchColumns={["title", "summary"]}
      description="Proposed ordinances open for public comment (Get Involved section)."
      columns={[
        {
          key: "title",
          label: "Title",
          render: (r) => <span className="font-semibold text-navy">{r.title}</span>,
        },
        {
          key: "proposal_status",
          label: "Comments",
          render: (r) => (
            <Tag className={r.proposal_status === "open" ? "bg-marigold/80 text-navy" : "bg-slate-200 text-slate-600"}>
              {r.proposal_status}
            </Tag>
          ),
        },
        { key: "comments_close_at", label: "Closes", render: (r) => formatDate(r.comments_close_at) },
        { key: "status", label: "Status", render: (r) => <StatusBadge status={r.status} /> },
      ]}
    />
  );
}
