import { requireUser, primaryWorkspace } from "@/lib/session";
import { AimChat } from "@/components/aim-chat";

export const metadata = { title: "Aim | Profound" };

export default async function Page() {
  const user = await requireUser();
  const ws = primaryWorkspace(user.id);
  return <AimChat workspace={ws?.name ?? "there"} />;
}

export const instant = false;
