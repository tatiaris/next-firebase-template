import { createContext, useEffect, useState } from 'react';
import { User } from 'firebase/auth';
import { auth } from '@util/firebase';

export const AuthContext = createContext<{
  user: User | null;
  isLoading: boolean;
  isGuest: boolean;
}>({
  user: null,
  isLoading: true,
  isGuest: true
});

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    return auth.onAuthStateChanged((user) => {
      setUser(user);
      setIsLoading(false);
    });
  }, []);

  return {
    user,
    isLoading,
    isGuest: !user
  };
};
