import { SiteHeader, SiteFooter } from "@/components/site-chrome";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-black text-white">
      <SiteHeader />
      <main className="pt-[108px]">{children}</main>
      <SiteFooter />
    </div>
  );
}
