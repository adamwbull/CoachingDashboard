import { StatusBar } from 'expo-status-bar'
import React, { useEffect, useState, useContext } from 'react'
import { ScrollView, StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native'
import { featureBoardLight, colorsLight, innerDrawerLight, btnColors, boxColors } from '../Scripts/Styles.js'
import { featureBoardDark, colorsDark, innerDrawerDark } from '../Scripts/Styles.js'
import { useLinkTo } from '@react-navigation/native'
import LoadingScreen from '../Scripts/LoadingScreen.js'
import ActivityIndicatorView from '../Scripts/ActivityIndicatorView.js'
import { TextInput } from 'react-native-web'
import { set, get, getTTL, ttl } from './Storage.js'
import { Icon, Button, Chip } from 'react-native-elements'
import { confirmAlert } from 'react-confirm-alert' // Import
import 'react-confirm-alert/src/react-confirm-alert.css' // Import css
import { parseSimpleDateText, sqlToJsDate, getFeatureBoardData } from './API.js'
import { Dropdown, Accordion, Radio, Checkbox } from 'semantic-ui-react'
import DatePicker from 'react-date-picker/dist/entry.nostyle'
import './DatePickerClients/DatePicker.css'

import userContext from './Context.js'

export default function FeatureBoard() {

  const linkTo = useLinkTo()
  const user = useContext(userContext)

  const [styles, setStyles] = useState(featureBoardLight)
  const [colors, setColors] = useState(colorsLight)

  // Main stage controls.
  const [showActivityIndicator, setActivityIndicator] = useState(true)
  const [showBar, setShowBar] = useState(false)
  const [showFeatureBoard, setShowFeatureBoard] = useState(false)
  const [showFeatureRequest, setShowFeatureRequest] = useState(false)
  const [showReleaseNotes, setShowReleaseNotes] = useState(false)
  const [showBugReport, setShowBugReport] = useState(false)

  // Main variables.
  const [coach, setCoach] = useState(user)

  // Feature board variables.
  const [featureRequests, setFeatureRequests] = useState([])

  // Submit feature idea variables.
  const [requestTitle, setRequestTitle] = useState('')
  const [requestBody, setRequestBody] = useState('')

  // Release notes variables.
  const [releaseNotes, setReleaseNotes] = useState([])

  // Nav functions.
  const navToFeatureBoard = () => {

  }

  const navToFeatureRequest = () => {
    
  }

  const navToReleaseNotes = () => {
    
  }

  const navToBugReport = () => {
    
  }

  // Main functions.
  const refreshData = async () => {
    var data = await getFeatureBoardData(coach.Token)

    setFeatureRequests(data[0])
    setReleaseNotes(data[1])

  }

  useEffect(() => {
    console.log('Welcome to features.')
    if (coach != null) {
      refreshData(coach.Token)
      setTimeout(() => {
        setActivityIndicator(false)
        setShowBar(true)
        setShowFeatureBoard(true)
      }, 500)
    }
  }, [])

  return (<ScrollView contentContainerStyle={styles.scrollView}>
    <View style={styles.container}>
      <View style={styles.main}>
        <View style={styles.body}>
          {showActivityIndicator && (<ActivityIndicatorView />)}
          
          {showBar && (<>
          <View style={[styles.bodyContainer,{flexDirection:'row'}]}>
            {showFeatureBoard && (<Text style={styles.barSelected}>Feature Board</Text>)
            || (<Text onPress={navToFeatureBoard} style={styles.barUnselected}>Feature Board</Text>)}
            {showReleaseNotes && (<Text style={styles.barSelected}>Release Notes</Text>)
            || (<Text onPress={navToReleaseNotes} style={styles.barUnselected}>Release Notes</Text>)}
            {showFeatureRequest && (<Text style={styles.barSelected}>Request Feature</Text>)
            || (<Text onPress={navToFeatureRequest} style={styles.barUnselected}>Request Feature</Text>)}
            {showBugReport && (<Text style={styles.barSelected}>Report Bug</Text>)
            || (<Text onPress={navToBugReport} style={styles.barUnselected}>Report Bug</Text>)}
          </View>
          </>)}

          {showFeatureBoard && (<View style={styles.bodyContainer}>
            <View style={styles.featureBoardHeader}>
              <View style={styles.featureBoardHeaderText}>
                <Text style={styles.bodyTitle}>Feature Board</Text>
                <Text style={styles.bodyDesc}>Upvote features you would like CoachSync to implement. Features with higher community support will be implemented first.</Text>
              </View>
              <Button
                title='Request Feature'
                buttonStyle={styles.requestFeatureButton}
                containerStyle={styles.requestFeatureButtonContainer}
                titleStyle={{color:'#fff'}}
                onPress={navToFeatureRequest}
              />
            </View>
          </View>)}
        </View>
      </View>
    </View>
  </ScrollView>)

}
