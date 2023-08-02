import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Image as ImageSvg, Svg} from 'react-native-svg';
import {baseUrl} from '../constants';
import {useThemeAwareObject} from '../theme';
import {hp, wp} from '../util';
import Button from './CustomButton';
import Text from './CustomText';
const ProfileCard = props => {
  const createStyles = theme => {
    const themeStyles = StyleSheet.create({
      imageStyle: {
        height: wp(15),
        width: wp(15),
        borderRadius: hp(5),
      },
      taskCard: {
        borderRadius: hp(1),
        width: wp(36),
        height: hp(25),
        margin: hp(1),
        padding: hp(2),
        justifyContent: 'space-between',
        alignItems: 'center',
        borderWidth: hp(0.1),
      },
      container: {
        justifyContent: 'center',
        alignItems: 'center',
        // backgroundColor: theme.colors.accent,
        marginBottom: 2,
      },
      memoryText: {
        // fontSize: theme.size.small,
        fontFamily: theme.fontFamily.boldFamily,
        color: theme.color.textWhite,
        // color: 'red',
      },
      nameText: {
        fontSize: theme.size.medium,
        fontFamily: theme.fontFamily.boldFamily,
        color: theme.color.textBlack,
        textAlign: 'center',
        // color: 'red',
      },
      categoryText: {
        fontSize: theme.size.small,
        color: theme.color.textBlack,
        // marginBottom: hp(2),
        textAlign: 'center',

        // color: 'red',
      },
      socialButtonFacebook: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: wp(30),
        height: hp(4),
        borderRadius: wp(1.4),
        borderWidth: hp(0.1),
        backgroundColor: theme.color.dividerColor,
        borderColor: theme.color.dividerColor,
      },
      socialTextFacebook: {
        fontSize: theme.size.xsmall,
        fontFamily: theme.fontFamily.boldFamily,
        color: theme.color.textBlack,
      },
    });
    return themeStyles;
  };
  const styles = useThemeAwareObject(createStyles);

  return (
    <View style={[styles.taskCard, props.taskCardStyle]}>
      <Svg width={hp(7)} height={hp(7)} borderRadius={hp(5)}>
        <ImageSvg
          width={'100%'}
          height={'100%'}
          preserveAspectRatio="xMidYMid slice"
          href={
            props.img
              ? {uri: baseUrl.base + '/' + props.img}
              : require('../components/ImagePicker/Icons/avatar-placeholder.png')
          }
        />
      </Svg>
      {/* <Image
        source={
          props.img
            ? {uri: baseUrl.base + '/' + props.img}
            : require('../components/ImagePicker/Icons/avatar-placeholder.png')
        }
        style={[styles.imageStyle, props.imgStyle]}
        resizeMode="contain"
      /> */}
      <View>
        <Text style={[styles.nameText, props.name]}>{props.name}</Text>
        <Text style={[styles.categoryText, props.category]}>
          {props.category}
        </Text>
      </View>
      <Button
        style={[styles.socialButtonFacebook, styles.socialTextFacebook]}
        title1="View Details "
        onPress={props.onPressButton}
      />
    </View>
  );
};

export default ProfileCard;
