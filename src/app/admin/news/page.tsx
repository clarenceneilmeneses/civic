"use client";

import EntityList, { StatusBadge } from "@/components/admin/EntityList";
import { Tag } from "@/components/ui";
import { formatDate } from "@/lib/utils";

export default function AdminNewsPage() {
  return (
    <EntityList
      table="posts"
      title="News & Announcements"
      basePath="/admin/news"
      searchColumns={["title", "excerpt"]}
      description="Articles and advisories shown on the home page and newsroom."
      columns={[
        {
          key: "title",
          label: "Title",
          render: (r) => <span className="font-semibold text-navy">{r.title}</span>,
        },
        {
          key: "type",
          label: "Type",
          render: (r) => (
            <Tag colorKey={r.type}>{r.type === "announcement" ? "Announcement" : "News"}</Tag>
          ),
        },
        { key: "status", label: "Status", render: (r) => <StatusBadge status={r.status} /> },
        {
          key: "published_at",
          label: "Published",
          render: (r) => formatDate(r.published_at),
        },
      ]}
    />
  );
}
