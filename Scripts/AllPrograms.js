import { StatusBar } from 'expo-status-bar'
import React, { useEffect, useState, useContext } from 'react'
import { ScrollView, StyleSheet, Text, View } from 'react-native'

import { programsLight, colorsLight, innerDrawerLight } from '../Scripts/Styles.js'
import { homeDark, colorsDark, innerDrawerDark } from '../Scripts/Styles.js'
import { useLinkTo, Link, useFocusEffect } from '@react-navigation/native'
import LoadingScreen from '../Scripts/LoadingScreen.js'
import { Helmet } from "react-helmet"
import { Icon, Button } from 'react-native-elements'
import { set, get, getTTL, ttl } from './Storage.js'
import { getPrograms } from './API.js'
 
import userContext from './Context.js'

export default function AllPrograms() {

  const linkTo = useLinkTo()
  const user = useContext(userContext)
  
  const [refreshing, setRefreshing] = useState(true)
  const [styles, setStyles] = useState(programsLight)
  const [colors, setColors] = useState(colorsLight)
  const [coach, setCoach] = useState(user)

  useEffect(() => {
    if (coach != null) {
      getData() 
    }
  },[])

  useFocusEffect(() => {
    getData()
  })

  // Main programs page functions.
  const getData = async () => {
    var data = await getPrograms(coach.Id, coach.Token)
    
  }

  const addProgram = () => {
    console.log ('Add new program...')
    linkTo('/new-program')
  }

  return (<ScrollView contentContainerStyle={styles.scrollView}>
    <View style={styles.container}>
      <View style={styles.main}>
        <View style={styles.body}>

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
