import React, {useState} from 'react';
import {View, TouchableOpacity, Image} from 'react-native';
import {StyleSheet} from 'react-native';
import {useThemeAwareObject} from '../theme';
import {hp, wp} from '../util';
import Text from './CustomText';
import FastImage from 'react-native-fast-image';
import {baseUrl} from '../constants';
const ChatCard = props => {
  const createStyles = theme => {
    const themeStyles = StyleSheet.create({
      nameContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
      },
      nameText: {
        width: wp(45),
        fontSize: theme.size.small,
        fontFamily: theme.fontFamily.boldFamily,
        color: theme.color.textBlack,
      },

      expText: {
        marginTop: hp(1),
        fontFamily: theme.fontFamily.mediumFamily,
        color: theme.color.textGray,
      },

      listItem: {
        marginHorizontal: wp(4),
        marginVertical: hp(1),
        alignItems: 'center',
        flexDirection: 'row',
        borderRadius: hp(2.5),
        padding: hp(1),
        borderWidth: hp('0.1'),
        borderColor: theme.color.dividerColor,
      },
      time: {
        fontFamily: theme.fontFamily.mediumFamily,
        color: theme.color.textGray,
      },
      rightContainer: {
        marginLeft: wp(2),
        width: wp(73),
      },
      imageStyle: {
        width: wp(13),
        height: wp(13),
        borderRadius: hp(5),
        backgroundColor: 'black',
      },
    });
    return themeStyles;
  };
  const styles = useThemeAwareObject(createStyles);

  return (
    <TouchableOpacity
      style={[styles.listItem, props.listStyle]}
      onPress={props.onPress}>
      <FastImage
        source={
          props.img
            ? {uri: baseUrl.base + '/' + props.img}
            : require('../components/ImagePicker/Icons/avatar-placeholder.png')
        }
        style={styles.imageStyle}
      />
      <View style={styles.rightContainer}>
        <View style={styles.nameContainer}>
          <Text numberOfLines={1} style={styles.nameText}>
            {props.name}
          </Text>
          <Text style={styles.time}>{props.time}</Text>
        </View>
        <Text numberOfLines={1} style={styles.expText}>
          {props.message}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default ChatCard;
