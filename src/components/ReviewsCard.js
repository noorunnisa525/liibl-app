import React, {useState} from 'react';
import {View, TouchableOpacity, Image} from 'react-native';
import {StyleSheet} from 'react-native';
import {useThemeAwareObject} from '../theme';
import {hp, wp} from '../util';
import Text from './CustomText';
import FastImage from 'react-native-fast-image';
import {
  calenderSvg as CalenderSvg,
  clockSvg as ClockSvg,
  workSvg as WorkSvg,
  profileSvg as ProfileSvg,
  scanSvg as ScanSvg,
} from '../../assets/Icons/Svgs';
import CheckBox from '@react-native-community/checkbox';

const ReviewsCard = props => {
  const createStyles = theme => {
    const themeStyles = StyleSheet.create({
      title: {
        fontSize: theme.size.small,
        fontFamily: theme.fontFamily.boldFamily,
        color: theme.color.textBlack,
        flexDirection: 'row',
      },
      bottomTitle: {
        fontSize: theme.size.small,
        fontFamily: theme.fontFamily.boldFamily,
        color: theme.color.textBlack,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingRight: hp(2),
        marginVertical: hp(1),
      },
      titleName: {
        width: wp(38),
        fontSize: theme.size.small,
        fontFamily: theme.fontFamily.boldFamily,
        color: theme.color.textGray,
      },
      jobDescriptionText: {
        fontSize: theme.size.xsmall,
        fontFamily: theme.fontFamily.semiBoldFamily,
        color: theme.color.textBlack,
        paddingLeft: wp(3),
      },
      description: {
        fontSize: theme.size.xsmall,
        fontFamily: theme.fontFamily.semiBoldFamily,
        color: theme.color.textGray,
        paddingHorizontal: wp(3),
      },
      priceText: {
        fontSize: theme.size.xsmall,
        fontFamily: theme.fontFamily.semiBoldFamily,
        color: theme.color.textBlack,
        marginTop: -hp(3),
      },

      listItem: {
        flexGrow: 1,
        margin: 10,
        width: '95%',
        alignSelf: 'center',
        borderRadius: hp(2),
        borderWidth: hp('0.1'),
        paddingBottom: hp(0.5),
        backgroundColor: theme.color.textWhite,
        // borderBottomWidth: hp('0.1'),
        borderColor: theme.color.dividerColor,
      },
      header: {
        justifyContent: 'space-between',
        flexDirection: 'row',
        padding: hp(1.5),
        borderBottomWidth: hp('0.04'),
        borderColor: theme.color.dividerColor,
        marginBottom: hp(0.5),
      },
      checkboxContainer: {
        flexDirection: 'column',
        marginBottom: hp(0.5),
        marginLeft: hp(3),
      },
      checkbox: {
        alignSelf: 'center',
      },
      checkBoxText: {
        fontSize: theme.size.xsmall,
        fontFamily: theme.fontFamily.mediumFamily,
        color: theme.color.textBlack,
        paddingLeft: hp(2),
        marginTop: hp(0.5),
      },
      imgStyle: {
        backgroundColor: theme.color.dividerColor,
        width: wp(11),
        height: hp(7),
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: hp(1.5),
        flexDirection: 'row',
      },
      imageStyle: {
        width: wp(9),
        height: wp(9),
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: hp(5),
        flexDirection: 'row',
        marginRight: hp(1),
      },
      profileContainer: {
        width: wp(10),
        height: hp(3),
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: hp(1),
        marginBottom: hp(5),
      },
      profileText: {
        color: 'white',
        paddingLeft: hp(1),
      },
    });
    return themeStyles;
  };
  const styles = useThemeAwareObject(createStyles);

  return (
    <View style={[styles.listItem, props.subscriptionCard]}>
      <View style={styles.header}>{props.stars}</View>
      <Text style={styles.description}>{props.description}</Text>

      <View style={styles.bottomTitle}>
        <Text style={styles.jobDescriptionText}>Review by: </Text>

        <View
          style={{
            flexGrow: 1,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'flex-end',
          }}>
          <Image
            // resizeMode="contain"
            style={styles.imageStyle}
            source={props.profileImage}
          />

          <Text
            numberOfLines={2}
            style={[styles.titleName, props.conditionText]}>
            {props.title}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default ReviewsCard;
