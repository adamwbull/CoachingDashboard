import { StatusBar } from 'expo-status-bar'
import React, { useEffect, useState, useContext } from 'react'
import { ScrollView, StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native'
import { allClientsLight, colorsLight, innerDrawerLight, btnColors, boxColors } from '../Scripts/Styles.js'
import { allClientsDark, colorsDark, innerDrawerDark } from '../Scripts/Styles.js'
import { useLinkTo } from '@react-navigation/native'
import LoadingScreen from '../Scripts/LoadingScreen.js'
import ActivityIndicatorView from '../Scripts/ActivityIndicatorView.js'
import { TextInput } from 'react-native-web'
import { set, get, getTTL, ttl } from './Storage.js'
import { Icon, Button, ButtonGroup, Chip } from 'react-native-elements'
import { confirmAlert } from 'react-confirm-alert' // Import
import 'react-confirm-alert/src/react-confirm-alert.css' // Import css
import { parseSimpleDateText, sqlToJsDate, getClientsData } from './API.js'
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
  const [programs, setPrograms] = useState([])
  const [tags, setTags] = useState([])
  const [bulkAction, setBulkAction] = useState('')
  const [controlSquareSelected, setControlSquareSelected] = useState(false)

  // Client data variables.
  const [clientData, setClientData] = useState({})
  // FirstName, LastName, Email, Avatar, DoB, Created, ConceptsCompletedCnt, PromptsCompletedCnt.

  // Filtering variables.
  const [searchTags, setSearchTags] = useState([])
  const [email, setEmail] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [created, setCreated] = useState('')
  const [createdChoice, setCreatedChoice] = useState('before')
  const [programOptions , setProgramOptions] = useState([])
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

  // Client data function.
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
              <Text style={styles.bodySubtitle}>Client List</Text>
              <Text style={styles.bodyDesc}>{clientCount} Total | {activeClientCount + activeClientCountSuffix}</Text>
            </View>
            <View style={styles.clientBulkOptions}>
              <Dropdown 
                placeholder="Bulk Actions..."
                selection
                options={[
                  {key:'Assign Task',text:'Assign Task',value:'Assign Task'},
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
                    titleStyle={styles.clientButtonTitle}
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
                    titleStyle={styles.clientButtonTitle}
                  />
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
              <View styNole={styles.clientJoined}>
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
