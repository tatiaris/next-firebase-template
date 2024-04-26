import { SessionContext } from '@hooks/useSessionContext';
import React, { useContext } from 'react';

const Home = (): React.ReactNode => {
  const { session, isGuest } = useContext(SessionContext);
  return !isGuest ? (
    <div style={{ padding: '10px' }}>
      Logged-in: true
      <br />
      Welcome {session.displayName}
      <br />
      E-mail: {session.email}
      <br />
      <img width={50} height={50} src={session.photoURL} alt="" />
    </div>
  ) : (
    <div style={{ padding: '10px' }}>Logged-in: false</div>
  );
};

export default Home;
