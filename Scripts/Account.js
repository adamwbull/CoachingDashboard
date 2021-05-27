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
import { loginCheck, updateEmail, updateCoachInfo } from './API.js'

export default function Account() {
  const linkTo = useLinkTo()
  const [refreshing, setRefreshing] = useState(true)
  const [styles, setStyles] = useState(accountLight)
  const [colors, setColors] = useState(colorsLight)
  // Main stage variables.
  const [coach, setCoach] = useState({})
  const [password, setPassword] = useState('')
  const [passwordPromptError, setPasswordPromptError] = useState('')
  const [changeEmailSent, setChangeEmailSent] = useState('')

  // Main stage controls.
  const [showActivityIndicator, setActivityIndicator] = useState(true)
  const [showPasswordPrompt, setPasswordPrompt] = useState(false)
  const [showMain, setMain] = useState(false)
  const [changeEmailDisabled, setChangeEmailDisabled] = useState(false)
  const [infoSavedText, setInfoSavedText] = useState('')

  // User data.
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [addressLine1, setAddressLine1] = useState('')
  const [addressLine2, setAddressLine2] = useState('')
  const [city, setCity] = useState('')
  const [state, setState] = useState('')
  const [country, setCountry] = useState('')
  const [zip, setZIP] = useState('')
  const [pronouns, setPronouns] = useState('')

  // Main functions.
  useEffect(() => {
    console.log('Welcome to account.')
    const sCoach = get('Coach')
    if (sCoach != null) {
      setCoach(sCoach)
      setFirstName(sCoach.FirstName)
      setLastName(sCoach.LastName)
      setAddressLine1(sCoach.AddressLine1)
      setAddressLine2(sCoach.AddressLine2)
      setCity(sCoach.City)
      setState(sCoach.State)
      setCountry(sCoach.Country)
      setZIP(sCoach.ZIP)
      setPronouns(sCoach.Pronouns)
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
    setChangeEmailDisabled(true)
  }

  const saveZIP = (t) => {
    if (!isNaN(t) && t.length < 6) {
      setZIP(t)
    }
  }

  const saveInfo = async () => {
    var sent = await updateCoachInfo(coach.Id, coach.Token, firstName, lastName, pronouns, addressLine1, addressLine2, city, state, country, zip);
    var c = JSON.parse(JSON.stringify(coach))
    c.FIrstName = firstName
    c.LastName = lastName
    c.Pronouns = pronouns
    c.AddressLine1 = addressLine1
    c.AddressLine2 = addressLine2
    c.City = city
    c.State = state
    c.Country = country
    c.ZIP = zip
    set('Coach',c,ttl)
    setCoach(c)
    if (sent) {
      setInfoSavedText('Information updated!')
      setTimeout(() => {
        setInfoSavedText('')
      }, 1000)
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
                  disabled={changeEmailDisabled}
                />
                <Text style={styles.changeEmailSent}>{changeEmailSent}</Text>
              </View>
            </View>
            <View style={styles.bodyContainer}>
              <View style={styles.bodyRow}>
                <Text style={[styles.bodySubtitle,{flex:2}]}>Personal Info</Text>
                <Text style={[styles.bodySubtitle,{flex:2,paddingLeft:20,paddingRight:20}]}>Business Address</Text>
                <View style={{flex:2}}></View>
              </View>
              <View style={styles.bodyRow}>
                <View style={{flex:2}}>
                  <Text style={styles.inputHeader}>First Name</Text>
                  <TextInput
                  style={[styles.inputStyle,{marginBottom:10}]}
                  value={firstName}
                  onChangeText={(text) => { if (text.length < 50) { setFirstName(text) } }}
                  />
                </View>
                <View style={{flex:2,paddingLeft:20,paddingRight:20}}>
                  <Text style={styles.inputHeader}>Address Line 1</Text>
                  <TextInput
                  style={[styles.inputStyle,{marginBottom:10}]}
                  value={addressLine1}
                  onChangeText={(text) => { if (text.length < 50) { setAddressLine1(text) } }}
                  />
                </View>
                <View style={{flex:2}}>
                  <Text style={styles.inputHeader}>Address Line 2</Text>
                  <TextInput
                  style={[styles.inputStyle,{marginBottom:10}]}
                  value={addressLine2}
                  onChangeText={(text) => { if (text.length < 50) { setAddressLine2(text) } }}
                  />
                </View>
              </View>
              <View style={styles.bodyRow}>
                <View style={{flex:2}}>
                  <Text style={styles.inputHeader}>Last Name</Text>
                  <TextInput
                  style={[styles.inputStyle,{marginBottom:10}]}
                  value={lastName}
                  onChangeText={(text) => { if (text.length < 50) { setLastName(text) } }}
                  />
                </View>
                <View style={{flex:2,paddingLeft:20,paddingRight:20}}>
                  <Text style={styles.inputHeader}>City</Text>
                  <TextInput
                  style={[styles.inputStyle,{marginBottom:10}]}
                  value={city}
                  onChangeText={(text) => { if (text.length < 50) { setCity(text) } }}
                  />
                </View>
                <View style={{flex:2}}>
                  <Text style={styles.inputHeader}>State</Text>
                  <TextInput
                  style={[styles.inputStyle,{marginBottom:10}]}
                  value={state}
                  onChangeText={(text) => { if (text.length < 50) { setState(text) } }}
                  />
                </View>
              </View>
              <View style={styles.bodyRow}>
                <View style={{flex:2}}>
                  <Text style={styles.inputHeader}>Pronouns</Text>
                  <TextInput
                  style={[styles.inputStyle,{marginBottom:10}]}
                  value={pronouns}
                  onChangeText={(text) => { if (text.length < 50) { setPronouns(text) } }}
                  />
                </View>
                <View style={{flex:2,paddingLeft:20,paddingRight:20}}>
                  <Text style={styles.inputHeader}>Country</Text>
                  <TextInput
                  style={[styles.inputStyle,{marginBottom:10}]}
                  value={country}
                  onChangeText={(text) => { if (text.length < 50) { setCountry(text) } }}
                  />
                </View>
                <View style={{flex:2}}>
                  <Text style={styles.inputHeader}>ZIP</Text>
                  <TextInput
                  style={[styles.inputStyle,{marginBottom:10}]}
                  value={zip}
                  onChangeText={(text) => saveZIP(text)}
                  />
                </View>
              </View>
              <View style={styles.bodyRow}>
                <View style={{flex:3}}></View>
                <View style={{flex:2}}>
                  <Text style={[styles.changeEmailSent,{textAlign:'right'}]}>{infoSavedText}</Text>
                </View>
                <Button
                  title='Save Info'
                  buttonStyle={[styles.saveButton,{backgroundColor:coach.PrimaryHighlight}]}
                  containerStyle={[styles.saveButtonContainer,{flex:1,marginTop:20}]}
                  onPress={saveInfo}
                />
              </View>
            </View>
          </>)}

        </View>
      </View>
    </View>
  </ScrollView>)

}
