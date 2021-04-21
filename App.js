import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { useFonts } from 'expo-font';

const linking = {
  prefixes: ['https://mychat.com', 'mychat://'],
  config: {
    screens: {
      Welcome: 'welcome',
      SignUp: 'sign-up',
      Main: {
        screens: {
          Overview: 'overview',
          Profile: 'profile',
          Settings: 'settings',
        }
      }
    }
  },
};

// Import pages.
import Overview from './Scripts/Overview.js';
import Profile from './Scripts/Profile.js';
import Settings from './Scripts/Settings.js';
import Welcome from './Scripts/Welcome.js';
import SignUp from './Scripts/SignUp.js';

// Create Sidebar.
const Drawer = createDrawerNavigator();

function Main() {
  return (<Drawer.Navigator drawerType="permanent">
    <Drawer.Screen name="Overview" component={Overview} />
    <Drawer.Screen name="Profile" component={Profile} />
    <Drawer.Screen name="Settings" component={Settings} />
  </Drawer.Navigator>)
}

const Stack = createStackNavigator();

export default function App() {
  const [loaded] = useFonts({
    Poppins: require('./assets/fonts/Poppins.ttf'),
    PoppinsSemiBold: require('./assets/fonts/Poppins-SemiBold.ttf'),
    PoppinsBold: require('./assets/fonts/Poppins-Bold.ttf'),
  });

  if (!loaded) {
    return null;
  }

  return (
    <NavigationContainer linking={linking}>
      <Stack.Navigator headerMode='none' initialRouteName='Welcome'>
        <Stack.Screen name="Welcome" component={Welcome} />
        <Stack.Screen name="SignUp" component={SignUp} />
        <Stack.Screen name="Main" component={Main} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
