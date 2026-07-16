"use client";

import { CalendarPlus } from "lucide-react";

function icsDate(d: Date) {
  return d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}

function icsEscape(text: string) {
  return text
    .replace(/\\/g, "\\\\")
    .replace(/[,;]/g, (m) => `\\${m}`)
    .replace(/\r?\n/g, "\\n");
}

export default function AddToCalendarButton({
  title,
  description,
  location,
  startsAt,
  endsAt,
  slug,
}: {
  title: string;
  description?: string | null;
  location?: string | null;
  startsAt: string;
  endsAt?: string | null;
  slug: string;
}) {
  function download() {
    const start = new Date(startsAt);
    // Events without an end time get a 2-hour block.
    const end = endsAt ? new Date(endsAt) : new Date(start.getTime() + 2 * 3_600_000);
    const lines = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Batangas Youth Civic Hub//EN",
      "BEGIN:VEVENT",
      `UID:${slug}@batangas-youth-civic-hub`,
      `DTSTAMP:${icsDate(new Date())}`,
      `DTSTART:${icsDate(start)}`,
      `DTEND:${icsDate(end)}`,
      `SUMMARY:${icsEscape(title)}`,
      description ? `DESCRIPTION:${icsEscape(description)}` : "",
      location ? `LOCATION:${icsEscape(location)}` : "",
      `URL:${window.location.href}`,
      "END:VEVENT",
      "END:VCALENDAR",
    ].filter(Boolean);
    const blob = new Blob([lines.join("\r\n")], {
      type: "text/calendar;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${slug}.ics`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  return (
    <button onClick={download} className="btn-outline">
      <CalendarPlus className="h-4 w-4" /> Add to calendar
    </button>
  );
}
