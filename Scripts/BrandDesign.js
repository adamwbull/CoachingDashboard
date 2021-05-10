import { StatusBar } from 'expo-status-bar'
import React, { useEffect, useState } from 'react'
import { TouchableOpacity, ScrollView, StyleSheet, Text, View } from 'react-native'
import { brandDesignLight, colorsLight, innerDrawerLight } from '../Scripts/Styles.js'
import { homeDark, colorsDark, innerDrawerDark } from '../Scripts/Styles.js'
import { useLinkTo } from '@react-navigation/native'
import LoadingScreen from '../Scripts/LoadingScreen.js'
import { Helmet } from "react-helmet"
import ActivityIndicatorView from '../Scripts/ActivityIndicatorView.js'
import { set, get, getTTL, ttl } from './Storage.js'

export default function BrandDesign() {
  const linkTo = useLinkTo()
  const [refreshing, setRefreshing] = useState(true)
  const [styles, setStyles] = useState(brandDesignLight)

  // Main stage variables.
  const [coach, setCoach] = useState({})

  // Main stage controls.
  const [showBrandColoring, setBrandColoring] = useState(false)
  const [showActivityIndicator, setActivityIndicator] = useState(true)

  useEffect(() => {
    console.log('Welcome to brand design.')
    const sCoach = get('Coach')
    if (sCoach != null) {
      setCoach(sCoach)
      setActivityIndicator(true)
      setTimeout(() => {
        setActivityIndicator(false)
        setBrandColoring(true)
      }, 500)
    }
  },[])

  return (<ScrollView contentContainerStyle={styles.scrollView}>
    <View style={styles.container}>
      <View style={styles.main}>
        <View style={styles.body}>

          <View style={styles.bodyHeader}>
            <View style={styles.bodyTitleGroup}>
              <Text style={styles.bodyTitle}>Brand Design</Text>
              <Text style={styles.bodyDesc}></Text>
            </View>
          </View>

          {showActivityIndicator && (<ActivityIndicatorView />)}

          {showBrandColoring && (<View style={styles.brandColoringContainer}>
            <View style={{flex:1}}></View>
            <View style={styles.brandColoringGroup}>
              <Text style={styles.brandColoringGroupTitle}>Primary Color</Text>
              <TouchableOpacity style={[styles.brandColoringGroup,{backgroundColor:coach.PrimaryHighlight}]}>
              </TouchableOpacity>
            </View>
            <View style={{width:30,height:10}}></View>
            <View style={styles.brandColoringGroup}>
              <Text style={styles.brandColoringGroupTitle}>Secondary Color</Text>
              <TouchableOpacity style={[styles.brandColoringGroup,{backgroundColor:coach.SecondaryHighlight}]}>
              </TouchableOpacity>
            </View>
            <View style={{flex:1}}></View>
          </View>)}

        </View>
      </View>
    </View>
  </ScrollView>)

}
