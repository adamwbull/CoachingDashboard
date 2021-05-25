import { StatusBar } from 'expo-status-bar'
import React, { useEffect, useState } from 'react'
import { ScrollView, StyleSheet, Text, View } from 'react-native'
import { integrationsLight, colorsLight, innerDrawerLight, btnColors } from '../Scripts/Styles.js'
import { integrationsDark, colorsDark, innerDrawerDark } from '../Scripts/StylesDark.js'
import { useLinkTo, Link } from '@react-navigation/native'
import LoadingScreen from '../Scripts/LoadingScreen.js'
import ActivityIndicatorView from '../Scripts/ActivityIndicatorView.js'
import { set, get, getTTL, ttl } from './Storage.js'
import { TextInput } from 'react-native-web'
import { Icon, Button } from 'react-native-elements'
import { stripeCheckUser } from './API.js'

export default function Integrations() {
  const linkTo = useLinkTo()
  const [refreshing, setRefreshing] = useState(true)
  const [styles, setStyles] = useState(integrationsLight)
  const [colors, setColors] = useState(colorsLight)

  // Main variables.
  const [coach, setCoach] = useState({})
  const [calendlyLink, setCalendlyLink] = useState('')
  const [saveCalendlyDisabled, setSaveCalendlyDisabled] = useState(true)

  // Main stage controls.
  const [showActivityIndicator, setActivityIndicator] = useState(true)
  const [showMain, setMain] = useState(false)

  // Stripe info controls.
  const [showPlanWarning, setPlanWarning] = useState(false)
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
        setMain(true)
        setStripeInfo(true)
        if (sCoach.Plan == 0) {
          setPlanWarning(true)
        }
      }, 500)
    }
  },[])

  const saveCalendlyLink = () => {
    console.log(calendlyLink)
  }

  const updateCalendlyLink = (t) => {
    setCalendlyLink(t)
    if (t.includes('calendly.com')) {
      setSaveCalendlyDisabled(false)
    } else {
      setSaveCalendlyDisabled(true)
    }
  }

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
              <Text style={styles.bodyTitle}>Integrations</Text>
              <Text style={styles.bodyDesc}>Connect with other software.</Text>
            </View>
          </View>

          {showActivityIndicator && (<ActivityIndicatorView />)}

          {showPlanWarning && (<></>)}

          {showStripeInfo && (<View style={styles.bodyContainer}>
            <View style={[styles.bodyRow,{justifyContent:'space-between'}]}>
              <View>
                <Text style={styles.bodySubtitle}>Stripe Info</Text>
                <Text style={styles.bodyDesc}>Connect your Stripe account to enable Client payment collection.</Text>
              </View>
              {showConnectStripe && (<TouchableOpacity onPress={connectStripe}>
                <Image source={ConnectStripe} style={{width:150,height:32}} />
              </TouchableOpacity>) || (<Text style={styles.stripeConnected}>Stripe connected!</Text>)}
            </View>
          </View>)}

          {showMain && (<>
            <View style={styles.bodyContainer}>
              <Text style={[styles.bodySubtitle,{margin:0}]}>Calendly</Text>
              <Text style={[styles.bodyDesc,{paddingBottom:10}]}>Provide a scheduling link to enable the Scheduling button in <Link to='/social-feed' style={{color:btnColors.primary}}>Social Feed</Link>.</Text>
              <TextInput
                style={styles.inputStyle}
                value={calendlyLink}
                placeholder='ex. calendly.com/testing'
                onChangeText={(text) => updateCalendlyLink(text)}
              />
              <Button
                title='Save Calendly Link'
                titleStyle={styles.saveColoringText}
                buttonStyle={styles.saveColoringButton}
                containerStyle={styles.saveColoringContainer}
                onPress={saveCalendlyLink}
                disabled={saveCalendlyDisabled}
              />
            </View>
            <View style={styles.bodyContainer}>
              <Text style={[styles.bodySubtitle,{margin:0}]}>Instagram</Text>
              <Text style={[styles.bodyDesc,{paddingBottom:10}]}>Connect your Instagram to display your posts in <Link to='/social-feed' style={{color:btnColors.primary}}>Social Feed</Link>.</Text>
            </View>
          </>)}
        </View>
      </View>
    </View>
  </ScrollView>)

}
