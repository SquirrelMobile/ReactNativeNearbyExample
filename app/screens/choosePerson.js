import React from 'react';
import {Image, Text, TouchableOpacity, View} from 'react-native';
import globalsStyle from '../globals/globalsStyle';

export const ChoosePerson = ({navigation}) => {
  const person1 = {
    id: 1,
    image: require('../../assets/testProfile2.jpeg'),
    name: 'John',
    age: 24,
    profession: 'Dev',
    gender: 'M',
    search: 'F',
  };

  const person2 = {
    id: 2,
    image: require('../../assets/profil.png'),
    name: 'Susan',
    age: 22,
    profession: 'Dev',
    gender: 'F',
    search: 'M',
  };

  const Item = ({item}) => {
    return (
      <View style={{flex: 1}}>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('Profil', item);
          }}>
          <Image
            resizeMode="cover"
            source={item.image}
            style={{width: '100%', height: 200}}
          />
          <Text style={{alignSelf: 'center'}}>{item.name}</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={{flexDirection: 'row', padding: globalsStyle.margin}}>
      <Item item={person1} />
      <Item item={person2} />
    </View>
  );
};
