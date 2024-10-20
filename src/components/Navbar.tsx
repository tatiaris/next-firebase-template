import React, { useContext, useEffect } from 'react';
import { useState } from 'react';
import { Button } from './ui/button';
import { useRouter } from 'next/router';
import { signOutFromGoogle } from '@/util/firebase';
import { useLogger } from '@/hooks/useLogger';
import { AuthContext } from '@/hooks/useAuth';

/**
 * Navbar component
 */

export const Navbar: React.FC = (): React.ReactElement => {
  const router = useRouter();
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
    <div className="px-4 py-4 flex justify-between border-b-2 border-zinc">
      <div className="flex gap-10">
        <Button variant="link" onClick={() => router.push('/')}>
          home
        </Button>
      </div>
      <div>
        {!isGuest && (
          <Button variant="outline" onClick={signOutFromGoogle}>
            log out
          </Button>
        )}
      </div>
    </div>
  );
};

export default Navbar;
