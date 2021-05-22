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

  useEffect(() => {
    console.log('Welcome to integrations.')
    const sCoach = get('Coach')
    if (sCoach != null) {
      setCoach(sCoach)
      setTimeout(() => {
        setActivityIndicator(false)
        setMain(true)
      }, 500)
    }
  },[])

  // Main functions.
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
