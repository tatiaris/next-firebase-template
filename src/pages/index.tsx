import React from 'react';

const Home = ({ session }): React.ReactNode => {
  return session ? (
    <div style={{ padding: '20px' }}>
      Homepage
      <br />
      Logged-in: True
      <br />
      Welcome {session.displayName}
      <br />
      E-mail: {session.email}
    </div>
  ) : (
    <div style={{ padding: '20px' }}>
      Homepage
      <br />
      Logged-in: False
    </div>
  );
};

export default Home;
