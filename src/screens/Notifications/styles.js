import {StyleSheet} from 'react-native';
import {hp, wp} from '../../util';

const createStyles = theme => {
  const styles = StyleSheet.create({
    mainContainer: {
      flexGrow: 1,
      backgroundColor: theme.color.textWhite,
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
    textFieldTitle: {
      fontSize: theme.size.medium,
      textAlign: 'left',
      paddingLeft: hp(1.5),
      fontFamily: theme.fontFamily.boldFamily,
    },
    headerInitialText: {
      alignSelf: 'center',
      fontSize: hp(3),
      color: theme.color.textBlack,
      fontFamily: theme.fontFamily.boldFamily,
    },
    headerColor: theme.color.textWhite,
    container: {
      flexGrow: 1,
      paddingHorizontal: wp(2),
      backgroundColor: theme.color.textWhite,
    },
    emptyMessageStyle: {
      fontSize: theme.size.medium,
      fontFamily: theme.fontFamily.semiBoldFamily,
      marginTop: hp(1),
    },
    activityView: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    notificationContainer: {
      padding: hp(1),
      marginHorizontal: wp(3),
      marginVertical: hp(1),
      backgroundColor: theme.color.textWhite,
      borderRadius: 10,
      borderWidth: hp(0.1),
      borderColor: theme.color.dividerColor,
      elevation: 5,
      shadowColor: theme.color.avatarColor,
      shadowOffset: {width: 0, height: 1},
      shadowOpacity: 1,
      shadowRadius: 1,
    },
    imageContainer: {
      marginRight: wp(2),
    },
    imageStyle: {
      height: hp(6),
      width: hp(6),
      borderRadius: 30,
    },
    topView: {
      flexDirection: 'row',
    },
    rightContainer: {
      justifyContent: 'space-between',
    },
    timeText: {
      alignSelf: 'flex-end',
      fontSize: hp(1.2),
      fontFamily: theme.fontFamily.mediumFamily,
    },
    notifText: {
      width: wp(70),
      fontFamily: theme.fontFamily.semiBoldFamily,
      fontSize: hp(2),
    },
    footerStyle: {
      marginBottom: hp(17),
    },
  });
  return styles;
};
export default createStyles;
