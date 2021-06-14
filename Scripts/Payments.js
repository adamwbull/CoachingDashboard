import { StatusBar } from 'expo-status-bar'
import React, { useEffect, useState, useContext } from 'react'
import { TouchableOpacity, Image, ScrollView, StyleSheet, Text, View } from 'react-native'
import { paymentsLight, colorsLight, innerDrawerLight, btnColors } from '../Scripts/Styles.js'
import { paymentsDark, colorsDark, innerDrawerDark } from '../Scripts/Styles.js'
import { useLinkTo, Link } from '@react-navigation/native'
import LoadingScreen from '../Scripts/LoadingScreen.js'
import ActivityIndicatorView from '../Scripts/ActivityIndicatorView.js'
import { set, get, getTTL, ttl } from './Storage.js'
import { TextInput } from 'react-native-web'
import { Icon, Button, Chip } from 'react-native-elements'
import ConnectStripe from '../assets/connect-stripe.png'
import { monthNames, sqlToJsDate, getPaymentCharges, parseSimpleDateText } from './API.js'

import userContext from './Context.js'

export default function Payments() {
  const linkTo = useLinkTo()
  const user = useContext(userContext)
  const [refreshing, setRefreshing] = useState(true)
  const [styles, setStyles] = useState(paymentsLight)
  const [colors, setColors] = useState(colorsLight)

  // Main stage controls.
  const [showActivityIndicator, setActivityIndicator] = useState(true)
  const [showMain, setMain] = useState(false)
  const [showUpgradeNeeded, setUpgradeNeeded] = useState(false)

  // Main stage variables.
  const [coach, setCoach] = useState(user)
  const [monthlyStarting, setMonthlyStarting] = useState({})
  const date = new Date()
  // Payment related.
  const [payments, setPayments] = useState(false)
  const [monthlyTotal, setMonthlyTotal] = useState(0)
  const [total, setTotal] = useState(0)

  // Main functions.
  const refreshPayments = async (id, token) => {
    var refresh = await getPaymentCharges(id, token)
    // Get total and monthly earnings.
    var t = 0
    var m = 0
    var beginningOfMonth = new Date(date.getMonth() + ' 1, ' + date.getFullYear())
    refresh.forEach((item, index) => {
      var d = sqlToJsDate(item.Created)
      t += item.Amount
      if (d > beginningOfMonth) {
        t += item.Amount
      }
    })
  }

  useEffect(() => {
    console.log('Welcome to payments.')
    if (coach != null) {
      refreshPayments(coach.Id, coach.Token)
      var d = new Date()
      if (d.getDay() > 1) {
        setMonthlyStarting(monthNames[d.getMonth()] + ' ' + d.getDay() + ', ' + d.getFullYear())
      } else {
        setMonthlyStarting(monthNames[d.getMonth()] + ' 1, ' + d.getFullYear())
      }
      setTimeout(() => {
        setActivityIndicator(false)
        if (coach.Plan == 0) {
          setUpgradeNeeded(true)
        }
        setMain(true)
      }, 500)
    } else {
      linkTo('/welcome')
    }
  },[])

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

          {showUpgradeNeeded && (<View style={styles.bodyContainer}>
            <Text style={styles.bodySubtitle}>Some Features Disabled...</Text>
            <Text style={styles.bodyDesc}>You will not be able to create, collect, or assign any payments on the Free Plan. Visit <Link to='/manage-plan' style={{color:btnColors.primary}}>Manage Plan</Link> to upgrade.</Text>
          </View>)}

          {showMain && (<>
            <View style={styles.bodyRow}>
              <View style={[styles.bodyContainer,{flex:1,marginRight:10}]}>
                <Text style={styles.bodySubtitle}>Monthly Earnings</Text>
                <Text style={[styles.bodyTitle,{fontSize:40,fontFamily:'Poppins',color:btnColors.success}]}>${monthlyTotal}</Text>
                <Text style={[styles.bodySubtitle,{fontFamily:'Poppins',fontSize:20}]}>since {monthlyStarting}</Text>
              </View>
              <View style={[styles.bodyContainer,{flex:1,marginLeft:10}]}>
                <Text style={styles.bodySubtitle}>Total Earnings</Text>
                <Text style={[styles.bodyTitle,{fontSize:40,fontFamily:'Poppins',color:btnColors.success}]}>${total}</Text>
                <Text style={[styles.bodySubtitle,{fontFamily:'Poppins',fontSize:20}]}>since joining on {parseSimpleDateText(sqlToJsDate(coach.Created))}</Text>
              </View>
            </View>
            <View style={styles.bodyRow}>
              <View style={[styles.bodyContainer,{flex:1}]}>
                <Text style={styles.bodySubtitle}>Recent Payments</Text>
                <View style={styles.paymentsControls}>
                  <TouchableOpacity style={styles.paymentControlsTouchIcon}>
                    <Icon
                      name='square-outline'
                      type='ionicon'
                      size={20}
                      color={colors.mainTextColor}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.paymentControlsTouchAmount}>
                    <Text style={[styles.paymentsControlsText,{paddingRight:0}]}>Amount</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.paymentControlsTouchAmountCurrency}>
                    <Text style={styles.paymentsControlsText}></Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.paymentControlsTouchAmountStatus}>
                    <Text style={styles.paymentsControlsText}></Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.paymentControlsTouchDescription}>
                    <Text style={styles.paymentsControlsText}>Description</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.paymentControlsTouchClient}>
                    <Text style={styles.paymentsControlsText}>Client</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.paymentControlsTouchDate}>
                    <Text style={styles.paymentsControlsText}>Date</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.paymentControlsTouchIcon}>
                    <Icon
                      name='ellipsis-horizontal-outline'
                      type='ionicon'
                      size={0}
                      color={colors.mainTextColor}
                    />
                  </TouchableOpacity>
                </View>
                {payments.length > 0 && (<>
                  {payments.map((payment, index) => {
                    return (<View key={index} style={styles.paymentRow}>
                      <TouchableOpacity style={styles.paymentRowTouchIcon}>
                        <Icon
                          name='square-outline'
                          type='ionicon'
                          size={20}
                          color={colors.mainTextColor}
                        />
                      </TouchableOpacity>
                      <View style={[styles.paymentRowTouchAmount]}>
                        <Text style={[styles.paymentRowText,{paddingRight:0,textAlign:'right',fontFamily:'PoppinsSemiBold'}]}>${(payment.Amount/100).toFixed(2)}</Text>
                      </View>
                      <View style={styles.paymentRowTouchAmountCurrency}>
                        <Text style={styles.paymentRowText}>{payment.Currency}</Text>
                      </View>
                      <View style={styles.paymentRowTouchAmountStatus}>
                        {payment.IsPaid == 0 && (<><Chip
                          title='Pending'
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
                          (<>{payment.IsPaid == 1 && (<>
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
                            <Chip
                              title='Refunded'
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
                            />
                          </>)}
                        </>)}
                      </View>
                      <View style={styles.paymentRowTouchDescription}>
                        <Text style={styles.paymentRowText}>Description</Text>
                      </View>
                      <View style={styles.paymentRowTouchClient}>
                        <Text style={styles.paymentRowText}>Client</Text>
                      </View>
                      <View style={styles.paymentRowTouchDate}>
                        <Text style={styles.paymentRowText}>Date</Text>
                      </View>
                      <TouchableOpacity style={styles.paymentRowTouchIcon}>
                        <Icon
                          name='ellipsis-horizontal-outline'
                          type='ionicon'
                          size={22}
                          color={colors.mainTextColor}
                        />
                      </TouchableOpacity>
                    </View>)
                  })}
                </>) || (<>
                  <Text style={styles.noPayments}>Nothing yet! Create Payments to assign on the <Link to='/prompts' style={{color:btnColors.primary}}>Prompts Page</Link>.</Text>
                </>)}
              </View>
            </View>
          </>)}

        </View>
      </View>
    </View>
  </ScrollView>)

}
