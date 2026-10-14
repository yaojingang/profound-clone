import { requireAdmin } from "@/lib/session";
import { AdminHead } from "@/components/admin-shell";
import { db } from "@/lib/db";

export const metadata = { title: "Admin · Leads | Profound" };

export default async function Page() {
  await requireAdmin();
  const leads = db.prepare("SELECT * FROM leads ORDER BY created_at DESC").all() as
    { id: number; name: string; email: string; company: string | null; size: string | null; message: string | null; source: string; created_at: string }[];
  const bySource = leads.reduce<Record<string, number>>((acc, l) => ({ ...acc, [l.source]: (acc[l.source] ?? 0) + 1 }), {});

  return (
    <>
      <AdminHead title="Leads" sub={`${leads.length} inbound leads`}>
        {Object.entries(bySource).map(([s, n]) => <span key={s} className="rounded-full border border-white/15 px-3 py-1.5 text-[12.5px] text-zinc-400">{s}: {n}</span>)}
      </AdminHead>
      <div className="px-6 py-6 lg:px-8">
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">
          <table className="w-full text-[13.5px]">
            <thead><tr className="border-b border-white/10 text-left text-[12px] text-zinc-400"><th className="px-5 py-3 font-medium">Contact</th><th className="px-5 py-3 font-medium">Company</th><th className="px-5 py-3 font-medium">Size</th><th className="px-5 py-3 font-medium">Message</th><th className="px-5 py-3 font-medium">Source</th><th className="px-5 py-3 font-medium">Received</th></tr></thead>
            <tbody>
              {leads.map((l) => (
                <tr key={l.id} className="border-b border-white/5 last:border-0">
                  <td className="px-5 py-3"><p className="font-medium">{l.name}</p><p className="text-[11.5px] text-zinc-500">{l.email}</p></td>
                  <td className="px-5 py-3 text-zinc-300">{l.company ?? "—"}</td>
                  <td className="px-5 py-3 text-zinc-400">{l.size ?? "—"}</td>
                  <td className="max-w-72 truncate px-5 py-3 text-zinc-400">{l.message ?? "—"}</td>
                  <td className="px-5 py-3"><span className="rounded-full bg-white/5 px-2 py-0.5 text-[11.5px] text-zinc-300">{l.source}</span></td>
                  <td className="px-5 py-3 text-zinc-500">{l.created_at.slice(0, 16).replace("T", " ")}</td>
                </tr>
              ))}
              {leads.length === 0 && <tr><td colSpan={6} className="px-5 py-10 text-center text-zinc-500">No leads yet — submit the form at /contact-sales and refresh.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export const instant = false;
