import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState, useCallback } from 'react';
import { Linking, Animated, Image, StyleSheet, Text, View } from 'react-native';
import { welcomeLight, logoLight, navLogo, colorsLight } from '../Scripts/Styles.js';
import { welcomeDark, logoDark, colorsDark } from '../Scripts/StylesDark.js';
import { Button } from 'react-native-elements';
import { useLinkTo, Link } from '@react-navigation/native';
import { TextInput } from 'react-native-web';
import { set, get, getTTL, ttl } from '../Scripts/Storage.js';
export default function Welcome() {
  const linkTo = useLinkTo();
  const [refreshing, setRefreshing] = useState(true);
  const [welcome, setStyle] = useState(welcomeLight);
  const [colors, setColors] = useState(colorsLight);
  const [opacity, setOpacity] = useState(new Animated.Value(0));
  const [featuresStyle, setFeaturesStyle] = useState({});
  const [email, setEmail] = useState('');
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

  const onChangeTextEmail = (text) => {
    setErrorText(false)
    setEmail(text)
  }

  const onChangeTextPassword = (text) => {
    setErrorText(false)
    setPassword(text)
  }

  const onSubmit = async () => {
    var loginLocked = get('LoginLocked')
    // Check if already locked or not.
    if (loginLocked == null) {
      const success = await loginCheck(email, password);
      if (success == null) {
        var attempts = get('LoginAttempts')
        attempts = parseInt(attempts)
        if (attempts == null) {
          set('LoginAttempts', 10, ttl)
        } else if (attempts !== 0) {
          attempts = attempts - 1;
          set('LoginAttempts', attempts, ttl)
        } else if (LoginAttempts == 1) {
          attempts = attempts - 1;
          set('LoginAttempts', 0, ttl)
          set('LoginLocked', true, 1800)
        }
        setErrorText('Sorry, that password wasn\'t right.')
      } else {
        set('Coach', success, ttl)
        linkTo('/overview')
      }
    } else {
      var errorText = 'Too many failed attempts. Please try again in ' + parseInt(getTTL('Login')*60) + ' mins.';
      setErrorText(errorText)
    }
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
        {}
        <Text style={welcome.inputLabel}>Email</Text>
        <TextInput
          style={welcome.inputStyle}
          value={email}
          onChangeText={onChangeTextEmail}
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
        onPress={() => onSubmit}/>
      </View>

    </View>
    <View style={[welcome.features,featuresStyle]}>
    </View>
  </View>);
}
