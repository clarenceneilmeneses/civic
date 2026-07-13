"use client";

import EntityForm from "@/components/admin/EntityForm";

export default function AdminHotlineForm({
  params,
}: {
  params: { id: string };
}) {
  return (
    <EntityForm
      table="hotlines"
      id={params.id}
      title="hotline"
      listHref="/admin/hotlines"
      fields={[
        { name: "name", label: "Name", type: "text", required: true, placeholder: "e.g. Batangas City Police Station" },
        {
          name: "category",
          label: "Category",
          type: "select",
          options: [
            { value: "Emergency", label: "Emergency" },
            { value: "Health", label: "Health" },
            { value: "City Services", label: "City Services" },
          ],
        },
        { name: "sort_order", label: "Sort order", type: "number" },
        {
          name: "numbers",
          label: "Phone numbers (one per line)",
          type: "lines",
          required: true,
          placeholder: "(043) 723-2130\n0998-598-5972",
        },
      ]}
      defaults={{ name: "", category: "Emergency", sort_order: 0, numbers: [] }}
    />
  );
}
