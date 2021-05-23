import { StatusBar } from 'expo-status-bar'
import React, { useEffect, useState } from 'react'
import { TouchableOpacity, Image, ScrollView, StyleSheet, Text, View } from 'react-native'
import { paymentsLight, colorsLight, innerDrawerLight, btnColors } from '../Scripts/Styles.js'
import { paymentsDark, colorsDark, innerDrawerDark } from '../Scripts/Styles.js'
import { useLinkTo, Link } from '@react-navigation/native'
import LoadingScreen from '../Scripts/LoadingScreen.js'
import ActivityIndicatorView from '../Scripts/ActivityIndicatorView.js'
import { set, get, getTTL, ttl } from './Storage.js'
import { TextInput } from 'react-native-web'
import { Icon, Button } from 'react-native-elements'
import ConnectStripe from '../assets/connect-stripe.png'
import { monthNames, sqlToJsDate } from './API.js'

export default function Payments() {
  const linkTo = useLinkTo()
  const [refreshing, setRefreshing] = useState(true)
  const [styles, setStyles] = useState(paymentsLight)
  const [colors, setColors] = useState(colorsLight)

  // Main stage controls.
  const [showActivityIndicator, setActivityIndicator] = useState(true)
  const [showMain, setMain] = useState(false)
  const [showUpgradeNeeded, setUpgradeNeeded] = useState(false)

  // Main stage variables.
  const [coach, setCoach] = useState({})
  const [coachCreated, setCoachCreated] = useState({})
  const [monthlyStarting, setMonthlyStarting] = useState({})
  const date = new Date()

  // Main functions.

  useEffect(() => {
    console.log('Welcome to integrations.')
    const sCoach = get('Coach')
    if (sCoach != null) {
      setCoach(sCoach)
      var d = sqlToJsDate(sCoach.Created)
      setCoachCreated(d)
      if (d.getDay() > 1) {
        setMonthlyStarting(monthNames[d.getMonth()] + ' ' + d.getDay() + ', ' + d.getFullYear())
      } else {
        setMonthlyStarting(monthNames[date.getMonth()] + ' 1, ' + date.getFullYear())
      }
      setTimeout(() => {
        setActivityIndicator(false)
        if (sCoach.Plan == 0) {
          setUpgradeNeeded(true)
        }
        setMain(true)
      }, 500)
    }
  },[])

  return (<ScrollView contentContainerStyle={styles.scrollView}>
    <View style={styles.container}>
      <View style={styles.main}>
        <View style={styles.body}>

          <View style={styles.bodyHeader}>
            <View style={styles.bodyTitleGroup}>
              <Text style={styles.bodyTitle}>Payments</Text>
              <Text style={styles.bodyDesc}>Manage how you receive payments from Clients.</Text>
            </View>
          </View>

          {showActivityIndicator && (<ActivityIndicatorView />)}

          {showUpgradeNeeded && (<View style={styles.bodyContainer}>
            <Text style={styles.bodySubtitle}>Some Features Disabled...</Text>
            <Text style={styles.bodyDesc}>You will not be able to create, collect, or assign any payments on the Free Plan. Visit <Link to='/manage-plan' style={{color:btnColors.primary}}>Manage Plan</Link> to upgrade.</Text>
          </View>)}

          {showMain && (<>
            <View style={styles.bodyRow}>
              <View style={[styles.bodyContainer,{flex:1,marginRight:10}]}>
                <Text style={styles.bodySubtitle}>Monthly Earnings</Text>
                <Text style={[styles.bodyTitle,{fontSize:40,fontFamily:'Poppins',color:btnColors.success}]}>$0</Text>
                <Text style={[styles.bodySubtitle,{fontFamily:'Poppins',fontSize:20}]}>since {monthlyStarting}</Text>
              </View>
              <View style={[styles.bodyContainer,{flex:1,marginLeft:10}]}>
                <Text style={styles.bodySubtitle}>Total Earnings</Text>
                <Text style={[styles.bodyTitle,{fontSize:40,fontFamily:'Poppins',color:btnColors.success}]}>$0</Text>
                <Text style={[styles.bodySubtitle,{fontFamily:'Poppins',fontSize:20}]}>since {monthNames[coachCreated.getMonth()] + ' ' + coachCreated.getDay() + ', ' + coachCreated.getFullYear()}</Text>
              </View>
            </View>
            <View style={styles.bodyRow}>
              <View style={[styles.bodyContainer,{flex:1}]}>
                <Text style={styles.bodySubtitle}>Recent Payments</Text>
                <View style={styles.paymentsControls}>
                  <TouchableOpacity style={styles.paymentControlsTouchIcon}>
                    <Icon
                      name='square-outline'
                      type='ionicon'
                      size={20}
                      color={colors.mainTextColor}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.paymentControlsTouchAmount}>
                    <Text style={styles.paymentsControlsText}>Amount</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.paymentControlsTouchAmountCurrency}>
                    <Text style={styles.paymentsControlsText}></Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.paymentControlsTouchAmountStatus}>
                    <Text style={styles.paymentsControlsText}></Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.paymentControlsTouchDescription}>
                    <Text style={styles.paymentsControlsText}>Description</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.paymentControlsTouchClient}>
                    <Text style={styles.paymentsControlsText}>Client</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.paymentControlsTouchDate}>
                    <Text style={styles.paymentsControlsText}>Date</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.paymentControlsTouchIcon}>
                    <Icon
                      name='ellipsis-horizontal-outline'
                      type='ionicon'
                      size={0}
                      color={colors.mainTextColor}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </>)}

        </View>
      </View>
    </View>
  </ScrollView>)

}
