import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';

const linking = {
  prefixes: ['https://mychat.com', 'mychat://'],
  config: {
    screens: {
      Home: '',
      Profile: 'profile',
      Settings: 'settings',
    }
  },
};

// Import pages.
import Home from './Scripts/Home.js';
import Profile from './Scripts/Profile.js';
import Settings from './Scripts/Settings.js';

// Create Sidebar.
const Drawer = createDrawerNavigator();

export default function App() {
  const [isLoggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    document.title = 'Home';
    console.log('test');
  })

  return (
    isLoggedIn && (<NavigationContainer linking={linking}>
      <Drawer.Navigator drawerType="permanent">
        <Drawer.Screen name="Home" component={Home} />
        <Drawer.Screen name="Profile" component={Profile} />
        <Drawer.Screen name="Settings" component={Settings} />
      </Drawer.Navigator>
    </NavigationContainer>) || <View><Text>Welcome!</Text></View>
  );
}
