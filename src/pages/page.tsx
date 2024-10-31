import RecentNotes from "@features/recent-notes";
import LoginForm from "@components/forms/login";
import NoteForm from "@components/forms/note";
import Loading, { LoadingComponent } from "@components/ui/loading";
import { useAuth } from "@hooks/useAuth";
import { FORM_TYPE } from "@components/forms/utils";

export default function Home() {
  const { user, isGuest, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="py-8 px-8">
        <Loading component={LoadingComponent.UserBadge} />
      </div>
    );
  }

  return !isGuest && user ? (
    <div className="py-8 px-8">
      <NoteForm formType={FORM_TYPE.CREATE} />
      <br /><br />
      <RecentNotes />
    </div>
  ) : (
    <div className="py-8 px-8">
      <div className="lg:max-w-80">
        <LoginForm />
      </div>
    </div>
  );
}
