import {StyleSheet} from 'react-native';
import {hp, wp} from '../../util';

const createStyles = theme => {
  const styles = StyleSheet.create({
    iconSize: wp(6),
    socialButtonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      padding: hp(2),
    },
    googleBtn: {
      justifyContent: 'center',
      paddingLeft: wp(2),
      width: wp(40),
      height: hp(6.5),
      borderRadius: hp(2),
      borderWidth: hp(0.1),
      borderColor: theme.color.dividerColor,
    },
    facebookBtn: {
      justifyContent: 'center',
      alignItems: 'center',
      paddingLeft: wp(2),
      width: wp(40),
      height: hp(6.5),
      borderRadius: hp(2),
      borderWidth: hp(0.1),
      backgroundColor: '#1877F2',
      borderColor: '#1877F2',
    },
    appleBtn: {
      alignSelf: 'center',
      justifyContent: 'center',
      alignItems: 'center',
      paddingLeft: wp(2),
      width: wp(85),
      height: hp(6.5),
      borderRadius: hp(2),
      borderWidth: hp(0.1),
      backgroundColor: '#000',
      borderColor: '#000',
    },
    googleBtnText: {
      fontSize: theme.size.small,
      fontFamily: theme.fontFamily.boldFamily,
      marginHorizontal: wp(4),
    },
    facebookBtnText: {
      fontSize: theme.size.small,
      fontFamily: theme.fontFamily.boldFamily,
      color: theme.color.textWhite,
      marginHorizontal: wp(7),
    },
    appleBtnText: {
      color: theme.color.textWhite,
      fontSize: theme.size.small,
      fontFamily: theme.fontFamily.boldFamily,
      marginHorizontal: wp(7),
    },
  });
  return styles;
};
export default createStyles;
