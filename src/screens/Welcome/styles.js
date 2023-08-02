import {StyleSheet} from 'react-native';
import {hp, wp} from '../../util';

const createStyles = theme => {
  const styles = StyleSheet.create({
    mainContainer: {
      flex: 1,
      backgroundColor: theme.color.textBlack,
    },
    headerText: {
      fontSize: theme.size.xLarge,
      color: theme.color.textWhite,
      fontFamily: theme.fontFamily.boldFamily,
      textAlign: 'center',
      marginVertical: hp(8),
      // fontWeight: 'bold',
    },
    headerContainerStyle: {
      borderBottomColor: theme.color.textBlack,
    },
    headerColor: theme.color.textBlack,
    container: {
      flexGrow: 1,
      // paddingHorizontal: hp(5),
      paddingBottom: hp(5),
      backgroundColor: theme.color.textBlack,
      justifyContent: 'space-between',
    },
    loginText: {
      fontSize: hp(3),
      fontFamily: theme.fontFamily.boldFamily,
      paddingTop: hp(5),
      paddingVertical: hp(2),
      alignSelf: 'center',
      color: theme.color.textWhite,
    },
    getStartedButton: {
      width: hp(40),
      height: hp(6.5),
      borderRadius: hp(1),
      alignSelf: 'center',
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: hp(0.01),
      borderColor: theme.color.textWhite,
      backgroundColor: theme.color.textWhite,
    },
    getStartedText: {
      fontSize: theme.size.small,
      fontFamily: theme.fontFamily.semiBoldFamily,
      // marginHorizontal: wp(2),
    },
    subText: {
      fontSize: theme.size.small,
      textAlign: 'center',
      color: theme.color.textWhite,
      fontFamily: theme.fontFamily.lightFamily,
    },
    socialText: {
      fontSize: theme.size.small,
      fontFamily: theme.fontFamily.boldFamily,
      marginHorizontal: wp(2),
    },
    termsText: {
      fontSize: theme.size.small,
      color: theme.color.backgroundColor,
      textDecorationLine: 'underline',
    },

    headerImage: {
      width: hp(20),
      height: hp(20),
      alignSelf: 'center',
    },
  });
  return styles;
};
export default createStyles;
