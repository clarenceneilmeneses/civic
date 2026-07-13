"use client";

import EntityForm from "@/components/admin/EntityForm";

export default function AdminProposalForm({
  params,
}: {
  params: { id: string };
}) {
  return (
    <EntityForm
      table="proposals"
      id={params.id}
      title="proposal"
      listHref="/admin/proposals"
      slugFrom="title"
      fields={[
        { name: "title", label: "Title", type: "text", required: true, full: true },
        { name: "slug", label: "Slug", type: "text", required: true },
        {
          name: "proposal_status",
          label: "Comment period",
          type: "select",
          options: [
            { value: "open", label: "Open for comments" },
            { value: "closed", label: "Closed" },
          ],
        },
        { name: "comments_close_at", label: "Comments close at", type: "datetime" },
        {
          name: "status",
          label: "Status",
          type: "select",
          options: [
            { value: "draft", label: "Draft" },
            { value: "published", label: "Published (admins only)" },
          ],
        },
        { name: "summary", label: "Summary", type: "textarea" },
        { name: "pdf_url", label: "Full draft (PDF)", type: "file" },
        { name: "body", label: "Body / key provisions", type: "richtext" },
      ]}
      defaults={{
        title: "",
        slug: "",
        proposal_status: "open",
        comments_close_at: "",
        status: "draft",
        summary: "",
        pdf_url: null,
        body: "",
      }}
    />
  );
}
