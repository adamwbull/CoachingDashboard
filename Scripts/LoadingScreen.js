import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
;
import { loadingScreen } from '../Scripts/Styles.js';

export default function LoadingScreen() {

  return (<View>
    <ActivityIndicator />
  </View>)

}
