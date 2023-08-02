import React from 'react';
import {DEFAULT_DARK_THEME, DEFAULT_DARK_THEME_ID} from './DefaultDark';
import {DEFAULT_LIGHT_THEME, DEFAULT_LIGHT_THEME_ID} from './DefaultLight';

const Context = React.createContext({
  theme: DEFAULT_LIGHT_THEME,
  setTheme: () => {
    console.log('ThemeProvider is not rendered!');
  },
  toggleTheme: () => {
    console.log('ThemeProvider is not rendered!');
  },
});

export const ThemeProvider = React.memo(props => {
  const [theme, setTheme] = React.useState(props.initial);

  const SetThemeCallback = React.useCallback(newTheme => {
    setTheme(currentTheme => {
      if (currentTheme.id === newTheme.id) {
        return currentTheme;
      }

      return newTheme;
    });
  }, []);

  const ToggleThemeCallback = React.useCallback(() => {
    setTheme(currentTheme => {
      if (currentTheme.id === DEFAULT_LIGHT_THEME_ID) {
        return DEFAULT_DARK_THEME;
      }
      if (currentTheme.id === DEFAULT_DARK_THEME_ID) {
        return DEFAULT_LIGHT_THEME;
      }
      return currentTheme;
    });
  }, []);

  const MemoizedValue = React.useMemo(() => {
    const value = {
      theme,
      setTheme: SetThemeCallback,
      toggleTheme: ToggleThemeCallback,
    };
    return value;
  }, [theme, SetThemeCallback, ToggleThemeCallback]);

  return (
    <Context.Provider value={MemoizedValue}>{props.children}</Context.Provider>
  );
});

export const useTheme = () => React.useContext(Context);
