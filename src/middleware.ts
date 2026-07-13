import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const ROLE_COOKIE = "civic-role";

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Fast path: no Supabase session cookie at all → anonymous visitor.
  // Skip all auth work (this covers most public traffic).
  const hasSession = request.cookies
    .getAll()
    .some((c) => c.name.startsWith("sb-") && c.name.includes("-auth-token"));

  if (!hasSession) {
    if (path.startsWith("/admin")) {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      url.searchParams.set("next", path);
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // getClaims verifies the JWT locally (no network round-trip on projects
  // with asymmetric signing keys) — much faster than getUser() per request.
  // The admin layout still does a full getUser() + role check server-side.
  const { data: claimsData } = await supabase.auth.getClaims();
  const userId = (claimsData?.claims?.sub as string | undefined) ?? null;

  if (path.startsWith("/admin")) {
    if (!userId) {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      url.searchParams.set("next", path);
      return NextResponse.redirect(url);
    }
    return response;
  }

  // Staff accounts live in the CRM: keep admins/editors out of the public
  // site. Role comes from a UX cookie (set at login / first pass) so we don't
  // query the database on every request — real authorization is still
  // enforced by RLS and the admin layout.
  if (userId && !path.startsWith("/auth")) {
    let role: string = request.cookies.get(ROLE_COOKIE)?.value ?? "";
    if (!role) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", userId)
        .single();
      role = profile?.role ?? "citizen";
      response.cookies.set(ROLE_COOKIE, role, {
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
        sameSite: "lax",
      });
    }
    if (role === "admin" || role === "editor") {
      const url = request.nextUrl.clone();
      url.pathname = "/admin";
      url.search = "";
      return NextResponse.redirect(url);
    }
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|assets|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
