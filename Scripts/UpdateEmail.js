import { StatusBar } from 'expo-status-bar'
import React, { useEffect, useState, useContext } from 'react'
import { ScrollView, StyleSheet, Text, View, Animated, Image, TouchableOpacity } from 'react-native'
import { updateEmailLight, colorsLight, innerDrawerLight, btnColors, boxColors, messageBox } from '../Scripts/Styles.js'
import { forgotPasswordDark, colorsDark, innerDrawerDark, navLogo } from '../Scripts/Styles.js'
import { Link, useLinkTo } from '@react-navigation/native'
import LoadingScreen from '../Scripts/LoadingScreen.js'
import ActivityIndicatorView from '../Scripts/ActivityIndicatorView.js'
import { TextInput } from 'react-native-web'
import { set, get, getTTL, ttl } from './Storage.js'
import { Icon, Button, Chip } from 'react-native-elements'
import { changeEmailRequest, checkUpdateEmailToken } from './API.js'
import { Popup } from 'semantic-ui-react'
import { useRoute } from '@react-navigation/native';

import userContext from './Context.js'

export default function UpdateEmail() {

  const linkTo = useLinkTo()
  const user = useContext(userContext)

  const [coach, setCoach] = useState(user)

  const [email, setEmail] = useState('')

  const route = useRoute();
  const token = route.params.Token

  const [styles, setStyles] = useState(updateEmailLight)
  const [colors, setColors] = useState(colorsLight)
  const [opacity, setOpacity] = useState(new Animated.Value(0))
  const [submitButtonDisabled, setSubmitButtonDisabled] = useState(true)
  const [showSuccessBox, setShowSuccessBox] = useState(false)
  const [requiredMessage, setRequiredMessage] = useState('Ensure password follows requirements.')

  const [showActivityIndicator, setShowActivityIndicator] = useState(true)
  const [showForm, setShowForm] = useState(false)

  // Update password functions.
  function validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

  const validateInput = (text) => {

    setEmail(text)

    if (validateEmail(text)) {
      setSubmitButtonDisabled(false)
    } else {
      setRequiredMessage('Provide a valid email.')
      setSubmitButtonDisabled(true)
    }

    setShowSuccessBox(false)

  }

  const submitInput = async () => {
    setSubmitButtonDisabled(true)
    setShowForm(false)
    setShowActivityIndicator(true)
    var post = await changeEmailRequest(email, token)
    setShowActivityIndicator(false)
    setShowSuccessBox(true)
    var c = JSON.parse(JSON.stringify(coach))
    c.Email = email
    set('Coach',c,ttl)
    setEmail('')
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
    var check = await checkUpdateEmailToken(token)
    setShowActivityIndicator(false)
    if (check) {
      setShowForm(true)
    }
  }

  useEffect(() => {
    checkToken()
    console.log('Welcome to update email.')
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
      <Text style={styles.confirmBoxText}>Success! Your email has been updated.</Text>
    </View>)}

    {showActivityIndicator && (<ActivityIndicatorView />) || (<>
      {showForm && (<View style={styles.bodyContainer}>
        <Icon name='lock-closed' size={50} type='ionicon' color={styles.mainTextColor}/>
        <Text style={styles.bodyTitle}>Update Email</Text>
        <Text style={styles.bodyDesc}>Specify a new account email.</Text>
        <View style={styles.form}>
          <Text style={styles.inputLabel}>New Email</Text>
          <TextInput
            style={[styles.inputStyle,{marginBottom:30}]}
            value={email}
            placeholder='Enter email...'
            onChangeText={(text) => validateInput(text)}
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
        <Text style={[styles.bodyDesc,{fontSize:18,marginTop:5,marginBottom:10}]}>Request another reset attempt on the <Link to='/account' style={styles.link}>Account</Link> page.</Text>
      </View>)}
    </>)}
    
  </ScrollView>)

}
