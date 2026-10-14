import { requireUser, primaryWorkspace } from "@/lib/session";
import { PageHead } from "@/components/app-shell";
import { StackedShareBar, ColumnChart } from "@/components/charts";
import { db } from "@/lib/db";

export const metadata = { title: "Shopping | Profound" };

export default async function Page() {
  const user = await requireUser();
  const ws = primaryWorkspace(user.id);
  if (!ws) return <div className="p-8 text-zinc-500">No workspace found.</div>;
  const products = db.prepare("SELECT * FROM shopping_products WHERE workspace_id = ? ORDER BY visibility DESC").all(ws.id) as
    { id: number; name: string; sku: string; merchant: string; price: number; rating: number; visibility: number; cited_by: string }[];
  const avgVis = Math.round((products.reduce((a, p) => a + p.visibility, 0) / Math.max(1, products.length)) * 10) / 10;

  return (
    <>
      <PageHead title="Shopping" sub="SKU-level visibility in ChatGPT Shopping results">
        <span className="rounded-full border border-zinc-200 px-3 py-1.5 text-[12.5px] text-zinc-600">{products.length} SKUs tracked</span>
      </PageHead>
      <div className="space-y-6 px-6 py-6 lg:px-8">
        <div className="grid gap-4 xl:grid-cols-3">
          <div className="rounded-2xl border border-zinc-200 p-5 xl:col-span-2">
            <p className="text-[15px] font-semibold">Visibility by product</p>
            <p className="mb-4 text-[12.5px] text-zinc-500">Share of shopping answers featuring each SKU</p>
            <StackedShareBar items={products.slice(0, 6).map((p, i) => ({ label: p.name, pct: Math.round(p.visibility), color: ["#18181b", "#10a37f", "#4285f4", "#fb923c", "#c084fc", "#60a5fa"][i] }))} />
          </div>
          <div className="grid grid-cols-2 gap-3 xl:grid-cols-1 xl:grid-rows-2">
            <div className="rounded-2xl border border-zinc-200 p-5"><p className="text-[12.5px] text-zinc-500">Avg SKU visibility</p><p className="mt-1.5 text-[26px] font-semibold">{avgVis}%</p></div>
            <div className="rounded-2xl border border-zinc-200 p-5"><p className="text-[12.5px] text-zinc-500">Best merchant</p><p className="mt-1.5 truncate text-[17px] font-semibold">{products[0]?.merchant ?? "—"}</p></div>
          </div>
        </div>
        <div className="overflow-hidden rounded-2xl border border-zinc-200">
          <table className="w-full text-[13.5px]">
            <thead><tr className="border-b border-zinc-200 text-left text-[12px] text-zinc-500"><th className="px-5 py-3 font-medium">Product</th><th className="px-5 py-3 font-medium">SKU</th><th className="px-5 py-3 font-medium">Merchant</th><th className="px-5 py-3 font-medium">Price</th><th className="px-5 py-3 font-medium">Rating</th><th className="px-5 py-3 font-medium">Visibility</th><th className="px-5 py-3 font-medium">Also cited by</th></tr></thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} className="border-b border-zinc-50 last:border-0 hover:bg-zinc-50">
                  <td className="px-5 py-3 font-medium">{p.name}</td>
                  <td className="px-5 py-3 font-mono text-[12px] text-zinc-500">{p.sku}</td>
                  <td className="px-5 py-3 text-zinc-600">{p.merchant}</td>
                  <td className="px-5 py-3">${p.price.toLocaleString()}</td>
                  <td className="px-5 py-3">★ {p.rating}</td>
                  <td className="px-5 py-3">
                    <span className="flex items-center gap-2"><span className="font-medium">{Math.round(p.visibility)}%</span><span className="h-1.5 w-16 overflow-hidden rounded-full bg-zinc-100"><span className="block h-full rounded-full bg-zinc-900" style={{ width: `${p.visibility}%` }} /></span></span>
                  </td>
                  <td className="px-5 py-3 text-zinc-500">{p.cited_by}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="rounded-2xl border border-zinc-200 p-5">
          <p className="text-[15px] font-semibold">Price band competitiveness</p>
          <p className="mb-4 text-[12.5px] text-zinc-500">Visibility across category price bands</p>
          <ColumnChart items={[["<$1k", 12], ["$1-2k", 34], ["$2-3k", 58], ["$3-4k", 71], ["$4k+", 41]].map(([l, v]) => ({ label: l as string, value: v as number }))} color="#10a37f" fmt="pct" />
        </div>
      </div>
    </>
  );
}

export const instant = false;
