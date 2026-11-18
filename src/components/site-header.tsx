import Link from "next/link";

export function SiteHeader({ signedIn = false, admin = false }: { signedIn?: boolean; admin?: boolean }) {
  return (
    <header className="site-header">
      <Link href="/" className="wordmark" aria-label="Problem Solving Lab home">
        <span className="mark">PS</span>
        <span><b>PROBLEM SOLVING LAB</b><small>100-hour learning programme</small></span>
      </Link>
      <nav className="header-nav">
        {signedIn ? (
          <>
            <Link href={admin ? "/admin" : "/portal"}>Dashboard</Link>
            {admin && <Link href="/admin/students">Students</Link>}
            {admin && <Link href="/admin/access">Access control</Link>}
            <form action="/auth/signout" method="post"><button className="button button-quiet" type="submit">Sign out</button></form>
          </>
        ) : (
          <><Link href="/login">Sign in</Link><Link className="button button-primary" href="/register">Register</Link></>
        )}
      </nav>
    </header>
  );
}
