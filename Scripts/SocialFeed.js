/* eslint-disable react/prop-types */
/* eslint-disable react/display-name */
import { StatusBar } from 'expo-status-bar'
import React, { useEffect, useState, useContext } from 'react'
import { TouchableOpacity, ScrollView, StyleSheet, Text, View, Image } from 'react-native'
import { socialFeedLight, colorsLight, innerDrawerLight, btnColors, messageBox } from '../Scripts/Styles.js'
import { socialFeedDark, colorsDark, innerDrawerDark } from '../Scripts/Styles.js'
import { useLinkTo } from '@react-navigation/native'
import LoadingScreen from '../Scripts/LoadingScreen.js'
import ActivityIndicatorView from '../Scripts/ActivityIndicatorView.js'
import { Icon, Button, Chip } from 'react-native-elements'
import { getFeedPosts } from './API.js'
import userContext from './Context.js'
import { TextInput } from 'react-native-web'
import { confirmAlert } from 'react-confirm-alert'
import './CSS/confirmAlert.css' // Import css
import { useWindowDimensions } from 'react-native';
import ReactPlayer from 'react-player'

export default function SocialFeed() {

  const user = useContext(userContext)
  const { height, width } = useWindowDimensions()

  const linkTo = useLinkTo()
  const [refreshing, setRefreshing] = useState(true)
  const [styles, setStyles] = useState(socialFeedLight)
  const [colors, setColors] = useState(colorsLight)

  // Main stage controls.
  const [showActivityIndicator, setShowActivityIndicator] = useState(true)
  
  const [showAddPost, setShowAddPost] = useState(false)
  const [showSocialFeed, setShowSocialFeed] = useState(false)
  const [showSocialFeedPosts, setShowSocialFeedPosts] = useState(true)
  const [showBio, setShowBio] = useState(false)

  // Main variables.
  const [coach, setCoach] = useState(user)
  const [posts, setPosts] = useState([])

  const [attachmentError, setAttachmentError] = useState('')

  const [newPostText, setNewPostText] = useState('')
  const [newPostImageUrl, setNewPostImageUrl] = useState('')
  const [newPostImage, setNewPostImage] = useState(null)
  const [newPostImageSize, setNewPostImageSize] = useState(0)
  const [newPostVideoUrl, setNewPostVideoUrl] = useState('')
  const [newPostVideo, setNewPostVideo] = useState(null)
  const [newPostType, setNewPostType] = useState(0)

  const getData = async () => {

    const data = await getFeedPosts(coach.Id, coach.Token)
    setPosts(data)

    setShowActivityIndicator(false)
    setShowSocialFeed(true)

  }

  useEffect(() => {
    console.log('Welcome to Social Feed.')
    if (coach != null) {
      // Load page.
      getData()
    } else {
      linkTo('/welcome')
    }
  },[])

  const hiddenImageInput = React.useRef(null)
  const hiddenVideoInput = React.useRef(null)

  const handleFocusBack = event => {
    window.removeEventListener('focus', handleFocusBack)
  }

  const handleImageClick = event => {
    hiddenImageInput.current.click()
    window.addEventListener('focus', handleFocusBack)
    setAttachmentError('')
  }

  const handleVideoClick = event => {
    hiddenVideoInput.current.click()
    window.addEventListener('focus', handleFocusBack)
    setAttachmentError('')
  }

  const handleVideo = async () => {

    var file = event.target.files[0]
    if (file !== undefined) {
      var fileArr = file.name.split('.')
      var fileOptions = ['mov','mp4','m4a']
      var fileType = fileArr[1].toLowerCase()
      if (fileOptions.includes(fileType)) {
        if (file.size <= 200000000) {
          var url = URL.createObjectURL(file)
          setNewPostVideoUrl(url)
          setNewPostVideo(file)
        } else {
          setAttachmentError('File size should be less than 200 MB.')
          setNewPostType(4)
        }
      } else {
        setAttachmentError('File type should be mp4, m4a, or mov.')
        setNewPostType(4)
      }
    } else {
      setNewPostType(0)
    }

  }

  const handleImage = async () => {

    var file = event.target.files[0]
    if (file !== undefined) {
      var fileArr = file.name.split('.')
      var fileOptions = ['png','jpg','jpeg']
      var fileType = fileArr[1].toLowerCase()
      if (fileOptions.includes(fileType)) {
        if (file.size <= 5000000) {
          var url = URL.createObjectURL(file)
          setNewPostImageUrl(url)
          setNewPostImage(file)
        } else {
          setAttachmentError('File size should be less than 5 MB.')
          setNewPostType(0)
        }
      } else {
        setAttachmentError('File type should be png, jpg, or jpeg.')
        setNewPostType(0)
      }
    } else {
      setNewPostType(0)
    }

  }

  const checkYouTubeID = (url) => {
    var r, x = /^.*(?:(?:youtu\.be\/|v\/|vi\/|u\/\w\/|embed\/)|(?:(?:watch)?\?v(?:i)?=|\&v(?:i)?=))([^#\&\?]*).*/
    return url.match(x)
  }

  const selectAttachmentType = (type) => {

    setNewPostType(type)

    if (type == 1) {

      // Request photo upload.
      handleImageClick()

    } else if (type == 3) {

      // Request video upload.
      handleVideoClick()

    } else {

        setNewPostImage(null)
        setNewPostImageUrl('')
        setNewPostVideo(null)
        setNewPostVideoUrl('')
        setAttachmentError('')

    }
    
  }

  const navNewPost = () => {

    setShowSocialFeed(false)
    setShowActivityIndicator(true)
    setTimeout(() => {
      setShowActivityIndicator(false)
      setShowAddPost(true)
    }, 500)

  }

  const navSocialFeed = () => {
    setShowAddPost(false)
    setShowActivityIndicator(true)
    setTimeout(() => {
      setShowActivityIndicator(false)
      setShowSocialFeed(true)
    }, 500)
  }
  
  const previewImage = () => {

    confirmAlert({
      customUI: ({ onClose }) => {
        return (<TouchableOpacity style={{width:width,height:height}} onPress={onClose}>
          <Image
            source={{uri:newPostImageUrl}}
            resizeMode={'contain'}
            style={{ width: width-20, height: height-20, margin:10 }}
          />
        </TouchableOpacity>)
      },
      closeOnEscape: true,
      closeOnClickOutside: true
    })

  }

  return (<ScrollView contentContainerStyle={styles.scrollView}>
    <View style={styles.container}>
      <View style={styles.main}>
        <View style={styles.body}>

          {showActivityIndicator && (<ActivityIndicatorView />)}

          {showSocialFeed && (<View style={styles.socialFeedContainer}>
            <View style={styles.socialFeedMain}>
              {posts.length == 0 && (<View style={styles.socialFeedNoPosts}>
                <Text style={styles.socialFeedNoPostsText}>
                  No social feed posts yet.
                </Text>
              </View>) || (<View style={styles.socialFeedPosts}>
                {posts.map((post, index) => {
                  return (<View key={'index_'+index}>
                    
                  </View>)
                })}
              </View>)}
            </View>
            <View style={styles.socialFeedColumn}>
              <View style={styles.newPostButtonContainer}>
                <Button 
                  title='Create New Post'
                  buttonStyle={styles.newPostButton}
                  onPress={() => navNewPost()}
                />
              </View>
            </View>  
          </View>)}

          {showAddPost && (<View style={styles.newPostContainer}>
            <View style={styles.newPostHeader}>
              <Text style={styles.newPostTitle}>Create New Post</Text>
              <Icon
                name='close'
                type='ionicon'
                size={28}
                color={colors.mainTextColor}
                style={{marginRight:0}}
                onPress={() => navSocialFeed()}
              />
            </View>
            <TextInput
              multiline={true}
              onChange={(e) => {
                e.target.style.height = 0
                e.target.style.height = `${e.target.scrollHeight}px`
              }}
              onChangeText={(t) => {
                if (t.length < 500) {
                  setNewPostText(t)
                }
              }}
              value={newPostText}
              style={[styles.newPostTextInput]}
              placeholder={'What do you want to share?'}
            />
            <Text style={styles.newPostAttachmentOptionsText}>Attachment <Text style={{fontSize:14}}>(optional)</Text></Text>
            <input type="file" ref={hiddenImageInput} onChange={handleImage} style={{display:'none'}} />
            <input type="file" ref={hiddenVideoInput} onChange={handleVideo} style={{display:'none'}} />
            {attachmentError.length > 0 && (<View style={[messageBox.errorBox,{marginLeft:10,marginRight:10}]}>
              <Text style={[messageBox.text,{color:colorsLight.mainBackground}]}>{attachmentError}</Text>
            </View>)}
            {(newPostType != 4 && newPostType != 2 && newPostImage == null && newPostVideo == null) && (<View>
              <View style={styles.newPostAttachmentOptions}>
                <TouchableOpacity style={styles.newPostAttachmentOption} onPress={() => selectAttachmentType(1)}>
                  <Text style={styles.newPostAttachmentOptionText}>
                    Photo
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.newPostAttachmentOption} onPress={() => selectAttachmentType(4)}>
                  <Text style={styles.newPostAttachmentOptionText}>
                    Video
                  </Text>
                </TouchableOpacity>
              </View>
            </View>)}
            {newPostType == 4 && (<View>
              <View style={styles.newPostAttachmentOptions}>
                <TouchableOpacity style={styles.newPostAttachmentOption} onPress={() => selectAttachmentType(2)}>
                  <Text style={styles.newPostAttachmentOptionText}>
                    YouTube URL
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.newPostAttachmentOption} onPress={() => selectAttachmentType(3)}>
                  <Text style={styles.newPostAttachmentOptionText}>
                    Upload Video
                  </Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity onPress={() => selectAttachmentType(0)} style={styles.newPostAttachGoBack}>
                <Text style={[styles.newPostAttachGoBackText,{color:colorsLight.mainTextColor}]}>Go back</Text>
              </TouchableOpacity>
            </View>)}
            {newPostType == 2 && (<View style={styles.newPostYouTubeContainer}></View>)}
            {newPostImage != null && (<View style={styles.newPostImageContainer}>
              <TouchableOpacity onPress={() => previewImage()}>
                <Image
                  source={{uri:newPostImageUrl}}
                  resizeMode={'cover'}
                  style={{ width: '100%', height: 250 }}
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => selectAttachmentType(0)} style={styles.newPostAttachGoBack}>
                <Text style={styles.newPostAttachGoBackText}>Remove attachment</Text>
              </TouchableOpacity>
            </View>)}
            {newPostType == 3 && (<View style={styles.newPostVideoContainer}>
              <View style={[styles.reactPlayerContainer]}>
                <ReactPlayer controls={true} url={newPostVideoUrl} width={'100%'} height={'100%'} />
              </View>
              <TouchableOpacity onPress={() => selectAttachmentType(4)} style={styles.newPostAttachGoBack}>
                <Text style={styles.newPostAttachGoBackText}>Remove attachment</Text>
              </TouchableOpacity>
            </View>)}
          </View>)}

        </View>
      </View>
    </View>
  </ScrollView>)

}
