import { useTheme } from '@hooks/useTheme';
import { Button } from './ui/button';

/**
 * Footer component
 */
export const Footer: React.FC = () => {
  const { setTheme } = useTheme();
  return (
    <div className="px-4 py-4 border-t-2 border-zinc text-end">
      <Button variant="outline" onClick={() => setTheme(null)}>
        change theme
      </Button>
    </div>
  );
};
