import { StatusBar } from 'expo-status-bar'
import React, { useEffect, useState } from 'react'
import { ScrollView, StyleSheet, Text, View } from 'react-native'
import { socialFeedLight, colorsLight, innerDrawerLight } from '../Scripts/Styles.js'
import { socialFeedDark, colorsDark, innerDrawerDark } from '../Scripts/Styles.js'
import { useLinkTo } from '@react-navigation/native'
import LoadingScreen from '../Scripts/LoadingScreen.js'
import ActivityIndicatorView from '../Scripts/ActivityIndicatorView.js'

export default function ManagePlan() {
  const linkTo = useLinkTo()
  const [refreshing, setRefreshing] = useState(true)
  const [styles, setStyles] = useState(socialFeedLight)

  // Main stage controls.
  const [showActivityIndicator, setActivityIndicator] = useState(true)

  useEffect(() => {
    console.log('Welcome to manage plan.')
  },[])

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

          {showActivityIndicator && (<ActivityIndicatorView />)}

        </View>
      </View>
    </View>
  </ScrollView>)

}
