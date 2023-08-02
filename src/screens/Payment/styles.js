import {StyleSheet} from 'react-native';
import {hp, wp} from '../../util';

const createStyles = theme => {
  const styles = StyleSheet.create({
    mainContainer: {
      flex: 1,
      backgroundColor: theme.color.textWhite,
    },
    subContainer: {
      height: hp(12),
      backgroundColor: theme.color.headerBackgroundColor,
      borderBottomLeftRadius: hp(5),
      borderBottomRightRadius: hp(5),
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingLeft: hp(2),
      alignItems: 'center',
      paddingBottom: hp(2),
    },
    headerInitialText: {
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
      fontSize: theme.size.xLarge,
      color: theme.color.backgroundColor,
      textAlign: 'center',
    },
    headerContainerStyle: {
      borderBottomColor: theme.color.headerBackgroundColor,
    },
    headerColor: theme.color.headerBackgroundColor,
    addMemoryIcon: theme.color.backgroundColor,
    container: {
      flexGrow: 1,
      paddingHorizontal: hp(5),
      paddingTop: hp(3),
      paddingBottom: hp(3),
      justifyContent: 'space-between',
      alignItems: 'center',
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
      height: hp(6.5),
      borderRadius: hp(5),
      borderWidth: hp(0.1),
      borderColor: theme.color.headerBackgroundColor,
    },
    newMemoryButtonText: {
      fontSize: theme.size.medium,
      fontFamily: theme.fontFamily.boldFamily,
    },
    becomeMemberButton: {
      alignSelf: 'center',
      flexDirection: 'column',
      justifyContent: 'center',
      width: wp(40),
      height: hp(7),
      alignItems: 'center',
      borderRadius: hp(5),
      borderWidth: hp(0.1),
      borderColor: theme.color.backgroundColor,
      backgroundColor: theme.color.backgroundColor,
    },
    becomeMmeberText: {
      fontSize: theme.size.medium,
      fontFamily: theme.fontFamily.boldFamily,
      color: theme.color.textWhite,
    },
    textFieldTile: {
      fontSize: theme.size.medium,
      textAlign: 'center',
      fontFamily: theme.fontFamily.boldFamily,
    },
    fieldText: {
      fontSize: theme.size.medium,
      textAlign: 'center',
      paddingLeft: hp(2),
      fontFamily: theme.fontFamily.boldFamily,
      // fontColor: theme.color.lightgray,
    },
    avatarImage: {marginRight: wp(5)},
    memoryContainer: {
      alignSelf: 'center',
      justifyContent: 'space-between',
      padding: hp(2),
      alignItems: 'center',
      paddingLeft: hp(4),
      paddingRight: hp(4),
      width: wp(105),
      height: hp(40),
      // marginBottom: hp(12),
    },
    profileImage: {
      marginRight: wp(5),
      marginBottom: hp(3),
    },
    firstMemoryText: {
      fontSize: theme.size.medium,
      paddingBottom: hp(2),
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
    iconHeaderContainer: {width: '10%', paddingLeft: hp(1)},
    headerTitleContainer: {
      flexDirection: 'row',
      width: '75%',
      alignSelf: 'center',
      justifyContent: 'center',
      alignContent: 'center',
    },
  });
  return styles;
};
export default createStyles;
