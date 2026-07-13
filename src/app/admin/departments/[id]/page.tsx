"use client";

import EntityForm from "@/components/admin/EntityForm";

export default function AdminDepartmentForm({
  params,
}: {
  params: { id: string };
}) {
  return (
    <EntityForm
      table="departments"
      id={params.id}
      title="department"
      listHref="/admin/departments"
      fields={[
        { name: "name", label: "Department name", type: "text", required: true, full: true },
        { name: "head_name", label: "Department head", type: "text" },
        { name: "sort_order", label: "Sort order", type: "number" },
        { name: "location", label: "Location", type: "text", placeholder: "e.g. 2/F City Hall Main Building" },
        { name: "phone", label: "Phone", type: "text" },
        { name: "email", label: "Email", type: "text" },
        { name: "description", label: "Description", type: "textarea" },
      ]}
      defaults={{
        name: "",
        head_name: "",
        sort_order: 0,
        location: "",
        phone: "",
        email: "",
        description: "",
      }}
    />
  );
}
