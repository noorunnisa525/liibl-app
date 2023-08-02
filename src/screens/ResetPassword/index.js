import React, {useRef, useEffect, useState} from 'react';
import {ScrollView, View, TouchableOpacity} from 'react-native';
import Button from '../../components/CustomButton';
import Header from '../../components/CustomHeader';
import Text from '../../components/CustomText';
import {useThemeAwareObject} from '../../theme/index';
import createStyles from './styles';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import * as yup from 'yup';
import {Formik} from 'formik';
import CustomInputField from '../../components/CustomInputField';
import {
  lockSvg as LockSvg,
  messageSvg as MessageSvg,
  eye as EyeOff,
  eyeOff as Eye,
} from '../../../assets/Icons/Svgs';
import {useRoute} from '@react-navigation/native';
import Snackbar from 'react-native-snackbar';
import {reset_password} from '../../services/api-confog';
import {usePostApiMutation} from '../../services/service';
import {useDispatch} from 'react-redux';
import {setForgetPasswordFlag} from '../../redux/slices/userSlice';
import {wp} from '../../util';
function ResetPassword({navigation}) {
  const otpRef = useRef();
  const dispatch = useDispatch();
  const styles = useThemeAwareObject(createStyles);
  const [passwordVisible, setPasswordVisible] = useState(true);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(true);
  const route = useRoute();
  const {phone} = route.params.data;
  const [resetPasswordCall, resetPasswordResponse] = usePostApiMutation();
  useEffect(() => {
    otpRef?.current?.focusField(0);
  });
  const loginValidationSchema = yup.object().shape({
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
      .oneOf([yup.ref('password')], 'Passwords do not match')
      .required('Confirm password is required'),
  });

  // api resetPassword
  const resetPasswordApi = async values => {
    let data = {
      phone: phone,
      new_password: values.password,
      new_password_confirmation: values.confirmPassword,
    };
    let apiData = {
      url: reset_password,
      data: data,
      method: 'POST',
    };
    try {
      let apiResponse = await resetPasswordCall(apiData).unwrap();
      if (apiResponse.status == 200) {
        Snackbar.show({
          text: apiResponse?.message,
          duration: Snackbar.LENGTH_SHORT,
        });
        dispatch(setForgetPasswordFlag(false));
        navigation.navigate('Login');
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
          <Text style={styles.headerInitialText}>Reset Password</Text>
        }
      />
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled={true}
        keyboardShouldPersistTaps="always">
        <View>
          <Text style={styles.loginSubText}>
            Please enter your new password below.
          </Text>
          <View style={styles.optContainer}>
            <Formik
              validationSchema={loginValidationSchema}
              initialValues={{password: '', confirmPassword: ''}}
              onSubmit={values => {
                resetPasswordApi(values);
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
                  <Text style={styles.textFieldTitle}>New Password</Text>
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
                          onPressSvg={() =>
                            setPasswordVisible(!passwordVisible)
                          }
                        />
                      ) : (
                        <EyeOff
                          onPressSvg={() =>
                            setPasswordVisible(!passwordVisible)
                          }
                        />
                      )
                    }
                  />
                  {errors.password && touched.password && (
                    <Text style={styles.errorText}>{errors.password}</Text>
                  )}
                  <Text style={styles.textFieldTitle}>
                    Confirm New Password
                  </Text>

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
                    <Text style={styles.errorText}>
                      {errors.confirmPassword}
                    </Text>
                  )}
                  <Button
                    onPress={handleSubmit}
                    style={[styles.verifyButton, styles.text]}
                    title1="Create New Password"
                    loading={resetPasswordResponse.isLoading}
                  />
                </View>
              )}
            </Formik>
          </View>
        </View>
        <View style={styles.termsButton}>
          <Text style={styles.loginSubText}>I remembered my password. </Text>
          <Button
            style={[styles.createButton, styles.termsText]}
            title1="Back to login"
            onPress={() => navigation.navigate('Login')}
          />
        </View>
      </ScrollView>
    </View>
  );
}

export default ResetPassword;
