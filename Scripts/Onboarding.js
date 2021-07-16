import { StatusBar } from 'expo-status-bar'
import React, { useEffect, useState, useContext } from 'react'
import { ScrollView, StyleSheet, Text, View } from 'react-native'
import { socialFeedLight, colorsLight, innerDrawerLight } from '../Scripts/Styles.js'
import { socialFeedDark, colorsDark, innerDrawerDark } from '../Scripts/Styles.js'
import { useLinkTo } from '@react-navigation/native'
import LoadingScreen from '../Scripts/LoadingScreen.js'
import { Helmet } from "react-helmet"
import ActivityIndicatorView from '../Scripts/ActivityIndicatorView.js'
import { getOnboardingData } from './API.js'

import userContext from './Context.js'

export default function Onboarding() {

  const user = useContext(userContext)
  const linkTo = useLinkTo()
  const [refreshing, setRefreshing] = useState(true)
  const [styles, setStyles] = useState(socialFeedLight)
  const [colors, setColors] = useState(colorsLight)

  // Main stage controls.
  const [showActivityIndicator, setActivityIndicator] = useState(true)

  // Main variables.
  const [coach, setCoach] = useState(user)
  
  // Onboarding data.
  const [onboardingStatus, setOnboardingStatus] = useState([0, 0, 0])
  const [surveyId, setSurveyId] = useState(-1)
  const [paymentId, setPaymentId] = useState(-1)
  const [contractId, setContractId] = useState(-1)

  // Prompts data.
  const [surveys, setSurveys] = useState([])
  const [payments, setPayments] = useState([])
  const [contracts, setContracts] = useState([])

  // Main functions. 
  const refreshOnboardingData = async () => {

    // Get data.
    var data = await getOnboardingData(coach.Id, coach.Token)

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

    setSurveys(data.Surveys)
    setPayments(data.Payments)
    setContracts(data.Contracts)

  }

  useEffect(() => {
    console.log('Welcome to Onboarding.')
    if (coach != null) {
      // Load page.

    } else {
      linkTo('/welcome')
    }
  },[])

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

        </View>
      </View>
    </View>
  </ScrollView>)

}
