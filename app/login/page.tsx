import { AuthShell } from "@/components/auth-form";

export const metadata = { title: "Log in | Profound" };

export default function Page() {
  return <AuthShell mode="login" />;
}
