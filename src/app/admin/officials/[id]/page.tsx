"use client";

import EntityForm from "@/components/admin/EntityForm";

export default function AdminOfficialForm({
  params,
}: {
  params: { id: string };
}) {
  return (
    <EntityForm
      table="officials"
      id={params.id}
      title="official"
      listHref="/admin/officials"
      fields={[
        { name: "name", label: "Full name", type: "text", required: true, placeholder: "Hon. Juan D. Dela Cruz" },
        { name: "position", label: "Position", type: "text", required: true, placeholder: "City Councilor" },
        {
          name: "grouping",
          label: "Grouping",
          type: "select",
          options: [
            { value: "City Officials", label: "City Officials" },
            { value: "Sangguniang Panlungsod", label: "Sangguniang Panlungsod" },
            { value: "SK Federation", label: "SK Federation" },
          ],
        },
        { name: "sort_order", label: "Sort order", type: "number" },
        { name: "photo_url", label: "Photo", type: "image" },
      ]}
      defaults={{
        name: "",
        position: "",
        grouping: "City Officials",
        sort_order: 0,
        photo_url: null,
      }}
    />
  );
}
