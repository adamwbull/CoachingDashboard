import { StatusBar } from 'expo-status-bar'
import React, { useEffect, useState, useCallback } from 'react'
import { TouchableOpacity, ScrollView, Linking, Animated, Image, StyleSheet, Text, View } from 'react-native'
import { signUpLight, logoLight, navLogo, colorsLight, messageBox, bold, btnColors } from '../Scripts/Styles.js'
import { signUpDark, logoDark, colorsDark } from '../Scripts/StylesDark.js'
import { Button, Icon, PricingCard } from 'react-native-elements'
import { useLinkTo, Link } from '@react-navigation/native'
import { TextInput } from 'react-native-web'
import { set, get, getTTL, ttl } from '../Scripts/Storage.js'
import { createAccount, getActiveDiscount, verifyCaptcha, containsSpecialCharacters, hasUpperCase, emailCheck, sqlToJsDate, parseDateText, toFullDate } from '../Scripts/API.js'
import Recaptcha from 'react-grecaptcha'
import ActivityIndicatorView from '../Scripts/ActivityIndicatorView.js'
import DatePicker from 'react-date-picker/dist/entry.nostyle'
import "../Scripts/DatePicker/DatePicker.css"
import "../Scripts/DatePicker/Calendar.css"
import { validate } from 'validate.js';
import { registerConstraints } from '../Scripts/Validator/constraints.js'
import DateCountdown from 'react-date-countdown-timer';

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
  const [showPricingForm, setShowPricingForm] = useState(false)
  const [showRegisterForm, setShowRegisterForm] = useState(true)
  const [showPaymentForm, setShowPaymentForm] = useState(false)

  // Form controls and style.
  var failed = get('TimesFailed')
  var dis = (failed == null) ? false : true
  const [errorText, setErrorText] = useState(false)
  const [buttonDisabled, setButtonDisabled] = useState(dis)
  const [timesFailed, setTimesFailed] = useState(failed)

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
  const [activeDiscountPerc, setActiveDiscountPerc] = useState(100)
  const [activeDiscountDesc, setActiveDiscountDesc] = useState(false)
  const [activeDiscountExpire, setActiveDiscountExpire] = useState(false)

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

  const discount = async () => {
    const d = await getActiveDiscount()
    var expire = sqlToJsDate(d.ExpirationDate)
    // Use Moment: https://momentjs.com/
    var str = toFullDate(expire)
    console.log(str)
    setActiveDiscountExpire(str)
    setActiveDiscountPerc(d.Percent)
  }

  useEffect(() => {
    document.title = 'Sign Up - CoachSync'
    const coach = get('Coach')
    if (coach !== null) {
      if (coach.RegistrationCompleted == 0) {
        discount()
        setFirstName(coach.FirstName)
        setShowRegisterForm(false)
        setShowActivityIndicator(true)
        delay(300)
        setShowActivityIndicator(false)
        setShowPricingForm(true)
      } else {
        linkTo('/overview')
      }
    }
  }, [activeDiscountExpire])

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
    var errorText = ''
    // Validations.
    var emailCheckPassed = await emailCheck(email)
    if (emailCheckPassed == false) {
      errorText += `That email is already taken.${"\n"}`
    }

    if (!containsSpecialCharacters(password) || !hasUpperCase(password) || password.length < 8) {
      errorText += `Password must be 8+ chars long, contain at least one special character, and at least one uppercase letter.${"\n"}`
    }

    var data = {
      emailAddress:email,
      dob:dob,
      firstName:firstName,
      lastName:lastName,
      password:password,
      confirmPassword: confirmPassword
    }

    validate.extend(validate.validators.datetime, {
      // The value is guaranteed not to be null or undefined but otherwise it
      // could be anything.
      parse: function(value) {
        var d = new Date(value);
        return d;
      },
      // Input is a unix timestamp
      format: function(value, options) {
        var format = options.dateOnly ? "YYYY-MM-DD" : "YYYY-MM-DD hh:mm:ss";
        return new Date(value, format);
      }
    });

    const validationResult = validate(data, registerConstraints)
    // Decide what to do.
    if (validationResult != undefined || errorText != '') {
      var i = data.length-1
      for (var key in validationResult) {
        if (i !== 0) {
          i++
          errorText += validationResult[key][0] + `${"\n"}`
        } else {
          errorText += validationResult[key][0]
        }
      }
      setErrorText(errorText)
      setButtonDisabled(true)
      var newFailed = get('TimesFailed')
      if (newFailed == null) {
        set('TimesFailed',1,60)
        setTimesFailed(1)
      } else {
        setTimesFailed(0)
        set('TimesFailed',newFailed+1,60)
        setTimesFailed(newFailed+1)
      }
    } else {
      var created = await createAccount(email, dob, firstName, lastName, password);
      set('Coach',created,ttl)
      setShowRegisterForm(false)
      setShowActivityIndicator(true)
      await delay(300)
      setShowActivityIndicator(false)
      setShowPricingForm(true)
    }

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
    setShowPaymentForm(true)
  }

  const onBackPayment = async () => {
    setShowPaymentForm(false)
    setShowActivityIndicator(true)
    await delay(300)
    setShowActivityIndicator(false)
    setShowPricingForm(true)
  }

  const verifyCallback = async (response) => {
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
      {showPaymentForm && (<View style={signUp.paymentForm}>
        <TouchableOpacity style={signUp.backContainer} onPress={onBackPayment}>
          <Icon containerStyle={signUp.iconStyle} color={colors.mainTextColor} type='ionicon' name='arrow-back-circle-outline'/>
          <Text style={signUp.backText}>Go Back</Text>
        </TouchableOpacity>
      </View>)}
      {showPricingForm && (<View style={{flexShrink:1}}>
        <Text style={signUp.pricingTitle}>Welcome to CoachSync, {firstName}!</Text>
        <Text style={signUp.pricingIntro}>The next step is to choose the perfect package for you.</Text>
        <View style={[signUp.pricingCards,pricingCardsStyle]}>
        <PricingCard
          color={btnColors.primary}
          title="Free"
          price={<View>
            <Text>$0/mo</Text>
            {activeDiscountExpire && (<View style={signUp.prevPriceHeight}>
            </View>)}
          </View>}
          info={['Up to 3 Clients', 'Prompts/Concepts/Surveys', 'Calendly Integration', 'Messaging and Social Feed']}
          button={{ title: 'Select' }}
          containerStyle={signUp.pricingCardContainer}
          onButtonPress={() => onPriceSelect(1)}
        />
        <View>
          <Text style={signUp.pricingHighlight}>Most Popular:</Text>
          <PricingCard
            color={btnColors.success}
            title={<View>
              <Text>Standard</Text>
            </View>}
            price={<View>
              <Text>${(69.99*((100-activeDiscountPerc)/100.0)).toFixed(2)}/mo</Text>
              {activeDiscountExpire && (<View style={[signUp.previousPriceContainer,signUp.prevPriceHeight]}>
                <Text style={signUp.previousPrice}>69.99</Text>
                <Text style={signUp.previousPriceDiscount}>{activeDiscountPerc}% off</Text>
              </View>)}
              {activeDiscountExpire && (<View style={{fontSize:20}}><DateCountdown dateTo={activeDiscountExpire} mostSignificantFigure='day' locales={['y','m','d','h','m','s']} callback={()=>discount()} /></View>)}
            </View>}
            info={['Up to 10 Clients', 'All Free Features', 'Client Payment Collection', 'Basic Support']}
            button={{ title: 'Select' }}
            containerStyle={signUp.pricingCardContainerMiddle}
            onButtonPress={() => onPriceSelect(2)}
          />
        </View>
        <PricingCard
          color={btnColors.danger}
          title={<View>
            <Text>Professional</Text>
          </View>}
          price={<View>
            <Text>${(119.99*((100-activeDiscountPerc)/100.0)).toFixed(2)}/mo</Text>
            {activeDiscountExpire && (<View style={[signUp.previousPriceContainer,signUp.prevPriceHeight]}>
              <Text style={signUp.previousPrice}>119.99</Text>
              <Text style={signUp.previousPriceDiscount}>{activeDiscountPerc}% off</Text>
            </View>)}
            {activeDiscountExpire && (<View style={{fontSize:20}}><DateCountdown dateTo={activeDiscountExpire} mostSignificantFigure='day' locales={['y','m','d','h','m','s']} callback={()=>discount()} /></View>)}
          </View>}
          info={['Unlimited Clients!', 'All Standard Features', 'Premium Support', 'Contract Signing']}
          button={{ title: 'Select' }}
          containerStyle={signUp.pricingCardContainer}
          onButtonPress={() => onPriceSelect(3)}
        />
        </View>
      </View>)}
      {showRegisterForm && (<View style={{flexShrink:1}}>
        <View style={signUp.form}>
          <Text style={signUp.title}>Register Account</Text>
          <Text style={signUp.pricingIntro}>You're moments away from bringing your coaching practice to the next level!</Text>
          {errorText && (<View style={messageBox.errorBox}>
              <View style={messageBox.icon}><Icon name='close-circle-outline' size={30} type='ionicon' color={colorsLight.darkGray}/></View>
              <Text style={messageBox.text}>{errorText}</Text>
            </View>) || (<View></View>)}
          <View style={[signUp.formRow,pricingCardsStyle]}>
            <View style={signUp.formColumn}>
              <Text style={[signUp.inputLabel,{marginTop:20}]}>Email</Text>
              <TextInput
                style={signUp.inputStyle}
                value={email}
                keyboardType='email'
                onChangeText={onEmail}
              />
            </View>
            <View style={signUp.formColumn}>
              <Text style={signUp.inputLabel}>Birthday</Text>
              <DatePicker
                onChange={onDOB}
                value={dob}
                monthPlaceholder='mm'
                dayPlaceholder='dd'
                yearPlaceholder='yyyy'
                disableCalendar={true}
                style={signUp.inputStyle}
              />
            </View>
          </View>
          <View style={[signUp.formRow,pricingCardsStyle]}>
            <View style={signUp.formColumn}>
              <Text style={signUp.inputLabel}>First Name</Text>
              <TextInput
                style={signUp.inputStyle}
                value={firstName}
                onChangeText={onFirstName}
              />
            </View>
            <View style={signUp.formColumn}>
              <Text style={[signUp.inputLabel]}>Last Name</Text>
              <TextInput
                style={signUp.inputStyle}
                value={lastName}
                onChangeText={onLastName}
              />
            </View>
          </View>
          <View style={[signUp.formRow,pricingCardsStyle]}>
            <View style={signUp.formColumn}>
            <Text style={signUp.inputLabel}>Password</Text>
              <TextInput
                style={signUp.inputStyle}
                value={password}
                secureTextEntry={true}
                onChangeText={onPassword}
              />
            </View>
            <View style={signUp.formColumn}>
              <Text style={signUp.inputLabel}>Confirm Password</Text>
              <TextInput
                style={signUp.inputStyle}
                value={confirmPassword}
                secureTextEntry={true}
                onChangeText={onConfirmPassword}
              />
            </View>
          </View>
          {(timesFailed > 0) && (<Recaptcha
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
        </View>
      </View>)}
    </View>
  </ScrollView>)
}
