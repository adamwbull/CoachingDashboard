import { StatusBar } from 'expo-status-bar'
import React, { useEffect, useState, useCallback } from 'react'
import { TouchableOpacity, ScrollView, Linking, Animated, Image, StyleSheet, Text, View } from 'react-native'
import { signUpLight, logoLight, navLogo, colorsLight, messageBox, bold, btnColors } from '../Scripts/Styles.js'
import { signUpDark, logoDark, colorsDark } from '../Scripts/StylesDark.js'
import { Button, Icon, PricingCard } from 'react-native-elements'
import { useLinkTo, Link } from '@react-navigation/native'
import { TextInput } from 'react-native-web'
import { set, get, getTTL, ttl } from '../Scripts/Storage.js'
import { loginCheck, verifyCaptcha } from '../Scripts/API.js'
import Recaptcha from 'react-grecaptcha'
import ActivityIndicatorView from '../Scripts/ActivityIndicatorView.js'
import DatePicker from 'react-date-picker/dist/entry.nostyle'
import "../Scripts/DatePicker/DatePicker.css"
import "../Scripts/DatePicker/Calendar.css"

const delay = ms => new Promise(res => setTimeout(res, ms))

export default function Welcome() {
  // Refs.
  const linkTo = useLinkTo()

  // Styling.
  const [signUp, setStyle] = useState(signUpLight)
  const [colors, setColors] = useState(colorsLight)

  // Media queries.
  const [pricingCardsStyle, setPricingCardsStyle] = useState({flexDirection:'row'})
  const [scrollStyle, setScrollStyle] = useState({flex:1})

  // Stage controls.
  const [opacity, setOpacity] = useState(new Animated.Value(0))
  const [refreshing, setRefreshing] = useState(false)
  const [showActivityIndicator, setShowActivityIndicator] = useState(false)
  const [showRegisterForm, setShowRegisterForm] = useState(false)
  const [showPricingForm, setShowPricingForm] = useState(true)

  // Form controls and style.
  var date = new Date()
  date = date.setFullYear(date.getFullYear() - 13)
  date = new Date(date)
  const [errorText, setErrorText] = useState(false)
  const [showCaptcha, setShowCaptcha] = useState(false)
  const [buttonDisabled, setButtonDisabled] = useState(false)
  const [maxDate, setMaxDate] = useState(date)

  // Storage for account creation.
  const [priceType, setPriceType] = useState(1)
  const [priceName, setPriceName] = useState('Free')
  const [priceStyle, setPriceStyle] = useState({})
  const [email, setEmail] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [dob, setDOB] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')


  const onLayout = (event) => {
    const { width, height } = event.nativeEvent.layout
    if (width < 1220) {
      setPricingCardsStyle({flexDirection:'column'})
    } else {
      setPricingCardsStyle({flexDirection:'row'})
      setScrollStyle({height})
    }
  }

  const onScroll = (event) => {
    setScrollStyle({height:event.nativeEvent.contentSize.height})
  }

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

  const onEmail = (text) => {
    setErrorText(false)
    setEmail(text)
  }

  const onFirstName = (text) => {
    setErrorText(false)
    setFirstName(text)
  }

  const onLastName = (text) => {
    setErrorText(false)
    setLastName(text)
  }

  const onDOB = (text) => {
    setErrorText(false)
    setDOB(text)
  }


  const onPassword = (text) => {
    setErrorText(false)
    setPassword(text)
  }

  const onConfirmPassword = (text) => {
    setErrorText(false)
    setConfirmPassword(text)
  }

  const onSubmit = async () => {

  }

  const onPriceSelect = async (type) => {
    setPriceType(type)
    var name, style
    if (type == 1) {
      name = 'Free Plan'
      style = {color:btnColors.primary}
    } else if (type == 2) {
      name = 'Standard Plan'
      style = {color:colorsLight.primaryHighlight}
    } else if (type == 3) {
      name = 'Professional Plan'
      style = {color:btnColors.danger}
    }
    setPriceName(name)
    setPriceStyle(style)
    setShowPricingForm(false)
    setShowActivityIndicator(true)
    await delay(300)
    setShowActivityIndicator(false)
    setShowRegisterForm(true)
  }

  const onBackRegister = async () => {
    setShowRegisterForm(false)
    setShowActivityIndicator(true)
    await delay(300)
    setShowActivityIndicator(false)
    setShowPricingForm(true)
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

  return (<ScrollView contentContainerStyle={[signUp.container,scrollStyle]} scrollEnabled={true} onLayout={onLayout} onScroll={onScroll}>
    <View style={signUp.logoContainer}><Animated.Image
        onLoad={onLoad}
        source={navLogo}
        resizeMode="contain"
        style={[
          {
            opacity: opacity,
            transform: [
              {
                scale: opacity.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.85, 1],
                })
              },
            ],
          },
          signUp.logo
        ]}
    /></View>
    <View style={signUp.main}>
      {showActivityIndicator && (<ActivityIndicatorView />)}
      {showPricingForm && (<View style={{flexShrink:1}}>
        <Text style={signUp.pricingTitle}>Welcome to CoachSync!</Text>
        <Text style={signUp.pricingIntro}>You're moments away from bringing your coaching practice to the next level!</Text>
        <Text style={signUp.pricingIntro}>The first step is to choose the perfect package for you.</Text>
        <View style={[signUp.pricingCards,pricingCardsStyle]}>
        <PricingCard
          color={btnColors.primary}
          title="Free"
          price="$0"
          info={['Up to 3 Clients', 'Prompts/Concepts/Surveys', 'Calendly Integration', 'Messaging and Social Feed']}
          button={{ title: 'Select' }}
          containerStyle={signUp.pricingCardContainer}
          onButtonPress={() => onPriceSelect(1)}
        />
        <View>
          <Text style={signUp.pricingHighlight}>Most Popular:</Text>
          <PricingCard
            color={btnColors.success}
            title="Standard"
            price="$49.99/mo"
            info={['Up to 10 Clients', 'All Free Features', 'Client Payment Collection', 'Basic Support']}
            button={{ title: 'Select' }}
            containerStyle={signUp.pricingCardContainerMiddle}
            onButtonPress={() => onPriceSelect(2)}
          />
        </View>
        <PricingCard
          color={btnColors.danger}
          title="Professional"
          price="$99.99/mo"
          info={['Unlimited Clients!', 'All Standard Features', 'Premium Support', 'Contract Signing']}
          button={{ title: 'Select' }}
          containerStyle={signUp.pricingCardContainer}
          onButtonPress={() => onPriceSelect(3)}
        />
        </View>
      </View>)}
      {showRegisterForm && (<View>
        <View style={signUp.form}>
          <Text style={signUp.title}>Register Account</Text>
          <Text style={signUp.subtitle}>You chose the <Text style={priceStyle}>{priceName}</Text>!</Text>
          {errorText && (<View style={messageBox.errorBox}>
              <View style={messageBox.icon}><Icon name='close-circle-outline' size={30} type='ionicon' color={colorsLight.darkGray}/></View>
              <Text style={messageBox.text}>{errorText} We can help you <Link to='/forgot-password' style={signUp.linkBlend}>recover your password</Link>.
              {attemptsLeft !== null && attemptsLeft > 0 && attemptsLeft < 10 && (<View>{"\n"}{"\n"}<Text style={[messageBox.text]}>For security reasons, after <Text style={bold}>{attemptsLeft}</Text> more failed login attempts, you'll have to wait <Text style={bold}>30 minutes</Text> before trying again.</Text></View>)}
              </Text>
            </View>) || (<View></View>)}
          <View style={[signUp.formRow,pricingCardsStyle]}>
            <View style={signUp.formColumn}>
              <Text style={signUp.inputLabel}>Email</Text>
              <TextInput
                style={signUp.inputStyle}
                value={email}
                keyboardType='email'
                onChangeText={onEmail}
              />
              <Text style={signUp.inputLabel}>First Name</Text>
              <TextInput
                style={signUp.inputStyle}
                value={firstName}
                secureTextEntry={true}
                onChangeText={onFirstName}
              />
              <Text style={signUp.inputLabel}>Password</Text>
              <TextInput
                style={signUp.inputStyle}
                value={password}
                secureTextEntry={true}
                onChangeText={onPassword}
              />
            </View>
            <View style={signUp.formColumn}>
              <Text style={signUp.inputLabel}>Birthday</Text>
              <DatePicker
                onChange={onDOB}
                value={dob}
                style={signUp.inputStyle}
                maxDate={maxDate}
              />
              <Text style={[signUp.inputLabel,{marginTop:20}]}>Last Name</Text>
              <TextInput
                style={signUp.inputStyle}
                value={lastName}
                secureTextEntry={true}
                onChangeText={onLastName}
              />
              <Text style={signUp.inputLabel}>Confirm Password</Text>
              <TextInput
                style={signUp.inputStyle}
                value={password}
                secureTextEntry={true}
                onChangeText={onConfirmPassword}
              />
            </View>
          </View>
          {showCaptcha && (<Recaptcha
            sitekey='6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI'
            callback={verifyCallback}
            expiredCallback={expiredCallback}
          />)}
          <Button
          title='Create Account'
          disabled={buttonDisabled}
          buttonStyle={signUp.submitButton}
          containerStyle={signUp.submitButtonContainer}
          onPress={onSubmit}/>
          <TouchableOpacity style={signUp.backContainer} onPress={onBackRegister}>
            <Icon containerStyle={signUp.iconStyle} color={colors.mainTextColor} type='ionicon' name='arrow-back-circle-outline'/>
            <Text style={signUp.backText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </View>)}
    </View>
  </ScrollView>)
}
