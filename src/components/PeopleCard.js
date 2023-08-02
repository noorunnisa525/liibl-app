import React, {useState} from 'react';
import {View, TouchableOpacity, Image} from 'react-native';
import {StyleSheet} from 'react-native';
import {useThemeAwareObject} from '../theme';
import {hp, wp} from '../util';
import Text from './CustomText';
import Button from './CustomButton';
import FastImage from 'react-native-fast-image';
import {baseUrl} from '../constants';
const PeopleCard = props => {
  const createStyles = theme => {
    const themeStyles = StyleSheet.create({
      namecontainer: {
        justifyContent: 'flex-start',
        padding: hp('2'),
      },
      nameText: {
        fontSize: theme.size.small,
        fontFamily: theme.fontFamily.boldFamily,
        color: theme.color.textBlack,
      },

      descText: {
        fontFamily: theme.fontFamily.mediumFamily,
        color: theme.color.textGray,
        width: '95%',
        paddingLeft: hp(2.5),
        paddingBottom: hp(1.5),
      },

      listItem: {
        width: '95%',
        alignSelf: 'center',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
        paddingLeft: wp(2),
        paddingVertical: hp(1),
      },
      mainContainer: {
        borderRadius: hp(2.5),
        borderWidth: hp('0.1'),
        borderColor: theme.color.dividerColor,
        marginBottom: hp(2),
      },
      viewProposals: {
        textDecorationLine: 'underline',
        fontFamily: theme.fontFamily.boldFamily,
        color: theme.color.textBlack,
      },
      AwaitingResponse: {
        fontFamily: theme.fontFamily.semiBoldFamily,
        color: theme.color.textBlack,
      },
      viewButton: {
        width: wp(25.5),
        height: hp(4),
        alignSelf: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#E5E5E5',
        borderRadius: hp(2),
      },
    });
    return themeStyles;
  };
  const styles = useThemeAwareObject(createStyles);

  return (
    <View style={[styles.mainContainer, props.mainContainer]}>
      <View style={[styles.listItem, props.listStyle]}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          {props.img ? (
            <FastImage
              source={{uri: baseUrl.base + '/' + props.img}}
              style={{
                width: hp(7),
                height: hp(7),
                borderRadius: 30,
              }}
            />
          ) : (
            <FastImage
              source={require('../components/ImagePicker/Icons/avatar-placeholder.png')}
              style={{
                width: hp(7),
                height: hp(7),
                borderRadius: 30,
                backgroundColor: 'black',
              }}
            />
          )}
          <View style={styles.namecontainer}>
            <Text style={styles.nameText}>{props.name}</Text>
            <Text>{props.category}</Text>
          </View>
        </View>

        {props.viewProposals && (
          <Button
            onPress={props.onPressProposal}
            style={[
              props.JobInvite ? null : styles.viewButton,
              props.JobInvite ? styles.AwaitingResponse : styles.viewProposals,
            ]}
            title1={props.JobInvite ? 'Awaiting Response' : 'View Proposal'}
          />
        )}
        {/* {props.viewProposals && (
          <TouchableOpacity
            disabled={props.JobInvite ? true : false}
            >
            {props.JobInvite ? (
              <Text style={styles.AwaitingResponse}>Awaiting Response</Text>
            ) : (
              <Text style={styles.viewProposals}>View Proposal</Text>
            )}
          </TouchableOpacity>
        )} */}
      </View>
      {props.description && (
        <Text numberOfLines={2} style={styles.descText}>
          {props.description}
        </Text>
      )}
    </View>
  );
};

export default PeopleCard;
