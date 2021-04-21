import { StatusBar } from 'expo-status-bar'
import React, { useEffect, useState, useCallback } from 'react'
import { ScrollView, Linking, Animated, Image, StyleSheet, Text, View } from 'react-native'
import { signUpLight, logoLight, navLogo, colorsLight, messageBox, bold, btnColors } from '../Scripts/Styles.js'
import { signUpDark, logoDark, colorsDark } from '../Scripts/StylesDark.js'
import { Button, Icon, PricingCard } from 'react-native-elements'
import { useLinkTo, Link } from '@react-navigation/native'
import { TextInput } from 'react-native-web'
import { set, get, getTTL, ttl } from '../Scripts/Storage.js'
import { loginCheck, verifyCaptcha } from '../Scripts/API.js'
import Recaptcha from 'react-grecaptcha'

export default function Welcome() {
  const linkTo = useLinkTo()
  const [refreshing, setRefreshing] = useState(true)
  const [signUp, setStyle] = useState(signUpLight)
  const [colors, setColors] = useState(colorsLight)
  const [opacity, setOpacity] = useState(new Animated.Value(0))
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorText, setErrorText] = useState(false)
  const [attemptsLeft, setAttemptsLeft] = useState(get('LoginAttempts'))
  const [showCaptcha, setShowCaptcha] = useState(false)
  const [buttonDisabled, setButtonDisabled] = useState(false)

  // Media queries.
  const [pricingCardsStyle, setPricingCardsStyle] = useState({flexDirection:'row'})
  const [scrollStyle, setScrollstyle] = useState({flex:1})
  // Stage controls.
  const [showRegisterForm, setShowRegisterForm] = useState(false)
  const [showPricingForm, setShowPricingForm] = useState(true)

  const onLayout = (event) => {
    const { width } = event.nativeEvent.layout;
    if (width < 1220) {
      setPricingCardsStyle({flexDirection:'column'})
      setScrollstyle({})
    } else {
      setPricingCardsStyle({flexDirection:'row'})
      setScrollstyle({flex:1})
    }
  };

  useEffect(() => {
    document.title = 'Sign Up - CoachSync'
    const r = get('Coach')
    if (r !== null) {
      linkTo('/overview')
    }
  })

  const onLoad = () => {
    Animated.timing(opacity, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start()
  }

  const onChangeTextEmail = (text) => {
    setErrorText(false)
    setEmail(text)
  }

  const onChangeTextPassword = (text) => {
    setErrorText(false)
    setPassword(text)
  }

  const onSubmit = async () => {

  }

  const verifyCallback = async (response) => {
    console.log(response)
    var check = verifyCaptcha(response)
    if (check) {
      setButtonDisabled(false)
    } else {
      setErrorText('There was an error with the captcha. Please refresh your browser.')
    }
  }

  const expiredCallback = () => { console.log('captcha expired') }

  return (<ScrollView contentContainerStyle={[signUp.container,scrollStyle]} scrollEnabled={true} onLayout={onLayout}>
    <View style={signUp.main}>
      <View style={{flexShrink:1}}>
        <Text style={signUp.pricingTitle}>Welcome to CoachSync!</Text>
        <Text style={signUp.pricingIntro}>You're moments away from bringing your coaching practice to the next level!</Text>
        <Text style={signUp.pricingIntro}>The first step is to choose the perfect package for you:</Text>
        <View style={[signUp.pricingCards,pricingCardsStyle]}>
        <PricingCard
          color={btnColors.primary}
          title="Free"
          price="$0"
          info={['Up to 3 Clients', 'Prompts/Concepts/Surveys', 'Calendly Integration', 'Messaging and Social Feed']}
          button={{ title: 'Select' }}
          containerStyle={signUp.pricingCardContainer}
        />
        <PricingCard
          color={btnColors.success}
          title="Standard"
          price="$49.99/mo"
          info={['Up to 10 Clients', 'All Free Features', 'Client Payment Collection', 'Basic Support']}
          button={{ title: 'Select' }}
          containerStyle={signUp.pricingCardContainerMiddle}
        />
        <PricingCard
          color={btnColors.danger}
          title="Professional"
          price="$99.99/mo"
          info={['Unlimited Clients!', 'All Standard Features', 'Premium Support', 'Contract Signing']}
          button={{ title: 'Select' }}
          containerStyle={signUp.pricingCardContainer}
        />
        </View>
      </View>
      {showRegisterForm && (<View>
        <View style={signUp.form}>
          <Text style={signUp.title}>Register Account</Text>
          <Text style={signUp.subtitle}>New to CoachSync? <Link to='/sign-up' style={signUp.link}>Sign up here</Link>!</Text>
          {errorText && (<View style={messageBox.errorBox}>
              <View style={messageBox.icon}><Icon name='close-circle-outline' size={30} type='ionicon' color={colorsLight.darkGray}/></View>
              <Text style={messageBox.text}>{errorText} We can help you <Link to='/forgot-password' style={signUp.linkBlend}>recover your password</Link>.
              {attemptsLeft !== null && attemptsLeft > 0 && attemptsLeft < 10 && (<View>{"\n"}{"\n"}<Text style={[messageBox.text]}>For security reasons, after <Text style={bold}>{attemptsLeft}</Text> more failed login attempts, you'll have to wait <Text style={bold}>30 minutes</Text> before trying again.</Text></View>)}
              </Text>
            </View>) || (<View></View>)}
          <Text style={signUp.inputLabel}>Email</Text>
          <TextInput
            style={signUp.inputStyle}
            value={email}
            onChangeText={onChangeTextEmail}
          />
          <Text style={signUp.inputLabel}>Password</Text>
          <TextInput
            style={signUp.inputStyle}
            value={password}
            secureTextEntry={true}
            onChangeText={onChangeTextPassword}
          />
          {showCaptcha && (<Recaptcha
            sitekey='6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI'
            callback={verifyCallback}
            expiredCallback={expiredCallback}
          />)}
          <Button
          title='Log In'
          disabled={buttonDisabled}
          buttonStyle={signUp.submitButton}
          containerStyle={signUp.submitButtonContainer}
          onPress={onSubmit}/>
        </View>
      </View>)}
    </View>
  </ScrollView>)
}
