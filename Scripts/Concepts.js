import { StatusBar } from 'expo-status-bar'
import React, { useEffect, useState } from 'react'
import { ScrollView, StyleSheet, Text, View } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { conceptsLight, colorsLight, innerDrawerLight } from '../Scripts/Styles.js'
import { homeDark, colorsDark, innerDrawerDark } from '../Scripts/Styles.js'
import { useLinkTo, Link } from '@react-navigation/native'
import LoadingScreen from '../Scripts/LoadingScreen.js'
import { Helmet } from "react-helmet"
import { Icon, Button } from 'react-native-elements'
import { set, get, getTTL, ttl } from './Storage.js'

export default function Concepts() {
  const linkTo = useLinkTo()
  const [refreshing, setRefreshing] = useState(true)
  const [styles, setStyles] = useState(conceptsLight)
  const [colors, setColors] = useState(colorsLight)
  const [coach, setCoach] = useState({})

  // Stage controls.
  const [paymentsDisabled, setPaymentsDisabled] = useState(true)
  const [contractsDisabled, setContractsDisabled] = useState(true)

  // Data.
  const [concepts, setConcepts] = useState([])
  const [pdfs, setPDFs] = useState([])

  useEffect(() => {
    const sCoach = get('Coach')
    if (sCoach != null) {
      setCoach(sCoach)
    }
  },[])

  // Text prompt controls.
  const addConcept = () => {
    console.log ('Add new concept...')
  }

  // Survey controls.
  const addPDF = () => {
    console.log ('Add new pdf...')
  }


  return (<ScrollView contentContainerStyle={styles.scrollView}>
    <View style={styles.container}>
      <View style={styles.main}>
        <View style={styles.body}>
          <View style={styles.bodyHeader}>
            <View style={styles.bodyTitleGroup}>
              <Text style={styles.bodyTitle}>Concepts</Text>
              <Text style={styles.bodyDesc}>Static knowledge for Clients to view.</Text>
            </View>
            <View style={styles.bodyHeaderNav}>
              <Link to='/programs' style={styles.bodyHeaderNavLink}>Programs</Link>
              <Icon
                name='chevron-forward'
                type='ionicon'
                size={22}
                color={colors.mainTextColor}
              />
              <Link to='/concepts' style={styles.bodyHeaderNavLink}>Concepts</Link>
            </View>
          </View>

          <View style={styles.promptListContainer}>
            <View style={styles.promptHeader}>
              <Text style={styles.promptHeaderTitle}>Concepts</Text>
              <Text style={styles.promptHeaderCount}>{0} total</Text>
            </View>
            <ScrollView horizontal={true} contentContainerStyle={styles.promptsRow}>
              <View style={styles.addPromptContainer}>
                <Button
                title='Add Concept'
                titleStyle={styles.promptAddButtonTitle}
                buttonStyle={styles.promptAddButton}
                containerStyle={styles.promptAddButtonContainer}
                onPress={addConcept} />
              </View>
              {concepts.length > 0 && (<View>
              </View>) || (<View style={styles.helpBox}>
                <Text style={styles.helpBoxText}>Static text concepts with optional video.{"\n"}Assign directly to Clients or include in a Program.</Text>
              </View>)}
            </ScrollView>
          </View>

          <View style={styles.promptListContainer}>
            <View style={styles.promptHeader}>
              <Text style={styles.promptHeaderTitle}>PDFs</Text>
              <Text style={styles.promptHeaderCount}>{0} total</Text>
            </View>
            <ScrollView horizontal={true} contentContainerStyle={styles.promptsRow}>
              <View style={styles.addPromptContainer}>
                <Button
                title='Add PDF'
                titleStyle={styles.promptAddButtonTitle}
                buttonStyle={styles.promptAddButton}
                containerStyle={styles.promptAddButtonContainer}
                onPress={addPDF} />
              </View>
              {pdfs.length > 0 && (<View>
              </View>) || (<View style={styles.helpBox}>
                <Text style={styles.helpBoxText}>Static viewable PDFs.{"\n"}Assign directly to Clients or include in a Program.</Text>
              </View>)}
            </ScrollView>
          </View>

        </View>
      </View>
    </View>
  </ScrollView>)

}
