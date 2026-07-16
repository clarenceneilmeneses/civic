// Lightweight dashboard charts — plain HTML/CSS bars, no chart library.
// Data is aggregated by the caller from column-only selects; these components
// are pure presentation. Tooltips are CSS-only (group-hover), so everything
// server-renders.

export type MonthBucket = {
  label: string;
  posts: number;
  events: number;
};

export function MonthlyActivityChart({ months }: { months: MonthBucket[] }) {
  const max = Math.max(1, ...months.map((m) => Math.max(m.posts, m.events)));
  const h = (n: number) => (n === 0 ? 0 : Math.max(4, (n / max) * 100));

  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="font-display text-lg font-bold tracking-tight text-navy">
          Content added
        </h2>
        <div className="flex items-center gap-4 text-xs font-medium text-slate-500">
          <span className="flex items-center gap-1.5">
            <span aria-hidden="true" className="h-2.5 w-2.5 rounded-[3px] bg-royal" />
            Posts
          </span>
          <span className="flex items-center gap-1.5">
            <span aria-hidden="true" className="h-2.5 w-2.5 rounded-[3px] bg-orange" />
            Events
          </span>
        </div>
      </div>
      <p className="mt-0.5 text-xs text-slate-500">
        News and events created per month, last 6 months.
      </p>

      <div className="mt-5 flex gap-1 border-b border-slate-200 pb-px">
        {months.map((m) => (
          <div key={m.label} className="group relative flex-1">
            <div className="pointer-events-none absolute -top-8 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-lg bg-navy px-2.5 py-1 text-[11px] font-semibold text-white opacity-0 shadow-lift transition-opacity group-hover:opacity-100">
              {m.label}: {m.posts} post{m.posts === 1 ? "" : "s"} ·{" "}
              {m.events} event{m.events === 1 ? "" : "s"}
            </div>
            <div className="flex h-32 items-end justify-center gap-0.5 rounded-t group-hover:bg-slate-50">
              <div
                className="w-3 rounded-t bg-royal"
                style={{ height: `${h(m.posts)}%` }}
              />
              <div
                className="w-3 rounded-t bg-orange"
                style={{ height: `${h(m.events)}%` }}
              />
            </div>
          </div>
        ))}
      </div>
      <div className="flex gap-1">
        {months.map((m) => (
          <p
            key={m.label}
            className="flex-1 pt-2 text-center text-[11px] font-medium text-slate-500"
          >
            {m.label}
          </p>
        ))}
      </div>

      {/* Screen-reader table equivalent */}
      <table className="sr-only">
        <caption>News and events created per month, last 6 months</caption>
        <thead>
          <tr>
            <th>Month</th>
            <th>Posts</th>
            <th>Events</th>
          </tr>
        </thead>
        <tbody>
          {months.map((m) => (
            <tr key={m.label}>
              <td>{m.label}</td>
              <td>{m.posts}</td>
              <td>{m.events}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export type RsvpRow = {
  title: string;
  count: number;
  capacity: number | null;
};

export function RsvpChart({ events }: { events: RsvpRow[] }) {
  // Events without a capacity are scaled against the busiest event instead.
  const maxCount = Math.max(1, ...events.map((e) => e.count));

  return (
    <div>
      <h2 className="font-display text-lg font-bold tracking-tight text-navy">
        RSVPs — upcoming events
      </h2>
      <p className="mt-0.5 text-xs text-slate-500">
        Registrations against capacity for the next {events.length} event
        {events.length === 1 ? "" : "s"}.
      </p>

      {events.length === 0 ? (
        <p className="mt-6 text-sm text-slate-500">
          No upcoming published events.
        </p>
      ) : (
        <ul className="mt-5 space-y-4">
          {events.map((e) => {
            const denom = Math.max(1, e.capacity ?? maxCount);
            const pct = Math.min(100, (e.count / denom) * 100);
            return (
              <li key={e.title}>
                <div className="flex items-baseline justify-between gap-3">
                  <p className="truncate text-sm font-medium text-slate-700">
                    {e.title}
                  </p>
                  <p className="shrink-0 text-xs font-semibold text-navy">
                    {e.count}
                    {e.capacity ? ` / ${e.capacity}` : ""}
                  </p>
                </div>
                <div className="mt-1.5 h-2 rounded-full bg-navy/5">
                  <div
                    className="h-2 rounded-full bg-royal"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
