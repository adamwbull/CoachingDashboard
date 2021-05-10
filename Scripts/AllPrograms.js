import { StatusBar } from 'expo-status-bar'
import React, { useEffect, useState } from 'react'
import { ScrollView, StyleSheet, Text, View } from 'react-native'

import { programsLight, colorsLight, innerDrawerLight } from '../Scripts/Styles.js'
import { homeDark, colorsDark, innerDrawerDark } from '../Scripts/Styles.js'
import { useLinkTo, Link } from '@react-navigation/native'
import LoadingScreen from '../Scripts/LoadingScreen.js'
import { Helmet } from "react-helmet"
import { Icon, Button } from 'react-native-elements'
import { set, get, getTTL, ttl } from './Storage.js'

export default function AllPrograms() {
  const linkTo = useLinkTo()
  const [refreshing, setRefreshing] = useState(true)
  const [styles, setStyles] = useState(programsLight)
  const [colors, setColors] = useState(colorsLight)
  const [coach, setCoach] = useState({})

  // Stage controls.
  const [paymentsDisabled, setPaymentsDisabled] = useState(true)
  const [contractsDisabled, setContractsDisabled] = useState(true)

  // Data.
  const [concepts, setConcepts] = useState([])
  const [pdfs, setPDFs] = useState([])

  useEffect(() => {
    const sCoach = get('Coach')
    if (sCoach != null) {
      setCoach(sCoach)
    }
  },[])

  // Text prompt controls.
  const addProgram = () => {
    console.log ('Add new program...')
  }

  return (<ScrollView contentContainerStyle={styles.scrollView}>
    <View style={styles.container}>
      <View style={styles.main}>
        <View style={styles.body}>
          <View style={styles.bodyHeader}>
            <View style={styles.bodyTitleGroup}>
              <Text style={styles.bodyTitle}>Programs</Text>
              <Text style={styles.bodyDesc}>Courses built from Prompts and Concepts.</Text>
            </View>
          </View>

          <View style={styles.promptListContainer}>
            <View style={styles.promptHeader}>
              <Text style={styles.promptHeaderTitle}>All Programs</Text>
              <Text style={styles.promptHeaderCount}>{0} total</Text>
            </View>
            <View style={styles.promptsColumn}>
              <View style={styles.addPromptContainer}>
                <Button
                title='Add Program'
                titleStyle={styles.promptAddButtonTitle}
                buttonStyle={styles.promptAddButton}
                containerStyle={styles.promptAddButtonContainer}
                onPress={addProgram} />
              </View>
            </View>
          </View>

        </View>
      </View>
    </View>
  </ScrollView>)

}
