import React, { useState } from 'react';
import { login, navigatePath, signupUser } from '@/components/helper';
import { signInWithGoogle } from '@/util/firebase';
import { Container, Tabs, TextInput, Button, Group, Text, PasswordInput } from '@mantine/core';
import { IconUserPlus, IconUserCircle, IconBrandGoogle } from '@tabler/icons';
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

  const [loginFailed, setLoginFailed] = useState(false);
  const [signupFailed, setSignupFailed] = useState(false);
  const [googleSignupFailed, setGoogleSignupFailed] = useState(false);

  const handleLogin = async (values) => {
    const { email, password } = values;
    const data = await login(email, password);
    if (!data.success) setLoginFailed(true);
  }

  const handleSignup = async (values) => {
    const { email, displayName, password } = values;
    const data = await signupUser({ email, displayName }, password);
    if (!data.success) setSignupFailed(true);
  }

  const handleGoogleAuth = async () => {
    const data = await signInWithGoogle();
    if (!data.success) setGoogleSignupFailed(true);
  }

  if (session === undefined) return <></>;
  if (session) navigatePath('/');
  else {
    return (
      <Container size={400} style={{ marginTop: '50px', marginBottom: '50px' }}>
        <Tabs defaultValue="login">
          <Tabs.List style={{ display: 'flex', justifyContent: 'space-around' }}>
            <Tabs.Tab style={{ width: '50%' }} value="login" icon={<IconUserCircle size={14} />}>
              Login
            </Tabs.Tab>
            <Tabs.Tab style={{ width: '50%' }} value="signup" icon={<IconUserPlus size={14} />}>
              Signup
            </Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="login" pt="xs">
            <form onSubmit={loginForm.onSubmit((values) => login(values))}>
              <br />
              <TextInput required withAsterisk label="Email" placeholder="your@email.com" {...loginForm.getInputProps('email')} />
              <br />
              <PasswordInput required withAsterisk label="Password" placeholder="123xyz" {...loginForm.getInputProps('password')} />
              {loginFailed ? <Text color="red">Wrong email or password.</Text> : <></>}
              <br />
              <Group position="right" mt="md">
                <Button type="submit">Submit</Button>
              </Group>
            </form>
          </Tabs.Panel>

          <Tabs.Panel value="signup" pt="xs">
            <form onSubmit={signupForm.onSubmit((values) => signupUser({ email: values.email, displayName: values.displayName }, values.password, setSignupFailed))}>
              <br />
              <TextInput required withAsterisk label="Display Name" placeholder="John Doe" {...signupForm.getInputProps('displayName')} />
              <br />
              <TextInput required withAsterisk label="Email" placeholder="jdoe@email.com" {...signupForm.getInputProps('email')} />
              <br />
              <PasswordInput required withAsterisk label="Password" placeholder="123xyz" {...signupForm.getInputProps('password')} />
              {signupFailed ? <Text color="red">User already exists.</Text> : <></>}
              <br />
              <Group position="right" mt="md">
                <Button type="submit">Submit</Button>
              </Group>
            </form>
          </Tabs.Panel>
        </Tabs>
        <br />
        <Button fullWidth color="yellow" leftIcon={<IconBrandGoogle />} onClick={handleGoogleAuth}>
          Continue with Google
        </Button>
        {googleSignupFailed ? <Text color="red">Could not sign in with Google.</Text> : <></>}
      </Container>
    );
  }
};

export default Login;
