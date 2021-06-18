import { StatusBar } from 'expo-status-bar'
import React, { useEffect, useState, useContext } from 'react'
import { ScrollView, StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native'
import { allClientsLight, colorsLight, innerDrawerLight, btnColors, boxColors } from '../Scripts/Styles.js'
import { allClientsDark, colorsDark, innerDrawerDark } from '../Scripts/Styles.js'
import { useLinkTo } from '@react-navigation/native'
import LoadingScreen from '../Scripts/LoadingScreen.js'
import ActivityIndicatorView from '../Scripts/ActivityIndicatorView.js'
import { TextInput } from 'react-native-web'
import { set, get, getTTL, ttl } from './Storage.js'
import { Icon, Button, Chip } from 'react-native-elements'
import { confirmAlert } from 'react-confirm-alert' // Import
import 'react-confirm-alert/src/react-confirm-alert.css' // Import css
import { parseSimpleDateText, sqlToJsDate, getClientsData } from './API.js'
import { Dropdown, Accordion, Radio, Checkbox } from 'semantic-ui-react'
import DatePicker from 'react-date-picker/dist/entry.nostyle'
import './DatePickerClients/DatePicker.css'

import userContext from './Context.js'

export default function FeatureBoard() {

  const linkTo = useLinkTo()
  const user = useContext(userContext)

  const [styles, setStyles] = useState(allClientsLight)
  const [colors, setColors] = useState(colorsLight)

  // Main stage controls.
  const [showActivityIndicator, setActivityIndicator] = useState(true)
  const [showFeatureBoard, setShowFeatureBoard] = useState(false)
  const [showFeatureRequest, setShowFeatureRequest] = useState(false)
  const [showReleaseNotes, setShowReleaseNotes] = useState(false)

  // Main variables.
  const [coach, setCoach] = useState(user)

  // Feature board variables.
  const [featureRequests, setFeatureRequests] = useState([])

  // Submit feature idea variables.
  const [requestTitle, setRequestTitle] = useState('')
  const [requestBody, setRequestBody] = useState('')

  // Release notes variables.
  const [releaseNotes, setReleaseNotes] = useState([])

  // Main functions.
  const getFeatureData = async () => {
    var data = await fetchFeatureData(coach.Id, coach.Token)

    setFeatureRequests(data[0])
    setReleaseNotes(data[1])
    
  }

  useEffect(() => {
    console.log('Welcome to all clients.')
    if (coach != null) {
      refreshClients(coach.Id, coach.Token)
      // Stats info calculations. //
      var plan = coach.Plan
      if (plan == 1) {
        setActiveClientCountSuffix(' / 10 Active')
      } else if (plan == 2) {
        setActiveClientCountSuffix(' Active')
      }
      // ------------------------ //
      setTimeout(() => {
        setActivityIndicator(false)
        setShowFilters(true)
        setShowClients(true)
      }, 500)
    }
  }, [])

}
