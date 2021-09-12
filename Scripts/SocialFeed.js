/* eslint-disable react/prop-types */
/* eslint-disable react/display-name */
import { StatusBar } from 'expo-status-bar'
import React, { useEffect, useState, useContext } from 'react'
import { TouchableOpacity, ScrollView, StyleSheet, Text, View, Image } from 'react-native'
import { socialFeedLight, colorsLight, innerDrawerLight, btnColors} from '../Scripts/Styles.js'
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

export default function SocialFeed() {

  const user = useContext(userContext)

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
  const [newPostImage, setNewPostImage] = useState('')
  const [newPostImageSize, setNewPostImageSize] = useState(0)
  const [newPostVideo, setNewPostVideo] = useState('')
  const [newPostType, setNewPostType] = useState(0)

  const [newPostScrollHeight, setNewPostScrollHeight] = useState(null)
  
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

  const handleFocusBack = () => {
    window.removeEventListener('focus', handleFocusBack)
  }

  const handleImageClick = event => {
    hiddenImageInput.current.click()
    window.addEventListener('focus', handleFocusBack)
    setAttachmentError('')
  }

  const checkYouTubeID = (url) => {
    var r, x = /^.*(?:(?:youtu\.be\/|v\/|vi\/|u\/\w\/|embed\/)|(?:(?:watch)?\?v(?:i)?=|\&v(?:i)?=))([^#\&\?]*).*/
    return url.match(x)
  }

  const selectAttachmentType = (type) => {

    setNewPostType(type)

    if (type == 1) {
      // Request photo upload.

    } else if (type == 3) {
      // Request video upload.

    } else {

        setNewPostImage('')
        setNewPostVideo('')

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
                if (e.currentTarget.value.length < 4) {
                  setNewPostScrollHeight(null)
                } else if (e.target.scrollHeight - newPostScrollHeight > 10) {
                  setNewPostScrollHeight(e.target.scrollHeight)
                }
              }}
              onChangeText={(t) => {
                if (t.length < 500) {
                  setNewPostText(t)
                }
              }}
              value={newPostText}
              style={[styles.newPostTextInput,{height:newPostScrollHeight}]}
              placeholder={'What do you want to share?'}
            />
            <Text style={styles.newPostAttachmentOptionsText}>Attachment <Text style={{fontSize:14}}>(optional)</Text></Text>
            <input type="file" ref={hiddenImageInput} onChange={handleImage} style={{display:'none'}} />
            <input type="file" ref={hiddenVideoInput} onChange={handleVideo} style={{display:'none'}} />
            {newPostType == 0 && (<View>
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
                <Text style={styles.newPostAttachGoBackText}>Go back</Text>
              </TouchableOpacity>
            </View>)}
            {newPostType == 1 && (<View style={styles.newPostPhotoContainer}>
              {newPostImage == '' && (<View style={styles.newPostAttachmentIndicator}>
                <ActivityIndicatorView />
              </View>) || (<View style={styles.newPostImageContainer}>
                <Image
                  source={{uri:newPostImage}}
                  style={styles.newPostImage}
                />
                <TouchableOpacity onPress={() => selectAttachmentType(0)} style={styles.newPostAttachGoBack}>
                  <Text style={styles.newPostAttachGoBackText}>Go back</Text>
                </TouchableOpacity>
              </View>)}
            </View>)}
            {newPostType == 2 && (<View style={styles.newPostYouTubeContainer}></View>)}
            {newPostType == 3 && (<View style={styles.newPostVideoContainer}></View>)}
          </View>)}

        </View>
      </View>
    </View>
  </ScrollView>)

}
