import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import React, {useState} from 'react';
import {Platform, View} from 'react-native';
import {
  AccessToken,
  AuthenticationToken,
  GraphRequest,
  GraphRequestManager,
  LoginManager,
} from 'react-native-fbsdk-next';
import {appleAuth} from '@invertase/react-native-apple-authentication';
import OneSignal from 'react-native-onesignal';
import Snackbar from 'react-native-snackbar';
import Icon from 'react-native-vector-icons/FontAwesome';
import {useDispatch} from 'react-redux';
import Button from '../../components/CustomButton';
import {
  onLogin,
  setCurrentUserData,
  setForgetPasswordFlag,
  setTempToken,
  setToken,
} from '../../redux/slices/userSlice';
import {googleSvg as GoogleSvg} from '../../../assets/Icons/Svgs';
import {social_login} from '../../services/api-confog';
import {usePostApiMutation} from '../../services/service';
import {useThemeAwareObject} from '../../theme/index';
import createStyles from './styles';

function Social({navigation}) {
  const styles = useThemeAwareObject(createStyles);
  const dispatch = useDispatch();

  const [socialCall, socialResponse] = usePostApiMutation();

  const [googleLoader, setGoogleLoader] = useState(false);
  const [facebookLoader, setFacebookLoader] = useState(false);
  const [appleLoader, setAppleLoader] = useState(false);

  const apiCalling = async apiData => {
    console.log('apiData', apiData);

    try {
      let res = await socialCall(apiData).unwrap();
      console.log('res', res);
      if (res.status == 200) {
        setGoogleLoader(false);
        setFacebookLoader(false);
        setAppleLoader(false);
        dispatch(setForgetPasswordFlag(false));
        if (res.data.user.type == 'business') {
          if (res.data.user.subscription_type) {
            if (res.data.user.admin_verify == 'active') {
              OneSignal.setExternalUserId(
                res.data.user.email.toLowerCase(),
                res.data.oneSignalHash,
              );
              dispatch(setCurrentUserData(res.data.user));
              dispatch(setToken(res.data.access_token));
              dispatch(onLogin(true));
            } else {
              Snackbar.show({
                text: 'Please wait for your account to be approved from admin',
                duration: Snackbar.LENGTH_LONG,
              });
            }
          } else if (res.data.user.phone == null) {
            dispatch(setTempToken(res.data.access_token));
            navigation.navigate('EditProfile', {name: res.data.user.name});
          } else if (res.data.user.phone_verified_at == null) {
            dispatch(setTempToken(res.data.access_token));
            Snackbar.show({
              text: res?.message,
              duration: Snackbar.LENGTH_LONG,
            });
            navigation.navigate('PhoneVerification', {
              data: {phoneNumber: res?.data?.user?.phone},
            });
          } else if (
            res.data.user.phone_verified_at &&
            res.data.user.subscription_type == null
          ) {
            dispatch(setCurrentUserData(res.data.user));
            dispatch(setTempToken(res.data.access_token));
            Snackbar.show({
              text: res?.message,
              duration: Snackbar.LENGTH_LONG,
            });
            navigation.navigate('Subscription');
          }
        } else {
          Snackbar.show({
            text: 'This email is associated with Employee Account',
            duration: Snackbar.LENGTH_LONG,
          });
        }
      } else {
        setGoogleLoader(false);
        setFacebookLoader(false);
        setAppleLoader(false);
      }
    } catch (e) {
      console.log('social E', e);
      setGoogleLoader(false);
      setFacebookLoader(false);
      setAppleLoader(false);
    }
  };

  const googleLogin = async () => {
    setGoogleLoader(true);
    GoogleSignin.signOut();
    try {
      GoogleSignin.configure({
        scopes: ['profile', 'email'],
        androidClientId:
          '640885199575-r1h9rstolt7e1t66mmer80n29fghgha2.apps.googleusercontent.com',
        webClientId:
          '640885199575-r1h9rstolt7e1t66mmer80n29fghgha2.apps.googleusercontent.com',
        iosClientId:
          '640885199575-7cvcb5shkf885pl3jcac5ts2rrqllkep.apps.googleusercontent.com',
      });

      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();

      googleAuth(userInfo);
    } catch (error) {
      console.log('error', error);
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        setGoogleLoader(false);
        // setLoading(false);
        // user cancelled the login flow
      } else if (error.code === statusCodes.IN_PROGRESS) {
        setGoogleLoader(false);
        // operation (e.g. sign in) is in progress already
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        setGoogleLoader(false);
        // play services not available or outdated
      } else {
        setGoogleLoader(false);
        // some other error happened
      }
    }
  };

  const googleAuth = info => {
    let data = {
      name: info.user.name,
      email: info.user.email.toLowerCase(),
      google_id: info.user.id,
      is_google: 'google',
      type: 'business',
    };
    let apiData = {
      url: social_login,
      method: 'POST',
      data: data,
    };
    apiCalling(apiData);
  };

  const facebookLogin = async () => {
    setFacebookLoader(true);
    LoginManager.logOut();
    try {
      const results = await LoginManager.logInWithPermissions([
        'email',
        'public_profile',
        'user_friends',
      ]);

      if (Platform.OS === 'ios') {
        const result =
          await AuthenticationToken.getAuthenticationTokenIOS().then(data => {
            const processRequest = new GraphRequest(
              '/me?fields=name,email',
              null,
              (err, res) =>
                getResponseInfo(err, res, result?.authenticationToken),
            ); // Start the graph request.
            new GraphRequestManager().addRequest(processRequest).start();
          });
      } else {
        if (!results.isCancelled) {
          // await AsyncStorage.setItem('login', 'facebook');
          // navigation.navigate('MainTab');
        }
        const result = AccessToken.getCurrentAccessToken().then(data => {
          const processRequest = new GraphRequest(
            '/me?fields=name,email',
            null,
            (err, res) =>
              getResponseInfo(err, res, data?.accessToken.toString()),
          ); // Start the graph request.
          new GraphRequestManager().addRequest(processRequest).start();
        });
      }
    } catch (error) {}
  };

  const getResponseInfo = (error, result, info) => {
    if (error) {
      console.log('error', error);
      setFacebookLoader(false);
    } else {
      facebookAuth(result, info);
    }
  };

  const facebookAuth = async (result, info) => {
    let data = {
      name: result.name,
      email: result.email.toLowerCase(),
      facebook_id: result.id,
      is_facebook: 'facebook',
      type: 'business',
    };
    let apiData = {
      url: social_login,
      method: 'POST',
      data: data,
    };
    apiCalling(apiData);
  };

  const appleLogin = async () => {
    setAppleLoader(true);
    const appleAuthRequestResponse = await appleAuth
      .performRequest({
        requestedOperation: appleAuth.Operation.LOGIN,
        requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
      })
      .then(async appleAuthResponse => {
        let data = {
          name:
            appleAuthResponse?.fullName.givenName +
            appleAuthResponse?.fullName.familyName,
          email: appleAuthResponse.email?.toLowerCase(),
          apple_id: appleAuthResponse.user,
          is_apple: 'apple',
          type: 'business',
        };
        let apiData = {
          url: social_login,
          method: 'POST',
          data: data,
        };
        apiCalling(apiData);
      })
      .catch(e => {
        console.log('e', e);
        setAppleLoader(false);
      });
  };

  return (
    <View style={styles.socialContainer}>
      <View style={styles.socialButtonContainer}>
        <Button
          style={[styles.googleBtn, null, styles.googleBtnText]}
          title1={<GoogleSvg />}
          title2="Google"
          loaderBlack
          loading={googleLoader}
          onPress={() => {
            !googleLoader && GoogleSignin.signOut() && googleLogin();
          }}
        />
        <Button
          style={[styles.facebookBtn, null, styles.facebookBtnText]}
          title1={<Icon name="facebook" color="white" size={styles.iconSize} />}
          title2="Facebook"
          loading={facebookLoader}
          onPress={() => {
            !facebookLoader && facebookLogin();
          }}
        />
      </View>
      {Platform.OS == 'ios' && (
        <Button
          style={[styles.appleBtn, null, styles.appleBtnText]}
          title1={<Icon name="apple" color="white" size={styles.iconSize} />}
          title2="Apple"
          loading={appleLoader}
          onPress={() => {
            !appleLoader && appleLogin();
          }}
        />
      )}
    </View>
  );
}

export default Social;
