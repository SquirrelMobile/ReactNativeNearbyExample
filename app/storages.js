import AsyncStorage from '@react-native-async-storage/async-storage';

export const store = async (key, value) => {
  try {
    return await AsyncStorage.setItem(key, value);
  } catch (e) {
    return null;
  }
};

export const get = async key => {
  try {
    const value = await AsyncStorage.getItem(key);
    if (value !== null) {
      return value;
    } else {
      return null;
    }
  } catch (e) {
    return null;
  }
};

export const addUserBle = async user => {
  var value = null;
  var obj = null;
  try {
    value = await AsyncStorage.getItem('usersBle');
    obj = JSON.parse(value);
  } catch (e) {}

  if (obj) {
    obj = obj.filter(e => {
      return e.id !== user.id;
    });
  }

  var newTab = obj ? [...obj, user] : [user];
  await store('usersBle', JSON.stringify(newTab));
};

export const findUserBle = async user => {
  let users = await get('usersBle');
  if (users) {
    let obj = JSON.parse(users);
    let finded = obj.find(f => {
      return f.id === user.id;
    });

    return obj.find(f => {
      return f.id === user.id;
    });
  } else {
    return null;
  }
};
