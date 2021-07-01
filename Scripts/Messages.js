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

  // Create group variables.
  const [showCreateGroup, setShowCreateGroup] = useState(false)

  // Add template variables.
  const [showAddTemplate, setShowAddTemplate] = useState(false)
  const [templateMessage, setTemplateMessage] = useState('')
  
  // Chat variables.
  const [chatLoading, setChatLoading] = useState(true)
  const [chatIndex, setChatIndex] = useState(-1)
  const [message, setMessage] = useState('')

  // Reaction variables.
  const [showReactionMenu, setShowReactionMenu] = useState(false)
  const [chosenReaction, setChosenReaction] = useState('')

  // User list functions. 
  const openChat = (index) => {
    setChatIndex(index)
  }

  // Create group functions.

  // Add template functions.

  // Chat functions.
  const checkMessage = (t) => {
    if (t.length < 1000) {
      setMessage(t)
    }
  }

  const sendMessage = () => {
    
  }

  // Reaction functions.

  // Main functions.
  const refreshChatList = async () => {
    var get = await getChatList(coach.Id, coach.Token)
    console.log(get)
    setUserList(get)
    setUserListLoading(false)
    setChatLoading(false)
  }

  useEffect(() => {
    refreshChatList()
    console.log('Welcome to messages.')
    if (coach != null) {
      //
    }
  }, [])

  return (<View style={styles.container}>
    <View style={styles.userListContainer}>
      <Text style={styles.userListTitle}>Messages</Text>
      {userListLoading && (<View>
        <ActivityIndicatorView size={'small'} />
      </View>) || (<View>
        {userList.length == 0 && (<View>
          <Text style={styles.userListNone}>No conversations yet.</Text>
        </View>) || (<View>
          {userList.map((chat, index) => {

            // Generate chat name.
            var name = ''
            if (chat.ClientData.length > 1) {
              // TODO: Generate list of names string.
            } else {
              name = chat.ClientData[0].FirstName + ' ' + chat.ClientData[0].LastName
            }

            // Generate message.
            var message = chat.LastSenderMessage
            if (message.length > 14) {
              message = message.splice(0, 14) + '...'
            } else if (message.length == 0) {
              message = 'No messages yet.'
            }

            // Add bottom border.
            var borderBottom = {}
            if (index == userList.length-1) {
              borderBottom = {
                borderBottomColor:colorsLight.headerBorder,
                borderBottomWidth:2,
              }
            }

            return (<TouchableOpacity key={'chat_'+index} style={[styles.chatListContainer,borderBottom]}
              onPress={() => openChat(index)}
            >
              <View style={styles.chatListAvatar}>
                <Image
                  source={{ uri: chat.ClientData[0].Avatar }}
                  style={styles.chatListAvatarImage}
                />
              </View>
              <View style={styles.chatListText}>
                <Text style={styles.chatListTextClient}>{name}</Text>
                <Text style={styles.chatListTextMessage}>{message}</Text>
              </View>
            </TouchableOpacity>)
          })}
        </View>)}
      </View>)}
    </View>
    <View style={styles.chatContainer}>
      {chatLoading && (<View>
        <ActivityIndicatorView />
      </View>) || (<View>
        {userList.length > 0 && (<>
          {chatIndex == -1 && (<View>
            <Text style={styles.infoTitle}>Select a chat to the left, or:</Text>
            <View style={styles.infoButtonRow}>
              <Button 
                title='Create Group'
                icon={{
                  name: 'people',
                  size: 26,
                  type: 'ionicon',
                  color:'#fff',
                  style: {
                    marginTop:0
                  }
                }}
                buttonStyle={styles.createGroupChatButton}
                titleStyle={styles.infoButtonTitle}
                onPress={() => setShowCreateGroup(true)}
              />
              <Button 
                title='Add Templates'
                icon={{
                  name: 'chatbubble',
                  size: 26,
                  type: 'ionicon',
                  color:'#fff',
                  style: {
                    marginTop:-1
                  }
                }}
                buttonStyle={styles.addDMTemplatesButton}
                titleStyle={styles.infoButtonTitle}
                onPress={() => setShowAddTemplate(true)}
              />
              </View>
          </View>) || (<View style={styles.chatMainContainer}>
            <View style={styles.chatMain}>
            </View>
            <View style={styles.chatInputContainer}>
              <View style={styles.chatInputAttachIconContainer}>
                <Icon
                  name='document-attach'
                  type='ionicon'
                  size={30}
                  color={colors.mainTextColor}
                  style={{}}
                />
              </View>
              <View style={styles.chatMessageBoxContainer}>
                <TextInput 
                  style={styles.chatMessageBox}
                  placeholder='Message...'
                  onChangeText={(t) => checkMessage(t)}
                  value={message}
                />
              </View>
              <View style={styles.chatMessageSubmitButtonContainer}>
                <Button 
                  title='Send'
                  buttonStyle={styles.chatMessageSubmitButton}
                  titleStyle={styles.chatMessageSubmitButtonTitle}
                  onPress={() => sendMessage()}
                />
              </View>
            </View>
          </View>)}
        </>) || (<View>
          <Text style={styles.infoTitle}>Add clients to message.</Text>
        </View>)}
      </View>)}
    </View>
  </View>)
}
