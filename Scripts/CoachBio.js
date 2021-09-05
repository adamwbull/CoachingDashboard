import { StatusBar } from 'expo-status-bar'
import React, { useEffect, useState, useContext } from 'react'
import { TouchableOpacity, ScrollView, StyleSheet, Text, View } from 'react-native'
import { coachBioLight, colorsLight, innerDrawerLight, btnColors} from '../Scripts/Styles.js'
import { socialFeedDark, colorsDark, innerDrawerDark } from '../Scripts/Styles.js'
import { useLinkTo } from '@react-navigation/native'
import LoadingScreen from '../Scripts/LoadingScreen.js'
import ActivityIndicatorView from '../Scripts/ActivityIndicatorView.js'
import { Icon, Button, Chip } from 'react-native-elements'

import userContext from './Context.js'

export default function CoachBio() {

  const user = useContext(userContext)

  const linkTo = useLinkTo()
  const [refreshing, setRefreshing] = useState(true)
  const [styles, setStyles] = useState(coachBioLight)
  const [colors, setColors] = useState(colorsLight)

  // Main stage controls.
  const [showActivityIndicator, setShowActivityIndicator] = useState(true)
  
  const [showBio, setShowBio] = useState(false)

  // Main variables.
  const [coach, setCoach] = useState(user)

  const getData = async () => {

    setShowActivityIndicator(false)
    setShowBio(true)

  }

  useEffect(() => {
    console.log('Welcome to Coach Bio.')
    if (coach != null) {
      // Load page.
      getData()
    } else {
      linkTo('/welcome')
    }
  },[])

  return (<ScrollView contentContainerStyle={styles.scrollView}>
    <View style={styles.container}>
      <View style={styles.main}>
        <View style={styles.body}>

          {showActivityIndicator && (<ActivityIndicatorView />)}

          {showBio && (<View style={styles.socialFeed}>
          </View>)}

        </View>
      </View>
    </View>
  </ScrollView>)

}
