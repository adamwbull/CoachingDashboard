/* eslint-disable react/prop-types */
/* eslint-disable react/display-name */
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { TouchableOpacity, ScrollView, StyleSheet, Text, View } from 'react-native';
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
    if (loc == 'Account') {
      i = {
        Header:'Account',
        Body:'Customize your account settings. Click to learn more!',
        Wiki:''
      } 
    } else if (loc == 'ManagePlan') {
      i = {
        Header:'Manage Plan',
        Body:'View invoices, upgrade, or downgrade your CoachSync plan. Click to learn more!',
        Wiki:'https://wiki.coachsync.me/en/account/manage-plan'
      } 
    } else if (loc == 'Integrations') {
      i = {
        Header:'Integrations',
        Body:'Connect with other software and services. Click to learn more!',
        Wiki:'https://wiki.coachsync.me/en/account/integrations'
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
import Account from '../Account.js'
import ManagePlan from '../ManagePlan.js'
import Integrations from '../Integrations.js'

export default function Settings() {
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
      <Text style={drawerStyles.drawerTopTitle}>Settings</Text>
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
      <Drawer.Screen name="Account" component={Account}
        listeners={{
          focus: () => {
            setLoc('Account')
          }
        }}
        options={{
          title:'Account - CoachSync',
          drawerIcon: ({focused, size}) => (
            <Icon
              name='person'
              type='ionicon'
              size={20}
              style={{backgroundColor:''}}
              color={focused ? coach.SecondaryHighlight : colors.mainTextColor}
            />
          ),
          drawerLabel:({focused}) => {
            const color = focused ? coach.SecondaryHighlight : colors.mainTextColor
            return (<Text style={{marginLeft:-25,fontSize:14,fontFamily:'Poppins',color:color}}>Account</Text>)
          }
        }}
      />
      <Drawer.Screen name="ManagePlan" component={ManagePlan} 
        listeners={{
          focus: () => {
            setLoc('ManagePlan')
          }
        }}
        options={{
          title:'Manage Plan - CoachSync',
          drawerIcon: ({focused, size}) => (
            <Icon
              name='rocket'
              type='ionicon'
              size={20}
              style={{backgroundColor:''}}
              color={focused ? coach.SecondaryHighlight : colors.mainTextColor}
            />
          ),
          drawerLabel:({focused}) => {
            const color = focused ? coach.SecondaryHighlight : colors.mainTextColor
            return (<Text style={{marginLeft:-25,fontSize:14,fontFamily:'Poppins',color:color}}>Manage Plan</Text>)
          }
        }}
      />
      <Drawer.Screen name="Integrations" component={Integrations}
        listeners={{
          focus: () => {
            setLoc('Integrations')
          }
        }}
        options={{
          title:'Integrations - CoachSync',
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
            return (<Text style={{marginLeft:-25,fontSize:14,fontFamily:'Poppins',color:color}}>Integrations</Text>)
          }
        }}
      />
    </Drawer.Navigator>
  </View>)

}
