/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import PushNotificationIOS from '@react-native-community/push-notification-ios';
import {NavigationContainer} from '@react-navigation/native';
import React from 'react';
import {Alert} from 'react-native';
import PushNotification from 'react-native-push-notification';

import {SafeAreaProvider} from 'react-native-safe-area-context';
import {MainStack} from './app/navigation/navigation';
import {NearByContext, NearByProvider} from './app/NearByContext';

export default function App() {
  PushNotification.configure({
    onNotification: function (notification) {
      console.log('NOTIFICATION:', notification);
      if (notification.userInteraction) {
        Alert.alert('user', JSON.stringify(notification.data), null, {
          cancelable: false,
        });
      }
      notification.finish(PushNotificationIOS.FetchResult.NoData);
    },

    permissions: {
      alert: true,
      badge: true,
      sound: true,
    },
    requestPermissions: Platform.OS === 'ios',
    popInitialNotification: true,
  });
  return (
    <NavigationContainer>
      <SafeAreaProvider>
        <NearByProvider>
          <MainStack />
        </NearByProvider>
      </SafeAreaProvider>
    </NavigationContainer>
  );
}
