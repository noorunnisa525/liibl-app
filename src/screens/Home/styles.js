import {StyleSheet} from 'react-native';
import {hp, wp} from '../../util';

const createStyles = theme => {
  const styles = StyleSheet.create({
    mainContainer: {
      flex: 1,
      backgroundColor: theme.color.textWhite,
    },
    subContainer: {
      height: hp(10),
      backgroundColor: theme.color.textWhite,

      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      // paddingBottom: hp(7),
    },
    activityView: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    emptyView: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      height: hp(80),
    },
    headerInitialText: {
      paddingLeft: hp(1),
      width: wp(30),
      fontSize: hp(3),
      color: theme.color.textBlack,
      fontFamily: theme.fontFamily.boldFamily,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignContent: 'center',
    },
    headerLastText: {
      fontSize: theme.size.large,
      color: theme.color.backgroundColor,
      textAlign: 'center',
      fontFamily: theme.fontFamily.boldFamily,
    },
    headerContainerStyle: {
      borderBottomColor: theme.color.textWhite,
      backgroundColor: theme.color.textWhite,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    headerColor: theme.color.textWhite,
    addMemoryIcon: theme.color.backgroundColor,
    container: {
      flexGrow: 1,
      // justifyContent: 'center',
      // paddingBottom: hp(3),
      // marginTop: hp(4),
    },
    profileCardStyle: {
      borderRadius: hp(1),
      width: wp(42),
      height: hp(25),
    },
    homeText: {
      fontSize: theme.size.large,
    },
    newMemoryButton: {
      alignSelf: 'center',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      // padding: hp(2.75),
      width: wp(50),
      height: hp(7.5),
      borderRadius: hp(5),
      borderWidth: hp(0.1),
      borderColor: theme.color.headerBackgroundColor,
    },
    newMemoryButtonText: {
      fontSize: theme.size.medium,
      fontFamily: theme.fontFamily.boldFamily,
    },
    avatarImage: {marginRight: wp(5)},
    memoryContainer: {
      alignSelf: 'center',
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: wp(0.5),
      width: wp(75),
      height: hp(20),
      borderRadius: theme.borders.radius3,
      borderColor: theme.color.headerBackgroundColor,
      // padding: hp(2),
      // marginBottom: hp(12),
    },
    profileImage: {
      marginBottom: hp(3),
    },
    firstMemoryText: {
      fontSize: theme.size.medium,
      fontFamily: theme.fontFamily.boldFamily,
      padding: hp(2),
    },
    dialogStyle: {
      backgroundColor: 'white',
      height: hp(45),
      width: wp(60),
      alignSelf: 'center',
    },
    contentStyle: {
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'column',
      justifyContent: 'center',
    },
    profileButton: {
      margin: hp(1),
      alignSelf: 'center',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      width: wp(40),
      height: hp(6),
      borderRadius: hp(5),
      borderWidth: hp(0.1),
      borderColor: theme.color.headerBackgroundColor,
    },
    modalCloseIcon: {justifyContent: 'flex-end', alignSelf: 'flex-end'},
    modalContentContainer: {
      justifyContent: 'space-between',
      justifyContent: 'center',
      alignItems: 'center',
    },
    notificationContainer: {
      marginRight: hp(2),
    },
    iconContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: wp(1),
    },
    searchView: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      // marginLeft: hp(1),
      paddingVertical: hp(1),
    },
    flatlistContainer: {
      flexGrow: 1,
      marginHorizontal: wp(3.5),
      marginBottom: hp(3),
    },
    emptyMessageStyle: {
      fontSize: theme.size.medium,
      fontFamily: theme.fontFamily.semiBoldFamily,
      marginTop: hp(1),
    },
    footerStyle: {
      marginBottom: hp(35),
    },
  });
  return styles;
};
export default createStyles;
