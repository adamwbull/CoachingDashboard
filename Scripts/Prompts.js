import { StatusBar } from 'expo-status-bar'
import React, { useEffect, useState } from 'react'
import { TouchableOpacity, ScrollView, StyleSheet, Text, View } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { promptsLight, colorsLight, innerDrawerLight } from '../Scripts/Styles.js'
import { homeDark, colorsDark, innerDrawerDark, btnColors } from '../Scripts/Styles.js'
import { useLinkTo, Link } from '@react-navigation/native'
import LoadingScreen from '../Scripts/LoadingScreen.js'
import { Helmet } from "react-helmet"
import { Icon, Button } from 'react-native-elements'
import { set, get, getTTL, ttl } from './Storage.js'
import ActivityIndicatorView from '../Scripts/ActivityIndicatorView.js'
import { TextInput } from 'react-native-web'
import ReactPlayer from 'react-player'

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
  const [showSelectYouTube, setSelectYouTube] = useState(false)
  const [showSelectUpload, setSelectUpload] = useState(false)
  const [videoError, setVideoError] = useState('')
  const [videoActivityIndicator, setVideoActivityIndicator] = useState(false)
  const [createButtonDisabled, setCreateButtonDisabled] = useState(false)

  // Text Prompts data to upload.
  const [textPromptTitle, setTextPromptTitle] = useState('')
  const [promptType, setPromptType] = useState(0)
  const [textPromptText, setTextPromptText] = useState('')
  const [videoUrl, setVideoUrl] = useState('')
  // Text Prompts builder data.
  const [videoType, setVideoType] = useState(-1) // 0 - YT, 1 - Upload
  const [file, setFile] = useState('')
  const [tempVideoUrl, setTempVideoUrl] = useState('')
  const [uploadFileDisabled, setUploadFileDisabled] = useState(true)

  // Survey Prompts stage controls.
  const [showAddingSurveyPrompt, setAddingSurveyPrompt] = useState(false)

  // Survey Prompts data to upload.
  const [surveyTitle, setSurveyTitle] = useState('')
  const [surveyItems, setSurveyItems] = useState([])

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

  // Return to main.
  const returnToMain = () => {
    setAddingSurveyPrompt(false)
    setAddingTextPrompt(false)
    setActivityIndicator(true)
    setTimeout(() => {
      setActivityIndicator(false)
      setMain(true)
    },500)
  }

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
    setVideoUrl('')
    setFile('')
    if (type == 0) {
      setSelectYouTube(true)
    } else {
      setSelectUpload(true)
    }
    setVideoType(type)
  }

  const promptVideoGoBack = () => {
    setSelectUpload(false)
    setSelectYouTube(false)
    setTempVideoUrl('')
    setVideoUrl('')
    setCreateButtonDisabled(false)
  }

  const getYouTubeUrl = (url) => {
    var r, x = /^.*(?:(?:youtu\.be\/|v\/|vi\/|u\/\w\/|embed\/)|(?:(?:watch)?\?v(?:i)?=|\&v(?:i)?=))([^#\&\?]*).*/
    return r = url.match(x)
  }

  const onYTVideoUrl = (text) => {
    setVideoUrl(text)
    if (!getYouTubeUrl(text)) {
      setTempVideoUrl('')
      setVideoError('Invalid YouTube URL!')
    } else {
      setVideoError('')
      setCreateButtonDisabled(false)
      setTempVideoUrl(text)
    }
  }

  const hiddenFileInput = React.useRef(null)

  const handleFocusBack = () => {
    window.removeEventListener('focus', handleFocusBack)
    setVideoActivityIndicator(false)
  }

  const handleClick = event => {
    hiddenFileInput.current.click()
    window.addEventListener('focus', handleFocusBack)
    setVideoActivityIndicator(true)
    setVideoError('')
  }

  const handleFile = () => {

    // Check type.
    var file = event.target.files[0]
    if (file !== undefined) {
      var fileArr = file.name.split('.')
      console.log(file)
      var fileOptions = ['mov','mp4','m4a']
      setVideoActivityIndicator(false)
      if (fileOptions.includes(fileArr[1])) {
        if (file.size <= 200000000) {
          setCreateButtonDisabled(false)
          setFile(file)
          var temp = URL.createObjectURL(file)
          setTempVideoUrl(temp)
        } else {
          setVideoError('File size should be less than 200 MB.')
        }
      } else {
        setVideoError('File type should be mp4, m4a, or mov.')
      }
    } else {
      setVideoActivityIndicator(false)
    }

  }

  const uploadFile = () => {

  }

  // Survey controls.
  const addSurvey = () => {
    console.log ('Add new survey...')
    setMain(false)
    setActivityIndicator(true)
    setTimeout(() => {
      setActivityIndicator(false)
      setAddingSurveyPrompt(true)
    },500)
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
              <Text style={styles.bodyDesc}>Content for Clients to interact with.</Text>
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
              {showAddingSurveyPrompt && (<Text style={styles.bodyHeaderNavLink}>New Survey</Text>)}
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
                <Icon
                  name='chevron-back'
                  type='ionicon'
                  size={25}
                  color={colors.mainTextColor}
                  onPress={returnToMain}
                />
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
                      {tempVideoUrl !== '' && (<>
                        <View style={[styles.reactPlayerContainer]}>
                          <ReactPlayer controls={true} url={tempVideoUrl} width={'100%'} height={'100%'} />
                        </View>
                        <Text style={{marginTop:10}}>{file.name}</Text>
                        <View style={{flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
                          <Button
                            title='Choose Another Video'
                            titleStyle={styles.uploadFileTitle}
                            buttonStyle={[styles.uploadFileTitleButton,{backgroundColor:btnColors.danger}]}
                            containerStyle={styles.uploadFileTitleButtonContainer}
                            onPress={() => {setTempVideoUrl(''); setVideoUrl(''); setCreateButtonDisabled(true)}}
                          />
                        </View>
                      </>)
                      || (<>
                        <Text style={styles.newPromptTitleLabel}>YouTube Link</Text>
                        <TextInput
                          style={styles.inputStyle}
                          value={videoUrl}
                          placeholder='ex. youtu.be/NlhiR1M_XH8'
                          onChangeText={onYTVideoUrl}
                        />
                        <TouchableOpacity style={styles.videoGoBack} onPress={promptVideoGoBack}>
                          <Icon
                            name='chevron-back'
                            type='ionicon'
                            size={22}
                            color={colors.mainTextColor}
                          />
                          <Text style={styles.videoGoBackText}>Go Back</Text>
                        </TouchableOpacity>
                        {videoError !== '' && (<Text style={styles.videoError}>{videoError}</Text>)}
                      </>)}
                    </>)
                    ||
                    (<>
                      {showSelectUpload && (<View style={styles.selectUploadContainer}>
                        <input type="file" ref={hiddenFileInput} onChange={handleFile} style={{display:'none'}} />
                        {file == '' && (<>
                          <Button
                          title='Choose Video'
                          titleStyle={styles.uploadFileTitle}
                          buttonStyle={styles.uploadFileTitleButton}
                          containerStyle={styles.uploadFileTitleButtonContainer}
                          onPress={handleClick}
                          />
                          <TouchableOpacity style={styles.videoGoBack} onPress={promptVideoGoBack}>
                            <Icon
                              name='chevron-back'
                              type='ionicon'
                              size={22}
                              color={colors.mainTextColor}
                            />
                            <Text style={styles.videoGoBackText}>Go Back</Text>
                          </TouchableOpacity>
                        </>)}
                        {videoActivityIndicator && (<ActivityIndicatorView />) || (<></>)}
                        {videoError !== '' && (<Text style={styles.videoError}>{videoError}</Text>)}
                        {file !== '' && (<>
                          <View style={styles.reactPlayerContainer}>
                            <ReactPlayer controls={true} url={tempVideoUrl} width={'100%'} height={'100%'} />
                          </View>
                          <Text style={{marginTop:10}}>{file.name}</Text>
                          <View style={{flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
                            <Button
                              title='Choose Another Video'
                              titleStyle={styles.uploadFileTitle}
                              buttonStyle={[styles.uploadFileTitleButton,{backgroundColor:btnColors.danger}]}
                              containerStyle={styles.uploadFileTitleButtonContainer}
                              onPress={() => {setFile(''); setCreateButtonDisabled(true)}}
                            />
                          </View>
                        </>)}
                      </View>)
                      ||
                      (<>{showVideoOptions &&
                        (<View style={styles.showVideoOptions}>
                          <TouchableOpacity style={styles.showVideoOptionsChooseUpload} onPress={() => {setSelectUpload(true); setCreateButtonDisabled(true)}}>
                            <Text style={styles.showVideoOptionsChooseUploadTitle}>Upload Video</Text>
                            <Text style={styles.showVideoOptionsChooseUploadTypes}>mp4, m4a, mov</Text>
                            <Text style={styles.showVideoOptionsChooseUploadSize}>max 200 MB</Text>
                          </TouchableOpacity>
                          <TouchableOpacity style={styles.showVideoOptionsChooseYouTube} onPress={() => {setSelectYouTube(true); setCreateButtonDisabled(true)}}>
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
                  disabled={createButtonDisabled}
                  titleStyle={styles.newPromptAddButtonTitle}
                  buttonStyle={styles.newPromptAddButton}
                  containerStyle={styles.newPromptAddButtonContainer}
                />
                <View style={styles.newPromptAddButtonSpacer}></View>
              </View>

            </View>
          </>)}

          {showAddingSurveyPrompt && (<>
            <View style={styles.newPromptContainer}>
              <View style={styles.newPromptHeader}>
                <Icon
                  name='chevron-back'
                  type='ionicon'
                  size={25}
                  color={colors.mainTextColor}
                  onPress={returnToMain}
                />
                <Text style={styles.newPromptDescTitle}>New Survey</Text>
              </View>
              <View style={styles.newPromptBody}>
              </View>
              <View style={styles.newPromptFooter}>
                <Button
                  title='Create Survey'
                  disabled={createButtonDisabled}
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
