import React, { useContext, useEffect } from 'react';
import Link from 'next/link';
import { useState } from 'react';
import { signInWithGoogle, signOutFromGoogle } from '@util/firebase';
import { AuthContext } from '@hooks/useAuth';
import { useLogger } from '@hooks/useLogger';

/**
 * Navbar component
 */

export const Navbar: React.FC = (): React.ReactElement => {
  const logger = useLogger();
  const [logoutFailed, setLogoutFailed] = useState(false);
  const { isGuest } = useContext(AuthContext);

  useEffect(() => {
    if (logoutFailed) {
      logger.log('Logout failed, trying again in 5 seconds...');
      setLogoutFailed(false);
      setTimeout(() => {
        signOutFromGoogle();
      }, 5000);
    }
  }, [logoutFailed]);

  return (
    <div id="navbar">
      <div id="links-container" style={{ display: 'flex', gap: 10 }}>
        <Link href={`/`}>{`Home`}</Link>
      </div>
      <div id="actions-container">
        {isGuest ? (
          <div>
            <button onClick={signInWithGoogle}>log in</button>
          </div>
        ) : (
          <div>
            <button onClick={signOutFromGoogle}>log out</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
