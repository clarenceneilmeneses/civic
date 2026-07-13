"use client";

import { useCallback, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Loader2, MessageSquare } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { InitialsAvatar } from "./ui";
import { formatDateTime } from "@/lib/utils";

type CommentRow = {
  id: string;
  body: string;
  approved: boolean;
  created_at: string;
  user_id: string;
  profiles: { full_name: string | null } | null;
};

export default function CommentSection({
  proposalId,
  commentsOpen,
}: {
  proposalId: string;
  commentsOpen: boolean;
}) {
  const supabase = createClient();
  const router = useRouter();
  const pathname = usePathname();
  const [comments, setComments] = useState<CommentRow[] | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [body, setBody] = useState("");
  const [posting, setPosting] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    setUserId(user?.id ?? null);
    const { data, error } = await supabase
      .from("proposal_comments")
      .select("id, body, approved, created_at, user_id, profiles(full_name)")
      .eq("proposal_id", proposalId)
      .order("created_at", { ascending: false });
    if (error) setError("Couldn't load comments.");
    else setComments((data as unknown as CommentRow[]) ?? []);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [proposalId]);

  useEffect(() => {
    load();
  }, [load]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setNotice(null);
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      router.push(`/login?next=${encodeURIComponent(pathname)}`);
      return;
    }
    if (!body.trim()) return;
    setPosting(true);
    const { error } = await supabase.from("proposal_comments").insert({
      proposal_id: proposalId,
      user_id: user.id,
      body: body.trim(),
    });
    setPosting(false);
    if (error) {
      setError("Couldn't post your comment. Please try again.");
      return;
    }
    setBody("");
    setNotice(
      "Salamat! Your comment was submitted and will appear once approved by a moderator."
    );
    load();
  }

  return (
    <section aria-labelledby="comments-heading" className="mt-10">
      <h2
        id="comments-heading"
        className="display-heading flex items-center gap-2 text-lg text-navy"
      >
        <MessageSquare className="h-5 w-5 text-orange" /> Public comments
      </h2>

      {commentsOpen ? (
        <form onSubmit={submit} className="card mt-4 p-5">
          <label htmlFor="comment-body" className="label">
            Share your thoughts on this proposal
          </label>
          <textarea
            id="comment-body"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={4}
            required
            maxLength={2000}
            placeholder="Be specific — which provision do you support or want changed, and why?"
            className="input resize-y"
          />
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <button disabled={posting} className="btn-primary">
              {posting && <Loader2 className="h-4 w-4 animate-spin" />}
              Submit comment
            </button>
            <p className="text-xs text-slate-500">
              Comments are moderated and appear after approval.
            </p>
          </div>
          {notice && (
            <p className="mt-3 rounded-lg bg-sky/40 px-4 py-2 text-sm font-medium text-navy">
              {notice}
            </p>
          )}
          {error && (
            <p className="mt-3 text-sm font-medium text-brick">{error}</p>
          )}
        </form>
      ) : (
        <p className="card mt-4 bg-slate-50 p-5 text-sm text-slate-600">
          The comment period for this proposal has closed. Thank you to everyone
          who participated.
        </p>
      )}

      <div className="mt-6 space-y-4">
        {comments === null ? (
          <p className="flex items-center gap-2 text-sm text-slate-500">
            <Loader2 className="h-4 w-4 animate-spin" /> Loading comments…
          </p>
        ) : comments.length === 0 ? (
          <p className="text-sm text-slate-500">
            No public comments yet — be the first to weigh in.
          </p>
        ) : (
          comments.map((c) => {
            const name = c.profiles?.full_name ?? "Citizen";
            const isMinePending = !c.approved && c.user_id === userId;
            return (
              <article
                key={c.id}
                className={`card p-5 ${isMinePending ? "border border-dashed border-marigold" : ""}`}
              >
                <div className="flex items-center gap-3">
                  <InitialsAvatar name={name} className="h-9 w-9 text-sm" />
                  <div>
                    <p className="text-sm font-bold text-navy">{name}</p>
                    <p className="text-xs text-slate-500">
                      {formatDateTime(c.created_at)}
                      {isMinePending && (
                        <span className="ml-2 font-semibold text-orange">
                          · Pending approval (visible only to you)
                        </span>
                      )}
                    </p>
                  </div>
                </div>
                <p className="mt-3 whitespace-pre-line text-sm text-slate-700">
                  {c.body}
                </p>
              </article>
            );
          })
        )}
      </div>
    </section>
  );
}
