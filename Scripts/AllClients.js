import { StatusBar } from 'expo-status-bar'
import React, { useEffect, useState, useRef, useContext } from 'react'
import { ScrollView, StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native'
import { allClientsLight, colorsLight, innerDrawerLight, btnColors, boxColors } from '../Scripts/Styles.js'
import { allClientsDark, colorsDark, innerDrawerDark } from '../Scripts/Styles.js'
import { useLinkTo } from '@react-navigation/native'
import LoadingScreen from '../Scripts/LoadingScreen.js'
import ActivityIndicatorView from '../Scripts/ActivityIndicatorView.js'
import { TextInput } from 'react-native-web'
import { set, get, getTTL, ttl } from './Storage.js'
import { Icon, Button, Chip } from 'react-native-elements'
import { confirmAlert } from 'react-confirm-alert' // Import
import 'react-confirm-alert/src/react-confirm-alert.css' // Import css
import { parseSimpleDateText, sqlToJsDate, getClientsData, getNotes, insertNote, updateNote, currentDate } from './API.js'
import { Dropdown, Accordion, Radio, Checkbox, Popup } from 'semantic-ui-react'
import DatePicker from 'react-date-picker/dist/entry.nostyle'
import './DatePickerClients/DatePicker.css'
import JoditEditor from "jodit-react";
import { useSpring, animated } from 'react-spring';

import userContext from './Context.js'

export default function AllClients() {
  
  const linkTo = useLinkTo()
  const user = useContext(userContext)

  const [styles, setStyles] = useState(allClientsLight)
  const [colors, setColors] = useState(colorsLight)

  // Main stage controls.
  const [showActivityIndicator, setActivityIndicator] = useState(true)
  const [showFilters, setShowFilters] = useState(false)
  const [showClients, setShowClients] = useState(false)
  const [showClientProfile, setShowClientProfile] = useState(false)
  const [showNoteForm, setShowNoteForm] = useState(false)
  const [showAssignTask, setShowAssignTask] = useState(false)

  // Main variables.
  const [coach, setCoach] = useState(user)

  // All clients variables.
  const [clientCount, setClientCount] = useState(0)
  const [activeClientCount, setActiveClientCount] = useState(0)
  const [activeClientCountSuffix, setActiveClientCountSuffix] = useState(' / 3 Active')
  const [rawClients, setRawClients] = useState([])
  const [clients, setClients] = useState([])
  const [programs, setPrograms] = useState([])
  const [tags, setTags] = useState([])
  const [bulkAction, setBulkAction] = useState('')
  const [controlSquareSelected, setControlSquareSelected] = useState(false)

  // Assign task variables.
  const [assignClients, setAssignClients] = useState([])
  const [allInProgram, setAllInProgram] = useState(false)
  const [showAssignTaskOptions, setShowAssignTaskOptions] = useState(false)
  const [showAssignTaskButtons, setShowAssignTaskButtons] = useState(true)
  const [assignTaskButtons, setAssignTaskButtons] = useState([
    {
      Title: 'Text Prompt',
      OP: () => {},
      disabled:false
    },
    {
      Title: 'Survey',
      OP: () => {},
      disabled:false
    },
    {
      Title: 'Payment',
      OP: () => {},
      disabled:false
    },
    {
      Title: 'Contract',
      OP: () => {},
      disabled:false
    },
    {
      Title: 'Concept',
      OP: () => {},
      disabled:false
    }
  ])

  const [showSelectProgramToAdvance, setShowSelectProgramToAdvance] = useState(false)
  const [programsUsersAreIn, setProgramsUsersAreIn] = useState([])

  // Client profile variables.
  const [clientData, setClientData] = useState({})
  const [notes, setNotes] = useState([])
  const [tasks, setTasks] = useState([])

  // FirstName, LastName, Email, Avatar, DoB, Created, ConceptsCompletedCnt, PromptsCompletedCnt.

  // Notes variables.
  const [newNote, setNewNote] = useState(false)
  const [noteId, setNoteId] = useState(0)
  const [noteTitle, setNoteTitle] = useState('')
  const editor = useRef(null)
  const editorConfig = {
		readonly: false,
    cleanHTML: true,
    limitChars:3000,
    askBeforePasteHTML:false,
    askBeforePastFromWord:false,
    allowResizeY:true
	}
  const [noteRichText, setNoteRichText] = useState('')
  const [noteSavingIndicator, setNoteSavingIndicator] = useState(false)
  const [savedAnim, setSavedAnim] = useState(false)
  // Filtering variables.
  const [searchTags, setSearchTags] = useState([])
  const [email, setEmail] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [created, setCreated] = useState('')
  const [createdChoice, setCreatedChoice] = useState('before')
  const [programOptions, setProgramOptions] = useState([])
  const [tagOptions, setTagOptions] = useState([])
  const [selectedProgram, setSelectedProgram] = useState('')
  const [filtersOpen, setFiltersOpen] = useState(true)

  // Filtering functions.
  const applyFilters = () => {

    console.log('Applying filters...')
    var newClients = []
    var sourceClients = JSON.parse(JSON.stringify(rawClients))

    for (var i = 0; i < sourceClients.length; i++) {

      var source = sourceClients[i]
      var match = false

      // Check if any of the tags listed are present.
      // Check if email contains a match.
      // Check if first name contains a match.
      // Check if last name begins a match. 
      // Check if created matches.
      // Check if user is in given program.

      if (match) {
        newClients.push(source)
      }

    }

    setClients(newClients)

  }

  const clearFilters = () => {
    generateProgramOptions()
    setSearchTags([])
    setEmail('')
    setFirstName('')
    setLastName('')
    setCreated('')
    setSelectedProgram('')
    setClients(JSON.parse(JSON.stringify(rawClients)))
  }

  const toggleFilters = () => {
    setFiltersOpen(!filtersOpen)
  }

  const generateProgramOptions = (programs) => {
    var pList = []
    for (var i = 0; i < programs.length; i++) {
      pList.push({key:programs[i].Id,text:programs[i].Title,value:programs[i].Id})
    }
    setProgramOptions(pList)
  }

  const generateTagOptions = (tags) => {
    var list = []
    for (var i = 0; i < tags.length; i++) {
      var tag = tags[i]
      list.push({key:tag.Id,text:tag.Title,value:tag.Title+'_'+tag.Id})
    }
    setTagOptions(list)
  }

  const selectTags = (e, d) => {
    setSearchTags(e.value)
  }

  const selectCreated = (t) => {
    setCreated(t)
  }

  const selectCreatedChoice = (e, { value }) => {
    setCreatedChoice(value)
  }

  const selectProgram = (e, d) => {
    setSelectedProgram(d.value)
  }

  // Bulk action functions.
  const selectBulkAction = (e, d) => {
    setBulkAction(d.value)
  }

  const executeBulkAction = () => {
    if (bulkAction != '') {
      //
    }
  }

  const selectAllClients = () => {

    var target = !controlSquareSelected
    var newClients = JSON.parse(JSON.stringify(clients))

    for (var i = 0; i < newClients.length; i ++) {
      newClients[i].Selected = target
    }

    setClients(newClients)
    setControlSquareSelected(target)

  }

  const selectClient = (index) => {
    
    var newClients = JSON.parse(JSON.stringify(clients))

    for (var i = 0; i < newClients.length; i ++) {
      if (i == index) {
        newClients[i].Selected = !newClients[i].Selected
      }
    }

    setClients(newClients)

  }

  // Assign tasks functions.

  // Client profile functions.
  const refreshClientData = async (clientId) => {
    // Get notes.
    var ns = await getNotes(clientId, coach.Id, coach.Token)
    setNotes(ns)
  }

  const viewClientProfile = (index) => {
    // Get the data we already have and do normal switch view logic.
    var newClients = JSON.parse(JSON.stringify(clients))
    newClients[index].Index = index
    refreshClientData(newClients[index].Id)
    setClientData(newClients[index])
    setShowClients(false)
    setShowFilters(false)
    setActivityIndicator(true)
    setTimeout(() => {
      setActivityIndicator(false)
      setShowClientProfile(true)
    }, 500)
  }

  const viewAssignTask = (indexes) => {
    setShowFilters(false)
    setShowClients(false)
    setShowClientProfile(false)
    setActivityIndicator(true)
    // Get targeted clients.
    var newClients = JSON.parse(JSON.stringify(clients))
    var newAssignClients = JSON.parse(JSON.stringify(assignClients))
    for (var i = 0; i < newClients.length; i++) {
      if (indexes.includes(newClients[i].Index)) {
        newAssignClients.push(newClients[i])
      }
    }
    // Loop through to check if assignTaskButtons needs to be updated.
    for (var j = 0; j < assignTaskButtons.length; j++) {
       
    }
    setAssignClients(newAssignClients)
    setAllInProgram(false)
    setTimeout(() => {
      setActivityIndicator(false)
      setShowAssignTask(true)
    }, 150)
  }

  const openMessages = () => {
    
  }

  const confirmSingleToggleActive = () => {

  }

  // Notes functions.
  const addNewNote = () => {
    setNewNote(true)
    setNoteId(0)
    setNoteTitle('')
    setNoteRichText('')
    setShowClientProfile(false)
    setActivityIndicator(true)
    setTimeout(() => {
      setActivityIndicator(false)
      setShowNoteForm(true)
    }, 500)
  }

  const editNote = (index) => {
    var n = notes[index]
    setNewNote(false)
    setNoteId(n.Id)
    setNoteTitle(n.Title)
    setNoteRichText(n.RichText)
    setShowClientProfile(false)
    setActivityIndicator(true)
    setTimeout(() => {
      setActivityIndicator(false)
      setShowNoteForm(true)
    }, 500)
  }

  const saveNote = async () => {

    setNoteSavingIndicator(true)

    // Save note remotely.
    var saved = false
    if (newNote) {
      saved = await insertNote(coach.Token, coach.Id, clientData.Id, noteTitle, noteRichText)
      console.log('insert ret:',saved)
      setSavedAnim(true)
      setNoteSavingIndicator(false)
      setNoteId(saved)
      setNewNote(false)
      // Add note to list locally.
      var newNotes = JSON.parse(JSON.stringify(notes))
      var date = currentDate()
      var ins = {}
      ins.Id = saved
      ins.Title = noteTitle
      ins.RichText = noteRichText
      ins.Created = date
      ins.LastUpdated = date
      newNotes.unshift(ins)
      setNotes(newNotes)
    } else {
      saved = await updateNote(coach.Token, coach.Id, noteId, noteTitle, noteRichText)
      setSavedAnim(true)
      setNoteSavingIndicator(false)
    }

    // Show saved text and fade.
    setTimeout(() => {
      setSavedAnim(false)
    }, 500)
  }

  // Animations and copy functions.
  const AnimatedText = animated(Text);

  const fadeStylesSaved = useSpring({
    from: { opacity: 0,textAlign:'center',fontFamily:'Poppins',fontSize:18,color:btnColors.success },
    to: {
      textAlign:'center',fontFamily:'Poppins',fontSize:18,color:btnColors.success,
      opacity: savedAnim ? 1 : 0
    }
  })

  const navToProfileFromNoteForm = () => {
    setShowNoteForm(false)
    setActivityIndicator(true)
    setTimeout(() => {
      setActivityIndicator(false)
      setShowClientProfile(true)
    }, 500)
  }

  // Main functions.
  const navToMainFromProfile = () => {
    setShowClientProfile(false)
    setActivityIndicator(true)
    setTimeout(() => {
      setActivityIndicator(false)
      setShowFilters(true)
      setShowClients(true)
    }, 500)
  }

  const navToMainFromAssignTask = () => {
    setShowAssignTask(false)
    setShowAssignTaskButtons(true)
    setShowSelectProgramToAdvance(false)
    setActivityIndicator(true)
    setTimeout(() => {
      setActivityIndicator(false)
      setShowFilters(true)
      setShowClients(true)
    }, 150)
  }

  const refreshClients = async (id, token) => {

    // Get Clients, Programs data.
    var refresh = JSON.parse(JSON.stringify(await getClientsData(id, token)));
    console.log('refresh:',refresh)
    // Supply Selected variable for group management.
    var len = refresh[1].length;
    var activeLen = 0
    for (var i = 0; i < len; i++) {
      refresh[1][i].Selected = false
      if (refresh[1][i].Active == true) {
        activeLen += 1
      }
    }
    // minus one for the coach's test account
    setActiveClientCount(activeLen-1)
    setClientCount(len-1)
    setClients(refresh[1])
    setRawClients(refresh[1])
    generateProgramOptions(refresh[0])
    generateTagOptions(refresh[2])
    setPrograms(refresh[0])
    setTags(refresh[2])

  }

  useEffect(() => {
    console.log('Welcome to all clients.')
    if (coach != null) {
      refreshClients(coach.Id, coach.Token)
      // Stats info calculations. //
      var plan = coach.Plan
      if (plan == 1) {
        setActiveClientCountSuffix(' / 10 Active')
      } else if (plan == 2) {
        setActiveClientCountSuffix(' Active')
      }
      // ------------------------ //
      setTimeout(() => {
        setActivityIndicator(false)
        setShowFilters(true)
        setShowClients(true)
      }, 500)
    }
  }, [])

  return (<ScrollView contentContainerStyle={styles.scrollView}>
    <View style={styles.container}>
      <View style={styles.main}>
        <View style={styles.body}>

          <View style={styles.bodyHeader}>
            <View style={styles.bodyTitleGroup}>
              <Text style={styles.bodyTitle}>Clients</Text>
              <Text style={styles.bodyDesc}>View and manage your client database.</Text>
            </View>
            <Text>
            {showClientProfile && (<>
            <TouchableOpacity onPress={navToMainFromProfile}><Text>Clients</Text></TouchableOpacity>
            <Text>{' / ' + clientData.FirstName + ' ' + clientData.LastName}</Text>
            </>)}
            </Text>
          </View>

          {showActivityIndicator && (<ActivityIndicatorView />)}

          {showFilters && (<View style={[styles.bodyContainer,{zIndex : 1000}]}>
            <Accordion>
              <Accordion.Title active={filtersOpen} onClick={toggleFilters}>
                <View style={styles.filterTitleContainer}>
                  {filtersOpen && (<>
                  <Icon
                    name='caret-down'
                    type='ionicon'
                    size={18}
                    color={colors.secondaryTextColor}
                    style={{}}
                  />
                  </>) || (<>
                  <Icon
                    name='caret-forward'
                    type='ionicon'
                    size={18}
                    color={colors.secondaryTextColor}
                    style={{}}
                  />
                  </>)}
                  <Text style={styles.filterTitle}>FILTERS</Text>
                </View>
              </Accordion.Title>
              <Accordion.Content active={filtersOpen}>
                <View style={styles.filterRow}>
                  <View style={styles.filterItem}>
                    <Text style={styles.filterItemHeader}>Email</Text>
                    <TextInput 
                      placeholder='Email contains...'
                      onChangeText={(t) => setEmail(t)}
                      value={email}
                      style={styles.inputStyle}
                      placeholderTextColor='#8c9197'
                    />
                  </View>
                  <View style={styles.filterItem}>
                    <Text style={styles.filterItemHeader}>First Name</Text>
                    <TextInput 
                      placeholder='First name contains...'
                      onChangeText={(t) => setFirstName(t)}
                      value={firstName}
                      style={styles.inputStyle}
                      placeholderTextColor='#8c9197'
                    />
                  </View>
                  <View style={styles.filterItem}>
                    <Text style={styles.filterItemHeader}>Last Name</Text>
                    <TextInput 
                      placeholder='Last name contains...'
                      onChangeText={(t) => setLastName(t)}
                      value={lastName}
                      style={styles.inputStyle}
                      placeholderTextColor='#8c9197'
                    />
                  </View>
                  <View style={styles.filterItem}>
                    <View style={styles.filterTitleRow}>
                      <Text style={[styles.filterItemHeader,{marginRight:10}]}>Joined</Text>
                      <Radio
                        label='before'
                        name='radioGroup'
                        value='before'
                        checked={createdChoice === 'before'}
                        onChange={selectCreatedChoice}
                      />
                      <Radio
                        label='after'
                        name='radioGroup'
                        value='after'
                        checked={createdChoice === 'after'}
                        onChange={selectCreatedChoice}
                      />
                    </View>
                    <DatePicker
                      onChange={selectCreated}
                      value={created}
                      className={'react-date-picker-clients'}
                      monthPlaceholder='mm'
                      dayPlaceholder='dd'
                      yearPlaceholder='yyyy'
                      disableCalendar={true}
                    />
                  </View>
                </View>
                <View style={styles.filterRow}>
                  <View style={styles.filterItem}>
                    <Text style={styles.filterItemHeader}>Program</Text>
                    <Dropdown 
                      placeholder="Choose existing program..."
                      search
                      selection
                      options={programOptions}
                      className={'program'}
                      onChange={(e, d) => selectProgram(e, d)}
                      value={selectedProgram}
                    />
                  </View>
                  <View style={[styles.filterItem,{flex:2}]}>
                    <Text style={styles.filterItemHeader}>Tags</Text>
                    <Dropdown 
                      placeholder="Choose tags..."
                      fluid
                      multiple
                      selection
                      options={tagOptions}
                      className={'tags'}
                      onChange={(e, d) => selectTags(e, d)}
                    />
                  </View>
                  <View style={[styles.filterItem,{marginTop:25,alignItems:'flex-end',flexDirection:'row'}]}>
                    <Button 
                      title='Reset'
                      buttonStyle={styles.filterResetButton}
                      containerStyle={styles.filterButtonContainer}
                      titleStyle={styles.filterResetButtonTitle}
                      onPress={clearFilters}
                    />
                    <Button 
                      title='Apply'
                      buttonStyle={styles.filterApplyButton}
                      containerStyle={styles.filterButtonContainer}
                      onPress={applyFilters}
                    />
                  </View>
                </View>
              </Accordion.Content>
            </Accordion>
          </View>)}

          {showClients && (<View style={[styles.bodyContainer]}>
            <View style={styles.clientHeader}>
              <View style={styles.clientHeaderLeft}>
                <Text style={styles.bodySubtitle}>Client List</Text>
                <Text style={styles.bodyDesc}>{clientCount} Total | {activeClientCount + activeClientCountSuffix}</Text>
              </View>
              <Icon
                name='help-circle-outline'
                type='ionicon'
                size={30}
                color={colors.mainTextColor}
                style={{}}
                onPress={() => window.open('https://wiki.coachsync.me/en/clients', '_blank')}
              />
            </View>
            <View style={styles.clientBulkOptions}>
              <Dropdown 
                placeholder="Bulk Actions..."
                selection
                options={[
                  {key:'Assign Task',text:'Assign Task',value:'Assign Task'},
                  {key:'Next Program Task',text:'Next Program Task',value:'Next Program Task'},
                  {key:'Toggle Active',text:'Toggle Active',value:'Toggle Active'},
                ]}
                onChange={(e, d) => selectBulkAction(e, d)}
                value={bulkAction}
              />
              <Button 
                title='Apply'
                buttonStyle={styles.clientBulkApplyButton}
                containerStyle={styles.clientBulkApplyButtonContainer}
                titleStyle={styles.clientBulkApplyButtonTitle}
                onPress={executeBulkAction}
              />
            </View>
            <View style={styles.clientsControls}>
              <TouchableOpacity 
                style={styles.clientControlsTouchIcon}
                onPress={selectAllClients}
              >
                {controlSquareSelected && (<Icon
                  name='checkbox'
                  type='ionicon'
                  size={20}
                  color={colors.mainTextColor}
                />) || (<Icon
                  name='square-outline'
                  type='ionicon'
                  size={20}
                  color={colors.mainTextColor}
                />)}
              </TouchableOpacity>
              <TouchableOpacity style={styles.clientControlsTouchClient}>
                <Text style={[styles.clientsControlsText,{paddingRight:0}]}>Client</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.clientControlsTouchTags}>
                <Text style={styles.clientsControlsText}>Programs & Tags</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.clientControlsTouchCreated}>
                <Text style={styles.clientsControlsText}>Joined</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.clientControlsTouchControls}>
                <Text style={styles.clientsControlsText}>Actions</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.clientList}>
            {clients.length == 0 && (<>
            <Text style={styles.noClients}>No clients found.</Text>
            </>) || 
            (<>
            {clients.map((client, index) => {
              // Client (Avatar, Name, Email), Tags, Created, Controls (Assign Task, Statistics), 
              var rowColoring = {}
              var nameSuffix = ''
              if (coach.Id == client.Id) {
                rowColoring = {backgroundColor:'#EAF7FF'}
                nameSuffix = ' (You)'
              }
              // Build programs and tags.
              const chips = []
              for (var i = 0; i < client.ProgramAssocs.length; i++) {
                var program = client.ProgramAssocs[i]
                // Find the title of this program from the main list.
                var title = ''
                for (var j = 0; j < programs.length; j++) {
                  var p = programs[j]
                  if (p.Id == program.ProgramId) {
                    title = p.Title
                    break
                  }
                }
                chips.push({Title:title,Type:0})
              }
              for (var i = 0; i < client.TagAssocs.length; i++) {
                var tag = client.TagAssocs[i]
                // Find the title of this program from the main list.
                var title = ''
                for (var j = 0; j < tags.length; j++) {
                  var t = tags[j]
                  if (t.Id == tag.TagId) {
                    title = t.Title
                    break
                  }
                }
                chips.push({Title:title,Type:1})
              }
              //console.log('client:',client)
              return (<View key={index} style={[styles.clientRow,rowColoring]}>
                <TouchableOpacity 
                  style={styles.clientRowTouchIcon}
                  onPress={() => selectClient(index)}
                >
                  {client.Selected && (<Icon
                    name='checkbox'
                    type='ionicon'
                    size={20}
                    color={colors.mainTextColor}
                  />) || (<Icon
                    name='square-outline'
                    type='ionicon'
                    size={20}
                    color={colors.mainTextColor}
                  />)}
                </TouchableOpacity>
                <View style={[styles.clientRowTouchClient]}>
                  <View style={styles.clientAvatarContainer}>
                    <Image 
                      source={{ uri: client.Avatar }}
                      style={styles.clientAvatar}
                    />
                  </View>
                  <View>
                    <Text style={[styles.clientName]}>
                      {client.FirstName + ' ' + client.LastName + nameSuffix}
                    </Text>
                    <Text style={[styles.clientEmail]}>
                      {client.Email}
                    </Text>
                  </View>
                </View>
                <View style={styles.clientRowTouchTags}>
                  {chips.length == 0 && (<Text style={styles.clientRowText}>No programs or tags yet.</Text>) ||
                  (<>
                    {chips.map((chip, index) => {
                      if (chip.Type == 0) {
                        return (<View key={'chip_' + index}>
                          <Chip 
                            title={chip.Title}
                            icon={{
                              name: 'documents-outline',
                              type: 'ionicon',
                              size:16,
                              color: 'white'
                            }}
                            iconStyle={{marginTop:3}}
                            buttonStyle={[styles.tag,{backgroundColor:btnColors.success}]}
                            containerStyle={styles.tagContainer}
                            titleStyle={styles.tagTitle}
                          />
                      </View>)
                      } else {
                        return (<View key={'chip_' + index}>
                          <Chip 
                            title={chip.Title}
                            iconStyle={{marginTop:3}}
                            buttonStyle={[styles.tag,{backgroundColor:colorsLight.mainTextColor}]}
                            containerStyle={styles.tagContainer}
                            titleStyle={styles.tagTitle}
                          />
                        </View>)
                      }
                    })}
                  </>)}
                </View>
                <View style={styles.clientRowTouchCreated}>
                  <Text style={styles.clientRowText}>{parseSimpleDateText(sqlToJsDate(client.Created))}</Text>
                </View>
                <View style={styles.clientRowTouchControls}>
                  <Button 
                    title='Assign Task'
                    icon={{
                      name: 'document',
                      size: 16,
                      type: 'ionicon',
                      color:'#fff',
                      style: {
                        marginTop:2
                      }
                    }}
                    iconRight
                    buttonStyle={styles.clientAssignTask}
                    titleStyle={styles.clientRowButtonTitle}
                    onPress={() => viewAssignTask([index])}
                  />
                  <Button 
                    title='Profile'
                    icon={{
                      name: 'person',
                      size: 16,
                      type: 'ionicon',
                      color:'#fff',
                      style: {
                        marginTop:2
                      }
                    }}
                    iconRight
                    buttonStyle={styles.clientProfileButton}
                    titleStyle={styles.clientRowButtonTitle}
                    onPress={() => viewClientProfile(index)}
                  />
                </View>
              </View>)
            })}
            </>)}
            </View>
          </View>)}

          {showClientProfile && (<>
          <View style={styles.bodyRow}>
            <View style={styles.bodyColumn}>
              <View style={styles.bodyContainer}>
                <View style={styles.clientInfoRow}>
                  <View style={styles.clientInfoHeaderContainer}>
                    <Icon
                      name='chevron-back'
                      type='ionicon'
                      size={30}
                      color={colors.secondaryTextColor}
                      style={{marginRight:0}}
                      onPress={navToMainFromProfile}
                    />
                    <Image source={{ uri: clientData.Avatar }} style={styles.clientImage} />
                    <View style={styles.clientInfoHeader}>
                      <Text style={[styles.bodySubtitle,{lineHeight:20}]}>{clientData.Id == coach.Id && clientData.FirstName + ' ' + clientData.LastName + ' (You)' || clientData.FirstName + ' ' + clientData.LastName}</Text>
                      <Text style={styles.clientJoinedTitle}>Joined {parseSimpleDateText(sqlToJsDate(clientData.Created))}</Text>
                    </View>
                  </View>
                </View>
                <View style={styles.clientInformation}>
                  <View style={styles.clientInformationRow}>
                    <Text style={styles.clientInformationRowTitle}>Prompts Completed</Text>
                    <Text style={styles.clientInformationRowText}>{clientData.PromptsCompletedCnt}</Text>
                  </View>
                  <View style={styles.clientInformationRow}>
                    <Text style={styles.clientInformationRowTitle}>Concepts Completed</Text>
                    <Text style={styles.clientInformationRowText}>{clientData.ConceptsCompletedCnt}</Text>
                  </View>
                  <View style={styles.clientInformationRow}>
                    <Text style={styles.clientInformationRowTitle}>Email</Text>
                    <Text style={styles.clientInformationRowText}>{clientData.Email}</Text>
                  </View>
                  <View style={[styles.clientInformationRow,{borderBottomWidth:0}]}>
                    <Text style={styles.clientInformationRowTitle}>Birthday</Text>
                    <Text style={styles.clientInformationRowText}>{parseSimpleDateText(sqlToJsDate(clientData.DoB))}</Text>
                  </View>
                </View>
                <View style={styles.clientButtonRow}>
                  <Button 
                    title='Toggle Active'
                    buttonStyle={clientData.Active && styles.clientButtonActive || styles.clientButtonInactive}
                    containerStyle={styles.clientButtonContainer}
                    titleStyle={clientData.Active && styles.clientButtonTitleActive || styles.clientButtonTitleInactive}
                    onPress={confirmSingleToggleActive}
                  />
                  <Button 
                    title='Send Message'
                    buttonStyle={styles.clientButton}
                    containerStyle={styles.clientButtonContainer}
                    titleStyle={styles.clientButtonTitle}
                    onPress={openMessages}
                  />
                </View>
              </View>
              <View style={[styles.bodyContainer]}>
                <View style={styles.clientNotesHeader}>
                  <Text style={[styles.clientNotesHeaderTitle]}>Client Notes</Text>
                  <Button 
                    title='New Note'
                    icon={
                      <Icon 
                        name='add'
                        type='ionicon'
                        size={20}
                        color='#fff'
                      />
                    }
                    buttonStyle={styles.notesAddNewButton}
                    containerStyle={styles.notesAddNewButtonContainer}
                    titleStyle={styles.notesAddNewButtonTitle}
                    onPress={addNewNote}
                    iconRight
                  />
                </View>
                {notes.length == 0 && (<Text style={styles.noClients}>No notes yet.</Text>)
                || (<>
                {notes.map((note, index) => {
                  //
                  return (<TouchableOpacity 
                    key={'notes_' + index} style={styles.noteRow}
                    onPress={() => editNote(index)}
                  >
                    <Text style={styles.noteTitle}>{note.Title}</Text>
                    <View style={styles.noteDates}>
                      {note.Created != note.LastUpdated && (<Text style={styles.noteDate}>Updated {parseSimpleDateText(sqlToJsDate(note.LastUpdated))}</Text>) ||
                      (<Text style={styles.noteDate}>Created {parseSimpleDateText(sqlToJsDate(note.Created))}</Text>)}
                    </View>
                    <Icon 
                      name='chevron-forward'
                      type='ionicon'
                      size={30}
                      color={colors.mainTextColor}
                    />
                  </TouchableOpacity>)
                })}
                </>)}
              </View>
            </View>
            <View style={styles.bodyColumn}>
              <View style={[styles.bodyContainer]}>
                <View style={styles.clientNotesHeader}>
                  <Text style={[styles.clientNotesHeaderTitle]}>Client Tasks</Text>
                  <Button 
                    title='Assign Task'
                    icon={
                      <Icon 
                        name='document'
                        type='ionicon'
                        size={20}
                        color='#fff'
                      />
                    }
                    buttonStyle={styles.notesAddNewButton}
                    containerStyle={styles.notesAddNewButtonContainer}
                    titleStyle={styles.notesAddNewButtonTitle}
                    onPress={() => viewAssignTask([clientData.Index])}
                    iconRight
                  />
                </View>
                {tasks.length == 0 && (<Text style={styles.noClients}>No tasks yet.</Text>)
                || (<>
                {tasks.map((task, index) => {
                  //
                  return (<View key={'task_'+index}>
                  </View>)
                })}
                </>)}
              </View>
            </View>
          </View>
          </>)} 

          {showNoteForm && (<View style={styles.bodyContainer}>
            <View style={[styles.clientRowTouchControls,{marginBottom:10,borderBottomColor:colorsLight.headerBorder,borderBottomWidth:1}]}>
              <Icon
                name='chevron-back'
                type='ionicon'
                size={25}
                color={colors.secondaryTextColor}
                style={{marginRight:0}}
                onPress={navToProfileFromNoteForm}
              />
              <Text style={[styles.bodySubtitle,{fontSize:24}]}>{newNote && 'New' || 'Edit'} Note</Text>
            </View>
            <Text style={[styles.inputLabel,{marginBottom:3}]}>Note Title</Text>
            <TextInput 
              style={styles.inputStyle}
              placeholder='ex. Session #5 Notes'
              onChangeText={(t) => setNoteTitle(t)}
              value={noteTitle}
            />
            <Text style={[styles.inputLabel,{marginTop:10,marginBottom:2}]}>Body</Text>
            <JoditEditor
             	ref={editor}
              value={noteRichText}
              config={editorConfig}
 		          tabIndex={1}
 		          onBlur={newContent => setNoteRichText(newContent)}
            />
            <View style={styles.noteSubmitButtonRow}>
              <Button 
                title={newNote && 'Save' || 'Update'}
                buttonStyle={styles.filterApplyButton}
                containerStyle={[styles.filterButtonContainer,{marginLeft:0,marginTop:20,padding:0}]}
                onPress={saveNote}
                disabled={noteSavingIndicator}
              />
            </View>
            {noteSavingIndicator && (<ActivityIndicatorView />)}
            <AnimatedText style={fadeStylesSaved}>Saved!</AnimatedText>
          </View>)}

          {showAssignTask && (<View style={{flexDirection:'row'}}>
            <View style={{flex:1}}></View>
            <View style={[styles.bodyContainer,{flex:2}]}>
              <View style={{flexDirection:'row'}}>
                <Icon
                  name='chevron-back'
                  type='ionicon'
                  size={30}
                  color={colors.secondaryTextColor}
                  style={{marginRight:0}}
                  onPress={navToMainFromAssignTask}
                />
                <Text style={[styles.bodySubtitle,{textAlign:'center',fontSize:22,flex:1}]}>Assign Task</Text>
                <Icon
                  name='chevron-forward'
                  type='ionicon'
                  size={30}
                  color={colors.mainBackground}
                  style={{marginRight:0}}
                />
              </View>
              <Text style={[styles.bodyDesc,{textAlign:'center',fontSize:18,marginTop:10,marginBottom:10}]}>
                Currently assigning a task to
                {assignClients.map((c, i) => {
                  var comma = ''
                  if (i != assignClients.length-1) {
                    comma = ','
                  }
                  var period = ''
                  if (i == assignClients.length-1) {
                    period = '.'
                  }
                  
                  if (i == 3) {
                    var count = assignClients.length+1-i
                    return (<Text>{' and '+count+' more.'}</Text>)
                  } else if (i < 3) {
                    return (<Text key={'assign_'+i}>{' '+c.FirstName+' '+c.LastName+comma+period}</Text>)
                  } else {
                    return (<></>)
                  }
                })}
              </Text>
              {showAssignTaskButtons && (<View style={styles.assignTaskButtonsContainer}>
                <Button 
                  title='Assign Single Task'
                  buttonStyle={styles.assignTaskButton}
                  containerStyle={styles.assignTaskButtonContainer}
                  onPress={() => {}}
                />
                {showAssignTaskOptions && (<View style={styles.taskButtonsList}>
                  {assignTaskButtons.map((taskButton, index) => {
                    if (taskButton.disabled) {
                      return (<Popup 
                        position='top center'
                        wide='very'
                        content={'No ' + taskButton.Title + ' tasks created.'}
                        trigger={<Button key={'taskButton_'+index}
                          title={'Assign ' + taskButton.Title + ' Task'}
                          buttonStyle={styles.taskButton}
                          disabled={true}
                        />}
                      />)
                    } else {
                      return (<Button key={'taskButton_'+index}
                        title={taskButton.Title}
                        buttonStyle={styles.taskButton}
                        onPress={taskButton.onPress}
                      />)
                    }
                  })}
                </View>)}
                {allInProgram && (<Button 
                  title='Advance To Next Program Task'
                  buttonStyle={styles.assignTaskButton}
                  containerStyle={styles.assignTaskButtonContainer}
                  onPress={() => {}}
                />) || (<Popup 
                  position='top center'
                  wide='very'
                  content={assignClients.length > 1 && 'Not all users are enrolled in a program.' || 'This user is not enrolled in a program.'}
                  trigger={<Button 
                    title='Advance To Next Program Task'
                    buttonStyle={styles.assignTaskButton}
                    onPress={() => {}}
                    disabled={true}
                  />}
                />)}
              </View>)}
              {showSelectProgramToAdvance && (<View>
                {programs.map((program, index) => {
                  return (<View key={'programAssign_'+index}>
                    <Text style={styles.bodySubtitle}>{program.Title}</Text>
                    <View>
                      {assignProgramAvatars.map()}
                    </View>
                  </View>)
                })}
              </View>)}
            </View>
            <View style={{flex:1}}></View>
          </View>)}

        </View>
      </View>
    </View>
  </ScrollView>)

}
