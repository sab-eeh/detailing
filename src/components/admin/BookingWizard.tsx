import { useState } from "react";
import { Plus, ArrowLeft, ArrowRight, Check } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { CustomerDialog, VehicleDialog } from "./RecordDialogs";
import { inputSm, selectCls } from "./ui";
import { useCustomers, useVehicles, useServices, useAppointments, useInvalidate } from "@/lib/admin-data";
import { bookAppointment } from "@/lib/actions";
import { ADDONS, TIME_SLOTS } from "@/lib/knowledge";
import { dayKey, fullName, money, vehicleName } from "@/lib/format";
import { validateBookingSlot } from "@/lib/booking-validation";
import { overlapsBooking } from "@/lib/workspace";

const STEPS = ["Customer", "Vehicle", "Services", "Visit type", "Date & time", "Review"];
export function BookingWizard({ onClose, customerId = "", vehicleId = "", leadId, serviceId = "" }: { onClose: () => void; customerId?: string; vehicleId?: string; leadId?: string | null; serviceId?: string }) {
  const customers = useCustomers(); const vehicles = useVehicles(); const services = useServices(); const appointments = useAppointments(); const invalidate = useInvalidate();
  const [step, setStep] = useState(0); const [record, setRecord] = useState<"customer" | "vehicle" | null>(null); const [busy, setBusy] = useState(false);
  const [f, setF] = useState({ customer: customerId, vehicle: vehicleId, services: serviceId ? [serviceId] : [] as string[], addons: [] as string[], mode: "Drop-off", location: "", date: dayKey(new Date(Date.now() + 86400000)), time: "", notes: "" });
  const customer = customers.data?.find((c) => c.id === f.customer); const vehicle = vehicles.data?.find((v) => v.id === f.vehicle && v.customer_id === f.customer);
  const chosen = (services.data ?? []).filter((s) => f.services.includes(s.id) && s.active); const extras = ADDONS.filter((a) => f.addons.includes(a.slug));
  const duration = chosen.reduce((t, s) => t + Number(s.duration_hours), 0) + extras.reduce((t, a) => t + a.durationHours, 0);
  const price = chosen.reduce((t, s) => t + s.price_from, 0) + extras.reduce((t, a) => t + a.price, 0);
  const slots = TIME_SLOTS.map((time) => { try { const start = validateBookingSlot(f.date, time, duration); return { time, available: !appointments.isLoading && !appointments.isError && !overlapsBooking(appointments.data ?? [], start, duration) }; } catch { return { time, available: false }; } });
  const valid = [!!customer, !!vehicle, chosen.length > 0 && chosen.length <= 4 && duration <= 10, f.mode === "Drop-off" || !!f.location.trim(), slots.some((s) => s.time === f.time && s.available), true][step];
  const toggle = (key: "services" | "addons", value: string) => setF({ ...f, time: "", [key]: f[key].includes(value) ? f[key].filter((v) => v !== value) : [...f[key], value] });
  async function save() {
    const primary = chosen[0]; if (!customer || !vehicle || !primary) return;
    setBusy(true);
    try {
      const startsAt = validateBookingSlot(f.date, f.time, duration);
      const list = [chosen.map((s) => s.name).join(" + "), extras.length ? `Add-ons: ${extras.map((a) => a.name).join(", ")}` : ""].filter(Boolean).join("; ");
      await bookAppointment({ customer_id: customer.id, vehicle_id: vehicle.id, service_id: primary.id, lead_id: leadId, starts_at: startsAt, duration_hours: duration, serviceName: list, location: f.mode === "Mobile" ? `Mobile — ${f.location.trim()}` : "Tru Detailerz — Greater Toronto Area", notes: `Requested: ${list}\nBooking total: $${price}\n${f.notes}` });
      await invalidate(); toast.success("Booking confirmed"); onClose();
    } catch (e) { toast.error(e instanceof Error ? e.message : "Could not save booking"); } finally { setBusy(false); }
  }
  return <><Dialog open onOpenChange={(o) => !o && !busy && onClose()}><DialogContent className="max-h-[90dvh] overflow-y-auto sm:max-w-xl"><DialogHeader><DialogTitle>New booking</DialogTitle><DialogDescription>Step {step + 1} of 6 · {STEPS[step]}</DialogDescription></DialogHeader>
    <div className="flex gap-1" aria-label="Booking progress">{STEPS.map((s, i) => <div key={s} className={`h-1 flex-1 rounded-full ${i <= step ? "bg-primary" : "bg-border"}`} />)}</div>
    <div className="min-h-48 space-y-4 py-2">
      {step === 0 && <><label className="block text-sm font-medium">Customer<select aria-label="Booking customer" className={`${selectCls} mt-2 w-full`} value={f.customer} onChange={(e) => setF({ ...f, customer: e.target.value, vehicle: "" })}><option value="">Select customer</option>{customers.data?.map((c) => <option key={c.id} value={c.id}>{fullName(c)} · {c.phone}</option>)}</select></label><Button variant="outline" onClick={() => setRecord("customer")}><Plus /> Add customer</Button></>}
      {step === 1 && <><label className="block text-sm font-medium">Vehicle<select aria-label="Booking vehicle" className={`${selectCls} mt-2 w-full`} value={f.vehicle} onChange={(e) => setF({ ...f, vehicle: e.target.value })}><option value="">Select vehicle</option>{vehicles.data?.filter((v) => v.customer_id === f.customer).map((v) => <option key={v.id} value={v.id}>{vehicleName(v)} · {v.color}</option>)}</select></label><Button variant="outline" onClick={() => setRecord("vehicle")}><Plus /> Add vehicle</Button></>}
      {step === 2 && <><p className="text-sm font-semibold">Detailing services</p><div className="divide-y">{services.data?.filter((s) => s.active).map((s) => <label key={s.id} className="flex items-center gap-3 py-3 text-sm"><input type="checkbox" checked={f.services.includes(s.id)} onChange={() => toggle("services", s.id)} className="h-4 w-4 accent-primary" /><span className="min-w-0 flex-1">{s.name}<span className="block text-xs text-slate">{s.duration_hours} hours</span></span><span className="tabular">{money(s.price_from)}</span></label>)}</div><p className="text-sm font-semibold">Optional extras</p><div className="grid gap-2 sm:grid-cols-2">{ADDONS.map((a) => <label key={a.slug} className="flex items-center gap-2 text-xs"><input type="checkbox" checked={f.addons.includes(a.slug)} onChange={() => toggle("addons", a.slug)} className="h-4 w-4 accent-primary" />{a.name} · {money(a.price)}</label>)}</div>{duration > 10 && <p role="alert" className="text-sm text-destructive">This selection exceeds one working day. Choose fewer services.</p>}</>}
      {step === 3 && <><div className="grid grid-cols-2 gap-3">{["Drop-off", "Mobile"].map((mode) => <Button key={mode} variant={f.mode === mode ? "default" : "outline"} aria-pressed={f.mode === mode} onClick={() => setF({ ...f, mode })}>{mode}</Button>)}</div>{f.mode === "Mobile" && <label className="block text-sm">Service address<input required className={`${inputSm} mt-2`} value={f.location} onChange={(e) => setF({ ...f, location: e.target.value })} /></label>}<p className="text-xs text-slate">Same service pricing applies to both visit types.</p></>}
      {step === 4 && <><label className="block text-sm font-medium">Appointment date<input aria-label="Booking date" type="date" className={`${inputSm} mt-2`} min={dayKey(new Date(Date.now() + 86400000))} max={dayKey(new Date(Date.now() + 14 * 86400000))} value={f.date} onChange={(e) => setF({ ...f, date: e.target.value, time: "" })} /></label><div className="grid grid-cols-2 gap-2">{slots.map((s) => <Button key={s.time} disabled={!s.available} aria-pressed={f.time === s.time} variant={f.time === s.time ? "default" : "outline"} onClick={() => setF({ ...f, time: s.time })}>{s.time}</Button>)}</div>{!slots.some((s) => s.available) && <p className="text-sm text-slate">No available times for this selection. Try another date or fewer services.</p>}</>}
      {step === 5 && <><dl className="divide-y text-sm">{[["Customer", fullName(customer)], ["Vehicle", vehicleName(vehicle)], ["Services", chosen.map((s) => s.name).join(", ")], ["Add-ons", extras.map((a) => a.name).join(", ") || "None"], ["Visit", f.mode], ["Appointment", `${f.date} · ${f.time}`], ["Duration", `${duration} hours`], ["Total", money(price)]].map(([key, value]) => <div key={key} className="grid grid-cols-[100px_minmax(0,1fr)] gap-3 py-2"><dt className="text-slate">{key}</dt><dd className="text-right font-medium">{value}</dd></div>)}</dl><label className="block text-xs text-slate">Special instructions<textarea rows={2} className={`${inputSm} mt-1 h-auto py-2`} value={f.notes} onChange={(e) => setF({ ...f, notes: e.target.value })} /></label></>}
    </div>
    {step >= 2 && step < 5 && <div className="flex justify-between border-t pt-3 text-sm"><span className="text-slate">{duration} hours</span><span className="tabular font-bold">{money(price)}</span></div>}
    <DialogFooter className="flex-row justify-between"><Button variant="outline" onClick={() => step ? setStep(step - 1) : onClose()} disabled={busy}><ArrowLeft />{step ? "Back" : "Cancel"}</Button>{step < 5 ? <Button disabled={!valid} onClick={() => setStep(step + 1)}>Continue<ArrowRight /></Button> : <Button disabled={busy || appointments.isError} onClick={save}><Check />{busy ? "Saving…" : "Confirm booking"}</Button>}</DialogFooter>
  </DialogContent></Dialog>{record === "customer" && <CustomerDialog onClose={() => setRecord(null)} onSaved={(id) => setF({ ...f, customer: id, vehicle: "" })} />}{record === "vehicle" && <VehicleDialog customerId={f.customer} onClose={() => setRecord(null)} onSaved={(id) => setF({ ...f, vehicle: id })} />}</>;
}