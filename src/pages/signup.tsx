import React, { useContext, useState } from 'react';
import { navigatePath, signupUser } from '@components/helper';
import { signInWithGoogle } from '@util/firebase';
import { SessionContext } from '@hooks/useSessionContext';

const Signup = (): React.ReactNode => {
  const { isGuest } = useContext(SessionContext);
  const [email, setEmail] = useState('');
  const [emailValid, setEmailValid] = useState(true);
  const [password, setPassword] = useState('');
  const [passwordValid, setPasswordValid] = useState(true);
  const [displayName, setDisplayName] = useState('');
  const [displayNameValid, setDisplayNameValid] = useState(true);
  const [signupFailed, setSignupFailed] = useState(false);
  const [googleSignupFailed, setGoogleSignupFailed] = useState(false);

  const validateEmail = () => {
    const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    setEmailValid(emailValid);
  }

  const validatePassword = () => {
    const passwordValid = password.length >= 6;
    setPasswordValid(passwordValid);
  }

  const validateDisplayName = () => {
    const displayNameValid = displayName.length >= 2;
    setDisplayNameValid(displayNameValid);
  }

  const handleSignup = async (e) => {
    e.preventDefault();
    const data = await signupUser({ email, displayName }, password);
    if (!data.success) setSignupFailed(true);
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
        <form onSubmit={handleSignup}>
          <input type='text' required placeholder="John Doe" onChange={e => setDisplayName(e.target.value)} onBlur={validateDisplayName} />
          {!displayNameValid ? <span style={{ color: 'red', fontSize: '0.8em', display: 'block' }}>Name must 2 or more characters</span> : <br />}
          <input type='text' required placeholder="jdoe@email.com" onChange={e => setEmail(e.target.value)} onBlur={validateEmail} />
          {!emailValid ? <span style={{ color: 'red', fontSize: '0.8em', display: 'block' }}>Invalid email</span> : <br />}
          <input type='password' required placeholder="123xyz" onChange={e => setPassword(e.target.value)} onBlur={validatePassword} />
          {!passwordValid ? <span style={{ color: 'red', fontSize: '0.8em', display: 'block' }}>Password must be 6 or more characters</span> : <br />}
          {signupFailed ? <span style={{ color: 'red' }}>User already exists.</span> : <></>}
          <br />
          <button type="submit">Submit</button>
        </form>
        <br />
        <button onClick={handleGoogleAuth}>
          Signup with Google
        </button>
        {googleSignupFailed ? <span style={{ color: 'red' }}>Could not sign in with Google.</span> : <></>}
      </div>
    );
  }
};

export default Signup;
