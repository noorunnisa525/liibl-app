import React, {useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
} from 'react-native';
import {useThemeAwareObject} from '../theme';
import {hp, wp} from '../util';
import FastImage from 'react-native-fast-image';
import Text from './CustomText';
import Button from './CustomButton';
const CustomRatingStars = props => {
  const createStyles = theme => {
    const themeStyles = StyleSheet.create({
      container: {
        flexGrow: 1,
        // padding: 10,
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
      },
      textStyle: {
        textAlign: 'center',
        fontSize: hp(5),

        fontFamily: theme.fontFamily.boldFamily,
        color: '#FFB627',
      },
      starImageStyle: {
        width: 40,
        height: 40,
        resizeMode: 'cover',
      },
      customRatingBarStyle: {
        justifyContent: 'center',
        flexDirection: 'row',
      },
    });
    return themeStyles;
  };
  const styles = useThemeAwareObject(createStyles);

  const CustomRatingBar = () => {
    return (
      <View style={styles.customRatingBarStyle}>
        {props.maxRating.map((item, key) => {
          return (
            <TouchableOpacity
              activeOpacity={0.7}
              key={item}
              onPress={() => props.setDefaultRating(item)}>
              <Image
                style={[styles.starImageStyle, props.imgStyle]}
                source={
                  item <= props.defaultRating
                    ? props.starImageFilled
                    : props.starImageCorner
                }
              />
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.container, props.container]}>
      {/* View to hold our Stars */}
      <CustomRatingBar />
      <Text style={[styles.textStyle, props.textStyle]}>
        {/* To show the rating selected */}
        {props.defaultRating}
      </Text>
    </SafeAreaView>
  );
};

export default CustomRatingStars;
