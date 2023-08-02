import React from 'react';
import {useTheme} from './Theme';

export const useThemeAwareObject = fn => {
  const {theme} = useTheme();

  const ThemeAwareObject = React.useMemo(() => fn(theme), [fn, theme]);
  return ThemeAwareObject;
};
