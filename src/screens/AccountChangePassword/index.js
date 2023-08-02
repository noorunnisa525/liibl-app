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
  eye as EyeOff,
  eyeOff as Eye,
} from '../../../assets/Icons/Svgs';
import DialogModal from '../../components/DialogModal';
import FastImage from 'react-native-fast-image';
import {
  account_change_password,
  change_password,
} from '../../services/api-confog';
import {useSelector} from 'react-redux';
import Snackbar from 'react-native-snackbar';
import {usePostApiMutation} from '../../services/service';
import {wp} from '../../util';

function AccountChangePassword({navigation}) {
  const otpRef = useRef();
  const styles = useThemeAwareObject(createStyles);
  const [oldPassword, setOldPassword] = useState(true);
  const [oldPasswordVisible, setOldPasswordVisible] = useState(true);
  const [passwordVisible, setPasswordVisible] = useState(true);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(true);
  const [isSelected, setSelection] = useState(false);
  const [submit, setSubmit] = useState(false);
  const accessToken = useSelector(state => state.user.access_token);
  const token = useSelector(state => state.user.token);
  const [resetPasswordCall, resetPasswordResponse] = usePostApiMutation();
  useEffect(() => {
    otpRef?.current?.focusField(0);
  });
  const loginValidationSchema = yup.object().shape({
    oldPassword: yup
      .string()
      .matches(/\w*[a-z]\w*/, 'Old password must have a small letter')
      .matches(/\w*[A-Z]\w*/, 'Old password must have a capital letter')
      .matches(/\d/, 'Old password must have a number')
      .matches(
        /[!@#$%^&*()\-_"=+{}; :,<.>]/,
        'Old password must have a special character',
      )
      .min(8, ({min}) => `Old password must be at least ${min} characters`)
      .required('Old password is required'),
    password: yup
      .string()
      .matches(/\w*[a-z]\w*/, 'New password must have a small letter')
      .matches(/\w*[A-Z]\w*/, 'New password must have a capital letter')
      .matches(/\d/, 'New password must have a number')
      .matches(
        /[!@#$%^&*()\-_"=+{}; :,<.>]/,
        'New password must have a special character',
      )
      .min(8, ({min}) => `New password must be at least ${min} characters`)
      .required('New password is required'),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref('password')], 'Password does not match')
      .required('Confirm password is required'),
  });

  const changePasswordApi = async values => {
    let data = {
      old_password: values.oldPassword,
      new_password: values.password,
      confirm_password: values.confirmPassword,
    };
    let apiData = {
      url: change_password,
      data: data,
      method: 'POST',
      token: token,
    };
    try {
      let apiResponse = await resetPasswordCall(apiData).unwrap();
      if (apiResponse.statusCode == 200) {
        setSubmit(true);
      } else {
        Snackbar.show({
          text: apiResponse?.Message,
          duration: Snackbar.LENGTH_SHORT,
        });
      }
    } catch (e) {
      Snackbar.show({
        text: e?.data?.message ?? 'Network Error',
        duration: Snackbar.LENGTH_SHORT,
      });
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
          <Text style={styles.headerInitialText}>Change Password</Text>
        }
      />

      <View style={styles.container}>
        <Text style={styles.loginSubText}>
          Please enter your new password below.
        </Text>
        <Formik
          validationSchema={loginValidationSchema}
          initialValues={{
            password: '',
            confirmPassword: '',
            oldPassword: '',
          }}
          onSubmit={values => {
            changePasswordApi(values);
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
              <Text style={styles.textFieldTitle}>Old Password</Text>
              <CustomInputField
                name="oldPassword"
                inputStyle={styles.loginInputText}
                inputContainerStyle={{borderColor: 'lightgray'}}
                placeholder="Old Password"
                value={values.oldPassword}
                onChangeText={handleChange('oldPassword')}
                onBlur={handleBlur('oldPassword')}
                secureTextEntry={oldPasswordVisible}
                leftIcon={<LockSvg />}
                rightIcon={
                  oldPasswordVisible ? (
                    <Eye
                      onPressSvg={() =>
                        setOldPasswordVisible(!oldPasswordVisible)
                      }
                    />
                  ) : (
                    <EyeOff
                      onPressSvg={() =>
                        setOldPasswordVisible(!oldPasswordVisible)
                      }
                    />
                  )
                }
              />
              {errors.oldPassword && touched.oldPassword && (
                <Text style={styles.errorText}>{errors.oldPassword}</Text>
              )}
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
              <Text style={styles.textFieldTitle}>Confirm New Password</Text>

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
              <Button
                onPress={handleSubmit}
                style={[styles.updatePasswordButton, styles.text]}
                title1="Update Password"
                loading={resetPasswordResponse.isLoading}
              />
            </View>
          )}
        </Formik>
      </View>
      <DialogModal
        visible={submit}
        dialogStyle={styles.dialogStyle}
        children={
          <>
            <FastImage
              resizeMode="contain"
              style={styles.thumbStyle}
              source={require('../../../assets/images/thumb.png')}
            />
            <Text style={styles.responseText}>
              Your password is successfuly updated!
            </Text>
            <Button
              style={[styles.responseButton, styles.completedJobButtonText]}
              title1="OK"
              onPress={() => {
                setSubmit(false);
                navigation.navigate('Account');
              }}
            />
          </>
        }
      />
    </View>
  );
}

export default AccountChangePassword;
