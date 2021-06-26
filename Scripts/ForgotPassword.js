import { StatusBar } from 'expo-status-bar'
import React, { useEffect, useState, useContext } from 'react'
import { ScrollView, StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native'
import { forgotPasswordLight, colorsLight, innerDrawerLight, btnColors, boxColors, messageBox } from '../Scripts/Styles.js'
import { forgotPasswordDark, colorsDark, innerDrawerDark } from '../Scripts/Styles.js'
import { Link, useLinkTo } from '@react-navigation/native'
import LoadingScreen from '../Scripts/LoadingScreen.js'
import ActivityIndicatorView from '../Scripts/ActivityIndicatorView.js'
import { TextInput } from 'react-native-web'
import { set, get, getTTL, ttl } from './Storage.js'
import { Icon, Button, Chip } from 'react-native-elements'
import { forgotPasswordRequest } from './API.js'
import { Popup } from 'semantic-ui-react'

import userContext from './Context.js'

export default function FeatureBoard() {

  const linkTo = useLinkTo()
  const user = useContext(userContext)

  const [coach, setCoach] = useState(user)
  const [styles, setStyles] = useState(forgotPasswordLight)
  const [colors, setColors] = useState(colorsLight)
  
  const [email, setEmail] = useState('')
  const [submitButtonDisabled, setSubmitButtonDisabled] = useState(true)
  const [showSuccessBox, setShowSuccessBox] = useState(false)

  function validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

  const validateInput = (text) => {
    setEmail(text)
    if (validateEmail(text)) {
      setSubmitButtonDisabled(false)
    } else {
      setSubmitButtonDisabled(true)
    }
  }

  const submitInput = async () => {
    var post = ''
    if (post) {

    }
  }
  useEffect(() => {
    console.log('Welcome to forgot password.')
    if (coach != null) {
      linkTo('/clients')
    }
  }, [])

  return (<View style={styles.body}>
    {showSuccessBox && (<View style={styles.confirmBox}>
      <Text style={styles.confirmBoxText}>Success! If this email belongs to a registered CoachSync account, you will receive reset instructions shortly.</Text>
    </View>)}
    <View style={styles.bodyContainer}>
      <Text style={styles.bodyTitle}>Forgot Your Password?</Text>
      <Text style={styles.bodyDesc}>No problem! Enter your email and we&apos;ll get you back into your account.</Text>
      <View style={{marginLeft:20,marginRight:20}}>
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
        <Text style={[styles.subtitle]}><Link to='/welcome' style={styles.link}>Return to login</Link> or <Link to='/sign-up' style={styles.link}>sign up</Link>.</Text>
      </View>
    </View>
  </View>)

}
