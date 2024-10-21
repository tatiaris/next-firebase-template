import LoginForm from '@components/forms/login-form';
import Loading, { LoadingComponent } from '@components/ui/loading';
import { useAuth } from '@hooks/useAuth';

export default function Home(): React.ReactNode {
  const { user, isGuest, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="py-4 px-4">
        <Loading component={LoadingComponent.UserBadge} />
      </div>
    );
  }

  return !isGuest ? (
    <div className="py-4 px-4">
      <div className="flex gap-2 items-center">
        <img className="rounded-full" width={50} height={50} src={user.photoURL || '/placeholders/user.jpg'} alt="" />
        <div>
          <div>{user.displayName && user.displayName}</div>
          <div>{user.email}</div>
        </div>
      </div>
    </div>
  ) : (
    <div className="py-4 px-4">
      <div className="lg:max-w-80">
        <LoginForm />
      </div>
    </div>
  );
}
