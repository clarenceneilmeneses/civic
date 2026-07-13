import type { MetadataRoute } from "next";
import { createClient } from "@/lib/supabase/server";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const supabase = createClient();

  const staticPages = [
    "",
    "/youth",
    "/youth/opportunities",
    "/youth/get-involved",
    "/transparency",
    "/transparency/documents",
    "/services",
    "/news",
    "/government/officials",
    "/government/departments",
    "/government/sk",
    "/contact",
    "/contact/hotlines",
  ].map((p) => ({ url: `${base}${p}`, changeFrequency: "daily" as const }));

  const [{ data: posts }, { data: events }, { data: proposals }] =
    await Promise.all([
      supabase.from("posts").select("slug, updated_at").eq("status", "published"),
      supabase.from("events").select("slug, updated_at").eq("status", "published"),
      supabase.from("proposals").select("slug, updated_at").eq("status", "published"),
    ]);

  return [
    ...staticPages,
    ...(posts ?? []).map((p) => ({
      url: `${base}/news/${p.slug}`,
      lastModified: p.updated_at,
    })),
    ...(events ?? []).map((e) => ({
      url: `${base}/youth/events/${e.slug}`,
      lastModified: e.updated_at,
    })),
    ...(proposals ?? []).map((p) => ({
      url: `${base}/youth/get-involved/${p.slug}`,
      lastModified: p.updated_at,
    })),
  ];
}
