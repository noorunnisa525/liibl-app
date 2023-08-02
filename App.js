import {NavigationContainer} from '@react-navigation/native';
import React, {useEffect} from 'react';
import {LogBox, Platform} from 'react-native';
import GlobalFont from 'react-native-global-font';
import OneSignal from 'react-native-onesignal';
import SplashScreen from 'react-native-splash-screen';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import RootNavigator from './src/navigation/index';
import {persistor, store} from './src/redux/store';

function App() {
  useEffect(() => {
    OneSignal.setAppId('bd01b444-c3b4-4785-8d55-b03395730ba7');

    if (Platform.OS === 'ios') {
      OneSignal.promptForPushNotificationsWithUserResponse(response => {
        console.log('Prompt response:', response);
      });
    }

    OneSignal.setNotificationWillShowInForegroundHandler(
      notificationReceivedEvent => {
        let notification = notificationReceivedEvent.getNotification();
        notificationReceivedEvent.complete(null);
      },
    );
  }, []);

  useEffect(() => {
    let fontName = 'SofiaPro';
    GlobalFont.applyGlobal(fontName);

    setTimeout(() => {
      SplashScreen.hide();
    }, 3000);
  });

  LogBox.ignoreAllLogs();

  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <NavigationContainer>
          <RootNavigator />
        </NavigationContainer>
      </PersistGate>
    </Provider>
  );
}

export default App;
