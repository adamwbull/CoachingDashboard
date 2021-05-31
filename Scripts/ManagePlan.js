/* eslint-disable react/prop-types */
/* eslint-disable react/display-name */
import React, { useEffect, useState } from 'react'
import { ScrollView, Text, View } from 'react-native'
import { managePlanLight, colorsLight, innerDrawerLight, btnColors } from '../Scripts/Styles.js'
import { managePlanDark, colorsDark, innerDrawerDark } from '../Scripts/Styles.js'
import { useLinkTo } from '@react-navigation/native'
import LoadingScreen from '../Scripts/LoadingScreen.js'
import ActivityIndicatorView from '../Scripts/ActivityIndicatorView.js'
import { set, get, getTTL, ttl } from './Storage.js'
import { TextInput } from 'react-native-web'
import { Icon, Button, ButtonGroup } from 'react-native-elements'
import { sqlToJsDate, parseSimpleDateText, getPlans, getActiveCoachDiscount, getUpcomingSwitchPeriodProration } from './API.js'
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css

export default function ManagePlan() {
  const linkTo = useLinkTo()
  const [refreshing, setRefreshing] = useState(true)
  const [styles, setStyles] = useState(managePlanLight)
  const [colors, setColors] = useState(colorsLight)

  // Main stage controls.
  const [showActivityIndicator, setActivityIndicator] = useState(true)
  const [showBar, setBar] = useState(false)
  const [showMain, setMain] = useState(false)
  const [showPlans, setShowPlans] = useState(false)

  // Main variables.
  const [coach, setCoach] = useState({})
  const [planTitle, setPlanTitle] = useState('')
  const [planTitleStyle, setPlanTitleStyle] = useState({})
  const [plans, setPlans] = useState([])
  const [activePlan, setActivePlan] = useState({})
  const [curAnnual, setCurAnnual] = useState(1)

  // Plans variables.
  const [planAnnual, setPlanAnnual] = useState(1)
  const [planPeriodIndex, setPlanPeriodIndex] = useState(0)
  const [activeDiscount, setActiveDiscount] = useState({})

  // Main functions.
  const refreshPlans = async (t, a, plan, d) => {
    var refresh = JSON.parse(JSON.stringify(await getPlans(t)))
    if (refresh != false) {
      if (a != 0) {
        // If discount exists, apply it to the base price.
        var discount = await getActiveCoachDiscount(t, a)
        console.log('discount:',discount)
        setActiveDiscount(discount)
        for (var i = 0; i < refresh.length; i++) {
          refresh[i].BasePrice = (refresh[i].BasePrice*(1-(discount.Percent/100))).toFixed(2)
        }
      }
      setPlans(refresh)
      console.log('plans:',refresh)
      setActivePlan(refresh[plan])
    }
  }

  useEffect(() => {
    console.log('Welcome to manage plan.')
    const sCoach = get('Coach')
    if (sCoach != null) {
      console.log(sCoach.Token, sCoach.ActiveDiscountId, sCoach.Plan, sCoach.PaymentPeriod)
      refreshPlans(sCoach.Token, sCoach.ActiveDiscountId, sCoach.Plan, sCoach.PaymentPeriod)
      setCoach(sCoach)
      setCurAnnual(sCoach.PaymentPeriod)
      setPlanAnnual(sCoach.PaymentPeriod)
      if (sCoach.PaymentPeriod == 12) {
        setPlanPeriodIndex(1)
      }
      if (sCoach.Plan == 2) {
        setPlanTitle('Professional')
        setPlanTitleStyle({backgroundColor:btnColors.danger})
      } else if (sCoach.Plan == 1) {
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
      }, 500)
    }
  }, [])

  // Navigation functions.
  const navToMain = () => {
    setShowPlans(false)

    setMain(true)
  }

  const navToPlans = () => {
    setMain(false)

    setShowPlans(true)
  }

  // Manage payments functions.
  const managePayments = () => {

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
  const upgradeToPlan = (plan) => {
    if (plan == 1) {

    } else if (plan == 2) {

    }
  }

  const switchPayPeriod = async () => {
    var periodText = "monthly"
    var periodTextCapitalized = "Monthly"
    var periodText2 = "yearly"

    if (coach.PaymentPeriod == 1) {
      periodText = "yearly"
      periodTextCapitalized = "Yearly"
      periodText2 = "monthly"
    }

    const proration = await getUpcomingSwitchPeriodProration(coach.Id, coach.Token, coach.PaymentPeriod, coach.Plan, coach.StripeSubscriptionId, coach.StripeCustomerId)

    var credit = proration.credit;
    var cost = proration.cost;
    var final = ((credit + cost)/100).toFixed(2);

    var finalText = "Credit to Account"
    var finalPayText = ""
    var finalColoring = {color:btnColors.success}
    if (final > 0) {
      finalColoring = "Due"
      finalPayText = "Pay & "
      finalColoring = {color:btnColors.danger}
    }

    confirmAlert({
      customUI: ({ onClose }) => {
        return (<View style={styles.alertContainer}>
          <Text style={styles.alertTitle}>Switch to {periodTextCapitalized} payments?</Text>
          <View style={styles.amountLineContainer}>
            <Text style={styles.amountLine}>Credit from current {periodText2} plan:</Text>
            <Text style={styles.amountLine}>${credit}</Text>
          </View>
          <View style={styles.amountLineContainer}>
            <Text style={styles.amountLine}>Amount due switching to {periodTextCapitalized} Plan:</Text>
            <Text style={styles.amountLine}>${cost}</Text>
          </View>
          <View style={styles.amountLineFinalContainer}>
            <Text style={styles.amountLine}>Total {finalText}:</Text>
            <Text style={[styles.amountLineBold,finalColoring]}>${final}</Text>
          </View>
          <View style={styles.alertButtonRow}>
            <Button
              title='Cancel'
              buttonStyle={styles.alertCancel}
              containerStyle={styles.alertCancelContainer}
              titleStyle={{color:'#fff'}}
              onPress={() => onClose()}
            />
            <Button
              title={finalPayText + 'Switch to ' + periodTextCapitalized + ' Plan'}
              buttonStyle={styles.alertConfirm}
              containerStyle={styles.alertConfirmContainer}
              titleStyle={{color:'#fff'}}
              onPress={() => {
                // Switch payment.
                onClose();
              }}
            />
          </View>
        </View>)
      }
    })
  }

  const downgradeToFree = () => {
    confirmAlert({
      title: 'Downgrade to ?',
      message: `Are you sure you want to downgrade?`,
      buttons: [
        {
          label: 'Yes',
          onClick: async () => {
            console.log('Downgrading to ')
          }
        },
        {
          label: 'Cancel',
        }
      ]
    });
  }

  const downgradeToStandard = () => {
  }

  const upgradeToStandard = () => {
  }

  const downgradeToProfessional = () => {
  }

  const upgradeToProfessional = () => {
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
                    title='Upgrade Plan'
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
                  onPress={managePayments}
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
                      <View style={{flexDirection:'row',marginTop:10,alignItems:'center',justifyContent:'center'}}>
                        {currentPlan && coach.PaymentPeriod == periodNum && (<>
                          <Text style={styles.planCurrent}>Current Plan</Text>
                        </>)}
                        {currentPlan && coach.PaymentPeriod != periodNum && (<>
                          <Button
                            title='Switch Pay Period'
                            buttonStyle={styles.upgradeToPlanButton}
                            containerStyle={styles.upgradeToPlanButtonContainer}
                            titleStyle={{color:'#fff'}}
                            onPress={switchPayPeriod}
                          />
                        </>)}
                        {currentPlan == false && coach.Plan < plan.Type && (<>
                          <Button
                            title='Upgrade'
                            buttonStyle={styles.upgradeToPlanButton}
                            containerStyle={styles.upgradeToPlanButtonContainer}
                            titleStyle={{color:'#fff'}}
                            onPress={upgradeToPlan(plan.Type)}
                          />
                        </>)}
                        {coach.Plan > plan.Type && (<>
                          <Button
                            title='Downgrade'
                            buttonStyle={styles.downgradeToPlanButton}
                            containerStyle={styles.downgradeToPlanButtonContainer}
                            titleStyle={{color:'#fff'}}
                            onPress={upgradeToPlan(plan.Type)}
                          />
                        </>)}
                      </View>
                    </View>
                  </View>)

                })}
              </View>
            </View>
          </>)}

        </View>
      </View>
    </View>
  </ScrollView>)

}
