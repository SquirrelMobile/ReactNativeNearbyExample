import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {ChoosePerson} from '../screens/choosePerson';
import {Profil} from '../screens/profil';

const Stack = createStackNavigator();
export const MainStack = () => {
  return (
    <Stack.Navigator headerMode="screen" initialRouteName="ChoosePerson">
      <Stack.Screen
        name="ChoosePerson"
        component={ChoosePerson}
        options={{
          title: "Choisir l'avatar",
        }}
      />

      <Stack.Screen
        name="Profil"
        component={Profil}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
};
