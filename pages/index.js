import Head from "next/head";
import Navbar from "../components/Navbar";
import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter();

  return (
    <>
      <Head>
        <title>Client Portal</title>
        <meta name="description" content="Modern Client Portal" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Navbar />

      <main className="container" style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
        <div style={{ maxWidth: '800px' }}>
          <h1 style={{ fontSize: '3.5rem', marginBottom: '1.5rem', background: 'linear-gradient(to right, #38bdf8, #818cf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Welcome to Your Client Portal
          </h1>
          <p style={{ fontSize: '1.25rem', marginBottom: '2.5rem', lineHeight: '1.8' }}>
            Manage your apps, view your dashboard, and control your profile from one beautiful, centralized hub. Experience the future of client management today.
          </p>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <button className="button" onClick={() => router.push('/login')} style={{ fontSize: '1.1rem', padding: '1rem 2rem' }}>
              Get Started
            </button>
            <button className="btn-ghost" onClick={() => router.push('/signup')} style={{ fontSize: '1.1rem', padding: '1rem 2rem' }}>
              Create Account
            </button>
          </div>

          <div style={{ marginTop: '4rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem', textAlign: 'left' }}>
            <div className="card">
              <h3 style={{ color: 'var(--primary)' }}>Secure</h3>
              <p className="small">Enterprise-grade security to keep your data safe and sound.</p>
            </div>
            <div className="card">
              <h3 style={{ color: 'var(--primary)' }}>Fast</h3>
              <p className="small">Optimized for speed and performance across all devices.</p>
            </div>
            <div className="card">
              <h3 style={{ color: 'var(--primary)' }}>Modern</h3>
              <p className="small">Built with the latest technologies for a seamless experience.</p>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
