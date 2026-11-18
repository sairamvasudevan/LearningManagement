"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setError("");
    if (!isSupabaseConfigured()) { setError("Authentication is not connected yet. Add your Supabase URL and publishable key to .env.local."); return; }
    setBusy(true);
    try {
      const supabase = createClient();
      const { error: authError } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
      if (authError) throw authError;
      router.replace("/portal"); router.refresh();
    } catch (err) { setError(err instanceof Error ? err.message : "Sign-in failed. Please try again."); }
    finally { setBusy(false); }
  }

  return <form className="form-stack" onSubmit={submit}>
    <label>Email address<input type="email" autoComplete="email" required value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@college.edu" /></label>
    <label>Password<input type="password" autoComplete="current-password" required value={password} onChange={e=>setPassword(e.target.value)} placeholder="Your password" /></label>
    {error && <div className="form-alert" role="alert">{error}</div>}
    <button className="button button-primary button-full" disabled={busy}>{busy ? "Signing in…" : "Sign in"}</button>
  </form>;
}

export function RegisterForm() {
  const router = useRouter();
  const [values, setValues] = useState({ full_name:"", email:"", phone:"", college:"", register_number:"", department:"", degree:"", graduation_year:"", password:"", confirm_password:"", privacy_consent:false });
  const [busy,setBusy]=useState(false); const [error,setError]=useState(""); const [success,setSuccess]=useState("");
  function update<K extends keyof typeof values>(field: K, value: (typeof values)[K]) { setValues(current=>({...current,[field]:value})); }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setError(""); setSuccess("");
    if (!isSupabaseConfigured()) { setError("Registration is not connected yet. Add your Supabase URL and publishable key to .env.local."); return; }
    if (values.password.length < 12) { setError("Use a password with at least 12 characters."); return; }
    if (values.password !== values.confirm_password) { setError("The passwords do not match."); return; }
    if (!values.privacy_consent) { setError("Please read and accept the student data notice before registering."); return; }
    setBusy(true);
    try {
      const supabase=createClient();
      const {data,error:authError}=await supabase.auth.signUp({
        email:values.email.trim().toLowerCase(), password:values.password,
        options:{ emailRedirectTo:`${window.location.origin}/auth/callback?next=/portal`, data:{
          full_name:values.full_name.trim(), phone:values.phone.trim(), college:values.college.trim(),
          register_number:values.register_number.trim(), department:values.department.trim(), degree:values.degree.trim(),
          graduation_year:values.graduation_year ? Number(values.graduation_year) : null,
          privacy_notice_accepted: values.privacy_consent,
        }},
      });
      if(authError) throw authError;
      if(data.session){
        await supabase.rpc("request_course_enrollment");
        router.replace("/portal"); router.refresh();
      } else {
        setSuccess("Your account has been created. Check your email to verify the address, then sign in to complete course registration.");
      }
    } catch(err) { setError(err instanceof Error ? err.message : "Registration failed. Please review your details."); }
    finally { setBusy(false); }
  }

  return <form className="form-stack" onSubmit={submit}>
    <div className="form-grid">
      <label>Full name *<input required maxLength={120} value={values.full_name} onChange={e=>update("full_name",e.target.value)} autoComplete="name" /></label>
      <label>Email address *<input type="email" required value={values.email} onChange={e=>update("email",e.target.value)} autoComplete="email" /></label>
      <label>Phone number *<input type="tel" required maxLength={24} value={values.phone} onChange={e=>update("phone",e.target.value)} autoComplete="tel" /></label>
      <label>College / University *<input required maxLength={180} value={values.college} onChange={e=>update("college",e.target.value)} /></label>
      <label>Register number *<input required maxLength={60} value={values.register_number} onChange={e=>update("register_number",e.target.value)} /></label>
      <label>Department *<input required maxLength={120} value={values.department} onChange={e=>update("department",e.target.value)} placeholder="Computer Science and Engineering" /></label>
      <label>Degree / Programme *<input required maxLength={100} value={values.degree} onChange={e=>update("degree",e.target.value)} placeholder="B.Tech / BCA / MCA" /></label>
      <label>Graduation year<select value={values.graduation_year} onChange={e=>update("graduation_year",e.target.value)}><option value="">Select year</option>{Array.from({length:12},(_,i)=>new Date().getFullYear()-3+i).map(y=><option key={y} value={y}>{y}</option>)}</select></label>
    </div>
    <div className="form-grid">
      <label>Password *<input type="password" required minLength={12} value={values.password} onChange={e=>update("password",e.target.value)} autoComplete="new-password" /></label>
      <label>Confirm password *<input type="password" required minLength={12} value={values.confirm_password} onChange={e=>update("confirm_password",e.target.value)} autoComplete="new-password" /></label>
    </div>
    <p className="field-note">Passwords must contain at least 12 characters. Your password is handled by Supabase Auth and is never stored in the student profile.</p>
    <label className="consent-control"><input type="checkbox" required checked={values.privacy_consent} onChange={e=>update("privacy_consent",e.target.checked)} /><span>I have read the <Link href="/privacy" target="_blank">Student Data & Privacy Notice</Link>. I understand my details and learning records will be used to administer this course.</span></label>
    {error && <div className="form-alert" role="alert">{error}</div>}
    {success && <div className="form-success" role="status">{success}</div>}
    <button className="button button-primary button-full" disabled={busy}>{busy ? "Creating account…" : "Create student account"}</button>
  </form>;
}

