import React from 'react';
import {StyleSheet, Text} from 'react-native';
import {useThemeAwareObject} from '../theme';

const TextField = ({children, numberOfLines, style, onPress}) => {
  const createStyles = theme => {
    const themeStyles = StyleSheet.create({
      textStyle: {
        color: theme.color.textBlack,
        fontSize: theme.size.xSmall,
        fontFamily: theme.fontFamily.lightFamily,
      },
    });
    return themeStyles;
  };
  const styles = useThemeAwareObject(createStyles);
  return (
    <Text
      numberOfLines={numberOfLines}
      onPress={onPress}
      style={[styles.textStyle, style]}
      allowFontScaling={false}>
      {children}
    </Text>
  );
};

export default TextField;
