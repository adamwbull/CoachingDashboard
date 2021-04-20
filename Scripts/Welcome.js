import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState, useCallback } from 'react';
import { Linking, Animated, Image, StyleSheet, Text, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { welcomeLight, logoLight, navLogo, colorsLight } from '../Scripts/Styles.js';
import { Button } from 'react-native-elements';
import { useLinkTo, Link } from '@react-navigation/native';
import { TextInput } from 'react-native-web';

export default function Welcome() {
  const linkTo = useLinkTo();
  const [refreshing, setRefreshing] = useState(true);
  const [welcome, setStyle] = useState(welcomeLight);
  const [colors, setColors] = useState(colorsLight);
  const [opacity, setOpacity] = useState(new Animated.Value(0));
  const [featuresStyle, setFeaturesStyle] = useState({});
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const onLayout = (event) => {
    const { width } = event.nativeEvent.layout;
    if (width < 900) {
      setFeaturesStyle({flex:'hidden'})
    } else {
      setFeaturesStyle({});
    }
  };

  useEffect(() => {
    document.title = 'Welcome';
  });

  const onLoad = () => {
    Animated.timing(opacity, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  };

  const onChangeTextUsername = (text) => {
    setUsername(text);
  }

  const onChangeTextPassword = (text) => {
    setPassword(text);
  }

  return (<View style={welcome.container} onLayout={onLayout}>
    <View style={welcome.login}>
      <View style={welcome.logoContainer}>
        <Animated.Image
          onLoad={onLoad}
          source={navLogo}
          resizeMode="contain"
          style={[
            {
              opacity: opacity,
              transform: [
                {
                  scale: opacity.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.85, 1],
                  })
                },
              ],
            },
            welcome.logo
          ]}
      />
      </View>
      <View style={welcome.form}>
        <Text style={welcome.title}>Log In</Text>
        <Text style={welcome.subtitle}>New to CoachSync? <Text style={welcome.link}>Sign up here!</Text></Text>
        <Text style={welcome.inputLabel}>Username</Text>
        <TextInput
          style={welcome.inputStyle}
          value={username}
          onChangeText={onChangeTextUsername}
        />
        <Text style={welcome.inputLabel}>Password</Text>
        <TextInput
          style={welcome.inputStyle}
          value={password}
          secureTextEntry={true}
          onChangeText={onChangeTextPassword}
        />
        <Button
        title='Log In'
        buttonStyle={welcome.submitButton}
        containerStyle={welcome.submitButtonContainer}
        onPress={() => linkTo('/overview')}/>
      </View>

    </View>
    <View style={[welcome.features,featuresStyle]}>
    </View>
  </View>);
}
