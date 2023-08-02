import React from 'react';
import {Dimensions, StyleSheet} from 'react-native';
import {Divider} from 'react-native-elements';
import {useThemeAwareObject} from '../theme';
import {hp, wp} from '../util';

function CustomDivider(props) {
  const {width, height} = Dimensions.get('window');
  const createStyles = theme => {
    const themeStyles = StyleSheet.create({
      dividerStyle: {
        alignSelf: 'center',
        marginVertical: hp(3),
        height: hp(0.7),
        width: wp(88),
        borderBottomColor: 'transparent',
        borderRadius: theme.borders.radius2,
        backgroundColor: theme.color.inputBackground,
      },
    });
    return themeStyles;
  };
  const styles = useThemeAwareObject(createStyles);
  return <Divider style={[styles.dividerStyle, props.customStyle]} />;
}

export default CustomDivider;
