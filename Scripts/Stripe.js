import { StatusBar } from 'expo-status-bar'
import React, { useEffect, useState } from 'react'
import { TouchableOpacity, Image, ScrollView, StyleSheet, Text, View } from 'react-native'
import { stripeLight, colorsLight, innerDrawerLight, btnColors } from '../Scripts/Styles.js'
import { stripeDark, colorsDark, innerDrawerDark } from '../Scripts/Styles.js'
import { useLinkTo, Link } from '@react-navigation/native'
import LoadingScreen from '../Scripts/LoadingScreen.js'
import ActivityIndicatorView from '../Scripts/ActivityIndicatorView.js'
import { set, get, getTTL, ttl } from './Storage.js'
import { TextInput } from 'react-native-web'
import { Icon, Button } from 'react-native-elements'
import { stripeCheckUser, stripeOnboardUser } from './API.js'

export default function Payments() {
  const linkTo = useLinkTo()
  const [refreshing, setRefreshing] = useState(true)
  const [styles, setStyles] = useState(stripeLight)

  // Main stage controls.
  const [showActivityIndicator, setActivityIndicator] = useState(true)

  // Main stage variables.
  const [coach, setCoach] = useState({})

  // Stripe info controls.
  const [showStripeInfo, setStripeInfo] = useState(false)
  const [showConnectStripe, setConnectStripe] = useState(false)

  // Main functions.
  const triggerStripeCheckUser = async (id, token, stripeAccountId) => {
    var chargesEnabled = await stripeCheckUser(id, token, stripeAccountId)
    if (chargesEnabled) {
      setConnectStripe(false)
    } else {
      setConnectStripe(true)
    }
  }

  useEffect(() => {
    console.log('Welcome to integrations.')
    const sCoach = get('Coach')
    if (sCoach != null) {
      setCoach(sCoach)
      triggerStripeCheckUser(sCoach.Id, sCoach.Token, sCoach.StripeAccountId)
      setTimeout(() => {
        setActivityIndicator(false)
        setStripeInfo(true)
      }, 500)
    }
  },[])

  // Stripe functions.
  const connectStripe = async () => {
    console.log('Connecting Stripe...')
    var link = await stripeOnboardUser(coach.Id, coach.Token, coach.StripeAccountId)
    if (link != false) {
      var win = window.open(link, '_blank');
      if (win != null) {
        win.focus();
      }
    }
  }

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

          {showStripeInfo && (<View style={styles.bodyContainer}>
            <Text style={styles.bodySubtitle}>Stripe Info</Text>
            <Text style={styles.bodyDesc}>Connect your Stripe account to enable Client payment collection.</Text>
            <View style={styles.bodyRow}>
              {showConnectStripe && (<TouchableOpacity onPress={connectStripe}>
                <Image source={ConnectStripe} style={{width:150,height:32}} />
              </TouchableOpacity>) || (<Text style={styles.bodyDesc}>Stripe connected!</Text>)}
            </View>
          </View>)}

        </View>
      </View>
    </View>
  </ScrollView>)

}
