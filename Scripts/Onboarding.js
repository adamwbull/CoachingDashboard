import { StatusBar } from 'expo-status-bar'
import React, { useEffect, useState, useContext } from 'react'
import { ScrollView, StyleSheet, Text, View } from 'react-native'
import { socialFeedLight, colorsLight, innerDrawerLight } from '../Scripts/Styles.js'
import { socialFeedDark, colorsDark, innerDrawerDark } from '../Scripts/Styles.js'
import { useLinkTo } from '@react-navigation/native'
import LoadingScreen from '../Scripts/LoadingScreen.js'
import { Helmet } from "react-helmet"
import ActivityIndicatorView from '../Scripts/ActivityIndicatorView.js'

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
              <Text style={styles.bodyTitle}>Social Feed</Text>
              <Text style={styles.bodyDesc}>Customize and add posts seen by all Clients.</Text>
            </View>
          </View>

          {showActivityIndicator && (<ActivityIndicatorView />)}

        </View>
      </View>
    </View>
  </ScrollView>)

}
