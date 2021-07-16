import { StatusBar } from 'expo-status-bar'
import React, { useEffect, useState } from 'react'
import { Animated, TouchableOpacity, ScrollView, StyleSheet, Text, View } from 'react-native'
import { inviteClientsLight, colorsLight, innerDrawerLight, btnColors } from '../Scripts/Styles.js'
import { inviteClientsDark, colorsDark, innerDrawerDark } from '../Scripts/StylesDark.js'
import { useLinkTo } from '@react-navigation/native'
import LoadingScreen from '../Scripts/LoadingScreen.js'
import { Helmet } from "react-helmet"
import ActivityIndicatorView from '../Scripts/ActivityIndicatorView.js'
import { set, get, getTTL, ttl } from './Storage.js'
import { TextInput } from 'react-native-web'
import { Icon, Button } from 'react-native-elements'
import ConnectStripe from '../assets/connect-stripe.png'
import { refreshOnboardingId } from './API.js'
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import { useSpring, animated } from 'react-spring';

export default function InviteClients() {
  const linkTo = useLinkTo()
  const [refreshing, setRefreshing] = useState(true)
  const [styles, setStyles] = useState(inviteClientsLight)
  const [colors, setColors] = useState(colorsLight)

  // Main stage controls.
  const [showActivityIndicator, setActivityIndicator] = useState(true)
  const [showMain, setMain] = useState(false)
  const [colorIDAnim, setColorIDAnim] = useState(false)
  const [colorDownloadAnim, setColorDownloadAnim] = useState(0)
  const [colorOnboardingAnim, setColorOnboardingAnim] = useState(0)

  // Main variables.
  const [coach, setCoach] = useState({})
  useEffect(() => {
    console.log('Welcome to invite clients.')
    const sCoach = get('Coach')
    if (sCoach != null) {
      setCoach(sCoach)
      console.log(sCoach)
      setTimeout(() => {
        setActivityIndicator(false)
        setMain(true)
      }, 500)
    }
  },[])

  // Main functions.
  const refreshId = async () => {
    var newId = await refreshOnboardingId(coach.Id, coach.Token)
    if (newId != false) {
      var tempCoach = JSON.parse(JSON.stringify(coach))
      tempCoach.OnboardingId = newId
      setCoach(tempCoach)
      set('Coach',tempCoach,ttl)
    } else {
      confirmAlert({
        title: 'Connection Problem...',
        message: 'The server could not be reached. Please try again!',
        buttons: [
          {
            label: 'Okay',
          }
        ]
      });
    }
  }

  // Animations and copy functions.
  const AnimatedText = animated(Text);

  const fadeStylesID = useSpring({
    from: { opacity: 0 },
    to: {
      opacity: colorIDAnim ? 1 : 0
    }
  })

  const copyID = () => {
    setColorIDAnim(true)
    setTimeout(() => {
      navigator.clipboard.writeText(coach.OnboardingId)
      setColorIDAnim(false)
    }, 600)
  }

  const fadeStylesDownload = useSpring({
    from: { opacity: 0 },
    to: {
      opacity: colorDownloadAnim ? 1 : 0
    }
  })

  const copyDownload = () => {
    setColorDownloadAnim(true)
    setTimeout(() => {
      navigator.clipboard.writeText('https://coachsync.me/get-app')
      setColorDownloadAnim(false)
    }, 600)
  }

  const fadeStylesOnboarding = useSpring({
    from: { opacity: 0 },
    to: {
      opacity: colorOnboardingAnim ? 1 : 0
    }
  })

  const copyOnboarding = () => {
    setColorOnboardingAnim(true)
    setTimeout(() => {
      navigator.clipboard.writeText('https://coachsync.me/onboarding/' + coach.OnboardingId)
      setColorOnboardingAnim(false)
    }, 600)
  }


  const refreshIdPrompt = () => {
    confirmAlert({
      title: 'Refresh Coach ID?',
      message: `Are you sure you want a new Coach ID? The old one will no longer be active.`,
      buttons: [
        {
          label: 'Yes',
          onClick: refreshId
        },
        {
          label: 'Cancel',
        }
      ]
    });
  }

  return (<ScrollView contentContainerStyle={styles.scrollView}>
    <View style={styles.container}>
      <View style={styles.main}>
        <View style={styles.body}>

          <View style={styles.bodyHeader}>
            <View style={styles.bodyTitleGroup}>
              <Text style={styles.bodyTitle}>Invite Clients</Text>
              <Text style={styles.bodyDesc}>Different tools for growing your practice.</Text>
            </View>
          </View>

          {showActivityIndicator && (<ActivityIndicatorView />)}

          {showMain && (<View style={styles.bodyContainer}>
            <Text style={[styles.bodySubtitle,{margin:0}]}>Current ID</Text>
            <Text style={[styles.bodyDesc,{paddingBottom:10}]}>Provide this code to clients along with a link to download the application, or use the hyperlink to onboard them on the web.</Text>
            <View style={[styles.bodyRow]}>
              <View>
                <TouchableOpacity onPress={copyID}><Text style={styles.coachID}>{coach.OnboardingId}</Text></TouchableOpacity>
                <TouchableOpacity onPress={refreshIdPrompt}><Text style={[styles.coachID,{backgroundColor:colors.mainBackground,color:btnColors.primary,fontSize:20,padding:12}]}>Change ID</Text></TouchableOpacity>
              </View>
              <View style={{flex:1,marginTop:15,marginLeft:10}}>
                <Text style={[styles.bodySubtitle,{color:btnColors.success}]}>
                  <AnimatedText style={fadeStylesID}>Copied!</AnimatedText>
                </Text>
              </View>
            </View>
            <View style={{flexDirection:'row'}}>
              <View style={{marginRight:20}}>
              <View>
                <Text style={[styles.bodySubtitle,{margin:0,padding:0}]}>App Download Link</Text>
                <TouchableOpacity onPress={copyDownload}><Text style={[styles.coachID,{fontSize:16}]}>coachsync.me/get-app</Text></TouchableOpacity>
              </View>
              <View>
                <Text style={[styles.bodySubtitle,{color:btnColors.success,textAlign:'center'}]}>
                  <AnimatedText style={fadeStylesDownload}>Copied!</AnimatedText>
                </Text>
              </View>
            </View>
            <View style={{}}>
              <View>
                <Text style={[styles.bodySubtitle,{margin:0}]}>Onboarding Link</Text>
                <TouchableOpacity onPress={copyOnboarding}><Text style={[styles.coachID,{fontSize:16}]}>coachsync.me/onboarding/{coach.OnboardingId}</Text></TouchableOpacity>
              </View>
              <View>
                <Text style={[styles.bodySubtitle,{color:btnColors.success,textAlign:'center'}]}>
                  <AnimatedText style={fadeStylesOnboarding}>Copied!</AnimatedText>
                </Text>
              </View>
            </View>
            </View>
          </View>)}

        </View>
      </View>
    </View>
  </ScrollView>)

}
