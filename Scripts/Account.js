import { StatusBar } from 'expo-status-bar'
import React, { useEffect, useState } from 'react'
import { ScrollView, StyleSheet, Text, View } from 'react-native'
import { socialFeedLight, colorsLight, innerDrawerLight } from '../Scripts/Styles.js'
import { socialFeedDark, colorsDark, innerDrawerDark } from '../Scripts/Styles.js'
import { useLinkTo } from '@react-navigation/native'
import LoadingScreen from '../Scripts/LoadingScreen.js'
import ActivityIndicatorView from '../Scripts/ActivityIndicatorView.js'

export default function Account() {
  const linkTo = useLinkTo()
  const [refreshing, setRefreshing] = useState(true)
  const [styles, setStyles] = useState(socialFeedLight)

  // Main stage controls.
  const [showActivityIndicator, setActivityIndicator] = useState(true)

  useEffect(() => {
    console.log('Welcome to account.')
  },[])

  return (<ScrollView contentContainerStyle={styles.scrollView}>
    <View style={styles.container}>
      <View style={styles.main}>
        <View style={styles.body}>

          <View style={styles.bodyHeader}>
            <View style={styles.bodyTitleGroup}>
              <Text style={styles.bodyTitle}>Account</Text>
              <Text style={styles.bodyDesc}>Customize your account settings.</Text>
            </View>
          </View>

          {showActivityIndicator && (<ActivityIndicatorView />)}

        </View>
      </View>
    </View>
  </ScrollView>)

}
