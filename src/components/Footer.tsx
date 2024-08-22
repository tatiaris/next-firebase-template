import { ThemeContext } from '@hooks/useTheme';
import React, { useContext } from 'react';

/**
 * Footer component
 */
export const Footer: React.FC = () => {
  const { updateTheme } = useContext(ThemeContext);
  return (
    <div id="footer">
      <button onClick={() => updateTheme()}>change theme</button>
    </div>
  );
};

export default Footer;
