import { requireAdmin } from "@/lib/session";
import { AdminShell } from "@/components/admin-shell";

export const metadata = { title: "Admin | Profound" };

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await requireAdmin();
  return <AdminShell user={{ name: user.name, email: user.email }}>{children}</AdminShell>;
}
