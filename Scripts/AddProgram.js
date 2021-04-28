import { StatusBar } from 'expo-status-bar'
import React, { useEffect, useState } from 'react'
import { ScrollView, StyleSheet, Text, View } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { addProgramLight, colorsLight } from '../Scripts/Styles.js'
import { homeDark, colorsDark, innerDrawerDark } from '../Scripts/Styles.js'
import { useLinkTo, Link } from '@react-navigation/native'
import LoadingScreen from '../Scripts/LoadingScreen.js'
import { Helmet } from "react-helmet"
import { Icon, Button } from 'react-native-elements'
import { set, get, getTTL, ttl } from './Storage.js'

export default function AddProgram() {
  const linkTo = useLinkTo()
  const [refreshing, setRefreshing] = useState(true)
  const [styles, setStyles] = useState(addProgramLight)
  const [colors, setColors] = useState(colorsLight)
  const [coach, setCoach] = useState({})

  // Stage controls.
  const [showMain, setMain] = useState(false)

  // Task controls.
  const [taskTitle, setTaskTitle] = useState('')
  const [task, setTask] = useState({})

  // Data.
  const [taskList, setTaskList] = useState([])
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
              <Text style={styles.bodyTitle}>Add Program</Text>
              <Text style={styles.bodyDesc}></Text>
            </View>
          </View>

          <View style={styles.addProgramContainer}>
            <View style={styles.addProgramListContainer}>
              <Button
                title='Add Task'
                buttonStyle={styles.addProgramListButton}
                containerStyle={styles.addProgramListButtonContainer}
              />
              <ScrollView contentContainerStyle={styles.addProgramList}>

              </ScrollView>
            </View>
            <View style={styles.addProgramMainContainer}>
              {showMain &&
              (<View style={styles.addProgramMain}>
                <View style={styles.addProgramMainHeader}>
                  <Text style={styles.addProgramMainHeaderTitle}>{taskTitle}</Text>
                </View>
              </View>)
              ||
              (<Text style={styles.addProgramMainEmptyText}>
                {taskList.length > 0 && ('Select a task to configure.') || ('Add a task to configure.')}
              </Text>)}
            </View>
          </View>

        </View>
      </View>
    </View>
  </ScrollView>)

}
