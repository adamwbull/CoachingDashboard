/* eslint-disable react/prop-types */
/* eslint-disable react/display-name */
import { StatusBar } from 'expo-status-bar'
import React, { useEffect, useState, useRef, useContext } from 'react'
import { Dimensions, ScrollView, StyleSheet, Text, View, Image, TouchableOpacity, TouchableWithoutFeedback } from 'react-native'
import { messagesLight, colorsLight, innerDrawerLight, btnColors, boxColors } from '../Scripts/Styles.js'
import { allClientsDark, colorsDark, innerDrawerDark } from '../Scripts/Styles.js'
import { useLinkTo } from '@react-navigation/native'
import LoadingScreen from '../Scripts/LoadingScreen.js'
import ActivityIndicatorView from '../Scripts/ActivityIndicatorView.js'
import { TextInput } from 'react-native-web'
import { set, get, getTTL, ttl } from './Storage.js'
import { Icon, Button, Chip } from 'react-native-elements'
import { ReactConfirmAlert, confirmAlert } from 'react-confirm-alert' // Import
import 'react-confirm-alert/src/react-confirm-alert.css' // Import css
import { deleteTemplate, createTemplate, updateGroup, createGroup, uploadMessageImage, refreshMessageInfo, postMessage, getMessageInfo, parseSimpleDateText, sqlToJsDate, dateToSql, parseDateText } from './API.js'
import { Dropdown, Accordion, Radio, Checkbox, Popup } from 'semantic-ui-react'
import DatePicker from 'react-date-picker/dist/entry.nostyle'
import './DatePickerClients/DatePicker.css'
import JoditEditor from "jodit-react";
import { useSpring, animated } from 'react-spring';
const io = require('socket.io-client');

import userContext from './Context.js'

var socket = io("https://messages.coachsync.me/")

