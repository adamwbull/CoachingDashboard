import { StatusBar } from 'expo-status-bar'
import React, { useState, useEffect } from 'react'
import { Animated, StyleSheet, Text, View } from 'react-native'
import { createStackNavigator } from '@react-navigation/stack'
import { NavigationContainer, useLinkTo } from '@react-navigation/native'
import { createDrawerNavigator } from '@react-navigation/drawer'
import { Icon } from 'react-native-elements'
import { drawerLight, colorsLight, navLogo, btnColors } from '../Styles.js'
import { drawerDark, colorsDark } from '../StylesDark.js'
import { set, get, getTTL, ttl } from '../Storage.js'

// Sub Drawers.
import Home from './Home.js'
import MobileApp from './MobileApp.js'
import Programs from './Programs.js'
import Clients from './Clients.js'

// Create Sidebar.
const Drawer = createDrawerNavigator()

export default function Main() {
  const [styles, setStyles] = useState(drawerLight)
  const [colors, setColors] = useState(colorsLight)
  const [opacity, setOpacity] = useState(new Animated.Value(0))
  const [coach, setCoach] = useState({})
  const [headerPlan, setHeaderPlan] = useState({})
  const [planTitle, setPlanTitle] = useState('')
  const [userName, setUserName] = useState('')

  const linkTo = useLinkTo();

  useEffect(() => {
    const sCoach = get('Coach')
    if (sCoach != null) {
      setCoach(sCoach)
      if (sCoach.Theme == 1) {
        setStyles(drawerDark)
        setColors(colorsDark)
      }
      var name = sCoach.FirstName + ' ' + sCoach.LastName.charAt(0) + '.';
      setUserName(name)
      if (sCoach.Plan == 0) {
        setPlanTitle('Free Plan')
        setHeaderPlan({color:btnColors.primary})
      } else if (sCoach.Plan == 1) {
        setPlanTitle('Standard Plan')
        setHeaderPlan({color:btnColors.success})
      } else if (sCoach.Plan == 2) {
        setPlanTitle('Professional Plan')
        setHeaderPlan({color:btnColors.danger})
      }
    }
  }, [])

  const onLoad = () => {
    Animated.timing(opacity, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start()
  }

  return (<View style={{height:'100%',borderWidth:0}}>
    <View style={styles.header}>
      <View style={styles.headerLogoContainer}>
        <Animated.Image
            onLoad={onLoad}
            source={navLogo}
            resizeMode="contain"
            style={[
              {
                opacity: opacity,
                transform: [
                  {
                    scale: opacity.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.85, 1],
                    })
                  },
                ],
              },
              styles.headerLogo
            ]}
        />
      </View>
      <View style={styles.headerTextContainer}>
        <Text style={styles.headerText}>CoachSync</Text>
      </View>
      <View style={styles.headerMain}>
        <View style={styles.headerUser}>
          <View style={styles.headerIcon}>
            <Icon
              name='scan'
              type='ionicon'
              size={21}
              color={colors.mainTextColor}
            />
          </View>
          <View style={styles.headerIcon}>
            <Icon
              name='notifications'
              type='ionicon'
              size={21}
              color={colors.mainTextColor}
            />
          </View>
          <View style={styles.headerUserBox}>
            <Animated.Image
                onLoad={onLoad}
                source={{ uri: coach.Avatar }}
                resizeMode="contain"
                style={[
                  {
                    opacity: opacity,
                    transform: [
                      {
                        scale: opacity.interpolate({
                          inputRange: [0, 1],
                          outputRange: [0.85, 1],
                        })
                      },
                    ],
                  },
                  styles.headerAvatar
                ]}
            />
            <View style={styles.headerUserBoxText}>
              <Text style={styles.headerUserName}>{userName}</Text>
              <Text style={[styles.headerPlan,headerPlan]}>{planTitle}</Text>
            </View>
          </View>
        </View>
      </View>
      <View style={styles.messagesContainer}>
      <Icon
        name='chatbubbles-outline'
        type='ionicon'
        size={30}
        color={colors.mainTextColor}
      />
      </View>
    </View>
    <Drawer.Navigator
      drawerType='permanent'
      drawerStyle={styles.drawer}
      drawerContentOptions={{
        activeBackgroundColor:colors.mainBackground,
        style: {
        },
        contentContainerStyle: {
          margin:0,padding:0,
        },
        labelStyle: {
          borderWidth:0,
        },
        itemStyle: {
          padding:3,
          paddingLeft:7,
          marginRight:-3,
          justifyContent:'center',
          borderTopLeftRadius:10,
          borderBottomLeftRadius:10
        }
      }}
    >
      <Drawer.Screen name="Home" component={Home}
        options={{
          title:'Home - CoachSync',
          drawerIcon: ({focused, size}) => (
            <Icon
              name='home'
              type='ionicon'
              size={30}
              color={focused ? coach.SecondaryHighlight : colors.mainBackground}
            />
          )
        }}
      />
      <Drawer.Screen name="MobileApp" component={MobileApp}
        options={{
          title:'App - CoachSync',
          drawerIcon: ({focused, size}) => (
            <Icon
              name='color-palette'
              type='ionicon'
              size={30}
              color={focused ? coach.SecondaryHighlight : colors.mainBackground}
            />
          )
        }}
      />
      <Drawer.Screen name="Programs" component={Programs}
        options={{
          title:'Programs - CoachSync',
          drawerIcon: ({focused, size}) => (
            <Icon
              name='bulb'
              type='ionicon'
              size={30}
              color={focused ? coach.SecondaryHighlight : colors.mainBackground}
            />
          )
        }}
      />
      <Drawer.Screen name="Clients" component={Clients}
        options={{
          title:'Clients - CoachSync',
          drawerIcon: ({focused, size}) => (
            <Icon
              name='people'
              type='ionicon'
              size={30}
              color={focused ? coach.SecondaryHighlight : colors.mainBackground}
            />
          )
        }}
      />
    </Drawer.Navigator>
  </View>)
}
