"use client";

import EntityList from "@/components/admin/EntityList";

export default function AdminDepartmentsPage() {
  return (
    <EntityList
      table="departments"
      title="Departments"
      basePath="/admin/departments"
      searchColumns={["name", "head_name"]}
      orderBy="sort_order"
      ascending
      description="City offices shown in the directory and used to group services."
      columns={[
        {
          key: "name",
          label: "Department",
          render: (r) => <span className="font-semibold text-navy">{r.name}</span>,
        },
        { key: "head_name", label: "Head" },
        { key: "phone", label: "Phone" },
        { key: "sort_order", label: "Order" },
      ]}
    />
  );
}
