import React, {memo} from 'react';
import {StyleSheet, View} from 'react-native';
import {hp} from '../../util';

const RailSelected = () => {
  return <View style={styles.root} />;
};

export default memo(RailSelected);

const styles = StyleSheet.create({
  root: {
    height: 10,
    backgroundColor: 'black',
    borderRadius: 2,
  },
});
