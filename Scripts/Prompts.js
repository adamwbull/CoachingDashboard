import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { homeLight, colorsLight } from '../Scripts/Styles.js';
import { homeDark, colorsDark } from '../Scripts/Styles.js';
import { useLinkTo } from '@react-navigation/native';
import LoadingScreen from '../Scripts/LoadingScreen.js';
import { Helmet } from "react-helmet";

export default function Prompts() {
  const linkTo = useLinkTo();
  const [refreshing, setRefreshing] = useState(true);
  const [styles, setStyles] = useState(homeLight);

  useEffect(async () => {
    document.title = 'Home';
  })

  return (<ScrollView>
    <Helmet>
        <meta charSet="utf-8" />
        <title>Home - CoachSync</title>
    </Helmet>
    <View style={styles.container}>
      <Text style={styles.h1}>Home</Text>
    </View>
  </ScrollView>)

}
