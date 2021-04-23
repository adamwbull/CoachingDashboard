import { StatusBar } from 'expo-status-bar'
import React, { useEffect, useState, useCallback } from 'react'
import { TouchableOpacity, ScrollView, Linking, Animated, Image, StyleSheet, Text, View } from 'react-native'
import { signUpLight, logoLight, navLogo, colorsLight, messageBox, bold, btnColors } from '../Scripts/Styles.js'
import { signUpDark, logoDark, colorsDark } from '../Scripts/StylesDark.js'
import { Button, Icon, PricingCard, ButtonGroup } from 'react-native-elements'
import { useLinkTo, Link } from '@react-navigation/native'
import { TextInput } from 'react-native-web'
import { set, get, getTTL, ttl } from '../Scripts/Storage.js'
import { createAccount, getActiveDiscount, getNumCoaches, verifyCaptcha, containsSpecialCharacters, hasUpperCase, emailCheck, sqlToJsDate, parseDateText, toFullDate, getPlans } from '../Scripts/API.js'
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
  const [showActivityIndicator, setShowActivityIndicator] = useState(true)
  const [showPricingForm, setShowPricingForm] = useState(false)
  const [showRegisterForm, setShowRegisterForm] = useState(false)
  const [showPaymentForm, setShowPaymentForm] = useState(false)

  // Form controls and style.
  var failed = get('TimesFailed')
  var dis = (failed == null) ? false : true
  const [errorText, setErrorText] = useState(false)
  const [buttonDisabled, setButtonDisabled] = useState(dis)
  const [timesFailed, setTimesFailed] = useState(failed)
  const [annual, setAnnual] = useState(1)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [paymentIndex, setPaymentIndex] = useState(0)
  const [priceUnit, setPriceUnit] = useState('mo')
  const [priceStyle, setPriceStyle] = useState({color:btnColors.primary})
  const [priceAmount, setPriceAmount] = useState(0)
  const [priceMemo, setPriceMemo] = useState('')
  const [priceBase, setPriceBase] = useState(0)
  const [firstPlan, setFirstPlan] = useState({})
  const [secondPlan, setSecondPlan] = useState({})
  const [thirdPlan, setThirdPlan] = useState({})
  const [coachCount, setCoachCount] = useState(0)

  // Storage for account creation.
  const [priceType, setPriceType] = useState(1)
  const [priceName, setPriceName] = useState('Free')
  const [email, setEmail] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [dob, setDOB] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [activeDiscountPerc, setActiveDiscountPerc] = useState(0)
  const [activeDiscountDesc, setActiveDiscountDesc] = useState(false)
  const [activeDiscountExpire, setActiveDiscountExpire] = useState(false)
  const [activeDiscountDurText, setActiveDiscountDurText] = useState('')
  const [activeDiscountMonths, setActiveDiscountMonths] = useState(0)
  const [cardNumber, setCardNumber] = useState('')
  const [cardDate, setCardDate] = useState('')
  const [cvc, setCVC] = useState('')

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
    if (d !== false) {
      var expire = sqlToJsDate(d.ExpirationDate)
      // Use Moment: https://momentjs.com/
      var str = toFullDate(expire)
      setActiveDiscountExpire(str)
      setActiveDiscountMonths(d.MonthDuration)
      setActiveDiscountPerc(d.Percent)
      setActiveDiscountDesc(d.Description)
      setActiveDiscountDurText(d.DurationText)
    }
  }

  const plans = async (t) => {
    var res = await getPlans(t)
    var plan1 = res[0]
    plan1.InfoParsed = plan1.Info.split(',')
    setFirstPlan(plan1)
    var plan2 = res[1]
    plan2.InfoParsed = plan2.Info.split(',')
    setSecondPlan(plan2)
    var plan3 = res[2]
    plan3.InfoParsed = plan3.Info.split(',')
    setThirdPlan(plan3)
  }

  const coaches = async () => {
    var count = await getNumCoaches()
    setCoachCount(count)
  }

  useEffect(() => {
    document.title = 'Sign Up - CoachSync'
    const coach = get('Coach')
    coach.FirstName = 'Adam'
    if (coach !== null) {
      if (coach.RegistrationCompleted == 0) {
        discount()
        coaches()
        plans(coach.Token)
        setTimeout(() => {
          setFirstName(coach.FirstName)
          setShowActivityIndicator(false)
          setShowPricingForm(true)
        }, 500)
      } else {
        linkTo('/overview')
      }
    } else {
      delay(1000)
      setShowActivityIndicator(false)
      setShowRegisterForm(true)
    }
  }, [])

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

  const selectButton = (i) => {
    if (i == 0) {
      setSelectedIndex(0)
      setAnnual(1)
      setPriceUnit('mo')
    } else if (i == 1) {
      setSelectedIndex(1)
      setAnnual(12)
      setPriceUnit('yr')
    }
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

  const onPriceSelect = async (type) => {
    setPriceType(type)
    var name, style, amount, memo, dateType, priceBase, discountLine, lengthText
    if (type == 1) {
      name = 'Free Plan'
      style = {color:colorsLight.secondaryHighlight}
      amount = (firstPlan.BasePrice*((100-activeDiscountPerc)/100.0)*annual).toFixed(2)
      dateType = (selectedIndex == 0) ? 'Monthly' : 'Annually'
      priceBase = firstPlan.BasePrice*annual
    } else {
      if (type == 2) {
        name = 'Standard Plan'
        style = {color:colorsLight.secondaryHighlight}
        amount = (secondPlan.BasePrice*((100-activeDiscountPerc)/100.0)*annual).toFixed(2)
        dateType = (selectedIndex == 0) ? 'Monthly' : 'Annually'
        priceBase = secondPlan.BasePrice*annual
      } else if (type == 3) {
        name = 'Professional Plan'
        style = {color:colorsLight.secondaryHighlight}
        amount = (thirdPlan.BasePrice*((100-activeDiscountPerc)/100.0)*annual).toFixed(2)
        dateType = (selectedIndex == 0) ? 'Monthly' : 'Annually'
        priceBase = thirdPlan.BasePrice*annual
      }
      lengthText = (selectedIndex == 0) ? '/mo for ' + activeDiscountMonths + ' ' + ((activeDiscountMonths > 1) ? 'months ' : 'month ') : ' for a year '
      discountLine = (activeDiscountExpire != false) ? `${"\n"}$` + amount + lengthText + 'then $' + priceBase + ' after' : ''
      memo = activeDiscountDesc + ' ' + dateType + ' ' + name + discountLine
      setPriceName(name)
      setPriceStyle(style)
      setPriceAmount(amount)
      setPriceMemo(memo)
      setPriceBase(priceBase)
      setShowPricingForm(false)
      setShowActivityIndicator(true)
      await delay(300)
      setShowActivityIndicator(false)
      setShowPaymentForm(true)
    }
  }

  const onBackPayment = async () => {
    setShowPaymentForm(false)
    setShowActivityIndicator(true)
    await delay(300)
    setShowActivityIndicator(false)
    setShowPricingForm(true)
  }

  const selectPaymentOption = (i) => {
    setPaymentIndex(i)
  }

  const submitPayment = () => {
    console.log('paying')
  }

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
      {showPaymentForm && (<View style={signUp.paymentFormContainer}>
        <TouchableOpacity style={signUp.backContainer} onPress={onBackPayment}>
          <Icon containerStyle={signUp.iconStyle} color={colors.mainTextColor} type='ionicon' name='arrow-back-circle-outline'/>
          <Text style={signUp.backText}>Go Back</Text>
        </TouchableOpacity>
        <View style={[signUp.paymentForm,pricingCardsStyle]}>
          <View style={[signUp.paymentInfo,{backgroundColor:priceStyle.color}]}>
            <View style={signUp.paymentIcon}>
              <Icon size={40} color='#fff' name='cart-outline' type='ionicon' />
            </View>
            <View style={signUp.paymentItem}>
              <View style={signUp.paymentItemDetails}>
                <Text style={signUp.paymentItemTitle}>{priceName}</Text>
                <Text style={signUp.paymentItemMemo}>{priceMemo}</Text>
              </View>
              <View style={signUp.paymentItemAmount}>
                <Text style={signUp.paymentDiscountAmount}>${activeDiscountExpire && (priceBase)}</Text>
                <Text style={signUp.paymentPrimaryAmount}>${priceAmount}</Text>
              </View>
            </View>
            <View style={signUp.stripeSection}>
              <Animated.Image
                  onLoad={onLoad}
                  source={require('../assets/stripe.png')}
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
                    signUp.paymentStripe
                  ]}
              />
            </View>
          </View>
          <View style={signUp.paymentMain}>
            <View style={signUp.paymentOptions}>
              <ButtonGroup
                onPress={selectPaymentOption}
                buttons={['Credit Card','PayPal']}
                selectedIndex={paymentIndex}
                textStyle={signUp.groupPaymentButton}
                selectedTextStyle={{backgroundColor:priceStyle.color}}
                selectedButtonStyle={{backgroundColor:priceStyle.color}}
                style={{margin:0,padding:0}}
              />
            </View>
            {paymentIndex == 0 && (<View><View style={signUp.paymentEnterInfo}>
              <TextInput
                style={signUp.inputCardNumber}
                value={cardNumber}
                placeholder='Card Number'
                keyboardType='email'
                onChangeText={(t) => { setCardNumber(t) }}
              />
              <View style={signUp.paymentCardBack}>
                <TextInput
                  style={signUp.inputCardDate}
                  value={cardDate}
                  placeholder='MM/YYYY'
                  keyboardType='email'
                  onChangeText={(t) => { setCardDate(t) }}
                />
                <TextInput
                  style={signUp.inputCVC}
                  value={cvc}
                  placeholder='CVC'
                  keyboardType='email'
                  onChangeText={(t) => { setCVC(t) }}
                />
              </View>
            </View><Button
              title={'Pay $' + priceAmount}
              buttonStyle={signUp.paymentSubmitButton}
              containerStyle={signUp.paymentSubmitButtonContainer}
              onPress={submitPayment}
            /></View>)}
          </View>
        </View>
      </View>)}
      {showPricingForm && (<View style={{flexShrink:1}}>
        <Text style={signUp.pricingTitle}>Welcome to CoachSync, {firstName}!</Text>
        <Text style={signUp.pricingIntro}>The next step is to choose the perfect package for you. You can also upgrade later!</Text>
        {false && (<Text style={signUp.timeLeft}>Time left on sale: {activeDiscountExpire && (<View style={signUp.countdown}><DateCountdown dateTo={activeDiscountExpire} mostSignificantFigure='day' locales={['y','m','d','h','m','s']} callback={()=>discount()} /></View>)}</Text>)}
        {activeDiscountExpire && (<Text style={signUp.timeLeft}>Beta Sale lasts for first 50 sign ups! <Text style={signUp.countdown}>{50-coachCount} spaces left</Text></Text>)}
        {true && (<View style={signUp.toggleAnnual}>
          <ButtonGroup
            onPress={selectButton}
            buttons={['Monthly','Annual']}
            selectedIndex={selectedIndex}
            containerStyle={signUp.groupButton}
            />
        </View>)}
        <View style={[signUp.pricingCards,pricingCardsStyle]}>
        <PricingCard
          color={btnColors.primary}
          title={firstPlan.Title}
          price={<View>
            <Text style={{fontSize:45}}>${firstPlan.BasePrice}/{priceUnit}</Text>
            {activeDiscountExpire && (<Text style={signUp.priceBottomText}>forever</Text>)}
          </View>}
          info={firstPlan.InfoParsed}
          button={{ title: 'Select' }}
          containerStyle={signUp.pricingCardContainer}
          onButtonPress={() => onPriceSelect(1)}
        />
        <View>
          <Text style={signUp.pricingHighlight}>Most Popular:</Text>
          <PricingCard
            color={btnColors.success}
            title={<View>
              {activeDiscountExpire && (<View style={[signUp.previousPriceContainer,signUp.prevPriceHeight]}>
                <Text style={signUp.discountDesc}>{activeDiscountDesc}</Text>
                <View style={signUp.previousPriceInner}>
                  <Text style={signUp.previousPrice}>{secondPlan.BasePrice*annual}</Text>
                  <Text style={signUp.previousPriceDiscount}>{activeDiscountPerc}% off</Text>
                </View>
              </View>)}
              <Text style={{fontSize:50}}>{secondPlan.Title}</Text>
            </View>}
            price={<View>
              <Text style={{fontSize:45}}>${(secondPlan.BasePrice*((100-activeDiscountPerc)/100.0)*annual).toFixed(2)}/{priceUnit}</Text>
              <Text style={signUp.priceBottomText}>{activeDiscountDurText}</Text>
            </View>}
            info={secondPlan.InfoParsed}
            button={{ title: 'Select' }}
            containerStyle={signUp.pricingCardContainerMiddle}
            onButtonPress={() => onPriceSelect(2)}
          />
        </View>
        <PricingCard
          color={btnColors.danger}
          title={<View>
            {activeDiscountExpire && (<View style={[signUp.previousPriceContainer,signUp.prevPriceHeight]}>
              <Text style={signUp.discountDesc}>{activeDiscountDesc}</Text>
              <View style={signUp.previousPriceInner}>
                <Text style={signUp.previousPrice}>{thirdPlan.BasePrice*annual}</Text>
                <Text style={signUp.previousPriceDiscount}>{activeDiscountPerc}% off</Text>
              </View>
            </View>)}
            <Text>{thirdPlan.Title}</Text>
          </View>}
          price={<View>
            <Text style={{fontSize:45}}>${(thirdPlan.BasePrice*((100-activeDiscountPerc)/100.0)*annual).toFixed(2)}/{priceUnit}</Text>
            <Text style={signUp.priceBottomText}>{activeDiscountDurText}</Text>
          </View>}
          info={thirdPlan.InfoParsed}
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
