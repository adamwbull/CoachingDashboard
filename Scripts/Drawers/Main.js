import { StatusBar } from 'expo-status-bar'
import React, { useState, useEffect } from 'react'
import { TouchableOpacity, Animated, StyleSheet, Text, View } from 'react-native'
import { createStackNavigator } from '@react-navigation/stack'
import { NavigationContainer, useLinkTo, Link } from '@react-navigation/native'
import { createDrawerNavigator } from '@react-navigation/drawer'
import { Icon } from 'react-native-elements'
import { drawerLight, colorsLight, navLogo, btnColors, windowHeight } from '../Styles.js'
import { drawerDark, colorsDark } from '../StylesDark.js'
import { set, get, getTTL, ttl } from '../Storage.js'
import ReactFullscreen from 'react-easyfullscreen'

// Sub Drawers.
import Home from './Home.js'
import MobileApp from './MobileApp.js'
import Programs from './Programs.js'

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
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [dropdownVisible, setDropdownVisible] = useState(false)
  const [fromWelcome, setFromWelcome] = useState(false)

  const linkTo = useLinkTo()

  useEffect(() => {
    const sCoach = get('Coach')
    if (sCoach != null) {
      setCoach(sCoach)
      if (sCoach.Theme == 1) {
        setStyles(drawerDark)
        setColors(colorsDark)
      }
      var name = sCoach.FirstName + ' ' + sCoach.LastName.charAt(0) + '.'
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
    } else {
      linkTo('/welcome')
      setFromWelcome(true)
    }
  }, [fromWelcome])

  const onLoad = () => {
    Animated.timing(opacity, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start()
  }

  const toggleUserDropdown = () => {
    if (dropdownVisible) {
      setDropdownVisible(false)
    } else {
      setDropdownVisible(true)
      window.addEventListener('click', closeDropdown)
    }
  }

  const closeDropdown = () => {
    setDropdownVisible(false)
    window.removeEventListener('click', closeDropdown)
  }

  const logout = () => {
    console.log('Log out...')
    setFromWelcome(false)
    set('Coach',null,ttl)
    linkTo('/welcome')
  }

  return (<ReactFullscreen>
    {({ ref, onRequest, onExit }) => (
    <View style={{flex:1}} ref={ref}>
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
          {isFullscreen && (<TouchableOpacity style={styles.headerIcon} onPress={() => { setIsFullscreen(false); onExit() }}>
            <Icon
              name='contract'
              type='ionicon'
              size={21}
              color={colors.mainTextColor}
            />
          </TouchableOpacity>) || (<TouchableOpacity style={styles.headerIcon} onPress={() => { setIsFullscreen(true); onRequest() }}>
            <Icon
              name='scan'
              type='ionicon'
              size={21}
              color={colors.mainTextColor}
            />
          </TouchableOpacity>)}
          <View style={styles.headerIcon}>
            <Icon
              name='notifications'
              type='ionicon'
              size={21}
              color={colors.mainTextColor}
            />
          </View>
          <TouchableOpacity style={styles.headerUserBox} onPress={toggleUserDropdown}>
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
          </TouchableOpacity>

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
    </Drawer.Navigator>
    {dropdownVisible && (<View style={styles.dropdownBox}>
      <Link to="/manage-plan" style={styles.dropdownBoxText}>Manage Plan</Link>
      <TouchableOpacity style={styles.dropdownBoxLogoutContainer} onPress={logout}>
        <Icon
          name='log-out-outline'
          type='ionicon'
          size={20}
          color={btnColors.danger}
        />
        <Text style={styles.dropdownBoxLogout}>Logout</Text>
      </TouchableOpacity>
    </View>)}
  </View>)}</ReactFullscreen>)
}
