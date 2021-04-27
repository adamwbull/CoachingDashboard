import { StatusBar } from 'expo-status-bar'
import React, { useEffect, useState } from 'react'
import { ScrollView, StyleSheet, Text, View } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { promptsLight, colorsLight, innerDrawerLight } from '../Scripts/Styles.js'
import { homeDark, colorsDark, innerDrawerDark } from '../Scripts/Styles.js'
import { useLinkTo, Link } from '@react-navigation/native'
import LoadingScreen from '../Scripts/LoadingScreen.js'
import { Helmet } from "react-helmet"
import { Icon, Button } from 'react-native-elements'
import { set, get, getTTL, ttl } from './Storage.js'

export default function Prompts() {
  const linkTo = useLinkTo()
  const [refreshing, setRefreshing] = useState(true)
  const [styles, setStyles] = useState(promptsLight)
  const [colors, setColors] = useState(colorsLight)
  const [coach, setCoach] = useState({})

  // Stage controls.
  const [paymentsDisabled, setPaymentsDisabled] = useState(true)
  const [contractsDisabled, setContractsDisabled] = useState(true)

  // Data.
  const [prompts, setPrompts] = useState([])
  const [surveys, setSurveys] = useState([])
  const [payments, setPayments] = useState([])
  const [contracts, setContracts] = useState([])

  useEffect(() => {
    const sCoach = get('Coach')
    if (sCoach != null) {
      setCoach(sCoach)
    }
  },[])

  // Text prompt controls.
  const addPrompt = () => {
    console.log ('Add new text prompt...')
  }

  // Survey controls.
  const addSurvey = () => {
    console.log ('Add new survey...')
  }

  // Payment controls.
  const addPayment = () => {
    console.log ('Add new payment...')
  }

  // Contract controls.
  const addContract = () => {
    console.log ('Add new contract...')
  }

  return (<ScrollView contentContainerStyle={styles.scrollView}>
    <View style={styles.container}>
      <View style={styles.main}>
        <View style={styles.body}>
          <View style={styles.bodyHeader}>
            <View style={styles.bodyTitleGroup}>
              <Text style={styles.bodyTitle}>Prompts</Text>
              <Text style={styles.bodyDesc}>Content for Clients to respond do.</Text>
            </View>
            <View style={styles.bodyHeaderNav}>
              <Link to='/programs' style={styles.bodyHeaderNavLink}>Programs</Link>
              <Icon
                name='chevron-forward'
                type='ionicon'
                size={22}
                color={colors.mainTextColor}
              />
              <Link to='/prompts' style={styles.bodyHeaderNavLink}>Prompts</Link>
            </View>
          </View>

          <View style={styles.promptListContainer}>
            <View style={styles.promptHeader}>
              <Text style={styles.promptHeaderTitle}>Text Prompts</Text>
              <Text style={styles.promptHeaderCount}>{0} total</Text>
            </View>
            <ScrollView horizontal={true} contentContainerStyle={styles.promptsRow}>
              <View style={styles.addPromptContainer}>
                <Button
                title='Add Text Prompt'
                titleStyle={styles.promptAddButtonTitle}
                buttonStyle={styles.promptAddButton}
                containerStyle={styles.promptAddButtonContainer}
                onPress={addPrompt} />
              </View>
              {prompts.length > 0 && (<View>
              </View>) || (<View style={styles.helpBox}>
                <Text style={styles.helpBoxText}>Text prompts with optional video.{"\n"}Assign directly to Clients or include in a Program.</Text>
              </View>)}
            </ScrollView>
          </View>

          <View style={styles.promptListContainer}>
            <View style={styles.promptHeader}>
              <Text style={styles.promptHeaderTitle}>Surveys</Text>
              <Text style={styles.promptHeaderCount}>{0} total</Text>
            </View>
            <View style={styles.promptsRow}>
              <View style={styles.addPromptContainer}>
                <Button
                title='Add Survey'
                titleStyle={styles.promptAddButtonTitle}
                buttonStyle={styles.promptAddButton}
                containerStyle={styles.promptAddButtonContainer}
                onPress={addSurvey} />
              </View>
              {surveys.length > 0 && (<View>
              </View>) || (<View style={styles.helpBox}>
                <Text style={styles.helpBoxText}>Surveys to collect data or establish baselines.{"\n"}Assign directly to Clients or include in a Program.</Text>
              </View>)}
            </View>
          </View>

          <View style={styles.promptListContainer}>
            <View style={styles.promptHeader}>
              <Text style={styles.promptHeaderTitle}>Payments</Text>
              <Text style={styles.promptHeaderCount}>{0} total</Text>
            </View>
            <View style={styles.promptsRow}>
              <View style={styles.addPromptContainer}>
                <Button
                title='Add Payment'
                disabled={paymentsDisabled}
                titleStyle={styles.promptAddButtonTitle}
                buttonStyle={styles.promptAddButton}
                containerStyle={styles.promptAddButtonContainer}
                onPress={addPayment} />
              </View>
              {payments.length > 0 && (<View>
              </View>) || (<View style={styles.helpBox}>
                {paymentsDisabled && (<Text style={styles.helpBoxError}><Text style={styles.standardPlanText}>Standard Plan</Text> is needed to use this feature.</Text>) || (<></>)}
                <Text style={styles.helpBoxText}>Invoice templates to charge Clients with.{"\n"}Assign directly to Clients or include in a Program.</Text>
              </View>)}
            </View>
          </View>

          <View style={styles.promptListContainer}>
            <View style={styles.promptHeader}>
              <Text style={styles.promptHeaderTitle}>Contracts</Text>
              <Text style={styles.promptHeaderCount}>{0} total</Text>
            </View>
            <View style={styles.promptsRow}>
              <View style={styles.addPromptContainer}>
                <Button
                title='Add Contract'
                disabled={contractsDisabled}
                titleStyle={styles.promptAddButtonTitle}
                buttonStyle={styles.promptAddButton}
                containerStyle={styles.promptAddButtonContainer}
                onPress={addContract} />
              </View>
              {contracts.length > 0 && (<View>
              </View>) || (<View style={styles.helpBox}>
                {contractsDisabled && (<Text style={styles.helpBoxError}><Text style={styles.proPlanText}>Professional Plan</Text> is needed to use this feature.</Text>) || (<></>)}
                <Text style={styles.helpBoxText}>Contracts that can be signed in-app by Clients.{"\n"}Assign directly to Clients or include in a Program.</Text>
              </View>)}
            </View>
          </View>

        </View>
      </View>
    </View>
  </ScrollView>)

}
