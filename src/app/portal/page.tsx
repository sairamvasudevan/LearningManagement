import Link from "next/link";
import { redirect } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { requireIdentity, getRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import catalog from "@/lib/course-catalog.json";

export const dynamic = "force-dynamic";

type CourseModule = { module_number:number; stage_number:number; title:string; objective:string; content_status:string };
type Progress = { module_number:number; status:string; best_score:number; total_marks:number; attempts:number };

export default async function StudentPortalPage(){
  const identity=await requireIdentity();
  if(await getRole(identity.id)==='admin') redirect('/admin');
  const supabase=await createClient();
  const [{data:profile},{data:enrollmentData}]=await Promise.all([
    supabase.from('profiles').select('full_name,email,phone,college,register_number,department,degree,graduation_year').eq('id',identity.id).maybeSingle(),
    supabase.from('course_enrollments').select('status,access_source,enrolled_at').eq('student_id',identity.id).order('enrolled_at',{ascending:false}).limit(1).maybeSingle(),
  ]);
  let enrollment=enrollmentData;
  if(!enrollment){
    const {data}=await supabase.rpc('request_course_enrollment');
    if(data && typeof data==='object' && 'status' in data) enrollment={status:String(data.status),access_source:'self_registration',enrolled_at:new Date().toISOString()};
  }
  const approved=enrollment?.status==='approved';
  const [{data:modules},{data:progressRows}]=approved?await Promise.all([
    supabase.from('course_modules').select('module_number,stage_number,title,objective,content_status').order('module_number'),
    supabase.from('lesson_progress').select('module_number,status,best_score,total_marks,attempts').eq('student_id',identity.id),
  ]):[{data:[] as CourseModule[]},{data:[] as Progress[]}];
  const moduleMap=new Map(((modules||[]) as CourseModule[]).map(m=>[m.module_number,m]));
  const progressMap=new Map(((progressRows||[]) as Progress[]).map(p=>[p.module_number,p]));
  const completed=((progressRows||[]) as Progress[]).filter(p=>p.status==='completed').length;
  const nextModule=Array.from({length:100},(_,i)=>i+1).find(n=>!progressMap.get(n)||progressMap.get(n)?.status!=='completed')||0;
  const displayName=profile?.full_name||identity.email.split('@')[0];

  return <><SiteHeader signedIn/><main className="dashboard-main">
    <div className="dashboard-heading"><div><span className="eyebrow">STUDENT WORKSPACE</span><h1>Welcome, {displayName.split(' ')[0]}.</h1><p>Your course, learning progress and assessment history are all in one place.</p></div><span className="student-id-chip">STUDENT ACCOUNT</span></div>
    {!approved ? <section className="access-state"><div className="access-symbol">{enrollment?.status==='pending'?'◷':'!'}</div><span className="eyebrow">COURSE ACCESS</span><h2>{enrollment?.status==='pending'?'Your registration is awaiting approval':'You are not enrolled yet'}</h2><p>{enrollment?.status==='pending'?'Your student account has been created. An administrator must approve your access before the lessons become available.':'This course is currently invitation-only or your account is not yet assigned. Contact the course administrator and share your registered email address.'}</p><div className="profile-summary"><b>Registered account</b><span>{profile?.email||identity.email}</span><span>{profile?.college||'College details pending'} · {profile?.register_number||'Register number pending'}</span></div></section> : <>
      <section className="dashboard-metrics"><div><b>{completed}<small>/100</small></b><span>Lessons completed</span></div><div><b>{completed}%</b><span>Course progress</span></div><div><b>{Math.max(0,100-completed)}</b><span>Lessons remaining</span></div><div><b>01</b><span>Active course</span></div></section>
      <section className="student-course-card"><div className="course-card-top"><div><span className="eyebrow">YOUR ENROLLED COURSE</span><h2>Problem Solving Lab</h2><p>100 hours · Language-independent reasoning · 10 progressive learning paths</p></div><span className="course-status">ENROLLED</span></div><div className="course-progress-line"><span style={{width:`${completed}%`}}/></div><div className="course-progress-label"><b>{completed}% complete</b><span>{completed} of 100 lessons</span></div>
      <div className="portal-path-list">{catalog.stages.map(stage=>{const stageModules=catalog.modules.filter(m=>m.stage===stage.id);const stageCompleted=stageModules.filter(m=>progressMap.get(m.id)?.status==='completed').length;const stageOpen=stage.id===1||progressMap.get((stage.id-1)*10)?.status==='completed';return <div className={`portal-path ${stageOpen?'path-open':'path-locked'}`} key={stage.id}><div className="portal-path-num">{String(stage.id).padStart(2,'0')}</div><div className="portal-path-copy"><b>{stage.title}</b><span>{stage.description}</span></div><div className="portal-path-status">{stageCompleted}/10 · {stageOpen?'Open':'Locked'}</div></div>;})}</div>
      <div className="next-lesson-callout"><div><span className="eyebrow">YOUR NEXT LESSON</span><h3>{catalog.modules.find(m=>m.id===nextModule)?.title||'Course completed'}</h3><p>{catalog.modules.find(m=>m.id===nextModule)?.objective||'All 100 lessons completed.'}</p></div>{moduleMap.get(nextModule)?.content_status==='published'&&<Link className="button button-primary" href={`/learn/${nextModule}`}>Continue learning →</Link>}</div></section>
      <section className="profile-panel"><div><span className="eyebrow">STUDENT PROFILE</span><h2>Your registered details</h2></div><div className="profile-grid"><div><span>Full name</span><b>{profile?.full_name}</b></div><div><span>Email</span><b>{profile?.email}</b></div><div><span>Phone</span><b>{profile?.phone}</b></div><div><span>College</span><b>{profile?.college}</b></div><div><span>Register number</span><b>{profile?.register_number}</b></div><div><span>Department</span><b>{profile?.department}</b></div><div><span>Degree</span><b>{profile?.degree}</b></div><div><span>Graduation year</span><b>{profile?.graduation_year||'Not provided'}</b></div></div></section>
    </>}
  </main></>;
}
