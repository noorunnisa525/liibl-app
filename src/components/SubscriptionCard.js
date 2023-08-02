import React, {useState} from 'react';
import {View, TouchableOpacity, Image} from 'react-native';
import {StyleSheet} from 'react-native';
import {useThemeAwareObject} from '../theme';
import {hp, wp} from '../util';
import Text from './CustomText';
import FastImage from 'react-native-fast-image';
import {tickSvg as TickSvg} from '../../assets/Icons/Svgs';
import CheckBox from '@react-native-community/checkbox';

const PeopleCard = props => {
  const createStyles = theme => {
    const themeStyles = StyleSheet.create({
      namecontainer: {
        marginBottom: hp('2'),
      },
      nameText: {
        fontSize: theme.size.small,
        fontFamily: theme.fontFamily.boldFamily,
        color: theme.color.textBlack,
        paddingLeft: hp(2),
      },
      title: {
        fontSize: theme.size.medium,
        fontFamily: theme.fontFamily.boldFamily,
        color: theme.color.textWhite,
      },

      listItem: {
        // flex: 1,
        margin: 10,
        width: wp(85),
        alignSelf: 'center',
        // flexDirection: 'row',
        borderRadius: hp(2),
        borderWidth: hp('0.1'),
        backgroundColor: theme.color.textBlack,
        // borderBottomWidth: hp('0.1'),
        borderColor: theme.color.dividerColor,
      },
      header: {
        justifyContent: 'space-between',
        flexDirection: 'row',
        padding: hp(2),
        borderBottomWidth: hp('0.04'),
        borderColor: theme.color.dividerColor,
        marginBottom: hp(0.5),
      },
      checkboxContainer: {
        flexDirection: 'row',
        marginBottom: hp(0.5),
        marginLeft: hp(1),
        marginTop: hp(1),
      },
      checkbox: {
        alignSelf: 'center',
        marginLeft: wp(2),
        marginRight: wp(1),
        width: hp(2.5),
        height: hp(2.5),
      },
      checkBoxText: {
        fontSize: theme.size.xsmall,
        fontFamily: theme.fontFamily.mediumFamily,
        color: theme.color.textWhite,
        marginLeft: hp(0.5),
        width: wp(70),
      },
    });
    return themeStyles;
  };
  const styles = useThemeAwareObject(createStyles);

  return (
    <TouchableOpacity
      style={[styles.listItem, props.subscriptionCard]}
      onPress={props.onPressCard}>
      <View style={styles.header}>
        <Text style={[styles.title, props.titleStyle]}>{props.name}</Text>
        {props.icon && <TickSvg />}
      </View>

      <View style={styles.namecontainer}>
        <Text style={styles.nameText}>BENEFITS</Text>
        <View style={styles.checkboxContainer}>
          <CheckBox
            value={props.isSelected}
            boxType="square"
            onValueChange={props.setSelection}
            style={styles.checkbox}
            tintColors={{true: 'green', false: 'green'}}
          />
          <Text style={[styles.checkBoxText, props.conditionText]}>
            {props.description}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default PeopleCard;
