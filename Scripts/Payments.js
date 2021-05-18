import { StatusBar } from 'expo-status-bar'
import React, { useEffect, useState } from 'react'
import { ScrollView, StyleSheet, Text, View } from 'react-native'
import { paymentsLight, colorsLight, innerDrawerLight, btnColors } from '../Scripts/Styles.js'
import { paymentsDark, colorsDark, innerDrawerDark } from '../Scripts/Styles.js'
import { useLinkTo, Link } from '@react-navigation/native'
import LoadingScreen from '../Scripts/LoadingScreen.js'
import ActivityIndicatorView from '../Scripts/ActivityIndicatorView.js'
import { set, get, getTTL, ttl } from './Storage.js'
import { TextInput } from 'react-native-web'
import { Icon, Button } from 'react-native-elements'

export default function Payments() {
  const linkTo = useLinkTo()
  const [refreshing, setRefreshing] = useState(true)
  const [styles, setStyles] = useState(paymentsLight)

  // Main stage controls.
  const [showActivityIndicator, setActivityIndicator] = useState(true)

  // Main stage variables.
  const [coach, setCoach] = useState({})

  // Stripe info controls.
  const [showStripeInfo, setStripeInfo] = useState(false)
  const [saveStripeKeysDisabled, setSaveStripeKeysDisabled] = useState(true)

  // Stripe data.
  const [stripePublicKey, setStripePublicKey] = useState('')
  const [stripeSecretKey, setStripeSecretKey] = useState('')

  useEffect(() => {
    console.log('Welcome to integrations.')
    const sCoach = get('Coach')
    if (sCoach != null) {
      setCoach(sCoach)
      setTimeout(() => {
        setActivityIndicator(false)
        setStripeInfo(true)
      }, 500)
    }
  },[])

  // Stripe functions.
  const saveStripeKeys = () => {
    console.log(stripePublicKey, stripeSecretKey)
  }



  return (<ScrollView contentContainerStyle={styles.scrollView}>
    <View style={styles.container}>
      <View style={styles.main}>
        <View style={styles.body}>

          <View style={styles.bodyHeader}>
            <View style={styles.bodyTitleGroup}>
              <Text style={styles.bodyTitle}>Payments</Text>
              <Text style={styles.bodyDesc}>Manage how you receive payments from Clients.</Text>
            </View>
          </View>

          {showActivityIndicator && (<ActivityIndicatorView />)}

          {showStripeInfo && (<View style={styles.bodyContainer}>
            <Text style={styles.bodySubtitle}>Stripe Info</Text>
            <Text style={styles.bodyDesc}>Set up Stripe keys to enable Client payment collection. Visit the <a target="_blank" href='https://dashboard.stripe.com/dashboard' style={{color:btnColors.primary}}>Stripe Dashboard</a> to get your Keys.</Text>
            <View style={styles.bodyRow}>
              <View style={styles.bodyInputContainer}>
                <Text style={styles.inputTitle}>Publishable Key</Text>
                <TextInput
                  style={styles.inputStyle}
                  value={stripePublicKey}
                  placeholder='ex. pk_xxxxxxxxxxxxxxxxxxx'
                  onChangeText={(text) => setStripePublicKey(text)}
                />
              </View>
              <View style={styles.bodyInputContainer}>
                <Text style={styles.inputTitle}>Secret Key</Text>
                <TextInput
                  style={styles.inputStyle}
                  value={stripeSecretKey}
                  placeholder='ex. sk_xxxxxxxxxxxxxxxxxxx'
                  secureTextEntry={true}
                  onChangeText={(text) => setStripeSecretKey(text)}
                />
              </View>
            </View>
            <View style={styles.saveContainerRow}>
              <View style={styles.saveContainerSpacer}></View>
              <Button
                title='Save Keys'
                titleStyle={styles.saveText}
                buttonStyle={styles.saveButton}
                containerStyle={styles.saveContainer}
                onPress={saveStripeKeys}
                disabled={saveStripeKeysDisabled}
              />
            </View>
          </View>)}

        </View>
      </View>
    </View>
  </ScrollView>)

}
