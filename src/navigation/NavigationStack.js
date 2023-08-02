import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Login from '../screens/Login';
import Home from '../screens/Home';
import React, {useEffect} from 'react';
import createStyles from './styles';
import {useThemeAwareObject} from '../theme/index';
import Welcome from '../screens/Welcome';
import CreateAccount from '../screens/CreateAccount';
import ForgotPassword from '../screens/ForgotPassword';
import EditProfile from '../screens/EditProfile';
import ResetPassword from '../screens/ResetPassword';
import PhoneVerification from '../screens/PhoneVerification';
import Subscription from '../screens/Subscription';
import Checkout from '../screens/Checkout';
import TabNavigator from './TabNavigator';
const LoggedInStack = createNativeStackNavigator();
const AuthStack = createNativeStackNavigator();

import {useSelector} from 'react-redux';
import FilterScreen from '../screens/FilterScreen';
import UserProfile from '../screens/UserProfile';
import Proposals from '../screens/Proposals';
import ActiveJobDetails from '../screens/ActiveJobDetails';
import InProgressJobDetails from '../screens/InProgressJobDetails';
import CompleteJobDetails from '../screens/CompleteJobDetails';
import Inbox from '../screens/Inbox';
import AccountChangePassword from '../screens/AccountChangePassword';
import JobInvite from '../screens/JobInvite';
import ManageCards from '../screens/ManageCards';
import AddNewCard from '../screens/AddNewCard';
import ReviewsScreen from '../screens/ReviewsScreen';
import ViewProfile from '../screens/ViewProfile';
import EditViewProfile from '../screens/EditViewProfile';
import PhoneOtpSent from '../screens/PhoneOtpSent';
import Address from '../screens/Address';
import Notifications from '../screens/Notifications';

const AuthNavigator = () => {
  const styles = useThemeAwareObject(createStyles);
  const welcome = useSelector(state => state.user.welcome);

  return (
    <AuthStack.Navigator
      initialRouteName="AuthStack"
      screenOptions={{
        headerShown: false,
      }}>
      {welcome && (
        <AuthStack.Screen
          name={'Welcome'}
          component={Welcome}
          screenOptions={{
            headerShown: false,
          }}
        />
      )}
      <AuthStack.Screen
        name={'Login'}
        component={Login}
        screenOptions={{
          headerShown: false,
        }}
      />
      <AuthStack.Screen
        name={'CreateAccount'}
        component={CreateAccount}
        screenOptions={{
          headerShown: false,
        }}
      />
      <AuthStack.Screen
        name={'ForgotPassword'}
        component={ForgotPassword}
        screenOptions={{
          headerShown: false,
        }}
      />
      <AuthStack.Screen
        name={'ResetPassword'}
        component={ResetPassword}
        screenOptions={{
          headerShown: false,
        }}
      />
      <AuthStack.Screen
        name={'PhoneVerification'}
        component={PhoneVerification}
        screenOptions={{
          headerShown: false,
        }}
      />
      <AuthStack.Screen
        name={'EditProfile'}
        component={EditProfile}
        screenOptions={{
          headerShown: false,
        }}
      />
      <LoggedInStack.Screen
        name={'Subscription'}
        component={Subscription}
        screenOptions={{
          headerShown: false,
        }}
      />
      <LoggedInStack.Screen
        name={'Checkout'}
        component={Checkout}
        screenOptions={{
          headerShown: false,
        }}
      />
      <LoggedInStack.Screen
        name={'PhoneOtpSent'}
        component={PhoneOtpSent}
        screenOptions={{
          headerShown: false,
        }}
      />
      <LoggedInStack.Screen
        name={'Address'}
        component={Address}
        screenOptions={{
          headerShown: false,
        }}
      />
    </AuthStack.Navigator>
  );
};

const LoggedInNavigator = () => {
  const styles = useThemeAwareObject(createStyles);

  return (
    <LoggedInStack.Navigator
      initialRouteName="LoggedInStack"
      screenOptions={{
        headerShown: false,
      }}>
      <LoggedInStack.Screen
        name={'BottomTabStack'}
        component={TabNavigator}
        screenOptions={{
          headerShown: false,
        }}
      />
      <LoggedInStack.Screen
        name={'FilterScreen'}
        component={FilterScreen}
        screenOptions={{
          headerShown: false,
        }}
      />
      <LoggedInStack.Screen
        name={'UserProfile'}
        component={UserProfile}
        screenOptions={{
          headerShown: false,
        }}
      />
      <LoggedInStack.Screen
        name={'Proposals'}
        component={Proposals}
        screenOptions={{
          headerShown: false,
        }}
      />
      <LoggedInStack.Screen
        name={'ActiveJobDetails'}
        component={ActiveJobDetails}
        screenOptions={{
          headerShown: false,
        }}
      />
      <LoggedInStack.Screen
        name={'InProgressJobDetails'}
        component={InProgressJobDetails}
        screenOptions={{
          headerShown: false,
        }}
      />
      <LoggedInStack.Screen
        name={'CompleteJobDetails'}
        component={CompleteJobDetails}
        screenOptions={{
          headerShown: false,
        }}
      />
      <LoggedInStack.Screen
        name={'Inbox'}
        component={Inbox}
        screenOptions={{
          headerShown: false,
        }}
      />
      <LoggedInStack.Screen
        name={'AccountChangePassword'}
        component={AccountChangePassword}
        screenOptions={{
          headerShown: false,
        }}
      />
      <LoggedInStack.Screen
        name={'JobInvite'}
        component={JobInvite}
        screenOptions={{
          headerShown: false,
        }}
      />
      <LoggedInStack.Screen
        name={'ManageCards'}
        component={ManageCards}
        screenOptions={{
          headerShown: false,
        }}
      />
      <LoggedInStack.Screen
        name={'AddNewCard'}
        component={AddNewCard}
        screenOptions={{
          headerShown: false,
        }}
      />
      <LoggedInStack.Screen
        name={'ReviewsScreen'}
        component={ReviewsScreen}
        screenOptions={{
          headerShown: false,
        }}
      />
      <LoggedInStack.Screen
        name={'ViewProfile'}
        component={ViewProfile}
        screenOptions={{
          headerShown: false,
        }}
      />
      <LoggedInStack.Screen
        name={'EditViewProfile'}
        component={EditViewProfile}
        screenOptions={{
          headerShown: false,
        }}
      />
      <LoggedInStack.Screen
        name={'Address'}
        component={Address}
        screenOptions={{
          headerShown: false,
        }}
      />
      <LoggedInStack.Screen
        name={'Notifications'}
        component={Notifications}
        screenOptions={{
          headerShown: false,
        }}
      />
    </LoggedInStack.Navigator>
  );
};

const App = () => {
  const isLogin = useSelector(state => state.user.isLogin);

  return (
    // <NavigationContainer>
    <>{isLogin ? <LoggedInNavigator /> : <AuthNavigator />}</>
    // </NavigationContainer>
  );
};

export default App;
