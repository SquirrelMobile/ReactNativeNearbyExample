<p align="center">
  <h2 align="center">ProtoNearby</h2>
</p>
<img src="./screens/screen2.jpg" width="200" />

An example of use **Google Nearby Messages** (https://github.com/mrousavy/react-native-google-nearby-messages) API Wrapper for **React Native**

## Install

Add your generated API Key and Permissions to your AndroidManifest.xml:

```
<application >
    ...
    <meta-data
        android:name="com.google.android.nearby.messages.API_KEY"
        android:value="API_KEY" />
    ...
</application>
```

And in connect function in NearByContext.js

```
 const _connect = async () => {
    await connect({
      apiKey: 'API_KEY',
      discoveryMediums: ['ble'],
      discoveryModes: ['broadcast'],
    });
    console.log('Connected!');
  };
```
