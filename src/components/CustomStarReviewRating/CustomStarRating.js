import React from 'react';
import {StyleSheet, View, Text} from 'react-native';
import StarRating from 'react-native-star-rating';
import {useThemeAwareObject} from '../../theme';
import {hp, wp} from '../../util';

function CustomStarRating(props) {
  const createStyles = theme => {
    const themeStyles = StyleSheet.create({
      mainContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: hp(1),
      },
      starColor: theme.color.rating,
      emptyStarColor: theme.color.rating,
      starStyle: {
        marginRight: wp(1.5),
      },
      textStyle: {
        textAlign: 'center',
        fontSize: hp(3),

        fontFamily: theme.fontFamily.boldFamily,
        color: '#FFB627',
      },
      container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: hp(40),
      },
    });
    return themeStyles;
  };
  const styles = useThemeAwareObject(createStyles);
  return (
    <View style={styles.mainContainer}>
      <StarRating
        disabled={props.disabled}
        maxStars={props.maxStars}
        rating={props.rating}
        emptyStarColor={styles.emptyStarColor}
        fullStarColor={styles.starColor}
        halfStar={require('../../../assets/images/halfStar.png')}
        fullStar={require('../../../assets/images/star.png')}
        emptyStar={require('../../../assets/images/emptyStar.png')}
        halfStarColor={styles.starColor}
        halfStarEnabled={props.halfDisable ? false : true}
        starStyle={[styles.starStyle, props.starStyle]}
        activeOpacity={0.8}
        animation={'jello'}
        starSize={props.starSize || hp(4)}
        selectedStar={props.onChangeValue}
      />
      <Text style={[styles.textStyle, props.textStyle]}>{props.rating}</Text>
    </View>
  );
}

export default CustomStarRating;
