import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import AdminSidebar from "@/components/admin/AdminSidebar";

export const metadata: Metadata = {
  title: { default: "Admin", template: "%s · Admin · Batangas Youth Civic Hub" },
  robots: { index: false, follow: false },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/admin");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, full_name")
    .eq("id", user.id)
    .single();

  if (!profile || profile.role === "citizen") {
    redirect("/?error=not-authorized");
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      <AdminSidebar
        role={profile.role}
        name={profile.full_name ?? user.email ?? "Staff"}
      />
      <main className="min-w-0 flex-1 p-4 pt-20 sm:p-8 lg:pt-8">{children}</main>
    </div>
  );
}
