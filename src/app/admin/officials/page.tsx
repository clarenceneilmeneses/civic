"use client";

import EntityList from "@/components/admin/EntityList";
import { InitialsAvatar } from "@/components/ui";

export default function AdminOfficialsPage() {
  return (
    <EntityList
      table="officials"
      title="Officials"
      basePath="/admin/officials"
      searchColumns={["name", "position"]}
      orderBy="sort_order"
      ascending
      description="City officials grid — grouped on the public page by the “Grouping” field."
      columns={[
        {
          key: "name",
          label: "Name",
          render: (r) => (
            <span className="flex items-center gap-3">
              {r.photo_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={r.photo_url} alt="" className="h-9 w-9 rounded-full object-cover" />
              ) : (
                <InitialsAvatar name={r.name} className="h-9 w-9 text-xs" />
              )}
              <span className="font-semibold text-navy">{r.name}</span>
            </span>
          ),
        },
        { key: "position", label: "Position" },
        { key: "grouping", label: "Grouping" },
        { key: "sort_order", label: "Order" },
      ]}
    />
  );
}
