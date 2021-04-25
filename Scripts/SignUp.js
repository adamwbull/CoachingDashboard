import { StatusBar } from 'expo-status-bar'
import React, { useEffect, useState, useCallback } from 'react'
import { TouchableOpacity, ScrollView, Linking, Animated, Image, StyleSheet, Text, View } from 'react-native'
import { signUpLight, logoLight, navLogo, colorsLight, messageBox, bold, btnColors } from '../Scripts/Styles.js'
import { signUpDark, logoDark, colorsDark } from '../Scripts/StylesDark.js'
import { Button, Icon, PricingCard, ButtonGroup } from 'react-native-elements'
import { useLinkTo, Link } from '@react-navigation/native'
import { TextInput } from 'react-native-web'
import { set, get, getTTL, ttl } from '../Scripts/Storage.js'
import { refreshCoach, url, createAccount, getActiveDiscount, getNumCoaches, verifyCaptcha, containsSpecialCharacters, hasUpperCase, emailCheck, sqlToJsDate, parseDateText, toFullDate, getPlans } from '../Scripts/API.js'
import Recaptcha from 'react-grecaptcha'
import ActivityIndicatorView from '../Scripts/ActivityIndicatorView.js'
import DatePicker from 'react-date-picker/dist/entry.nostyle'
import "../Scripts/DatePicker/DatePicker.css"
import "../Scripts/DatePicker/Calendar.css"
import { validate } from 'validate.js';
import { registerConstraints } from '../Scripts/Validator/constraints.js'
import DateCountdown from 'react-date-countdown-timer';
import { Helmet } from "react-helmet";
import { loadStripe } from '@stripe/stripe-js';
import {
  CardElement,
  Elements,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';

const delay = ms => new Promise(res => setTimeout(res, ms))

const SubscribeForm = ({onFinished, planId, annual, priceAmount}) => {

  // Get the lookup key for the price from the previous page redirect.
  const linkTo = useLinkTo()
  const [name, setName] = useState('');
  const [messages, setMessages] = useState('');
  const [subscription, setSubscription] = useState();
  const [refreshing, setRefreshing] = useState(false);

  // Styling.
  const [signUp, setStyle] = useState(signUpLight)
  const [colors, setColors] = useState(colorsLight)

  // helper for displaying status messages.
  const setMessage = (message) => {
    if (messages == '') {
      setMessages(`${message}`);
    } else {
      setMessages(`${messages}\n${message}`);
    }
  }

  const cardInputStyle = {
    style: {
      base: {
        fontSize: '16px',
        color: colorsLight.mainTextColor,
        '::placeholder': {
          color: '#aab7c4',
        },
      },
      invalid: {
        color: btnColors.danger,
      },
    },
  };

  // Initialize an instance of stripe.
  const stripe = useStripe();
  const elements = useElements();

  if (!stripe || !elements) {
    // Stripe.js has not loaded yet. Make sure to disable
    // form submission until Stripe.js has loaded.
    return '';
  }

  // When the subscribe-form is submitted we do a few things:
  //
  //   1. Tokenize the payment method
  //   2. Create the subscription
  //   3. Handle any next actions like 3D Secure that are required for SCA.
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Get a reference to a mounted CardElement. Elements knows how
    // to find your CardElement because there can only ever be one of
    // each type of element.
    const cardElement = elements.getElement(CardElement);

    // Use card Element to tokenize payment details
    let { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: cardElement,
      billing_details: {
        name: name,
      }
    });

    if (error) {
      // show error and collect new card details.
      setMessage(error.message);
      return;
    }

    setRefreshing(true)
    var coach = get('Coach')
    var arr = {
      planId,
      annual,
      paymentMethodId: paymentMethod.id,
      CoachId:coach.Id,
      Token:coach.Token
    };
    console.log(arr)
    // Create the subscription.
    let { subError, subscription } = await fetch(url + '/user/coach/create-stripe-subscription', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(arr),
    }).then(r => r.json());
    setRefreshing(false)

    if(subError) {
      // show error and collect new card details.
      setMessage(subError.message);
      return;
    }

    setMessage(`Subscription created with status: ${subscription.status}`);
    setSubscription(subscription);

    // This sample only supports a Subscription with payment
    // upfront. If you offer a trial on your subscription, then
    // instead of confirming the subscription's latest_invoice's
    // payment_intent. You'll use stripe.confirmCardSetup to confirm
    // the subscription's pending_setup_intent.
    switch(subscription.status) {
      case 'active':
        // Redirect to account page
        onFinished()
        break;

      case 'incomplete':

        // Handle next actions
        //
        // If the status of the subscription is `incomplete` that means
        // there are some further actions required by the customer. In
        // the case of upfront payment (not trial) the payment is confirmed
        // by passing the client_secret of the subscription's latest_invoice's
        // payment_intent.
        //
        // For trials, this works a little differently and requires a call to
        // `stripe.confirmCardSetup` and passing the subscription's
        // pending_setup_intent's client_secret like so:
        //
        //   const {error, setupIntent} = await stripe.confirmCardSetup(
        //     subscription.pending_setup_intent.client_secret
        //   )
        //
        // then handling the resulting error and setupIntent as we do below.
        //
        // This sample does not support subscriptions with trials. Instead, use these docs:
        // https://stripe.com/docs/billing/subscriptions/trials
        const {error} = await stripe.confirmCardPayment(
          subscription.latest_invoice.payment_intent.client_secret,
        )

        if(error) {
          setMessage(error.message);
        } else {
          setMessage("Success! Redirecting to your account.");
          setSubscription({ status: 'active' });
        }
        break;


      default:
        setMessage(`Unknown Subscription status: ${subscription.status}`);
    }

  }

  if(subscription && subscription.status === 'active') {
    onFinished()
  }

  return (<View>
    {refreshing && (<ActivityIndicatorView />)}
    {refreshing == false && (<View>
      {messages.length > 0 && (<View style={[messageBox.errorBox,{marginTop:10,marginLeft:10,marginRight:10}]}>
          <View style={messageBox.icon}><Icon name='close-circle-outline' size={30} type='ionicon' color={colorsLight.darkGray}/></View>
          <Text style={messageBox.text}>{messages}</Text>
        </View>) || (<View></View>)}
      <TextInput
        style={signUp.inputCardName}
        value={name}
        placeholder='Cardholder Name'
        placeholderTextColor='#aab7c4'
        keyboardType='default'
        onChangeText={(t) => { setName(t) }}
      />
      <View style={signUp.cardWrapper}>
        <CardElement options={cardInputStyle} />
      </View>
      <Button
      title={'Pay $' + priceAmount}
      buttonStyle={signUp.paymentSubmitButton}
      containerStyle={signUp.paymentSubmitButtonContainer}
      onPress={handleSubmit} />
      <Text style={signUp.paymentBottomText}>You can unsubscribe or adjust your plan later.</Text>
    </View>)}
  </View>)
}

