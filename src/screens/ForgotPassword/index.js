import React, {useRef, useEffect, useState} from 'react';
import {
  ScrollView,
  View,
  Image,
  KeyboardAvoidingView,
  TouchableOpacity,
} from 'react-native';
import Button from '../../components/CustomButton';
import Header from '../../components/CustomHeader';
import Text from '../../components/CustomText';
import Code from '../../components/CodeVerification';
import {useThemeAwareObject} from '../../theme/index';
import createStyles from './styles';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {wp} from '../../util';

function ForgotPassword({navigation}) {
  const styles = useThemeAwareObject(createStyles);
  const [otpValue, setOtpValue] = useState[''];

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
      />
      <View style={styles.subContainer}>
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
        <Text style={styles.headerInitialText}> Forgot Password</Text>
        <View style={{width: '10%'}}></View>
      </View>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled={true}
        keyboardShouldPersistTaps="always">
        <View>
          <Text style={styles.loginSubText}>
            We have send an OTP code to you email {'\n'}address. Please enter
            that code below to verify.
          </Text>
          <View style={styles.optContainer}>
            <Code verifyCode={value => verifyCode(value)} />
            <TouchableOpacity
              onPress={() => navigation.navigate('ForgotPassword')}>
              <Text style={styles.resend}>
                haven’t recieve any code?
                <Text style={styles.resendText}> Resend</Text>
              </Text>
            </TouchableOpacity>
            <Button
              onPress={() => navigation.navigate('ResetPassword')}
              style={[styles.verifyButton, styles.text]}
              title1="Verify"
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

export default ForgotPassword;
