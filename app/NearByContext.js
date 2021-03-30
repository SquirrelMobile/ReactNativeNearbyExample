import * as React from 'react';
import {
  addOnErrorListener,
  checkBluetoothAvailability,
  checkBluetoothPermission,
  connect,
  publish,
  subscribe,
  unpublish,
  unsubscribe,
} from 'react-native-google-nearby-messages';
import BackgroundService from 'react-native-background-actions';
import PushNotification from 'react-native-push-notification';
import {addUserBle, findUserBle, get} from './storages';
import {BluetoothStatus} from 'react-native-bluetooth-status';

export const NearByContext = React.createContext({
  user: {},
  setUser: () => {},
  subscribed: false,
  checkPermissions: async () => {},
  startSearching: async () => {},
  stopSearching: async () => {},
});

export const NearByProvider = (props, theme) => {
  const [user, setUser] = React.useState({});
  const [subscribed, isSubscribed] = React.useState(false);
  const TIMEOUT_NOTIFICATION = 6000;

  React.useEffect(() => {
    (async () => {
      if (subscribed) {
        await stopSearching();
      }
    })();
  }, [user]);

  React.useEffect(() => {
    isSubscribed(BackgroundService.isRunning());
  }, []);

  const _connect = async () => {
    await connect({
      apiKey: 'API_KEY',
      discoveryMediums: ['ble'],
      discoveryModes: ['broadcast'],
    });
    console.log('Connected!');
  };

  const _publish = async name => {
    console.log(`Publishing "${name}"...`);
    await publish(name);
    console.log(`Published "${name}"!`);
  };

  const _subscribe = async () => {
    await subscribe(
      async m => {
        try {
          let current = JSON.parse(m);
          console.log(`Found: ${JSON.stringify(m)}`);
          let userStored = await findUserBle(current);
          console.log('userStored', userStored);
          if (
            current.gender === user.search &&
            (!userStored || userStored.timestamp < new Date().getTime())
          ) {
            await addUserBle({
              id: current.id,
              timestamp: new Date().getTime() + TIMEOUT_NOTIFICATION,
            });
            if (Platform.OS === 'ios') {
              PushNotification.localNotification({
                title: current.name,
                message: current.name + ' est connecté',
                userInfo: current,
              });
            } else {
              PushNotification.createChannel(
                {
                  channelId: current.name,
                  channelName: current.name,
                  soundName: 'default',
                  importance: 4,
                  vibrate: true,
                },
                created =>
                  PushNotification.localNotification({
                    channelId: current.name,
                    title: current.name,
                    message: current.name + ' est connecté',
                    userInfo: current,
                  }),
              );
            }
          }
        } catch (e) {
          isSubscribed(false);
        }
      },
      m => {
        console.log(`Lost: ${JSON.stringify(m)}`);
      },
    );
    isSubscribed(true);

    console.log('Subscribed!');
  };

  const stopSearching = async () => {
    BackgroundService.stop();
    let uns = await unsubscribe();
    let unp = await unpublish();
    isSubscribed(false);
  };

  const _checkPermissions = async () => {
    const permission = await checkBluetoothPermission();
    const available = await checkBluetoothAvailability();
    return permission && available;
  };

  const startSearching = async () => {
    if (user && user.id) {
      BluetoothStatus.addListener(e => {
        console.log('blestat', e);
        if (!e) {
          stopSearching();
        }
      });
      await BackgroundService.start(
        async taskDataArguments => {
          const {user} = taskDataArguments;
          await new Promise(async resolve => {
            if (BackgroundService.isRunning()) {
              var bool = await _checkPermissions();
              if (bool) {
                BackgroundService.on('expiration', () => {
                  stopSearching();
                });
                addOnErrorListener((kind, message) => {
                  console.log('message', message);
                  if (kind === 'BLUETOOTH_ERROR') {
                    if (message === 'Publish expired!') {
                      (async () => {
                        await _publish(JSON.stringify(user));
                      })();
                    }
                  }
                });
                await _connect();
                await _subscribe();
                await _publish(JSON.stringify(user));
              }
            }
          });
        },
        {
          taskName: 'Recherche',
          taskTitle: "Recherche d'user en cours (" + user.search + ')',
          taskDesc: "L'app utilise actuellement le bluetooth",
          taskIcon: {
            name: 'ic_launcher',
            type: 'mipmap',
          },
          parameters: {
            user: user,
          },
        },
      );
    }
  };

  const defaultTheme = {
    user: user,
    setUser: setUser,
    subscribed: subscribed,
    checkPermissions: _checkPermissions,
    startSearching: startSearching,
    stopSearching: stopSearching,
  };

  return (
    <NearByContext.Provider value={defaultTheme}>
      {props.children}
    </NearByContext.Provider>
  );
};

// Custom hook to get the theme object returns {isDark, colors, setScheme}
export const useNearBy = () => React.useContext(NearByContext);
