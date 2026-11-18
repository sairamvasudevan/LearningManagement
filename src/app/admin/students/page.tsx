import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { ApproveEnrollmentButton } from "@/components/auth-forms";
import catalog from "@/lib/course-catalog.json";

export const dynamic = "force-dynamic";

type StudentProfile = { id:string; full_name:string; email:string; phone:string; college:string; register_number:string; department:string; degree:string; graduation_year:number|null; created_at:string };
type EnrollmentRow = { student_id:string; status:string; access_source:string };
type ProgressRow = { student_id:string; module_number:number; status:string; best_score:number; total_marks:number };

export default async function AdminStudentsPage(){
  await requireAdmin();
  const supabase=await createClient();
  const [{data:profiles,error:profilesError},{data:enrollments},{data:progress}]=await Promise.all([
    supabase.from('profiles').select('id,full_name,email,phone,college,register_number,department,degree,graduation_year,created_at').order('created_at',{ascending:false}),
    supabase.from('course_enrollments').select('student_id,status,access_source'),
    supabase.from('lesson_progress').select('student_id,module_number,status,best_score,total_marks'),
  ]);
  const error=profilesError?.message;
  const profileRows=(profiles||[]) as StudentProfile[];
  const enrollmentRows=(enrollments||[]) as EnrollmentRow[];
  const progressRowsTyped=(progress||[]) as ProgressRow[];
  const enrollmentMap=new Map<string,string>(enrollmentRows.map(e=>[e.student_id,e.status]));
  const progressMap=new Map<string,number>();
  for(const p of progressRowsTyped) if(p.status==='completed') progressMap.set(p.student_id,(progressMap.get(p.student_id)||0)+1);
  return <><div className="dashboard-heading"><div><span className="eyebrow">ADMINISTRATION · STUDENTS</span><h1>Student records</h1><p>Academic identity, contact information, access status and current learning level.</p></div><span className="count-chip">{profileRows.length} RECORDS</span></div>
    {error&&<div className="form-alert">Could not load student list: {error}</div>}
    <section className="surface-card table-card"><div className="table-heading"><div><h2>Registered students</h2><p>Student records are private to administrators and the student concerned.</p></div></div><div className="table-scroll"><table><thead><tr><th>Student</th><th>College / Register no.</th><th>Programme</th><th>Contact</th><th>Access</th><th>Level</th><th>Action</th></tr></thead><tbody>{profileRows.map(p=>{const done=progressMap.get(p.id)||0;return <tr key={p.id}><td><b>{p.full_name}</b><small>{p.email}</small></td><td>{p.college}<small>{p.register_number}</small></td><td>{p.degree}<small>{p.department}</small></td><td>{p.phone}</td><td><span className={`table-status ${enrollmentMap.get(p.id)||'none'}`}>{enrollmentMap.get(p.id)||'Not enrolled'}</span></td><td><b>{done}/100</b><small>{done>=100?'Course completed':catalog.modules.find(m=>m.id===done+1)?.title||'Not started'}</small></td><td>{enrollmentMap.get(p.id)==='pending'?<ApproveEnrollmentButton studentId={p.id}/>:<span className="field-note">—</span>}</td></tr>;})}</tbody></table>{profileRows.length===0&&<div className="empty-state">No student accounts have registered yet.</div>}</div></section>
  </>;
}
