import { requireAdmin } from "@/lib/auth";
import { SiteHeader } from "@/components/site-header";

export const dynamic = "force-dynamic";

export default async function AdminLayout({children}:{children:React.ReactNode}){
  await requireAdmin();
  return <><SiteHeader signedIn admin/><main className="dashboard-main">{children}</main></>;
}
