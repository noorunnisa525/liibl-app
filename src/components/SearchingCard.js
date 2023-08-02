import React, {useState} from 'react';
import {View, TouchableOpacity} from 'react-native';
import {StyleSheet} from 'react-native';
import {useThemeAwareObject} from '../theme';
import {hp, wp} from '../util';
import FastImage from 'react-native-fast-image';
import Text from './CustomText';
const SearchingCard = props => {
  const createStyles = theme => {
    const themeStyles = StyleSheet.create({
      avatarImage: {
        marginRight: wp(5),
      },

      options: {
        backgroundColor: theme.color.textWhite,
        flexDirection: 'row',
      },
      option: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      },
      avatar: {
        height: hp(13),
        width: hp(18),
        borderRadius: hp(2),
        backgroundColor: theme.color.textBlack,
        // padding: 20,
      },
      TextContainer: {
        justifyContent: 'space-between',
        margin: hp(0.75),
        padding: hp(0.75),
        backgroundColor: 'trasnparent',
        position: 'absolute', //Here is the trick
        bottom: 0, //Here is the trick
        // top: 0,
      },
      taskCard: {
        borderRadius: theme.borders.radius4,
        flexDirection: 'column',
        margin: hp(1),
        flex: 1,
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
      yearText: {
        fontSize: theme.size.medium,
        fontFamily: theme.fontFamily.boldFamily,
        color: theme.color.textBlack,
        // color: 'red',
      },
      monthText: {
        fontSize: theme.size.small,
        color: theme.color.textBlack,
        marginBottom: hp(2),
        // color: 'red',
      },
      overlay: {
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        borderRadius: hp(2),
        backgroundColor: 'lightgray',
        opacity: 0.3,
      },
    });
    return themeStyles;
  };
  const styles = useThemeAwareObject(createStyles);

  return (
    <TouchableOpacity style={styles.taskCard} onPress={props.onPress}>
      <View style={{flexDirection: 'column'}}>
        <Text style={[styles.yearText, props.imgText]}>{props.year}</Text>
        <Text style={[styles.monthText, props.imgText]}>{props.month}</Text>

        <FastImage
          resizeMode="cover"
          style={[styles.avatar, props.imgStyle]}
          imageStyle={{borderRadius: 10}}
          {...props}
          source={{uri: props.img, priority: FastImage.priority.high}}>
          <View style={styles.TextContainer}>
            <Text style={[styles.memoryText, props.imgText]}>
              {props.cardText}
            </Text>
          </View>
          <View style={styles.overlay} />
        </FastImage>
      </View>
    </TouchableOpacity>
  );
};

export default SearchingCard;
