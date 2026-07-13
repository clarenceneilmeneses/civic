"use client";

import EntityList, { StatusBadge } from "@/components/admin/EntityList";
import { Tag } from "@/components/ui";
import { formatDateTime } from "@/lib/utils";

export default function AdminEventsPage() {
  return (
    <EntityList
      table="events"
      title="Events"
      basePath="/admin/events"
      searchColumns={["title", "venue", "organizer"]}
      orderBy="starts_at"
      description="Youth Hub activities. RSVPs are counted on the dashboard."
      columns={[
        {
          key: "title",
          label: "Event",
          render: (r) => <span className="font-semibold text-navy">{r.title}</span>,
        },
        { key: "category", label: "Category", render: (r) => <Tag colorKey={r.category}>{r.category}</Tag> },
        { key: "starts_at", label: "Starts", render: (r) => formatDateTime(r.starts_at) },
        { key: "status", label: "Status", render: (r) => <StatusBadge status={r.status} /> },
      ]}
    />
  );
}
