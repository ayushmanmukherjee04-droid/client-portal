// components/Navbar.js
import Link from 'next/link';

export default function Navbar(){
  return (
    <div className="nav">
      <div style={{fontWeight:700}}>Client Portal</div>
      <div style={{flex:1}} />
      <Link href="/client/dashboard">Dashboard</Link>
      <Link href="/client/apps">Apps</Link>
      <Link href="/client/profile">Profile</Link>
      <Link href="/login">Login</Link>
    </div>
  );
}
