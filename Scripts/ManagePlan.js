/* eslint-disable react/prop-types */
/* eslint-disable react/display-name */
import React, { useEffect, useState, useContext } from 'react'
import { TouchableOpacity, ScrollView, Text, View, Linking, Image } from 'react-native'
import { signUpLight, messageBox, managePlanLight, colorsLight, innerDrawerLight, btnColors } from '../Scripts/Styles.js'
import { signUpDark, managePlanDark, colorsDark, innerDrawerDark } from '../Scripts/Styles.js'
import { useLinkTo } from '@react-navigation/native'
import LoadingScreen from '../Scripts/LoadingScreen.js'
import ActivityIndicatorView from '../Scripts/ActivityIndicatorView.js'
import { set, get, getTTL, ttl } from './Storage.js'
import { TextInput } from 'react-native-web'
import { Icon, Button, ButtonGroup, Chip } from 'react-native-elements'
import { refreshCoach, url, stripeKey, sqlToJsDate, parseSimpleDateText, getPlans, getActiveCoachDiscount, getUpcomingSwitchPeriodProration, getUpcomingChangePlanProration, switchSubscription, invoiceData, updatePaymentMethod } from './API.js'
import { confirmAlert } from 'react-confirm-alert' // Import
import 'react-confirm-alert/src/react-confirm-alert.css' // Import css
import AmEx from '../assets/cards/amex.png'
import Discover from '../assets/cards/discover.png'
import MasterCard from '../assets/cards/mastercard.png'
import Visa from '../assets/cards/visa.png'
import {
  CardElement,
  Elements,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import './DatePickerClients/DatePicker.css'

import userContext from './Context.js'

const SubscribeForm = ({memo, onFinished, planId, annual, priceAmount}) => {

  // Get the lookup key for the price from the previous page redirect.
  const linkTo = useLinkTo()
  const [name, setName] = useState('');
  const [messages, setMessages] = useState('');
  const [subscription, setSubscription] = useState({status:'inactive'});
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
      memo,
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

    if(subError) {
      // show error and collect new card details.
      setRefreshing(false)
      setMessage(subError.message);
      return;
    }

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
        setRefreshing(false)
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

const UpdatePaymentMethodForm = ({coach, styles, onClose, updatePaymentMethodVar}) => {
  const [paymentMethodName, setPaymentMethodName] = useState('')
  const [paymentMethodMessage, setPaymentMethodMessage] = useState('')

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

  const handlePaymentMethodSubmit = async () => {

    const cardElement = elements.getElement(CardElement);

    // Use card Element to tokenize payment details
    let { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: cardElement,
      billing_details: {
        name: paymentMethodName,
      }
    });

    if (error) {
      // show error and collect new card details.
      setPaymentMethodMessage(error.message);
      return;
    }

    // Submit payment method 
    const updated = await updatePaymentMethod(coach.Token, coach.Id, coach.StripeCustomerId, coach.StripeSubscriptionId, paymentMethod.id);
    if (updated) {
      console.log('Updated successfully!')
      onClose()
      updatePaymentMethodVar(paymentMethod)
    } else {
      setPaymentMethodMessage("There was an error updating your card, please try again later or reach out to Support if the problem persists.");
    }
  }

  return (<View style={styles.alertContainer}>
    <Text style={styles.alertTitle}>Enter New Card</Text>
    {paymentMethodMessage.length > 0 && (<View style={[messageBox.errorBox,{marginTop:10,marginLeft:10,marginRight:10}]}>
      <View style={messageBox.icon}><Icon name='close-circle-outline' size={30} type='ionicon' color={colorsLight.darkGray}/></View>
      <Text style={messageBox.text}>{paymentMethodMessage}</Text>
    </View>) || (<View></View>)}
    <TextInput
      style={styles.inputCardName}
      value={paymentMethodName}
      placeholder='Cardholder Name'
      placeholderTextColor='#aab7c4'
      keyboardType='default'
      onChangeText={(t) => { setPaymentMethodName(t) }}
    />
    <View style={styles.cardWrapper}>
      <CardElement options={cardInputStyle} />
    </View>
    <View style={styles.alertButtonRow}>
      <Button
        title='Cancel'
        buttonStyle={styles.alertCancel}
        containerStyle={styles.alertCancelContainer}
        titleStyle={{color:'#fff'}}
        onPress={() => {
          onClose()
        }}
      />
      <Button
        title={'Save Card Info'}
        buttonStyle={styles.alertConfirm}
        containerStyle={styles.alertConfirmContainer}
        titleStyle={{color:'#fff'}}
        onPress={async () => {
          handlePaymentMethodSubmit()
        }}
      />
    </View>
  </View>)
}

export default function ManagePlan() {

  const stripePromise = loadStripe(stripeKey)
  const linkTo = useLinkTo()
  const user = useContext(userContext)

  const [refreshing, setRefreshing] = useState(true)
  const [styles, setStyles] = useState(managePlanLight)
  const [signUp, setSignUp] = useState(signUpLight)
  const [colors, setColors] = useState(colorsLight)

  // Main stage controls.
  const [showActivityIndicator, setActivityIndicator] = useState(true)
  const [showBar, setBar] = useState(false)
  const [showMain, setMain] = useState(false)
  const [showPlans, setShowPlans] = useState(false)
  const [showPayments, setShowPayments] = useState(false)
  const [paymentsNav, setPaymentsNav] = useState(true)
  const [firstPaymentsNav, setFirstPaymentsNav] = useState(true)
  const [showPlansAsFree, setShowPlansAsFree] = useState(false)
  const [showSubscribeForm, setShowSubscribeForm] = useState(false)

  // Main variables.
  const [coach, setCoach] = useState(user)
  const [planTitle, setPlanTitle] = useState('')
  const [planTitleStyle, setPlanTitleStyle] = useState({})
  const [billingText, setBillingText] = useState('monthly billing')
  const [plans, setPlans] = useState([])
  const [activePlan, setActivePlan] = useState({})
  const [curAnnual, setCurAnnual] = useState(1)
  const [cardError, setMessage] = useState(false)

  // Plans variables.
  const [planType, setPlanType] = useState(0)
  const [planAnnual, setPlanAnnual] = useState(1)
  const [priceMemo, setPriceMemo] = useState('')
  const [priceName, setPriceName] = useState('')
  const [priceBase, setPriceBase] = useState(0)
  const [priceAmount, setPriceAmount] = useState(0)
  const [planPeriodIndex, setPlanPeriodIndex] = useState(0)
  const [activeDiscount, setActiveDiscount] = useState({})
  const [plansButtonIndicators, setPlansButtonIndicators] = useState([false, false, false])

  // Payments variables.
  const [nextInvoice, setNextInvoice] = useState({})
  const [pastInvoices, setPastInvoices] = useState({})
  const [paymentMethod, setPaymentMethod] = useState({})
  const [paymentMethodImage, setPaymentMethodImage] = useState(null)
  const [nextInvoiceFinal, setNextInvoiceFinal] = useState(0)
  const [nextInvoiceFinalText, setNextInvoiceFinalText] = useState('Credit to Account')
  const [nextInvoiceFinalColoring, setNextInvoiceFinalColoring] = useState({color:btnColors.success})

  // Main functions.
  const refreshPlans = async (t, a, plan, d) => {
    var refresh = JSON.parse(JSON.stringify(await getPlans(t)))
    if (refresh != false) {
      if (a != 0) {
        // If discount exists, apply it to the base price.
        var discount = await getActiveCoachDiscount(t, a)
        setActiveDiscount(discount)
        for (var i = 0; i < refresh.length; i++) {
          refresh[i].OldPrice = refresh[i].BasePrice
          refresh[i].BasePrice = (refresh[i].BasePrice*(1-(discount.Percent/100))).toFixed(2)
        }
      }
      console.log('plans:',refresh)
      setPlans(refresh)
      setActivePlan(refresh[plan])
    }
  }

  useEffect(() => {
    console.log('Welcome to manage plan.')
    if (coach != null) {
      refreshPlans(coach.Token, coach.ActiveDiscountId, coach.Plan, coach.PaymentPeriod)
      setCoach(coach)
      setCurAnnual(coach.PaymentPeriod)
      setPlanAnnual(coach.PaymentPeriod)
      if (coach.PaymentPeriod == 12) {
        setPlanPeriodIndex(1)
        setBillingText('annual billing')
      }
      if (coach.Plan == 2) {
        setPlanTitle('Professional')
        setPlanTitleStyle({backgroundColor:btnColors.danger})
      } else if (coach.Plan == 1) {
        setPlanTitle('Standard')
        setPlanTitleStyle({backgroundColor:btnColors.success})
      } else {
        setPlanTitle('Free')
        setPlanTitleStyle({backgroundColor:btnColors.primary})
      }
      setActivityIndicator(false)

      if (coach.Plan == 0 ) {
        if (coach.StripeSubscriptionId == 0) {
          setShowPlansAsFree(true)
        } else {
          setBar(true)
          navToPayments()
        }
      } else {
        setBar(true)
        navToPayments()
      }
    } else {
      linkTo('/welcome')
    }
  }, [])

  // Navigation functions.
  const navToMain = () => {
    setPaymentsNav(true)
    setShowPlans(false)
    setShowPayments(false)
    setMain(true)
  }

  const navToPlans = () => {
    setPaymentsNav(true)
    setMain(false)
    setShowPayments(false)
    setShowPlans(true)
  }

  const navToPayments = () => {
    setMain(false)
    setPaymentsNav(false)
    if (firstPaymentsNav) {
      setFirstPaymentsNav(false)

      // Get data for this area.
      getInvoiceData(coach.Id, coach.Token, coach.StripeCustomerId, coach.StripeSubscriptionId)

    } else {
      setShowPlans(false)
      setShowPayments(true)
    }
    
  }

  // Manage payments functions.
  const getInvoiceData = async (id, token, cus, sub) => {
    setShowPlans(false)
    setActivityIndicator(true)

    var invoices = await invoiceData(id, token, cus, sub)
    console.log('invoices:',invoices)
    setNextInvoice(invoices[0])
    // Calculate nextInvoiceFinal, nextInvoiceFinalText
    var final = 0
    for (var i = 0; i < invoices[0].lines.data.length; i++) {
      final += invoices[0].lines.data[i].amount
    }

    if (final > 0) {
      setNextInvoiceFinalText('Due')
      setNextInvoiceFinalColoring({color:btnColors.success})
    }

    final = Math.abs(final/100).toFixed(2)
    setNextInvoiceFinal(final)

    setPastInvoices(invoices[1])
    setPaymentMethod(invoices[2])
    var brand = invoices[2].card.brand
    if (brand == 'visa') {
      setPaymentMethodImage(Visa)
    } else if (brand == 'mastercard') {
      setPaymentMethodImage(MasterCard)
    } else if (brand == 'discover') {
      setPaymentMethodImage(Discover)
    } else if (brand == 'amex') {
      setPaymentMethodImage(AmEx)
    }
    setActivityIndicator(false)
    setShowPayments(true)
  }

  const updatePaymentMethodVar = (pm) => {
    console.log('updating state with:',pm)
    setPaymentMethod(pm)
    var brand = pm.card.brand
    if (brand == 'visa') {
      setPaymentMethodImage(Visa)
    } else if (brand == 'mastercard') {
      setPaymentMethodImage(MasterCard)
    } else if (brand == 'discover') {
      setPaymentMethodImage(Discover)
    } else if (brand == 'amex') {
      setPaymentMethodImage(AmEx)
    }
  }

  const updatePaymentMethod = () => {
    //
    confirmAlert({
      customUI: ({ onClose }) => {
        return (<Elements stripe={stripePromise}>
          <UpdatePaymentMethodForm coach={coach} styles={styles} onClose={onClose} updatePaymentMethodVar={updatePaymentMethodVar} />
        </Elements>)
      },
      closeOnEscape: true,
      closeOnClickOutside: true
    })
  }
  
  // General plan functions.
  const selectPlanPeriod = (i) => {
    if (i == 0) {
      setPlanAnnual(1)
      setPlanPeriodIndex(0)
    } else {
      setPlanAnnual(12)
      setPlanPeriodIndex(1)
    }
  }

  // Upgrade plan functions.
  const upgradeToPlan = async (plan) => {

    var indicators = JSON.parse(JSON.stringify(plansButtonIndicators))
    indicators[plan] = true
    setPlansButtonIndicators(indicators)

    var p = JSON.parse(JSON.stringify(plans[plan]))

    var oldPlan = activePlan.Title
    var newPlan = "Professional"

    if (plan == 1) {
      newPlan = "Standard"
    }

    var targetPeriod = 1
    var periodText = "Monthly"
    if (planPeriodIndex == 1) {
      targetPeriod = 12
      periodText = "Yearly"
    }

    const proration = await getUpcomingChangePlanProration(coach.Id, coach.Token, plan, targetPeriod, coach.StripeSubscriptionId, coach.StripeCustomerId)

    var invoice = proration[1]

    var final = 0;

    // Calculate final.
    for (var i = 0; i < invoice.lines.data.slice(0).reverse().length; i++) {
      var cur = invoice.lines.data[i]
      if (cur.proration || plan == 1 || targetPeriod != coach.PaymentPeriod) {
        final += cur.amount
      }
    }

    final += invoice.starting_balance

    var finalPayText = ""
    var finalText = "Credit to Account"
    var finalColoring = {color:btnColors.success}

    if (final > 0) {
      finalPayText = "Pay & "
      finalText = "Due"
      finalColoring = {color:btnColors.danger}
    }
    final = Math.abs(final/100).toFixed(2)

    confirmAlert({
      customUI: ({ onClose }) => {
        return (<View style={styles.alertContainer}>
          <Text style={styles.alertTitle}>Upgrade to {p.Title} {periodText}?</Text>
          {invoice.lines.data.slice(0).reverse().map((line, index) => {
            var coloring = {}
            var negSign = ""
            if (line.amount < 0) {
              coloring = {color:btnColors.success}
              negSign = "-"
            }
            var amt = Math.abs(line.amount)
            if (line.proration || plan == 1 || targetPeriod != coach.PaymentPeriod) {
              return (<View key={line.id} style={styles.amountLineContainer}>
                <Text style={styles.amountLine}>{line.description}</Text>
                <Text style={[styles.amountLine,coloring]}>{negSign + "$" + (amt/100).toFixed(2)}</Text>
             </View>)
            } else {
              return (<View key={line.id}>
             </View>)
            }
          })}
          {invoice.starting_balance != 0 && (<View style={styles.amountLineContainer}>
            <Text style={styles.amountLine}>Existing credit balance</Text>
            <Text style={[styles.amountLine,{color:btnColors.success}]}>{"-$" + Math.abs(invoice.starting_balance/100).toFixed(2)}</Text>
          </View>)}
          <View style={styles.amountLineFinalContainer}>
            <Text style={styles.amountLine}>Total {finalText}:</Text>
            <Text style={[styles.amountLineBold,finalColoring]}>${final}</Text>
          </View>
          {finalText == "Credit to Account" && (<View style={styles.alertHelpRow}>
            <Icon
              name='help-circle-outline'
              type='ionicon'
              size={25}
              color={colors.mainTextColor}
              style={{}}
              onPress={() => window.open('https://wiki.coachsync.me/en/account/credits', '_blank')}
            />
          </View>)}
          <View style={styles.alertButtonRow}>
            <Button
              title='Cancel'
              buttonStyle={styles.alertCancel}
              containerStyle={styles.alertCancelContainer}
              titleStyle={{color:'#fff'}}
              onPress={() => {
                var indicators = JSON.parse(JSON.stringify(plansButtonIndicators))
                indicators[plan] = false
                setPlansButtonIndicators(indicators)
                onClose()
              }}
            />
            <Button
              title={finalPayText + 'Upgrade to ' + newPlan + ' Plan'}
              buttonStyle={styles.alertConfirm}
              containerStyle={styles.alertConfirmContainer}
              titleStyle={{color:'#fff'}}
              onPress={async () => {
                // Update subscription
                var updated = await switchSubscription(coach.Token, coach.Id, plan, targetPeriod, coach.StripeSubscriptionId)
                // Update user.
                var c = JSON.parse(JSON.stringify(coach))
                c.Plan = updated.Plan
                c.PlanExpire = updated.PlanExpire
                c.PaymentPeriod = targetPeriod
                setCoach(c)
                set('Coach',c,ttl)
                var indicators = JSON.parse(JSON.stringify(plansButtonIndicators))
                indicators[plan] = false
                setPlansButtonIndicators(indicators)
                onClose()
                location.reload()
              }}
            />
          </View>
        </View>)
      },
      closeOnEscape: false,
      closeOnClickOutside: false
    })

  }

  const downgradeToPlan = async (plan) => {

    var indicators = JSON.parse(JSON.stringify(plansButtonIndicators))
    indicators[plan] = true
    setPlansButtonIndicators(indicators)

    var p = JSON.parse(JSON.stringify(plans[plan]))

    var oldPlan = activePlan.Title
    var newPlan = "Standard"

    if (plan == 0) {
      newPlan = "Free"
    } else if (plan == 1) {

    }

    var targetPeriod = 1
    var periodText = "Monthly"
    if (planPeriodIndex == 1) {
      targetPeriod = 12
      periodText = "Yearly"
    }

    const proration = await getUpcomingChangePlanProration(coach.Id, coach.Token, plan, targetPeriod, coach.StripeSubscriptionId, coach.StripeCustomerId)

    var invoice = proration[1]
    console.log(proration)
    var final = 0;

    // Calculate final.
    for (var i = 0; i < invoice.lines.data.slice(0).reverse().length; i++) {
      var cur = invoice.lines.data[i]
      if (cur.proration || plan == 1) {
        final += cur.amount
      }
    }

    final += invoice.starting_balance

    var finalPayText = ""
    var finalText = "Credit to Account"
    var finalColoring = {color:btnColors.success}
    if (final > 0) {
      finalPayText = "Pay & "
      finalText = "Due"
      finalColoring = {color:btnColors.danger}
    }
    final = Math.abs(final/100).toFixed(2)

    confirmAlert({
      customUI: ({ onClose }) => {
        return (<View style={styles.alertContainer}>
          <Text style={styles.alertTitle}>Downgrade to {p.Title} {periodText}?</Text>
          {invoice.lines.data.slice(0).reverse().map((line, index) => {
            var coloring = {}
            var negSign = ""
            if (line.amount < 0) {
              coloring = {color:btnColors.success}
              negSign = "-"
            }
            var amt = Math.abs(line.amount)
            if (line.proration || plan == 1) {
              return (<View key={line.id} style={styles.amountLineContainer}>
                <Text style={styles.amountLine}>{line.description}</Text>
                <Text style={[styles.amountLine,coloring]}>{negSign + "$" + (amt/100).toFixed(2)}</Text>
             </View>)
            } else {
              return (<View key={line.id}>
             </View>)
            }
          })}
          {invoice.starting_balance != 0 && (<View style={styles.amountLineContainer}>
            <Text style={styles.amountLine}>Existing credit balance</Text>
            <Text style={[styles.amountLine,{color:btnColors.success}]}>{"-$" + Math.abs(invoice.starting_balance/100).toFixed(2)}</Text>
          </View>)}
          <View style={styles.amountLineFinalContainer}>
            <Text style={styles.amountLine}>Total {finalText}:</Text>
            <Text style={[styles.amountLineBold,finalColoring]}>${final}</Text>
          </View>
          {finalText == "Credit to Account" && (<View style={styles.alertHelpRow}>
            <Icon
              name='help-circle-outline'
              type='ionicon'
              size={25}
              color={colors.mainTextColor}
              style={{}}
              onPress={() => window.open('https://wiki.coachsync.me/en/account/credits', '_blank')}
            />
          </View>)}
          <View style={styles.alertButtonRow}>
            <Button
              title='Cancel'
              buttonStyle={styles.alertCancel}
              containerStyle={styles.alertCancelContainer}
              titleStyle={{color:'#fff'}}
              onPress={() => {
                var indicators = JSON.parse(JSON.stringify(plansButtonIndicators))
                indicators[plan] = false
                setPlansButtonIndicators(indicators)
                onClose()
              }}
            />
            <Button
              title={finalPayText + 'Downgrade to ' + newPlan + ' Plan'}
              buttonStyle={styles.alertConfirm}
              containerStyle={styles.alertConfirmContainer}
              titleStyle={{color:'#fff'}}
              onPress={async () => {
                // Update subscription
                var updated = await switchSubscription(coach.Token, coach.Id, plan, targetPeriod, coach.StripeSubscriptionId)
                // Update user.
                var c = JSON.parse(JSON.stringify(coach))
                c.Plan = updated.Plan
                c.PlanExpire = updated.PlanExpire
                c.PaymentPeriod = targetPeriod
                setCoach(c)
                set('Coach',c,ttl)
                var indicators = JSON.parse(JSON.stringify(plansButtonIndicators))
                indicators[plan] = false
                setPlansButtonIndicators(indicators)
                onClose()
                location.reload()
              }}
            />
          </View>
        </View>)
      },
      closeOnEscape: false,
      closeOnClickOutside: false
    })
    
  }

  const switchPayPeriod = async (plan) => {

    var indicators = JSON.parse(JSON.stringify(plansButtonIndicators))
    indicators[coach.Plan] = true
    setPlansButtonIndicators(indicators)
    
    var periodText = "monthly"
    var periodTextCapitalized = "Monthly"
    var periodText2 = "Yearly"

    var targetPeriod = 1
    if (coach.PaymentPeriod == 1) {
      targetPeriod = 12
      periodText = "yearly"
      periodTextCapitalized = "Yearly"
      periodText2 = "Monthly"
    }

    const proration = await getUpcomingChangePlanProration(coach.Id, coach.Token, coach.Plan, targetPeriod, coach.StripeSubscriptionId, coach.StripeCustomerId)

    var invoice = proration[1]

    var final = 0;

    // Calculate final.
    for (var i = 0; i < invoice.lines.data.slice(0).reverse().length; i++) {
      var cur = invoice.lines.data[i]
      if (cur.proration || plan == 1) {
        final += cur.amount
      }
    }

    final += invoice.starting_balance
    
    var finalText = "Credit to Account"
    var finalPayText = ""
    var finalColoring = {color:btnColors.success}
    if (final > 0) {
      finalText = "Due"
      finalPayText = "Pay & "
      finalColoring = {color:btnColors.danger}
    }
    final = Math.abs(final/100).toFixed(2)

    confirmAlert({
      customUI: ({ onClose }) => {
        return (<View style={styles.alertContainer}>
          <Text style={styles.alertTitle}>Switch to {periodTextCapitalized} Plan?</Text>
          {invoice.lines.data.slice(0).reverse().map((line, index) => {
            var coloring = {}
            var negSign = ""
            if (line.amount < 0) {
              coloring = {color:btnColors.success}
              negSign = "-"
            }
            var amt = Math.abs(line.amount)
            if (line.proration || plan == 1) {
              return (<View key={line.id} style={styles.amountLineContainer}>
                <Text style={styles.amountLine}>{line.description}</Text>
                <Text style={[styles.amountLine,coloring]}>{negSign + "$" + (amt/100).toFixed(2)}</Text>
             </View>)
            } else {
              return (<View key={line.id}>
             </View>)
            }
          })}
          {invoice.starting_balance != 0 && (<View style={styles.amountLineContainer}>
            <Text style={styles.amountLine}>Existing credit balance</Text>
            <Text style={[styles.amountLine,{color:btnColors.success}]}>{"-$" + Math.abs(invoice.starting_balance/100).toFixed(2)}</Text>
          </View>)}
          <View style={styles.amountLineFinalContainer}>
            <Text style={styles.amountLine}>Total {finalText}:</Text>
            <Text style={[styles.amountLineBold,finalColoring]}>${final}</Text>
          </View>
          {finalText == "Credit to Account" && (<View style={styles.alertHelpRow}>
            <Icon
              name='help-circle-outline'
              type='ionicon'
              size={25}
              color={colors.mainTextColor}
              style={{}}
              onPress={() => window.open('https://wiki.coachsync.me/en/account/credits', '_blank')}
            />
          </View>)}
          <View style={styles.alertButtonRow}>
            <Button
              title='Cancel'
              buttonStyle={styles.alertCancel}
              containerStyle={styles.alertCancelContainer}
              titleStyle={{color:'#fff'}}
              onPress={() => {
                var indicators = JSON.parse(JSON.stringify(plansButtonIndicators))
                indicators[coach.Plan] = false
                setPlansButtonIndicators(indicators)
                onClose()
              }}
            />
            <Button
              title={finalPayText + 'Switch to ' + periodTextCapitalized + ' Plan'}
              buttonStyle={styles.alertConfirm}
              containerStyle={styles.alertConfirmContainer}
              titleStyle={{color:'#fff'}}
              onPress={async () => {
                // Update subscription
                var updated = await switchSubscription(coach.Token, coach.Id, coach.Plan, targetPeriod, coach.StripeSubscriptionId)
                // Update user.
                var c = JSON.parse(JSON.stringify(coach))
                c.Plan = updated.Plan
                c.PlanExpire = updated.PlanExpire
                c.PaymentPeriod = targetPeriod
                setCoach(c)
                set('Coach',c,ttl)
                var indicators = JSON.parse(JSON.stringify(plansButtonIndicators))
                indicators[coach.Plan] = false
                setPlansButtonIndicators(indicators)
                onClose()
                location.reload()
              }}
            />
          </View>
        </View>)
      },
      closeOnEscape: false,
      closeOnClickOutside: false
    })
  }

  // As free functions. 
  const onBackPayment = () => {
    setShowSubscribeForm(false)
    setActivityIndicator(true)
    setTimeout(() => {
      setActivityIndicator(false)
      setShowPlansAsFree(true)
    }, 500)
  }

  const upgradeToPlanAsFree = (type) => {
    setPlanType(type)
    var activeDiscountPerc = 0
    if (activeDiscount.Percent != undefined) {
      activeDiscountPerc = activeDiscount.Percent
    }
    var name, amount, priceBase, style
    if (type == 1) {
      name = 'Standard Plan'
      amount = plans[1].BasePrice*planAnnual
      priceBase = plans[1].OldPrice*planAnnual
      style = btnColors.success
    } else if (type == 2) {
      name = 'Professional Plan'
      amount = plans[2].BasePrice*planAnnual
      priceBase = plans[2].OldPrice*planAnnual
      style = btnColors.danger
    }
    var dateType = (planPeriodIndex == 0) ? 'Monthly' : 'Annual'
    var memo = dateType + ' Subscription'
    setPriceMemo(memo)
    setPriceName(name)
    setPriceAmount(amount)
    setPriceBase(priceBase)
    setShowPlansAsFree(false)
    setActivityIndicator(true)
    setTimeout(() => {
      setActivityIndicator(false)
      setShowSubscribeForm(true)
    }, 500)
  }

  const handleFinish = async () => {
    var updated = await refreshCoach(coach.Id, coach.Token);
    set('Coach',updated,ttl)
    window.location.reload()
  }

  return (<ScrollView contentContainerStyle={styles.scrollView}>
    <View style={styles.container}>
      <View style={styles.main}>
        <View style={styles.body}>

          {showBar && (<>
            <View style={[styles.bodyContainer,{flexDirection:'row'}]}>
              {(showPayments || paymentsNav == false) && (<Text style={styles.barSelected}>Payments</Text>)
                        || (<Text onPress={navToPayments} style={styles.barUnselected}>Payments</Text>)}
              {showActivityIndicator == false && (<>
                {showPlans && (<Text style={styles.barSelected}>Plans</Text>)
                        || (<Text onPress={navToPlans} style={styles.barUnselected}>Plans</Text>)}
              </>)}
            </View>
          </>)}

          {showActivityIndicator && (<ActivityIndicatorView />)}

          {showMain && (<>
            <View style={{flexDirection:'row'}}>
              <View style={[styles.bodyContainer,{flex:3,flexDirection:'column',justifyContent:'space-between'}]}>
                <View style={{flexDirection:'row',justifyContent:'space-between'}}>
                  <Text style={styles.bodySubtitle}><Text style={[{paddingLeft:8,paddingRight:8,paddingTop:5,paddingBottom:5,color:'#fff',borderRadius:10},planTitleStyle]}>{planTitle}</Text> Plan</Text>
                  <View style={{flexDirection:'row'}}>
                    <Text style={styles.planCurrency}>$</Text>
                    <Text style={styles.planAmount}>{(coach.PaymentPeriod*activePlan.BasePrice).toFixed(2)}</Text>
                    <Text style={styles.planDuration}>{(coach.PaymentPeriod == 1) ? '/month' : '/year'}</Text>
                  </View>
                </View>
                <View style={{flexDirection:'row',justifyContent:'flex-end'}}>
                  <Button
                    title='Manage Plan'
                    buttonStyle={styles.upgradePlanButton}
                    containerStyle={styles.upgradePlanButtonContainer}
                    titleStyle={{color:'#fff'}}
                    onPress={navToPlans}
                    icon={
                      <Icon
                        name='arrow-forward-circle-outline'
                        type='ionicon'
                        size={20}
                        color={'#fff'}
                        style={{marginLeft:5}}
                      />
                    }
                    iconRight
                  />
                </View>
              </View>
              <View style={[styles.bodyContainer,{flex:2,marginLeft:20}]}>
                <Text style={styles.inputHeader}>Next payment</Text>
                <Text style={[styles.bodySubtitle,{marginLeft:5}]}>on {parseSimpleDateText(sqlToJsDate(coach.PlanExpire))}</Text>
                <Button
                  title='Manage Payments'
                  buttonStyle={styles.managePaymentsButton}
                  containerStyle={styles.managePaymentsButtonContainer}
                  titleStyle={{color:btnColors.primary}}
                  onPress={navToPayments}
                />
              </View>
            </View>
          </>)}

          {showPlans && (<>
            <View style={styles.bodyContainer}>
              <View style={{alignItems:'center'}}>
                <ButtonGroup
                  onPress={selectPlanPeriod}
                  buttons={['Monthly Plans','Annual Plans']}
                  selectedIndex={planPeriodIndex}
                  containerStyle={{width:400,height:40,marginBottom:20}}
                />
              </View>
              <View style={{flexDirection:'row',marginTop:20}}>
                {plans.map((plan, index) => {

                  var planTitleColor = {color:btnColors.primary}

                  if (plan.Type == 1) {
                    planTitleColor = {color:btnColors.success}
                  } else if (plan.Type == 2) {
                    planTitleColor = {color:btnColors.danger}
                  }

                  var info = plan.Info.split(',')

                  var currentPlan = (plan.Type == coach.Plan)

                  var periodText = ' /month'
                  var periodNum = 1
                  if (planPeriodIndex == 1) {
                    periodText = ' /year'
                    periodNum = 12
                  }

                  var isDiscounted = false
                  var activeDiscountPrice = 0

                  if (activeDiscount.Percent != undefined) {
                    isDiscounted = true
                    activeDiscountPrice = (parseFloat(plan.BasePrice)*(100/(100-activeDiscount.Percent))*planAnnual).toFixed(2)
                  }

                  return (<View key={index} style={{flex:1,marginBottom:20}}>
                    <Text style={[styles.planTitle]}><Text style={planTitleColor}>{plan.Title}</Text> Plan</Text>
                    <View>
                      <View>
                        {info.map((infoItem, infoIndex) => {
                          return (<Text key={infoIndex + '_'} style={styles.planDesc}>
                            - {infoItem}
                          </Text>)
                        })}
                      </View>
                      <View style={{flexDirection:'column',marginTop:10,alignItems:'center',justifyContent:'center'}}>
                        {isDiscounted && (<View>
                          <Text style={styles.originalPrice}>${activeDiscountPrice}</Text>
                          <Text style={styles.discountTitle}>{activeDiscount.Description}:</Text>
                        </View>)}
                        <Text style={styles.planTitleAmount}>
                          ${(parseFloat(plan.BasePrice)*planAnnual).toFixed(2) + periodText}
                        </Text>
                      </View>
                      <View style={{flexDirection:'column',marginTop:10,alignItems:'center',justifyContent:'center'}}>
                        {plansButtonIndicators[index] == false && currentPlan && coach.PaymentPeriod == periodNum && (<>
                          <Text style={styles.planCurrent}>Current Plan</Text>
                        </>)}
                        {plansButtonIndicators[index] == false && currentPlan && coach.PaymentPeriod != periodNum && (<>
                          <Button
                            title='Switch Pay Period'
                            buttonStyle={styles.upgradeToPlanButton}
                            containerStyle={styles.upgradeToPlanButtonContainer}
                            titleStyle={{color:'#fff'}}
                            onPress={() => switchPayPeriod(plan.Type)}
                            disabled={plansButtonIndicators[index]}
                          />
                        </>)}
                        {plansButtonIndicators[index] == false && currentPlan == false && coach.Plan < plan.Type && (<>
                          <Button
                            title='Upgrade'
                            buttonStyle={styles.upgradeToPlanButton}
                            containerStyle={styles.upgradeToPlanButtonContainer}
                            titleStyle={{color:'#fff'}}
                            onPress={() => upgradeToPlan(plan.Type)}
                            disabled={plansButtonIndicators[index]}
                          />
                        </>)}
                        {plansButtonIndicators[index] == false && coach.Plan > plan.Type && (<>
                          <Button
                            title='Downgrade'
                            buttonStyle={styles.downgradeToPlanButton}
                            containerStyle={styles.downgradeToPlanButtonContainer}
                            titleStyle={{color:'#fff'}}
                            onPress={() => downgradeToPlan(plan.Type)}
                            disabled={plansButtonIndicators[index]}
                          />
                        </>)}
                        {plansButtonIndicators[index] && (<View style={{}}>
                          <ActivityIndicatorView />
                        </View>)}
                      </View>
                    </View>
                  </View>)

                })}
              </View>
            </View>
          </>)}

          {showPayments && (<>
            <View style={[styles.bodyContainer,{flexDirection:'row'}]}>
              <View style={styles.paymentsNextInvoice}>
                <View style={styles.paymentsNextInvoiceTop}>
                  <View style={{flex:1}}>
                    <Text style={[styles.bodySubtitle,{borderBottomWidth:1,borderBottomColor:colors.headerBorder,marginBottom:10}]}>Plan Details</Text>
                    <Text style={styles.bodyDesc}>
                    You are subscribed to the <Text style={{fontFamily:'PoppinsSemiBold'}}>{planTitle} Plan</Text> with <Text style={{fontFamily:'PoppinsSemiBold'}}>{billingText}</Text>.
                    </Text>
                  </View>
                  <View style={{width:20}}></View>
                  <Button
                      title='Manage Plan'
                      buttonStyle={styles.upgradePlanButton}
                      containerStyle={[styles.upgradePlanButtonContainer,{width:'20%'}]}
                      titleStyle={{color:'#fff'}}
                      onPress={navToPlans}
                      icon={
                        <Icon
                          name='arrow-forward-circle-outline'
                          type='ionicon'
                          size={20}
                          color={'#fff'}
                          style={{marginLeft:5}}
                        />
                      }
                      iconRight
                    />
                </View>
                <View style={styles.paymentsNextInvoiceDetails}>
                  {nextInvoice.lines.data.map((line, index) => {
                    var coloring = {}
                    var negSign = ""
                    if (line.amount < 0) {
                      coloring = {color:btnColors.success}
                      negSign = "-"
                    }
                    var amt = Math.abs(line.amount)
                    return (<View key={line.id} style={[styles.amountLineContainer,{padding:10}]}>
                        <Text style={styles.amountLine}>{line.description}</Text>
                        <Text style={[styles.amountLine,coloring]}>{negSign + "$" + (amt/100).toFixed(2)}</Text>
                    </View>)
                  })}
                  {nextInvoice.starting_balance < -1 && (<View style={[styles.amountLineContainer,{padding:10}]}>
                    <Text style={styles.amountLine}>Existing credit balance</Text>
                    <Text style={[styles.amountLine,{color:btnColors.success}]}>{"-$" + Math.abs(nextInvoice.starting_balance/100).toFixed(2)}</Text>
                  </View>)}
                  <View style={styles.paymentsNextInvoiceFinal}>
                    <View style={styles.paymentsNextInvoiceAmount}>
                      <Text style={styles.paymentsNextInvoiceAmountDueDateTitle}>Total</Text>
                      <Text style={styles.paymentsNextInvoiceDueDate}>Billed automatically {parseSimpleDateText(sqlToJsDate(coach.PlanExpire))}</Text>
                   </View>
                   <View style={styles.paymentsNextInvoiceAmountRow}>
                    <Text style={[styles.paymentsNextInvoiceCurrency]}>$</Text>
                    <Text style={[styles.paymentsNextInvoiceAmountNum]}>{nextInvoiceFinal}</Text>
                   </View>
                  </View>
                  {nextInvoiceFinalText == "Credit to Account" && (<View style={styles.alertHelpRow}>
                    <Icon
                      name='help-circle-outline'
                      type='ionicon'
                      size={25}
                      color={colors.mainTextColor}
                      style={{}}
                      onPress={() => window.open('https://wiki.coachsync.me/en/account/credits', '_blank')}
                    />
                  </View>)}
                </View>
              </View>
              <View style={styles.paymentsMethod}>
                <Text style={[styles.bodySubtitle,{borderBottomWidth:1,borderBottomColor:colors.headerBorder}]}>Payment Method</Text>
                <View style={[styles.cardRow,{marginBottom:10,marginTop:10}]}>
                  <Text style={styles.cardName}>{paymentMethod.billing_details.name}</Text>
                </View>
                <View style={styles.cardNumbers}>
                  <Text style={styles.cardNumberGroup}>xxxx</Text>
                  <Text style={styles.cardNumberGroup}>xxxx</Text>
                  <Text style={styles.cardNumberGroup}>xxxx</Text>
                  <Text style={styles.cardNumberGroup}>{paymentMethod.card.last4}</Text>
                </View>
                <View style={styles.cardRow}>
                  <Text style={styles.cardExpTitle}>Good Thru</Text>
                  <Text style={styles.cardExp}>{paymentMethod.card.exp_month}/{paymentMethod.card.exp_year}</Text>
                  <Image source={paymentMethodImage} style={{height:60,width:60}} />
                </View>
                <Button 
                  title="Update Card"
                  type="outline"
                  onPress={updatePaymentMethod}
                  buttonStyle={{borderRadius:10}}
                />
              </View>
            </View>
            <View style={styles.bodyContainer}>
              <View style={styles.invoicesHeader}>
                <Text style={[styles.bodySubtitle]}>All Invoices</Text>
                <Icon
                  name='help-circle-outline'
                  type='ionicon'
                  size={25}
                  color={colors.mainTextColor}
                  style={{}}
                  onPress={() => window.open('https://wiki.coachsync.me/en/account/invoices', '_blank')}
                />
              </View>
              <View style={styles.paymentsControls}>
                <TouchableOpacity style={styles.paymentControlsTouchAmount}>
                  <Text style={[styles.paymentsControlsText,{paddingRight:0,textAlign:'right'}]}>Amount</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.paymentControlsTouchAmountStatus}>
                  <Text style={styles.paymentsControlsText}></Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.paymentControlsNumber}>
                  <Text style={[styles.paymentsControlsText,{paddingRight:0}]}>Invoice Number</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.paymentControlsTouchDescription}>
                  <Text style={styles.paymentsControlsText}>Description</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.paymentControlsTouchDate}>
                  <Text style={styles.paymentsControlsText}>Created</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.paymentControlsTouchView}>
                  <Text style={[styles.paymentsControlsText,{textAlign:'right'}]}>View Invoice</Text>
                </TouchableOpacity>
                
              </View>
              <View style={styles.paymentsPreviousInvoices}>
                {pastInvoices.data.map((line, index) => {
                  // Amount/total, Chip/status, Invoice Number/number, Due/period_end, Created/created, View/hosted_invoice_url
                  return (<View key={line.id} style={styles.paymentRow}>
                      <View style={[styles.paymentRowTouchAmount]}>
                        <Text style={[styles.paymentRowText,{paddingRight:0,textAlign:'right',fontFamily:'PoppinsSemiBold'}]}>
                          {line.amount_due > 0 && '$' + Math.abs(line.amount_due/100).toFixed(2) ||
                          '($' + Math.abs(line.total/100).toFixed(2)+ ')'}
                        </Text>
                      </View>
                      <View style={styles.paymentRowTouchAmountStatus}>
                        {line.status == 'uncollectible' && (<><Chip
                          title='Late'
                          type='outline'
                          icon={{
                            name:'checkmark-outline',
                            type:'ionicon',
                            size:16,
                            color:'#fff'
                          }}
                          disabledStyle={{backgroundColor:btnColors.caution,borderColor:btnColors.caution,color:btnColors.caution,margin:5,paddingLeft:3,paddingTop:3,paddingBottom:3,paddingRight:8}}
                          disabledTitleStyle={{color:'#fff'}}
                          disabled={true}
                        /></>) ||
                          (<>{line.status == 'paid' && (<>
                            <Chip
                              title='Paid'
                              type='outline'
                              icon={{
                                name:'checkmark-outline',
                                type:'ionicon',
                                size:16,
                                color:'#fff'
                              }}
                              disabledStyle={{backgroundColor:btnColors.success,borderColor:btnColors.success,color:btnColors.success,margin:5,paddingLeft:3,paddingTop:3,paddingBottom:3,paddingRight:8}}
                              disabledTitleStyle={{color:'#fff'}}
                              disabled={true}
                            />
                          </>) || (<>
                            {line.status == 'draft' && 
                            (<>
                              <Chip
                                title='Draft'
                                type='outline'
                                icon={{
                                  name:'checkmark-outline',
                                  type:'ionicon',
                                  size:16,
                                  color:'#fff'
                                }}
                                disabledStyle={{backgroundColor:colors.header,borderColor:colors.header,color:colors.header,margin:5,paddingLeft:3,paddingTop:3,paddingBottom:3,paddingRight:8}}
                                disabledTitleStyle={{color:'#fff'}}
                                disabled={true}
                              />
                            </>) || 
                            (<>
                              {line.status == 'void' && (<><Chip
                                title='Void'
                                type='outline'
                                icon={{
                                  name:'checkmark-outline',
                                  type:'ionicon',
                                  size:16,
                                  color:'#fff'
                                }}
                                disabledStyle={{backgroundColor:btnColors.danger,borderColor:btnColors.danger,color:btnColors.danger,margin:5,paddingLeft:3,paddingTop:3,paddingBottom:3,paddingRight:8}}
                                disabledTitleStyle={{color:'#fff'}}
                                disabled={true}
                              /></>) || 
                              (<><Chip
                                title='Open'
                                type='outline'
                                icon={{
                                  name:'checkmark-outline',
                                  type:'ionicon',
                                  size:16,
                                  color:'#fff'
                                }}
                                disabledStyle={{backgroundColor:btnColors.primary,borderColor:btnColors.primary,color:btnColors.primary,margin:5,paddingLeft:3,paddingTop:3,paddingBottom:3,paddingRight:8}}
                                disabledTitleStyle={{color:'#fff'}}
                                disabled={true}
                              /></>)}
                            </>)}
                          </>)}
                        </>)}
                      </View>
                      <View style={[styles.paymentRowNumber]}>
                        <Text style={[styles.paymentRowText]}>
                          {line.number}
                        </Text>
                      </View>
                      <View style={styles.paymentRowTouchDescription}>
                        <Text style={styles.paymentRowText}>{
                          line.billing_reason == 'subscription_create' && 'Subscription created' || 
                          (line.billing_reason == 'subscription_update' && 'Subscription updated' 
                          || 'Subscription changed')
                        }</Text>
                      </View>
                      <View style={styles.paymentRowTouchDate}>
                        <Text style={styles.paymentRowText}>{parseSimpleDateText(new Date(line.created*1000))}</Text>
                      </View>
                      <View style={styles.paymentRowTouchView}>
                        <Chip
                            title='View'
                            type='outline'
                            onPress={() => {
                              window.open(line.hosted_invoice_url, '_blank')
                            }}
                            buttonStyle={{
                              padding:5,
                              margin:5
                            }}
                          />
                      </View>
                      
                    </View>)
                })}
              </View>
            </View>
          </>)}

          {showPlansAsFree && (<>
            <View style={[styles.bodyContainer,{alignItems:'center'}]}>
              <Text style={styles.bodyTitle}>We hope you are enjoying the Free Plan...</Text>
              <Text style={styles.bodyDesc}>Upgrade below to unlock more features, storage, client capacity, and more!</Text>
              <View style={{alignItems:'center',marginTop:10}}>
                <ButtonGroup
                  onPress={selectPlanPeriod}
                  buttons={['Monthly Plans','Annual Plans']}
                  selectedIndex={planPeriodIndex}
                  containerStyle={{width:400,height:40,marginBottom:20}}
                />
              </View>
              <View style={{flexDirection:'row',marginTop:20,flex:1,width:'100%'}}>
                {plans.map((plan, index) => {

                  var planTitleColor = {color:btnColors.primary}

                  if (plan.Type == 1) {
                    planTitleColor = {color:btnColors.success}
                  } else if (plan.Type == 2) {
                    planTitleColor = {color:btnColors.danger}
                  }

                  var info = plan.Info.split(',')

                  var currentPlan = (plan.Type == coach.Plan)

                  var periodText = ' /month'
                  var periodNum = 1
                  if (planPeriodIndex == 1) {
                    periodText = ' /year'
                    periodNum = 12
                  }

                  var isDiscounted = false
                  var activeDiscountPrice = 0

                  if (activeDiscount.Percent != undefined) {
                    isDiscounted = true
                    activeDiscountPrice = (parseFloat(plan.BasePrice)*(100/(100-activeDiscount.Percent))*planAnnual).toFixed(2)
                  }

                  return (<View key={index} style={{flex:1,marginBottom:20}}>
                    <Text style={[styles.planTitle]}><Text style={planTitleColor}>{plan.Title}</Text> Plan</Text>
                    <View>
                      <View>
                        {info.map((infoItem, infoIndex) => {
                          return (<Text key={infoIndex + '_'} style={styles.planDesc}>
                            - {infoItem}
                          </Text>)
                        })}
                      </View>
                      <View style={{flexDirection:'column',marginTop:10,alignItems:'center',justifyContent:'center'}}>
                        {isDiscounted && (<View>
                          <Text style={styles.originalPrice}>${activeDiscountPrice}</Text>
                          <Text style={styles.discountTitle}>{activeDiscount.Description}:</Text>
                        </View>)}
                        <Text style={styles.planTitleAmount}>
                          ${(parseFloat(plan.BasePrice)*planAnnual).toFixed(2) + periodText}
                        </Text>
                      </View>
                      <View style={{flexDirection:'column',marginTop:10,alignItems:'center',justifyContent:'center'}}>
                        {index == 0 && (<>
                          <Text style={styles.planCurrent}>Current Plan</Text>
                        </>) || (<>
                          {plansButtonIndicators[index] == false && currentPlan && coach.PaymentPeriod == periodNum && (<>
                            <Text style={styles.planCurrent}>Current Plan</Text>
                          </>)}
                          {plansButtonIndicators[index] == false && currentPlan == false && coach.Plan < plan.Type && (<>
                            <Button
                              title='Upgrade'
                              buttonStyle={styles.upgradeToPlanButton}
                              containerStyle={styles.upgradeToPlanButtonContainer}
                              titleStyle={{color:'#fff'}}
                              onPress={() => upgradeToPlanAsFree(plan.Type)}
                              disabled={plansButtonIndicators[index]}
                            />
                          </>)}
                          {plansButtonIndicators[index] && (<View style={{}}>
                            <ActivityIndicatorView />
                          </View>)}
                        </>)}
                      </View>
                    </View>
                  </View>)

                })}
              </View>
            </View>
          </>)}

          {showSubscribeForm && (<View style={[signUp.paymentFormContainer,{width:'100%'}]}>
            <TouchableOpacity style={[signUp.backContainer,{flex:1,width:'100%',justifyContent:'flex-start'}]} onPress={onBackPayment}>
              <Icon containerStyle={signUp.iconStyle} color={colors.mainTextColor} type='ionicon' name='arrow-back-circle-outline'/>
              <Text style={signUp.backText}>Go Back</Text>
            </TouchableOpacity>
            <View style={[signUp.paymentForm]}>
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
                    <Text style={signUp.paymentDiscountAmount}>${activeDiscount.Percent != undefined && (priceBase)}</Text>
                    <Text style={signUp.paymentPrimaryAmount}>${priceAmount}</Text>
                  </View>
                </View>
                <View style={signUp.stripeSection}>
                  <Image
                      source={require('../assets/stripe.png')}
                      resizeMode="contain"
                      style={[
                        signUp.paymentStripe
                      ]}
                  />
                </View>
              </View>
              <View style={signUp.paymentMain}>
                <Text style={{fontSize:14,textAlign:'center',fontFamily:'Poppins',color:colorsLight.mainTextColor}}>
                  By subscribing you agree to our <a href="https://coachsync.me/terms" target="_blank" rel="noreferrer">Terms</a> and <a href="https://coachsync.me/privacy" target="_blank" rel="noreferrer">Privacy Policy</a>.
                </Text>
                {cardError && (<View style={messageBox.errorBox}>
                    <View style={messageBox.icon}><Icon name='close-circle-outline' size={30} type='ionicon' color={colorsLight.darkGray}/></View>
                    <Text style={messageBox.text}>{cardError}</Text>
                  </View>) || (<View></View>)}
                <Elements stripe={stripePromise}>
                  <SubscribeForm memo={priceMemo} onFinished={handleFinish} planId={planType} annual={planAnnual} priceAmount={priceAmount} />
                </Elements>
              </View>
            </View>
          </View>)}

        </View>
      </View>
    </View>
  </ScrollView>)

}