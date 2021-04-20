import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState, useCallback } from 'react';
import { Linking, Animated, Image, StyleSheet, Text, View } from 'react-native';
import { useLinkTo, Link } from '@react-navigation/native';
import { set, get, getTTL, ttl } from '../Scripts/Storage.js';
import { welcomeLight, logoLight, navLogo, colorsLight } from '../Scripts/Styles.js';
import { welcomeDark, logoDark, colorsDark } from '../Scripts/StylesDark.js';
import { Button } from 'react-native-elements';
import { TextInput } from 'react-native-web';

export default function Welcome() {
  const linkTo = useLinkTo();
  const [refreshing, setRefreshing] = useState(true);
  const [welcome, setStyle] = useState(welcomeLight);
  const [colors, setColors] = useState(colorsLight);

  const onLayout = (event) => {
    const { width } = event.nativeEvent.layout;
    if (width < 900) {
      setFeaturesStyle({flex:'hidden'})
    } else {
      setFeaturesStyle({});
    }
  };

  useEffect(() => {
    document.title = 'Welcome - CoachSync';
    const r = get('Coach')
    if (r !== null) {
      linkTo('/overview')
    }
  });

  const onLoad = () => {
    Animated.timing(opacity, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  };

  return (<View style={welcome.container} onLayout={onLayout}>
  </View>);
}
