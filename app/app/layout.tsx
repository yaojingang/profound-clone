import { requireUser, primaryWorkspace } from "@/lib/session";
import { db } from "@/lib/db";
import { AppShell } from "@/components/app-shell";

export const metadata = { title: "Profound" };

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser();
  const workspace = primaryWorkspace(user.id);
  const recents = workspace
    ? (db.prepare("SELECT id, text FROM prompts WHERE workspace_id = ? ORDER BY id DESC LIMIT 4").all(workspace.id) as { id: number; text: string }[])
    : [];
  return (
    <AppShell
      user={{ name: user.name, email: user.email, role: user.role }}
      workspace={workspace ? { name: workspace.name, plan: workspace.plan, credits_total: workspace.credits_total, credits_used: workspace.credits_used } : null}
      recents={recents}
    >
      {children}
    </AppShell>
  );
}