export default function SignUp() {
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
  const [showCongrats, setShowCongrats] = useState(false)
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
  const [priceStyle, setPriceStyle] = useState(btnColors.success)
  const [priceAmount, setPriceAmount] = useState(0)
  const [priceMemo, setPriceMemo] = useState('')
  const [priceBase, setPriceBase] = useState(0)
  const [chosenPlan, setChosenPlan] = useState({})
  const [plans, setPlans] = useState([{BasePrice:0, Title:''},{BasePrice:0, Title:''},{BasePrice:0, Title:''}])
  const [coachCount, setCoachCount] = useState(0)

  const [cardError, setMessage] = useState(false)

  // Storage for account creation.
  const [priceType, setPriceType] = useState(1)
  const [priceName, setPriceName] = useState('Free Plan')
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

  const loadPlans = async (t) => {
    var res = await getPlans(t)
    var plan1 = res[0]
    var plan2 = res[1]
    var plan3 = res[2]
    plan1.InfoParsed = plan1.Info.split(',')
    plan2.InfoParsed = plan2.Info.split(',')
    plan3.InfoParsed = plan3.Info.split(',')
    var newPlans = []
    newPlans[0] = plan1
    newPlans[1] = plan2
    newPlans[2] = plan3
    setPlans(newPlans)
  }

  const coaches = async () => {
    var count = await getNumCoaches()
    setCoachCount(count)
  }

  useEffect(() => {
    const coach = get('Coach')
    if (coach !== null) {
      if (coach.RegistrationCompleted == 0) {
        try {
          discount()
          coaches()
          loadPlans(coach.Token)
        } finally {
          setTimeout(() => {
            setFirstName(coach.FirstName)
            setShowActivityIndicator(false)
            setShowPricingForm(true)
          }, 500)
        }
      } else {
        setFirstName(coach.FirstName)
        paymentCheck(coach.Plan)
        setShowActivityIndicator(false)
        setShowCongrats(true)
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
      try {
        discount()
        coaches()
        loadPlans(created.Token)
      } finally {
        setShowRegisterForm(false)
        setShowActivityIndicator(true)
        await delay(300)
        setShowActivityIndicator(false)
        setShowPricingForm(true)
      }
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
    if (type == 0) {
      name = 'Free Plan'
      amount = (plans[0].BasePrice*((100-activeDiscountPerc)/100.0)*annual).toFixed(2)
      priceBase = plans[0].BasePrice*annual
      style = btnColors.primary
    } else {
      if (type == 1) {
        name = 'Standard Plan'
        amount = (plans[1].BasePrice*((100-activeDiscountPerc)/100.0)*annual).toFixed(2)
        priceBase = plans[1].BasePrice*annual
        style = btnColors.success
      } else if (type == 2) {
        name = 'Professional Plan'
        amount = (plans[2].BasePrice*((100-activeDiscountPerc)/100.0)*annual).toFixed(2)
        priceBase = plans[2].BasePrice*annual
        style = btnColors.danger
      }
      dateType = (selectedIndex == 0) ? 'Monthly' : 'Annual'
      lengthText = (selectedIndex == 0) ? '/mo for ' + activeDiscountMonths + ' ' + ((activeDiscountMonths > 1) ? 'months ' : 'month ') : ' for a year '
      discountLine = (activeDiscountExpire != false) ? `${"\n"}$` + amount + lengthText + 'then $' + priceBase + ' after' : ''
      memo = dateType + ' Subscription' + discountLine
      setChosenPlan(plans[type])
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

  const paymentCheck = (type) => {
    var style, name
    if (type == 1) {
      name = 'Standard Plan'
      style = btnColors.success
    } else if (type == 2) {
      name = 'Professional Plan'
      style = btnColors.danger
    }
    setPriceName(name)
    setPriceStyle(style)
    setShowCongrats(true)
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

  const stripePromise = loadStripe('pk_test_51Ibda0Doo38J0s0VtHeC0WxsqtMWNxu6xy9FcAwt9Tch77641I6LeIAmWHcbzVSeiFh6m2smQt3C9OgSYIlo4RAK00ZPlZhqub')

  const handleFinish = async () => {
    const coach = get('Coach')
    var updated = await refreshCoach(coach.Id, coach.Token);
    set('Coach',updated,ttl)
    setShowPaymentForm(false)
    setShowActivityIndicator(true)
    await delay(300)
    setShowActivityIndicator(false)
    setShowCongrats(true)

  }
  const dashboard = async () => {
    linkTo('/home')
  }

  return (<ScrollView contentContainerStyle={[signUp.container,scrollStyle]} scrollEnabled={true} onLayout={onLayout} onScroll={onScroll}>
    <Helmet>
        <meta charSet="utf-8" />
        <title>Sign Up - CoachSync</title>
    </Helmet>
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
      {showCongrats && (<View style={signUp.congratsContainer}>
        <View style={signUp.congratsHeader}></View>
        <View style={signUp.congratsBody}>
          <View style={signUp.congratsIcon}>
          <Icon name='people' size={60} type='ionicon' color={priceStyle}/>
          </View>
          <Text style={signUp.congratsTitle}>Congrats {firstName}!</Text>
          <Text style={signUp.congratsText}>You've subscribed to the <Text style={[signUp.congratsTextBold,{color:priceStyle}]}>{priceName}</Text>.{"\n"}A new coaching journey awaits!</Text>
          <Button
          title='Get Started'
          buttonStyle={signUp.congratsButton}
          containerStyle={signUp.congratsButtonContainer}
          onPress={dashboard}/>
        </View>
      </View>)}
      {showPaymentForm && (<View style={signUp.paymentFormContainer}>
        <TouchableOpacity style={signUp.backContainer} onPress={onBackPayment}>
          <Icon containerStyle={signUp.iconStyle} color={colors.mainTextColor} type='ionicon' name='arrow-back-circle-outline'/>
          <Text style={signUp.backText}>Go Back</Text>
        </TouchableOpacity>
        <View style={[signUp.paymentForm,pricingCardsStyle]}>
          <View style={[signUp.paymentInfo]}>
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
                selectedTextStyle={{backgroundColor:colorsLight.secondaryHighlight}}
                selectedButtonStyle={{backgroundColor:colorsLight.secondaryHighlight}}
                style={{margin:0,padding:0}}
              />
            </View>
            {cardError && (<View style={messageBox.errorBox}>
                <View style={messageBox.icon}><Icon name='close-circle-outline' size={30} type='ionicon' color={colorsLight.darkGray}/></View>
                <Text style={messageBox.text}>{cardError}</Text>
              </View>) || (<View></View>)}
            {paymentIndex == 0 && (<Elements stripe={stripePromise}>
              <SubscribeForm onFinished={handleFinish} planId={chosenPlan.Type} annual={annual} priceAmount={priceAmount} />
            </Elements>)}
          </View>
        </View>
      </View>)}
      {showPricingForm && (<View style={{flexShrink:1}}>
        <Text style={signUp.pricingTitle}>Welcome to CoachSync, {firstName}!</Text>
        <Text style={signUp.pricingIntro}>The next step is to choose the perfect package for you. You can also upgrade later.</Text>
        {false && (<Text style={signUp.timeLeft}>Time left on sale: {activeDiscountExpire && (<View style={signUp.countdown}><DateCountdown dateTo={activeDiscountExpire} mostSignificantFigure='day' locales={['y','m','d','h','m','s']} callback={()=>discount()} /></View>)}</Text>)}
        {coachCount > 10 && (<Text style={signUp.timeLeft}>Beta Sale lasts for first 50 sign ups! <Text style={signUp.countdown}>{50-coachCount} spaces left</Text></Text>)}
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
          title={plans[0].Title}
          price={<View>
            <Text style={{fontSize:45}}>${plans[0].BasePrice}/{priceUnit}</Text>
            {activeDiscountExpire && (<Text style={signUp.priceBottomText}>forever</Text>)}
          </View>}
          info={plans[0].InfoParsed}
          button={{ title: 'Select' }}
          containerStyle={signUp.pricingCardContainer}
          onButtonPress={() => onPriceSelect(0)}
        />
        <View>
          <Text style={signUp.pricingHighlight}>Most Popular:</Text>
          <PricingCard
            color={btnColors.success}
            title={<View>
              {activeDiscountExpire && (<View style={[signUp.previousPriceContainer,signUp.prevPriceHeight]}>
                <Text style={signUp.discountDesc}>{activeDiscountDesc}</Text>
                <View style={signUp.previousPriceInner}>
                  <Text style={signUp.previousPrice}>{plans[1].BasePrice*annual}</Text>
                  <Text style={signUp.previousPriceDiscount}>{activeDiscountPerc}% off</Text>
                </View>
              </View>)}
              <Text style={{fontSize:50}}>{plans[1].Title}</Text>
            </View>}
            price={<View>
              <Text style={{fontSize:45}}>${(plans[1].BasePrice*((100-activeDiscountPerc)/100.0)*annual).toFixed(2)}/{priceUnit}</Text>
              <Text style={signUp.priceBottomText}>{activeDiscountDurText}</Text>
            </View>}
            info={plans[1].InfoParsed}
            button={{ title: 'Select' }}
            containerStyle={signUp.pricingCardContainerMiddle}
            onButtonPress={() => onPriceSelect(1)}
          />
        </View>
        <PricingCard
          color={btnColors.danger}
          title={<View>
            {activeDiscountExpire && (<View style={[signUp.previousPriceContainer,signUp.prevPriceHeight]}>
              <Text style={signUp.discountDesc}>{activeDiscountDesc}</Text>
              <View style={signUp.previousPriceInner}>
                <Text style={signUp.previousPrice}>{plans[2].BasePrice*annual}</Text>
                <Text style={signUp.previousPriceDiscount}>{activeDiscountPerc}% off</Text>
              </View>
            </View>)}
            <Text>{plans[2].Title}</Text>
          </View>}
          price={<View>
            <Text style={{fontSize:45}}>${(plans[2].BasePrice*((100-activeDiscountPerc)/100.0)*annual).toFixed(2)}/{priceUnit}</Text>
            <Text style={signUp.priceBottomText}>{activeDiscountDurText}</Text>
          </View>}
          info={plans[2].InfoParsed}
          button={{ title: 'Select' }}
          containerStyle={signUp.pricingCardContainer}
          onButtonPress={() => onPriceSelect(2)}
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
