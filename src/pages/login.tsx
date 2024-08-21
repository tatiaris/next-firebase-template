import React, { useContext, useState } from 'react';
import { login, navigatePath } from 'src/lib/helper';
import { signInWithGoogle } from '@util/firebase';
import { SessionContext } from '@hooks/useSession';

const Login = (): React.ReactNode => {
  const { isGuest } = useContext(SessionContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginStatus, setLoginStatus] = useState({
    status: '',
    message: ''
  });
  const [googleSignupFailed, setGoogleSignupFailed] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    const data = await login(email, password);
    if (!data.success) setLoginStatus({ status: 'error', message: data.message });
  };

  const handleGoogleAuth = async (e) => {
    e.preventDefault();
    try {
      const data = await signInWithGoogle();
      if (!data.success) setGoogleSignupFailed(true);
    } catch (error) {
      setGoogleSignupFailed(true);
    }
  };

  if (!isGuest) navigatePath('/');
  else {
    return (
      <div style={{ padding: 10 }}>
        <form onSubmit={handleLogin}>
          <input type="text" name="email" required placeholder="your@email.com" onChange={(e) => setEmail(e.target.value)} />
          <br />
          <input type="password" required placeholder="123xyz" onChange={(e) => setPassword(e.target.value)} />
          {loginStatus.status === 'error' ? <span style={{ color: 'red' }}>{loginStatus.message}</span> : <></>}
          <br />
          <button type="submit">submit</button>
        </form>
        <button type="button" onClick={handleGoogleAuth}>
          login with google
        </button>
        {googleSignupFailed ? <span style={{ color: 'red', display: 'block' }}>could not sign in with google.</span> : <></>}
      </div>
    );
  }
};

export default Login;
