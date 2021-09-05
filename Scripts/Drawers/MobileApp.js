/* eslint-disable react/prop-types */
/* eslint-disable react/display-name */
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { TouchableOpacity, ScrollView, StyleSheet, Text, View } from 'react-native';
;
import { homeLight, colorsLight, innerDrawerLight } from '../Styles.js';
import { homeDark, colorsDark, innerDrawerDark } from '../StylesDark.js';
import { useLinkTo, useRoute, getFocusedRouteNameFromRoute } from '@react-navigation/native';
import LoadingScreen from '../LoadingScreen.js';
import { Icon } from 'react-native-elements'
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer'
import { set, get, getTTL, ttl } from '../Storage.js'
import { Popup } from 'semantic-ui-react'

// Create Drawer Content.
function DrawerContent(props) {

  const [colors, setColors] = useState(colorsLight)
  const [drawerStyles, setDrawerStyles] = useState(innerDrawerLight)
  const [info, setInfo] = useState({
    Header:'',
    Body:'',
    Wiki:''
  })
  
  useEffect(() => {
    var loc = props.loc
    var i = {
      Header:'',
      Body:'',
      Wiki:''
    }
    if (loc == 'BrandDesign') {
      i = {
        Header:'Brand Design',
        Body:'Customize your Client\'s in-app experience. Click to learn more!',
        Wiki:'https://wiki.coachsync.me/en/mobile-app/brand-design'
      }
    } else if (loc == 'SocialFeed') {
      i = {
        Header:'Social Feed',
        Body:'Customize and add posts seen by all Clients. Click to learn more!',
        Wiki:'https://wiki.coachsync.me/en/mobile-app/social-feed'
      } 
    } else if (loc == 'Onboarding') {
      i = {
        Header:'Onboarding',
        Body:'Customize the onboarding experience for your clients. Click to learn more!',
        Wiki:'https://wiki.coachsync.me/en/mobile-app/onboarding'
      } 
    } else if (loc == 'CoachBio') {
      i = {
        Header:'Coach Bio',
        Body:'Customize your public profile visible to all clients. Click to learn more!',
        Wiki:'https://wiki.coachsync.me/en/mobile-app/coach-bio'
      } 
    }
    setInfo(i)
  }, [props.loc])

  return (<View style={{justifyContent:'space-between',height:'100%'}}>
    <DrawerContentScrollView {...props} contentContainerStyle={{
      flex:1
    }}>
      <DrawerItemList {...props} />
    </DrawerContentScrollView>
    <View style={drawerStyles.pageInfo}>
      <Popup
        trigger={<TouchableOpacity style={drawerStyles.pageInfoHeader} onPress={() => window.open(info.Wiki, '_blank')}>
          <Icon
            name='help-circle-outline'
            type='ionicon'
            size={25}
            color={colors.mainTextColor}
            style={{}}
          />
          <Text style={drawerStyles.pageInfoHeaderText}>{info.Header}</Text>
        </TouchableOpacity>}
        position={'top center'}
        content={info.Body}
        inverted
        style={{textAlign:'center'}}
      />
    </View>
  </View>)

}

// Create drawer.
const Drawer = createDrawerNavigator()

// Items.
import Overview from '../Overview.js'
import BrandDesign from '../BrandDesign.js'
import SocialFeed from '../SocialFeed.js'
import Onboarding from '../Onboarding.js'
import Notifications from '../Notifications.js'
import CoachBio from '../CoachBio.js'

export default function MobileApp() {
  const linkTo = useLinkTo();
  const [refreshing, setRefreshing] = useState(true);
  const [styles, setStyles] = useState(homeLight);
  const [colors, setColors] = useState(colorsLight)
  const [drawerStyles, setDrawerStyles] = useState(innerDrawerLight)
  const [coach, setCoach] = useState({})
  
  const [loc, setLoc] = useState('')
  var route = useRoute()
  const routeName = getFocusedRouteNameFromRoute(route)

  const getRoute = () => {
    setLoc(routeName)
  }

  useEffect(() => {
    getRoute()
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
      <Text style={drawerStyles.drawerTopTitle}>Mobile App</Text>
    </View>
    <Drawer.Navigator
      drawerContent={props => <DrawerContent {...props} loc={loc} />}
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
      <Drawer.Screen name="BrandDesign" component={BrandDesign}
        listeners={{
          focus: () => {
            setLoc('BrandDesign')
          }
        }}
        options={{
          title:'Brand - CoachSync',
          drawerIcon: ({focused, size}) => (
            <Icon
              name='color-palette'
              type='ionicon'
              size={20}
              style={{backgroundColor:''}}
              color={focused ? coach.SecondaryHighlight : colors.mainTextColor}
            />
          ),
          drawerLabel:({focused}) => {
            const color = focused ? coach.SecondaryHighlight : colors.mainTextColor
            return (<Text style={{marginLeft:-25,fontSize:14,fontFamily:'Poppins',color:color}}>Brand</Text>)
          }
        }}
      />
      <Drawer.Screen name="CoachBio" component={CoachBio}
        listeners={{
          focus: () => {
            setLoc('CoachBio')
          }
        }}
        options={{
          title:'Coach Bio - CoachSync',
          drawerIcon: ({focused, size}) => (
            <Icon
              name='person-circle'
              type='ionicon'
              size={20}
              style={{backgroundColor:''}}
              color={focused ? coach.SecondaryHighlight : colors.mainTextColor}
            />
          ),
          drawerLabel:({focused}) => {
            const color = focused ? coach.SecondaryHighlight : colors.mainTextColor
            return (<Text style={{marginLeft:-25,fontSize:14,fontFamily:'Poppins',color:color}}>Coach Bio</Text>)
          }
        }}
      />
      <Drawer.Screen name="SocialFeed" component={SocialFeed}
        listeners={{
          focus: () => {
            setLoc('SocialFeed')
          }
        }}
        options={{
          title:'Social Feed - CoachSync',
          drawerIcon: ({focused, size}) => (
            <Icon
              name='albums'
              type='ionicon'
              size={20}
              style={{backgroundColor:''}}
              color={focused ? coach.SecondaryHighlight : colors.mainTextColor}
            />
          ),
          drawerLabel:({focused}) => {
            const color = focused ? coach.SecondaryHighlight : colors.mainTextColor
            return (<Text style={{marginLeft:-25,fontSize:14,fontFamily:'Poppins',color:color}}>Social Feed</Text>)
          }
        }}
      />
      <Drawer.Screen name="Onboarding" component={Onboarding}
        listeners={{
          focus: () => {
            setLoc('Onboarding')
          }
        }}
        options={{
          title:'Onboarding - CoachSync',
          drawerIcon: ({focused, size}) => (
            <Icon
              name='easel'
              type='ionicon'
              size={20}
              style={{backgroundColor:''}}
              color={focused ? coach.SecondaryHighlight : colors.mainTextColor}
            />
          ),
          drawerLabel:({focused}) => {
            const color = focused ? coach.SecondaryHighlight : colors.mainTextColor
            return (<Text style={{marginLeft:-25,fontSize:14,fontFamily:'Poppins',color:color}}>Onboarding</Text>)
          }
        }}
      />
    </Drawer.Navigator>
  </View>)

}
