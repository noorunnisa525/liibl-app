import React, {useState} from 'react';
import {View, TouchableOpacity, Image, ImageBackground} from 'react-native';
import {StyleSheet} from 'react-native';
import {useThemeAwareObject} from '../theme';
import {hp, wp} from '../util';
import Text from './CustomText';
import FastImage from 'react-native-fast-image';
import {
  editManageCardSvg as EditManageCardSvg,
  deleteManageCardSvg as DeleteManageCardSvg,
  masterCardSvg as MasterCardSvg,
  visaCardSvg as VisaCardSvg,
} from '../../assets/Icons/Svgs';
import CheckBox from '@react-native-community/checkbox';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import DialogModal from './DialogModal';
import Button from './CustomButton';
import {default_card, delete_cards} from '../services/api-confog';
import {useParamApiMutation, usePostApiMutation} from '../services/service';
import Snackbar from 'react-native-snackbar';
import {useSelector} from 'react-redux';

const ManageCards = props => {
  const createStyles = theme => {
    const themeStyles = StyleSheet.create({
      nameContainer: {
        marginBottom: hp('2'),
        width: wp(76),
      },
      nameText: {
        fontSize: theme.size.medium,
        fontFamily: theme.fontFamily.boldFamily,
        color: theme.color.textBlack,
        marginBottom: hp('0.5'),
      },
      cardNumber: {
        fontSize: theme.size.medium,
        fontFamily: theme.fontFamily.mediumFamily,
        color: theme.color.textBlack,
        marginBottom: hp('1.5'),
      },
      expiryText: {
        fontSize: theme.size.xsmall,
        fontFamily: theme.fontFamily.mediumFamily,
        color: theme.color.textGray,
      },
      expiryDate: {
        fontSize: theme.size.xSmall,
        fontFamily: theme.fontFamily.mediumFamily,
        paddingLeft: hp(0.5),
      },
      defaultStyle: {
        fontSize: theme.size.xSmall,
        fontFamily: theme.fontFamily.mediumFamily,
        marginLeft: wp(1),
        color: theme.color.dividerColor,
      },
      listItem: {
        // marginLeft: wp(-7),
      },
      image: {
        width: wp(92),
        height: hp(19),
        borderRadius: hp(2),
        paddingTop: hp(2),
        paddingLeft: hp(2),
        marginTop: hp(2),
      },
      svg: {
        paddingTop: hp(2.5),
      },
      editContainer: {
        flexDirection: 'row',
        borderBottomWidth: hp(0.1),
        borderColor: theme.color.avatarColor,
        paddingVertical: hp(1),
      },
      deleteContainer: {
        flexDirection: 'row',
        paddingVertical: hp(1),
      },
      modalStyle: {
        width: hp(17),
        height: hp(10.6),
        position: 'absolute',
        top: hp(0.5),
        right: wp(6),
        bottom: 0,
        borderRadius: hp(1.5),
        backgroundColor: theme.color.textWhite,
        justifyContent: 'center',
        padding: hp(1),
      },
      thumbStyle: {
        height: hp(11),
        width: hp(11),
        borderRadius: hp(16),
        // borderWidth: hp(0.75),
        alignSelf: 'center',
        // borderColor: '#3DB249',
        // backgroundColor: '#3DB249',
        // padding: 20,
      },
      cancelModalButton: {
        width: wp(35),
        height: hp(6.5),
        borderRadius: hp(1),
        justifyContent: 'center',
        alignSelf: 'center',
        alignItems: 'center',
        borderWidth: hp(0.01),
        borderColor: '#3DB249',
        backgroundColor: theme.color.dividerColor,
      },
      modalText: {
        color: theme.color.textWhite,
        fontSize: theme.size.small,
        fontFamily: theme.fontFamily.semiBoldFamily,
      },
      acceptModalButton: {
        width: wp(35),
        height: hp(6.5),
        borderRadius: hp(1),
        justifyContent: 'center',
        alignSelf: 'center',
        alignItems: 'center',
        borderWidth: hp(0.01),
        borderColor: '#3DB249',
        backgroundColor: 'red',
      },
      responseText: {
        marginTop: hp(3),
        marginBottom: hp(3),
        color: theme.color.textGray,
        fontSize: hp(2),
        fontFamily: theme.fontFamily.mediumFamily,
        textAlign: 'center',
        alignSelf: 'center',
      },
    });
    return themeStyles;
  };
  const styles = useThemeAwareObject(createStyles);
  const token = useSelector(state => state.user.token);
  const [deleteCall, deleteResponse] = usePostApiMutation();
  const [defaultCall, defaultResponse] = usePostApiMutation();

  const [openModal, toggleModal] = useState(false);
  const [deleteModal, toggleDeleteModal] = useState(false);

  return (
    <TouchableOpacity activeOpacity={1} onPress={() => toggleModal(false)}>
      <ImageBackground
        source={require('../../assets/images/Card.png')}
        resizeMode="repeat"
        style={styles.image}
        // add this line
        imageStyle={{borderRadius: hp(2)}}>
        <View style={{flexDirection: 'row'}}>
          <View style={styles.nameContainer}>
            <Text style={styles.nameText}>{props.name}</Text>
            <Text style={styles.cardNumber}>
              xxxx xxxx xxxx {props.cardNumber}
            </Text>
          </View>
          {!props.default && (
            <TouchableOpacity
              onPress={() => toggleModal(!openModal)}
              activeOpacity={1}
              style={styles.listItem}>
              <MaterialCommunityIcons
                name="dots-vertical"
                size={hp(4)}
                color={'black'}
                onPress={() => toggleModal(!openModal)}
              />
              {openModal && (
                <View style={styles.modalStyle}>
                  <Button
                    style={[
                      styles.editContainer,
                      null,
                      props.default ? styles.defaultStyle : styles.expiryDate,
                    ]}
                    loaderBlack
                    title1={<EditManageCardSvg />}
                    title2={'Make Primary'}
                    loading={defaultResponse.isLoading}
                    onPress={async () => {
                      if (!props.default) {
                        let data = {
                          card_id: props.id,
                        };
                        let apiData = {
                          url: default_card,
                          method: 'POST',
                          token: token,
                          data: data,
                        };
                        try {
                          let res = await defaultCall(apiData).unwrap();
                          if (res.status == 200) {
                            props.getCard();
                            toggleModal(!openModal);
                          } else {
                            Snackbar.show({
                              text: res?.Message,
                              duration: Snackbar.LENGTH_SHORT,
                            });
                          }
                        } catch (e) {}
                      }
                    }}
                  />
                  <Button
                    style={[
                      styles.deleteContainer,
                      null,
                      props.default ? styles.defaultStyle : styles.expiryDate,
                    ]}
                    title1={<DeleteManageCardSvg />}
                    title2={'Delete Card'}
                    loading={defaultResponse.isLoading}
                    onPress={() => {
                      if (!props.default) {
                        toggleDeleteModal(true);
                      }
                    }}
                  />
                  {/* <TouchableOpacity
                  disabled={props.default}
                  onPress={() => toggleDeleteModal(true)}
                  style={styles.deleteContainer}>
                  <DeleteManageCardSvg />
                  <Text
                    style={
                      props.default ? styles.defaultStyle : styles.expiryDate
                    }>
                    Delete Card
                  </Text>
                </TouchableOpacity> */}
                </View>
              )}
            </TouchableOpacity>
          )}
        </View>
        <View style={{flexDirection: 'row'}}>
          <View style={{width: wp(75)}}>
            <Text style={styles.expiryText}> Expiry</Text>
            <Text style={styles.expiryDate}>{props.expiry}</Text>
          </View>
          <View style={styles.svg}>
            {props.svg == 'Visa' ? <VisaCardSvg /> : <MasterCardSvg />}
          </View>
        </View>
      </ImageBackground>
      <DialogModal
        visible={deleteModal}
        dialogStyle={styles.dialogStyle}
        children={
          <>
            <FastImage
              resizeMode="contain"
              style={styles.thumbStyle}
              source={require('../../assets/images/tick-circle.png')}
            />
            <Text style={styles.responseText}>
              Are you sure you want to delete this card?
            </Text>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <Button
                style={[styles.cancelModalButton, styles.modalText]}
                title1="No"
                onPress={() => toggleDeleteModal(false)}
              />
              <Button
                style={[styles.acceptModalButton, styles.modalText]}
                loading={deleteResponse.isLoading}
                title1="Yes"
                onPress={async () => {
                  let data = {
                    card_id: props.id,
                  };
                  let apiData = {
                    url: delete_cards,
                    method: 'POST',
                    token: token,
                    data: data,
                  };
                  try {
                    let res = await deleteCall(apiData).unwrap();
                    if (res.status == 200) {
                      props.getCard();
                      toggleDeleteModal(false);
                      toggleModal(!openModal);
                    } else {
                      Snackbar.show({
                        text: res?.Message,
                        duration: Snackbar.LENGTH_SHORT,
                      });
                    }
                  } catch (e) {}
                }}
              />
            </View>
          </>
        }
      />
    </TouchableOpacity>
  );
};

export default ManageCards;
