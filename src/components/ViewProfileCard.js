import React, {useState} from 'react';
import {View, TouchableOpacity, Image} from 'react-native';
import {StyleSheet} from 'react-native';
import {useThemeAwareObject} from '../theme';
import {hp, wp} from '../util';
import Text from './CustomText';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {editViewProfileSvg as EditViewProfileSvg} from '../../assets/Icons/Svgs';
const ViewProfileCard = props => {
  const createStyles = theme => {
    const themeStyles = StyleSheet.create({
      nameContainer: {
        justifyContent: 'space-between',
        height: hp(5),
        // alignItems: 'center',
        // padding: hp(1),
        marginLeft: wp(2),
      },
      nameText: {
        fontSize: theme.size.small,
        fontFamily: theme.fontFamily.semiBoldFamily,
        color: theme.color.textGray,
        textAlign: 'left',
        width: wp(75),
      },
      categoryText: {
        fontSize: theme.size.xsmall,
        fontFamily: theme.fontFamily.mediumFamily,
        color: theme.color.textBlack,
        textAlign: 'left',
      },

      listItem: {
        width: wp(88),
        backgroundColor: theme.color.textWhite,
        height: hp(8),
        borderRadius: hp(2.5),
        marginLeft: wp(5),
        marginVertical: hp(1),
      },
      editIcon: {
        height: hp(8),
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: hp(12),
      },
      iconContainer: {justifyContent: 'center', alignItems: 'center'},
    });
    return themeStyles;
  };
  const styles = useThemeAwareObject(createStyles);

  return (
    <View style={[styles.listItem, props.listStyle]}>
      <View style={{flexDirection: 'row'}}>
        {props.img}
        <View style={styles.nameContainer}>
          <Text style={styles.categoryText}>{props.name}</Text>

          <Text style={styles.nameText}>{props.category}</Text>
        </View>
      </View>
    </View>
  );
};

export default ViewProfileCard;
