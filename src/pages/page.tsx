import LoginForm from '@components/forms/login-form';
import Loading, { LoadingComponent } from '@components/ui/loading';
import { useAuth } from '@hooks/useAuth';
import Image from 'next/image';

export default function Home() {
  const { user, isGuest, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="py-4 px-8">
        <Loading component={LoadingComponent.UserBadge} />
      </div>
    );
  }

  return !isGuest && user ? (
    <div className="py-4 px-8">
      <div className="flex gap-2 items-center">
        <Image className="rounded-full" width={50} height={50} src={user.photoURL || '/placeholders/user.jpg'} alt="" />
        <div>
          <div>{user.displayName && user.displayName}</div>
          <div>{user.email}</div>
        </div>
      </div>
    </div>
  ) : (
    <div className="py-4 px-8">
      <div className="lg:max-w-80">
        <LoginForm />
      </div>
    </div>
  );
}
