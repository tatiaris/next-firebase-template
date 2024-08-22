import React, { useContext, useState } from 'react';
import { navigatePath } from 'src/lib/helper';
import { signInWithGoogle } from '@util/firebase';
import { AuthContext } from '@hooks/useAuth';

const Login = (): React.ReactNode => {
  const { isGuest } = useContext(AuthContext);
  const [googleSignupFailed, setGoogleSignupFailed] = useState(false);

  const handleGoogleAuth = async (e) => {
    e.preventDefault();
    try {
      signInWithGoogle();
    } catch (error) {
      setGoogleSignupFailed(true);
    }
  };

  if (!isGuest) navigatePath('/');
  else {
    return (
      <div style={{ padding: 10 }}>
        <button type="button" onClick={handleGoogleAuth}>
          login with google
        </button>
        {googleSignupFailed ? <span style={{ color: 'red', display: 'block' }}>could not sign in with google.</span> : <></>}
      </div>
    );
  }
};

export default Login;
