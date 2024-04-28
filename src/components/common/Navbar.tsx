import React, { useContext } from 'react';
import Link from 'next/link';
import { logout } from '@components/helper';
import { useState } from 'react';
import { SessionContext } from '@hooks/useSessionContext';
import { navLinks } from '@components/constants';

/**
 * Navbar component
 */

export const Navbar: React.FC = (): React.ReactElement => {
  const [logoutFailed, setLogoutFailed] = useState(false);
  const { isGuest, setSession } = useContext(SessionContext);
  const handleLogout = async () => {
    const data = await logout();
    if (!data.success) setLogoutFailed(true);
    else setSession(null);
  };

  return (
    <div id='navbar'>
      <div id="links-container" style={{ display: 'flex', gap: 10 }}>
        {navLinks.map((link) => (
          <Link href={link.link} key={link.link}>
            {link.label}
          </Link>
        ))}
      </div>
      <div id="actions-container">
        {isGuest ? (
          <div>
            <Link href="/login" passHref>
              login
            </Link>
            {' / '}
            <Link href="/signup" passHref>
              signup
            </Link>
          </div>
        ) : (
          <div>
            <button onClick={handleLogout}>log out</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
