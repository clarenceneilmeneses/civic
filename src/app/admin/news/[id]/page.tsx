"use client";

import EntityForm from "@/components/admin/EntityForm";

export default function AdminNewsForm({ params }: { params: { id: string } }) {
  return (
    <EntityForm
      table="posts"
      id={params.id}
      title="article"
      listHref="/admin/news"
      slugFrom="title"
      hasPublishedAt
      fields={[
        { name: "title", label: "Title", type: "text", required: true, full: true },
        { name: "slug", label: "Slug", type: "text", required: true, help: "URL path, e.g. /news/your-slug. Auto-generated from the title." },
        {
          name: "type",
          label: "Type",
          type: "select",
          options: [
            { value: "news", label: "News" },
            { value: "announcement", label: "Announcement" },
          ],
        },
        { name: "category", label: "Category", type: "text", placeholder: "e.g. Youth, Environment, Advisory" },
        {
          name: "status",
          label: "Status",
          type: "select",
          options: [
            { value: "draft", label: "Draft" },
            { value: "published", label: "Published (admins only)" },
          ],
        },
        { name: "excerpt", label: "Excerpt", type: "textarea", help: "1–2 sentence teaser shown on cards and in search results." },
        { name: "cover_image", label: "Cover image", type: "image" },
        { name: "body", label: "Body", type: "richtext" },
      ]}
      defaults={{
        title: "",
        slug: "",
        type: "news",
        category: "",
        status: "draft",
        excerpt: "",
        cover_image: null,
        body: "",
      }}
    />
  );
}
