import React, { useContext, useState } from 'react';
import { navigatePath, signupUser } from 'src/lib/helper';
import { signInWithGoogle } from '@util/firebase';
import { SessionContext } from '@hooks/useSession';

const Signup = (): React.ReactNode => {
  const { isGuest } = useContext(SessionContext);
  const [email, setEmail] = useState('');
  const [emailValid, setEmailValid] = useState(true);
  const [password, setPassword] = useState('');
  const [passwordValid, setPasswordValid] = useState(true);
  const [name, setName] = useState('');
  const [nameValid, setNameValid] = useState(true);
  const [signupStatus, setSignupStatus] = useState({
    status: '',
    message: ''
  });
  const [googleSignupFailed, setGoogleSignupFailed] = useState(false);

  const validateEmail = () => {
    const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    setEmailValid(emailValid);
  };

  const validatePassword = () => {
    const passwordValid = password.length >= 6;
    setPasswordValid(passwordValid);
  };

  const validatename = () => {
    const nameValid = name.length >= 2;
    setNameValid(nameValid);
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    const data = await signupUser({ email, name }, password);
    if (!data.success) {
      setSignupStatus({ status: 'error', message: data.message });
    }
  };

  const handleGoogleAuth = async (e) => {
    e.preventDefault();
    const data = await signInWithGoogle();
    if (!data.success) setGoogleSignupFailed(true);
  };

  if (!isGuest) navigatePath('/');
  else {
    return (
      <div style={{ padding: 10 }}>
        <form onSubmit={handleSignup}>
          <input type="text" name="name" required placeholder="John Doe" onChange={(e) => setName(e.target.value)} onBlur={validatename} />
          {!nameValid ? <span style={{ color: 'red', fontSize: '0.8em', display: 'block' }}>name must 2 or more characters</span> : <br />}
          <input type="text" name="email" required placeholder="jdoe@email.com" onChange={(e) => setEmail(e.target.value)} onBlur={validateEmail} />
          {!emailValid ? <span style={{ color: 'red', fontSize: '0.8em', display: 'block' }}>invalid email</span> : <br />}
          <input type="password" name="password" required placeholder="123xyz" onChange={(e) => setPassword(e.target.value)} onBlur={validatePassword} />
          {!passwordValid ? <span style={{ color: 'red', fontSize: '0.8em', display: 'block' }}>password must be 6 or more characters</span> : <br />}
          {signupStatus.status === 'error' ? <span style={{ color: 'red' }}>{signupStatus.message}</span> : <></>}
          <button type="submit">submit</button>
        </form>
        <button onClick={handleGoogleAuth}>signup with google</button>
        {googleSignupFailed ? <span style={{ color: 'red' }}>could not signup with google.</span> : <></>}
      </div>
    );
  }
};

export default Signup;
