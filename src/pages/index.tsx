import React from 'react';

const Home = ({ session }): React.ReactNode => {
  return session ? (
    <div style={{ padding: '10px' }}>
      Homepage
      <br />
      Logged-in: True
      <br />
      Welcome {session.displayName}
      <br />
      E-mail: {session.email}
      <br />
      <img width={50} height={50} src={session.photoURL} alt='' />
    </div>
  ) : (
    <div style={{ padding: '10px' }}>
      Homepage
      <br />
      Logged-in: False
    </div>
  );
};

export default Home;
