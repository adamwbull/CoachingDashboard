import { StatusBar } from 'expo-status-bar'
import React, { useEffect, useState, useRef } from 'react'
import { TouchableOpacity, ScrollView, StyleSheet, Text, View } from 'react-native'
import { brandDesignLight, colorsLight, innerDrawerLight } from '../Scripts/Styles.js'
import { homeDark, colorsDark, innerDrawerDark } from '../Scripts/Styles.js'
import { useLinkTo } from '@react-navigation/native'
import LoadingScreen from '../Scripts/LoadingScreen.js'
import { Helmet } from "react-helmet"
import ActivityIndicatorView from '../Scripts/ActivityIndicatorView.js'
import { set, get, getTTL, ttl } from './Storage.js'
import { Icon, Button } from 'react-native-elements'
import { TwitterPicker } from 'react-color';
import { updateCoachColoring } from './API.js'

export default function BrandDesign() {
  const linkTo = useLinkTo()
  const [refreshing, setRefreshing] = useState(true)
  const [styles, setStyles] = useState(brandDesignLight)
  const [colors, setColors] = useState(colorsLight)

  // Main stage variables.
  const [coach, setCoach] = useState({})
  const [primaryColor, setPrimaryColor] = useState('#fff')
  const [secondaryColor, setSecondaryColor] = useState('#fff')

  // Main stage controls.
  const [showBrandLogin, setBrandLogin] = useState(false)
  const [showBrandColoring, setBrandColoring] = useState(false)
  const [showBrandLogo, setBrandLogo] = useState(false)
  const [showBrandHeaders, setBrandHeaders] = useState(false)

  const [showActivityIndicator, setActivityIndicator] = useState(true)

  // Brand coloring stage controls.
  const [showPrimaryColoringPicker, setPrimaryColoringPicker] = useState(false)
  const [showSecondaryColoringPicker, setSecondaryColoringPicker] = useState(false)

  const scrollRef = useRef()

  useEffect(() => {
    console.log('Welcome to brand design.')
    const sCoach = get('Coach')
    if (sCoach != null) {
      setCoach(sCoach)
      setPrimaryColor(sCoach.PrimaryHighlight)
      setSecondaryColor(sCoach.SecondaryHighlight)
      setActivityIndicator(true)
      setTimeout(() => {
        setActivityIndicator(false)
        setBrandLogin(true)
        setBrandColoring(true)
        setBrandLogo(true)
        setBrandHeaders(true)
      }, 500)
    }
  },[])

  const setColoring = (type, hex) => {
    console.log(hex)
    if (type == 0) {
      setPrimaryColor(hex)
      setPrimaryColoringPicker(false)
    } else {
      setSecondaryColor(hex)
      setSecondaryColoringPicker(false)
    }
  }

  const toggleColoringPicker = (type) => {
    if (type == 0) {
      setPrimaryColoringPicker(!showPrimaryColoringPicker)
    } else {
      setSecondaryColoringPicker(!showSecondaryColoringPicker)
    }
  }

  const closeColoringPicker = () => {
    console.log('closing')
    setSecondaryColoringPicker(false)
    setPrimaryColoringPicker(false)
  }

  const saveColorChoices = async () => {
    var tempCoach = JSON.parse(JSON.stringify(coach))
    tempCoach.PrimaryHighlight = primaryColor
    tempCoach.SecondaryHighlight = secondaryColor
    var updated = await updateCoachColoring(tempCoach.Id, tempCoach.Token, primaryColor, secondaryColor)
    if (true) {
      setCoach(tempCoach)
      set('Coach',tempCoach,ttl)
      window.location.reload();
    }
  }

  return (<View style={{flex:1}} ref={scrollRef}><ScrollView contentContainerStyle={styles.scrollView}>
    <View style={styles.container}>
      <View style={styles.main}>
        <View style={styles.body}>

          <View style={styles.bodyHeader}>
            <View style={styles.bodyTitleGroup}>
              <Text style={styles.bodyTitle}>Brand Design</Text>
              <Text style={styles.bodyDesc}>Customize your Client's experience.</Text>
            </View>
          </View>

          {showActivityIndicator && (<ActivityIndicatorView />)}

          {showBrandLogin && (<View style={styles.brandContainer}>
            <Text style={styles.sectionTitle}>Testing Account</Text>
            <Text style={styles.sectionContent}>You can login as a Client to test changes within the app with the following info.</Text>
          </View>)}

          {showBrandColoring && (<View style={styles.brandContainer}>
            <Text style={styles.sectionTitle}>Brand Colors</Text>
            <Text style={styles.sectionContent}>Choose a color scheme that appears within the Dashboard and on the mobile app for your Clients.</Text>
            <View style={styles.brandColoringRow}>
              <View style={styles.brandColoringGroup}>
                <Text style={styles.brandColoringGroupTitle}>Primary Color</Text>
                <TouchableOpacity style={[styles.brandColoringTouch,{backgroundColor:primaryColor}]}
                  onPress={() => toggleColoringPicker(0)}>
                  <Icon
                    name={(showPrimaryColoringPicker) ? 'close' : 'eyedrop-outline'}
                    type='ionicon'
                    size={22}
                    color={colors.mainBackground}
                  />
                </TouchableOpacity>
                {showPrimaryColoringPicker && (<View style={{position:'absolute',marginTop:155}}><TwitterPicker
                  color={primaryColor}
                  onChangeComplete={(color) => setColoring(0, color.hex)}
                  colors={['#2ecc71', '#7CF2A1', '#FCB900', '#FF6900', '#8ED1FC', '#0693E3', '#ABB8C3', '#EB144C', '#F78DA7', '#C50BD9']}
                /></View>)}
              </View>
              <View style={{width:20,height:10}}></View>
              <View style={styles.brandColoringGroup}>
                <Text style={styles.brandColoringGroupTitle}>Secondary Color</Text>
                <TouchableOpacity style={[styles.brandColoringTouch,{backgroundColor:secondaryColor}]}
                  onPress={() => toggleColoringPicker(1)}>
                  <Icon
                    name={(showSecondaryColoringPicker) ? 'close' : 'eyedrop-outline'}
                    type='ionicon'
                    size={22}
                    color={colors.mainBackground}
                  />
                </TouchableOpacity>
                {showSecondaryColoringPicker && (<View style={{position:'absolute',marginTop:155}}><TwitterPicker
                  color={secondaryColor}
                  onChangeComplete={(color) => setColoring(1, color.hex)}
                  colors={['#27ae60', '#7BDCB5', '#E6950B', '#E8470C', '#759DE6', '#0560FA', '#929CA6', '#D41608', '#E8849D', '#9900EF']}
                /></View>)}
              </View>
              <View style={{flex:1}}></View>
              <View style={{flex:1,justifyContent:'flex-end'}}>
                <Button
                  title='Save Coloring'
                  titleStyle={styles.saveColoringText}
                  buttonStyle={styles.saveColoringButton}
                  containerStyle={styles.saveColoringContainer}
                  onPress={saveColorChoices}
                />
              </View>
            </View>
          </View>)}

          {showBrandLogo && (<View style={styles.brandContainer}>
            <Text style={styles.sectionTitle}>Logo</Text>
            <Text style={styles.sectionContent}>Specify a custom logo to show up within the mobile app for your Clients.</Text>
          </View>)}

          {showBrandHeaders && (<View style={styles.brandContainer}>
            <Text style={styles.sectionTitle}>Headers</Text>
            <Text style={styles.sectionContent}>Set custom headers to appear above sections on the app.</Text>
          </View>)}

        </View>
      </View>
    </View>
  </ScrollView></View>)

}
