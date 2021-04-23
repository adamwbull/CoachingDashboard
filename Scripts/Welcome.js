import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState, useCallback } from 'react';
import { Linking, Animated, Image, StyleSheet, Text, View } from 'react-native';
import { welcomeLight, logoLight, navLogo, colorsLight, messageBox, bold } from '../Scripts/Styles.js';
import { welcomeDark, logoDark, colorsDark } from '../Scripts/StylesDark.js';
import { Button, Icon } from 'react-native-elements';
import { useLinkTo, Link } from '@react-navigation/native';
import { TextInput } from 'react-native-web';
import { set, get, getTTL, ttl } from '../Scripts/Storage.js';
import { loginCheck, verifyCaptcha } from '../Scripts/API.js';
import Recaptcha from 'react-grecaptcha';
import { Helmet } from "react-helmet";

export default function Welcome() {
  const linkTo = useLinkTo();
  const [refreshing, setRefreshing] = useState(true);
  const [welcome, setStyle] = useState(welcomeLight);
  const [colors, setColors] = useState(colorsLight);
  const [opacity, setOpacity] = useState(new Animated.Value(0));
  const [featuresStyle, setFeaturesStyle] = useState({});
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorText, setErrorText] = useState(false);
  const [attemptsLeft, setAttemptsLeft] = useState(get('LoginAttempts'));
  const [showCaptcha, setShowCaptcha] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(false)
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
    console.log(get('LoginAttempts'))
    if (r !== null) {
      if (r.RegistrationCompleted == 0) {
        linkTo('/sign-up')
      } else {
        linkTo('/overview')
      }
    }
  }, []);

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
        if (attempts == null) {
          set('LoginAttempts', 10, ttl)
          setAttemptsLeft(10)
          setErrorText('Sorry, that password wasn\'t right.')
        } else if (attempts > 1) {
          attempts = attempts - 1;
          set('LoginAttempts', attempts, ttl)
          setAttemptsLeft(attempts)
          setShowCaptcha(false)
          setShowCaptcha(true)
          setButtonDisabled(true)
          setErrorText('Sorry, that password wasn\'t right.')
        } else if (attempts == 1) {
          attempts = attempts - 1;
          set('LoginAttempts', 0, 1800)
          setAttemptsLeft(0)
          set('LoginLocked', true, 1800)
          var errorText = `Too many failed attempts. ${'\n'}Please try again in ` + parseInt(getTTL('LoginLocked')/60) + ` mins.`;
          setErrorText(errorText)
        } else {
          setErrorText('Sorry, that password wasn\'t right.')
        }

      } else {
        set('Coach', success, ttl)
        linkTo('/overview')
      }
    } else {
      var errorText = `Too many failed attempts. ${'\n'}Please try again in ` + parseInt(getTTL('LoginLocked')/60) + ` mins.`;
      setErrorText(errorText)
    }
  }

  const verifyCallback = async (response) => {
    console.log(response)
    var check = verifyCaptcha(response);
    if (check) {
      setButtonDisabled(false)
    } else {
      setErrorText('There was an error with the captcha. Please refresh your browser.')
    }
  };

  const expiredCallback = () => { console.log('captcha expired') };

  return (<View style={welcome.container} onLayout={onLayout}>
    <Helmet>
        <meta charSet="utf-8" />
        <title>Welcome - CoachSync</title>
    </Helmet>
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
        <Text style={welcome.subtitle}>New to CoachSync? <Link to='/sign-up' style={welcome.link}>Sign up here</Link>!</Text>
        {errorText && (<View style={messageBox.errorBox}>
            <View style={messageBox.icon}><Icon name='close-circle-outline' size={30} type='ionicon' color={colorsLight.darkGray}/></View>
            <Text style={messageBox.text}>{errorText} We can help you <Link to='/forgot-password' style={welcome.linkBlend}>recover your password</Link>.
            {attemptsLeft !== null && attemptsLeft > 0 && attemptsLeft < 10 && (<View>{"\n"}{"\n"}<Text style={[messageBox.text]}>For security reasons, after <Text style={bold}>{attemptsLeft}</Text> more failed login attempts, you'll have to wait <Text style={bold}>30 minutes</Text> before trying again.</Text></View>)}
            </Text>
          </View>) || (<View></View>)}
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
        {showCaptcha && (<Recaptcha
          sitekey='6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI'
          callback={verifyCallback}
          expiredCallback={expiredCallback}
        />)}
        <Button
        title='Log In'
        disabled={buttonDisabled}
        buttonStyle={welcome.submitButton}
        containerStyle={welcome.submitButtonContainer}
        onPress={onSubmit}/>
      </View>

    </View>
    <View style={[welcome.features,featuresStyle]}>
    </View>
  </View>);
}
