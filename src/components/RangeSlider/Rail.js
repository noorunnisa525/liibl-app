import React, {memo} from 'react';
import {View, StyleSheet} from 'react-native';
import {hp} from '../../util';

const Rail = () => {
  return <View style={styles.root} />;
};

export default memo(Rail);

const styles = StyleSheet.create({
  root: {
    flex: 1,
    height: 10,
    borderRadius: 2,
    backgroundColor: 'lightgray',
  },
});