export function AdminAccessForm({ currentMode }: { currentMode: string }) {
  const [email,setEmail]=useState(""); const [mode,setMode]=useState(currentMode);
  const [busy,setBusy]=useState(false); const [message,setMessage]=useState(""); const [error,setError]=useState("");
  async function assign(event:FormEvent<HTMLFormElement>){event.preventDefault();setBusy(true);setMessage("");setError("");try{const res=await fetch('/api/admin/assign',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email})});const data=await res.json();if(!res.ok)throw new Error(data.error||'Assignment failed');setMessage(data.message||'Course access updated.');setEmail('');}catch(e){setError(e instanceof Error?e.message:'Assignment failed');}finally{setBusy(false);}}
  async function saveMode(){setBusy(true);setMessage("");setError("");try{const res=await fetch('/api/admin/registration-mode',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({mode})});const data=await res.json();if(!res.ok)throw new Error(data.error||'Could not update registration mode');setMessage('Registration mode updated.');}catch(e){setError(e instanceof Error?e.message:'Could not update registration mode');}finally{setBusy(false);}}
  return <div className="admin-forms">
    <section className="surface-card"><div className="section-heading"><div><span className="eyebrow">INDIVIDUAL ACCESS</span><h2>Assign a student</h2><p>Enter the student’s registered email. If they have not created an account yet, an invitation record will be created for that email.</p></div></div><form className="inline-form" onSubmit={assign}><input type="email" required placeholder="student@college.edu" value={email} onChange={e=>setEmail(e.target.value)} /><button className="button button-primary" disabled={busy}>Assign access</button></form></section>
    <section className="surface-card"><div className="section-heading"><div><span className="eyebrow">SELF-REGISTRATION</span><h2>Who can join?</h2><p>Control how the public registration form grants access to the course.</p></div></div><div className="mode-row"><select value={mode} onChange={e=>setMode(e.target.value)}><option value="open">Open registration — immediate access</option><option value="approval">Approval required — admin approves</option><option value="invite_only">Invite only — admin assigns students</option></select><button className="button button-dark" onClick={saveMode} disabled={busy}>Save setting</button></div><p className="field-note">The initial database setting is Approval required. Students cannot grant themselves administrator access.</p></section>
    {message&&<div className="form-success">{message}</div>}{error&&<div className="form-alert">{error}</div>}
  </div>;
}

export function ApproveEnrollmentButton({ studentId }: { studentId: string }) {
  const [busy,setBusy]=useState(false);
  const [message,setMessage]=useState("");
  async function approve(){
    setBusy(true);setMessage("");
    try{
      const response=await fetch('/api/admin/approve',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({studentId})});
      const data=await response.json();
      if(!response.ok)throw new Error(data.error||'Approval failed');
      setMessage('Approved');
      window.location.reload();
    }catch(error){setMessage(error instanceof Error?error.message:'Approval failed');}
    finally{setBusy(false);}
  }
  return <span><button className="button button-primary button-small" onClick={approve} disabled={busy}>{busy?'Approving…':'Approve'}</button>{message&&<small>{message}</small>}</span>;
}
