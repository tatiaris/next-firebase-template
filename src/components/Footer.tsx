import { useTheme } from '@hooks/useTheme';
import { Button } from './ui/button';

/**
 * Footer component
 */
export const Footer: React.FC = () => {
  const { toggleTheme } = useTheme();
  return (
    <div className="px-8 py-4 border-t-2 border-zinc text-end">
      <Button variant="outline" onClick={() => toggleTheme()}>
        change theme
      </Button>
    </div>
  );
};
