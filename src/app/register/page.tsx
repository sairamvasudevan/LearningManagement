import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { RegisterForm } from "@/components/auth-forms";

export default function RegisterPage(){return <><SiteHeader/><main className="register-layout"><div className="register-intro"><span className="eyebrow">STUDENT REGISTRATION</span><h1>Your learning record starts here.</h1><p>Register once. Your identity, course access, module progress and assessment results will remain linked to this account.</p><div className="privacy-note"><b>Student data protection</b><span>Your profile is visible to you and authorised course administrators. Other students cannot access your personal or academic details.</span></div></div><section className="register-card"><h2>Create your student account</h2><p>All fields marked with * are required.</p><RegisterForm/><div className="auth-bottom">Already registered? <Link href="/login">Sign in</Link></div></section></main></>}
