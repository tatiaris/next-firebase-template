import { ThemeContext } from '@hooks/useTheme';
import React, { useContext } from 'react';

/**
 * Footer component
 */
export const Footer: React.FC = () => {
  const { setTheme } = useContext(ThemeContext);
  return (
    <div id="footer">
      <button onClick={() => setTheme()}>change theme</button>
    </div>
  );
};

export default Footer;
