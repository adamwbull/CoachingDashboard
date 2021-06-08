/* eslint-disable react/prop-types */
/* eslint-disable react/display-name */
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
;
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
import AllPrograms from '../AllPrograms.js'
import Prompts from '../Prompts.js'
import Concepts from '../Concepts.js'
import AddProgram from '../AddProgram.js'

export default function Programs() {
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
      <Text style={drawerStyles.drawerTopTitle}>Programs</Text>
    </View>
    <Drawer.Navigator
      drawerType='permanent'
      drawerStyle={drawerStyles.drawer}
      sceneContainerStyle={{
        height:'100%' + 60,
        marginTop:-60
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
    <Drawer.Screen name="AllPrograms" component={AllPrograms}
      options={{
        title:'All Programs - CoachSync',
        drawerIcon: ({focused, size}) => (
          <Icon
            name='clipboard'
            type='ionicon'
            size={20}
            style={{backgroundColor:''}}
            color={focused ? coach.SecondaryHighlight : colors.mainTextColor}
          />
        ),
        drawerLabel:({focused}) => {
          const color = focused ? coach.SecondaryHighlight : colors.mainTextColor
          return (<Text style={{marginLeft:-25,fontSize:14,fontFamily:'Poppins',color:color}}>All Programs</Text>)
        }
      }}
    />
    <Drawer.Screen name="Prompts" component={Prompts}
      options={{
        title:'Prompts - CoachSync',
        drawerIcon: ({focused, size}) => (
          <Icon
            name='compass'
            type='ionicon'
            size={20}
            style={{backgroundColor:''}}
            color={focused ? coach.SecondaryHighlight : colors.mainTextColor}
          />
        ),
        drawerLabel:({focused}) => {
          const color = focused ? coach.SecondaryHighlight : colors.mainTextColor
          return (<Text style={{marginLeft:-25,fontSize:14,fontFamily:'Poppins',color:color}}>Prompts</Text>)
        }
      }}
    />
    <Drawer.Screen name="Concepts" component={Concepts}
      options={{
        title:'Concepts - CoachSync',
        drawerIcon: ({focused, size}) => (
          <Icon
            name='library'
            type='ionicon'
            size={20}
            style={{backgroundColor:''}}
            color={focused ? coach.SecondaryHighlight : colors.mainTextColor}
          />
        ),
        drawerLabel:({focused}) => {
          const color = focused ? coach.SecondaryHighlight : colors.mainTextColor
          return (<Text style={{marginLeft:-25,fontSize:14,fontFamily:'Poppins',color:color}}>Concepts</Text>)
        }
      }}
    />
    <Drawer.Screen name="AddProgram" component={AddProgram}
      options={{
        title:'New Program - CoachSync',
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
          return (<Text style={{marginLeft:-25,fontSize:14,fontFamily:'Poppins',color:color}}>New Program</Text>)
        }
      }}
    />
    </Drawer.Navigator>
  </View>)

}
