/* eslint-disable react/prop-types */
/* eslint-disable react/display-name */
import React, { useEffect, useState, useContext } from 'react'
import { ScrollView, Text, View, Linking, Image } from 'react-native'
import { managePlanLight, colorsLight, innerDrawerLight, btnColors } from '../Scripts/Styles.js'
import { managePlanDark, colorsDark, innerDrawerDark } from '../Scripts/Styles.js'
import { useLinkTo } from '@react-navigation/native'
import LoadingScreen from '../Scripts/LoadingScreen.js'
import ActivityIndicatorView from '../Scripts/ActivityIndicatorView.js'
import { set, get, getTTL, ttl } from './Storage.js'
import { TextInput } from 'react-native-web'
import { Icon, Button, ButtonGroup } from 'react-native-elements'
import { sqlToJsDate, parseSimpleDateText, getPlans, getActiveCoachDiscount, getUpcomingSwitchPeriodProration, getUpcomingChangePlanProration, switchSubscription, invoiceData } from './API.js'
import { confirmAlert } from 'react-confirm-alert' // Import
import 'react-confirm-alert/src/react-confirm-alert.css' // Import css
import AmEx from '../assets/cards/amex.png'
import Discover from '../assets/cards/discover.png'
import MasterCard from '../assets/cards/mastercard.png'
import Visa from '../assets/cards/visa.png'

import userContext from './Context.js'

