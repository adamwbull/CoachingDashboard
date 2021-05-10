import { StatusBar } from 'expo-status-bar'
import React, { useEffect, useRef, useState } from 'react'
import { Pressable, TouchableOpacity, ScrollView, StyleSheet, Text, View } from 'react-native'
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
import { getSurveys, createMeasurementSurvey, createSurveyItem, getTextPrompts, getProgressBar, checkStorage, uploadVideo, createPrompt, deletePrompt } from './API.js'
import { Popup, Dropdown } from 'semantic-ui-react'
import JoditEditor from "jodit-react";

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
  const [scrollToEnd, setScrollToEnd] = useState(false)

  // Text Prompt main stage controls.
  const [deletePromptIndex, setDeletePromptIndex] = useState(-1)
  const [showPromptOptions, setShowPromptOptions] = useState(-1)

  // Survey main stage controls.
  const [deleteSurveyIndex, setDeleteSurveyIndex] = useState(-1)
  const [showSurveyOptions, setShowSurveyOptions] = useState(-1)

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
  const [surveyItemsDropdown, setSurveyItemsDropdown] = useState(false)
  const [currentSurveyItem, setCurrentSurveyItem] = useState(0)
  const [chosenTask, setChosenTask] = useState({})
  const [showAddSurveyItemIndicator, setAddSurveyItemIndicator] = useState(false)
  const [showSurveyItemMain, setSurveyItemMain] = useState(false)
  const minRangeValues = [
    { key:1, text:'1', value:1 },
    { key:0, text:'0', value:0 }
  ]
  const maxRangeValues = [
    { key:10, text:'10', value:10 },
    { key:9, text:'9', value:9 },
    { key:8, text:'8', value:8 },
    { key:7, text:'7', value:7 },
    { key:6, text:'6', value:6 },
    { key:5, text:'5', value:5 },
    { key:4, text:'4', value:4 },
    { key:3, text:'3', value:3 },
    { key:2, text:'2', value:2 },
  ]
  const editor = useRef(null)
  const editorConfig = {
		readonly: false, // all options from https://xdsoft.net/jodit/doc/
    cleanHTML: true,
    limitChars:3000,
    askBeforePasteHTML:false
	}
  const [editorState, setEditorState] = useState('<p>Create your <strong>awesome content</strong> here! 😁</p>')

  // Survey Prompts data to upload.
  const [surveyTitle, setSurveyTitle] = useState('')
  const [surveyText, setSurveyText] = useState('')
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

  const refreshSurveys = async (id, token) => {
    var refresh = await getSurveys(id, token)
    setSurveys(refresh)
  }

  // Main loader.
  useEffect(() => {
    const sCoach = get('Coach')
    if (sCoach != null) {
      setCoach(sCoach)
      try {
        refreshTextPrompts(sCoach.Id, sCoach.Token)
        refreshSurveys(sCoach.Id, sCoach.Token)
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

  const returnToMainFromViewTextPrompt = () => {
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
    setScrollToEnd(true)
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
      setScrollToEnd(false)
      setActivityIndicator(false)
      setMain(true)
    },500)
  }

  const deletePromptTrigger = async (i) => {
    var deleted = await deletePrompt(prompts[i].Id, coach.Id, coach.Token)
    if (deleted) {
      setDeletePromptIndex(-1)
      setShowPromptOptions(-1)
      refreshTextPrompts(coach.Id, coach.Token)
    }
  }

  const duplicatePrompt = async (i) => {
    var p = prompts[i]
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
      var url = await uploadVideo(newFile) + '/videos/' + fileName
      return url
    } else if (videoUrl !== '') {
      return videoUrl
    } else {
      return ''
    }
  }

  const submitPrompt = async () => {
    setCreateButtonDisabled(true)
    setCreateButtonActivityIndicator(true)
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
        setScrollToEnd(false)
        setActivityIndicator(false)
        setMain(true)
      },500)
    } else {
      console.log('Error creating prompt.')
    }
  }

  // Survey controls.
  const addSurvey = () => {
    setMain(false)
    setActivityIndicator(true)
    setTimeout(() => {
      setScrollToEnd(true)
      setActivityIndicator(false)
      setAddingSurveyPrompt(true)
    },500)
  }

  const toggleSurveyItemsDropdown = () => {
    if (surveyItemsDropdown) {
      setSurveyItemsDropdown(false)
    } else {
      setSurveyItemsDropdown(true)
      window.addEventListener('click', closeSurveyDropdown)
    }
  }

  const closeSurveyDropdown = () => {
    setSurveyItemsDropdown(false)
    window.removeEventListener('click', closeSurveyDropdown)
  }

  const addTask = (type) => {
    closeSurveyDropdown()
    var title = ''
    switch (type) {
      case 0:
        title = 'Unused Input'
      break
      case 1:
        title = 'Unused Slider'
      break
      case 2:
        title = 'Unused Checkbox Group'
      break
      case 3:
        title = 'Unused Radiobox Group'
      break
      case 4:
        title = 'Unused RichText'
      break
      default:
        title = 'Unused Input'
      break
    }
    setCurrentSurveyItem(surveyItems.length)
    var newTask = {
      Type:type,
      TaskId:0,
      Title:title,
      Question:'',
      SliderRange:'1,10',
      SliderLeft:'',
      SliderRight:'',
      BoxOptionsArray:'',
      RichText:''
    }
    var list = surveyItems
    list.push(newTask)
    setSurveyItems(list)
    setAddSurveyItemIndicator(true)
    setChosenTask(newTask)
    setTimeout(() => {
      setSurveyItemMain(true)
      setAddSurveyItemIndicator(false)
    }, 800)

  }

  const moveTaskUp = (index, l) => {
    var list = l
    var newList = JSON.parse(JSON.stringify(list))
    newList[index] = list[index-1]
    newList[index-1] = list[index]
    if (currentSurveyItem == index) {
      setCurrentSurveyItem(index-1)
    } else if (currentSurveyItem == index-1) {
      setCurrentSurveyItem(index)
    }
    setSurveyItems(newList)
  }

  const moveTaskDown = (index, l) => {
    var list = l
    var newList = JSON.parse(JSON.stringify(list))
    newList[index] = list[index+1]
    newList[index+1] = list[index]
    if (currentSurveyItem == index) {
      setCurrentSurveyItem(index+1)
    } else if (currentSurveyItem == index+1) {
      setCurrentSurveyItem(index)
    }
    setSurveyItems(newList)
  }

  const selectTask = (index, type) => {
    setCurrentSurveyItem(index)
    var id = surveyItems[index].TaskId
    if (id == 0) {
      setChosenTask({})
    } else {
      var task = searchHardlist.filter(task => task.Id === id)
      setChosenTask(task[0])
    }
  }

  const deleteTask = () => {
    var list = JSON.parse(JSON.stringify(surveyItems))
    if (list.length == 1) {
      setSurveyItemMain(false)
      setCurrentSurveyItem(0)
    }
    list.splice(currentSurveyItem, 1)
    setSurveyItems(list)
    if (currentSurveyItem == 0) {
      setCurrentSurveyItem(0)
    } else {
      setCurrentSurveyItem(currentSurveyItem-1)
    }
  }

  const updateQuestion = (text) => {
    var list = JSON.parse(JSON.stringify(surveyItems))
    list[currentSurveyItem].Question = text
    var title = ''
    switch (list[currentSurveyItem].Type) {
      case 0:
        title = 'Input'
      break
      case 1:
        title = 'Slider'
      break
      case 2:
        title = 'Checkbox Group'
      break
      case 3:
        title = 'Radiobox Group'
      break
      case 4:
        title = 'RichText'
      break
      default:
        title = 'Unused Input'
      break
    }
    list[currentSurveyItem].Title = title
    setSurveyItems(list)
  }

  const handleSliderDropdown = (type, e, d) => {
    var list = JSON.parse(JSON.stringify(surveyItems))
    var rangeText = list[currentSurveyItem].SliderRange
    var range = rangeText.split(',')
    range[type] = d.value
    list[currentSurveyItem].SliderRange = range.toString()
    setSurveyItems(list)
  }

  const updateSliderLabel = (type, text) => {
    var list = JSON.parse(JSON.stringify(surveyItems))
    if (type == 0) {
      list[currentSurveyItem].SliderLeft = text
    } else if (type == 1) {
      list[currentSurveyItem].SliderRight = text
    }
    setSurveyItems(list)
  }

  const addBox = () => {
    var newSurveyItems = JSON.parse(JSON.stringify(surveyItems))
    var cur = newSurveyItems[currentSurveyItem].BoxOptionsArray
    newSurveyItems[currentSurveyItem].BoxOptionsArray = cur + ','
    setSurveyItems(newSurveyItems)
  }

  const removeBox = (i) => {
    var newSurveyItems = JSON.parse(JSON.stringify(surveyItems))
    var cur = newSurveyItems[currentSurveyItem].BoxOptionsArray
    var arr = cur.split(',')
    arr.splice(i, i+1)
    newSurveyItems[currentSurveyItem].BoxOptionsArray = arr.toString()
    setSurveyItems(newSurveyItems)
  }

  const moveBoxUp = (index) => {
    var newSurveyItems = JSON.parse(JSON.stringify(surveyItems))
    var list = newSurveyItems[currentSurveyItem].BoxOptionsArray.split(',')
    var newList = JSON.parse(JSON.stringify(list))
    newList[index] = list[index-1]
    newList[index-1] = list[index]
    newSurveyItems[currentSurveyItem].BoxOptionsArray = newList.toString()
    setSurveyItems(newSurveyItems)
  }

  const moveBoxDown = (index) => {
    var newSurveyItems = JSON.parse(JSON.stringify(surveyItems))
    var list = newSurveyItems[currentSurveyItem].BoxOptionsArray.split(',')
    var newList = JSON.parse(JSON.stringify(list))
    newList[index] = list[index+1]
    newList[index+1] = list[index]
    newSurveyItems[currentSurveyItem].BoxOptionsArray = newList.toString()
    setSurveyItems(newSurveyItems)
  }

  const updateBoxQuestion = (text, index) => {
    var newSurveyItems = JSON.parse(JSON.stringify(surveyItems))
    var list = newSurveyItems[currentSurveyItem].BoxOptionsArray.split(',')
    list[index] = text
    newSurveyItems[currentSurveyItem].BoxOptionsArray = list.toString()
    setSurveyItems(newSurveyItems)
  }

  const onRichText = (editorState) => {
    setEditorState(editorState)
    var newSurveyItems = JSON.parse(JSON.stringify(surveyItems))
    newSurveyItems[currentSurveyItem].RichText = editorState
    setSurveyItems(newSurveyItems)
  }

  const submitSurvey = async () => {
    var createdSurveyId = await createMeasurementSurvey(coach.Id, coach.Token, surveyTitle, surveyText)
    var i = 0
    if (createdSurveyId != false) {
      while(i < surveyItems.length) {
        var item = surveyItems[i]
        var createdSurveyItem = await createSurveyItem(coach.Token, createdSurveyId, item.Type, item.Question, item.RichText, item.SliderRange, item.SliderLeft, item.SliderRight, item.BoxOptionsArray, i)
        if (createdSurveyItem) {
          i++
        }
      }
    }
    if (createdSurveyId) {
      refreshSurveys(coach.Id, coach.Token)
      setCreateButtonActivityIndicator(true)
      setAddingSurveyPrompt(false)
      setActivityIndicator(true)
      setChosenTask({})
      setCurrentSurveyItem(0)
      setSurveyItemMain(false)
      setSurveyTitle('')
      setSurveyText('')
      setSurveyItems([])
      setTimeout(() => {
        setScrollToEnd(false)
        setActivityIndicator(false)
        setMain(true)
      },500)
    } else {
    }
  }

  const viewSurveyTrigger = (i) => {
    setMain(false)
    setViewPrompt(prompts[i])
    setActivityIndicator(true)
    setTimeout(() => {
      setActivityIndicator(false)
      setViewTextPrompt(true)
    },500)
  }

  const returnToMainFromViewSurvey = () => {
    setAddingSurveyPrompt(false)
    setActivityIndicator(true)
    setChosenTask({})
    setCurrentSurveyItem(0)
    setSurveyItemMain(false)
    setSurveyTitle('')
    setSurveyText('')
    setSurveyItems([])
    setTimeout(() => {
      setActivityIndicator(false)
      setMain(true)
    },500)
  }

  const duplicateSurvey = async (i) => {
    var p = prompts[i]
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

  const deleteSurveyTrigger = async (i) => {
    var deleted = await deletePrompt(prompts[i].Id, coach.Id, coach.Token)
    if (deleted) {
      setDeletePromptIndex(-1)
      setShowPromptOptions(-1)
      refreshTextPrompts(coach.Id, coach.Token)
    }
  }


  // Payment controls.
  const addPayment = () => {
    console.log ('Add new payment...')
  }

  // Contract controls.
  const addContract = () => {
    console.log ('Add new contract...')
  }

  return (<ScrollView contentContainerStyle={styles.scrollView} scrollToEnd={scrollToEnd}>
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
                {surveys.length > 0 && (<ScrollView horizontal={true} contentContainerStyle={styles.innerRow}>
                  {surveys.map((survey, index) => {
                    var promptIcon = 'clipboard-outline'
                    var name = survey.Title
                    if (name.length > 13) {
                      name = name.slice(0,13) + '...'
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
                          <Text style={styles.taskPreviewTitle}>{name}</Text>
                        </View>
                        {deleteSurveyIndex == index && (<><Text style={styles.taskWarningText}>This Task and all responses will be lost forever. Are you sure you want to continue?</Text></>) || (<><Text style={styles.taskPreviewText}>{text}</Text></>)}
                      </View>
                      {deleteSurveyIndex == index && (<><View style={styles.taskButtons}><TouchableOpacity style={[styles.taskButtonLeft,{backgroundColor:btnColors.danger}]} onPress={() => deleteSurveyTrigger(index)}>
                        <Text style={styles.taskButtonText}>Confirm</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={[styles.taskButtonRight,{backgroundColor:colors.header}]} onPress={() => setDeleteSurveyIndex(-1)}>
                        <Text style={[styles.taskButtonText,{color:colors.mainTextColor}]}>Cancel</Text>
                      </TouchableOpacity></View></>)
                      || (<>
                        {showSurveyOptions == index &&
                          (<>
                            <TouchableOpacity style={styles.taskButtonTop} onPress={() => setShowSurveyOptions(-1)}>
                              <Text style={[styles.taskButtonText,{color:colors.mainTextColor}]}>Go Back</Text>
                            </TouchableOpacity>
                            <View style={styles.taskButtons}><TouchableOpacity style={styles.taskButtonLeft} onPress={() => duplicateSurvey(index)}>
                            <Text style={styles.taskButtonText}>Duplicate</Text>
                          </TouchableOpacity>
                          <TouchableOpacity style={styles.taskButtonRight} onPress={() => setDeleteSurveyIndex(index)}>
                            <Text style={styles.taskButtonText}>Delete</Text>
                          </TouchableOpacity></View></>)
                          ||
                          (<><View style={styles.taskButtons}><TouchableOpacity style={styles.taskButtonLeft} onPress={() => setShowSurveyOptions(index)}>
                            <Text style={styles.taskButtonText}>Edit</Text>
                          </TouchableOpacity>
                          <TouchableOpacity style={[styles.taskButtonRight,{backgroundColor:colors.header}]} onPress={() => viewSurveyTrigger(index)}>
                            <Text style={[styles.taskButtonText,{color:colors.mainTextColor}]}>View</Text>
                          </TouchableOpacity>
                        </View></>)}
                      </>)}
                    </View>)
                  })}
                </ScrollView>) || (<View style={styles.helpBox}>
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
                  onPress={returnToMainFromViewTextPrompt}
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
                  onPress={returnToMainFromViewSurvey}
                />
                <Text style={styles.newPromptDescTitle}>New Survey</Text>
              </View>
              <View style={styles.newPromptBody}>
                <View style={styles.newPromptForm}>
                  <Text style={styles.newPromptTitleLabel}>Title</Text>
                  <TextInput
                    style={styles.inputStyle}
                    value={surveyTitle}
                    placeholder='ex. Measurement Survey'
                    onChangeText={(text) => setSurveyTitle(text)}
                  />
                  <Text style={styles.newPromptTitleLabel}>Description</Text>
                  <TextInput
                    style={styles.inputStyle}
                    value={surveyText}
                    placeholder='ex. This survey helps establish a baseline to refer back to later.'
                    onChangeText={(text) => setSurveyText(text)}
                    multiline={true}
                    numberOfLines={4}
                  />
                </View>
              </View>
              <View style={styles.newPromptHeader}>
                <Text style={styles.newPromptDescTitle}>Survey Items</Text>
              </View>

              <View style={styles.addSurveyBody}>
                <View style={styles.addSurveyListContainer}>
                  <Button
                    title='Add Task'
                    onPress={toggleSurveyItemsDropdown}
                    buttonStyle={[styles.addSurveyListButton,{backgroundColor:btnColors.success}]}
                    containerStyle={styles.addSurveyListButtonContainer}
                  />
                  <View contentContainerStyle={styles.addSurveyList}>
                  {surveyItems.map((item, index) => {
                    const isCurrent = (index == currentSurveyItem) ? {borderBottomColor:btnColors.info,borderTopColor:btnColors.info} : {}
                    var icon = ''
                    switch (item.Type) {
                      case 0:
                        icon = 'create'
                      break
                      case 1:
                        icon = 'options'
                      break
                      case 2:
                        icon = 'checkbox'
                      break
                      case 3:
                        icon = 'radio-button-on'
                      break
                      case 4:
                        icon = 'text'
                      break
                      default:
                        icon = 'create'
                      break
                    }
                    var itemQuestion = item.Question
                    if (itemQuestion.length > 50) {
                      itemQuestion = itemQuestion.slice(0,50) + '...'
                    }
                    return (<View style={[styles.programTask,isCurrent]} key={index}>
                      <Pressable style={styles.programTaskMain} onPress={() => selectTask(index, item.Type)}>
                        <Icon
                          name={icon}
                          type='ionicon'
                          size={26}
                          style={styles.programTaskIcon}
                          color={colors.mainTextColor}
                        />
                        <View>
                          <Text style={styles.programTaskTitle}>{item.Title}</Text>
                          <Text style={styles.surveyTaskQuestion}>{itemQuestion}</Text>
                        </View>
                      </Pressable>
                      <View style={styles.programTaskNav}>
                        <Icon
                          name='chevron-up'
                          type='ionicon'
                          size={25}
                          color={(index == 0) ? colors.mainBackground : colors.mainTextColor}
                          onPress={() => moveTaskUp(index, surveyItems)}
                          disabledStyle={{backgroundColor:colors.mainBackground}}
                          disabled={(index == 0) ? true : false}
                        />
                        <Icon
                          name='chevron-down'
                          type='ionicon'
                          size={25}
                          color={(index == surveyItems.length-1) ? colors.mainBackground : colors.mainTextColor}
                          onPress={() => moveTaskDown(index, surveyItems)}
                          disabledStyle={{backgroundColor:colors.mainBackground}}
                          disabled={(index == surveyItems.length-1) ? true : false}
                        />
                      </View>
                    </View>)
                  })}
                  </View>
                  {surveyItemsDropdown && (<View style={styles.addSurveyListDropdown}>

                    <Pressable style={[styles.addSurveyListDropdownTouch]} onPress={() => addTask(0)}>
                      <Text style={styles.addSurveyListDropdownText}>Add Input</Text>
                    </Pressable>

                    <Pressable style={[styles.addSurveyListDropdownTouch]} onPress={() => addTask(1)}>
                      <Text style={styles.addSurveyListDropdownText}>Add Slider</Text>
                    </Pressable>

                    <Pressable style={[styles.addSurveyListDropdownTouch]} onPress={() => addTask(2)}>
                      <Text style={styles.addSurveyListDropdownText}>Add Checkbox Group</Text>
                    </Pressable>

                    <Pressable style={[styles.addSurveyListDropdownTouch]} onPress={() => addTask(3)}>
                      <Text style={styles.addSurveyListDropdownText}>Add Radiobox Group</Text>
                    </Pressable>

                    <Pressable style={[styles.addSurveyListDropdownTouchBottom]} onPress={() => addTask(4)}>
                      <Text style={styles.addSurveyListDropdownText}>Add Rich Text</Text>
                    </Pressable>

                  </View>)}
                </View>
                <View style={styles.addSurveyMainContainer}>
                  {showAddSurveyItemIndicator && (<ActivityIndicatorView />)
                  || (<>
                    {showSurveyItemMain &&
                    (<View style={styles.addSurveyMain}>
                      <View style={styles.addSurveyMainHeader}>
                        <View style={styles.addSurveyMainHeaderLeft}>
                          <Text style={styles.addSurveyMainHeaderTaskText}>Item #{currentSurveyItem+1}</Text>
                          <Text style={styles.addSurveyMainHeaderTitle}>{surveyItems[currentSurveyItem].Title}</Text>
                        </View>
                        <Pressable style={styles.addSurveyMainHeaderRight} onPress={() => deleteTask()}>
                          <Text style={styles.addSurveyMainHeaderDelete}>Delete</Text>
                        </Pressable>
                      </View>
                      <View style={styles.addSurveyMainBody}>
                        {surveyItems[currentSurveyItem].Type == 0 && (<>
                          <Text style={styles.newPromptTitleLabel}>Question</Text>
                          <TextInput
                            style={styles.inputStyle}
                            value={surveyItems[currentSurveyItem].Question}
                            placeholder='ex. How would you define success?'
                            onChangeText={(text) => updateQuestion(text)}
                          />
                        </>)}
                        {surveyItems[currentSurveyItem].Type == 1 && (<>
                          <Text style={styles.newPromptTitleLabel}>Question</Text>
                          <TextInput
                            style={styles.inputStyle}
                            value={surveyItems[currentSurveyItem].Question}
                            placeholder='ex. How comfortable are you with public speaking?'
                            onChangeText={(text) => updateQuestion(text)}
                          />
                          <View style={styles.inputSliderInfo}>
                            <View style={styles.inputSliderInfoRange}>
                              <View style={styles.dropdownContainer}>
                                <Dropdown upward={true} text={surveyItems[currentSurveyItem].SliderRange.split(',')[0]} options={minRangeValues} onChange={(e, d) => handleSliderDropdown(0, e, d)}/>
                              </View>
                              <Text style={styles.inputSliderInfoRangeSpacer}>to</Text>
                              <View style={styles.dropdownContainer}>
                                <Dropdown upward={true} text={surveyItems[currentSurveyItem].SliderRange.split(',')[1]} options={maxRangeValues} onChange={(e, d) => handleSliderDropdown(1, e, d)}/>
                              </View>
                            </View>
                            <View style={styles.inputSliderTextContainer}>
                              <Text style={styles.inputSliderNumDisplay}>{surveyItems[currentSurveyItem].SliderRange.split(',')[0]}</Text>
                              <View>
                                <Text style={styles.inputSliderTextTitle}>Left Label</Text>
                                <TextInput
                                  style={styles.inputSliderTextLabel}
                                  placeholder='ex. Not at all'
                                  value={surveyItems[currentSurveyItem].SliderLeft}
                                  onChangeText={(text) => updateSliderLabel(0, text)}
                                />
                              </View>
                            </View>
                            <View style={styles.inputSliderTextContainer}>
                              <Text style={styles.inputSliderNumDisplay}>{surveyItems[currentSurveyItem].SliderRange.split(',')[1]}</Text>
                              <View>
                                <Text style={styles.inputSliderTextTitle}>Right Label</Text>
                                <TextInput
                                  style={styles.inputSliderTextLabel}
                                  placeholder='ex. Right at home'
                                  value={surveyItems[currentSurveyItem].SliderRight}
                                  onChangeText={(text) => updateSliderLabel(1, text)}
                                />
                              </View>
                            </View>
                          </View>
                        </>)}
                        {surveyItems[currentSurveyItem].Type == 2 && (<>
                          <Text style={styles.newPromptTitleLabel}>Question</Text>
                          <TextInput
                            style={styles.inputStyle}
                            value={surveyItems[currentSurveyItem].Question}
                            placeholder='ex. What emotions have you felt today? Select all that apply.'
                            onChangeText={(text) => updateQuestion(text)}
                          />
                          <Text style={styles.newPromptTitleLabel}>Options</Text>
                          <View style={styles.surveyBoxes}>
                            {surveyItems[currentSurveyItem].BoxOptionsArray.split(',').map((item, index) => {
                              var curArr = surveyItems[currentSurveyItem].BoxOptionsArray.split(',')
                              return (<View style={styles.boxItem} key={index + '-' + index}>
                                <View style={styles.boxItemNav}>
                                  <Icon
                                    name='chevron-up'
                                    type='ionicon'
                                    size={25}
                                    color={(index == 0) ? colors.mainBackground : colors.mainTextColor}
                                    onPress={() => moveBoxUp(index)}
                                    disabledStyle={{backgroundColor:colors.mainBackground}}
                                    disabled={(index == 0) ? true : false}
                                  />
                                  <Icon
                                    name='chevron-down'
                                    type='ionicon'
                                    size={25}
                                    color={(index == curArr.length-1) ? colors.mainBackground : colors.mainTextColor}
                                    onPress={() => moveBoxDown(index)}
                                    disabledStyle={{backgroundColor:colors.mainBackground}}
                                    disabled={(index == curArr.length-1) ? true : false}
                                  />
                                </View>
                                <Icon
                                  name='square-outline'
                                  type='ionicon'
                                  size={30}
                                  color={colors.mainTextColor}
                                  style={{marginRight:10}}
                                />
                                <TextInput
                                  style={styles.boxItemInput}
                                  value={curArr[index]}
                                  placeholder=''
                                  onChangeText={(text) => updateBoxQuestion(text, index)}
                                />
                                <Icon
                                  name='close'
                                  type='ionicon'
                                  size={25}
                                  color={(curArr.length == 1) ? colors.mainBackground : btnColors.danger}
                                  onPress={() => removeBox(index)}
                                  style={{marginLeft:10}}
                                  disabledStyle={{backgroundColor:colors.mainBackground}}
                                  disabled={(curArr.length == 1) ? true : false}
                                />
                              </View>)
                            })}
                          </View>
                          <Button
                            title='Add Checkbox'
                            titleStyle={styles.newPromptAddButtonTitle}
                            buttonStyle={[styles.newPromptAddButton,{paddingLeft:15,paddingRight:15,paddingTop:5,paddingBottom:5}]}
                            onPress={addBox}
                          />
                        </>)}
                        {surveyItems[currentSurveyItem].Type == 3 && (<>
                          <Text style={styles.newPromptTitleLabel}>Question</Text>
                          <TextInput
                            style={styles.inputStyle}
                            value={surveyItems[currentSurveyItem].Question}
                            placeholder='ex. How often do you want to meet? Choose one.'
                            onChangeText={(text) => updateQuestion(text)}
                          />
                          <Text style={styles.newPromptTitleLabel}>Options</Text>
                          <View style={styles.surveyBoxes}>
                            {surveyItems[currentSurveyItem].BoxOptionsArray.split(',').map((item, index) => {
                              var curArr = surveyItems[currentSurveyItem].BoxOptionsArray.split(',')
                              return (<View style={styles.boxItem} key={index + '-' + index + '-'}>
                                <View style={styles.boxItemNav}>
                                  <Icon
                                    name='chevron-up'
                                    type='ionicon'
                                    size={25}
                                    color={(index == 0) ? colors.mainBackground : colors.mainTextColor}
                                    onPress={() => moveBoxUp(index)}
                                    disabledStyle={{backgroundColor:colors.mainBackground}}
                                    disabled={(index == 0) ? true : false}
                                  />
                                  <Icon
                                    name='chevron-down'
                                    type='ionicon'
                                    size={25}
                                    color={(index == curArr.length-1) ? colors.mainBackground : colors.mainTextColor}
                                    onPress={() => moveBoxDown(index)}
                                    disabledStyle={{backgroundColor:colors.mainBackground}}
                                    disabled={(index == curArr.length-1) ? true : false}
                                  />
                                </View>
                                <Icon
                                  name='radio-button-off-outline'
                                  type='ionicon'
                                  size={30}
                                  color={colors.mainTextColor}
                                  style={{marginRight:10}}
                                />
                                <TextInput
                                  style={styles.boxItemInput}
                                  value={curArr[index]}
                                  placeholder=''
                                  onChangeText={(text) => updateBoxQuestion(text, index)}
                                />
                                <Icon
                                  name='close'
                                  type='ionicon'
                                  size={25}
                                  color={(curArr.length == 1) ? colors.mainBackground : btnColors.danger}
                                  onPress={() => removeBox(index)}
                                  style={{marginLeft:10}}
                                  disabledStyle={{backgroundColor:colors.mainBackground}}
                                  disabled={(curArr.length == 1) ? true : false}
                                />
                              </View>)
                            })}
                          </View>
                          <Button
                            title='Add Radiobox'
                            titleStyle={styles.newPromptAddButtonTitle}
                            buttonStyle={[styles.newPromptAddButton,{paddingLeft:15,paddingRight:15,paddingTop:5,paddingBottom:5}]}
                            onPress={addBox}
                          />
                        </>)}
                        {surveyItems[currentSurveyItem].Type == 4 && (<View style={{width:'100%'}}>
                          <Text style={styles.newPromptTitleLabel}>Section Title</Text>
                          <TextInput
                            style={styles.inputStyle}
                            value={surveyItems[currentSurveyItem].Question}
                            placeholder='ex. Coach Bio'
                            onChangeText={(text) => updateQuestion(text)}
                          />
                          <JoditEditor
                          	ref={editor}
                            value={editorState}
                            config={editorConfig}
              		          tabIndex={1} // tabIndex of textarea
              		          onBlur={newContent => onRichText(newContent)}

                          />
                        </View>)}
                      </View>
                    </View>)
                    ||
                    (<Text style={styles.addSurveyMainHelpText}>
                      {surveyItems.length > 0 && ('Select an Item to configure.') || (`Add an Item to configure.`)}
                    </Text>)}
                  </>)}
                </View>
              </View>

              <View style={styles.newPromptFooter}>
                {(surveyTitle.length == 0 || surveyText.length == 0 || surveyItems.length == 0) && (<Popup
                  position='top center'
                  content='Base fields need to be filled out, and at least one survey item created!' trigger={<Button
                  title='Create Survey'
                  disabled={true}
                  titleStyle={styles.newPromptAddButtonTitle}
                  buttonStyle={styles.newPromptAddButton}
                  containerStyle={[styles.newPromptAddButtonContainer,{width:'100%',padding:0}]}
                />}/>) || (<Button
                  title='Create Survey'
                  titleStyle={styles.newPromptAddButtonTitle}
                  buttonStyle={styles.newPromptAddButton}
                  containerStyle={[styles.newPromptAddButtonContainer,{width:'100%',padding:0}]}
                  onPress={submitSurvey}
                  disabled={createButtonDisabled}
                />)}
                {createButtonActivityIndicator && (<View style={[styles.newPromptAddButtonContainer,{marginTop:10}]}><ActivityIndicatorView /></View>)}
                <View style={styles.newPromptAddButtonSpacer}></View>
              </View>
            </View>
          </>)}

        </View>
      </View>
    </View>
  </ScrollView>)

}
