import { Button } from "./ui/button";
import { useTheme } from "@hooks/useTheme";

/**
 * Footer component
 */
export const Footer: React.FC = () => {
  const { toggleTheme } = useTheme();
  return (
    <div className="px-8 py-4 border-t-2 border-zinc text-end">
      <Button variant="outline" onClick={() => toggleTheme()}>
        Toggle theme
      </Button>
    </div>
  );
};
