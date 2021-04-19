import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { home } from '../Scripts/Styles.js';

export default class Settings extends React.Component {
  render() {
    return (<View style={home.container}>
      <Text style={home.h1}>Ayy lmao Settings</Text>
    </View>)
  }
}
