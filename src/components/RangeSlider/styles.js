import {StyleSheet} from 'react-native';
import {hp, wp} from '../../util';

const createStyles = theme => {
  const styles = StyleSheet.create({
    root: {
      alignItems: 'stretch',
      // padding: 12,
      flex: 1,
      backgroundColor: 'white',
    },
    slider: {},
    button: {},
    header: {
      alignItems: 'center',
      backgroundColor: 'black',
      padding: 12,
    },
    horizontalContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: hp(2),
    },
    text: {
      color: 'white',
      fontSize: 20,
    },
    valueText: {
      color: 'lightgray',
      fontSize: hp(2),
      marginHorizontal: wp(2),
    },
  });
  return styles;
};
export default createStyles;
