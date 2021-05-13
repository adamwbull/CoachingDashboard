import { StatusBar } from 'expo-status-bar'
import React, { useEffect, useState, useRef } from 'react'
import { Image, TouchableOpacity, ScrollView, StyleSheet, Text, View } from 'react-native'
import { brandDesignLight, colorsLight, innerDrawerLight } from '../Scripts/Styles.js'
import { homeDark, colorsDark, innerDrawerDark } from '../Scripts/Styles.js'
import { useLinkTo } from '@react-navigation/native'
import LoadingScreen from '../Scripts/LoadingScreen.js'
import { Helmet } from "react-helmet"
import ActivityIndicatorView from '../Scripts/ActivityIndicatorView.js'
import { set, get, getTTL, ttl } from './Storage.js'
import { Icon, Button } from 'react-native-elements'
import { TwitterPicker } from 'react-color';
import { updateBrandHeaders, setLogoDefault, updateCoachColoring, uploadLogo } from './API.js'
import { TextInput } from 'react-native-web'
import IOSAppDownload from '../assets/app-store-download/iosdownload.svg'
import AndroidAppDownload from '../assets/app-store-download/google-play-badge.png'
import DefaultLogo from '../assets/nav-logo.png'

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

  // Logo variables.
  const [customLogo, setCustomLogo] = useState('')
  const [logoVideoIndicator, setLogoActivityIndicator] = useState(false)
  const [logoError, setLogoError] = useState('')

  // Headers variables.
  const [homeSectionName, setHomeSectionName] = useState('')
  const [promptsSectionName, setPromptsSectionName] = useState('')
  const [conceptsSectionName, setConceptsSectionName] = useState('')
  const [headersError, setheadersError] = useState('')

  useEffect(() => {
    console.log('Welcome to brand design.')
    const sCoach = get('Coach')
    if (sCoach != null) {
      setCoach(sCoach)
      setPrimaryColor(sCoach.PrimaryHighlight)
      setSecondaryColor(sCoach.SecondaryHighlight)
      console.log('logo',sCoach.BrandLogo)
      if (sCoach.BrandLogo.length == 0) {
        console.log('here')
        setCustomLogo(DefaultLogo)
      } else {
        setCustomLogo(sCoach.BrandLogo)
      }
      setHomeSectionName(sCoach.HomeSectionName)
      setPromptsSectionName(sCoach.PromptsSectionName)
      setConceptsSectionName(sCoach.ConceptsSectionName)
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

  // Coloring functions.
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
      setSecondaryColoringPicker(false)
      setPrimaryColoringPicker(!showPrimaryColoringPicker)
    } else {
      setPrimaryColoringPicker(false)
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

  // Logo functions.
  const hiddenFileInput = React.useRef(null)

  const handleClick = event => {
    hiddenFileInput.current.click()
    window.addEventListener('focus', handleFocusBack)
    setLogoActivityIndicator(true)
    setLogoError('')
  }

  const handleFocusBack = () => {
    window.removeEventListener('focus', handleFocusBack)
    setLogoActivityIndicator(false)
  }

  const handleFile = async () => {

    var file = event.target.files[0]
    if (file !== undefined) {
      var fileArr = file.name.split('.')
      var fileOptions = ['png','jpg','jpeg']
      var fileType = fileArr[1]
      if (fileOptions.includes(fileType)) {
        if (file.size <= 1000000) {
          var fileArr = file.name.split('.')
          var fileType = fileArr[1]
          var fileMime = 'video/jpeg'
          if (fileType == 'png') {
            fileMime = 'video/png'
          }
          var ts = Math.floor(Math.random() * (999999999999+1) + 1);
          ts = ts.toString();
          var fileName = `${coach.Id}_${coach.Token}_${ts}.${fileType}`
          var newFile = new File([file], fileName, {type: fileMime})
          var base = await uploadLogo(newFile)
          if (base != false) {
            var url = base + '/logos/' + fileName
            var tempCoach = JSON.parse(JSON.stringify(coach))
            tempCoach.BrandLogo = url
            set('Coach',tempCoach,ttl)
            window.location.reload();
          } else {
            setLogoError('There was a problem uploading! Please try again.')
          }

        } else {
          setLogoError('File size should be less than 1 MB.')
        }
      } else {
        setLogoError('File type should be png or jpg.')
      }
    } else {
      setLogoActivityIndicator(false)
    }

  }

  const resetToDefault = async () => {
    var tempCoach = JSON.parse(JSON.stringify(coach))
    tempCoach.BrandLogo = ''
    set('Coach',tempCoach,ttl)
    var updated = await setLogoDefault(coach.Id, coach.Token)
    window.location.reload();
  }

  const updateHeaders = async (type) => {
    var created = false
    var arr = ['', '', '']

    if (type == 0) {
      created = await updateBrandHeaders(coach.Id, coach.Token, 'Home', 'Prompts', 'Concepts')
      arr = ['Home', 'Prompts', 'Concepts']
    } else {
      created = await updateBrandHeaders(coach.Id, coach.Token, homeSectionName, promptsSectionName, conceptsSectionName)
      arr = [homeSectionName, promptsSectionName, conceptsSectionName]
    }

    if (created) {
      var tempCoach = JSON.parse(JSON.stringify(coach))
      tempCoach.HomeSectionName = arr[0]
      tempCoach.PromptsSectionName = arr[1]
      tempCoach.ConceptsSectionName = arr[2]
      set('Coach',tempCoach,ttl)
      window.location.reload();
    } else {
      setHeadersError('There was a problem! Please try again or notify support.')
    }
  }

  return (<View style={{flex:1}} ref={scrollRef}><ScrollView contentContainerStyle={styles.scrollView}>
    <View style={styles.container}>
      <View style={styles.main}>
        <View style={styles.body}>

          <View style={styles.bodyHeader}>
            <View style={styles.bodyTitleGroup}>
              <Text style={styles.bodyTitle}>Brand Design</Text>
              <Text style={styles.bodyDesc}>Customize your Client's in-app experience.</Text>
            </View>
          </View>

          {showActivityIndicator && (<ActivityIndicatorView />)}

          {showBrandLogin && (<View style={styles.brandContainer}>
            <Text style={styles.sectionTitle}>Testing the App</Text>
            <Text style={styles.sectionContent}>You can login as a Client to test changes within the app with your Dashboard credentials.</Text>
            <View style={[styles.brandColoringRow,{backgroundColor:'#fff',borderRadius:10}]}>
              <View style={{flex:1,alignItems:'center'}}>
                <Text style={styles.testAccLabel}>Client App for iOS</Text>
                <TouchableOpacity style={{width:200,height:77,paddingTop:10}} onPress={() => console.log('iOS')}>
                  <img src={IOSAppDownload} style={{width:200,height:50,marginLeft:'auto',marginRight:'auto'}} />
                </TouchableOpacity>
              </View>
              <View style={{flex:1,alignItems:'center'}}>
                <Text style={styles.testAccLabel}>Client App for Android</Text>
                <TouchableOpacity style={{width:200,height:77}} onPress={() => console.log('Android')}>
                  <img src={AndroidAppDownload} style={{width:200,height:77,marginLeft:'auto',marginRight:'auto'}} />
                </TouchableOpacity>
              </View>
            </View>
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
                {showPrimaryColoringPicker && (<View style={{position:'absolute',marginBottom:80}}><TwitterPicker
                  color={primaryColor}
                  triangle='hide'
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
                {showSecondaryColoringPicker && (<View style={{position:'absolute',marginBottom:80}}><TwitterPicker
                  color={secondaryColor}
                  triangle='hide'
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
            <Text style={styles.sectionTitle}>App Header Logo</Text>
            <Text style={styles.sectionContent}>Specify a custom logo to show up within the mobile app for your Clients.</Text>
            <View style={[styles.brandColoringRow,{alignItems:'flex-end'}]}>
              <View style={{flex:1}}>
                <Text style={styles.testAccLabel}>Current Header Logo</Text>
                <Image source={customLogo} style={{width:200,height:100,margin:'auto'}} />
                <Text style={styles.logoBelow}>recommended size{"\n"}200px by 100px</Text>
              </View>
              <View style={{flex:2}}></View>
              <View style={{flex:1}}>
                <Text style={styles.errorText}>{logoError}</Text>
                <TouchableOpacity onPress={resetToDefault} style={{margin:10}}>
                  <Text style={styles.resetToDefault}>Reset to Default</Text>
                </TouchableOpacity>
                <input type="file" ref={hiddenFileInput} onChange={handleFile} style={{display:'none'}} />
                <Button
                  title='Change Logo'
                  titleStyle={styles.saveColoringText}
                  buttonStyle={styles.saveColoringButton}
                  containerStyle={styles.saveColoringContainer}
                  onPress={handleClick}
                />
              </View>
            </View>
          </View>)}

          {showBrandHeaders && (<View style={styles.brandContainer}>
            <Text style={styles.sectionTitle}>Headers</Text>
            <Text style={styles.sectionContent}>Set custom headers to appear above sections on the app.</Text>
            <View style={styles.brandColoringRow}>
              <View style={{flex:1}}>
                <Text style={styles.testAccLabel}>Home</Text>
                <TextInput
                  style={styles.headerInputStyle}
                  value={homeSectionName}
                  placeholder='ex. Home'
                  onChangeText={(text) => setHomeSectionName(text)}
                />
                <Text style={styles.testAccLabel}>Prompts</Text>
                <TextInput
                  style={styles.headerInputStyle}
                  value={promptsSectionName}
                  placeholder='ex. Prompts'
                  onChangeText={(text) => setPromptsSectionName(text)}
                />
                <Text style={styles.testAccLabel}>Concepts</Text>
                <TextInput
                  style={styles.headerInputStyle}
                  value={conceptsSectionName}
                  placeholder='ex. Concepts'
                  onChangeText={(text) => setConceptsSectionName(text)}
                />
              </View>
              <View style={{flex:2}}></View>
              <View style={{flex:1}}>
                <Text style={styles.errorText}>{headersError}</Text>
                <TouchableOpacity onPress={() => updateHeaders(0)} style={{margin:10}}>
                  <Text style={styles.resetToDefault}>Reset to Default</Text>
                </TouchableOpacity>
                <Button
                  title='Save Headers'
                  titleStyle={styles.saveColoringText}
                  buttonStyle={styles.saveColoringButton}
                  containerStyle={styles.saveColoringContainer}
                  onPress={() => updateHeaders(1)}
                />
              </View>
            </View>
          </View>)}

        </View>
      </View>
    </View>
  </ScrollView></View>)

}
