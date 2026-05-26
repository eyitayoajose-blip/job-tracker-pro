import React, { createContext, useState, useContext, useEffect } from 'react';

const ThemeContext = createContext();
export const useTheme = () => useContext(ThemeContext);

const colorSchemes = {
  default: { primary: '#a855f7', secondary: '#ec4899', name: 'Default' },
  ocean:    { primary: '#0ea5e9', secondary: '#06b6d4', name: 'Ocean' },
  forest:   { primary: '#10b981', secondary: '#34d399', name: 'Forest' },
  sunset:   { primary: '#f97316', secondary: '#f43f5e', name: 'Sunset' },
  midnight: { primary: '#6366f1', secondary: '#8b5cf6', name: 'Midnight' },
};

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? saved === 'true' : true;
  });
  const [colorScheme, setColorScheme] = useState(() => {
    const saved = localStorage.getItem('colorScheme');
    return saved || 'default';
  });

  useEffect(() => {
    localStorage.setItem('darkMode', isDark);
    if (isDark) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [isDark]);

  useEffect(() => {
    localStorage.setItem('colorScheme', colorScheme);
    const scheme = colorSchemes[colorScheme];
    document.documentElement.style.setProperty('--theme-primary', scheme.primary);
    document.documentElement.style.setProperty('--theme-secondary', scheme.secondary);
    document.documentElement.style.setProperty('--theme-gradient', `linear-gradient(135deg, ${scheme.primary}, ${scheme.secondary})`);
  }, [colorScheme]);

  const toggleDarkMode = () => setIsDark(prev => !prev);
  const changeColorScheme = (scheme) => setColorScheme(scheme);

  return (
    <ThemeContext.Provider value={{ isDark, toggleDarkMode, colorScheme, changeColorScheme, colorSchemes }}>
      {children}
    </ThemeContext.Provider>
  );
};
