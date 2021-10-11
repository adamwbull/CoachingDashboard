import { StatusBar } from 'expo-status-bar'
import React, { useState, useEffect, createContext, useContext } from 'react'
import { StyleSheet, Text, View, useWindowDimensions } from 'react-native'
import { createStackNavigator } from '@react-navigation/stack'
import { NavigationContainer, useLinkTo } from '@react-navigation/native'
import { createDrawerNavigator } from '@react-navigation/drawer'
import { useFonts } from 'expo-font'
import { colorsLight } from './Scripts/Styles.js'
import { colorsDark } from './Scripts/StylesDark.js'
import { set, get, getTTL, ttl } from './Scripts/Storage.js'
import { refreshCoach } from './Scripts/API.js'
import { Provider } from './Scripts/Context.js'

import userContext from './Scripts/Context.js'


const linking = {
  prefixes: ['https://dashboard.coachsync.me', 'coachsync://'],
  config: {
    screens: {
      Welcome: 'welcome',
      SignUp: 'sign-up',
      ForgotPassword:'forgot-password',
      UpdatePassword:'update-password/:Token',
      UpdateEmail:'update-email/:Token',
      Main: {
        screens: {
          Home: {
            screens: {
              AllClients: 'clients',
              InviteClients: 'invite-clients',
              Payments: 'payments',
              FeatureBoard: 'features'
            }
          },
          Messages: 'messages',
          MobileApp: {
            screens: {
              BrandDesign: 'brand',
              SocialFeed: 'social-feed',
              Onboarding: 'onboarding',
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
          },
          Settings: {
            screens: {
              Account: 'account',
              ManagePlan: 'manage-plan',
              Integrations: 'integrations'
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
import ForgotPassword from './Scripts/ForgotPassword.js'
import UpdatePassword from './Scripts/UpdatePassword.js'
import UpdateEmail from './Scripts/UpdateEmail.js'

const Stack = createStackNavigator()

export default function App() {
  const linkTo = useLinkTo()
  const user = useContext(userContext)
  const [coach, setCoach] = useState(user)

  const [loaded] = useFonts({
    Poppins: require('./assets/fonts/Poppins.ttf'),
    PoppinsSemiBold: require('./assets/fonts/Poppins-SemiBold.ttf'),
    PoppinsBold: require('./assets/fonts/Poppins-Bold.ttf'),
    OCRA: require('./assets/fonts/OCRA.ttf')
  })

  const [colors, setColors] = useState(colorsLight)

  const MyTheme = {
    colors: {
      background:colors.secondaryBackground,
      primary:colors.mainTextColor,
      card:colors.mainBackground,
      border:colors.mainBackground,
      default:'#000'
    }
  };

  useEffect(() => {
    console.log('App.js: Context-Stored Coach -',coach)
    if (coach != null) {
      refreshCoach(coach.Id, coach.Token).then((res) => {
        setCoach(res)
        set('Coach',res,ttl)
      })
    }
  }, [])

  return (<Provider value={coach}>
    <NavigationContainer linking={linking} theme={MyTheme}>
      <Stack.Navigator headerMode='none'>
        <Stack.Screen name="Welcome" component={Welcome} options={{title:'Welcome - CoachSync'}} />
        <Stack.Screen name="SignUp" component={SignUp} options={{title:'Sign Up - CoachSync'}} />
        <Stack.Screen name="Main" component={Main} options={{title:'Home - CoachSync'}} />
        <Stack.Screen name="ForgotPassword" component={ForgotPassword} options={{title:'Forgot Password - CoachSync'}} />
        <Stack.Screen name="UpdatePassword" component={UpdatePassword} options={{title:'Update Password - CoachSync'}} />
        <Stack.Screen name="UpdateEmail" component={UpdateEmail} options={{title:'Update Email - CoachSync'}} />
      </Stack.Navigator>
    </NavigationContainer>
  </Provider>)
}
