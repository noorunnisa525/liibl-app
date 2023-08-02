import {StyleSheet} from 'react-native';
import {hp, wp} from '../../util';

const createStyles = theme => {
  const styles = StyleSheet.create({
    mainContainer: {
      flex: 1,
      backgroundColor: theme.color.textWhite,
      flexGrow: 1,
    },
    inputContainer: {
      flexGrow: 1,
      marginTop: hp(3),
    },
    headerText: {
      fontSize: theme.size.xLarge,
      color: theme.color.textWhite,
      fontFamily: theme.fontFamily.boldFamily,
      textAlign: 'center',
      marginVertical: hp(8),
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
    errorText: {
      fontSize: theme.size.xsmall,
      color: theme.color.textRed,
      marginHorizontal: wp(3),
      marginTop: hp(0.5),
    },
    textFieldTitle: {
      fontSize: theme.size.medium,
      textAlign: 'left',
      paddingLeft: hp(1.5),
      marginTop: hp(1),
      fontFamily: theme.fontFamily.boldFamily,
    },
    headerInitialText: {
      alignSelf: 'center',
      fontSize: hp(3),
      color: theme.color.textBlack,
      fontFamily: theme.fontFamily.boldFamily,
    },
    subContainer: {
      height: hp(12),
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingLeft: hp(2),
      alignItems: 'center',
      paddingBottom: hp(2),
    },
    headerColor: theme.color.textWhite,
    container: {
      flexGrow: 1,
      paddingHorizontal: hp(2),
      paddingBottom: hp(10),
      backgroundColor: theme.color.textWhite,
      justifyContent: 'space-between',
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
    },
    loginSubText: {
      fontSize: theme.size.small,
      alignSelf: 'center',
      textAlign: 'center',
    },
    otpView: {
      width: '80%',
      height: hp(20),
      color: theme.color.textBlack,
    },
    borderStyleHighLighted: {
      borderColor: 'black',
      color: theme.color.textBlack,
    },

    underlineStyleHighLighted: {
      borderColor: 'black',
      color: theme.color.textBlack,
    },
    underlineStyleBase: {
      width: wp(10),
      height: hp(10),
      fontSize: theme.size.large,
      borderWidth: 0,
      borderBottomWidth: 1,
      color: 'black',
    },
    optContainer: {
      flexGrow: 1,
      // alignSelf: 'center',
      justifyContent: 'space-between',
      // alignItems: 'center',
      marginTop: hp(5),
    },
    resendText: {
      fontSize: theme.size.medium,
      // alignSelf: 'flex-end',
      paddingLeft: hp(1.5),
      fontFamily: theme.fontFamily.boldFamily,
      textDecorationLine: 'underline',
      marginBottom: hp(3.5),
    },
    resend: {
      fontSize: theme.size.medium,
      alignSelf: 'flex-end',
      paddingLeft: hp(1.5),
      fontFamily: theme.fontFamily.mediumFamily,
      marginBottom: hp(5.5),
      marginLeft: hp(2),
      marginTop: -hp(3),
    },
    verifyButton: {
      width: hp(45),
      height: hp(6.5),
      marginTop: hp(2),
      borderRadius: hp(1),
      alignSelf: 'center',
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: hp(0.01),
      borderColor: theme.color.textWhite,
      backgroundColor: theme.color.textBlack,
    },
    termsButton: {
      width: hp(100),
      height: hp(5),
      alignSelf: 'center',
      justifyContent: 'center',
      alignItems: 'center',
      position: 'absolute',
      bottom: 0,
      backgroundColor: '#E5E5E5',
      flexDirection: 'row',
    },
    createButton: {
      justifyContent: 'center',
      alignItems: 'center',
    },
    termsText: {
      fontSize: theme.size.small,
      fontFamily: theme.fontFamily.boldFamily,
      color: theme.color.textBlack,
      textDecorationLine: 'underline',
    },
    text: {
      fontSize: theme.size.small,
      fontFamily: theme.fontFamily.semiBoldFamily,
      color: theme.color.textWhite,
    },
  });
  return styles;
};
export default createStyles;
