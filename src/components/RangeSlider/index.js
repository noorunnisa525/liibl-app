import Slider from '@react-native-community/slider';
import React from 'react';
import {StyleSheet} from 'react-native';
import {useThemeAwareObject} from '../../theme/index';
import {wp} from '../../util';

const SliderScreen = props => {
  const createStyles = theme => {
    const themeStyles = StyleSheet.create({
      mimimumColor: theme.color.textBlack,
      maximumColor: theme.color.dividerColor,
      thumbColor: theme.color.textBlack,
      sliderStyle: {
        width: wp(88),
      },
    });
    return themeStyles;
  };
  const styles = useThemeAwareObject(createStyles);

  return (
    <Slider
      minimumValue={props.minimum}
      maximumValue={props.maximum}
      style={[styles.sliderStyle, props.style]}
      minimumTrackTintColor={styles.mimimumColor}
      maximumTrackTintColor={styles.maximumColor}
      thumbTintColor={styles.thumbColor}
      value={props.value}
      onSlidingComplete={props.slideComplete}
    />
  );
};

export default SliderScreen;