export default function ManagePlan() {

  const linkTo = useLinkTo()
  const user = useContext(userContext)

  const [refreshing, setRefreshing] = useState(true)
  const [styles, setStyles] = useState(managePlanLight)
  const [colors, setColors] = useState(colorsLight)

  // Main stage controls.
  const [showActivityIndicator, setActivityIndicator] = useState(true)
  const [showBar, setBar] = useState(false)
  const [showMain, setMain] = useState(false)
  const [showPlans, setShowPlans] = useState(false)
  const [showPayments, setShowPayments] = useState(false)
  const [paymentsNav, setPaymentsNav] = useState(true)
  const [firstPaymentsNav, setFirstPaymentsNav] = useState(true)

  // Main variables.
  const [coach, setCoach] = useState(user)
  const [planTitle, setPlanTitle] = useState('')
  const [planTitleStyle, setPlanTitleStyle] = useState({})
  const [billingText, setBillingText] = useState('monthly billing')
  const [plans, setPlans] = useState([])
  const [activePlan, setActivePlan] = useState({})
  const [curAnnual, setCurAnnual] = useState(1)

  // Plans variables.
  const [planAnnual, setPlanAnnual] = useState(1)
  const [planPeriodIndex, setPlanPeriodIndex] = useState(0)
  const [activeDiscount, setActiveDiscount] = useState({})
  const [plansButtonIndicators, setPlansButtonIndicators] = useState([false, false, false])

  // Payments variables.
  const [nextInvoice, setNextInvoice] = useState({})
  const [pastInvoices, setPastInvoices] = useState([])
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
          refresh[i].BasePrice = (refresh[i].BasePrice*(1-(discount.Percent/100))).toFixed(2)
        }
      }
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
      setTimeout(() => {
        setActivityIndicator(false)
        setBar(true)
        setMain(true)
      }, 800)
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
    var brand = invoices[2].data[0].card.brand
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
    console.log('paymentMethod:',paymentMethod)
    setShowPayments(true)
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
    for (var i = 0; i < invoice.lines.data.length; i++) {
      var cur = invoice.lines.data[i]
      if (cur.proration) {
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
          {invoice.lines.data.map((line, index) => {
            var coloring = {}
            var negSign = ""
            if (line.amount < 0) {
              coloring = {color:btnColors.success}
              negSign = "-"
            }
            var amt = Math.abs(line.amount)
            if (line.proration) {
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

    var final = 0;

    // Calculate final.
    for (var i = 0; i < invoice.lines.data.length; i++) {
      var cur = invoice.lines.data[i]
      if (cur.proration) {
        final += cur.amount
      }
    }

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
          {invoice.lines.data.map((line, index) => {
            var coloring = {}
            var negSign = ""
            if (line.amount < 0) {
              coloring = {color:btnColors.success}
              negSign = "-"
            }
            var amt = Math.abs(line.amount)
            if (line.proration) {
              return (<View key={line.id} style={styles.amountLineContainer}>
                <Text style={styles.amountLine}>{line.description}</Text>
                <Text style={[styles.amountLine,coloring]}>{negSign + "$" + (amt/100).toFixed(2)}</Text>
             </View>)
            } else {
              return (<View key={line.id}>
             </View>)
            }
          })}
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

  const switchPayPeriod = async () => {

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
    for (var i = 0; i < invoice.lines.data.length; i++) {
      var cur = invoice.lines.data[i]
      if (cur.proration) {
        final += cur.amount
      }
    }
    
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
          {invoice.lines.data.map((line, index) => {
            var coloring = {}
            var negSign = ""
            if (line.amount < 0) {
              coloring = {color:btnColors.success}
              negSign = "-"
            }
            var amt = Math.abs(line.amount)
            if (line.proration) {
              return (<View key={line.id} style={styles.amountLineContainer}>
                <Text style={styles.amountLine}>{line.description}</Text>
                <Text style={[styles.amountLine,coloring]}>{negSign + "$" + (amt/100).toFixed(2)}</Text>
             </View>)
            } else {
              return (<View key={line.id}>
             </View>)
            }
          })}
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

  return (<ScrollView contentContainerStyle={styles.scrollView}>
    <View style={styles.container}>
      <View style={styles.main}>
        <View style={styles.body}>

          <View style={styles.bodyHeader}>
            <View style={styles.bodyTitleGroup}>
              <Text style={styles.bodyTitle}>Manage Plan</Text>
              <Text style={styles.bodyDesc}>Earn discounts, upgrade, or downgrade your CoachSync plan.</Text>
            </View>
          </View>

          {showBar && (<>
            <View style={[styles.bodyContainer,{flexDirection:'row'}]}>
              {showMain && (<Text style={styles.barSelected}>Overview</Text>)
                        || (<Text onPress={navToMain} style={styles.barUnselected}>Overview</Text>)}
              {(showPayments || paymentsNav == false) && (<Text style={styles.barSelected}>Payments</Text>)
                        || (<Text onPress={navToPayments} style={styles.barUnselected}>Payments</Text>)}
              {showPlans && (<Text style={styles.barSelected}>Plans</Text>)
                        || (<Text onPress={navToPlans} style={styles.barUnselected}>Plans</Text>)}
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
                            onPress={switchPayPeriod}
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
                      <Text style={styles.paymentsNextInvoiceDueDate}>Due {parseSimpleDateText(sqlToJsDate(coach.PlanExpire))}</Text>
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
                  <Text style={styles.cardName}>{paymentMethod.data[0].billing_details.name}</Text>
                </View>
                <View style={styles.cardNumbers}>
                  <Text style={styles.cardNumberGroup}>xxxx</Text>
                  <Text style={styles.cardNumberGroup}>xxxx</Text>
                  <Text style={styles.cardNumberGroup}>xxxx</Text>
                  <Text style={styles.cardNumberGroup}>{paymentMethod.data[0].card.last4}</Text>
                </View>
                <View style={styles.cardRow}>
                  <Text style={styles.cardExpTitle}>Good Thru</Text>
                  <Text style={styles.cardExp}>{paymentMethod.data[0].card.exp_month}/{paymentMethod.data[0].card.exp_year}</Text>
                  <Image source={paymentMethodImage} style={{height:60,width:60}} />
                </View>
              </View>
            </View>
            <View style={styles.bodyContainer}>
              <View style={styles.paymentsPreviousInvoices}>

              </View>
            </View>
          </>)}

        </View>
      </View>
    </View>
  </ScrollView>)

}