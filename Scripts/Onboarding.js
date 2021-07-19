import { StatusBar } from 'expo-status-bar'
import React, { useEffect, useState, useContext } from 'react'
import { TouchableOpacity, ScrollView, StyleSheet, Text, View } from 'react-native'
import { onboardingStylesLight, colorsLight, innerDrawerLight, btnColors } from '../Scripts/Styles.js'
import { onboardingStylesDark, colorsDark, innerDrawerDark } from '../Scripts/Styles.js'
import { useLinkTo } from '@react-navigation/native'
import LoadingScreen from '../Scripts/LoadingScreen.js'
import { Helmet } from "react-helmet"
import ActivityIndicatorView from '../Scripts/ActivityIndicatorView.js'
import { getOnboardingData } from './API.js'
import { Icon, Button } from 'react-native-elements'
import { Popup, Dropdown, Tab, Checkbox } from 'semantic-ui-react'
import { TextInput } from 'react-native-web'

import userContext from './Context.js'

export default function Onboarding() {

  const user = useContext(userContext)
  const linkTo = useLinkTo()
  const [refreshing, setRefreshing] = useState(true)
  const [styles, setStyles] = useState(onboardingStylesLight)
  const [colors, setColors] = useState(colorsLight)

  // Main stage controls.
  const [showActivityIndicator, setActivityIndicator] = useState(true)
  const [showMain, setShowMain] = useState(false)

  // Main variables.
  const [coach, setCoach] = useState(user)
  
  // Onboarding data.
  const [onboardingStatus, setOnboardingStatus] = useState([0, 0, 0])
  const [surveyId, setSurveyId] = useState(-1)
  const [paymentId, setPaymentId] = useState(-1)
  const [contractId, setContractId] = useState(-1)

  // Prompts data.
  const [hasSearchContents, setHasSearchContents] = useState([0, 0, 0])

  const [surveys, setSurveys] = useState([])
  const [surveySelectedIndex, setSurveySelectedIndex] = useState(-1)

  const [payments, setPayments] = useState([])
  const [paymentSelectedIndex, setPaymentSelectedIndex] = useState(-1)

  const [contracts, setContracts] = useState([])
  const [contractSelectedIndex, setContractSelectedIndex] = useState(-1)

  // Main functions. 
  const refreshOnboardingData = async () => {

    // Get data.
    var data = JSON.parse(JSON.stringify(await getOnboardingData(coach.Id, coach.Token)))
    console.log('data:',data)

    // Calculate status array.
    var status = [0, 0, 0]
    var type = data.OnboardingType
    if (type == 7) { // All
      status = [1, 1, 1]
    } else if (type == 6) { // Payment, Contract
      status = [0, 1, 1]
    } else if (type == 5) { // Survey, Contract
      status = [1, 0, 1]
    } else if (type == 4) { // Survey, Payment
      status = [1, 1, 0]
    } else if (type == 3) { // Contract
      sstatus = [0, 0, 1]
    } else if (type == 2) { // Payment
      status = [0, 1, 0] 
    } else if (type == 1) { // Survey
      status = [1, 0, 0]
    } 
    setOnboardingStatus(status)

    // Set prompt data.
    setSurveyId(data.SurveyId)
    setPaymentId(data.PaymentId)
    setContractId(data.ContractId)

    // Set visible variables, set selectedIndices.
    for (var i = 0; i < data.Surveys.length; i++) {
      data.Surveys[i].Visible = true
      if (data.SurveyId == data.Surveys[i].Id) {
        setSurveySelectedIndex(i)
      }
    }

    for (var i = 0; i < data.Payments.length; i++) {
      data.Payments[i].Visible = true
      if (data.PaymentId == data.Payments[i].Id) {
        setPaymentSelectedIndex(i)
      }
    }

    for (var i = 0; i < data.Contracts.length; i++) {
      data.Contracts[i].Visible = true
      if (data.ContractId == data.Contracts[i].Id) {
        setContractSelectedIndex(i)
      }
    }

    setSurveys(data.Surveys)
    setPayments(data.Payments)
    setContracts(data.Contracts)

    // Show.
    setActivityIndicator(false)
    setShowMain(true)
  }

  useEffect(() => {
    console.log('Welcome to Onboarding.')
    if (coach != null) {
      // Load page.
      refreshOnboardingData()
    } else {
      linkTo('/welcome')
    }
  },[])

  // Prompt management functions.

  // Update promptId based on Index.
  // Type: 0 - Survey
  //       1 - Payment
  //       2 - Contract
  const selectPrompt = (type, index) => {

    var id = -1

    if (type == 0) {

      for (var i = 0; i < surveys.length; i++) {
        if (i == index) {
          id = surveys[i].Id
          setSurveySelectedIndex(i)
          break
        }
      }
      

    } else if (type == 1) {

      for (var i = 0; i < payments.length; i++) {
        if (i == index) {
          id = payments[i].Id
          setPaymentSelectedIndex(i)
          break
        }
      }

    } else if (type == 2) {

      for (var i = 0; i < contracts.length; i++) {
        if (i == index) {
          id = contracts[i].Id
          setContractSelectedIndex(i)
          break
        }
      }

    }

  }

  // Toggle a section.
  const toggleSection = (type) => {

    var newOnboardingStatus = JSON.parse(JSON.stringify(onboardingStatus))
    newOnboardingStatus[type] = (newOnboardingStatus[type] == 1) ? 0 : 1
    setOnboardingStatus(newOnboardingStatus)

  }

  // Search through prompts.
  const searchSection = (type, text) => {

    // Update content highlight.
    var newHasSearchContents = JSON.parse(JSON.stringify(hasSearchContents))
    newHasSearchContents[type] = (text.length > 0) ? 1 : 0
    setHasSearchContents(newHasSearchContents)

    // Filter.
    var len = text.length
    if (type == 0) {

      var newSurveys = JSON.parse(JSON.stringify(surveys))
      for (var i = 0; i < newSurveys.length; i++) {
        if (len == 0) {
          newSurveys[i].Visible = true
        } else if (newSurveys[i].Title.includes(text)) {
          newSurveys[i].Visible = true
        } else {
          newSurveys[i].Visible = false
        }
      }
      setSurveys(newSurveys)

    } else if (type == 1) {

      var newPayments = JSON.parse(JSON.stringify(payments))
      for (var i = 0; i < newPayments.length; i++) {
        if (len == 0) {
          newPayments[i].Visible = true
        } else if (newPayments[i].Title.includes(text)) {
          newPayments[i].Visible = true
        } else {
          newPayments[i].Visible = false
        }
      }
      setPayments(newPayments)

    } else if (type == 2) {

      var newContracts = JSON.parse(JSON.stringify(contracts))
      for (var i = 0; i < newContracts.length; i++) {
        if (len == 0) {
          newContracts[i].Visible = true
        } else if (newContracts[i].Title.includes(text)) {
          newContracts[i].Visible = true
        } else {
          newContracts[i].Visible = false
        }
      }
      setContracts(newContracts)

    }

  }

  const saveOnboarding = async () => {

    // Determine type.
    var type = 0

    // All
    if (onboardingStatus[0] == 1 && onboardingStatus[1] == 1 && onboardingStatus[2] == 1) {
      type = 7
    // Payment, Contract
    } else if (onboardingStatus[0] == 0 && onboardingStatus[1] == 1 && onboardingStatus[2] == 1) {
      type = 6
    // Survey, Contract 
    } else if (onboardingStatus[0] == 1 && onboardingStatus[1] == 0 && onboardingStatus[2] == 1) {
      type = 5
    // Survey, Payment
    } else if (onboardingStatus[0] == 1 && onboardingStatus[1] == 1 && onboardingStatus[2] == 0) {
      type = 4
    // Contract
    } else if (onboardingStatus[0] == 0 && onboardingStatus[1] == 0 && onboardingStatus[2] == 1) {
      type = 3
    // Payment
    } else if (onboardingStatus[0] == 0 && onboardingStatus[1] == 1 && onboardingStatus[2] == 0) {
      type = 2
    // Survey
    } else if (onboardingStatus[0] == 1 && onboardingStatus[1] == 0 && onboardingStatus[2] == 0) {
      type = 1
    }

    // Check if the primary prompts have to be updated.
    var idsToSend = [-1, -1, -1]
    if (surveyId != surveys[surveySelectedIndex].Id) {
      idsToSend[0] = surveys[surveySelectedIndex].Id
    }
    if (paymentId != payments[paymentSelectedIndex].Id) {
      idsToSend[1] = payments[paymentSelectedIndex].Id
    }
    if (contractId != contracts[contractSelectedIndex].Id) {
      idsToSend[2] = contracts[contractSelectedIndex].Id
    }

    console.log('')
    console.log('type:',type)
    console.log('idsToSend:',idsToSend)
    console.log('')

    var updated = await updateOnboarding(type, idsToSend, coach.Id, coach.Token)

  }

  return (<ScrollView contentContainerStyle={styles.scrollView}>
    <View style={styles.container}>
      <View style={styles.main}>
        <View style={styles.body}>

          <View style={styles.bodyHeader}>
            <View style={styles.bodyTitleGroup}>
              <Text style={styles.bodyTitle}>Onboarding</Text>
              <Text style={styles.bodyDesc}>Customize the onboarding experience for your clients.</Text>
            </View>
          </View>

          {showActivityIndicator && (<ActivityIndicatorView />)}

          {showMain && (<View style={styles.main}>
            <ScrollView contentContainerStyle={{flex:1}}>
              
              <View style={[styles.promptListContainer,{
                flexDirection: 'row',
                justifyContent: 'flex-start',
                alignItems:'center',
              }]}>
                <Icon
                  name='help-circle-outline'
                  type='ionicon'
                  size={30}
                  color={colors.mainTextColor}
                  style={{marginRight:10}}
                  onPress={() => window.open('https://wiki.coachsync.me/en/account/credits', '_blank')}
                />
                <Text style={styles.saveOnboardingInfo}>
                  Make changes below to your onboarding flow, then save to the right. Onboarding will be shown to new clients after they sign up with your coaching link. 
                  <Text style={[styles.link,{marginLeft:5}]}><a href="https://wiki.coachsync.me/en/account/credits" target="_blank" rel="noreferrer">Click here to learn more.</a></Text>
                </Text>
                <View style={styles.saveOnboardingSpacer}></View>
                <Button 
                  title='Save Onboarding'
                  buttonStyle={styles.saveOnboardingButton}
                  titleStyle={styles.saveOnboardingTitle}
                  onPress={() => saveOnboarding()}
                />
                
              </View>

              <View style={{flexDirection:'row'}}>

                <View style={[styles.promptListContainer,{marginRight:10}]}>
                  <Text style={styles.stepText}>Step #1:</Text>
                  <View style={styles.promptHeader}>
                    <Text style={styles.promptHeaderTitle}>Onboarding Survey</Text>
                    <Checkbox 
                      checked={onboardingStatus[0] == 1}
                      toggle 
                      onChange={() => toggleSection(0)}
                    />
                  </View>
                  {onboardingStatus[0] == 1 && (<View style={styles.promptsRow}>
                    <View style={styles.selectedPrompt}>
                      <Text style={styles.selectedPromptHeader}>Selected Survey:</Text>
                      {surveySelectedIndex == -1 && (<View style={{flex:1,padding:10}}>
                        <Text style={styles.selectedPromptDesc}>No survey selected.</Text>
                      </View>) || (<View style={{flex:1,padding:10}}>
                        <Text style={styles.selectedPromptTitle}>{surveys[surveySelectedIndex].Title}</Text>
                        <Text style={styles.selectedPromptDesc}>{surveys[surveySelectedIndex].Text}</Text>
                      </View>)}
                    </View>
                    <View style={styles.promptsData}>
                      <View style={hasSearchContents[0] == 1 && [styles.searchHighlight] || [styles.searchHighlight,{borderColor:colors.headerBorder}]}>
                        <View style={styles.searchIcon}>
                          <Icon
                            name='search'
                            type='ionicon'
                            size={28}
                            color={hasSearchContents[0] == 1 && colors.mainTextColor || colors.headerBorder}
                            style={[{marginLeft:5,marginTop:2}]}
                          />
                        </View>
                        <TextInput 
                          placeholder='Filter surveys...'
                          style={styles.searchInput}
                          onChange={(e) => {
                            searchSection(0, e.currentTarget.value)
                          }}
                          className='custom-textinput'
                        />
                      </View>
                      {surveys.length > 0 && (<ScrollView horizontal={true} contentContainerStyle={styles.innerRow}>
                        {surveys.map((survey, index) => {
      
                          if (survey.Visible == true) {

                            var promptIcon = 'clipboard-outline'
                            var name = survey.Title
                            if (name.length > 25) {
                              name = name.slice(0,25) + '...'
                            }
                            var text = survey.Text
                            if (text.length > 80) {
                              text = text.slice(0,80) + '...'
                            }

                            return (<View style={styles.taskBox} key={index + '-'}>
                              <View style={styles.taskPreview}>
                                <View style={styles.taskPreviewHeader}>
                                  <View style={styles.taskPreviewHeaderIcon}>
                                    <Icon
                                      name={promptIcon}
                                      type='ionicon'
                                      size={22}
                                      color={colors.mainTextColor}
                                    />
                                  </View>
                                  {survey.Title.length > 15 && (<Popup 
                                    trigger={<Text style={styles.taskPreviewTitle}>{name}</Text>}
                                    content={survey.Title}
                                    inverted
                                    position={'top left'}
                                  />) || (<Text style={styles.taskPreviewTitle}>{name}</Text>)}
                                </View>
                                <Text style={styles.taskPreviewText}>{text}</Text>
                                {surveySelectedIndex == index && (<>
                                  <Button 
                                    title='Active'
                                    titleStyle={styles.taskSelectedTitle}
                                    buttonStyle={styles.taskSelectedButton}
                                  />
                                </>) || (<>
                                  <Button 
                                    title='Select'
                                    titleStyle={styles.taskSelectTitle}
                                    buttonStyle={styles.taskSelectButton}
                                    onPress={() => selectPrompt(0, index)}
                                  />
                                </>)}
                              </View>
                            </View>)

                          }

                        })}
                      </ScrollView>) || (<View style={styles.helpBox}>
                        <Text style={styles.helpBoxText}>No surveys created yet.</Text>
                      </View>)}
                    </View>
                  </View>)}
                </View>

                <View style={[styles.promptListContainer,{marginLeft:10,marginRight:10}]}>
                  <Text style={styles.stepText}>Step #2:</Text>
                  <View style={styles.promptHeader}>
                    <Text style={styles.promptHeaderTitle}>Onboarding Payment</Text>
                    <Checkbox 
                      checked={onboardingStatus[1] == 1}
                      toggle 
                      onChange={() => toggleSection(1)}
                    />
                  </View>
                  {onboardingStatus[1] == 1 && (<View style={styles.promptsRow}>
                    <View style={styles.selectedPrompt}>
                      <Text style={styles.selectedPromptHeader}>Selected Payment:</Text>
                      {paymentSelectedIndex == -1 && (<View style={{flex:1,padding:10}}>
                        <Text style={styles.selectedPromptDesc}>No payment selected.</Text>
                      </View>) || (<View style={{flex:1,padding:10}}>
                        <Text style={styles.selectedPromptTitle}>{payments[paymentSelectedIndex].Title}</Text>
                        <Text style={styles.selectedPromptDesc}>{payments[paymentSelectedIndex].Memo}</Text>
                      </View>)}
                    </View>
                    <View style={styles.promptsData}>
                      <View style={hasSearchContents[1] == 1 && [styles.searchHighlight] || [styles.searchHighlight,{borderColor:colors.headerBorder}]}>
                        <View style={styles.searchIcon}>
                          <Icon
                            name='search'
                            type='ionicon'
                            size={28}
                            color={hasSearchContents[1] == 1 && colors.mainTextColor || colors.headerBorder}
                            style={[{marginLeft:5,marginTop:2}]}
                          />
                        </View>
                        <TextInput 
                          placeholder='Filter payments...'
                          style={styles.searchInput}
                          onChange={(e) => {
                            searchSection(1, e.currentTarget.value)
                          }}
                          className='custom-textinput'
                        />
                      </View>
                      {payments.length > 0 && (<ScrollView horizontal={true} contentContainerStyle={styles.innerRow}>
                        {payments.map((payment, index) => {
      
                          if (payment.Visible == true) {

                            var promptIcon = 'card'
                            var name = payment.Title
                            if (name.length > 25) {
                              name = name.slice(0,25) + '...'
                            }
                            var text = payment.Memo
                            if (text.length > 80) {
                              text = text.slice(0,80) + '...'
                            }

                            return (<View style={styles.taskBox} key={index + '-'}>
                              <View style={styles.taskPreview}>
                                <View style={styles.taskPreviewHeader}>
                                  <View style={styles.taskPreviewHeaderIcon}>
                                    <Icon
                                      name={promptIcon}
                                      type='ionicon'
                                      size={22}
                                      color={colors.mainTextColor}
                                    />
                                  </View>
                                  {payment.Title.length > 15 && (<Popup 
                                    trigger={<Text style={styles.taskPreviewTitle}>{name}</Text>}
                                    content={payment.Title}
                                    inverted
                                    position={'top left'}
                                  />) || (<Text style={styles.taskPreviewTitle}>{name}</Text>)}
                                </View>
                                <Text style={styles.taskPreviewText}>{text}</Text>
                                {paymentSelectedIndex == index && (<>
                                  <Button 
                                    title='Active'
                                    titleStyle={styles.taskSelectedTitle}
                                    buttonStyle={styles.taskSelectedButton}
                                  />
                                </>) || (<>
                                  <Button 
                                    title='Select'
                                    titleStyle={styles.taskSelectTitle}
                                    buttonStyle={styles.taskSelectButton}
                                    onPress={() => selectPrompt(1, index)}
                                  />
                                </>)}
                              </View>
                            </View>)
                          }
                        })}
                      </ScrollView>) || (<View style={styles.helpBox}>
                        <Text style={styles.helpBoxText}>No payments created yet.</Text>
                      </View>)}
                    </View>
                  </View>)}
                </View>

                <View style={[styles.promptListContainer,{marginLeft:10}]}>
                  <Text style={styles.stepText}>Step #3:</Text>
                  <View style={styles.promptHeader}>
                    <Text style={styles.promptHeaderTitle}>Onboarding Contract</Text>
                    <Checkbox 
                      checked={onboardingStatus[2] == 1}
                      toggle 
                      onChange={() => toggleSection(2)}
                    />
                  </View>
                  {onboardingStatus[2] == 1 && (<View style={styles.promptsRow}>
                    <View style={styles.selectedPrompt}>
                      <Text style={styles.selectedPromptHeader}>Selected Contract:</Text>
                      {contractSelectedIndex == -1 && (<View style={{flex:1,padding:10}}>
                        <Text style={styles.selectedPromptDesc}>No contract selected.</Text>
                      </View>) || (<View style={{flex:1,padding:10}}>
                        <Text style={styles.selectedPromptTitle}>{contracts[contractSelectedIndex].Title}</Text>
                        <Text style={[styles.selectedPromptDesc,styles.link]}>
                          <a href={contracts[contractSelectedIndex].File} target="_blank" rel="noreferrer">
                            View Contract Here
                          </a>
                        </Text>
                      </View>)}
                    </View>
                    <View style={styles.promptsData}>
                      <View style={hasSearchContents[2] == 1 && [styles.searchHighlight] || [styles.searchHighlight,{borderColor:colors.headerBorder}]}>
                        <View style={styles.searchIcon}>
                          <Icon
                            name='search'
                            type='ionicon'
                            size={28}
                            color={hasSearchContents[2] == 1 && colors.mainTextColor || colors.headerBorder}
                            style={[{marginLeft:5,marginTop:2}]}
                          />
                        </View>
                        <TextInput 
                          placeholder='Filter contracts...'
                          style={styles.searchInput}
                          onChange={(e) => {
                            searchSection(2, e.currentTarget.value)
                          }}
                          className='custom-textinput'
                        />
                      </View>
                      {contracts.length > 0 && (<ScrollView horizontal={true} contentContainerStyle={styles.innerRow}>
                        {contracts.map((contract, index) => {
      
                          if (contract.Visible == true) {

                            var promptIcon = 'card'
                            var name = contract.Title
                            if (name.length > 25) {
                              name = name.slice(0,25) + '...'
                            }

                            return (<View style={styles.taskBox} key={index + '-'}>
                              <View style={styles.taskPreview}>
                                <View style={styles.taskPreviewHeader}>
                                  <View style={styles.taskPreviewHeaderIcon}>
                                    <Icon
                                      name={promptIcon}
                                      type='ionicon'
                                      size={22}
                                      color={colors.mainTextColor}
                                    />
                                  </View>
                                  {contract.Title.length > 15 && (<Popup 
                                    trigger={<Text style={styles.taskPreviewTitle}>{name}</Text>}
                                    content={contract.Title}
                                    inverted
                                    position={'top left'}
                                  />) || (<Text style={styles.taskPreviewTitle}>{name}</Text>)}
                                </View>
                                <Text style={[styles.taskPreviewText,styles.link]}>
                                  <a href={contract.File} target="_blank" rel="noreferrer">
                                    View {contract.Title} Here
                                  </a>
                                </Text>
                                {contractSelectedIndex == index && (<>
                                  <Button 
                                    title='Active'
                                    titleStyle={styles.taskSelectedTitle}
                                    buttonStyle={styles.taskSelectedButton}
                                  />
                                </>) || (<>
                                  <Button 
                                    title='Select'
                                    titleStyle={styles.taskSelectTitle}
                                    buttonStyle={styles.taskSelectButton}
                                    onPress={() => selectPrompt(2, index)}
                                  />
                                </>)}
                              </View>
                            </View>)
                          }
                        })}
                      </ScrollView>) || (<View style={styles.helpBox}>
                        <Text style={styles.helpBoxText}>No contracts created yet.</Text>
                      </View>)}
                    </View>
                  </View>)}
                </View>

              </View>

            </ScrollView>
          </View>)}

          

        </View>
      </View>
    </View>
  </ScrollView>)

}
