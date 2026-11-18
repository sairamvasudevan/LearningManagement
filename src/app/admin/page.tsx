import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function AdminHome(){
  await requireAdmin();
  const supabase=await createClient();
  const [{count:studentCount},{count:approvedCount},{count:pendingCount},{data:modeRow}]=await Promise.all([
    supabase.from('profiles').select('*',{count:'exact',head:true}),
    supabase.from('course_enrollments').select('*',{count:'exact',head:true}).eq('status','approved'),
    supabase.from('course_enrollments').select('*',{count:'exact',head:true}).eq('status','pending'),
    supabase.from('course_settings').select('registration_mode,pass_percent').eq('singleton',true).maybeSingle(),
  ]);
  return <><div className="dashboard-heading"><div><span className="eyebrow">ADMINISTRATION</span><h1>Course administration</h1><p>Manage student access, registration rules and learning progress.</p></div><span className="admin-chip">ADMIN</span></div>
    <section className="dashboard-metrics admin-metrics"><div><b>{studentCount||0}</b><span>Student accounts</span></div><div><b>{approvedCount||0}</b><span>Approved enrolments</span></div><div><b>{pendingCount||0}</b><span>Awaiting approval</span></div><div><b>{modeRow?.pass_percent||80}%</b><span>Mastery threshold</span></div></section>
    <div className="admin-nav-grid"><Link href="/admin/students" className="admin-nav-card"><span className="admin-nav-icon">01</span><h2>Student records</h2><p>View student names, college, register number, contact details and course progress.</p><b>Open student list →</b></Link><Link href="/admin/access" className="admin-nav-card"><span className="admin-nav-icon">02</span><h2>Access management</h2><p>Assign students by email, create invitation records and control self-registration.</p><b>Manage access →</b></Link></div>
    <div className="admin-notice"><b>Registration mode:</b> {modeRow?.registration_mode||'approval'}. <span>New accounts receive the student role automatically. Administrator privileges are granted manually through a controlled database operation.</span></div>
  </>;
}
