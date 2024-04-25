import React, { useState } from 'react';
import { login, navigatePath } from '@/components/helper';
import { signInWithGoogle } from '@/util/firebase';
import { useForm } from '@mantine/form';

const Login = ({ session }): React.ReactNode => {
  const loginForm = useForm({
    initialValues: {
      email: '',
      password: ''
    },
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email')
    }
  });

  const [loginFailed, setLoginFailed] = useState(false);
  const [googleSignupFailed, setGoogleSignupFailed] = useState(false);

  const handleLogin = async (values) => {
    const { email, password } = values;
    const data = await login(email, password);
    if (!data.success) setLoginFailed(true);
  }

  const handleGoogleAuth = async (e) => {
    e.preventDefault();
    const data = await signInWithGoogle();
    if (!data.success) setGoogleSignupFailed(true);
  }

  if (session === undefined) return <></>;
  if (session) navigatePath('/');
  else {
    return (
      <div style={{ padding: 10 }}>

        <form onSubmit={loginForm.onSubmit((values) => handleLogin(values))}>
          <br />
          <input type='text' required placeholder="your@email.com" {...loginForm.getInputProps('email')} />
          <br />
          <input type='password' required placeholder="123xyz" {...loginForm.getInputProps('password')} />
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
