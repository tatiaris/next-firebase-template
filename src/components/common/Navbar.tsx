import React from 'react';
import Link from 'next/link';
import { logout } from '@/components/helper';
import { useState } from 'react';
/**
 * Navbar component
 */

const links = [
  {
    link: '/',
    label: 'Home',
    links: null
  },
  {
    link: '/testing',
    label: 'Testing',
    links: null
  }
];

interface NavbarProps {
  session: any;
  setSession: any;
}
export const Navbar: React.FC<NavbarProps> = ({ session, setSession }): React.ReactElement => {
  const [active, setActive] = useState(links[0].link);

  const [logoutFailed, setLogoutFailed] = useState(false);
  const handleLogout = async () => {
    const data = await logout();
    if (!data.success) setLogoutFailed(true);
    else setSession(null);
  };

  return (
    <div style={{ padding: 10, display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid black' }}>
      <div id='links-container' style={{ display: 'flex', gap: 10 }}>{links.map(link => (
        <Link href={link.link} key={link.link}>
          <span>{link.label}</span>
        </Link>
      ))}</div>
      <div id='actions-container'>
        {!session ? (
          <div>
            <Link href="/login" passHref>
              <span>Login</span>
            </Link>
            {" / "}
            <Link href="/signup" passHref>
              <span>Signup</span>
            </Link>
          </div>
        ) : (
          <div>
            <button onClick={handleLogout}>Log Out</button>
          </div>
        )}
      </div>
    </div>
  )
};

export default Navbar;
