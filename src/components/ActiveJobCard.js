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
import {baseUrl} from '../constants';

const ActiveJobCard = props => {
  const createStyles = theme => {
    const themeStyles = StyleSheet.create({
      namecontainer: {
        paddingLeft: hp(2),
        paddingRight: hp(2),
        marginBottom: hp('2'),
        justifyContent: 'space-between',
        flexDirection: 'row',
      },
      titleContainer: {
        marginLeft: hp('1'),
        width: wp(30),
      },

      skillsText: {
        fontFamily: theme.fontFamily.mediumFamily,
        color: theme.color.textGray,
      },
      nameText: {
        fontSize: theme.size.xsmall,
        fontFamily: theme.fontFamily.mediumFamily,
        color: theme.color.textGray,
        paddingLeft: hp(0.5),
      },
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
        marginBottom: hp(2),
      },
      titleName: {
        fontSize: theme.size.small,
        fontFamily: theme.fontFamily.boldFamily,
        color: theme.color.textBlack,
        // textAlignVertical: 'center',
      },
      jobDescriptionText: {
        fontSize: theme.size.xsmall,
        fontFamily: theme.fontFamily.semiBoldFamily,
        color: theme.color.textGray,
        paddingLeft: hp(2.3),
      },
      priceText: {
        fontSize: theme.size.xsmall,
        fontFamily: theme.fontFamily.semiBoldFamily,
        color: theme.color.textBlack,
        marginTop: -hp(3),
      },

      listItem: {
        flex: 1,
        margin: 10,
        marginBottom: hp(0.1),
        width: wp(92),
        alignSelf: 'center',
        // flexDirection: 'row',
        borderRadius: hp(2),
        borderWidth: hp('0.1'),
        backgroundColor: theme.color.textWhite,
        // borderBottomWidth: hp('0.1'),
        borderColor: theme.color.dividerColor,
        // paddingHorizontal: wp(4),
      },
      header: {
        justifyContent: 'space-between',
        flexDirection: 'row',
        padding: hp(2),
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
        width: wp(13),
        height: wp(13),
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: hp(1.5),
        flexDirection: 'row',
        // marginLeft: wp(3),
      },
      imageStyle: {
        width: wp(9),
        height: wp(9),
        borderRadius: hp(5),
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
    <TouchableOpacity onPress={props.onPressHeader}>
      <View style={[styles.listItem, props.subscriptionCard]}>
        <View style={styles.header}>
          <View style={{flexDirection: 'row'}}>
            <View style={styles.imgStyle}>
              <WorkSvg />
            </View>
            <View style={styles.titleContainer}>
              <Text style={[styles.title, props.titleStyle]}>
                {props.title}
              </Text>
              <Text>{props.category}</Text>
              <Text style={styles.skillsText}>{props.skills}</Text>
            </View>
          </View>

          <View style={{flexDirection: 'column'}}>
            <View style={styles.profileContainer}>
              <TouchableOpacity onPress={props.onPressScan}>
                <ScanSvg />
              </TouchableOpacity>
            </View>
            <Text style={styles.priceText}>$ {props.price}</Text>
          </View>
        </View>

        <View style={styles.namecontainer}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <CalenderSvg />
            <Text style={styles.nameText}>{props.date}</Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <ClockSvg />
            <Text style={styles.nameText}>{props.time}</Text>
          </View>
        </View>
        <View style={styles.bottomTitle}>
          <Text style={styles.jobDescriptionText}>Employed to</Text>

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-end',
              alignItems: 'center',
            }}>
            <FastImage
              style={styles.imageStyle}
              resizeMode={'cover'}
              source={
                props.profileImage
                  ? {uri: baseUrl.base + '/' + props.profileImage}
                  : require('../components/ImagePicker/Icons/avatar-placeholder.png')
              }
            />

            <Text style={[styles.titleName, props.conditionText]}>
              {props.name}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default ActiveJobCard;
