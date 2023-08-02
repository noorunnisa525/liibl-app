import React, {useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {useThemeAwareObject} from '../theme';
import {wp, hp} from '../util';
import Text from './CustomText';
import {add_cards, add_subscription} from '../services/api-confog';
import {useDispatch, useSelector} from 'react-redux';
import CustomInputField from './CustomInputField';
import DialogModal from './DialogModal';
import CheckBox from '@react-native-community/checkbox';
import Button from './CustomButton';
import Snackbar from 'react-native-snackbar';
import {usePostApiMutation} from '../services/service';
import {onLogin, setToken} from '../redux/slices/userSlice';
import FastImage from 'react-native-fast-image';

const PaymentScreen = props => {
  const createStyles = theme => {
    const themeStyles = StyleSheet.create({
      backgroundColor: {
        backgroundColor: theme.color.headerBackgroundColor,
      },
      sideContainerStyle: {
        marginHorizontal: wp(2),
      },
      listItem: {
        marginTop: hp(3),
      },
      textFieldTitle: {
        fontSize: theme.size.medium,
        textAlign: 'left',
        paddingLeft: hp(1.5),
        marginTop: hp(1),
        fontFamily: theme.fontFamily.boldFamily,
      },
      loginInputText: {
        fontSize: theme.size.xsmall,
        fontFamily: theme.fontFamily.mediumFamily,
      },
      middleInput: {
        width: wp(1),
      },
      checkboxContainer: {
        flexDirection: 'row',

        marginLeft: hp(1),
        justifyContent: 'flex-start',
        alignItems: 'center',
      },
      checkbox: {
        alignSelf: 'center',
      },
      loggingText: {
        fontSize: theme.size.small,
        fontFamily: theme.fontFamily.semiBoldFamily,
        alignSelf: 'center',
      },
      subscriptionButton: {
        width: wp(85),
        height: hp(6.5),
        borderRadius: hp(1),
        alignSelf: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: hp(0.01),
        borderColor: theme.color.textWhite,
        backgroundColor: theme.color.textBlack,
        marginTop: hp(7),
      },
      subsText: {
        fontSize: theme.size.small,
        fontFamily: theme.fontFamily.semiBoldFamily,
        color: theme.color.textWhite,
      },
      errorText: {
        marginLeft: wp(3),
        marginTop: hp(0.5),
        color: theme.color.textRed,
      },
      thumbStyle: {
        height: hp(11),
        width: hp(11),
        borderRadius: hp(16),
        alignSelf: 'center',
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
        backgroundColor: '#3DB249',
      },
    });
    return themeStyles;
  };
  const styles = useThemeAwareObject(createStyles);
  const [name, setName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cVV, setCvv] = useState('');
  const dispatch = useDispatch();
  const [modal, setModal] = useState(false);
  const [isSelected, setSelection] = useState(false);
  const [backspaceFlag, setBackspaceFlag] = useState(false);
  const [expiryDate, setExpirationDate] = useState('');
  const [expiryMonth, setExpiryMonth] = useState('');
  const [nameError, setNameError] = useState(false);
  const [cardError, setCardError] = useState(false);
  const [dateError, setDateError] = useState(false);
  const [cvvError, setCvvError] = useState(false);
  const [subscriptionCall, subscriptionResponse] = usePostApiMutation();
  const [addCall, addResponse] = usePostApiMutation();
  const tempToken = useSelector(state => state.user.tempToken);
  const token = useSelector(state => state.user.token);
  const handleExpirationDate = text => {
    let textTemp = text;
    if (textTemp[0] !== '1' && textTemp[0] !== '0') {
      textTemp = '';
    }
    if (textTemp.length === 2) {
      if (
        parseInt(textTemp.substring(0, 2)) > 12 ||
        parseInt(textTemp.substring(0, 2)) == 0
      ) {
        textTemp = textTemp[0];
      } else if (text.length === 2 && !backspaceFlag) {
        setExpiryMonth(textTemp);
        textTemp += '/';
        setBackspaceFlag(true);
      } else if (text.length === 2 && backspaceFlag) {
        textTemp = textTemp[0];
        setBackspaceFlag(false);
      } else {
        textTemp = textTemp[0];
      }
    }
    setExpirationDate(textTemp);
  };

  const postSubscriptionApi = async values => {
    var expiryYear = expiryDate.substring(expiryDate.indexOf('/') + 1);

    let data = {
      subscription_id: props.selectedSubscription,
      name: name,
      card_number: cardNumber,
      CVC: cVV,
      exp_month: expiryMonth,
      exp_year: expiryYear,
    };
    let apiData = {
      url: add_subscription,
      data: data,
      method: 'POST',
      token: tempToken,
    };
    try {
      let res = await subscriptionCall(apiData).unwrap();
      if (res.status == 200) {
        setModal(true);
      } else {
        Snackbar.show({
          text: res?.Message || res?.message,
          duration: Snackbar.LENGTH_SHORT,
        });
      }
    } catch (e) {
      console.log('e', e);
    }
  };

  async function addCardApi() {
    var expiryYear = expiryDate.substring(expiryDate.indexOf('/') + 1);
    let data = {
      name: name,
      card_number: cardNumber,
      CVC: cVV,
      exp_month: expiryMonth,
      exp_year: expiryYear,
    };
    let apiData = {
      url: add_cards,
      data: data,
      method: 'POST',
      token: token,
    };
    try {
      let res = await addCall(apiData).unwrap();
      if (res.status == 200) {
        props.setSubmit(true);
      } else {
        Snackbar.show({
          text: res?.message || res?.Message,
          duration: Snackbar.LENGTH_SHORT,
        });
      }
    } catch (e) {}
  }

  return (
    <View style={[styles.listItem, props.listStyle]}>
      <Text style={styles.textFieldTitle}>Cardholder Name</Text>
      <CustomInputField
        name="fullName"
        inputStyle={styles.loginInputText}
        inputContainerStyle={{borderColor: 'lightgray'}}
        placeholder="Enter Cardholder Name"
        numberOfLines={1}
        value={name}
        onChangeText={value => setName(value)}
      />
      {nameError ? (
        <Text style={styles.errorText}>Name is required</Text>
      ) : (
        <Text style={styles.errorText}></Text>
      )}
      <Text style={styles.textFieldTitle}>Card Number</Text>
      <CustomInputField
        name="fullName"
        inputStyle={styles.loginInputText}
        inputContainerStyle={{borderColor: 'lightgray'}}
        placeholder="Enter Card Number"
        numberOfLines={1}
        maxLength={16}
        value={cardNumber}
        keyboardType={'numeric'}
        onChangeText={value => setCardNumber(value)}
      />
      {cardError ? (
        cardNumber == '' ? (
          <Text style={styles.errorText}>Card number is required</Text>
        ) : cardNumber.length < 16 ? (
          <Text style={styles.errorText}>
            Card number should be of 16 digits
          </Text>
        ) : (
          <Text style={styles.errorText}>
            Card number should be of 16 digits
          </Text>
        )
      ) : (
        <Text style={styles.errorText}></Text>
      )}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}>
        <View style={{flexDirection: 'column', width: wp(45)}}>
          <Text style={styles.textFieldTitle}>Expiry</Text>
          <CustomInputField
            name="fullName"
            inputStyle={styles.middleInput}
            inputContainerStyle={{borderColor: 'lightgray'}}
            placeholder="MM/YYYY"
            keyboardType={'phone-pad'}
            numberOfLines={1}
            maxLength={7}
            value={expiryDate}
            onChangeText={value => handleExpirationDate(value)}
          />
          {dateError ? (
            expiryDate == '' ? (
              <Text style={styles.errorText}>Expiry Date is required</Text>
            ) : expiryDate.length < 7 ? (
              <Text style={styles.errorText}>
                Date should be of MM/YYYY format
              </Text>
            ) : (
              <Text style={styles.errorText}>
                Date should be of MM/YYYY format
              </Text>
            )
          ) : (
            <Text style={styles.errorText}></Text>
          )}
        </View>

        <View style={{flexDirection: 'column', width: wp(45)}}>
          <Text style={styles.textFieldTitle}>CVC Code</Text>
          <CustomInputField
            name="fullName"
            inputStyle={styles.middleInput}
            inputContainerStyle={{borderColor: 'lightgray'}}
            placeholder="569"
            keyboardType={'numeric'}
            numberOfLines={1}
            maxLength={3}
            value={cVV}
            onChangeText={value => setCvv(value)}
          />
          {cvvError ? (
            cVV == '' ? (
              <Text style={styles.errorText}>CVC is required</Text>
            ) : cVV.length < 3 ? (
              <Text style={styles.errorText}>CVC should be of 3 digits</Text>
            ) : (
              <Text style={styles.errorText}>CVC should be of 3 digits</Text>
            )
          ) : (
            <Text style={styles.errorText}></Text>
          )}
        </View>
      </View>
      <Button
        style={[styles.subscriptionButton, styles.subsText]}
        loading={subscriptionResponse.isLoading || addResponse.isLoading}
        title1={props.addNewCard ? 'Save Card' : 'Pay Secure'}
        onPress={() => {
          if (
            name.length != 0 &&
            cardNumber.length == 16 &&
            // cVV.length == 3 &&
            expiryDate.length == 7
          ) {
            setNameError(false);
            setCardError(false);
            setDateError(false);
            setCvvError(false);
            if (props.addNewCard) {
              addCardApi();
            } else {
              postSubscriptionApi();
            }
          } else {
            if (name == '') {
              setNameError(true);
            } else {
              setNameError(false);
            }
            if (cardNumber == '' || cardNumber.length < 16) {
              setCardError(true);
            } else {
              setCardError(false);
            }
            if (expiryDate == '' || expiryDate.length < 7) {
              setDateError(true);
            } else {
              setDateError(false);
            }
            if (cVV == '' || cVV.length < 3) {
              setCvvError(true);
            } else {
              setCvvError(false);
            }
          }
        }}
      />
      <DialogModal
        visible={modal}
        children={
          <>
            <FastImage
              resizeMode="contain"
              style={styles.thumbStyle}
              source={require('../../assets/images/thumb.png')}
            />
            <Text style={styles.responseText}>
              Your account has been updated. You can explore the app after the
              admin has verified your details.
            </Text>
            <Button
              style={[styles.acceptModalButton, styles.modalText]}
              title1="OK"
              onPress={() => {
                props.navigation.reset({
                  index: 0,
                  routes: [{name: 'Login'}],
                });
              }}
            />
          </>
        }
      />
    </View>
  );
};

export default PaymentScreen;
