import { StatusBar } from 'expo-status-bar'
import React, { useEffect, useState } from 'react'
import { ScrollView, StyleSheet, Text, View } from 'react-native'
import { managePlanLight, colorsLight, innerDrawerLight, btnColors } from '../Scripts/Styles.js'
import { managePlanDark, colorsDark, innerDrawerDark } from '../Scripts/Styles.js'
import { useLinkTo } from '@react-navigation/native'
import LoadingScreen from '../Scripts/LoadingScreen.js'
import ActivityIndicatorView from '../Scripts/ActivityIndicatorView.js'
import { set, get, getTTL, ttl } from './Storage.js'
import { TextInput } from 'react-native-web'
import { Icon, Button } from 'react-native-elements'
import { sqlToJsDate, parseSimpleDateText, getPlans, getActiveCoachDiscount } from './API.js'

export default function ManagePlan() {
  const linkTo = useLinkTo()
  const [refreshing, setRefreshing] = useState(true)
  const [styles, setStyles] = useState(managePlanLight)

  // Main stage controls.
  const [showActivityIndicator, setActivityIndicator] = useState(true)
  const [showBar, setBar] = useState(false)
  const [showMain, setMain] = useState(false)
  const [showPlans, setShowPlans] = useState(false)

  // Main variables.
  const [coach, setCoach] = useState({})
  const [planTitle, setPlanTitle] = useState('')
  const [planTitleStyle, setPlanTitleStyle] = useState({})
  const [plans, setPlans] = useState([])
  const [activePlan, setActivePlan] = useState({})

  // Main functions.
  const refreshPlans = async (t, a) => {
    var refresh = JSON.parse(JSON.stringify(await getPlans(t)))
    if (refresh != false) {
      if (a != 0) {
        // If discount exists, apply it to the base price.
        var discount = await getActiveCoachDiscount(t, a)
        for (var i = 0; i < refresh.length; i++) {
          refresh[i].BasePrice = (refresh[i].BasePrice*(1-(discount.Percent/100))).toFixed(2)
        }
      }
      console.log('plans: ', refresh)
      setPlans(refresh)
    }
  }
  useEffect(() => {
    console.log('Welcome to manage plan.')
    const sCoach = get('Coach')
    if (sCoach != null) {
      refreshPlans(sCoach.Token, sCoach.ActiveDiscountId)
      setCoach(sCoach)
      if (sCoach.Plan == 2) {
        setPlanTitle('Professional')
        setPlanTitleStyle({backgroundColor:btnColors.danger})
      } else if (sCoach.Plan == 1) {
        setPlanTitle('Standard')
        setPlanTitleStyle({backgroundColor:btnColors.success})
      } else {
        setPlanTitle('Free')
        setPlanTitleStyle({backgroundColor:btnColors.primary})
      }
      setTimeout(() => {
        setActivityIndicator(false)
        setBar(true)
        setMain(true)
      }, 500)
    }
  }, [])

  // Navigation functions.
  const navToMain = () => {
    setShowPlans(false)

    setMain(true)
  }

  const navToPlans = () => {
    setMain(false)

    setShowPlans(true)
  }

  // Manage payments functions.
  const managePayments = () => {

  }

  return (<ScrollView contentContainerStyle={styles.scrollView}>
    <View style={styles.container}>
      <View style={styles.main}>
        <View style={styles.body}>

          <View style={styles.bodyHeader}>
            <View style={styles.bodyTitleGroup}>
              <Text style={styles.bodyTitle}>Manage Plan</Text>
              <Text style={styles.bodyDesc}>Earn discounts, upgrade, or downgrade your CoachSync plan.</Text>
            </View>
          </View>

          {showBar && (<>
            <View style={[styles.bodyContainer,{flexDirection:'row'}]}>
              {showMain && (<Text style={styles.barSelected}>Overview</Text>)
                        || (<Text onPress={navToMain} style={styles.barUnselected}>Overview</Text>)}
              {showPlans && (<Text style={styles.barSelected}>Plans</Text>)
                        || (<Text onPress={navToPlans} style={styles.barUnselected}>Plans</Text>)}
            </View>
          </>)}

          {showActivityIndicator && (<ActivityIndicatorView />)}

          {showMain && (<>
            <View style={{flexDirection:'row'}}>
              <View style={[styles.bodyContainer,{flex:3,flexDirection:'row',justifyContent:'space-between'}]}>
                <Text style={styles.bodySubtitle}><Text style={[{paddingLeft:8,paddingRight:8,paddingTop:5,paddingBottom:5,color:'#fff',borderRadius:10},planTitleStyle]}>{planTitle}</Text> Plan</Text>
                <View style={{flexDirection:'row'}}>
                  <Text></Text>
                  <Text style={styles.planDuration}>{(coach.PaymentPeriod == 0) ? '/month' : '/year'}</Text>
                </View>
              </View>
              <View style={[styles.bodyContainer,{flex:2,marginLeft:20}]}>
                <Text style={styles.inputHeader}>Next payment</Text>
                <Text style={[styles.bodySubtitle,{marginLeft:5}]}>on {parseSimpleDateText(sqlToJsDate(coach.PlanExpire))}</Text>
                <Button
                  title='Manage Payments'
                  buttonStyle={styles.managePaymentsButton}
                  containerStyle={styles.managePaymentsButtonContainer}
                  titleStyle={{color:btnColors.primary}}
                  onPress={managePayments}
                />
              </View>
            </View>
          </>)}

          {showPlans && (<></>)}

        </View>
      </View>
    </View>
  </ScrollView>)

}
