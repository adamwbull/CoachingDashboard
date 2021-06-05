import { StatusBar } from 'expo-status-bar'
import React, { useEffect, useState } from 'react'
import { ScrollView, StyleSheet, Text, View, Image } from 'react-native'
import { allClientsLight, colorsLight, innerDrawerLight } from '../Scripts/Styles.js'
import { allClientsDark, colorsDark, innerDrawerDark } from '../Scripts/Styles.js'
import { useLinkTo } from '@react-navigation/native'
import LoadingScreen from '../Scripts/LoadingScreen.js'
import ActivityIndicatorView from '../Scripts/ActivityIndicatorView.js'
import { TextInput } from 'react-native-web'
import { set, get, getTTL, ttl } from './Storage.js'
import { Icon, Button, ButtonGroup } from 'react-native-elements'
import { confirmAlert } from 'react-confirm-alert' // Import
import 'react-confirm-alert/src/react-confirm-alert.css' // Import css

import { parseSimpleDateText, sqlToJsDate, getClients } from './API.js'

export default function AllClients() {

  const linkTo = useLinkTo()
  const [refreshing, setRefreshing] = useState(true)
  const [styles, setStyles] = useState(allClientsLight)

  // Main stage controls.
  const [showActivityIndicator, setActivityIndicator] = useState(true)
  const [showStats, setShowStats] = useState(false)
  const [showClients, setShowClients] = useState(false)
  const [showClientData, setShowClientData] = useState(false)

  // Main variables.
  const [coach, setCoach] = useState({})

  // Stats variables.
  const [clientCount, setClientCount] = useState(0)
  const [activeClientCount, setActiveClientCount] = useState(0)
  const [activeClientCountSuffix, setActiveClientCountSuffix] = useState(' / 3 Active Clients')

  // All clients variables.
  const [clients, setClients] = useState([])

  // Client data variables.
  const [clientData, setClientData] = useState({})
  // FirstName, LastName, Email, Avatar, DoB, Created, ConceptsCompletedCnt, PromptsCompletedCnt.

  // Stats functions.


  // All clients functions.
  const refreshClients = async (id, token) => {
    var refresh = JSON.parse(JSON.stringify(await getClients(id, token)));
    // Supply selected variable for group management.
    var len = refresh.length;
    var activeLen = 0
    for (var i = 0; i < len; i++) {
      refresh[i].Selected = false
      if (refresh[i].Active == true) {
        activeLen += 1
      }
    }
    setActiveClientCount(activeLen)
    setClientCount(len)
    setClients(refresh)
  }

  // Client data variables.
  // Damn final projects.


  useEffect(() => {
    console.log('Welcome to all clients.')
    const sCoach = get('Coach')
    if (sCoach != null) {
      refreshClients(sCoach.Id, sCoach.Token)
      // Stats info calculations. //
      var plan = sCoach.Plan
      if (plan == 1) {
        setActiveClientCountSuffix(' / 10 Active Clients')
      } else if (plan == 2) {
        setActiveClientCountSuffix(' Active Clients')
      }
      // ------------------------ //
      setCoach(sCoach)
      setTimeout(() => {
        setActivityIndicator(false)
        setShowStats(true)
        setShowClients(true)
      }, 500)
    }
  }, [])

  return (<ScrollView contentContainerStyle={styles.scrollView}>
    <View style={styles.container}>
      <View style={styles.main}>
        <View style={styles.body}>

          <View style={styles.bodyHeader}>
            <View style={styles.bodyTitleGroup}>
              <Text style={styles.bodyTitle}>Clients</Text>
              <Text style={styles.bodyDesc}>View and manage your clients.</Text>
            </View>
          </View>

          {showActivityIndicator && (<ActivityIndicatorView />)}

          {showStats && (<View style={styles.bodyContainer}>
            <Text></Text>
          </View>)}

          {showClients /*&& (<View style={styles.bodyContainer}>
            <Text style={styles.bodySubtitle}>All Clients</Text>
            <View style={styles.clientOptions}>
            </View>
            <View style={styles.clientList}>
            {clients.map((client, index) => {
              //
              return (<View key={index} style={styles.clientListItem}>
                <View style={styles.clientListItemTop}>
                  <Icon
                    name='square-outline'
                    type='ionicon'
                    size={22}
                    color={colors.mainTextColor}
                    style={{}}
                  />
                  <Text style={styles.clientListName}>
                    {client.FirstName + ' ' + client.LastName}
                  </Text>
                  <Text style={styles.clientListJoined}>
                    {parseSimpleDateText(sqlToJsDate(client.Created))}
                  </Text>
                </View>
                <View style={styles.clientListItemBottom}>
                </View>
              </View>)
            })}
            </View>
          </View>)*/}

          {showClientData && (<View style={styles.bodyContainer}>
            <View style={styles.clientInfoRow}>
              <Image uri={clientData.Avatar} style={styles.clientImage} />
              <View style={styles.clientStats}>
                <View style={styles.clientStatGroup}>
                  <Text style={styles.clientStatNum}>{clientData.PromptsCompletedCnt}</Text>
                  <Text style={styles.clientStatDesc}>Prompts</Text>
                </View>
                <View style={styles.clientStatGroup}>
                  <Text style={styles.clientStatNum}>{clientData.ConceptsCompletedCnt}</Text>
                  <Text style={styles.clientStatDesc}>Concepts</Text>
                </View>
                <Text style={styles.clientStatsText}>Completed</Text>
              </View>
            </View>
            <View style={styles.clientInfoRow}>
              <Text style={styles.bodySubtitle}>{clientData.FirstName + ' ' + clientData.LastName}</Text>
              <View style={styles.clientJoined}>
                <Text style={styles.clientJoinedTitle}>Joined</Text>
                <Text style={styles.clientJoinedText}>{parseSimpleDateText(sqlToJsDate(clientData.Created))}</Text>
              </View>
            </View>
          </View>)}

        </View>
      </View>
    </View>
  </ScrollView>)

}
