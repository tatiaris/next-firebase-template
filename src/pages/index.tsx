import { AuthContext } from '@/hooks/useAuth';
import React, { useContext } from 'react';

const Home = (): React.ReactNode => {
  const { user, isGuest } = useContext(AuthContext);

  return !isGuest ? (
    <div className="py-4 px-4">
      <div className="flex gap-2">
        <img className="rounded-full" width={50} height={50} src={user.photoURL} alt="" />
        <div>
          {user.displayName}
          <br />
          {user.email}
        </div>
      </div>
    </div>
  ) : (
    <div className="py-4 px-4">logged-in: false</div>
  );
};

export default Home;
