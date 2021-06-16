import { StatusBar } from 'expo-status-bar'
import React, { useEffect, useState, useContext } from 'react'
import { ScrollView, StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native'
import { allClientsLight, colorsLight, innerDrawerLight, btnColors } from '../Scripts/Styles.js'
import { allClientsDark, colorsDark, innerDrawerDark } from '../Scripts/Styles.js'
import { useLinkTo } from '@react-navigation/native'
import LoadingScreen from '../Scripts/LoadingScreen.js'
import ActivityIndicatorView from '../Scripts/ActivityIndicatorView.js'
import { TextInput } from 'react-native-web'
import { set, get, getTTL, ttl } from './Storage.js'
import { Icon, Button, ButtonGroup, Chip } from 'react-native-elements'
import { confirmAlert } from 'react-confirm-alert' // Import
import 'react-confirm-alert/src/react-confirm-alert.css' // Import css
import { parseSimpleDateText, sqlToJsDate, getClients } from './API.js'
import { Dropdown, Accordion, Radio } from 'semantic-ui-react'
import DatePicker from 'react-date-picker/dist/entry.nostyle'
import './DatePickerClients/DatePicker.css'

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
  const [showClientData, setShowClientData] = useState(false)

  // Main variables.
  const [coach, setCoach] = useState(user)

  // Stats variables.
  const [clientCount, setClientCount] = useState(0)
  const [activeClientCount, setActiveClientCount] = useState(0)
  const [activeClientCountSuffix, setActiveClientCountSuffix] = useState(' / 3 Active')

  // All clients variables.
  const [rawClients, setRawClients] = useState([])
  const [clients, setClients] = useState([])

  // Client data variables.
  const [clientData, setClientData] = useState({})
  // FirstName, LastName, Email, Avatar, DoB, Created, ConceptsCompletedCnt, PromptsCompletedCnt.

  // All clients functions.
  const refreshClients = async (id, token) => {
    // Get Clients, Programs data.
    var refresh = JSON.parse(JSON.stringify(await getClients(id, token)));
    
    // Supply Selected variable for group management.
    var len = refresh.length;
    var activeLen = 0
    for (var i = 0; i < len; i++) {
      refresh[i].Selected = false
      if (refresh[i].Active == true) {
        activeLen += 1
      }
    }
    setActiveClientCount(activeLen)
    setClientCount(len)
    setClients(refresh)
    generateProgramOptions()
  }

  // Filtering variables.
  const [tags, setTags] = useState([])
  const [tagText, setTagText] = useState('')
  const [email, setEmail] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [created, setCreated] = useState('')
  const [createdChoice, setCreatedChoice] = useState('before')
  const [programs, setPrograms] = useState(['Program 1','Complete This!','Let\'s go!'])
  const [programOptions, setProgramOptions] = useState([])
  const [selectedProgram, setSelectedProgram] = useState('')
  const [filtersOpen, setFiltersOpen] = useState(true)

  // Filtering functions.
  const applyFilters = () => {
    console.log('Applying filters...')
  }

  const clearFilters = () => {
    generateProgramOptions()
    setTagText('')
    setTags([])
    setEmail('')
    setFirstName('')
    setLastName('')
    setCreated('')
    setSelectedProgram('')
  }

  const toggleFilters = () => {
    setFiltersOpen(!filtersOpen)
  }

  const generateProgramOptions = () => {
    console.log('Generating program options...')
    var pList = []
    for (var i = 0; i < programs.length; i++) {
      pList.push({key:programs[i],text:programs[i],value:programs[i]})
    }
    setProgramOptions(pList)
  }

  const addTag = (e) => {
    if (e.key === 'Enter' && tagText.length > 0) {
      var ts = JSON.parse(JSON.stringify(tags))
      ts.push(tagText)
      setTags(ts)
      setTagText('')
    }
  }

  const removeTag = (index) => {
    var ts = JSON.parse(JSON.stringify(tags))
    ts.splice(index, 1)
    setTags(ts)
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
              <Text style={styles.bodyDesc}>View and manage your clients.</Text>
            </View>
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
                  <View style={styles.filterItem}>
                    <Text style={styles.filterItemHeader}>Tags</Text>
                    <TextInput 
                      placeholder='Type a tag then hit Enter...'
                      onChangeText={(t) => setTagText(t)}
                      onKeyPress={addTag}
                      value={tagText}
                      style={styles.inputStyle}
                      placeholderTextColor='#8c9197'
                    />
                  </View>
                  <View style={[styles.filterItem,{marginTop:30,justifyContent:'flex-start',flexDirection:'row',flexWrap:'wrap',paddingRight:5}]}>
                    {tags.length == 0 && 
                    (<></>) || 
                    (<>
                    {tags.map((tag, index) => {
                      return (<View key={'tag_' + index}><Chip 
                        title={tag}
                        icon={{
                          name: 'close-circle',
                          type: 'ionicon',
                          size:16,
                          color: 'white'
                        }}
                        iconStyle={{marginTop:3}}
                        buttonStyle={styles.tag}
                        containerStyle={styles.tagContainer}
                        titleStyle={styles.tagTitle}
                        onPress={() => removeTag(index)}
                        iconRight
                      /></View>)
                    })}
                    </>)}
                  </View>
                  <View style={[styles.filterItem,{marginTop:30,alignItems:'flex-end',flexDirection:'row'}]}>
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
              <Text style={styles.bodySubtitle}>Client List</Text>
              <Text style={styles.bodyDesc}>{clientCount} Total | {activeClientCount + activeClientCountSuffix}</Text>
            </View>
            <View style={styles.clientsControls}>
                  <TouchableOpacity style={styles.clientControlsTouchIcon}>
                    <Icon
                      name='square-outline'
                      type='ionicon'
                      size={20}
                      color={colors.mainTextColor}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.clientControlsTouchClient}>
                    <Text style={[styles.clientsControlsText,{paddingRight:0}]}>Client</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.clientControlsTouchTags}>
                    <Text style={styles.clientsControlsText}>Tags</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.clientControlsTouchCreated}>
                    <Text style={styles.clientsControlsText}>Joined</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.clientControlsTouchControls}>
                    <Text style={styles.clientsControlsText}>Controls</Text>
                  </TouchableOpacity>
                </View>
            <View style={styles.clientList}>
            {clients.length == 0 && (<>
            <Text style={styles.noClients}>No clients found.</Text>
            </>) || 
            (<>
            {clients.map((client, index) => {
              // Client (Avatar, Name, Email), Tags, Created, Controls (Assign Task, Next Program Task, ), 
              return (<View key={index} style={styles.clientRow}>
                <TouchableOpacity style={styles.clientRowTouchIcon}>
                  <Icon
                    name='square-outline'
                    type='ionicon'
                    size={20}
                    color={colors.mainTextColor}
                  />
                </TouchableOpacity>
                <View style={[styles.clientRowTouchClient]}>
                  <Text style={[styles.clientRowText]}>
                    ${(client.Amount/100).toFixed(2)}
                  </Text>
                </View>
                <View style={styles.clientRowTouchTags}>
                  <Text style={styles.clientRowText}>Tags</Text>
                </View>
                <View style={styles.clientRowTouchCreated}>
                  <Text style={styles.clientRowText}>Joined</Text>
                </View>
                <View style={styles.clientRowTouchControls}>
                  <Text style={styles.clientRowText}>Controls</Text>
                </View>
              </View>)
            })}
            </>)}
            </View>
          </View>)}

          {showClientData && (<View style={styles.bodyContainer}>
            <View style={styles.clientInfoRow}>
              <Image uri={clientData.Avatar} style={styles.clientImage} />
              <View style={styles.clientStats}>
                <View style={styles.clientStatGroup}>
                  <Text style={styles.clientStatNum}>{clientData.PromptsCompletedCnt}</Text>
                  <Text style={styles.clientStatDesc}>Prompts</Text>
                </View>
                <View style={styles.clientStatGroup}>
                  <Text style={styles.clientStatNum}>{clientData.ConceptsCompletedCnt}</Text>
                  <Text style={styles.clientStatDesc}>Concepts</Text>
                </View>
                <Text style={styles.clientStatsText}>Completed</Text>
              </View>
            </View>
            <View style={styles.clientInfoRow}>
              <Text style={styles.bodySubtitle}>{clientData.FirstName + ' ' + clientData.LastName}</Text>
              <View style={styles.clientJoined}>
                <Text style={styles.clientJoinedTitle}>Joined</Text>
                <Text style={styles.clientJoinedText}>{parseSimpleDateText(sqlToJsDate(clientData.Created))}</Text>
              </View>
            </View>
          </View>)}

        </View>
      </View>
    </View>
  </ScrollView>)

}
