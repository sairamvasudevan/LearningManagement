import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { AdminAccessForm } from "@/components/auth-forms";
import { getRegistrationMode, getAllCourseInvites } from "@/lib/db";

export const dynamic = "force-dynamic";

type InvitationRow = { id: string; email: string; status: string; created_at: string };

export default async function AdminAccessPage() {
  await requireAdmin();
  let currentMode: string = getRegistrationMode();
  let inviteRows: InvitationRow[] = getAllCourseInvites();

  if (isSupabaseConfigured()) {
    try {
      const supabase = await createClient();
      const [{ data: settings }, { data: invites }] = await Promise.all([
        supabase
          .from("course_settings")
          .select("registration_mode")
          .eq("singleton", true)
          .maybeSingle(),
        supabase
          .from("course_invites")
          .select("id,email,status,created_at")
          .order("created_at", { ascending: false })
          .limit(50),
      ]);
      if (settings?.registration_mode) currentMode = settings.registration_mode;
      if (invites) inviteRows = invites as InvitationRow[];
    } catch {
      // Fall back to SQLite records
    }
  }

  return (
    <>
      <div className="dashboard-heading">
        <div>
          <span className="eyebrow">ADMINISTRATION · ACCESS CONTROL</span>
          <h1>Manage course access</h1>
          <p>Assign individual students or decide how new applicants are enrolled.</p>
        </div>
      </div>
      <AdminAccessForm currentMode={currentMode} />
      <section className="surface-card table-card" style={{ marginTop: 20 }}>
        <div className="table-heading">
          <div>
            <h2>Invitation records</h2>
            <p>Invited students can register using the email address listed here.</p>
          </div>
          <span className="count-chip">{inviteRows.length} Invites</span>
        </div>
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>Email</th>
                <th>Invitation status</th>
                <th>Created</th>
              </tr>
            </thead>
            <tbody>
              {inviteRows.map((i) => (
                <tr key={i.id}>
                  <td>
                    <b>{i.email}</b>
                  </td>
                  <td>
                    <span className={`table-status ${i.status}`}>{i.status}</span>
                  </td>
                  <td>{new Date(i.created_at).toLocaleDateString("en-IN")}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {inviteRows.length === 0 && <div className="empty-state">No invitation records yet.</div>}
        </div>
      </section>
    </>
  );
}
