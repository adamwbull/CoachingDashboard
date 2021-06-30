import { StatusBar } from 'expo-status-bar'
import React, { useEffect, useState, useRef, useContext } from 'react'
import { ScrollView, StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native'
import { messagesLight, colorsLight, innerDrawerLight, btnColors, boxColors } from '../Scripts/Styles.js'
import { allClientsDark, colorsDark, innerDrawerDark } from '../Scripts/Styles.js'
import { useLinkTo } from '@react-navigation/native'
import LoadingScreen from '../Scripts/LoadingScreen.js'
import ActivityIndicatorView from '../Scripts/ActivityIndicatorView.js'
import { TextInput } from 'react-native-web'
import { set, get, getTTL, ttl } from './Storage.js'
import { Icon, Button, Chip } from 'react-native-elements'
import { confirmAlert } from 'react-confirm-alert' // Import
import 'react-confirm-alert/src/react-confirm-alert.css' // Import css
import { getChatList, parseSimpleDateText, sqlToJsDate } from './API.js'
import { Dropdown, Accordion, Radio, Checkbox, Popup } from 'semantic-ui-react'
import DatePicker from 'react-date-picker/dist/entry.nostyle'
import './DatePickerClients/DatePicker.css'
import JoditEditor from "jodit-react";
import { useSpring, animated } from 'react-spring';

import userContext from './Context.js'

export default function AllClients() {
  
  const linkTo = useLinkTo()
  const user = useContext(userContext)

  const [styles, setStyles] = useState(messagesLight)
  const [colors, setColors] = useState(colorsLight)

  // Main stage controls.
  const [showUserList, setShowUserList] = useState(false)

  // Main variables.
  const [coach, setCoach] = useState(user)

  // User list variables.
  const [userListLoading, setUserListLoading] = useState(true)
  const [userList, setUserList] = useState([])

  // Chat variables.
  const [chatLoading, setChatLoading] = useState(true)
  const [chatMessages, setChatMessages] = useState([])
  const [currentMessage, setCurrentMessage] = useState('')

  // Main functions.
  const refreshChatList = async () => {
    var get = await getChatList(coach.Id, coach.Token)
    console.log(get)
    setUserList(get)
    setUserListLoading(false)
  }

  useEffect(() => {
    refreshChatList()
    console.log('Welcome to messages.')
    if (coach != null) {
      //
    }
  }, [])

  return (<View style={styles.container}  >
    <View style={styles.userListContainer}>
      <Text style={styles.userListTitle}>Messages</Text>
      {userListLoading && (<View style={{paddingTop:10}}>
        <ActivityIndicatorView size={'small'} />
      </View>) || (<View>
        {userList.length == 0 && (<View>
          <Text style={styles.userListNone}>No conversations yet.</Text>
        </View>) || (<View>
          {userList.map((chat, index) => {
            return (<View key={'chat_'+index}>
            </View>)
          })}
        </View>)}
      </View>)}
    </View>
    <View style={styles.chatContainer}>
      {chatLoading && (<>
        <ActivityIndicatorView />
      </>) || (<View>
        {userList.length == 0 && (<View>
        </View>) || (<View>
        </View>)}
      </View>)}
    </View>
  </View>)
}
