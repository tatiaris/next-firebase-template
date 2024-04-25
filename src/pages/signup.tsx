import React, { useState } from 'react';
import { navigatePath, signupUser } from '@/components/helper';
import { signInWithGoogle } from '@/util/firebase';
import { useForm } from '@mantine/form';

const Signup = ({ session }): React.ReactNode => {
  const signupForm = useForm({
    initialValues: {
      email: '',
      displayName: '',
      password: ''
    },
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
      displayName: (value) => (value.length > 1 ? null : 'Invalid display name')
    }
  });

  const [signupFailed, setSignupFailed] = useState(false);
  const [googleSignupFailed, setGoogleSignupFailed] = useState(false);

  const handleSignup = async (values) => {
    const { email, displayName, password } = values;
    const data = await signupUser({ email, displayName }, password);
    if (!data.success) setSignupFailed(true);
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

        <form onSubmit={signupForm.onSubmit((values) => handleSignup(values))}>
          <br />
          <input type='text' required placeholder="John Doe" {...signupForm.getInputProps('displayName')} />
          <br />
          <input type='text' required placeholder="jdoe@email.com" {...signupForm.getInputProps('email')} />
          <br />
          <input type='password' required placeholder="123xyz" {...signupForm.getInputProps('password')} />
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