export function ChatAvatars({ clientData, coach, styles }) {

  const [otherNames, setOtherNames] = useState('')

  useEffect(() => {
    var names = ''
    var firstNotFound = true
    var count = 0
    for (var i = 0; i < clientData.length; i++) {
      if (count == 3) {
        var client = clientData[i]
        if (firstNotFound && coach.Id != client.Id) {
          names = client.FirstName + ' ' + client.LastName
          firstNotFound = false
        } else if (coach.Id != client.Id) {
          names = names + "\n" + client.FirstName + ' ' + client.LastName
        }
      } else {
        if (clientData[i].Removed == 0) {
          count++;
        }
      }
    }
    setOtherNames(names)
  }, [])
  return (<View style={{justifyContent:'center',alignItems:'center'}}>
  <Text style={styles.groupMembersTitle}>Members</Text>
  <View style={styles.chatAreaHeaderAvatars}>
    
    {clientData.map((client, index) => {
      if (coach.Id != client.Id && client.Removed == 0) {
        if (index < 3) {
          if (coach.Theme == 0) {
            return (<Popup 
              key={'av1_'+index}
              trigger={<View>
                <Image
                  source={{uri:client.Avatar}}
                  style={styles.chatAreaHeaderAvatar}
                />
              </View>}
              content={client.FirstName + ' ' + client.LastName}
              position={'top center'}
              size={'tiny'}
              inverted
            />)
          } else {
            return (<Popup 
              key={'av1_'+index}
              trigger={<View>
                <Image
                  source={{uri:client.Avatar}}
                  style={styles.chatAreaHeaderAvatar}
                />
              </View>}
              content={client.FirstName + ' ' + client.LastName}
              position={'top center'}
              size={'tiny'}
            />)
          }
        } else {
          return (<View key={'av1_'+index}></View>)
        }
      }
    })}
    </View>
    {coach.Theme == 0 && (<>
      {clientData.length > 4 && (<Popup 
        trigger={<Text style={styles.chatAreaHeaderMoreText}>
        +{clientData.length-4} more
      </Text>}
      position={'bottom center'}
      size={'tiny'}
      inverted
      >
        <Text style={styles.groupTooltipText}>{otherNames}</Text>
      </Popup>)}
    </>) || (<>
      {clientData.length > 4 && (<Popup 
        trigger={<Text style={styles.chatAreaHeaderMoreText}>
        +{clientData.length-4 } more
      </Text>}
      content={otherNames}
      position={'bottom center'}
      size={'tiny'}
      />)}
    </>)}
  </View>)
}
export default function Messages() {

  // Hooks.
  const linkTo = useLinkTo()
  const user = useContext(userContext)
  const scrollViewRef = useRef();
  const textInput = useRef();
  var messagesEnd = useRef();

  // Styles.
  const [styles, setStyles] = useState(messagesLight)
  const [colors, setColors] = useState(colorsLight)

  // Main stage controls.
  const [firstLoad, setFirstLoad] = useState(true)
  const [showUserList, setShowUserList] = useState(false)
  const [scrollWidth, setScrollWidth] = useState(0)

  // Main variables.
  const [coach, setCoach] = useState(user)
  const [windowDims, setWindowDims] = useState(Dimensions.get('window'))

  // User list variables.
  const [userListLoading, setUserListLoading] = useState(true)
  const [userList, setUserList] = useState([])
  const [clients, setClients] = useState([])

  // Create group variables.
  const [showCreateGroup, setShowCreateGroup] = useState(false)
  const [hasContents, setHasContents] = useState(false)
  const [selectedClients, setSelectedClients] = useState([])
  const [groupTitle, setGroupTitle] = useState('')
  const [showCreateGroupIndicator, setShowCreateGroupIndicator] = useState(false)
  const [createGroupError, setCreateGroupError] = useState('')

  // Add template variables.
  const [showAddTemplate, setShowAddTemplate] = useState(false)
  const [templateMessage, setTemplateMessage] = useState('')
  const [templateScrollHeight, setTemplateScrollHeight] = useState(null)
  const [templateActivityIndicator, setTemplateActivityIndicator] = useState(false)
  const [templateIndices, setTemplateIndices] = useState([])
  const [templateSearchHasContents, setTemplateSearchHasContents] = useState(false)
  const [templateContainerStyle, setTemplateContainerStyle] = useState({height:'100%',flex:1})
  
  // Chat variables.
  const [chatLoading, setChatLoading] = useState(true)
  const [chatIndex, setChatIndex] = useState(-1)
  const [messages, setMessages] = useState([])
  const [scrollHeight, setScrollHeight] = useState(null)
  const [templates, setTemplates] = useState([])
  const [isSending, setIsSending] = useState(false)
  const [sendButtonDisabled, setSendButtonDisabled] = useState(false)

  // Manage group variables.
  const [showManageGroup, setShowManageGroup] = useState(false)
  const [manageHasContents, setManageHasContents] = useState(false)
  const [manageSelectedClients, setManageSelectedClients] = useState([])
  const [manageGroupTitle, setManageGroupTitle] = useState('')
  const [showManageGroupIndicator, setShowManageGroupIndicator] = useState(false)
  const [manageGroupError, setManageGroupError] = useState('')
  const [group, setGroup] = useState(-1)

  // Attachment variables.
  const hiddenFileInput = React.useRef(null)
  const [showAttachmentField, setShowAttachmentField] = useState(false)
  const [showAttachButton, setShowAttachButton] = useState(true)
  const [showAttachIndicator, setShowAttachIndicator] = useState(false)
  const [attachment, setAttachment] = useState('')
  const [attachmentLink, setAttachmentLink] = useState('')
  const [attachmentType, setAttachmentType] = useState('')
  const [attachError, setAttachError] = useState('Test.')

  // Reaction variables.
  const [showReactionMenu, setShowReactionMenu] = useState(false)
  const [chosenReaction, setChosenReaction] = useState('')

  // Helper functions.
  const generateChatName = (list, title, index, use3Names) => {
    // Generate chat name.
    var name = ''
    if (title.length > 0) {
      name = title
    } else {
      if (list.length > 2) {
        // Genereate list of names.
        for (var i = 0; i < list.length; i++) {
          if (list[i].Id != coach.Id) {
            if (use3Names) {
              if (i <= 2) {
                if (list.length == 4 && i == 2) {
                  name = name + list[i].FirstName
                } else {
                  name = name + list[i].FirstName + ', '
                }
              } else if (i == 3) {
                name = name + '+' + (list.length-4)
              }
            } else {
              if (i  == 0) {
                name = name + list[i].FirstName + ', '
              } else if (i == 1) {
                name = name + list[i].FirstName
              } else if (i == 2) {
                name = name + ', +' + (list.length-3)
              }
            }
          }
        }
      } else {
        name = list[index].FirstName + ' ' + list[index].LastName
      }
    }
    return name
  }


  // User list functions. 
  const openChat = (index) => {
    setChatIndex(index)
    setShowCreateGroup(false)
    setShowAddTemplate(false)
    setShowManageGroup(false)
    setTemplateContainerStyle({height:'100%'})
  }

  // Create group functions.
  const addClient = (index) => {
    var c = JSON.parse(JSON.stringify(clients))
    c[index].Checked = true
    setClients(c)
    // Add to selected clients arr.
    var s = JSON.parse(JSON.stringify(selectedClients))
    s.push(c[index])
    setSelectedClients(s)
  }

  const removeClient = (index) => {
    var c = JSON.parse(JSON.stringify(clients))
    c[index].Checked = false
    setClients(c)
    // Remove from selected clients arr.
    var s = JSON.parse(JSON.stringify(selectedClients))
    for (var i = 0; i < s.length; i++) {
      if (s[i].Id == c[index].Id) {
        s.splice(i, 1)
      }
    }
    setSelectedClients(s)
  }

  const openCreateGroup = () => {
    setChatIndex(-1)
    setShowAddTemplate(false)
    setShowManageGroup(false)
    setShowCreateGroup(true)
    setTemplateContainerStyle({height:'100%'})
    var c = JSON.parse(JSON.stringify(clients))
    for (var i = 0; i < clients.length; i++) {
      c[i].Checked = false
    }
    setClients(c)
  }

  const searchCreateGroup = (text) => {
    var cs = JSON.parse(JSON.stringify(clients))
    for (var i = 0; i < cs.length; i++) {
      var str = cs[i].FirstName + ' ' + cs[i].LastName
      if (str.includes(text) || text.length == 0) {
        if (cs[i].Id != coach.Id) {
          cs[i].Visible = true
        }
      } else {
        cs[i].Visible = false
      }
    }
    setClients(cs)
  } 

  const createGroupTrigger = async () => {
    setShowCreateGroupIndicator(true)
    var ids = []
    for (var i = 0; i < selectedClients.length; i++) {
      ids.push(selectedClients[i].Id)
    }
    var clientsStr = ids.join()
    var post = await createGroup(coach.Token, coach.Id, groupTitle, clientsStr)
    if (post) {
      refreshChatList()
      setGroupTitle('')
      setSelectedClients([])
      searchCreateGroup('')
      setShowCreateGroup(false)
      setCreateGroupError('')
    } else {
      setCreateGroupError('Error creating. Please try again.')
    }
    setShowCreateGroupIndicator(false)
  }

  // Add template functions.
  const openAddTemplate = () => {
    setGroup(chatIndex)
    setChatIndex(-1)
    setShowAddTemplate(true)
    setTemplateContainerStyle({height:null})
  }

  const searchTemplates = (text) => {
    var tems = JSON.parse(JSON.stringify(templates))
    for (var i = 0; i < tems.length; i++) {
      var str = tems[i].Message
      if (str.toLowerCase().includes(text.toLowerCase()) || text.length == 0) {
        tems[i].Visible = true
      } else {
        tems[i].Visible = false
      }
    }
    setTemplates(tems)
  } 

  const deleteTemplates = async () => {
    // BUild array to delete and new arrays.
    var ids = []
    var newTemplates = []
    var newIndices = []
    for (var i = 0; i < templates.length; i++) {
      if (templateIndices[i] == 1) {
        ids.push(templates[i].Id)
      } else {
        newTemplates.push(templates[i])
        newIndices.push(0)
      }
    }
    var deleted = await deleteTemplate(JSON.stringify(ids), coach.Id, coach.Token)
    if (deleted) {
      setTemplateIndices(newIndices)
      setTemplates(newTemplates)
    }
  }

  const submitTemplate = async () => {
    setTemplateActivityIndicator(true)
    var posted = await createTemplate(templateMessage, coach.Id, coach.Token)
    if (posted > 0) {
      var newTemplates = JSON.parse(JSON.stringify(templates))
      newTemplates.unshift({
        Message:templateMessage,
        CoachId:coach.Id,
        Visible:true,
        Id:posted
      })
      var newIndices = JSON.parse(JSON.stringify(templateIndices))
      newIndices.unshift(0)
      setTemplates(newTemplates)
      setTemplateIndices(newIndices)
      setTemplateMessage('')
    } else {

    }
    setTemplateActivityIndicator(false)
  }

  // Chat functions.
  const copyTemplate = (index) => {
    var newMessages = JSON.parse(JSON.stringify(messages))
    var msg = newMessages[chatIndex] + templates[index].Message
    newMessages[chatIndex] = msg
    setMessages(newMessages)
    if (msg.length < 1000) {
      textInput.current.value = msg
     setScrollHeight(textInput.current.scrollHeight)
    }
  }

  const handleBlur = (e) => {
    checkMessage(e.target.value)
  }

  const checkMessage = (t) => {
    if (t.length < 1000) {
      var newMs = JSON.parse(JSON.stringify(messages))
      newMs[chatIndex] = t
      setMessages(newMs)
    }
  }

  const sendMessage = async () => {
    
    // Check if we are good to send a message.
    if (messages[chatIndex].length > 0 || attachmentLink.length > 0) {
      setIsSending(true)
      var posted = await postMessage(userList[chatIndex].Id, messages[chatIndex], coach.Id, coach.Token, 'Message from Coach')
      if (posted > 1) {
        // Check if image upload is necessary.
        if (attachmentLink.length > 0) {
          var upload = await uploadMessageImage(attachment, attachmentType, coach.Token, posted)
        }
        // Send test emission.
        console.log('Sending socket emit...')
        socket.emit('sent-message', { recepients:'[3,6]', conversationId:'3' })
        // Add message locally.
        var newUserList = JSON.parse(JSON.stringify(userList))
        var conversation = newUserList[chatIndex]
        conversation.LastSenderId = coach.Id
        var date = dateToSql(new Date())
        conversation.LastSenderCreated = date
        conversation.LastSenderMessage = messages[chatIndex]
        refreshMessages()

        // Clear text input.
        discardAttach()
        var newMs = JSON.parse(JSON.stringify(messages))
        newMs[chatIndex] = ''
        setMessages(newMs)
        textInput.current.value = ''

        // 
        setIsSending(false)

      } 
    }

  }

  const attachImage = () => {
    setShowAttachmentField(true)
  }

  const resetAttach = () => {
    setShowAttachButton(true)
    setAttachError('')
  }

  const discardAttach = () => {
    setShowAttachmentField(false)
    setShowAttachButton(true)
    setShowAttachIndicator(false)
    setAttachment('')
    setAttachmentLink('')
    setAttachError('')
    hiddenFileInput.current.value = null
  }

  const handleClick = event => {
    console.log('Handling click...')
    hiddenFileInput.current.click()
    window.addEventListener('focus', handleFocusBack)
    setAttachError('')
  }

  const handleFocusBack = () => {
    console.log('Focusing back...')
    window.removeEventListener('focus', handleFocusBack)
    setAttachmentLink('')
    hiddenFileInput.current.value = null

  }

  const fileToDataUri = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      resolve(event.target.result)
    };
    reader.readAsDataURL(file);
  })

  const handleFile = async () => {
    console.log('Handling file...')
    setSendButtonDisabled(true)
    setShowAttachButton(false)
    var file = event.target.files[0]
    if (file !== undefined) {
      var fileArr = file.name.split('.')
      var fileOptions = ['jpeg','jpg','png']
      var fileType = fileArr[fileArr.length-1]
      if (fileOptions.includes(fileType)) {
        if (file.size <= 20000000) {
          setShowAttachIndicator(false)
          setSendButtonDisabled(false)
          var url = URL.createObjectURL(file)
          setAttachmentLink(url)
          setAttachment(file)
          setAttachmentType(fileType)
        } else {
          setAttachError('File size should be less than 20 MB.')
        }
      } else {
        setAttachError('File type should be png, jpg, or jpeg.')
      }
    } else {
      setShowAttachIndicator(false)
    }

  }

  // Manage group functions.
   const addManageGroupClient = (index) => {
    var c = JSON.parse(JSON.stringify(clients))
    c[index].Checked = true
    setClients(c)
    // Add to selected clients arr.
    var s = JSON.parse(JSON.stringify(manageSelectedClients))
    s.push(c[index])
    setManageSelectedClients(s)
  }

  const removeManageGroupClient = (index) => {
    var c = JSON.parse(JSON.stringify(clients))
    c[index].Checked = false
    setClients(c)

    // Remove from selected clients arr.
    var s = JSON.parse(JSON.stringify(manageSelectedClients))
    for (var i = 0; i < s.length; i++) {
      if (s[i].Id == c[index].Id) {
        s.splice(i, 1)
      }
    }
    setManageSelectedClients(s)
  }

  const openManageGroup = () => {
    var x = chatIndex
    var userIds = []
    var usersRemoved = []
    for (var j = 0; j < userList[chatIndex].ClientData.length; j++) {
      if (coach.Id != userList[chatIndex].ClientData[j].Id) {
        userIds.push(userList[chatIndex].ClientData[j].Id)
        usersRemoved.push(userList[chatIndex].ClientData[j].Removed)
      }
    }
    console.log(userIds)
    setTemplateContainerStyle({height:'100%'})
    setGroup(chatIndex)
    setChatIndex(-1)
    setShowManageGroup(true)
    var selected = []
    var c = JSON.parse(JSON.stringify(clients))
    for (var i = 0; i < clients.length; i++) {
      var index = userIds.indexOf(c[i].Id)
      if (index != -1 && usersRemoved[index] == 0) {
        c[i].Checked = true
        selected.push(c[i])
      } else {
        c[i].Checked = false
      }
    }
    setManageGroupTitle(userList[x].Title)
    setManageSelectedClients(selected)
    setClients(c)
  }

  const searchManageGroup = (text) => {
    var cs = JSON.parse(JSON.stringify(clients))
    for (var i = 0; i < cs.length; i++) {
      var str = cs[i].FirstName + ' ' + cs[i].LastName
      if (str.includes(text) || text.length == 0) {
        if (cs[i].Id != coach.Id) {
          cs[i].Visible = true
        }
      } else {
        cs[i].Visible = false
      }
    }
    setClients(cs)
  } 

  const updateGroupTrigger = async () => {
    setShowManageGroupIndicator(true)
    var ids = []
    for (var i = 0; i < manageSelectedClients.length; i++) {
      ids.push(manageSelectedClients[i].Id)
    }
    var clientsStr = ids.join()
    var post = await updateGroup(coach.Token, userList[group].Id, coach.Id, manageGroupTitle, clientsStr)
    if (post) {
      refreshChatList()
      setManageGroupTitle('')
      setManageSelectedClients([])
      searchManageGroup('')
      setShowManageGroup(false)
    } else {
      setManageGroupError('Error creating. Please try again.')
    }
    setShowManageGroupIndicator(false)
  }

  // Reaction functions.

  // Main functions.
  const viewImage = (url) => {

    Image.getSize(url, (width, height) => {
      var wWidth = window.screen.width
      var wHeight = window.screen.height
      var cHeight = 0.6*wHeight
      var cWidth = cHeight*(width/height)
      var imStyle = {
        width:cWidth,
        height:cHeight
      }
      confirmAlert({
        overlayClassName:'confirmUIBasic',
        customUI: ({ onClose }) => {
          return (<TouchableWithoutFeedback onPress={onClose}>
            <View style={styles.photoOverlay}>
              <Image 
                source={{uri:url}}
                style={imStyle}
              />
            </View>
          </TouchableWithoutFeedback>)
        }
      })  
    });
    
  }
  
  const refreshMessages = () => {
    refreshMessageInfo(coach.Id, coach.Token)
  }

  const refreshChatList = async () => {
    var get = await getMessageInfo(coach.Id, coach.Token)
    console.log('data:', get)
    setUserList(get[0])
    var indices = []
    var tems = []
    for (var i = 0; i < get[1].length; i++) {
      indices.push(0)
      var t = get[1][i]
      t.Visible = true
      tems.push(t)
    }
    setTemplates(tems)
    setTemplateIndices(indices)
    setUserListLoading(false)
    setChatLoading(false)
    // Build message array and client array.
    var ms = []
    var clients = []
    // For each convo...
    for (var i = 0; i < get[0].length; i++) {

      // Create an empty input message.
      ms.push('')

      // Get client data.
      for (var j = 0; j < get[0][i].ClientData.length; j++) {
        
        var user = JSON.parse(JSON.stringify(get[0][i].ClientData[j]))
        if (user.Id != coach.Id) {
          user.Visible = true
        }
        // Ensure we haven't added this person yet.
        var found = false;
        for (var k = 0; k < clients.length; k++) {
          if (user.Id == clients[k].Id) {
            found = true;
            break
          }
        }

        if (found == false) {
          user.Checked = false
          clients.push(user)
        }

      }

    }

    setClients(clients)
    setMessages(ms)
    setChatIndex(0)

  }

  const configureSocket = () => {

    // Mount primary socket.
    console.log('Loading socket...')

    socket.on('connect', () => {
      console.log('Socket connected.')
    })

    socket.on('get-conversations', (data) => {
      console.log('Received socket emission...')
      refreshChatList()
    })

    // For when the window closes.
    window.addEventListener('beforeunload', (event) => {
      event.preventDefault()
      console.log('Closing socket...')
      socket.disconnect()
    })

  }

  useEffect(() => {
    if (firstLoad) {
      console.log('Welcome to messages.')
      if (coach != null) {
        configureSocket()
        refreshChatList()
        setFirstLoad(false)
      } else {
        linkTo('/welcome')
      }
    } else {
      if (chatIndex != -1) {
        textInput.current.value = messages[chatIndex]
      }
    }
  }, [chatIndex])

  return (<View style={styles.container}>
    <View style={styles.userListContainer}>
      <TouchableOpacity style={styles.userListTitleContainer}
        onPress={() => openCreateGroup()}
      >
        <Text style={styles.userListTitle}>Messages</Text>
        <Icon
          name='add'
          type='ionicon'
          size={28}
          color={colors.mainTextColor}
          style={{}}
        />
      </TouchableOpacity>
      {userListLoading && (<View style={{paddingTop:10}}>
        <ActivityIndicatorView size={'small'} />
      </View>) || (<View>
        {userList.length == 0 && (<View>
          <Text style={styles.userListNone}>No conversations yet.</Text>
        </View>) || (<View>
          {userList.map((chat, index) => {

            var name = generateChatName(chat.ClientData, chat.Title, 0, false)

            // Generate message.
            var message = chat.LastSenderMessage
            if (message.length > 14) {
              message = chat.LastSenderMessage.slice(0, 14) + '...'
            } else if (message.length == 0) {
              message = 'No messages yet.'
            }

            // Add current message highlighting.
            var currentHighlight = {}
            if (index == chatIndex) {
              currentHighlight = {backgroundColor:colorsLight.secondaryBackground}
            }

            // Add bottom border.
            var borderBottom = {}
            if (index == userList.length-1) {
              borderBottom = {
                borderBottomColor:colorsLight.headerBorder,
                borderBottomWidth:2,
              }
            }

            return (<TouchableOpacity key={'chat_'+index} style={[styles.chatListContainer,borderBottom,currentHighlight]}
              onPress={() => openChat(index)}
            >
              <View style={styles.chatListAvatar}>
                {chat.ClientData.length > 2 && (<Icon 
                  name='people'
                  type='ionicon'
                  size={16}
                  color={'#fff'}
                />) || (<Image
                  source={{ uri: chat.ClientData[0].Avatar }}
                  style={styles.chatListAvatarImage}
                />)}
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
    <ScrollView showsHorizontalScrollIndicator={false} contentContainerStyle={[styles.chatContainer,templateContainerStyle]}>
      {chatLoading && (<View>
        <ActivityIndicatorView />
      </View>) || (<View style={[styles.chatContainer,templateContainerStyle]}>
        {userList.length > 0 && (<>
          {chatIndex == -1 && (<>
            {showAddTemplate && (<View style={styles.addTemplateContainer}>
              <View style={[styles.promptMain,{marginTop:20,
              marginBottom:20,width:(windowDims.width*0.65),minHeight:(windowDims.height*0.85)}]}>
                <View style={styles.templateMainHeader}>
                  <View style={{width:30,height:30}}>
                    <Icon
                      name='chevron-back'
                      type='ionicon'
                      size={28}
                      color={colors.mainTextColor}
                      style={{}}
                      onPress={() => {
                        openChat(group)
                      }}
                    />
                  </View>
                  <View style={{flex:1,alignItems:'center'}}>
                    <Text style={styles.templateMainHeaderTitle}>Manage Templates</Text>
                    <Text style={styles.templateMainDesc}>Pre-made messages to quickly and easily send clients.</Text>
                  </View>
                  <View style={{width:30,height:30}}>
                     
                  </View>
                </View>
                <View style={styles.templateMainSection}>
                  <Text style={styles.templateMainSubtitle}>Add Template</Text>
                  <TextInput
                    className='custom-textinput'
                    multiline={true}
                    onChange={(e) => {
                      if (e.currentTarget.value.length < 4) {
                        setTemplateScrollHeight(null)
                      } else if (e.target.scrollHeight - templateScrollHeight > 10) {
                        setTemplateScrollHeight(e.target.scrollHeight)
                      }
                    }}
                    onChangeText={(t) => {
                      if (t.length < 500) {
                        setTemplateMessage(t)
                      }
                    }}
                    value={templateMessage}
                    style={[styles.templateMessageInput,{height:templateScrollHeight}]}
                    placeholder={'Enter template message...'}
                  />
                  <View style={styles.templateMessageRow}>
                    <View style={styles.templateMessageContainer}>
                      {templateMessage.length > 0 && (<View style={[styles.mainMessageMe,{maxWidth:'70%'}]}>
                        <Text style={styles.messageTextMe}>{templateMessage}</Text>
                      </View>) || (<View style={[styles.mainMessageMe,{maxWidth:'70%'}]}>
                        <Text style={styles.messageTextMe}>Preview your message here!</Text>
                      </View>)}
                    </View>
                    <View style={styles.templateMessageSaveContainer}>
                      {templateActivityIndicator && (<ActivityIndicatorView />) || (<Button 
                        title={'Save'}
                        buttonStyle={styles.templateMessageSave}
                        titleStyle={styles.templateMessageSaveTitle}
                        onPress={() => submitTemplate()}
                        disabled={templateMessage.length < 1}
                      />)}
                    </View>
                  </View>
                </View>
                <View style={styles.templateMainExisting}>
                  <View style={{flexDirection:'row',alignItems:'center'}}>
                    <Text style={[styles.templateMainSubtitle,{textAlign:'left',marginRight:10}]}>Existing Templates</Text>
                    <Button 
                      title={'Delete Selected'}
                      buttonStyle={styles.deleteTemplatesButton}
                      titleStyle={styles.deleteTemplatesButtonTitle}
                      disabled={!templateIndices.includes(1)}
                      onPress={() => deleteTemplates()}
                    />
                  </View>
                  {templates.length > 0 && (<>
                    <View style={{flexDirection:'row',alignItems:'center',marginTop:10,marginBottom:10}}>
                      <View style={templateSearchHasContents && [styles.createGroupAddHeaderHighlight,{margin:0,flex:1}] || [styles.createGroupAddHeader,{margin:0,flex:1}]}>
                        <View style={styles.createGroupAddIcon}>
                          <Icon
                            name='search'
                            type='ionicon'
                            size={28}
                            color={templateSearchHasContents && colors.mainTextColor || colors.headerBorder}
                            style={[{marginLeft:5,marginTop:2}]}
                          />
                        </View>
                        <TextInput 
                          placeholder='Find templates...'
                          style={styles.createGroupAddInput}
                          onChange={(e) => {
                            searchTemplates(e.currentTarget.value)
                            setTemplateSearchHasContents((e.currentTarget.value.length > 0))
                          }}
                          className='custom-textinput'
                        />
                      </View>
                    </View>
                    <ScrollView contentContainerStyle={styles.templateRowList}>
                      {templates.map((template, index) => {
                        
                        if (template.Visible) {
                          return (<View style={[styles.templateRow]} key={'templateManage_'+index}>
                            {templateIndices[index] == 0 && (<Icon
                              name='square-outline'
                              type='ionicon'
                              size={25}
                              color={colors.mainTextColor}
                              onPress={() => {
                                var indices = JSON.parse(JSON.stringify(templateIndices))
                                indices[index] = 1
                                setTemplateIndices(indices)
                              }}
                            />) || (<Icon
                              name='checkbox'
                              type='ionicon'
                              size={25}
                              color={btnColors.danger}
                              onPress={() => {
                                var indices = JSON.parse(JSON.stringify(templateIndices))
                                indices[index] = 0
                                setTemplateIndices(indices)
                              }}
                            />)}
                            <View style={styles.templateContainer}
                            >
                              <Text style={[styles.mainMessageMe,{alignSelf:'flex-start',maxWidth:400,marginLeft:10}]}>
                                {template.Message}
                              </Text>
                            </View>
                          </View>)
                        }

                      })}
                    </ScrollView>
                  </>) || (<View style={{flex:1}}>
                    <Text style={styles.templateMainDesc}>No templates yet.</Text>
                  </View>)}
                </View>
              </View>
            </View>) || (<>
              {showCreateGroup && (<View style={[styles.createGroupContainer]}>
                <View style={[styles.promptMain,{width:(windowDims.width*0.3),height:(windowDims.height*0.8)}]}>
                  <Text style={styles.createGroupHeader}>Create Group</Text>
                  <View style={styles.createGroupSpacer}></View>
                  <TextInput 
                    placeholder='Set group name...'
                    style={styles.createGroupNameInput}
                    value={groupTitle}
                    onChangeText={(text) => {
                      if (text.length < 255) {
                        setGroupTitle(text)
                      }
                    }}
                  />
                  {selectedClients.length > 0 && (<View style={styles.createGroupAdded}>
                    {selectedClients.map((client, index) => {

                      var side = ((windowDims.width*0.3)/6.5)
                      var avStyle = {
                        width:side,
                        height:side
                      }
                      
                      if (index < 3) {
                        // Show user.
                        return (<View key={'clientAdded_'+index} style={styles.createGroupAddedBubbleContainer}>
                          <Image 
                            source={{uri:client.Avatar}}
                            style={[styles.createGroupAddedBubbleUser,
                            avStyle]}
                          />
                          <Text style={styles.createGroupAddedBubbleTextBottom}>{client.FirstName} {client.LastName.charAt(0)}.</Text>
                        </View>)

                      } else if (index == clients.length-1) {
                        // Show +x more bubble.
                        var x = index - 2
                        return (<View key={'clientAdded_'+index} style={styles.createGroupAddedBubbleContainer}>
                          <View style={[styles.createGroupAddedBubbleUser,avStyle]}>
                            <Text style={styles.createGroupAddedBubbleTextInner}>+{x}</Text>
                          </View>
                          <Text style={styles.createGroupAddedBubbleTextBottom}>others</Text>
                        </View>)

                      } else {
                        return (<></>)
                      }

                    })}
                  </View>) || (<View style={styles.createGroupAdded}>
                    <Text style={styles.noClientsSelected}>Select clients below.</Text>
                  </View>)}
                  <View style={[styles.createGroupSpacer,{marginBottom:10}]}></View>
                  <View style={styles.createGroupAddContainer}>
                    <View>
                      <Text style={styles.createGroupError}>{createGroupError}</Text>
                      {showCreateGroupIndicator && (<ActivityIndicatorView />) || (<Button 
                        title='Create'
                        buttonStyle={styles.createGroupButton}
                        titleStyle={{color:'#fff',fontFamily:'Poppins'}}
                        onPress={() => createGroupTrigger()}
                        disabled={selectedClients.length < 2}
                      />)}
                    </View>
                    <View style={hasContents && styles.createGroupAddHeaderHighlight || styles.createGroupAddHeader}>
                      <View style={styles.createGroupAddIcon}>
                        <Icon
                          name='search'
                          type='ionicon'
                          size={28}
                          color={hasContents && colors.mainTextColor || colors.headerBorder}
                          style={[{marginLeft:5,marginTop:2}]}
                        />
                      </View>
                      <TextInput 
                        placeholder='Find clients...'
                        style={styles.createGroupAddInput}
                        onChange={(e) => {
                          searchCreateGroup(e.currentTarget.value)
                          setHasContents((e.currentTarget.value.length > 0))
                        }}
                        className='custom-textinput'
                      />
                    </View>
                    <ScrollView contentContainerStyle={[styles.createGroupList,{height:'100%'}]}
                    showsHorizontalScrollIndicator={false}
                    >
                      {clients.map((client, index) => {

                        if (client.Visible) {

                          return (<View key={'client_'+client.Id} style={[styles.createGroupClient]}>
                            <View>
                              <Image 
                                source={{uri:client.Avatar}}
                                style={styles.createGroupClientAvatar}
                              />
                            </View>
                            <View style={styles.createGroupClientNameContainer}>
                              <Text style={styles.createGroupClientName}>
                                {client.FirstName + ' ' + client.LastName}
                              </Text>
                            </View>
                            <View>
                              {client.Checked && (<Icon
                                name='checkbox'
                                type='ionicon'
                                size={28}
                                color={btnColors.success}
                                style={{}}
                                onPress={() => {
                                  removeClient(index)
                                }}
                              />) || (<Icon
                                name='square-outline'
                                type='ionicon'
                                size={28}
                                color={colors.mainTextColor}
                                style={{}}
                                onPress={() => {
                                  addClient(index)
                                }}
                              />)}
                            </View>
                          </View>)

                        } else {

                          return (<View key={'client_'+client.Id}></View>)

                        }

                      })}
                    </ScrollView>
                  </View>
                </View>
              </View>)}
              {showManageGroup && (<View style={[styles.createGroupContainer]}>
                <View style={[styles.promptMain,{width:(windowDims.width*0.3),height:(windowDims.height*0.8)}]}>
                  <Text style={styles.createGroupHeader}>Manage Group</Text>
                  <View style={styles.createGroupSpacer}></View>
                  <TextInput 
                    placeholder='Set group name...'
                    style={styles.createGroupNameInput}
                    value={manageGroupTitle}
                    onChangeText={(text) => {
                      if (text.length < 255) {
                        setManageGroupTitle(text)
                      }
                    }}
                  />
                  {manageSelectedClients.length > 0 && (<View style={styles.createGroupAdded}>
                    {manageSelectedClients.map((client, index) => {

                      var side = ((windowDims.width*0.3)/6.5)
                      var avStyle = {
                        width:side,
                        height:side
                      }
                      
                      if (index < 3) {
                        // Show user.
                        return (<View key={'clientAdded_'+index} style={styles.createGroupAddedBubbleContainer}>
                          <Image 
                            source={{uri:client.Avatar}}
                            style={[styles.createGroupAddedBubbleUser,
                            avStyle]}
                          />
                          <Text style={styles.createGroupAddedBubbleTextBottom}>{client.FirstName} {client.LastName.charAt(0)}.</Text>
                        </View>)

                      } else if (index == clients.length-1) {
                        // Show +x more bubble.
                        var x = index - 2
                        return (<View key={'clientAdded_'+index} style={styles.createGroupAddedBubbleContainer}>
                          <View style={[styles.createGroupAddedBubbleUser,avStyle]}>
                            <Text style={styles.createGroupAddedBubbleTextInner}>+{x}</Text>
                          </View>
                          <Text style={styles.createGroupAddedBubbleTextBottom}>others</Text>
                        </View>)

                      } else {
                        return (<></>)
                      }

                    })}
                  </View>) || (<View style={styles.createGroupAdded}>
                    <Text style={styles.noClientsSelected}>Select clients below.</Text>
                  </View>)}
                  <View style={[styles.createGroupSpacer,{marginBottom:10}]}></View>
                  <View style={styles.createGroupAddContainer}>
                    <View>
                      <Text style={styles.createGroupError}>{createGroupError}</Text>
                      {showCreateGroupIndicator && (<ActivityIndicatorView />) || (<Button 
                        title='Update'
                        buttonStyle={styles.createGroupButton}
                        titleStyle={{color:'#fff',fontFamily:'Poppins'}}
                        onPress={() => updateGroupTrigger()}
                        disabled={manageSelectedClients.length < 2}
                      />)}
                    </View>
                    <View style={manageHasContents && styles.createGroupAddHeaderHighlight || styles.createGroupAddHeader}>
                      <View style={styles.createGroupAddIcon}>
                        <Icon
                          name='search'
                          type='ionicon'
                          size={28}
                          color={manageHasContents && colors.mainTextColor || colors.headerBorder}
                          style={[{marginLeft:5,marginTop:2}]}
                        />
                      </View>
                      <TextInput 
                        placeholder='Find clients...'
                        style={styles.createGroupAddInput}
                        onChange={(e) => {
                          searchManageGroup(e.currentTarget.value)
                          setManageHasContents((e.currentTarget.value.length > 0))
                        }}
                        className='custom-textinput'
                      />
                    </View>
                    <ScrollView contentContainerStyle={[styles.createGroupList,{height:'100%'}]}
                    showsHorizontalScrollIndicator={false}>
                      {clients.map((client, index) => {

                        if (client.Visible) {

                          return (<View key={'client_'+client.Id} style={[styles.createGroupClient]}>
                            <View>
                              <Image 
                                source={{uri:client.Avatar}}
                                style={styles.createGroupClientAvatar}
                              />
                            </View>
                            <View style={styles.createGroupClientNameContainer}>
                              <Text style={styles.createGroupClientName}>
                                {client.FirstName + ' ' + client.LastName}
                              </Text>
                            </View>
                            <View>
                              {client.Checked && (<Icon
                                name='checkbox'
                                type='ionicon'
                                size={28}
                                color={btnColors.success}
                                style={{}}
                                onPress={() => {
                                  removeManageGroupClient(index)
                                }}
                              />) || (<Icon
                                name='square-outline'
                                type='ionicon'
                                size={28}
                                color={colors.mainTextColor}
                                style={{}}
                                onPress={() => {
                                  addManageGroupClient(index)
                                }}
                              />)}
                            </View>
                          </View>)

                        } else {

                          return (<View key={'client_'+client.Id}></View>)

                        }

                      })}
                    </ScrollView>
                  </View>
                </View>
              </View>)}
            </>)}
          </>) || (<View style={styles.chatArea}>
            <View style={styles.chatMainContainer}>
              {userList[chatIndex].Messages.length > 0 && (<ScrollView contentContainerStyle={[styles.chatMain,{justifyContent:'flex-end',flexGrow:1}]}
              ref={scrollViewRef}
              showsHorizontalScrollIndicator={false}
              onContentSizeChange={(width, height) => {
                setScrollWidth((width-20)-(width/5))
                scrollViewRef.current.scrollToEnd({animated: true})
              }}>
                {userList[chatIndex].Messages.map((message, index) => {

                  // Check whether to put image.
                  var image = message.Image
                  var messageStyle = {}
                  var calcHeight = 0
                  if (image.length > 0) {
                    messageStyle = {
                      borderBottomLeftRadius:0,
                      borderBottomRightRadius:0,
                      width:300,
                      paddingLeft:12,
                      paddingTop:12
                    }
                    Image.getSize(image, (width, height) => {
                      calcHeight = 400*(height/width)
                    })
                  }

                  // Check if image is on it's own.
                  var imageExtraStyle = {}
                  if (message.Text.length == 0) {
                    messageStyle = {
                      height:0,
                      padding:0
                    }
                    imageExtraStyle = {
                      borderTopLeftRadius:25,
                      borderTopRightRadius:25,
                    }
                  }
                  

                  if (message.UserId == coach.Id) {

                    // Me.
                    return (<View key={'messages_'+message.Id} style={styles.messageMain}>
                      {message.TimeAbove.length > 0 && (<View style={styles.timeContainer}>
                        <Text style={styles.timeText}>{message.TimeAbove}</Text>
                      </View>)}
                      <View key={'messages_'+message.Id} style={styles.messageContainerMe}>
                        <View style={styles.messageMe}>
                          <View style={styles.messageInfoMe}>
                            
                          </View>
                          <View style={[styles.mainMessageMe,{maxWidth:scrollWidth},messageStyle]}>
                            <Text style={styles.messageTextMe}>{message.Text}</Text>
                          </View>
                          {image.length > 0 && (<TouchableOpacity onPress={() => viewImage(image)}>
                            <Image 
                              source={{ uri: image }}
                              style={[
                                imageExtraStyle,
                                {
                                  width:300,
                                  height:300,
                                  aspectRatio:1,
                                  borderBottomLeftRadius:25,
                                  borderBottomRightRadius:25,
                                }
                              ]}
                            />
                          </TouchableOpacity>)}
                          <View style={styles.messageReactionsMe}>

                          </View>
                        </View>
                      </View>
                    </View>)

                  } else {

                    // Not me.
                    return (<View key={'messages_'+message.Id} style={styles.messageMain}>
                      {message.TimeAbove.length > 0 && (<View style={styles.timeContainer}>
                        <Text style={styles.timeText}>{message.TimeAbove}</Text>
                      </View>)}
                      <View style={styles.messageContainerYou}>
                        <View style={styles.showAvatarYou}>
                          {message.ShowAvatar && (<Image 
                            source={{ uri: message.TheirAvatar }}
                            style={styles.avatarYou}
                          />)}
                        </View>
                        <View style={styles.messageYou}>
                          {message.ShowAvatar && (<View>
                            <Text style={styles.messageNameYou}>{message.TheirHeaderText}</Text>
                          </View>)}
                          <View style={[styles.mainMessageYou,{maxWidth:scrollWidth},messageStyle]}>
                            <Text style={styles.messageTextYou}>{message.Text}</Text>
                          </View>
                          {image.length > 0 && (<TouchableOpacity onPress={() => viewImage(image)}>
                            <Image 
                              source={{ uri: image }}
                              style={[
                                imageExtraStyle,
                                {
                                  width:300,
                                  height:300,
                                  aspectRatio:1,
                                  borderBottomLeftRadius:25,
                                  borderBottomRightRadius:25,
                                }
                              ]}d
                            />
                          </TouchableOpacity>)}
                          <View style={styles.messageReactionsYou}>

                          </View>
                        </View>
                      </View>
                    </View>)

                  }

                })}
                {isSending && (<ActivityIndicatorView />)}
                <div style={{ float:"left", clear: "both" }}
                  ref={messagesEnd}>
                </div>
              </ScrollView>) || (<View style={[styles.chatMain,{paddingTop:20}]}>
                <Text style={styles.chatInfoText}>No messages yet.</Text>
              </View>)}
              {showAttachmentField && (<View style={styles.attachmentField}>
                {showAttachButton && (<>
                <Button 
                  title='Attach Image'
                  onPress={() => handleClick()}
                  buttonStyle={styles.attachButton}
                  containerStyle={styles.attachButtonContainer}
                />
                <Button 
                  title='More options coming soon!'
                  disabled={true}
                  buttonStyle={styles.moreComingButton}
                  containerStyle={styles.moreComingButtonContainer}
                />
                </>) ||
                (<>
                  {showAttachIndicator && (<ActivityIndicatorView />) ||
                  (<View style={styles.attachmentFieldImagePreview}>
                    {attachmentLink.length > 0 && (<View style={{justifyContent:'center'}}>
                      <TouchableOpacity onPress={() => viewImage(attachmentLink)}>
                        <Image
                          source={{uri:attachmentLink}}
                          style={styles.attachmentImagePreview}
                        />
                      </TouchableOpacity>
                    </View>)}
                    {attachError.length > 0 && (<View style={styles.attachErrorContainer}>
                      <Text style={styles.attachError}>{attachError}</Text>
                      <Button 
                        title='Try Again'
                        buttonStyle={styles.resetAttachButton}
                        titleStyle={styles.resetAttachButtonTitle}
                        onPress={() => resetAttach()}
                      />
                    </View>)}
                  </View>)}
                </>)}
              </View>)}
              <input type="file" ref={hiddenFileInput} onChange={handleFile} style={{display:'none'}} />
              <View style={!showAttachmentField && [styles.chatInputContainer,{borderTopRightRadius:10}] || styles.chatInputContainer}>
                <TouchableOpacity style={styles.chatInputAttachIconContainer}>
                  {showAttachmentField && (<Icon
                    name='close'
                    type='ionicon'
                    size={28}
                    color={btnColors.danger}
                    style={{}}
                    onPress={() => discardAttach()}
                  />) || (<Icon
                    name='document-attach'
                    type='ionicon'
                    size={28}
                    color={colors.mainTextColor}
                    style={{}}
                    onPress={() => attachImage()}
                  />)}
                </TouchableOpacity>
                <View style={styles.chatMessageBoxContainer}>
                  <TextInput 
                    ref={textInput}
                    style={[styles.chatMessageBox,{ height: scrollHeight }]}
                    placeholder='Message...'
                    multiline={true}
                    numberOfLines={1}
                    onChange={(e) => {
                      if (e.currentTarget.value.length < 4) {
                        setScrollHeight(null)
                      } else if (e.target.scrollHeight - scrollHeight > 50) {
                        setScrollHeight(e.target.scrollHeight)
                      }
                    }}
                    onBlur={handleBlur}
                  />
                </View>
                <View style={styles.chatMessageSubmitButtonContainer}>
                  <Button 
                    title='Send'
                    buttonStyle={styles.chatMessageSubmitButton}
                    titleStyle={styles.chatMessageSubmitButtonTitle}
                    onPress={() => sendMessage()}
                    disabled={isSending || sendButtonDisabled}
                  />
                </View>
              </View>
            </View>
            <View style={styles.chatSummary}>
              {userList[chatIndex].ClientData.length > 2 && (<View style={styles.chatSummaryMainImage}>
                <Icon 
                  name='people'
                  type='ionicon'
                  size={40}
                  color={'#fff'}
                />
              </View>) || (<Image
                source={{uri:userList[chatIndex].ClientData[0].Avatar}}
                style={styles.chatSummaryMainImage}
              />)} 
              <Text style={styles.chatSummaryTitle}>{generateChatName(userList[chatIndex].ClientData, userList[chatIndex].Title, 0, true)}</Text>
              {userList[chatIndex].ClientData.length > 2 && (<View style={styles.groupMembers}>
                <View style={styles.groupOwner}>
                  <View style={styles.groupOwnerAvatarContainer}>
                    <Image 
                      source={{uri:coach.Avatar}}
                      style={styles.groupOwnerAvatar}
                    />
                  </View>
                  <Text style={styles.groupOwnerTitle}>
                    Coach
                  </Text>
                </View>
                <View style={{flex:1,marginLeft:20,}}>
                  <ChatAvatars 
                    clientData={userList[chatIndex].ClientData}
                    coach={coach}
                    styles={styles}
                  />
                  <Button 
                    title='Manage'
                    onPress={() => openManageGroup()}
                    buttonStyle={styles.groupManageButton}
                    titleStyle={styles.groupManageButtonTitle}
                  />
                </View>
              </View>)}
              <View style={styles.templateTitleContainer}>
                <TouchableOpacity style={{flexDirection:'row',justifyContent:'space-between',width:'100%'}} onPress={() => openAddTemplate()}>
                  <Text style={styles.templateTextTitle}>Templates</Text>
                  <Icon
                    name='add'
                    type='ionicon'
                    size={28}
                    color={colors.mainTextColor}
                    style={{}}
                    
                  />
                </TouchableOpacity>
              </View>
              {templates.length > 0 && (<View style={{flex:1,width:'100%'}}>
                <View style={templateSearchHasContents && [styles.createGroupAddHeaderHighlight,{marginBottom:10,width:'100%'}] || [styles.createGroupAddHeader,{marginBottom:10,width:'100%'}]}>
                  <View style={styles.createGroupAddIcon}>
                    <Icon
                      name='search'
                      type='ionicon'
                      size={28}
                      color={templateSearchHasContents && colors.mainTextColor || colors.headerBorder}
                      style={[{marginLeft:5,marginTop:2}]}
                    />
                  </View>
                  <TextInput 
                    placeholder='Find templates...'
                    style={styles.createGroupAddInput}
                    onChange={(e) => {
                      searchTemplates(e.currentTarget.value)
                      setTemplateSearchHasContents((e.currentTarget.value.length > 0))
                    }}
                    className='custom-textinput'
                  />
                </View>
                <ScrollView showsHorizontalScrollIndicator={false}>
                  {templates.map((template, index) => {
                    
                    if (template.Visible) {
                      return (<View style={styles.templateRow} key={'templateManage_'+index}>
                        <TouchableOpacity style={styles.templateContainer}
                          onPress={() => copyTemplate(index)}
                        >
                          <Text style={[styles.mainMessageMe,{alignSelf:'flex-start',maxWidth:400,marginLeft:10}]}>
                            {template.Message}
                          </Text>
                        </TouchableOpacity>
                      </View>)
                    }

                  })}
                </ScrollView>
              </View>) || (<View style={{paddingTop:10}}>
              <Text style={styles.chatInfoText}>No templates yet.</Text>
              </View>)}
            </View>
          </View>)}
        </>) || (<View>
          <Text style={styles.infoTitle}>Add clients to message.</Text>
        </View>)}
      </View>)}
    </ScrollView>
  </View>)
}
