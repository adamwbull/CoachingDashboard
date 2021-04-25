import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { overviewLight, colorsLight } from '../Scripts/Styles.js';
import { overviewDark, colorsDark } from '../Scripts/Styles.js';
import { useLinkTo } from '@react-navigation/native';
import LoadingScreen from '../Scripts/LoadingScreen.js';
import { Helmet } from "react-helmet";

export default function Home() {
  const linkTo = useLinkTo();
  const [refreshing, setRefreshing] = useState(true);
  const [overview, setStyle] = useState(overviewLight);

  useEffect(async () => {
    document.title = 'Home';
  })

  return (
    refreshing &&
    (<View style={overview.container}>
      <Text style={overview.h1}>Home</Text>
    </View>)
    || <LoadingScreen />
  )

}
