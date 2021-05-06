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
import { getTextPrompts, getProgressBar, checkStorage, uploadVideo, createPrompt, deletePrompt } from './API.js'
import { Popup } from 'semantic-ui-react'

export default function Prompts() {
  const linkTo = useLinkTo()
  const [refreshing, setRefreshing] = useState(true)
  const [styles, setStyles] = useState(promptsLight)
  const [colors, setColors] = useState(colorsLight)
  const [coach, setCoach] = useState({})

  // Main stage controls.
  const [paymentsDisabled, setPaymentsDisabled] = useState(true)
  const [contractsDisabled, setContractsDisabled] = useState(true)
  const [showActivityIndicator, setActivityIndicator] = useState(true)
  const [showMain, setMain] = useState(false)
  // Text Prompt main stage controls.
  const [deletePromptIndex, setDeletePromptIndex] = useState(-1)
  const [showPromptOptions, setShowPromptOptions] = useState(-1)

  // Text Prompts stage controls.
  const [showAddingTextPrompt, setAddingTextPrompt] = useState(false)
  const [videoSelected, setVideoSelected] = useState(false)
  const [showVideoOptions, setVideoOptions] = useState(false)
  const [showSelectYouTube, setSelectYouTube] = useState(false)
  const [showSelectUpload, setSelectUpload] = useState(false)
  const [videoError, setVideoError] = useState('')
  const [videoActivityIndicator, setVideoActivityIndicator] = useState(false)
  const [createButtonDisabled, setCreateButtonDisabled] = useState(false)
  const [createButtonActivityIndicator, setCreateButtonActivityIndicator] = useState(false)
  // Text Prompts data to upload.
  const [textPromptTitle, setTextPromptTitle] = useState('')
  const [promptType, setPromptType] = useState(0)
  const [textPromptText, setTextPromptText] = useState('')
  const [videoUrl, setVideoUrl] = useState('')
  const [videoType, setVideoType] = useState(-1) // 0 - YT, 1 - Upload
  // Text Prompts builder data
  const [tempVideoUrl, setTempVideoUrl] = useState('')
  const [tempVideoFile, setTempVideoFile] = useState('')

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

  // Main page view screens and controls.
  const [showViewTextPrompt, setViewTextPrompt] = useState(false)
  const [viewPrompt, setViewPrompt] = useState({})
  const [viewPromptResponses, setViewPromptResponses] = useState([])

  // Get existing Text Prompts, Surveys, Payments, and Contracts.
  const refreshTextPrompts = async (id, token) => {
    var refresh = await getTextPrompts(id, token)
    setPrompts(refresh)
  }

  // Main loader.
  useEffect(() => {
    const sCoach = get('Coach')
    console.log(sCoach)
    if (sCoach != null) {
      setCoach(sCoach)
      try {
        refreshTextPrompts(sCoach.Id, sCoach.Token)
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
  const viewPromptTrigger = (i) => {
    setMain(false)
    setViewPrompt(prompts[i])
    setActivityIndicator(true)
    setTimeout(() => {
      setActivityIndicator(false)
      setViewTextPrompt(true)
    },500)
  }

  const returnToMainfromViewTextPrompt = (i) => {
    setViewTextPrompt(false)
    setViewPrompt({})
    setActivityIndicator(true)
    setTimeout(() => {
      setActivityIndicator(false)
      setMain(true)
    },500)
  }

  const addPrompt = () => {
    setMain(false)
    setActivityIndicator(true)
    setTimeout(() => {
      setActivityIndicator(false)
      setAddingTextPrompt(true)
    },500)
  }

  const returnToMainFromTextPrompt = () => {
    setVideoUrl('')
    setTempVideoUrl('')
    setTextPromptText('')
    setTextPromptTitle('')
    setSelectYouTube(false)
    setSelectUpload(false)
    setAddingSurveyPrompt(false)
    setAddingTextPrompt(false)
    setActivityIndicator(true)
    setTimeout(() => {
      setActivityIndicator(false)
      setMain(true)
    },500)
  }

  const deletePromptTrigger = async (i) => {
    console.log('Deleting prompt:',prompts[i])
    var deleted = await deletePrompt(prompts[i].Id, coach.Id, coach.Token)
    if (deleted) {
      setDeletePromptIndex(-1)
      setShowPromptOptions(-1)
      refreshTextPrompts(coach.Id, coach.Token)
    }
  }

  const duplicatePrompt = async (i) => {
    var p = prompts[i]
    console.log('Duplicating prompt:',p)
    setMain(false)
    setDeletePromptIndex(-1)
    setShowPromptOptions(-1)
    // Set prompt data.
    setTextPromptTitle(p.Title)
    setTextPromptText(p.Text)
    if (p.PromptType != 0) {

      if (p.PromptType == 3) {
        setSelectYouTube(true)
        setTempVideoUrl(p.Video)
        setVideoUrl(p.Video)
      } else if (p.PromptType == 4) {
        setSelectUpload(true)
        setTempVideoUrl(p.Video)
        setVideoUrl(p.Video)
      }
    }
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
    setTempVideoUrl('')
    setCreateButtonDisabled(true)
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

  const getYouTubeID = (url) => {
    var r, x = /^.*(?:(?:youtu\.be\/|v\/|vi\/|u\/\w\/|embed\/)|(?:(?:watch)?\?v(?:i)?=|\&v(?:i)?=))([^#\&\?]*).*/
    return url.match(x)
  }

  const onYTVideoUrl = (text) => {
    setVideoUrl(text)
    var yt = getYouTubeID(text)
    if (!yt) {
      setTempVideoUrl('')
      setVideoError('Invalid YouTube URL!')
    } else {
      setVideoError('')
      setCreateButtonDisabled(false)
      setTempVideoUrl(text)
      var genUrl = 'https://youtube.com/embed/' + yt[1]
      console.log(genUrl)
      setVideoUrl(genUrl)
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

  const handleFile = async () => {

    var file = event.target.files[0]
    if (file !== undefined) {
      var fileArr = file.name.split('.')
      var fileOptions = ['mov','mp4','m4a']
      var fileType = fileArr[1]
      if (fileOptions.includes(fileType)) {
        if (file.size <= 200000000) {
          setVideoActivityIndicator(false)
          setCreateButtonDisabled(false)
          var url = URL.createObjectURL(file)
          setTempVideoUrl(url)
          setTempVideoFile(file)
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

  const getAttachment = async () => {
    var file = tempVideoFile
    var ret = false
    if (file != '') {
      console.log('Uploading attachment...')
      var fileArr = file.name.split('.')
      var fileOptions = ['mov','mp4','m4a']
      var fileType = fileArr[1]
      var fileMime = 'video/mp4'
      if (fileType == 'mov') {
        fileMime = 'video/quicktime'
      }
      var ts = Math.floor(Math.random() * (999999999999+1) + 1);
      ts = ts.toString();
      var fileName = `${coach.Id}_${coach.Token}_${ts}.${fileType}`
      var newFile = new File([file], fileName, {type: fileMime})
      console.log('file:',newFile)
      var url = await uploadVideo(newFile) + '/videos/' + fileName
      console.log('url:',url)
      return url
    } else if (videoUrl !== '') {
      console.log('videoUrl Video attached.')
      return videoUrl
    } else {
      console.log('No uploaded needed!')
      return ''
    }
  }

  const submitPrompt = async () => {
    setCreateButtonDisabled(true)
    setCreateButtonActivityIndicator(true)
    console.log('Creating prompt...')
    var fileUploaded = await getAttachment()
    var promptType = 0
    if (videoType == 0) {
      promptType = 3
    } else if (videoType == 1) {
      promptType = 4
    }
    var created = await createPrompt(coach.Token, coach.Id, textPromptTitle, promptType, textPromptText, fileUploaded)
    if (created) {
      refreshTextPrompts(coach.Id, coach.Token)
      setTempVideoUrl('')
      setCreateButtonActivityIndicator(false)
      setAddingTextPrompt(false)
      setActivityIndicator(true)
      setTimeout(() => {
        setActivityIndicator(false)
        setMain(true)
      },500)
    } else {
      console.log('Error creating prompt.')
    }
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
                <Text style={styles.promptHeaderCount}>{prompts.length} total</Text>
              </View>
              <View style={styles.promptsRow}>
                <View style={styles.addPromptContainer}>
                  <Button
                  title='Add Text Prompt'
                  titleStyle={styles.promptAddButtonTitle}
                  buttonStyle={styles.promptAddButton}
                  containerStyle={styles.promptAddButtonContainer}
                  onPress={addPrompt} />
                </View>
                {prompts.length > 0 && (<ScrollView horizontal={true} contentContainerStyle={styles.innerRow}>
                  {prompts.map((prompt, index) => {
                    var promptIcon = 'create'
                    if (prompt.PromptType !== 0) {
                      promptIcon = 'videocam'
                    }
                    var name = prompt.Title
                    if (name.length > 13) {
                      name = name.slice(0,13) + '...'
                    }
                    var text = prompt.Text
                    if (text.length > 80) {
                      text = text.slice(0,80) + '...'
                    }
                    return (<View style={styles.taskBox} key={index}>
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
                          <Text style={styles.taskPreviewTitle}>{name}</Text>
                        </View>
                        {deletePromptIndex == index && (<><Text style={styles.taskWarningText}>This Task and all responses will be lost forever. Are you sure you want to continue?</Text></>) || (<><Text style={styles.taskPreviewText}>{text}</Text></>)}
                      </View>
                      {deletePromptIndex == index && (<><View style={styles.taskButtons}><TouchableOpacity style={[styles.taskButtonLeft,{backgroundColor:btnColors.danger}]} onPress={() => deletePromptTrigger(index)}>
                        <Text style={styles.taskButtonText}>Confirm</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={[styles.taskButtonRight,{backgroundColor:colors.header}]} onPress={() => setDeletePromptIndex(-1)}>
                        <Text style={[styles.taskButtonText,{color:colors.mainTextColor}]}>Cancel</Text>
                      </TouchableOpacity></View></>)
                      || (<>
                        {showPromptOptions == index &&
                          (<>
                            <TouchableOpacity style={styles.taskButtonTop} onPress={() => setShowPromptOptions(-1)}>
                              <Text style={[styles.taskButtonText,{color:colors.mainTextColor}]}>Go Back</Text>
                            </TouchableOpacity>
                            <View style={styles.taskButtons}><TouchableOpacity style={styles.taskButtonLeft} onPress={() => duplicatePrompt(index)}>
                            <Text style={styles.taskButtonText}>Duplicate</Text>
                          </TouchableOpacity>
                          <TouchableOpacity style={styles.taskButtonRight} onPress={() => setDeletePromptIndex(index)}>
                            <Text style={styles.taskButtonText}>Delete</Text>
                          </TouchableOpacity></View></>)
                          ||
                          (<><View style={styles.taskButtons}><TouchableOpacity style={styles.taskButtonLeft} onPress={() => setShowPromptOptions(index)}>
                            <Text style={styles.taskButtonText}>Edit</Text>
                          </TouchableOpacity>
                          <TouchableOpacity style={[styles.taskButtonRight,{backgroundColor:colors.header}]} onPress={() => viewPromptTrigger(index)}>
                            <Text style={[styles.taskButtonText,{color:colors.mainTextColor}]}>View</Text>
                          </TouchableOpacity>
                        </View></>)}
                      </>)}
                    </View>)
                  })}
                </ScrollView>) || (<View style={styles.helpBox}>
                  <Text style={styles.helpBoxText}>Text prompts with optional video.{"\n"}Assign directly to Clients or include in a Program.</Text>
                </View>)}
              </View>
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

          {showViewTextPrompt && (<>
            <View style={styles.newPromptContainer}>
              <View style={styles.newPromptHeader}>
                <Icon
                  name='chevron-back'
                  type='ionicon'
                  size={25}
                  color={colors.mainTextColor}
                  onPress={returnToMainfromViewTextPrompt}
                />
                <Text style={styles.newPromptDescTitle}>{viewPrompt.Title}</Text>
              </View>
              <View style={styles.newPromptBody}>
                <View style={styles.newPromptBodyLeft}>
                  <Text style={[styles.newPromptTitleLabel,{fontSize:20}]}>Body Text</Text>
                  <Text style={styles.viewPromptBodyText}>{viewPrompt.Text}</Text>
                </View>
                {viewPrompt.Video != '' && (<View style={[styles.reactPlayerContainer]}>
                  <ReactPlayer controls={true} url={viewPrompt.Video} width={'100%'} height={'100%'} />
                </View>)}
              </View>
              <View style={styles.viewPromptResponses}>
                <View style={styles.newPromptHeader}>
                  <Text style={styles.newPromptDescTitle}>{viewPromptResponses.length} Client Responses</Text>
                </View>
                {viewPromptResponses.length > 0 && (<>

                </>) || (<>
                  <Text style={styles.noPromptResponses}>No clients have responded to this prompt yet.</Text>
                </>)}
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
                  onPress={returnToMainFromTextPrompt}
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
                {showSelectYouTube && (<>
                  {tempVideoUrl !== '' && (<>
                    <View style={[styles.reactPlayerContainer]}>
                      <ReactPlayer controls={true} url={tempVideoUrl} width={'100%'} height={'100%'} />
                    </View>
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
                    {tempVideoUrl == '' && (<>
                      <Text style={styles.uploadProgressTitle}>Upload Storage Used</Text>
                      {getProgressBar(coach.Plan, coach.Storage, colors, btnColors)}
                      <Button
                      title='Choose Video'
                      titleStyle={styles.uploadFileTitle}
                      buttonStyle={styles.uploadFileTitleButton}
                      containerStyle={styles.uploadFileTitleButtonContainer}
                      onPress={handleClick}
                      disabled={checkStorage(coach.Plan, coach.Storage)}
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
                    {tempVideoUrl !== '' && (<>
                      <View style={styles.reactPlayerContainer}>
                        <ReactPlayer controls={true} url={tempVideoUrl} width={'100%'} height={'100%'} />
                      </View>
                      <Text style={{marginTop:10}}>{tempVideoFile.name}</Text>
                      <View style={{flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
                        <Button
                          title='Choose Another Video'
                          titleStyle={styles.uploadFileTitle}
                          buttonStyle={[styles.uploadFileTitleButton,{backgroundColor:btnColors.danger}]}
                          containerStyle={styles.uploadFileTitleButtonContainer}
                          onPress={() => {setTempVideoUrl(''); setCreateButtonDisabled(true)}}
                        />
                      </View>
                    </>)}
                  </View>)
                  ||
                  (<>{showVideoOptions &&
                    (<View style={styles.showVideoOptions}>
                      <TouchableOpacity style={styles.showVideoOptionsChooseUpload} onPress={() => selectVideoType(1)}>
                        <Text style={styles.showVideoOptionsChooseUploadTitle}>Upload Video</Text>
                        <Text style={styles.showVideoOptionsChooseUploadTypes}>mp4, m4a, mov</Text>
                        <Text style={styles.showVideoOptionsChooseUploadSize}>max 200 MB</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.showVideoOptionsChooseYouTube} onPress={() => selectVideoType(0)}>
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
                </View>
              </View>

              <View style={styles.newPromptFooter}>
                {(textPromptTitle.length == 0 || textPromptText.length == 0) && (<Popup
                  position='top center'
                  content='All fields need to be filled out first!' trigger={<Button
                  title='Create Prompt'
                  disabled={true}
                  titleStyle={styles.newPromptAddButtonTitle}
                  buttonStyle={styles.newPromptAddButton}
                  containerStyle={styles.newPromptAddButtonContainer}
                />}/>) || (<Button
                  title='Create Prompt'
                  titleStyle={styles.newPromptAddButtonTitle}
                  buttonStyle={styles.newPromptAddButton}
                  containerStyle={styles.newPromptAddButtonContainer}
                  onPress={submitPrompt}
                  disabled={createButtonDisabled}
                />)}
                {createButtonActivityIndicator && (<View style={[styles.newPromptAddButtonContainer,{marginTop:10}]}><ActivityIndicatorView /></View>)}
                <View style={[styles.newPromptAddButtonSpacer]}></View>
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
                  onPress={returnToMainFromTextPrompt}
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
