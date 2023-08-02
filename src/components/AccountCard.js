import React, {useState} from 'react';
import {View, TouchableOpacity, Image} from 'react-native';
import {StyleSheet} from 'react-native';
import {useThemeAwareObject} from '../theme';
import {hp, wp} from '../util';
import Text from './CustomText';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {editViewProfileSvg as EditViewProfileSvg} from '../../assets/Icons/Svgs';
const AccountCard = props => {
  const createStyles = theme => {
    const themeStyles = StyleSheet.create({
      nameContainer: {
        justifyContent: 'center',
        paddingLeft: wp(3),
        width: wp(56),
        height: hp(8),
      },
      nameText: {
        fontSize: theme.size.small,
        fontFamily: theme.fontFamily.semiBoldFamily,
        color: theme.color.textBlack,
        textAlign: 'left',
      },
      categoryText: {
        fontSize: theme.size.xsmall,
        fontFamily: theme.fontFamily.mediumFamily,
        color: theme.color.textGray,
        textAlign: 'left',
      },

      listItem: {
        width: '90%',
        height: hp(8),
        alignSelf: 'center',
        justifyContent: 'space-between',
        backgroundColor: theme.color.textWhite,
        alignItems: 'center',
        flexDirection: 'row',
        borderRadius: hp(2.5),
        paddingLeft: hp(1.5),
        borderWidth: hp('0.1'),
        paddingRight: hp(2),
        borderColor: theme.color.dividerColor,
        marginBottom: hp(1.3),
      },
      viewProposals: {
        fontFamily: theme.fontFamily.mediumFamily,
        color: theme.color.dividerColor,
        paddingRight: hp(2),
        paddingBottom: hp(4),
      },
      editIcon: {
        justifyContent: 'center',
        alignItems: 'center',
        // marginLeft: wp(15),
        alignSelf: 'flex-end',
        top: hp(0.3),
      },
      iconContainer: {
        justifyContent: 'center',
        alignItems: 'center',
      },
    });
    return themeStyles;
  };
  const styles = useThemeAwareObject(createStyles);

  return (
    <TouchableOpacity
      style={[styles.listItem, props.listStyle]}
      onPress={props.onPressIcon}>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        {props.img}
        <View style={styles.nameContainer}>
          <Text style={styles.nameText}>{props.name}</Text>
          {props?.viewProfile && (
            <Text style={styles.categoryText}>{props.category}</Text>
          )}
        </View>
      </View>
      <View style={styles.iconContainer}>
        {props?.viewProfile ? (
          <>
            <TouchableOpacity
              style={styles.editIcon}
              onPress={props.onPressEdit}>
              <EditViewProfileSvg />
            </TouchableOpacity>
          </>
        ) : (
          <Ionicons
            name="chevron-forward-outline"
            size={hp(3)}
            color={'black'}
            onPress={props.onPressIcon}
          />
        )}
      </View>
    </TouchableOpacity>
  );
};

export default AccountCard;
