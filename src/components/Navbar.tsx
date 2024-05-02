import React, { useContext, useEffect } from 'react';
import Link from 'next/link';
import { logout } from 'src/lib/helper';
import { useState } from 'react';
import { SessionContext } from '@hooks/useSessionContext';
import { navLinks } from 'src/lib/constants';
import { LoggerContext } from '@util/logger';

/**
 * Navbar component
 */

export const Navbar: React.FC = (): React.ReactElement => {
  const logger = useContext(LoggerContext);
  const [logoutFailed, setLogoutFailed] = useState(false);
  const { isGuest, session, setSession } = useContext(SessionContext);
  const handleLogout = async () => {
    const data = await logout();
    if (!data.success) setLogoutFailed(true);
    else setSession(null);
  };

  useEffect(() => {
    if (logoutFailed) {
      logger.log('Logout failed, trying again in 5 seconds...');
      setLogoutFailed(false);
      setTimeout(() => {
        handleLogout();
      }, 5000);
    }
  }, [logoutFailed]);

  return (
    <div id="navbar">
      <div id="links-container" style={{ display: 'flex', gap: 10 }}>
        {navLinks.map((link) =>
          link.adminOnly ? (
            session?.isAdmin && (
              <Link href={link.link} key={link.link}>
                {link.label}
              </Link>
            )
          ) : (
            <Link href={link.link} key={link.link}>
              {link.label}
            </Link>
          )
        )}
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
