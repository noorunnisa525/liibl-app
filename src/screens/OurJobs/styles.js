import {StyleSheet} from 'react-native';
import {hp, wp} from '../../util';

const createStyles = theme => {
  const styles = StyleSheet.create({
    mainContainer: {
      flex: 1,
      backgroundColor: theme.color.textWhite,
    },
    activityView: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    footerStyle: {
      marginBottom: hp(28),
    },
    headerContainerStyle: {
      borderBottomColor: theme.color.textWhite,
      backgroundColor: theme.color.textWhite,
      height: hp(15),
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingBottom: hp(2),
    },
    loginInputText: {
      fontSize: theme.size.xsmall,
      fontFamily: theme.fontFamily.mediumFamily,
    },
    subscriptionCard: {
      flex: 1,
      margin: 10,
      width: '95%',
      height: hp('32'),
      alignSelf: 'center',
      // flexDirection: 'row',
      borderRadius: hp(2),
      borderWidth: hp('0.1'),
      backgroundColor: theme.color.textWhite,
      // borderBottomWidth: hp('0.1'),
      borderColor: theme.color.dividerColor,
    },
    title: {
      fontSize: theme.size.medium,
      fontFamily: theme.fontFamily.boldFamily,
      color: theme.color.textBlack,
    },
    textFieldTitle: {
      fontSize: theme.size.medium,
      textAlign: 'left',
      paddingLeft: hp(1.5),
      fontFamily: theme.fontFamily.boldFamily,
    },
    headerInitialText: {
      fontSize: hp(3),
      color: theme.color.textBlack,
      fontFamily: theme.fontFamily.boldFamily,
    },
    subContainer: {
      height: hp(12),
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingLeft: hp(5),
      paddingRight: hp(5),
      alignItems: 'center',
      paddingBottom: hp(2),
    },
    headerColor: theme.color.textWhite,
    container: {
      flexGrow: 1,
      backgroundColor: theme.color.textWhite,
    },

    dashStyle: {
      fontSize: theme.size.medium,
      color: theme.color.dividerColor,
      alignSelf: 'center',
      marginTop: hp(2),
      marginBottom: hp(2),
    },

    iconContainer: {
      width: hp(4),
      height: hp(4),
      borderColor: theme.color.dividerColor,
      borderWidth: hp(0.1),
      justifyContent: 'center',
      borderRadius: hp(1),
      alignItems: 'center',
      marginLeft: hp(1),
    },
    loginSubText: {
      fontSize: theme.size.small,
      alignSelf: 'center',
      textAlign: 'center',
    },
    checkBoxText: {
      fontSize: theme.size.xsmall,
      fontFamily: theme.fontFamily.mediumFamily,
      color: '#748B9B',
      paddingLeft: hp(1),
      marginTop: hp(0.5),
    },
    otpView: {
      width: '80%',
      height: hp(20),
      color: theme.color.textBlack,
    },

    optContainer: {
      flexGrow: 1,
      justifyContent: 'space-between',
    },
    subscriptionButton: {
      width: hp(40),
      height: hp(6.5),
      borderRadius: hp(1),
      alignSelf: 'center',
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: hp(0.01),
      borderColor: theme.color.textWhite,
      backgroundColor: theme.color.textBlack,
      marginTop: hp(10),
    },
    subsText: {
      fontSize: theme.size.small,
      fontFamily: theme.fontFamily.semiBoldFamily,
      color: theme.color.textWhite,

      // marginHorizontal: wp(2),
    },
    emptyMessageStyle: {
      fontSize: theme.size.medium,
      fontFamily: theme.fontFamily.semiBoldFamily,
      marginTop: hp(1),
    },
  });
  return styles;
};
export default createStyles;
