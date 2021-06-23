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
  const [loadingNum, setLoadingNum] = useState(-1)
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
  const [requestText, setRequestText] = useState('')

  // Release notes variables.
  const [releaseNotes, setReleaseNotes] = useState([])

  // Feature request functions.
  const submitRequestFeature = () => {
    //
  }

  // Nav functions.
  const navToFeatureBoard = () => {
    setShowReleaseNotes(false)
    setShowFeatureRequest(false)
    setShowBugReport(false)
    setLoadingNum(0)
    setActivityIndicator(true)
    setTimeout(() => {
      setActivityIndicator(false)
      setShowFeatureBoard(true)
      setLoadingNum(-1)
    }, 200)
  }

  const navToFeatureRequest = () => {
    setShowReleaseNotes(false)
    setShowFeatureBoard(false)
    setShowBugReport(false)
    setLoadingNum(2)
    setActivityIndicator(true)
    setTimeout(() => {
      setActivityIndicator(false)
      setShowFeatureRequest(true)
      setLoadingNum(-1)
    }, 200)
  }

  const navToReleaseNotes = () => {
    setShowFeatureBoard(false)
    setShowFeatureRequest(false)
    setShowBugReport(false)
    setLoadingNum(1)
    setActivityIndicator(true)
    setTimeout(() => {
      setActivityIndicator(false)
      setShowReleaseNotes(true)
      setLoadingNum(-1)
    }, 200)
  }

  const navToBugReport = () => {
    setShowReleaseNotes(false)
    setShowFeatureRequest(false)
    setShowFeatureBoard(false)
    setLoadingNum(3)
    setActivityIndicator(true)
    setTimeout(() => {
      setActivityIndicator(false)
      setShowBugReport(true)
      setLoadingNum(-1)
    }, 200)
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
          
          {showBar && (<>
          <View style={[styles.bodyContainer,{flexDirection:'row'}]}>
            {(showFeatureBoard || loadingNum == 0) && (<Text style={styles.barSelected}>Feature Board</Text>)
            || (<Text onPress={navToFeatureBoard} style={styles.barUnselected}>Feature Board</Text>)}
            {(showReleaseNotes || loadingNum == 1) && (<Text style={styles.barSelected}>Release Notes</Text>)
            || (<Text onPress={navToReleaseNotes} style={styles.barUnselected}>Release Notes</Text>)}
            {(showFeatureRequest || loadingNum == 2) && (<Text style={styles.barSelected}>Request Feature</Text>)
            || (<Text onPress={navToFeatureRequest} style={styles.barUnselected}>Request Feature</Text>)}
            {(showBugReport || loadingNum == 3) && (<Text style={styles.barSelected}>Report Bug</Text>)
            || (<Text onPress={navToBugReport} style={styles.barUnselected}>Report Bug</Text>)}
          </View>
          </>)}

          {showActivityIndicator && (<ActivityIndicatorView />)}

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
            {featureRequests.length == 0 && (<View>
              <Text style={styles.featureBoardNone}>No feature requests yet.</Text>
            </View>) || (<>
              {featureRequests.map((feature, index) => {
                //
                return (<View key={'featureReq_'+index}>
                  <Text>{feature.Title}</Text>
                  <Text>{feature.Text}</Text>
                </View>)
              })}
            </>)}
          </View>)}

          {showFeatureRequest && (<View style={[styles.bodyContainer,{width:'70%',marginLeft:'15%'}]}>
            <Text style={styles.bodyTitle}>Request Feature</Text>
            <Text style={styles.bodyDesc}>Submit an idea for a potential CoachSync feature to appear on the Board. We appreciate your input!</Text>
            <View style={styles.featureRequestForm}>
              <Text style={styles.inputLabel}>Title</Text>
              <TextInput
                style={styles.inputStyle}
                value={requestTitle}
                placeholder='ex. Calendar System or New Button in Clients'
                onChangeText={(text) => {setRequestTitle(text)}}
              />
              <Text style={styles.inputLabel}>Description</Text>
              <TextInput
                style={styles.inputStyle}
                value={requestText}
                numberOfLines={4}
                multiline={true}
                placeholder='Describe the feature in detail...'
                onChangeText={(text) => {setRequestText(text)}}
              />
              <Button
                title='Submit Request'
                buttonStyle={styles.requestFeatureButton}
                containerStyle={styles.requestFeatureButtonContainer}
                titleStyle={{color:'#fff'}}
                onPress={submitRequestFeature}
              />
            </View>
          </View>)}
        </View>
      </View>
    </View>
  </ScrollView>)

}
