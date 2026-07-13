"use client";

import EntityList from "@/components/admin/EntityList";

export default function AdminHotlinesPage() {
  return (
    <EntityList
      table="hotlines"
      title="Hotlines"
      basePath="/admin/hotlines"
      searchColumns={["name"]}
      orderBy="sort_order"
      ascending
      description="Emergency and service numbers. The first four “Emergency” entries appear on the home page strip."
      columns={[
        {
          key: "name",
          label: "Hotline",
          render: (r) => <span className="font-semibold text-navy">{r.name}</span>,
        },
        {
          key: "numbers",
          label: "Numbers",
          render: (r) => (r.numbers as string[]).join(", "),
        },
        { key: "category", label: "Category" },
        { key: "sort_order", label: "Order" },
      ]}
    />
  );
}
