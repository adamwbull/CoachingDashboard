import { StatusBar } from 'expo-status-bar'
import React, { useEffect, useState, useContext } from 'react'
import { ScrollView, StyleSheet, Text, View, Animated, Image, TouchableOpacity } from 'react-native'
import { updatePasswordLight, colorsLight, innerDrawerLight, btnColors, boxColors, messageBox } from '../Scripts/Styles.js'
import { forgotPasswordDark, colorsDark, innerDrawerDark, navLogo } from '../Scripts/Styles.js'
import { Link, useLinkTo } from '@react-navigation/native'
import LoadingScreen from '../Scripts/LoadingScreen.js'
import ActivityIndicatorView from '../Scripts/ActivityIndicatorView.js'
import { TextInput } from 'react-native-web'
import { set, get, getTTL, ttl } from './Storage.js'
import { Icon, Button, Chip } from 'react-native-elements'
import { changePasswordRequest, checkUpdatePasswordToken } from './API.js'
import { Popup } from 'semantic-ui-react'
import { useRoute } from '@react-navigation/native';

import userContext from './Context.js'

export default function FeatureBoard() {

  const linkTo = useLinkTo()
  const user = useContext(userContext)

  const [coach, setCoach] = useState(user)

  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')

  const route = useRoute();
  const token = route.params.Token

  const [styles, setStyles] = useState(updatePasswordLight)
  const [colors, setColors] = useState(colorsLight)
  const [opacity, setOpacity] = useState(new Animated.Value(0))
  const [submitButtonDisabled, setSubmitButtonDisabled] = useState(true)
  const [showSuccessBox, setShowSuccessBox] = useState(false)
  const [requiredMessage, setRequiredMessage] = useState('Ensure password follows requirements.')

  const [showActivityIndicator, setShowActivityIndicator] = useState(true)
  const [showForm, setShowForm] = useState(false)

  // Update password functions.
  const validatePass = (p) => {
    var ret = true
    // Check length, uppercase, and special.
    var containsSpecial = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
    var doesntContainUppercase = (p === p.toLowerCase);
    if (p.length < 9 || !containsSpecial.test(p) || doesntContainUppercase) {
      ret = false
    }
    return ret
  }

  const validateInput = (text, type) => {

    // Save to var.
    var other = false
    var otherPass = ''
    if (type == 0) {
      setPassword(text)
      other = validatePass(passwordConfirm)
      otherPass = passwordConfirm
    } else {
      setPasswordConfirm(text)
      other = validatePass(password)
      otherPass = password
    }

    // Validation checks.
    if (validatePass(text) && other) {
      console.log('')
      if (text === otherPass) {
        setSubmitButtonDisabled(false)
      } else {
        setRequiredMessage('Passwords must match.')
        setSubmitButtonDisabled(true)
      }
    } else {
      setRequiredMessage('Ensure password follows requirements.')
      setSubmitButtonDisabled(true)
    }
    setShowSuccessBox(false)

  }

  const submitInput = async () => {
    setSubmitButtonDisabled(true)
    setShowForm(false)
    setShowActivityIndicator(true)
    var post = await changePasswordRequest(password, token)
    setShowActivityIndicator(false)
    setShowForm(true)
    setShowSuccessBox(true)
    setPassword('')
    setPasswordConfirm('')
  }

  // Main loading functions.
  const onLoad = () => {
    Animated.timing(opacity, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  };

  const checkToken = async () => {
    var check = await checkUpdatePasswordToken(token)
    setShowActivityIndicator(false)
    if (check) {
      setShowForm(true)
    }
  }

  useEffect(() => {
    checkToken()
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
      <Text style={styles.confirmBoxText}>Success! Your password has been updated.</Text>
    </View>)}

    {showActivityIndicator && (<ActivityIndicatorView />) || (<>
      {showForm && (<View style={styles.bodyContainer}>
        <Icon name='lock-closed' size={50} type='ionicon' color={styles.mainTextColor}/>
        <Text style={styles.bodyTitle}>Update Password</Text>
        <Text style={styles.bodyDesc}>Enter something memorable and secure:{"\n"}9+ chars, one uppercase, one special character.</Text>
        <View style={styles.form}>
          <Text style={styles.inputLabel}>New Password</Text>
          <TextInput
            style={[styles.inputStyle,{marginBottom:0}]}
            value={password}
            secureTextEntry={true}
            placeholder='Enter password...'
            onChangeText={(text) => validateInput(text, 0)}
          />
          <Text style={styles.inputLabel}>Confirm Password</Text>
          <TextInput
            style={styles.inputStyle}
            value={passwordConfirm}
            secureTextEntry={true}
            placeholder='Confirm password...'
            onChangeText={(text) => validateInput(text, 1)}
          />
          {submitButtonDisabled && (<Popup 
            position='bottom center'
            wide='very'
            content={requiredMessage}
            trigger={<Button
              title='Submit'
              buttonStyle={styles.forgotPasswordButton}
              containerStyle={styles.forgotPasswordButtonContainer}
              titleStyle={{color:'#fff'}}
              onPress={submitInput}
              disabled={submitButtonDisabled}
            />}
          />) ||
          (<Button
            title='Submit'
            buttonStyle={styles.forgotPasswordButton}
            containerStyle={styles.forgotPasswordButtonContainer}
            titleStyle={{color:'#fff'}}
            onPress={submitInput}
            disabled={submitButtonDisabled}
          />)}
        </View>
      </View>) || (<View style={styles.bodyContainer}>
        <Text style={styles.bodyTitle}>Link Expired</Text>
        <Text style={[styles.bodyDesc,{fontSize:18}]}>This link is expired or invalid.</Text>
        <Text style={[styles.bodyDesc,{fontSize:18,marginTop:5,marginBottom:10}]}>Request another reset attempt on the <Link to='/forgot-password' style={styles.link}>Forgot Password</Link> page.</Text>
      </View>)}
    </>)}
    
  </ScrollView>)

}
