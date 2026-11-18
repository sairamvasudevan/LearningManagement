import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { LoginForm } from "@/components/auth-forms";

export default function LoginPage(){return <><SiteHeader/><main className="auth-page"><div className="auth-aside"><span className="eyebrow">WELCOME BACK</span><h1>Continue where your thinking left off.</h1><p>Your lessons, attempts, scores and learning path are saved to your student account.</p><div className="aside-rule"><span>01</span> One student account · One continuous learning record</div></div><section className="auth-card"><span className="eyebrow">STUDENT PORTAL</span><h2>Sign in</h2><p>Use the email address and password linked to your course registration.</p><LoginForm/><div className="auth-bottom">New to the course? <Link href="/register">Create an account</Link></div></section></main></>}
