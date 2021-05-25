import { StatusBar } from 'expo-status-bar'
import React, { useEffect, useState } from 'react'
import { TouchableOpacity, ScrollView, StyleSheet, Text, View } from 'react-native'
import { accountLight, colorsLight, innerDrawerLight } from '../Scripts/Styles.js'
import { accountDark, colorsDark, innerDrawerDark } from '../Scripts/Styles.js'
import { useLinkTo } from '@react-navigation/native'
import LoadingScreen from '../Scripts/LoadingScreen.js'
import ActivityIndicatorView from '../Scripts/ActivityIndicatorView.js'
import { Icon, Button } from 'react-native-elements'
import { set, get, getTTL, ttl } from './Storage.js'
import { TextInput } from 'react-native-web'
import { loginCheck, updateEmail } from './API.js'

export default function Account() {
  const linkTo = useLinkTo()
  const [refreshing, setRefreshing] = useState(true)
  const [styles, setStyles] = useState(accountLight)

  // Main stage variables.
  const [coach, setCoach] = useState({})
  const [password, setPassword] = useState('')
  const [passwordPromptError, setPasswordPromptError] = useState('')
  const [changeEmailSent, setChangeEmailSent] = useState('')

  // Main stage controls.
  const [showActivityIndicator, setActivityIndicator] = useState(true)
  const [showPasswordPrompt, setPasswordPrompt] = useState(false)
  const [showMain, setMain] = useState(false)

  // User data.
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')

  // Main functions.
  useEffect(() => {
    console.log('Welcome to account.')
    const sCoach = get('Coach')
    if (sCoach != null) {
      setCoach(sCoach)
      setFirstName(sCoach.FirstName)
      setLastName(sCoach.LastName)
      setTimeout(() => {
        setActivityIndicator(false)
        setMain(true) // Should be setPasswordPrompt
      }, 500)
    }
  },[])

  const confirmPasswordPrompt = async () => {
    setPasswordPrompt(false)
    setActivityIndicator(true)
    var test = await loginCheck(coach.Email, password)
    setTimeout(() => {
      setActivityIndicator(false)
      if (test != null) {
        setMain(true)
      } else {
        setPassword('')
        setPasswordPromptError('Incorrect password, please try again.')
        setPasswordPrompt(true)
      }
    }, 500)
  }

  const sendChangeEmail = async () => {
    // Send email.
    var sent = await updateEmail(coach.Id, coach.Token, coach.Email, coach.FirstName)
    if (sent) {
      setChangeEmailSent('An email has been sent to your current email address.')
    } else {
      setChangeEmailSent('There was a problem sending the email. Please try again.')
    }

  }

  return (<ScrollView contentContainerStyle={styles.scrollView}>
    <View style={styles.container}>
      <View style={styles.main}>
        <View style={styles.body}>

          <View style={styles.bodyHeader}>
            <View style={styles.bodyTitleGroup}>
              <Text style={styles.bodyTitle}>Account</Text>
              <Text style={styles.bodyDesc}>Customize your account settings.</Text>
            </View>
          </View>

          {showActivityIndicator && (<ActivityIndicatorView />)}

          {showPasswordPrompt && (<View style={styles.bodyContainer}>
            <Text style={styles.bodySubtitle}>Enter Password</Text>
            <TextInput
              style={styles.inputStyle}
              value={password}
              secureTextEntry={true}
              placeholder='Current Password...'
              onChangeText={(text) => {setPassword(text); setPasswordPromptError('');}}
            />
            <Button
              title='Confirm Password'
              buttonStyle={styles.saveButton}
              containerStyle={styles.saveButtonContainer}
              onPress={confirmPasswordPrompt}
            />
            {passwordPromptError != '' && (<><Text style={styles.passwordPromptError}>{passwordPromptError}</Text></>)}
          </View>)}

          {showMain && (<>
            <View style={styles.bodyContainer}>
              <Text style={styles.bodySubtitle}>Email & Security</Text>
              <Text style={styles.inputHeader}>Email Address</Text>
              <View style={styles.bodyRow}>
                <Text style={[styles.inputStyle,{flex:2,margin:0}]}>{coach.Email}</Text>
                <Button
                  title='Change'
                  buttonStyle={[styles.saveButton,{backgroundColor:coach.PrimaryHighlight}]}
                  containerStyle={[styles.saveButtonContainer,{flex:1,marginLeft:20}]}
                  onPress={sendChangeEmail}
                />
                <Text style={styles.changeEmailSent}>{changeEmailSent}</Text>
              </View>
            </View>
            <View style={styles.bodyContainer}>
              <Text style={styles.bodySubtitle}>Profile</Text>
              <View style={styles.bodyRow}>
                <View style={{flex:2}}>
                  <Text style={styles.inputHeader}>First Name</Text>
                  <TextInput
                  style={[styles.inputStyle,{margin:0}]}
                  value={firstName}
                  onChangeText={(text) => setFirstName(text)}
                  />
                </View>
                <View style={{flex:2,marginLeft:20}}>
                  <Text style={styles.inputHeader}>Last Name</Text>
                  <TextInput
                  style={[styles.inputStyle,{margin:0}]}
                  value={lastName}
                  onChangeText={(text) => setLastName(text)}
                  />
                </View>
                <View style={{flex:2}}></View>
              </View>
            </View>
          </>)}

        </View>
      </View>
    </View>
  </ScrollView>)

}
