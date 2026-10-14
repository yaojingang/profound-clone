import { requireAdmin } from "@/lib/session";
import { AdminHead } from "@/components/admin-shell";
import { db } from "@/lib/db";

export const metadata = { title: "Admin · Users | Profound" };

export default async function Page() {
  await requireAdmin();
  const users = db
    .prepare(
      `SELECT u.*, (SELECT COUNT(*) FROM memberships m WHERE m.user_id = u.id) workspaces,
        (SELECT GROUP_CONCAT(w.name, ', ') FROM memberships m JOIN workspaces w ON w.id = m.workspace_id WHERE m.user_id = u.id) ws_names
       FROM users u ORDER BY u.id`
    )
    .all() as { id: number; name: string; email: string; role: string; status: string; created_at: string; last_login_at: string | null; workspaces: number; ws_names: string | null }[];

  return (
    <>
      <AdminHead title="Users" sub={`${users.length} accounts on platform`}>
        <span className="rounded-full border border-white/15 px-3 py-1.5 text-[12.5px] text-zinc-400">{users.filter((u) => u.status === "active").length} active</span>
      </AdminHead>
      <div className="px-6 py-6 lg:px-8">
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">
          <table className="w-full text-[13.5px]">
            <thead><tr className="border-b border-white/10 text-left text-[12px] text-zinc-400"><th className="px-5 py-3 font-medium">User</th><th className="px-5 py-3 font-medium">Role</th><th className="px-5 py-3 font-medium">Workspaces</th><th className="px-5 py-3 font-medium">Status</th><th className="px-5 py-3 font-medium">Last login</th><th className="px-5 py-3 font-medium">Joined</th></tr></thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-b border-white/5 last:border-0">
                  <td className="px-5 py-3"><div className="flex items-center gap-3"><span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-[12px] font-semibold">{u.name.slice(0, 1)}</span><div><p className="font-medium">{u.name}</p><p className="text-[11.5px] text-zinc-500">{u.email}</p></div></div></td>
                  <td className="px-5 py-3"><span className={`rounded-full px-2 py-0.5 text-[11.5px] ${u.role === "admin" ? "bg-violet-500/15 text-violet-300" : "bg-white/5 text-zinc-400"}`}>{u.role}</span></td>
                  <td className="max-w-56 truncate px-5 py-3 text-zinc-400">{u.ws_names ?? "—"}</td>
                  <td className="px-5 py-3"><span className={`flex items-center gap-1.5 ${u.status === "active" ? "text-emerald-400" : "text-zinc-500"}`}><span className={`h-1.5 w-1.5 rounded-full ${u.status === "active" ? "bg-emerald-400" : "bg-zinc-600"}`} />{u.status}</span></td>
                  <td className="px-5 py-3 text-zinc-500">{u.last_login_at?.slice(0, 10) ?? "never"}</td>
                  <td className="px-5 py-3 text-zinc-500">{u.created_at.slice(0, 10)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export const instant = false;
