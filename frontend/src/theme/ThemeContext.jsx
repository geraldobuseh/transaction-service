import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from 'react';

const THEME_STORAGE_KEY = 'transact_background_mode';
const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [backgroundMode, setBackgroundMode] = useState(() => {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    return stored === 'white' ? 'white' : 'black';
  });

  useEffect(() => {
    localStorage.setItem(THEME_STORAGE_KEY, backgroundMode);
    document.documentElement.dataset.backgroundMode = backgroundMode;
  }, [backgroundMode]);

  const toggleBackgroundMode = useCallback(() => {
    setBackgroundMode((current) => (current === 'black' ? 'white' : 'black'));
  }, []);

  const value = useMemo(
    () => ({
      backgroundMode,
      isWhiteBackground: backgroundMode === 'white',
      toggleBackgroundMode
    }),
    [backgroundMode, toggleBackgroundMode]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }

  return context;
}
