import { StatusBar } from 'expo-status-bar'
import React, { useEffect, useState, useContext } from 'react'
import { ScrollView, StyleSheet, Text, View, Animated, Image, TouchableOpacity } from 'react-native'
import { forgotPasswordLight, colorsLight, innerDrawerLight, btnColors, boxColors, messageBox } from '../Scripts/Styles.js'
import { forgotPasswordDark, colorsDark, innerDrawerDark, navLogo } from '../Scripts/Styles.js'
import { Link, useLinkTo } from '@react-navigation/native'
import LoadingScreen from '../Scripts/LoadingScreen.js'
import ActivityIndicatorView from '../Scripts/ActivityIndicatorView.js'
import { TextInput } from 'react-native-web'
import { set, get, getTTL, ttl } from './Storage.js'
import { Icon, Button, Chip } from 'react-native-elements'
import { captchaKey, forgotPasswordRequest, verifyCaptcha } from './API.js'
import { Popup } from 'semantic-ui-react'
import Recaptcha from 'react-grecaptcha';

import userContext from './Context.js'

export default function FeatureBoard() {

  const linkTo = useLinkTo()
  const user = useContext(userContext)

  const [coach, setCoach] = useState(user)
  const [styles, setStyles] = useState(forgotPasswordLight)
  const [colors, setColors] = useState(colorsLight)
  const [opacity, setOpacity] = useState(new Animated.Value(0))
  const [email, setEmail] = useState('')
  const [submitButtonDisabled, setSubmitButtonDisabled] = useState(true)
  const [showSuccessBox, setShowSuccessBox] = useState(false)
  const [showCaptcha, setShowCaptcha] = useState(false)

  // Forgot password functions.
  const verifyCallback = async (response) => {
    var check = verifyCaptcha(response);
    if (check) {
      setSubmitButtonDisabled(false)
    } else {
      setErrorText('There was an error with the captcha. Please refresh your window.')
    }
  };

  const expiredCallback = () => { console.log('captcha expired') };

  function validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

  const validateInput = (text) => {
    setEmail(text)
    setShowSuccessBox(false)
    if (validateEmail(text) && showCaptcha == false) {
      setSubmitButtonDisabled(false)
    } else {
      setSubmitButtonDisabled(true)
    }
    if (text.length > 4 && showCaptcha == false) {
      var check = get('ForgotCheck')
      if (check) {
        setShowCaptcha(true)
      }
    }
  }

  const submitInput = async () => {
    setSubmitButtonDisabled(true)
    set('ForgotCheck', true, ttl)
    var post = await forgotPasswordRequest(email)
    window.grecaptcha.reset();
    setShowSuccessBox(true)
    setShowCaptcha(false)
  }

  // Main loading functions.
  const onLoad = () => {
    Animated.timing(opacity, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  };

  useEffect(() => {
    console.log('Welcome to forgot password.')
    if (coach != null) {
      linkTo('/clients')
    }
  }, [])

  return (<ScrollView contentContainerStyle={styles.body}>
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
        styles.logo
      ]}
    />
    {showSuccessBox && (<View style={styles.confirmBox}>
      <Text style={styles.confirmBoxText}>Success! If this email belongs to a registered CoachSync account, you will receive reset instructions shortly.</Text>
    </View>)}
    <View style={styles.bodyContainer}>
      <Icon name='lock-closed' size={50} type='ionicon' color={styles.mainTextColor}/>
      <Text style={styles.bodyTitle}>Forgot Your Password?</Text>
      <Text style={styles.bodyDesc}>No problem! Enter your email and we&apos;ll help you out.</Text>
      <View style={styles.form}>
        <Text style={styles.inputLabel}>Email Address</Text>
        <TextInput
          style={styles.inputStyle}
          value={email}
          placeholder='Enter email...'
          onChangeText={(text) => validateInput(text)}
        />
        <Button
          title='Submit'
          buttonStyle={styles.forgotPasswordButton}
          containerStyle={styles.forgotPasswordButtonContainer}
          titleStyle={{color:'#fff'}}
          onPress={submitInput}
          disabled={submitButtonDisabled}
        />
        <View style={{marginTop:20,marginBottom:-10,alignItems:'center'}}>
          {showCaptcha && (<Recaptcha
            sitekey={captchaKey}
            callback={verifyCallback}
            expiredCallback={expiredCallback}
          />)}
        </View>
        <Text style={[styles.subtitle]}><Link to='/welcome' style={styles.link}>Return to login</Link> or <Link to='/sign-up' style={styles.link}>sign up</Link>.</Text>
      </View>
    </View>
  </ScrollView>)

}
