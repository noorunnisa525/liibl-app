import {Formik} from 'formik';
import React, {useState} from 'react';
import {Image, ScrollView, TouchableOpacity, View} from 'react-native';
import Snackbar from 'react-native-snackbar';
import {useDispatch} from 'react-redux';
import * as yup from 'yup';
import OneSignal from 'react-native-onesignal';
import {
  eye as EyeOff,
  eyeOff as Eye,
  lockSvg as LockSvg,
  messageSvg as MessageSvg,
} from '../../../assets/Icons/Svgs';
import Button from '../../components/CustomButton';
import Header from '../../components/CustomHeader';
import CustomInputField from '../../components/CustomInputField';
import Text from '../../components/CustomText';
import {
  onLogin,
  setCurrentUserData,
  setForgetPasswordFlag,
  setTempToken,
  setToken,
} from '../../redux/slices/userSlice';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {business_login} from '../../services/api-confog';
import {usePostApiMutation} from '../../services/service';
import {useThemeAwareObject} from '../../theme/index';
import Social from '../Social';
import createStyles from './styles';
import {hp} from '../../util';
function Login({navigation}) {
  const styles = useThemeAwareObject(createStyles);
  const [loginCall, loginResponse] = usePostApiMutation();
  const [sendOtp, sendOtpResponse] = usePostApiMutation();
  const [resendOtPCall, resendOtpResponse] = usePostApiMutation();

  const [user, setUser] = useState({});
  const dispatch = useDispatch();
  const [passwordVisible, setPasswordVisible] = useState(true);
  const [LoginCall, LoginResponse] = usePostApiMutation();

  const loginValidationSchema = yup.object().shape({
    email: yup
      .string()
      .email('Please enter a valid email')
      .required('Email address is required'),
    password: yup
      .string()
      // .min(8, ({min}) => `Password must be at least ${min} characters`)
      .required('Password is required'),
  });
  // api Login
  const LoginApi = async values => {
    let data = {
      email: values.email.toLowerCase(),
      password: values.password,
    };
    let apiData = {
      url: business_login,
      data: data,
      method: 'POST',
    };
    try {
      let apiResponse = await LoginCall(apiData).unwrap();
      if (apiResponse.status == 200) {
        dispatch(setForgetPasswordFlag(false));
        if (apiResponse.data.user.type == 'business') {
          if (apiResponse.data.user.subscription_type) {
            if (apiResponse.data.user.admin_verify == 'active') {
              OneSignal.setExternalUserId(
                apiResponse.data.user.email.toLowerCase(),
                apiResponse.data.oneSignalHash,
              );
              dispatch(setCurrentUserData(apiResponse.data.user));
              dispatch(setToken(apiResponse.data.access_token));
              dispatch(onLogin(true));
            } else {
              Snackbar.show({
                text: 'Please wait for your account to be approved from admin',
                duration: Snackbar.LENGTH_LONG,
              });
            }
          } else if (apiResponse.data.user.name == null) {
            dispatch(setTempToken(apiResponse.data.access_token));
            navigation.navigate('EditProfile');
          } else if (apiResponse.data.user.phone_verified_at == null) {
            dispatch(setTempToken(apiResponse.data.access_token));
            navigation.navigate('PhoneVerification', {
              data: {phoneNumber: apiResponse?.data?.user?.phone},
            });
          } else if (
            apiResponse.data.user.phone_verified_at &&
            apiResponse.data.user.subscription_type == null
          ) {
            dispatch(setCurrentUserData(apiResponse.data.user));
            dispatch(setTempToken(apiResponse.data.access_token));
            navigation.navigate('Subscription');
          }
        } else {
          Snackbar.show({
            text: 'This email is associated with Employee Account',
            duration: Snackbar.LENGTH_LONG,
          });
        }
      } else {
        Snackbar.show({
          text: apiResponse?.message,
          duration: Snackbar.LENGTH_LONG,
        });
      }
    } catch (e) {
      console.log('login E', e);
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
        centerComponent={
          <Image
            source={require('../../../assets/images/lybl.png')}
            style={styles.headerImage}
            resizeMode={'contain'}
          />
        }
      />
      <KeyboardAwareScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled={true}
        keyboardShouldPersistTaps="always">
        <View style={{paddingVertical: 2}}>
          <Text style={styles.loginText}>Login</Text>
          <Text style={styles.loginSubText}>
            Enter your email and password to login
          </Text>
          <Formik
            validationSchema={loginValidationSchema}
            initialValues={{email: '', password: ''}}
            onSubmit={values => {
              LoginApi(values);
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
              <View style={styles.inputContainer}>
                <Text style={styles.textFieldTitle}>Email</Text>
                <CustomInputField
                  name="email"
                  keyboardType={'email-address'}
                  inputStyle={styles.loginInputText}
                  inputContainerStyle={{borderColor: 'lightgray'}}
                  placeholder="Email Address"
                  value={values.email}
                  onChangeText={handleChange('email')}
                  onBlur={handleBlur('email')}
                  leftIcon={<MessageSvg />}
                />
                {errors.email && touched.email && (
                  <Text style={styles.errorText}>{errors.email}</Text>
                )}
                <Text style={styles.textFieldTitle}>Password</Text>
                <CustomInputField
                  name="password"
                  inputStyle={styles.loginInputText}
                  inputContainerStyle={{borderColor: 'lightgray'}}
                  placeholder="Password"
                  value={values.password}
                  onChangeText={handleChange('password')}
                  onBlur={handleBlur('password')}
                  secureTextEntry={passwordVisible}
                  leftIcon={<LockSvg />}
                  rightIcon={
                    passwordVisible ? (
                      <Eye
                        onPressSvg={() => setPasswordVisible(!passwordVisible)}
                      />
                    ) : (
                      <EyeOff
                        onPressSvg={() => setPasswordVisible(!passwordVisible)}
                      />
                    )
                  }
                />
                {errors.password && touched.password && (
                  <Text style={styles.errorText}>{errors.password}</Text>
                )}
                <TouchableOpacity
                  style={styles.forgotButton}
                  onPress={() => {
                    dispatch(setForgetPasswordFlag(true));
                    navigation.navigate('PhoneOtpSent');
                  }}>
                  <Text style={styles.forgotPasswordText}>
                    Forgot Password?
                  </Text>
                </TouchableOpacity>
                <Button
                  onPress={handleSubmit}
                  style={[styles.loginButton, styles.text]}
                  loading={LoginResponse.isLoading}
                  title1="Login"
                />
                <View style={styles.dividerView}>
                  <View style={styles.dividerStyle} />
                  <Text style={styles.optionText}> Or Login with </Text>
                  <View style={styles.dividerStyle} />
                </View>
              </View>
            )}
          </Formik>
          <Social navigation={navigation} />
          {/* <View style={styles.socialButtonContainer}>
            <Button
              style={[styles.socialButton, styles.socialText]}
              title1="Google"
              svg={<GoogleSvg />}
            />
            <Button
              style={[styles.socialButtonFacebook, styles.socialTextFacebook]}
              title1="Facebook "
              icon={'facebook'}
              iconColor={'white'}
            />
          </View> */}
        </View>

        <View style={styles.termsButton}>
          <Text style={styles.loggingText}>Don't have an account? </Text>
          <Button
            style={[styles.createButton, styles.createButtonText]}
            title1="Create Account"
            onPress={() => navigation.replace('CreateAccount')}
          />
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
}

export default Login;
