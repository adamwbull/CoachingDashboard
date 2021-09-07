import { StatusBar } from 'expo-status-bar'
import React, { useEffect, useState, useContext } from 'react'
import { TouchableOpacity, ScrollView, StyleSheet, Text, View } from 'react-native'
import { socialFeedLight, colorsLight, innerDrawerLight, btnColors} from '../Scripts/Styles.js'
import { socialFeedDark, colorsDark, innerDrawerDark } from '../Scripts/Styles.js'
import { useLinkTo } from '@react-navigation/native'
import LoadingScreen from '../Scripts/LoadingScreen.js'
import ActivityIndicatorView from '../Scripts/ActivityIndicatorView.js'
import { Icon, Button, Chip } from 'react-native-elements'
import { getFeedPosts } from './API.js'
import userContext from './Context.js'

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

  const navNewPost = () => {
    setShowSocialFeed(false)
    setShowActivityIndicator(true)
    setTimeout(() => {
      setShowActivityIndicator(false)
      setShowAddPost(true)
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

          </View>)}

        </View>
      </View>
    </View>
  </ScrollView>)

}
