import type { Appointment, Lead } from "./admin-data";

/** Stored in the existing notes field, alongside readable service selections. */
export function bookingAmount(a: Appointment, leads: Lead[] = []) {
  const snapshot = a.notes.match(/^Booking total: \$([\d.]+)$/m);
  if (snapshot) return Number(snapshot[1]);
  const lead = leads.find((l) => l.id === a.lead_id);
  return lead?.estimated_value ?? a.service?.price_from ?? 0;
}
export const serviceMode = (a: Pick<Appointment, "location">) => a.location.startsWith("Mobile — ") ? "Mobile" : "Drop-off";

export function overlapsBooking(rows: Pick<Appointment, "id" | "starts_at" | "duration_hours" | "status">[], start: string, duration: number, excludeId?: string) {
  const s = Date.parse(start);
  const e = s + duration * 3600000;
  return rows.some((a) => a.id !== excludeId && !["cancelled", "no_show"].includes(a.status) && s < Date.parse(a.starts_at) + Number(a.duration_hours) * 3600000 && Date.parse(a.starts_at) < e);
}

export function receivedRevenue(payments: { amount: number; status: string }[]) {
  return payments.filter((p) => p.status === "paid").reduce((sum, p) => sum + p.amount, 0);
}

export function exportCsv(filename: string, headers: string[], rows: (string | number | null | undefined)[][]) {
  const escape = (v: string | number | null | undefined) => {
    const text = String(v ?? "");
    const safe = /^[=+\-@\t\r]/.test(text) ? `'${text}` : text;
    return `"${safe.replaceAll('"', '""')}"`;
  };
  const blob = new Blob([[headers, ...rows].map((r) => r.map(escape).join(",")).join("\r\n")], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

export const adminHead = (page: string) => ({ meta: [
  { title: `${page} — Tru Detailerz` },
  { name: "description", content: `Manage ${page.toLowerCase()} in the Tru Detailerz business workspace.` },
  { property: "og:title", content: `${page} — Tru Detailerz` },
  { property: "og:description", content: `Tru Detailerz ${page.toLowerCase()} workspace.` },
  { property: "og:type", content: "website" },
  { name: "twitter:card", content: "summary" },
  { name: "robots", content: "noindex" },
] });