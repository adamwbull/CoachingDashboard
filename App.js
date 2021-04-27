import { StatusBar } from 'expo-status-bar'
import React, { useState, useEffect } from 'react'
import { StyleSheet, Text, View, useWindowDimensions } from 'react-native'
import { createStackNavigator } from '@react-navigation/stack'
import { NavigationContainer, useLinkTo } from '@react-navigation/native'
import { createDrawerNavigator } from '@react-navigation/drawer'
import { useFonts } from 'expo-font'
import { colorsLight } from './Scripts/Styles.js'
import { colorsDark } from './Scripts/StylesDark.js'
import { set, get, getTTL, ttl } from './Scripts/Storage.js'

const linking = {
  prefixes: ['https://mychat.com', 'mychat://'],
  config: {
    screens: {
      Welcome: 'welcome',
      SignUp: 'sign-up',
      Main: {
        screens: {
          Home: {
            screens: {
              Overview: 'home',
              Stats: 'stats',
              AllClients: 'clients',
              InviteClients: 'invite-clients'
            }
          },
          MobileApp: {
            screens: {
              BrandDesign: 'brand',
              SocialFeed: 'social-feed',
              Notifications: 'notifications'
            }
          },
          Programs: {
            screens: {
              AllPrograms: 'programs',
              Prompts: 'prompts',
              Concepts: 'concepts',
              AddProgram: 'new-program'
            }
          }
        }
      }
    }
  },
}

// Import Main Drawer.
import Main from './Scripts/Drawers/Main.js'

// Import auth flow.
import Welcome from './Scripts/Welcome.js'
import SignUp from './Scripts/SignUp.js'


const Stack = createStackNavigator()

export default function App() {
  const linkTo = useLinkTo()

  const [loaded] = useFonts({
    Poppins: require('./assets/fonts/Poppins.ttf'),
    PoppinsSemiBold: require('./assets/fonts/Poppins-SemiBold.ttf'),
    PoppinsBold: require('./assets/fonts/Poppins-Bold.ttf'),
  })
  const [colors, setColors] = useState(colorsLight)


  const MyTheme = {
    colors: {
      background:colors.secondaryBackground,
      primary:colors.mainTextColor,
      card:colors.mainBackground,
      border:colors.mainBackground
    }
  };

  useEffect(() => {
    const sCoach = get('Coach')
    if (sCoach != null) {
      if (sCoach.Theme == 1) {
        setColors(colorsDark)
      }
    } else {
      linkTo('/welcome')
    }
  }, [])

  return (
    <NavigationContainer linking={linking} theme={MyTheme}>
      <Stack.Navigator headerMode='none'>
        <Stack.Screen name="Welcome" component={Welcome} />
        <Stack.Screen name="SignUp" component={SignUp} />
        <Stack.Screen name="Main" component={Main} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}
