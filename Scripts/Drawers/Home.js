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
import Stats from '../Stats.js'
import AllClients from '../AllClients.js'
import InviteClients from '../InviteClients.js'

export default function Home() {
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
      <Text style={drawerStyles.drawerTopTitle}>Home</Text>
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
      <Drawer.Screen name="Overview" component={Overview}
        options={{
          title:'Overview - CoachSync',
          drawerIcon: ({focused, size}) => (
            <Icon
              name='apps'
              type='ionicon'
              size={20}
              style={{backgroundColor:''}}
              color={focused ? coach.SecondaryHighlight : colors.mainTextColor}
            />
          ),
          drawerLabel:({focused}) => {
            const color = focused ? coach.SecondaryHighlight : colors.mainTextColor
            return (<Text style={{marginLeft:-25,fontSize:14,fontFamily:'Poppins',color:color}}>Overview</Text>)
          }
        }}
      />
      <Drawer.Screen name="Stats" component={Stats}
        options={{
          title:'Stats - CoachSync',
          drawerIcon: ({focused, size}) => (
            <Icon
              name='stats-chart'
              type='ionicon'
              size={20}
              style={{backgroundColor:''}}
              color={focused ? coach.SecondaryHighlight : colors.mainTextColor}
            />
          ),
          drawerLabel:({focused}) => {
            const color = focused ? coach.SecondaryHighlight : colors.mainTextColor
            return (<Text style={{marginLeft:-25,fontSize:14,fontFamily:'Poppins',color:color}}>Statistics</Text>)
          }
        }}
      />
      <Drawer.Screen name="AllClients" component={AllClients}
        options={{
          title:'Clients - CoachSync',
          drawerIcon: ({focused, size}) => (
            <Icon
              name='people'
              type='ionicon'
              size={20}
              style={{backgroundColor:''}}
              color={focused ? coach.SecondaryHighlight : colors.mainTextColor}
            />
          ),
          drawerLabel:({focused}) => {
            const color = focused ? coach.SecondaryHighlight : colors.mainTextColor
            return (<Text style={{marginLeft:-25,fontSize:14,fontFamily:'Poppins',color:color}}>Clients</Text>)
          }
        }}
      />
      <Drawer.Screen name="InviteClients" component={InviteClients}
        options={{
          title:'Invite Clients - CoachSync',
          drawerIcon: ({focused, size}) => (
            <Icon
              name='add'
              type='ionicon'
              size={20}
              style={{backgroundColor:''}}
              color={focused ? coach.SecondaryHighlight : colors.mainTextColor}
            />
          ),
          drawerLabel:({focused}) => {
            const color = focused ? coach.SecondaryHighlight : colors.mainTextColor
            return (<Text style={{marginLeft:-25,fontSize:14,fontFamily:'Poppins',color:color}}>Invite Clients</Text>)
          }
        }}
      />
    </Drawer.Navigator>
  </View>)

}
