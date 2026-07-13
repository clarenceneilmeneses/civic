"use client";

import EntityForm from "@/components/admin/EntityForm";
import { EVENT_CATEGORIES } from "@/lib/utils";

export default function AdminEventForm({ params }: { params: { id: string } }) {
  return (
    <EntityForm
      table="events"
      id={params.id}
      title="event"
      listHref="/admin/events"
      slugFrom="title"
      fields={[
        { name: "title", label: "Title", type: "text", required: true, full: true },
        { name: "slug", label: "Slug", type: "text", required: true },
        {
          name: "category",
          label: "Category",
          type: "select",
          options: EVENT_CATEGORIES.map((c) => ({ value: c, label: c })),
        },
        { name: "starts_at", label: "Starts at", type: "datetime", required: true },
        { name: "ends_at", label: "Ends at", type: "datetime" },
        { name: "venue", label: "Venue", type: "text" },
        { name: "organizer", label: "Organizer", type: "text" },
        { name: "capacity", label: "Capacity", type: "number", help: "Leave empty for unlimited slots." },
        {
          name: "status",
          label: "Status",
          type: "select",
          options: [
            { value: "draft", label: "Draft" },
            { value: "published", label: "Published (admins only)" },
          ],
        },
        { name: "registration_open", label: "Registration open (RSVP enabled)", type: "checkbox" },
        { name: "summary", label: "Summary", type: "textarea" },
        { name: "cover_image", label: "Cover image", type: "image" },
        { name: "body", label: "Details", type: "richtext" },
      ]}
      defaults={{
        title: "",
        slug: "",
        category: "SK Programs",
        starts_at: "",
        ends_at: "",
        venue: "",
        organizer: "",
        capacity: "",
        status: "draft",
        registration_open: true,
        summary: "",
        cover_image: null,
        body: "",
      }}
    />
  );
}
