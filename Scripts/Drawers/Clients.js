import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { homeLight, colorsLight, innerDrawerLight } from '../Styles.js';
import { homeDark, colorsDark, innerDrawerDark } from '../StylesDark.js';
import { useLinkTo } from '@react-navigation/native';
import LoadingScreen from '../LoadingScreen.js';
import { Icon } from 'react-native-elements'
import { createDrawerNavigator } from '@react-navigation/drawer'
import { set, get, getTTL, ttl } from '../Storage.js'

// Create drawer.
const Drawer = createDrawerNavigator()

// Items.
import Overview from '../Overview.js'
import AllClients from '../AllClients.js'
import InviteClients from '../InviteClients.js'

export default function Clients() {
  const linkTo = useLinkTo();
  const [refreshing, setRefreshing] = useState(true);
  const [styles, setStyles] = useState(homeLight);
  const [colors, setColors] = useState(colorsLight)
  const [drawerStyles, setDrawerStyles] = useState(innerDrawerLight)
  const [coach, setCoach] = useState({})

  useEffect(() => {
    const sCoach = get('Coach')
    if (sCoach != null) {
      setCoach(sCoach)
      if (sCoach.Theme == 1) {
        setStyles(drawerDark)
        setColors(colorsDark)
      }
    }

  }, [])

  return (<View style={{height:'100%'}}>
    <View style={drawerStyles.drawerTop}>
      <Text style={drawerStyles.drawerTopTitle}>Clients</Text>
    </View>
    <Drawer.Navigator
      drawerType='permanent'
      drawerStyle={drawerStyles.drawer}
      sceneContainerStyle={{
        borderWidth:0,
      }}
      screenContainerStyle={{}}
      drawerContentOptions={{
        activeBackgroundColor:colors.mainBackground,
        activeTintColor:coach.SecondaryHighlight,
        inactiveTintColor:colors.mainTextColor,
        style: {
        },
        contentContainerStyle: {
        },
        labelStyle: {

        },
        itemStyle: {
          marginBottom:0,
          marginTop:0,
          paddingLeft:3,
        }
      }}
    >

    </Drawer.Navigator>
  </View>)

}
