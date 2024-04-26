import React, { useContext, useState } from 'react';
import { login, navigatePath } from '@components/helper';
import { signInWithGoogle } from '@util/firebase';
import { SessionContext } from '@hooks/useSessionContext';

const Login = (): React.ReactNode => {
  const { isGuest } = useContext(SessionContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginFailed, setLoginFailed] = useState(false);
  const [googleSignupFailed, setGoogleSignupFailed] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    const data = await login(email, password);
    if (!data.success) setLoginFailed(true);
  }

  const handleGoogleAuth = async (e) => {
    e.preventDefault();
    const data = await signInWithGoogle();
    if (!data.success) setGoogleSignupFailed(true);
  }

  if (!isGuest) navigatePath('/');
  else {
    return (
      <div style={{ padding: 10 }}>
        <form onSubmit={handleLogin}>
          <input type='text' required placeholder="your@email.com" onChange={e => setEmail(e.target.value)} />
          <br />
          <input type='password' required placeholder="123xyz" onChange={e => setPassword(e.target.value)} />
          {loginFailed ? <span style={{ color: 'red' }}>Wrong email or password.</span> : <></>}
          <br />
          <button type="submit">Submit</button>
        </form>
        <br />
        <button type='button' onClick={handleGoogleAuth}>
          Login with Google
        </button>
        {googleSignupFailed ? <span style={{ color: 'red' }}>Could not sign in with Google.</span> : <></>}
      </div >
    );
  }
};

export default Login;
