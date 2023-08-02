import {useRoute} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {BackHandler, ScrollView, TouchableOpacity, View} from 'react-native';
import Snackbar from 'react-native-snackbar';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useDispatch, useSelector} from 'react-redux';
import Code from '../../components/CodeVerification';
import Button from '../../components/CustomButton';
import Header from '../../components/CustomHeader';
import Text from '../../components/CustomText';
import {
  phone_verification,
  resend_phone_verification,
} from '../../services/api-confog';
import {usePostApiMutation} from '../../services/service';
import {useThemeAwareObject} from '../../theme/index';
import {wp} from '../../util';
import createStyles from './styles';

function PhoneVerification({navigation}) {
  const styles = useThemeAwareObject(createStyles);
  const [verifyCall, verifyResponse] = usePostApiMutation();
  const [resendOtPCall, resendOtpResponse] = usePostApiMutation();
  const route = useRoute();
  const {data} = route.params;
  const [otpValue, setOtpValue] = useState();
  const isForgetPasswordFlag = useSelector(
    state => state.user.forgetPasswordFlag,
  );

  useEffect(() => {
    const backAction = () => {
      navigation.reset({
        index: 0,
        routes: [{name: 'Login'}],
      });
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, []);

  const dispatch = useDispatch();
  //EmailVerificationApi

  const PhoneVerificationApi = async () => {
    let PhoneVerificationApiData = {
      phone: data?.phoneNumber,
      OTP: otpValue,
    };
    let apiData = {
      url: phone_verification,
      data: PhoneVerificationApiData,
      method: 'POST',
    };
    try {
      let apiResponse = await verifyCall(apiData).unwrap();
      if (apiResponse.status == 200) {
        if (isForgetPasswordFlag) {
          navigation.navigate('ResetPassword', {
            data: {phone: data?.phoneNumber},
          });
        } else {
          navigation.navigate('Subscription');
        }
      } else {
        Snackbar.show({
          text: apiResponse?.message,
          duration: Snackbar.LENGTH_SHORT,
        });
      }
    } catch (e) {}
  };

  //resend phone verification api

  const ResendPhoneVerificationApi = async () => {
    let resendApiData = {
      phone: data?.phoneNumber,
    };
    let apiData = {
      url: resend_phone_verification,
      data: resendApiData,
      method: 'POST',
    };
    try {
      let apiResponse = await resendOtPCall(apiData).unwrap();
      if (apiResponse.status == 200) {
        Snackbar.show({
          text: apiResponse?.message,
          duration: Snackbar.LENGTH_SHORT,
        });
      } else {
        Snackbar.show({
          text: apiResponse?.message,
          duration: Snackbar.LENGTH_SHORT,
        });
      }
    } catch (e) {}
  };

  function verifyCode(value) {
    setOtpValue(value);
  }

  return (
    <View style={styles.mainContainer}>
      <Header
        placement={'center'}
        barStyle={'dark-content'}
        containerStyle={styles.headerContainerStyle}
        backgroundColor={styles.headerColor}
        statusBarProps={styles.headerColor}
        leftComponent={
          <TouchableOpacity
            style={styles.iconContainer}
            onPress={() => {
              navigation.reset({
                index: 0,
                routes: [{name: 'Login'}],
              });
            }}>
            <MaterialIcons
              name={'keyboard-arrow-left'}
              size={wp(7)}
              color={'black'}
              onPress={() => {
                navigation.reset({
                  index: 0,
                  routes: [{name: 'Login'}],
                });
              }}
            />
          </TouchableOpacity>
        }
        centerComponent={
          <Text style={styles.headerInitialText}>Phone Verification</Text>
        }
      />
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled={true}
        keyboardShouldPersistTaps="always">
        <View>
          <Text style={styles.loginSubText}>
            We have sent an OTP code to your phone number. Please enter that
            code below to verify.
          </Text>
          <View style={styles.otpView}>
            <Code verifyCode={value => verifyCode(value)} />
          </View>
          <View style={styles.termsButton}>
            <Text style={styles.resend}>Haven't recieved any code? </Text>
            <Button
              style={[styles.createButton, styles.resendText]}
              title1="Resend"
              onPress={() => ResendPhoneVerificationApi()}
              loading={resendOtpResponse.isLoading}
              loaderBlack
            />
          </View>

          <Button
            onPress={() => PhoneVerificationApi()}
            style={[styles.verifyButton, styles.text]}
            title1="Verify"
            loading={verifyResponse.isLoading}
          />
        </View>
      </ScrollView>
    </View>
  );
}

export default PhoneVerification;
