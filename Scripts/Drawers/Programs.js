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
    if (loc == 'AllPrograms') {
      i = {
        Header:'Programs',
        Body:'Courses built from Prompts and Concepts. Click to learn more!',
        Wiki:'https://wiki.coachsync.me/en/programs/managing-programs'
      } 
    } else if (loc == 'Prompts') {
      i = {
        Header:'Prompts',
        Body:'Content for Clients to interact with. Click to learn more!',
        Wiki:'https://wiki.coachsync.me/en/programs/prompts'
      } 
    } else if (loc == 'Concepts') {
      i = {
        Header:'Concepts',
        Body:'Knowledge and PDFs for Clients to view. Click to learn more!',
        Wiki:'https://wiki.coachsync.me/en/programs/concepts'
      } 
    } else if (loc == 'AddProgram') {
      i = {
        Header:'New Program',
        Body:'Create a program for Clients. Click to learn more!',
        Wiki:'https://wiki.coachsync.me/en/programs/creating-programs'
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

  return (<View style={{height:'100%',justifyContent:'space-between'}}>
    <View style={{flex:1}}>
      <View style={drawerStyles.drawerTop}>
        <Text style={drawerStyles.drawerTopTitle}>Programs</Text>
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
        <Drawer.Screen name="AllPrograms" component={AllPrograms}
          listeners={{
            focus: () => {
              setLoc('AllPrograms')
            }
          }}
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
              return (<Text style={{marginLeft:-25,fontSize:14,fontFamily:'Poppins',color:color}}>Programs</Text>)
            }
          }}
        />
        <Drawer.Screen name="Prompts" component={Prompts}
          listeners={{
            focus: () => {
              setLoc('Prompts')
            }
          }}
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
          listeners={{
            focus: () => {
              setLoc('Concepts')
            }
          }}
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
          listeners={{
            focus: () => {
              setLoc('AddProgram')
            }
          }}
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
    </View>
    
  </View>)

}
