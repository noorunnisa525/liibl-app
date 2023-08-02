import {StyleSheet} from 'react-native';
import {hp, wp} from '../../util';

const createStyles = theme => {
  const styles = StyleSheet.create({
    headerColor: {
      flex: 1,
      backgroundColor: 'transparent',
    },
    // headerText: {
    //   fontSize: theme.size.xLarge,
    //   color: theme.color.textWhite,
    //   textAlign: 'center',
    //   marginVertical: hp(8),
    // },
  });
  return styles;
};
export default createStyles;
