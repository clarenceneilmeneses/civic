"use client";

import EntityList from "@/components/admin/EntityList";

export default function AdminServicesPage() {
  return (
    <EntityList
      table="services"
      title="Services"
      basePath="/admin/services"
      searchColumns={["title", "summary"]}
      orderBy="sort_order"
      ascending
      description="Step-by-step service guides shown on the Services page, grouped by department."
      columns={[
        {
          key: "title",
          label: "Service",
          render: (r) => <span className="font-semibold text-navy">{r.title}</span>,
        },
        { key: "fee", label: "Fee" },
        { key: "processing_time", label: "Processing time" },
        { key: "sort_order", label: "Order" },
      ]}
    />
  );
}
