import { StatusBar } from 'expo-status-bar'
import React, { useEffect, useState } from 'react'
import { TouchableOpacity, ScrollView, StyleSheet, Text, View } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { promptsLight, colorsLight, innerDrawerLight } from '../Scripts/Styles.js'
import { homeDark, colorsDark, innerDrawerDark } from '../Scripts/Styles.js'
import { useLinkTo, Link } from '@react-navigation/native'
import LoadingScreen from '../Scripts/LoadingScreen.js'
import { Helmet } from "react-helmet"
import { Icon, Button } from 'react-native-elements'
import { set, get, getTTL, ttl } from './Storage.js'
import ActivityIndicatorView from '../Scripts/ActivityIndicatorView.js'
import { TextInput } from 'react-native-web'

export default function Prompts() {
  const linkTo = useLinkTo()
  const [refreshing, setRefreshing] = useState(true)
  const [styles, setStyles] = useState(promptsLight)
  const [colors, setColors] = useState(colorsLight)
  const [coach, setCoach] = useState({})

  // Stage controls.
  const [paymentsDisabled, setPaymentsDisabled] = useState(true)
  const [contractsDisabled, setContractsDisabled] = useState(true)
  const [showActivityIndicator, setActivityIndicator] = useState(true)
  const [showMain, setMain] = useState(false)

  // Text Prompts stage controls.
  const [showAddingTextPrompt, setAddingTextPrompt] = useState(false)
  const [videoSelected, setVideoSelected] = useState(false)
  const [showVideoOptions, setVideoOptions] = useState(false)
  const [showSelectYouTube, setSelectYoutube] = useState(false)
  const [showSelectUpload, setSelectUpload] = useState(false)

  // Text Prompts data to upload.
  const [textPromptTitle, setTextPromptTitle] = useState('')
  const [promptType, setPromptType] = useState(0)
  const [textPromptText, setTextPromptText] = useState('')
  const [videoUrl, setVideoUrl] = useState('')
  // Text Prompts builder data.
  const [videoType, setVideoType] = useState(-1)


  // Main page Data.
  const [prompts, setPrompts] = useState([])
  const [surveys, setSurveys] = useState([])
  const [payments, setPayments] = useState([])
  const [contracts, setContracts] = useState([])

  // Get existing Text Prompts, Surveys, Payments, and Contracts.
  const data = () => {
    console.log('Getting data...')
  }

  useEffect(() => {
    const sCoach = get('Coach')
    if (sCoach != null) {
      setCoach(sCoach)
      try {
        data()
      } finally {
        setActivityIndicator(true)
        setTimeout(() => {
          setActivityIndicator(false)
          setMain(true)
        }, 500)
      }
    }
  },[])

  // Text prompt controls.
  const addPrompt = () => {
    setMain(false)
    setActivityIndicator(true)
    setTimeout(() => {
      setActivityIndicator(false)
      setAddingTextPrompt(true)
    },500)
  }

  const onTextPromptTitle = (text) => {
    setTextPromptTitle(text)
  }

  const onTextPromptText = (text) => {
    setTextPromptText(text)
  }

  // Select video type to control showing youtube link or video upload form.
  const selectVideoType = (type) => {
    // 0 - YouTube
    // 1 - Upload
    setVideoType(type)
  }

  const getYoutubeUrl = (url) => {
    var r, x = /^.*(?:(?:youtu\.be\/|v\/|vi\/|u\/\w\/|embed\/)|(?:(?:watch)?\?v(?:i)?=|\&v(?:i)?=))([^#\&\?]*).*/;
    return r = url.match(x)
  }

  // Survey controls.
  const addSurvey = () => {
    console.log ('Add new survey...')
  }

  // Payment controls.
  const addPayment = () => {
    console.log ('Add new payment...')
  }

  // Contract controls.
  const addContract = () => {
    console.log ('Add new contract...')
  }

  return (<ScrollView contentContainerStyle={styles.scrollView}>
    <View style={styles.container}>
      <View style={styles.main}>
        <View style={styles.body}>

          <View style={styles.bodyHeader}>
            <View style={styles.bodyTitleGroup}>
              <Text style={styles.bodyTitle}>Prompts</Text>
              <Text style={styles.bodyDesc}>Content for Clients to respond do.</Text>
            </View>
            <View style={styles.bodyHeaderNav}>
              <Link to='/programs' style={styles.bodyHeaderNavLink}>Programs</Link>
              <Icon
                name='chevron-forward'
                type='ionicon'
                size={22}
                color={colors.mainTextColor}
              />
              <Link to='/prompts' style={styles.bodyHeaderNavLink}>Prompts</Link>
              {showMain == false && (<Icon
                name='chevron-forward'
                type='ionicon'
                size={22}
                color={colors.mainTextColor}
              />)}
              {showAddingTextPrompt && (<Text style={styles.bodyHeaderNavLink}>New Text Prompt</Text>)}
            </View>
          </View>

          {showActivityIndicator && (<ActivityIndicatorView />)}

          {showMain && (<>
            <View style={styles.promptListContainer}>
              <View style={styles.promptHeader}>
                <Text style={styles.promptHeaderTitle}>Text Prompts</Text>
                <Text style={styles.promptHeaderCount}>{0} total</Text>
              </View>
              <ScrollView horizontal={true} contentContainerStyle={styles.promptsRow}>
                <View style={styles.addPromptContainer}>
                  <Button
                  title='Add Text Prompt'
                  titleStyle={styles.promptAddButtonTitle}
                  buttonStyle={styles.promptAddButton}
                  containerStyle={styles.promptAddButtonContainer}
                  onPress={addPrompt} />
                </View>
                {prompts.length > 0 && (<View>
                </View>) || (<View style={styles.helpBox}>
                  <Text style={styles.helpBoxText}>Text prompts with optional video.{"\n"}Assign directly to Clients or include in a Program.</Text>
                </View>)}
              </ScrollView>
            </View>

            <View style={styles.promptListContainer}>
              <View style={styles.promptHeader}>
                <Text style={styles.promptHeaderTitle}>Surveys</Text>
                <Text style={styles.promptHeaderCount}>{0} total</Text>
              </View>
              <View style={styles.promptsRow}>
                <View style={styles.addPromptContainer}>
                  <Button
                  title='Add Survey'
                  titleStyle={styles.promptAddButtonTitle}
                  buttonStyle={styles.promptAddButton}
                  containerStyle={styles.promptAddButtonContainer}
                  onPress={addSurvey} />
                </View>
                {surveys.length > 0 && (<View>
                </View>) || (<View style={styles.helpBox}>
                  <Text style={styles.helpBoxText}>Surveys to collect data or establish baselines.{"\n"}Assign directly to Clients or include in a Program.</Text>
                </View>)}
              </View>
            </View>

            <View style={styles.promptListContainer}>
              <View style={styles.promptHeader}>
                <Text style={styles.promptHeaderTitle}>Payments</Text>
                <Text style={styles.promptHeaderCount}>{0} total</Text>
              </View>
              <View style={styles.promptsRow}>
                <View style={styles.addPromptContainer}>
                  <Button
                  title='Add Payment'
                  disabled={paymentsDisabled}
                  titleStyle={styles.promptAddButtonTitle}
                  buttonStyle={styles.promptAddButton}
                  containerStyle={styles.promptAddButtonContainer}
                  onPress={addPayment} />
                </View>
                {payments.length > 0 && (<View>
                </View>) || (<View style={styles.helpBox}>
                  {paymentsDisabled && (<Text style={styles.helpBoxError}><Text style={styles.standardPlanText}>Standard Plan</Text> is needed to use this feature.</Text>) || (<></>)}
                  <Text style={styles.helpBoxText}>Invoice templates to charge Clients with.{"\n"}Assign directly to Clients or include in a Program.</Text>
                </View>)}
              </View>
            </View>

            <View style={styles.promptListContainer}>
              <View style={styles.promptHeader}>
                <Text style={styles.promptHeaderTitle}>Contracts</Text>
                <Text style={styles.promptHeaderCount}>{0} total</Text>
              </View>
              <View style={styles.promptsRow}>
                <View style={styles.addPromptContainer}>
                  <Button
                  title='Add Contract'
                  disabled={contractsDisabled}
                  titleStyle={styles.promptAddButtonTitle}
                  buttonStyle={styles.promptAddButton}
                  containerStyle={styles.promptAddButtonContainer}
                  onPress={addContract} />
                </View>
                {contracts.length > 0 && (<View>
                </View>) || (<View style={styles.helpBox}>
                  {contractsDisabled && (<Text style={styles.helpBoxError}><Text style={styles.proPlanText}>Professional Plan</Text> is needed to use this feature.</Text>) || (<></>)}
                  <Text style={styles.helpBoxText}>Contracts that can be signed in-app by Clients.{"\n"}Assign directly to Clients or include in a Program.</Text>
                </View>)}
              </View>
            </View>
          </>)}

          {showAddingTextPrompt && (<>
            <View style={styles.newPromptContainer}>

              <View style={styles.newPromptHeader}>
                <Text style={styles.newPromptDescTitle}>New Text Prompt</Text>
              </View>
              <View style={styles.newPromptBody}>
                <View style={styles.newPromptForm}>
                <Text style={styles.newPromptTitleLabel}>Title</Text>
                <TextInput
                  style={styles.inputStyle}
                  value={textPromptTitle}
                  placeholder='ex. Gratitude Journal'
                  onChangeText={onTextPromptTitle}
                />
                <Text style={styles.newPromptTitleLabel}>Body Text</Text>
                <TextInput
                  style={styles.inputStyle}
                  value={textPromptText}
                  placeholder='ex. What are 5 things you are grateful for this week?'
                  onChangeText={onTextPromptText}
                  multiline={true}
                  numberOfLines={4}
                />
                </View>

                <View style={styles.newPromptVideoSection}>
                  {videoSelected &&
                  (<></>)
                  ||
                  (<>
                    {showSelectYouTube && (<>

                    </>)
                    ||
                    (<>
                      {showSelectUpload && (<>

                      </>)
                      ||
                      (<>{showVideoOptions &&
                        (<View style={styles.showVideoOptions}>
                          <TouchableOpacity style={styles.showVideoOptionsChooseUpload}>
                            <Text style={styles.showVideoOptionsChooseUploadTitle}>Upload Video</Text>
                            <Text style={styles.showVideoOptionsChooseUploadTypes}>mp4, m4a, mov</Text>
                            <Text style={styles.showVideoOptionsChooseUploadSize}>max. 200 MB</Text>
                          </TouchableOpacity>
                          <TouchableOpacity style={styles.showVideoOptionsChooseYouTube}>
                            <Text style={styles.showVideoOptionsChooseUploadTitle}>Link YouTube Video</Text>
                          </TouchableOpacity>
                        </View>)
                        ||
                        (<TouchableOpacity style={styles.newPromptVideoEmpty} onPress={() => setVideoOptions(true)}>
                          <Text style={styles.newPromptVideoEmptyText}>
                            Upload or link YouTube video.
                            {"\n"}
                            (optional)
                          </Text>
                        </TouchableOpacity>)}
                      </>)}
                    </>)}
                  </>)}
                </View>
              </View>

              <View style={styles.newPromptFooter}>
                <Button
                  title='Create Prompt'
                  titleStyle={styles.newPromptAddButtonTitle}
                  buttonStyle={styles.newPromptAddButton}
                  containerStyle={styles.newPromptAddButtonContainer}
                />
                <View style={styles.newPromptAddButtonSpacer}></View>
              </View>

            </View>
          </>)}

        </View>
      </View>
    </View>
  </ScrollView>)

}
