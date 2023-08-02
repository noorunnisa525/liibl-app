import CheckBox from '@react-native-community/checkbox';
import {Formik} from 'formik';
import React, {useState} from 'react';
import {Image, View} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import ReactNativeModal from 'react-native-modal';
import Snackbar from 'react-native-snackbar';
import WebView from 'react-native-webview';
import {useDispatch} from 'react-redux';
import * as yup from 'yup';
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
  setForgetPasswordFlag,
  setTempToken,
} from '../../redux/slices/userSlice';
import {create_account} from '../../services/api-confog';
import {usePostApiMutation} from '../../services/service';
import {useThemeAwareObject} from '../../theme/index';
import Social from '../Social';
import createStyles from './styles';

function CreateAccount({navigation}) {
  const dispatch = useDispatch();
  const styles = useThemeAwareObject(createStyles);
  const [passwordVisible, setPasswordVisible] = useState(true);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(true);
  const [isSelected, setSelection] = useState(false);
  const [dialog, setDialog] = useState(false);
  const [webUri, setWebUri] = useState('');
  const [createAccountCall, createAccountResponse] = usePostApiMutation();
  const loginValidationSchema = yup.object().shape({
    email: yup
      .string()
      .email('Please enter a valid email')
      .required('Email address is required'),
    password: yup
      .string()
      .matches(/\w*[a-z]\w*/, 'Password must have a small letter')
      .matches(/\w*[A-Z]\w*/, 'Password must have a capital letter')
      .matches(/\d/, 'Password must have a number')
      .matches(
        /[!@#$%^&*()\-_"=+{}; :,<.>]/,
        'Password must have a special character',
      )
      .min(8, ({min}) => `Password must be at least ${min} characters`)
      .required('Password is required'),
    confirmPassword: yup
      .string()
      .required('Password confirmation is required')
      .oneOf([yup.ref('password')], 'Password does not match'),
  });

  // api Create account
  const createAccountApi = async values => {
    let data = {
      email: values.email.toLowerCase(),
      password: values.password,
      confirm_password: values.confirmPassword,
    };
    let apiData = {
      url: create_account,
      data: data,
      method: 'POST',
    };
    try {
      let apiResponse = await createAccountCall(apiData).unwrap();
      if (apiResponse.status == 200) {
        dispatch(setForgetPasswordFlag(false));
        dispatch(setTempToken(apiResponse.data.access_token));
        navigation.navigate('EditProfile');
      } else {
        Snackbar.show({
          text: apiResponse?.message,
          duration: Snackbar.LENGTH_SHORT,
        });
      }
    } catch (e) {}
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
        <Text style={styles.SignUpText}>Create Account</Text>
        <Text style={styles.signupSubText}>
          Enter the info below to Create Account
        </Text>
        <Formik
          validationSchema={loginValidationSchema}
          initialValues={{email: '', password: '', confirmPassword: ''}}
          onSubmit={values => {
            if (isSelected) {
              createAccountApi(values);
            } else {
              Snackbar.show({
                text: 'Please accept terms and conditions',
                duration: Snackbar.LENGTH_SHORT,
              });
            }
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
              <Text style={styles.textFieldTitle}>Confirm Password</Text>

              <CustomInputField
                name="confirmPassword"
                inputStyle={styles.loginInputText}
                inputContainerStyle={{borderColor: 'lightgray'}}
                placeholder="Confirm Password"
                value={values.confirmPassword}
                onChangeText={handleChange('confirmPassword')}
                onBlur={handleBlur('confirmPassword')}
                secureTextEntry={confirmPasswordVisible}
                leftIcon={<LockSvg />}
                rightIcon={
                  confirmPasswordVisible ? (
                    <Eye
                      onPressSvg={() =>
                        setConfirmPasswordVisible(!confirmPasswordVisible)
                      }
                    />
                  ) : (
                    <EyeOff
                      onPressSvg={() =>
                        setConfirmPasswordVisible(!confirmPasswordVisible)
                      }
                    />
                  )
                }
              />
              {errors.confirmPassword && touched.confirmPassword && (
                <Text style={styles.errorText}>{errors.confirmPassword}</Text>
              )}
              <View style={styles.checkboxContainer}>
                <CheckBox
                  value={isSelected}
                  boxType="square"
                  onValueChange={setSelection}
                  style={styles.checkbox}
                  tintColors={{true: 'black', false: 'black'}}
                />
                <Text style={styles.checkText}>
                  I agree to{' '}
                  <Text
                    onPress={() => {
                      setDialog(true);
                      setWebUri(
                        'https://liibl.stackup.solutions/terms-conditions',
                      );
                    }}
                    style={styles.linkText}>
                    Terms & Conditions
                  </Text>{' '}
                  and{' '}
                  <Text
                    style={styles.linkText}
                    onPress={() => {
                      setDialog(true);
                      setWebUri(
                        'https://liibl.stackup.solutions/privacy_policy',
                      );
                    }}>
                    Privacy Policy
                  </Text>
                </Text>
              </View>

              <Button
                onPress={handleSubmit}
                style={[styles.loginButton, styles.text]}
                title1="Continue"
                loading={createAccountResponse.isLoading}
              />
              <View style={styles.dividerView}>
                <View style={styles.dividerStyle} />
                <Text style={styles.optionText}> Or Sign Up with </Text>
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
        <View style={styles.termsButton}>
          <Text style={styles.loggingText}>Already have an account? </Text>
          <Button
            style={[styles.createButton, styles.loginText]}
            title1="Login"
            onPress={() => navigation.navigate('Login')}
          />
        </View>
      </KeyboardAwareScrollView>
      <ReactNativeModal
        isVisible={dialog}
        onBackdropPress={() => setDialog(false)}
        onBackButtonPress={() => setDialog(false)}
        onRequestClose={() => setDialog(false)}
        hasBackdrop
        backdropOpacity={0.7}
        backdropColor="rgb(0,0,0)"
        style={styles.webModal}>
        <WebView source={{uri: webUri}} startInLoadingState />
      </ReactNativeModal>
    </View>
  );
}

export default CreateAccount;
