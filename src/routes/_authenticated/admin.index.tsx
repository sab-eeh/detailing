import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { CalendarCheck, CalendarClock, DollarSign, Users, UserPlus, CheckCheck, Plus, ArrowUpRight } from "lucide-react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Button } from "@/components/ui/button";
import { Kpi, Panel, PageTitle, RowsSkeleton, StatusBadge, EmptyState, ErrorState, selectCls } from "@/components/admin/ui";
import { BookingWizard } from "@/components/admin/BookingWizard";
import { CustomerDialog } from "@/components/admin/RecordDialogs";
import { AppointmentSheet } from "@/components/admin/AppointmentSheet";
import { useAppointments, useCustomers, useFollowUps, useLeads, useRecentActivity } from "@/lib/admin-data";
import { dayKey, fmtDate, fmtTime, fullName, money, timeAgo, vehicleName } from "@/lib/format";
import { adminHead, bookingAmount } from "@/lib/workspace";

export const Route = createFileRoute("/_authenticated/admin/")({ head: () => adminHead("Overview"), component: Overview });
function greeting() {
  const h = Number(new Intl.DateTimeFormat("en-US", { timeZone: "America/Toronto", hour: "numeric", hour12: false }).format(new Date()));
  return h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening";
}
function Overview() {
  const leads = useLeads(); const appts = useAppointments(); const customers = useCustomers(); const fus = useFollowUps(); const activity = useRecentActivity();
  const [period, setPeriod] = useState("30"); const [dialog, setDialog] = useState<"booking" | "customer" | null>(null); const [selected, setSelected] = useState<string | null>(null);
  const today = dayKey(new Date()); const L = leads.data ?? []; const A = appts.data ?? []; const days = Number(period);
  const cutoff = Date.now() - days * 86400000; const inPeriod = (d: string) => Date.parse(d) >= cutoff && Date.parse(d) <= Date.now();
  const jobs = period === "all" ? A : A.filter((a) => inPeriod(a.starts_at));
  const newLeads = period === "all" ? L : L.filter((l) => inPeriod(l.created_at));
  const schedule = A.filter((a) => dayKey(a.starts_at) === today && !["cancelled", "no_show"].includes(a.status));
  const pending = (fus.data ?? []).filter((f) => ["pending", "scheduled"].includes(f.status));
  const chartDays = Array.from({ length: 14 }, (_, i) => new Date(Date.now() - (13 - i) * 86400000));
  const chart = chartDays.map((d) => ({ date: fmtDate(d), value: A.filter((a) => a.status !== "cancelled" && dayKey(a.starts_at) === dayKey(d)).reduce((s, a) => s + bookingAmount(a, L), 0) }));
  if (leads.isError || appts.isError || customers.isError) return <ErrorState error={leads.error ?? appts.error ?? customers.error} retry={() => { leads.refetch(); appts.refetch(); customers.refetch(); }} />;
  return <div className="space-y-7">
    <PageTitle title={`${greeting()}.`} subtitle="Here's your business overview for today." actions={<><Button variant="outline" onClick={() => setDialog("customer")}><UserPlus /> Add customer</Button><Button onClick={() => setDialog("booking")}><Plus /> New booking</Button></>} />
    <div className="flex flex-wrap items-center justify-between gap-3 text-sm"><p className="text-slate">{fmtDate(new Date(), { weekday: "long", month: "long", day: "numeric", year: "numeric" })}</p><select aria-label="Overview period" className={selectCls} value={period} onChange={(e) => setPeriod(e.target.value)}><option value="7">Last 7 days</option><option value="30">Last 30 days</option><option value="365">Last year</option><option value="all">All time</option></select></div>
    {leads.isLoading || appts.isLoading || customers.isLoading ? <RowsSkeleton /> : <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
      <Kpi icon={DollarSign} label="Revenue received" value="—" hint="Payment recording is not connected" />
      <Kpi icon={CalendarCheck} label="Total bookings" value={jobs.length} hint={`${A.filter((a) => Date.parse(a.starts_at) > Date.now() && !["completed", "cancelled", "no_show"].includes(a.status)).length} upcoming`} />
      <Kpi icon={UserPlus} label="New inquiries" value={newLeads.length} hint={`${L.filter((l) => l.status === "new").length} awaiting a response`} />
      <Kpi icon={Users} label="Total customers" value={customers.data?.length ?? 0} hint={`${customers.data?.filter((c) => inPeriod(c.created_at)).length ?? 0} added in this period`} />
      <Kpi icon={CalendarClock} label="Pending bookings" value={A.filter((a) => a.status === "requested").length} hint="Awaiting confirmation" />
      <Kpi icon={CheckCheck} label="Completed services" value={jobs.filter((a) => a.status === "completed").length} hint="Completed in selected period" />
    </div>}
    <div className="grid gap-8 xl:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
      <Panel title="Booking value · last 14 days" action={<Link to="/admin/revenue" className="text-xs font-semibold text-primary">Financial overview <ArrowUpRight className="inline h-3 w-3" /></Link>}>
        <div className="mb-4"><p className="tabular text-3xl font-bold">{money(chart.reduce((s, d) => s + d.value, 0))}</p><p className="mt-1 text-xs text-slate">Scheduled value, not payments received</p></div>
        <ResponsiveContainer width="100%" height={220}><AreaChart data={chart} margin={{ left: -15, right: 10 }}><CartesianGrid vertical={false} stroke="var(--border)" /><XAxis dataKey="date" tick={{ fontSize: 10, fill: "var(--slate)" }} axisLine={false} tickLine={false} minTickGap={25} /><YAxis tick={{ fontSize: 10, fill: "var(--slate)" }} axisLine={false} tickLine={false} /><Tooltip formatter={(v: number) => money(v)} contentStyle={{ border: "1px solid var(--border)", borderRadius: 10 }} /><Area dataKey="value" name="Booking value" stroke="var(--primary)" fill="var(--info-soft)" strokeWidth={2} /></AreaChart></ResponsiveContainer>
      </Panel>
      <Panel title="Needs attention" action={<Link to="/admin/leads" className="text-xs font-semibold text-primary">All inquiries →</Link>}>
        <div className="grid gap-2 border-b pb-4 text-sm"><Link to="/admin/appointments" className="flex justify-between py-2"><span>Bookings awaiting confirmation</span><span className="font-semibold text-warning">{A.filter((a) => a.status === "requested").length}</span></Link><Link to="/admin/leads" search={{ status: "new" }} className="flex justify-between py-2"><span>Inquiries awaiting response</span><span className="font-semibold text-primary">{L.filter((l) => l.status === "new").length}</span></Link></div>
        {pending.length ? <ul className="divide-y">{pending.slice(0, 4).map((f) => <li key={f.id}><Link to="/admin/customers/$id" params={{ id: f.customer_id }} className="flex items-center justify-between gap-3 py-3"><div className="min-w-0"><p className="text-sm font-semibold">{fullName(f.customer)}</p><p className="truncate text-xs text-slate">{f.reason}</p></div><span className="shrink-0 text-xs text-slate">{fmtDate(f.next_contact_at)}</span></Link></li>)}</ul> : <EmptyState title="No pending reminders" />}
      </Panel>
    </div>
    <Panel title="Today's schedule" action={<Link to="/admin/appointments" className="text-xs font-semibold text-primary">View all bookings →</Link>}>
      {schedule.length ? <div className="divide-y">{schedule.map((a) => <Button key={a.id} variant="ghost" className="h-auto w-full justify-start gap-4 whitespace-normal rounded-none px-0 py-4 text-left" onClick={() => setSelected(a.id)}><span className="tabular w-20 shrink-0 font-semibold">{fmtTime(a.starts_at)}</span><span className="min-w-0 flex-1"><span className="block font-semibold">{fullName(a.customer)}</span><span className="block text-xs text-slate">{vehicleName(a.vehicle)} · {a.service?.name}</span></span><span className="hidden font-semibold sm:block">{money(bookingAmount(a, L))}</span><StatusBadge status={a.status} /></Button>)}</div> : <EmptyState title="No bookings scheduled today" action={<Button variant="outline" onClick={() => setDialog("booking")}><Plus /> New booking</Button>} />}
    </Panel>
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]"><Panel title="Recent inquiries" action={<Link to="/admin/leads" className="text-xs font-semibold text-primary">View all →</Link>} bodyClass="p-0"><ul className="divide-y">{L.slice(0, 5).map((l) => <li key={l.id}><Link to="/admin/leads/$id" params={{ id: l.id }} className="flex items-center gap-3 py-4"><div className="min-w-0 flex-1"><p className="font-semibold text-sm">{fullName(l.customer)}</p><p className="truncate text-xs text-slate">{vehicleName(l.vehicle)} · {l.service?.name}</p></div><StatusBadge status={l.status} /><span className="hidden text-xs text-slate sm:block">{timeAgo(l.created_at)}</span></Link></li>)}</ul>{!L.length && <EmptyState title="No inquiries yet" />}</Panel><Panel title="Business activity" bodyClass="p-0"><ul className="divide-y">{activity.data?.slice(0, 5).map((a) => <li key={a.id} className="py-4"><p className="text-sm font-medium">{a.title}</p><p className="mt-1 text-xs text-slate">{fullName(a.customer)} · {timeAgo(a.created_at)}</p></li>)}</ul>{!activity.data?.length && <EmptyState title="No activity yet" />}</Panel></div>
    {dialog === "booking" && <BookingWizard onClose={() => setDialog(null)} />}{dialog === "customer" && <CustomerDialog onClose={() => setDialog(null)} />}<AppointmentSheet appt={A.find((a) => a.id === selected) ?? null} onClose={() => setSelected(null)} />
  </div>;
}
