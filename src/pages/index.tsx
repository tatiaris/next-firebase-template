import { AuthContext } from '@hooks/useAuth';
import React, { useContext } from 'react';

const Home = (): React.ReactNode => {
  const { user, isGuest } = useContext(AuthContext);

  return !isGuest ? (
    <div style={{ padding: '10px' }}>
      logged-in: {user.displayName}
      <br />
      e-mail: {user.email}
      <br />
      <img width={50} height={50} src={user.photoURL} alt="" />
    </div>
  ) : (
    <div style={{ padding: '10px' }}>logged-in: false</div>
  );
};

export default Home;
