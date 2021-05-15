import { StatusBar } from 'expo-status-bar'
import React, { useEffect, useState } from 'react'
import { Image, TouchableOpacity, ScrollView, StyleSheet, Text, View } from 'react-native'
import { conceptsLight, colorsLight, innerDrawerLight } from '../Scripts/Styles.js'
import { homeDark, colorsDark, innerDrawerDark } from '../Scripts/Styles.js'
import { useLinkTo, Link } from '@react-navigation/native'
import LoadingScreen from '../Scripts/LoadingScreen.js'
import { Helmet } from "react-helmet"
import { Icon, Button } from 'react-native-elements'
import { set, get, getTTL, ttl } from './Storage.js'
import ActivityIndicatorView from '../Scripts/ActivityIndicatorView.js'
import { getConcepts } from './API.js'
import { TextInput } from 'react-native-web'
import ReactPlayer from 'react-player'
import { Popup, Dropdown, Tab } from 'semantic-ui-react'

export default function Concepts() {
  const linkTo = useLinkTo()
  const [refreshing, setRefreshing] = useState(true)
  const [styles, setStyles] = useState(conceptsLight)
  const [colors, setColors] = useState(colorsLight)
  const [coach, setCoach] = useState({})

  // Stage controls.
  const [showActivityIndicator, setActivityIndicator] = useState(true)
  const [showMain, setMain] = useState(false)

  // Text Concepts stage controls.
  const [showAddingConcept, setAddingConcept] = useState(false)
  const [videoSelected, setVideoSelected] = useState(false)
  const [showVideoOptions, setVideoOptions] = useState(false)
  const [showSelectYouTube, setSelectYouTube] = useState(false)
  const [showSelectUpload, setSelectUpload] = useState(false)
  const [videoError, setVideoError] = useState('')
  const [videoActivityIndicator, setVideoActivityIndicator] = useState(false)
  const [createButtonDisabled, setCreateButtonDisabled] = useState(false)
  const [createButtonActivityIndicator, setCreateButtonActivityIndicator] = useState(false)
  // Text Concepts data to upload.
  const [conceptTitle, setConceptTitle] = useState('')
  const [conceptType, setConceptType] = useState(0)
  const [conceptText, setConceptText] = useState('')
  const [videoUrl, setVideoUrl] = useState('')
  const [videoType, setVideoType] = useState(-1) // 0 - YT, 1 - Upload
  // Text Concepts builder data
  const [tempVideoUrl, setTempVideoUrl] = useState('')
  const [tempVideoFile, setTempVideoFile] = useState('')

  // PDFs stage controls.
  const [showAddingPDF, setAddingPDF] = useState(false)

  // Data.
  const [concepts, setConcepts] = useState([])
  const [pdfs, setPDFs] = useState([])

  // Main stage controls.
  const refreshConcepts = async (id, token) => {
    var refresh = await getConcepts(id, token)
    if (refresh != false) {
      setConcepts(refresh[0])
      setPDFs(refresh[1])
      console.log(refresh[0],refresh[1])
    } else {
      console.log('No concepts found!')
    }
  }

  // Main page view screens and controls.
  const [showViewConcept, setShowViewConcept] = useState(false)
  const [viewConcept, setViewConcept] = useState({})

  useEffect(() => {
    const sCoach = get('Coach')
    if (sCoach != null) {
      setCoach(sCoach)
      try {
        refreshConcepts(sCoach.Id, sCoach.Token)
      } finally {
        setTimeout(() => {
          setActivityIndicator(false)
          setMain(true)
        }, 500)
      }
    }
  },[])

  // Text concept controls.
  const viewConceptTrigger = async (i) => {
    setMain(false)
    setViewConcept(concepts[i])
    setActivityIndicator(true)
    setTimeout(() => {
      setActivityIndicator(false)
      setViewConcept(true)
    },500)
  }

  const addConcept = () => {
    setMain(false)
    setActivityIndicator(true)
    setTimeout(() => {
      setActivityIndicator(false)
      setAddingConcept(true)
    },500)
  }

  const returnToMainFromConcept = () => {
    setVideoUrl('')
    setViewConcept({})
    setTempVideoUrl('')
    setConceptText('')
    setConceptTitle('')
    setSelectYouTube(false)
    setSelectUpload(false)
    setAddingConcept(false)
    setViewConcept(false)
    setActivityIndicator(true)
    setTimeout(() => {
      setActivityIndicator(false)
      setMain(true)
    },500)
  }

  const deleteConceptTrigger = async (i) => {
    var deleted = await deleteConcept(concepts[i].Id, coach.Id, coach.Token)
    if (deleted) {
      setDeleteConceptIndex(-1)
      setShowConceptOptions(-1)
      refreshConcepts(coach.Id, coach.Token)
    }
  }

  const duplicateConcept = async (i) => {
    var p = concepts[i]
    setMain(false)
    setDeleteConceptIndex(-1)
    setShowConceptOptions(-1)
    // Set concept data.
    setConceptTitle(p.Title)
    setConceptText(p.Text)
    if (p.ConceptType != 0) {

      if (p.ConceptType == 3) {
        setSelectYouTube(true)
        setTempVideoUrl(p.Video)
        setVideoUrl(p.Video)
      } else if (p.ConceptType == 4) {
        setSelectUpload(true)
        setTempVideoUrl(p.Video)
        setVideoUrl(p.Video)
      }
    }
    setActivityIndicator(true)
    setTimeout(() => {
      setActivityIndicator(false)
      setAddingConcept(true)
    },500)
  }

  const onConceptTitle = (text) => {
    setConceptTitle(text)
  }

  const onConceptText = (text) => {
    setConceptText(text)
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

  const conceptVideoGoBack = () => {
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

  const submitConcept = async () => {
    setCreateButtonDisabled(true)
    setCreateButtonActivityIndicator(true)
    var fileUploaded = await getAttachment()
    var conceptType = 0
    if (videoType == 0) {
      conceptType = 3
    } else if (videoType == 1) {
      conceptType = 4
    }
    var created = await createConcept(coach.Token, coach.Id, conceptTitle, conceptType, conceptText, fileUploaded)
    if (created) {
      refreshConcepts(coach.Id, coach.Token)
      setTempVideoUrl('')
      setCreateButtonActivityIndicator(false)
      setAddingConcept(false)
      setActivityIndicator(true)
      setTimeout(() => {
        setActivityIndicator(false)
        setMain(true)
      },500)
    } else {
      console.log('Error creating concept.')
    }
  }

  // Survey controls.
  const addPDF = () => {
    console.log ('Add new pdf...')
  }


  return (<ScrollView contentContainerStyle={styles.scrollView}>
    <View style={styles.container}>
      <View style={styles.main}>
        <View style={styles.body}>
          <View style={styles.bodyHeader}>
            <View style={styles.bodyTitleGroup}>
              <Text style={styles.bodyTitle}>Concepts</Text>
              <Text style={styles.bodyDesc}>Knowledge and documents for Clients to view.</Text>
            </View>
            <View style={styles.bodyHeaderNav}>
              <Link to='/programs' style={styles.bodyHeaderNavLink}>Programs</Link>
              <Icon
                name='chevron-forward'
                type='ionicon'
                size={22}
                color={colors.mainTextColor}
              />
              <Link to='/concepts' style={styles.bodyHeaderNavLink}>Concepts</Link>
            </View>
          </View>

          {showActivityIndicator && (<ActivityIndicatorView />)}

          {showMain && (<>
            <View style={styles.conceptListContainer}>
              <View style={styles.conceptHeader}>
                <Text style={styles.conceptHeaderTitle}>Concepts</Text>
                <Text style={styles.conceptHeaderCount}>{0} total</Text>
              </View>
              <ScrollView horizontal={true} contentContainerStyle={styles.conceptsRow}>
                <View style={styles.addConceptContainer}>
                  <Button
                  title='Add Concept'
                  titleStyle={styles.conceptAddButtonTitle}
                  buttonStyle={styles.conceptAddButton}
                  containerStyle={styles.conceptAddButtonContainer}
                  onPress={addConcept} />
                </View>
                {concepts.length > 0 && (<View>
                </View>) || (<View style={styles.helpBox}>
                  <Text style={styles.helpBoxText}>Static text concepts with optional video.{"\n"}Assign directly to Clients or include in a Program.</Text>
                </View>)}
              </ScrollView>
            </View>
            <View style={styles.conceptListContainer}>
              <View style={styles.conceptHeader}>
                <Text style={styles.conceptHeaderTitle}>PDFs</Text>
                <Text style={styles.conceptHeaderCount}>{0} total</Text>
              </View>
              <ScrollView horizontal={true} contentContainerStyle={styles.conceptsRow}>
                <View style={styles.addConceptContainer}>
                  <Button
                  title='Add PDF'
                  titleStyle={styles.conceptAddButtonTitle}
                  buttonStyle={styles.conceptAddButton}
                  containerStyle={styles.conceptAddButtonContainer}
                  onPress={addPDF} />
                </View>
                {pdfs.length > 0 && (<View>
                </View>) || (<View style={styles.helpBox}>
                  <Text style={styles.helpBoxText}>Static viewable PDFs.{"\n"}Assign directly to Clients or include in a Program.</Text>
                </View>)}
              </ScrollView>
            </View>
          </>)}

          {showAddingConcept && (<>
            <View style={styles.newConceptContainer}>

              <View style={styles.newConceptHeader}>
                <Icon
                  name='chevron-back'
                  type='ionicon'
                  size={25}
                  color={colors.mainTextColor}
                  onPress={returnToMainFromConcept}
                />
                <Text style={styles.newConceptDescTitle}>New Text Concept</Text>
              </View>
              <View style={styles.newConceptBody}>
                <View style={styles.newConceptForm}>
                <Text style={styles.newConceptTitleLabel}>Title</Text>
                <TextInput
                  style={styles.inputStyle}
                  value={conceptTitle}
                  placeholder='ex. Building Mindful Awareness'
                  onChangeText={onConceptTitle}
                />
                <Text style={styles.newConceptTitleLabel}>Body Text</Text>
                <TextInput
                  style={styles.inputStyle}
                  value={conceptText}
                  placeholder='I need to add a RichText here.'
                  onChangeText={onConceptText}
                  multiline={true}
                  numberOfLines={4}
                />
                </View>

                <View style={styles.newConceptVideoSection}>
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
                    <Text style={styles.newConceptTitleLabel}>YouTube Link</Text>
                    <TextInput
                      style={styles.inputStyle}
                      value={videoUrl}
                      placeholder='ex. youtu.be/NlhiR1M_XH8'
                      onChangeText={onYTVideoUrl}
                    />
                    <TouchableOpacity style={styles.videoGoBack} onPress={conceptVideoGoBack}>
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
                      <TouchableOpacity style={styles.videoGoBack} onPress={conceptVideoGoBack}>
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
                    (<TouchableOpacity style={styles.newConceptVideoEmpty} onPress={() => setVideoOptions(true)}>
                      <Text style={styles.newConceptVideoEmptyText}>
                        Upload or link YouTube video.
                        {"\n"}
                        (optional)
                      </Text>
                    </TouchableOpacity>)}
                  </>)}
                </>)}
                </View>
              </View>

              <View style={styles.newConceptFooter}>
                {(conceptTitle.length == 0 || conceptText.length == 0) && (<Popup
                  position='top center'
                  content='All fields need to be filled out first!' trigger={<Button
                  title='Create Concept'
                  disabled={true}
                  titleStyle={styles.newConceptAddButtonTitle}
                  buttonStyle={styles.newConceptAddButton}
                  containerStyle={styles.newConceptAddButtonContainer}
                />}/>) || (<Button
                  title='Create Concept'
                  titleStyle={styles.newConceptAddButtonTitle}
                  buttonStyle={styles.newConceptAddButton}
                  containerStyle={styles.newConceptAddButtonContainer}
                  onPress={submitConcept}
                  disabled={createButtonDisabled}
                />)}
                {createButtonActivityIndicator && (<View style={[styles.newConceptAddButtonContainer,{marginTop:10}]}><ActivityIndicatorView /></View>)}
                <View style={[styles.newConceptAddButtonSpacer]}></View>
              </View>

            </View>
          </>)}

        </View>
      </View>
    </View>
  </ScrollView>)

}
