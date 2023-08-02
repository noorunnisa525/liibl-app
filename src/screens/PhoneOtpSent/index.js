import React from 'react';
import {Formik} from 'formik';
import {useEffect, useRef} from 'react';
import {ScrollView, TouchableOpacity, View} from 'react-native';
import Snackbar from 'react-native-snackbar';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import * as yup from 'yup';
import {callSvg as CallSvg} from '../../../assets/Icons/Svgs';
import Button from '../../components/CustomButton';
import Header from '../../components/CustomHeader';
import CustomInputField from '../../components/CustomInputField';
import Text from '../../components/CustomText';
import {
  forgot_password,
  resend_phone_verification,
} from '../../services/api-confog';
import {usePostApiMutation} from '../../services/service';
import {useThemeAwareObject} from '../../theme/index';
import createStyles from './styles';
import {wp} from '../../util';

function PhoneOtpSent({navigation}) {
  const otpRef = useRef();
  const styles = useThemeAwareObject(createStyles);
  const [verifyCall, verifyResponse] = usePostApiMutation();

  useEffect(() => {
    otpRef?.current?.focusField(0);
  });

  const loginValidationSchema = yup.object().shape({
    phone: yup.string().required('Phone number is required'),
  });

  // api forgotPassword
  const forgotPasswordApi = async values => {
    let data = {
      phone: values.phone,
    };
    let apiData = {
      url: forgot_password,
      data: data,
      method: 'POST',
    };
    try {
      let apiResponse = await verifyCall(apiData).unwrap();
      if (apiResponse.status == 200) {
        navigation.navigate('PhoneVerification', {
          data: {phoneNumber: data.phone},
        });
      } else {
        Snackbar.show({
          text: apiResponse?.message,
          duration: Snackbar.LENGTH_SHORT,
        });
      }
    } catch (e) {
      console.log('e', e);
    }
  };

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
              navigation.goBack();
            }}>
            <MaterialIcons
              name={'keyboard-arrow-left'}
              size={wp(7)}
              color={'black'}
              onPress={() => {
                navigation.goBack();
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
            Please enter your phone number to reset your password.
          </Text>
          <View style={styles.optContainer}>
            <Formik
              validationSchema={loginValidationSchema}
              initialValues={{phone: ''}}
              onSubmit={values => {
                forgotPasswordApi(values);
              }}
              validateOnChange={false}
              validateOnBlur={false}>
              {({
                handleChange,
                handleSubmit,
                handleBlur,
                values,
                errors,
                touched,
                isValid,
              }) => (
                <View
                  // behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                  style={styles.inputContainer}>
                  <Text style={styles.textFieldTitle}>Phone Number</Text>
                  <CustomInputField
                    name="phone"
                    inputStyle={styles.loginInputText}
                    inputContainerStyle={{borderColor: 'lightgray'}}
                    placeholder="Phone Number"
                    value={values.phone}
                    onChangeText={handleChange('phone')}
                    onBlur={handleBlur('phone')}
                    keyboardType="phone-pad"
                    leftIcon={<CallSvg />}
                  />
                  {errors.phone && touched.phone && (
                    <Text style={styles.errorText}>{errors.phone}</Text>
                  )}
                  <Button
                    onPress={handleSubmit}
                    style={[styles.loginButton, styles.text]}
                    title1="Send"
                    loading={verifyResponse.isLoading}
                  />
                </View>
              )}
            </Formik>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

export default PhoneOtpSent;
