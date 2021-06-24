import { StatusBar } from 'expo-status-bar'
import React, { useEffect, useState, useContext } from 'react'
import { ScrollView, StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native'
import { featureBoardLight, colorsLight, innerDrawerLight, btnColors, boxColors, messageBox } from '../Scripts/Styles.js'
import { featureBoardDark, colorsDark, innerDrawerDark } from '../Scripts/Styles.js'
import { useLinkTo } from '@react-navigation/native'
import LoadingScreen from '../Scripts/LoadingScreen.js'
import ActivityIndicatorView from '../Scripts/ActivityIndicatorView.js'
import { TextInput } from 'react-native-web'
import { set, get, getTTL, ttl } from './Storage.js'
import { Icon, Button, Chip } from 'react-native-elements'
import { confirmAlert } from 'react-confirm-alert' // Import
import 'react-confirm-alert/src/react-confirm-alert.css' // Import css
import { downvoteFeature, upvoteFeature, postFeatureRequest, parseSimpleDateText, sqlToJsDate, getFeatureBoardData } from './API.js'
import { Dropdown, Accordion, Radio, Checkbox } from 'semantic-ui-react'
import DatePicker from 'react-date-picker/dist/entry.nostyle'
import './DatePickerClients/DatePicker.css'
import { Popup } from 'semantic-ui-react'

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
  const [requestButtonDisabled, setRequestButtonDisabled] = useState(false)
  const [submissionPosted, setSubmissionPosted] = useState(false)
  const [submissionFailed, setSubmissionFailed] = useState(false)

  // Release notes variables.
  const [releaseNotes, setReleaseNotes] = useState([])

  // Feature board functions.
  const handleFeatureClick = async (upvoted, featureId) => {
    var res = false
    // Notify db.
    if (!upvoted) {
      res = await upvoteFeature(coach.Id, coach.Token, featureId)
    } else {
      res = await downvoteFeature(coach.Id, coach.Token, featureId)
    }
    // Update locally.
    var og = JSON.parse(JSON.stringify(featureRequests))
    if (res && upvoted) {
      // Remove upvote from list.
      for (var i = 0; i < og.length; i++) {
        if (og[i].Id == featureId) {
          var upvotes = JSON.parse(JSON.stringify(og[i].Upvotes))
          for (var j = 0; j < upvotes.length; j++) {
            var upvote = upvotes[j]
            if (upvote.CoachId == coach.Id) {
              upvotes.splice(j, 1)
            }
          }
          og[i].Upvotes = upvotes
        }
      }
    } else if (res && !upvoted) {
      // Add upvote to list.
      for (var i = 0; i < og.length; i++) {
        if (og[i].Id == featureId) {
          var upvotes = JSON.parse(JSON.stringify(og[i].Upvotes))
          upvotes.push({CoachId:coach.Id, FeatureId:featureId})
          og[i].Upvotes = upvotes
        }
      }
    }
    setFeatureRequests(og.sort(compare))
  }
  // Feature request functions.
  const submitRequestFeature = async () => {
    setRequestButtonDisabled(true)
    var post = await postFeatureRequest(coach.Id, requestTitle, requestText, coach.Token)
    if (true) {
      setSubmissionPosted(true)
      setRequestTitle('')
      setRequestText('')
    } else {
      setSubmissionFailed(true)
    }
    setRequestButtonDisabled(false)
    
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
  const compare = (a, b) => {
    return b.Upvotes.length - a.Upvotes.length
  }

  const refreshData = async () => {
    var data = await getFeatureBoardData(coach.Token)
    console.log('data',data)
    setFeatureRequests(data[0].sort(compare))
    setReleaseNotes(data[1])

  }

  useEffect(() => {
    console.log('Welcome to features.')
    if (coach != null) {
      refreshData()
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
          
          {showBar && (
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
          )}

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
                console.log('feature:',feature)
                var upvoted = false
                var upvotedStyle = {color:colors.secondaryTextColor}
                for (var i = 0; i < feature.Upvotes.length; i++) {
                  if (feature.Upvotes[i].CoachId == coach.Id) {
                    upvoted = true
                    upvotedStyle = {color:btnColors.success}
                  }
                }
                return (<View key={'featureReq_'+index} style={styles.featureRow}>
                  <View style={styles.featureRowVoting}>
                    <Icon
                      name='arrow-up'
                      type='ionicon'
                      size={30}
                      color={upvoted && btnColors.success || colors.secondaryTextColor}
                      style={{marginBottom:-10}}
                      onPress={() => handleFeatureClick(upvoted, feature.Id)}
                    />
                    <Text style={[styles.featureRowNum,upvotedStyle]}>{feature.Upvotes.length}</Text>
                  </View>
                  <View style={styles.featureRowData}>
                    <Text style={styles.featureRowTitle}>{feature.Title}</Text>
                    <Text style={styles.featureRowText}>{feature.Text}</Text>
                  </View>
                </View>)
              })}
            </>)}
          </View>)}

          {showFeatureRequest && (<View style={[styles.bodyContainer,{width:'70%',marginLeft:'15%'}]}>
            {submissionPosted && (<View style={[messageBox.box,{backgroundColor:boxColors.success}]}>
              <Text style={styles.text}>Submission created! We will review it shortly.</Text>
            </View>)}
            {submissionFailed && (<View style={[messageBox.box,{backgroundColor:boxColors.danger}]}>
              <Text style={styles.text}>Error posting. Please try again or report the problem.</Text>
            </View>)}
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
              {(requestTitle == 0 || requestText == 0) && (<Popup 
                position='top center'
                wide='very'
                content={'Fill out all fields first.'}
                trigger={<Button
                  title='Submit Request'
                  buttonStyle={styles.requestFeatureButton}
                  containerStyle={styles.requestFeatureButtonContainer}
                  titleStyle={{color:'#fff'}}
                  disabled={true}
                />}
              />) 
              || (<Button
                title='Submit Request'
                buttonStyle={styles.requestFeatureButton}
                containerStyle={styles.requestFeatureButtonContainer}
                titleStyle={{color:'#fff'}}
                onPress={submitRequestFeature}
                disabled={requestButtonDisabled}
              />)}
              <View style={{marginTop:10,height:32}}>
                {requestButtonDisabled && (<ActivityIndicatorView />)}
              </View>
            </View>
          </View>)}

        </View>
      </View>
    </View>
  </ScrollView>)

}
