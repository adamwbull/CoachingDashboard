import { StatusBar } from 'expo-status-bar'
import React, { useEffect, useState, useContext } from 'react'
import { ScrollView, StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native'
import { forgotPasswordLight, colorsLight, innerDrawerLight, btnColors, boxColors, messageBox } from '../Scripts/Styles.js'
import { forgotPasswordDark, colorsDark, innerDrawerDark } from '../Scripts/Styles.js'
import { useLinkTo } from '@react-navigation/native'
import LoadingScreen from '../Scripts/LoadingScreen.js'
import ActivityIndicatorView from '../Scripts/ActivityIndicatorView.js'
import { TextInput } from 'react-native-web'
import { set, get, getTTL, ttl } from './Storage.js'
import { Icon, Button, Chip } from 'react-native-elements'
import { forgotPasswordRequest } from './API.js'
import { Popup } from 'semantic-ui-react'

export default function FeatureBoard() {

  const linkTo = useLinkTo()

  const [styles, setStyles] = useState(forgotPasswordLight)
  const [colors, setColors] = useState(colorsLight)

  useEffect(() => {
    console.log('Welcome to forgot password.')
    if (coach != null) {
      linkTo('/clients')
    }
  }, [])

  return (<View>
  
  </View>)

}
