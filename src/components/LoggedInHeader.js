import React from 'react';
import {StyleSheet} from 'react-native';
import {Header} from 'react-native-elements';
import {useThemeAwareObject} from '../theme';
import {wp} from '../util';

function LoggedInHeader(props) {
  const createStyles = theme => {
    const themeStyles = StyleSheet.create({
      backgroundColor: {
        backgroundColor: theme.color.textWhite,
      },
      sideContainerStyle: {
        marginHorizontal: wp(2),
      },
    });
    return themeStyles;
  };
  const styles = useThemeAwareObject(createStyles);
  return (
    <Header
      statusBarProps={props.statusbar ?? styles.backgroundColor}
      barStyle={props.barStyle}
      placement={props.placement}
      leftComponent={props.leftComponent}
      centerComponent={({allowFontScaling: false}, props.centerComponent)}
      rightComponent={props.rightComponent}
      backgroundColor={props.backgroundColor}
      containerStyle={props.containerStyle}
      centerContainerStyle={props.centerContainerStyle}
      leftContainerStyle={[styles.sideContainerStyle, props.leftContainerStyle]}
      rightContainerStyle={[
        styles.sideContainerStyle,
        props.rightContainerStyle,
      ]}
    />
  );
}

export default LoggedInHeader;
