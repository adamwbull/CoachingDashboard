import { StatusBar } from 'expo-status-bar'
import React, { useEffect, useState, useContext } from 'react'
import { TouchableOpacity, ScrollView, StyleSheet, Text, View } from 'react-native'
import { onboardingStylesLight, colorsLight, innerDrawerLight } from '../Scripts/Styles.js'
import { onboardingStylesDark, colorsDark, innerDrawerDark } from '../Scripts/Styles.js'
import { useLinkTo } from '@react-navigation/native'
import LoadingScreen from '../Scripts/LoadingScreen.js'
import { Helmet } from "react-helmet"
import ActivityIndicatorView from '../Scripts/ActivityIndicatorView.js'
import { getOnboardingData } from './API.js'
import { Icon, Button } from 'react-native-elements'
import { Popup, Dropdown, Tab, Checkbox } from 'semantic-ui-react'
import { TextInput } from 'react-native-web'

import userContext from './Context.js'

export default function Onboarding() {

  const user = useContext(userContext)
  const linkTo = useLinkTo()
  const [refreshing, setRefreshing] = useState(true)
  const [styles, setStyles] = useState(onboardingStylesLight)
  const [colors, setColors] = useState(colorsLight)

  // Main stage controls.
  const [showActivityIndicator, setActivityIndicator] = useState(true)
  const [showMain, setShowMain] = useState(false)

  // Main variables.
  const [coach, setCoach] = useState(user)
  
  // Onboarding data.
  const [onboardingStatus, setOnboardingStatus] = useState([0, 0, 0])
  const [surveyId, setSurveyId] = useState(-1)
  const [paymentId, setPaymentId] = useState(-1)
  const [contractId, setContractId] = useState(-1)

  // Prompts data.
  const [hasSearchContents, setHasSearchContents] = useState([0, 0, 0])

  const [surveys, setSurveys] = useState([])
  const [surveySelectedIndex, setSurveySelectedIndex] = useState(-1)

  const [payments, setPayments] = useState([])
  const [paymentSelectedIndex, setPaymentSelectedIndex] = useState(-1)

  const [contracts, setContracts] = useState([])
  const [contractSelectedIndex, setContractSelectedIndex] = useState(-1)

  // Main functions. 
  const refreshOnboardingData = async () => {

    // Get data.
    var data = JSON.parse(JSON.stringify(await getOnboardingData(coach.Id, coach.Token)))
    console.log('data:',data)

    // Calculate status array.
    var status = [0, 0, 0]
    var type = data.OnboardingType
    if (type == 7) { // All
      status = [1, 1, 1]
    } else if (type == 6) { // Payment, Contract
      status = [0, 1, 1]
    } else if (type == 5) { // Survey, Contract
      status = [1, 0, 1]
    } else if (type == 4) { // Survey, Payment
      status = [1, 1, 0]
    } else if (type == 3) { // Contract
      sstatus = [0, 0, 1]
    } else if (type == 2) { // Payment
      status = [0, 1, 0] 
    } else if (type == 1) { // Survey
      status = [1, 0, 0]
    } 
    setOnboardingStatus(status)

    // Set prompt data.
    setSurveyId(data.SurveyId)
    setPaymentId(data.PaymentId)
    setContractId(data.ContractId)

    // Set visible variables.
    for (var i = 0; i < data.Surveys.length; i++) {
      data.Surveys[i].Visible = true
    }

    for (var i = 0; i < data.Payments.length; i++) {
      data.Payments[i].Visible = true
    }

    for (var i = 0; i < data.Contracts.length; i++) {
      data.Contracts[i].Visible = true
    }

    setSurveys(data.Surveys)
    setPayments(data.Payments)
    setContracts(data.Contracts)

    // Show.
    setActivityIndicator(false)
    setShowMain(true)
  }

  useEffect(() => {
    console.log('Welcome to Onboarding.')
    if (coach != null) {
      // Load page.
      refreshOnboardingData()
    } else {
      linkTo('/welcome')
    }
  },[])

  // Prompt management functions.

  // Update promptId based on Index.
  // Type: 0 - Survey
  //       1 - Payment
  //       2 - Contract
  const selectPrompt = (type, index) => {

    var id = -1

    if (type == 0) {

      for (var i = 0; i < surveys.length; i++) {
        if (i == index) {
          id = surveys[i].Id
          break
        }
      }
      setSurveyId(id)

    } else if (type == 1) {

      for (var i = 0; i < payments.length; i++) {
        if (i == index) {
          id = payments[i].Id
          break
        }
      }
      setPaymentId(id)

    } else if (type == 2) {

      for (var i = 0; i < contracts.length; i++) {
        if (i == index) {
          id = contracts[i].Id
          break
        }
      }
      setContractId(id)

    }

  }

  // Toggle a section.
  const toggleSection = (type) => {

    var newOnboardingStatus = JSON.parse(JSON.stringify(onboardingStatus))
    newOnboardingStatus[type] = (newOnboardingStatus[type] == 1) ? 0 : 1
    setOnboardingStatus(newOnboardingStatus)

  }

  // Search through prompts.
  const searchSection = (type, text) => {

    // Update content highlight.
    var newHasSearchContents = JSON.parse(JSON.stringify(hasSearchContents))
    newHasSearchContents[type] = (text.length > 0) ? 1 : 0
    setHasSearchContents(newHasSearchContents)

    // Filter.
    var len = text.length
    if (type == 0) {

      var newSurveys = JSON.parse(JSON.stringify(surveys))
      for (var i = 0; i < newSurveys.length; i++) {
        if (len == 0) {
          newSurveys[i].Visible = true
        } else if (newSurveys[i].Title.includes(text)) {
          newSurveys[i].Visible = true
        } else {
          newSurveys[i].Visible = false
        }
      }
      setSurveys(newSurveys)

    }

  }

  return (<ScrollView contentContainerStyle={styles.scrollView}>
    <View style={styles.container}>
      <View style={styles.main}>
        <View style={styles.body}>

          <View style={styles.bodyHeader}>
            <View style={styles.bodyTitleGroup}>
              <Text style={styles.bodyTitle}>Onboarding</Text>
              <Text style={styles.bodyDesc}>Customize the onboarding experience for your clients.</Text>
            </View>
          </View>

          {showActivityIndicator && (<ActivityIndicatorView />)}

          {showMain && (<View style={styles.main}>
            <ScrollView contentContainerStyle={{flex:1}}>
              
              <View style={styles.promptListContainer}>
                <View style={styles.promptHeader}>
                  
                  <Text style={styles.promptHeaderTitle}>Onboarding Survey</Text>
                  <Checkbox 
                    checked={onboardingStatus[0] == 1}
                    toggle 
                    onChange={() => toggleSection(0)}
                  />
                  <Text style={styles.promptHeaderDesc}>{onboardingStatus[0] == 1 && 'Enabled' || 'Disabled'}</Text>
                </View>
                {onboardingStatus[0] == 1 && (<View style={styles.promptsRow}>
                  <View style={styles.promptsData}>
                    <View style={hasSearchContents[0] == 1 && [styles.searchHighlight] || [styles.searchHighlight,{borderColor:colors.headerBorder}]}>
                      <View style={styles.searchIcon}>
                        <Icon
                          name='search'
                          type='ionicon'
                          size={28}
                          color={hasSearchContents[0] == 1 && colors.mainTextColor || colors.headerBorder}
                          style={[{marginLeft:5,marginTop:2}]}
                        />
                      </View>
                      <TextInput 
                        placeholder='Filter surveys...'
                        style={styles.searchInput}
                        onChange={(e) => {
                          searchSection(0, e.currentTarget.value)
                        }}
                        className='custom-textinput'
                      />
                    </View>
                    {surveys.length > 0 && (<ScrollView horizontal={true} contentContainerStyle={styles.innerRow}>
                      {surveys.map((survey, index) => {
    
                        if (survey.Visible == true) {

                          var promptIcon = 'clipboard-outline'
                          var name = survey.Title
                          if (name.length > 15) {
                            name = name.slice(0,15) + '...'
                          }
                          var text = survey.Text
                          if (text.length > 80) {
                            text = text.slice(0,80) + '...'
                          }

                          return (<View style={styles.taskBox} key={index + '-'}>
                            <View style={styles.taskPreview}>
                              <View style={styles.taskPreviewHeader}>
                                <View style={styles.taskPreviewHeaderIcon}>
                                  <Icon
                                    name={promptIcon}
                                    type='ionicon'
                                    size={22}
                                    color={colors.mainTextColor}
                                  />
                                </View>
                                {survey.Title.length > 15 && (<Popup 
                                  trigger={<Text style={styles.taskPreviewTitle}>{name}</Text>}
                                  content={survey.Title}
                                  inverted
                                  position={'top left'}
                                />) || (<Text style={styles.taskPreviewTitle}>{name}</Text>)}
                              </View>
                              <Text style={styles.taskPreviewText}>{text}</Text>
                              {surveySelectedIndex == index && (<>
                                <Button 
                                  title='Selected'
                                />
                              </>) || (<>
                                <Button 
                                  title='Select'
                                />
                              </>)}
                            </View>
                          </View>)

                        }

                      })}
                    </ScrollView>) || (<View style={styles.helpBox}>
                      <Text style={styles.helpBoxText}>No surveys created yet.</Text>
                    </View>)}
                  </View>
                </View>)}
              </View>

            </ScrollView>
          </View>)}

        </View>
      </View>
    </View>
  </ScrollView>)

}
