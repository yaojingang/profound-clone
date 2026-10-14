import { requireUser, primaryWorkspace } from "@/lib/session";
import { PageHead } from "@/components/app-shell";
import { sentimentRows, colorForEngine } from "@/lib/app-queries";

export const metadata = { title: "Sentiment | Profound" };

export default async function Page() {
  const user = await requireUser();
  const ws = primaryWorkspace(user.id);
  if (!ws) return <div className="p-8 text-zinc-500">No workspace found.</div>;
  const rows = sentimentRows(ws.id);
  const avg = (k: "positive" | "neutral" | "negative") => Math.round((rows.reduce((a, r) => a + r[k], 0) / Math.max(1, rows.length)) * 100);

  return (
    <>
      <PageHead title="Sentiment" sub="How answer engines describe your brand" />
      <div className="space-y-6 px-6 py-6 lg:px-8">
        <div className="grid gap-3 sm:grid-cols-3">
          {[["Positive", avg("positive"), "text-emerald-600", "bg-emerald-500"], ["Neutral", avg("neutral"), "text-zinc-600", "bg-zinc-400"], ["Negative", avg("negative"), "text-rose-500", "bg-rose-500"]].map(([l, v, tc, bc]) => (
            <div key={l as string} className="rounded-2xl border border-zinc-200 p-5">
              <p className="text-[12.5px] text-zinc-500">{l as string}</p>
              <p className={`mt-1 text-[26px] font-semibold ${tc as string}`}>{v as number}%</p>
              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-zinc-100"><div className={`h-full rounded-full ${bc as string}`} style={{ width: `${v as number}%` }} /></div>
            </div>
          ))}
        </div>
        <div className="overflow-hidden rounded-2xl border border-zinc-200">
          <div className="border-b border-zinc-200 p-5"><p className="text-[15px] font-semibold">By engine</p><p className="text-[12.5px] text-zinc-500">Distribution of brand descriptors per answer engine</p></div>
          <table className="w-full text-[13.5px]">
            <thead><tr className="border-b border-zinc-200 text-left text-[12px] text-zinc-500"><th className="px-5 py-2.5 font-medium">Engine</th><th className="px-5 py-2.5 font-medium">Distribution</th><th className="px-5 py-2.5 text-right font-medium">Pos</th><th className="px-5 py-2.5 text-right font-medium">Neu</th><th className="px-5 py-2.5 text-right font-medium">Neg</th></tr></thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.engine} className="border-b border-zinc-100 last:border-0">
                  <td className="whitespace-nowrap px-5 py-3.5 font-medium"><span className="flex items-center gap-2"><span className="h-2 w-2 rounded-full" style={{ background: colorForEngine(r.engine) }} />{r.engine}</span></td>
                  <td className="px-5 py-3.5">
                    <div className="flex h-2.5 w-full max-w-md overflow-hidden rounded-full bg-zinc-100">
                      <div style={{ width: `${r.positive * 100}%`, background: "#10b981" }} /><div style={{ width: `${r.neutral * 100}%`, background: "#d4d4d8" }} /><div style={{ width: `${r.negative * 100}%`, background: "#fb7185" }} />
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-right text-emerald-600">{Math.round(r.positive * 100)}%</td>
                  <td className="px-5 py-3.5 text-right text-zinc-500">{Math.round(r.neutral * 100)}%</td>
                  <td className="px-5 py-3.5 text-right text-rose-500">{Math.round(r.negative * 100)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="rounded-2xl border border-zinc-200 p-5">
          <p className="text-[15px] font-semibold">Dominant narratives</p>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            {[["Premium endurance brand", "Most associated with battery life and build quality", "text-emerald-600"], ["Price sensitivity", "Occasionally flagged as higher-priced than rivals", "text-amber-500"], ["Service reputation", "Dealers and support cited positively in reviews", "text-emerald-600"]].map(([t, p, c]) => (
              <div key={t} className="rounded-xl bg-zinc-50 p-4">
                <p className="text-[13.5px] font-semibold">{t}</p>
                <p className="mt-1 text-[12.5px] text-zinc-500">{p}</p>
                <p className={`mt-2 text-[11.5px] font-medium ${c}`}>● tracked</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export const instant = false;
