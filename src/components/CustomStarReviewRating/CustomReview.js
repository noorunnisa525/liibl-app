import React from 'react';
import {Image, StyleSheet, View} from 'react-native';
import {baseUrl} from '../../../assets/images/Avatar.png';
import {useThemeAwareObject} from '../../theme';
import {hp, wp} from '../../util';
import StarRating from './CustomStarRating';
// import Divider from './CustomDivider';
import Text from '../CustomText';

function CustomReview(props) {
  const createStyles = theme => {
    const themeStyles = StyleSheet.create({
      mainContainer: {
        backgroundColor: theme.color.textWhite,
        padding: wp(3),
        marginVertical: wp(2),
        marginHorizontal: wp(1),
        borderRadius: theme.borders.radius2,
        elevation: 3,
        shadowColor: theme.color.avatarColor,
        shadowOffset: {width: 0, height: 1},
        shadowOpacity: 1,
        shadowRadius: 1,
      },
      rowView: {
        flexDirection: 'row',
        alignItems: 'center',
      },
      imageStyle: {
        height: hp(10),
        width: wp(30),
        borderRadius: theme.borders.radius2,
        overflow: 'hidden',
        marginRight: wp(2),
        marginBottom: hp(1),
      },
      ratingNumber: {
        marginLeft: wp(1),
        color: theme.color.rating,
      },
      nameView: {
        justifyContent: 'center',
        marginLeft: wp(2),
        marginRight: wp(2),
      },
      nameText: {
        width: wp(42),
        fontSize: theme.size.medium,
        fontFamily: theme.fontFamily.semiBoldFamily,
      },
      addressText: {
        color: theme.color.textGray,
      },
      reviewHeader: {
        fontSize: theme.size.medium,
        fontFamily: theme.fontFamily.semiBoldFamily,
      },
      descriptionText: {
        marginTop: hp(1),
        color: theme.color.textGray,
      },
      dividerStyle: {
        marginVertical: hp(1),
        height: wp(0.3),
        borderBottomColor: 'transparent',
        borderRadius: theme.borders.radius2,
        backgroundColor: theme.color.avatarColor,
      },
    });
    return themeStyles;
  };
  const styles = useThemeAwareObject(createStyles);
  return (
    <View style={styles.mainContainer}>
      {props.nameContainer && (
        <View style={styles.rowView}>
          {props.image && (
            <Image
              source={{uri: baseUrl.imageUrl + props.image}}
              style={styles.imageStyle}
            />
          )}
          {props.name && (
            <Text numberOfLines={1} style={styles.nameText}>
              {props.name}
            </Text>
          )}
        </View>
      )}
      <Text style={styles.reviewHeader}>Your Review</Text>
      <View style={styles.rowView}>
        <StarRating
          // disabled={props.disable}
          rating={props.rating}
          maxStars={5}
        />
        <Text style={styles.ratingNumber}>{props.rating}</Text>
      </View>
      <Text style={styles.descriptionText}>{props.description}</Text>
    </View>
  );
}

export default CustomReview;
