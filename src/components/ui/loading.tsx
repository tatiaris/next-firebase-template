import { Skeleton } from '@components/ui/skeleton';
import { Spinner } from './spinner';

/**
 * Loading component
 */

export enum LoadingComponent {
  Spinner = 'spinner',
  UserBadge = 'user-badge'
}
type LoadingProps = {
  component?: LoadingComponent;
};

const Loading: React.FC<LoadingProps> = ({ component = LoadingComponent.Spinner }) => {
  switch (component) {
    case LoadingComponent.Spinner:
      return <Spinner />;
    case LoadingComponent.UserBadge:
      return (
        <div className="flex items-center space-x-4">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[200px]" />
            <Skeleton className="h-4 w-[250px]" />
          </div>
        </div>
      );
    default:
      return <Spinner />;
  }
};

export default Loading;
