/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import {DefaultTheme} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {Button} from 'react-native-paper';
import globalsStyle from '../globals/globalsStyle';
import {useNearBy} from '../NearByContext';
export const Profil = props => {
  const item = props.route.params;
  const {
    user,
    subscribed,
    setUser,
    startSearching,
    stopSearching,
  } = useNearBy();

  const [enabled, requestResolution] =
    Platform.OS === 'android'
      ? (() => {
          const LocationEnabler = require('react-native-location-enabler')
            .default;
          return LocationEnabler.useLocationSettings(
            {
              needBle: true,
            },
            false,
          );
        })()
      : useState(true);

  useEffect(() => {
    setUser(item);
    if (!enabled && Platform.OS === 'android') {
      requestResolution();
    }
    return async () => {
      //await stopSearching();
    };
  }, []);

  const theme = {
    ...DefaultTheme,
    roundness: 15,
    colors: {
      ...DefaultTheme.colors,
      accent: 'white',
      primary: globalsStyle.colorPrimary,
    },
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="transparent" translucent />
      <Image
        source={item.image}
        style={{
          alignSelf: 'center',
          position: 'absolute',
          height: 400,
          width: '120%',
        }}
        resizeMode="cover"
      />
      <ScrollView>
        <View
          style={{
            marginTop: 350,
            borderTopLeftRadius: 45,
            borderTopRightRadius: 45,
            elevation: 10,
            padding: globalsStyle.margin,
            backgroundColor: 'white',
            flex: 1,
          }}>
          <View style={{paddingBottom: 100}}>
            <Text style={styles.title}>
              {item.name}, {item.age} ans
            </Text>
            <Text style={styles.subtitle}>{item.profession}</Text>
            <Text style={styles.instructions}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla
              volutpat, turpis ut venenatis euismod, lorem ipsum ullamcorper
              nunc, eu faucibus enim erat a arcu. Aliquam non tempor tortor, id
              porttitor nisl. Vivamus aliquet sollicitudin mauris, id sodales
              urna dapibus eu. Phasellus eleifend porta nisl, quis sagittis
              metus sodales at. Etiam faucibus, eros ac eleifend placerat, augue
              eros tristique sapien, vitae congue ipsum risus at turpis.
              Praesent nec dignissim diam, et porttitor arcu. Aliquam at massa
              tristique, condimentum purus vel, imperdiet leo. Integer pulvinar
              arcu a consectetur posuere. Integer non porttitor augue. Fusce
              elit est, dictum id dui at, fermentum dignissim risus. Mauris
            </Text>
          </View>
        </View>
      </ScrollView>

      <Button
        onPress={() => {
          if (enabled) {
            (async () => {
              if (subscribed) {
                await stopSearching();
              } else {
                await startSearching();
              }
            })();
          }
        }}
        contentStyle={{
          height: 50,
          width: '100%',
        }}
        mode={subscribed ? 'outlined' : 'contained'}
        theme={theme}
        labelStyle={{
          color: subscribed ? globalsStyle.colorPrimary : 'white',
        }}
        style={[
          {
            zIndex: 20,
            margin: globalsStyle.margin,
            position: 'absolute',
            bottom: 20,
            alignSelf: 'center',
          },
        ]}>
        {subscribed ? 'Stop Recherche' : 'Activer la recherche'}
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  instructions: {
    marginVertical: globalsStyle.margin,
    fontSize: 16,
    fontWeight: '200',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  subtitle: {
    color: '#333333',
    fontSize: 14,
    fontWeight: '200',
  },
});
