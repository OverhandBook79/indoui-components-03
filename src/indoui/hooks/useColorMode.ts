import { useTheme } from 'next-themes';

export function useColorMode() {
  const { theme, setTheme, systemTheme } = useTheme();
  
  const colorMode = theme === 'system' ? systemTheme : theme;
  
  const toggleColorMode = () => {
    setTheme(colorMode === 'dark' ? 'light' : 'dark');
  };
  
  const setColorMode = (mode: 'light' | 'dark') => {
    setTheme(mode);
  };
  
  return {
    colorMode: colorMode as 'light' | 'dark',
    toggleColorMode,
    setColorMode,
    setTheme,
  };
}
