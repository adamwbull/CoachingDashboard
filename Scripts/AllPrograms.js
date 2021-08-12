import { StatusBar } from 'expo-status-bar'
import React, { useEffect, useState, useContext } from 'react'
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native'
import { programsLight, colorsLight, innerDrawerLight, btnColors } from '../Scripts/Styles.js'
import { homeDark, colorsDark, innerDrawerDark } from '../Scripts/Styles.js'
import { useLinkTo, Link, useFocusEffect } from '@react-navigation/native'
import LoadingScreen from '../Scripts/LoadingScreen.js'
import { Icon, Button } from 'react-native-elements'
import { set, get, getTTL, ttl } from './Storage.js'
import { getClientsData, getPrograms, parseSimpleDateText, sqlToJsDate, createProgramAssocs } from './API.js'
import ActivityIndicatorView from '../Scripts/ActivityIndicatorView.js'
import { Progress } from 'semantic-ui-react'
import { TextInput } from 'react-native-web'

import userContext from './Context.js'

export default function AllPrograms() {

  const linkTo = useLinkTo()
  const user = useContext(userContext)
  
  const [refreshing, setRefreshing] = useState(true)
  const [coach, setCoach] = useState(user)

  // Styling.
  const [styles, setStyles] = useState(programsLight)
  const [colors, setColors] = useState(colorsLight)
  const progressBarColors = [ // 0, 1, 2 index match from API on TasksProgressColor
    btnColors.caution,
    btnColors.primary,
    btnColors.success
  ]

  // Main display variables.
  const [showActivityIndicator, setShowActivityIndicator] = useState(true)
  const [showClientAddSuccessForm, setShowClientAddSuccessForm] = useState(false)
  const [showAll, setShowAll] = useState(false)
  const [showAddClient, setShowAddClient] = useState(false)
  const [showViewProgram, setShowViewProgram] = useState(false)
  const [viewProgramIndex, setViewProgramIndex] = useState(-1)

  // Data.
  const [programs, setPrograms] = useState([])
  const [programGrads, setProgramGrads] = useState([])
  const [clientList, setClientList] = useState([])
  const [clientAddedCount, setClientAddedCount] = useState(0)

  // View program variables.
  const [showFullClientList, setShowFullClientList] = useState(false)

  // Add client variables.
  const [addClientHasSearchContents, setAddClientHasSearchContents] = useState(false) 
  
  useEffect(() => {
    if (coach == null) {
      linkTo('/welcome')
    } else {
      getData()
    }
  },[])

  // All programs functions.
  const getData = async () => {
    var data = await getPrograms(coach.Id, coach.Token)
    console.log('data:',data)
    var grads = []
    for (var i = 0; i < data.length; i++) {
      var num = 0
      for (var j = 0; j < data[i].Assocs.length; j++) {
        if (data[i].Assocs[j].CurrentTaskId == 0) {
          num++
        }
      }
      grads.push(num)
    }
    setProgramGrads(grads)
    setPrograms(data)
    setShowActivityIndicator(false)
    setShowAll(true)
  }

  const addProgram = () => {
    linkTo('/new-program')
  }

  const viewProgram = (index) => {
    setViewProgramIndex(index)
    setShowAll(false)
    setShowActivityIndicator(true)
    setTimeout(() => {
      setShowActivityIndicator(false)
      setShowViewProgram(true)
    }, 500)
  }

  const refreshClientList = async (index) => {
    var clients = await getClientsData(coach.Id, coach.Token)
    for (var i = 0; i < clients[1].length; i++) {

      // Check if this client is already enrolled.
      var alreadyEnrolled = false
      for (var j = 0; j < programs[index].Assocs.length; j++) {
        var assoc = programs[index].Assocs[j]
        if (assoc.Client.Id == clients[1][i].Id) {
          alreadyEnrolled = true
          break
        }
      }

      clients[1][i].Added = 0 

      if (alreadyEnrolled) {
        clients[1][i].Visible = 0
      } else {
        clients[1][i].Visible = 1
      }

      
    }
    setClientList(clients[1])
    setShowActivityIndicator(false)
    setShowAddClient(true)
  }

  const viewAddClient = (index) => {
    
    setViewProgramIndex(index)
    setShowAll(false)
    setShowViewProgram(false)
    setShowActivityIndicator(true)
    refreshClientList(index)

  }
  
  // View program functions.
  // from: 0 - view program
  //       1 - add client
  // no use right now.
  const navTo = (from) => {
    setShowViewProgram(false)
    setShowAddClient(false)
    setShowActivityIndicator(true)
    setTimeout(() => {
      setShowActivityIndicator(false)
      if (from == 0) {
        setShowAll(true)
      } else {
        if (viewProgramIndex == -1) {
          setShowAll(true)
        } else {
          setShowViewProgram(true)
        }
      }
    }, 500)
  }

  const searchClients = (text) => {
    var tems = JSON.parse(JSON.stringify(clientList))
    for (var i = 0; i < tems.length; i++) {
      var str = tems[i].FirstName + ' ' + tems[i].LastName

      // Check if this client is already enrolled.
      var alreadyEnrolled = false
      for (var j = 0; j < programs[viewProgramIndex].Assocs.length; j++) {
        var assoc = programs[viewProgramIndex].Assocs[j]
        if (assoc.Client.Id == tems[i].Id) {
          alreadyEnrolled = true
          break
        }
      }

      if (!alreadyEnrolled && (str.toLowerCase().includes(text.toLowerCase()) || text.length == 0 || tems[i].Added == 1)) {
        tems[i].Visible = 1
      } else {
        tems[i].Visible = 0
      }
    }
    setClientList(tems)
  } 

  const toggleAddClient = (type, index) => {
    var addedClientCount = 0
    var clients = JSON.parse(JSON.stringify(clientList))
    for (var i = 0; i < clients.length; i++) {
      if (i == index) {
        clients[i].Added = type
      }
      addedClientCount += clients[i].Added
    }
    setClientAddedCount(addedClientCount)
    setClientList(clients)
  }

  const addClientsToProgram = async () => {

    // Create PromptAssoc Data.
    var assocs = []
    for (var i = 0; i < clientList.length; i++) {
      var client = clientList[i]
      if (client.Added == 1) {
        var assoc = {
          ClientId:client.Id,
          CoachId:coach.Id,
          ProgramId:programs[viewProgramIndex].Id,
        }
        assocs.push(assoc)
      }
    }

    var created = await createProgramAssocs(coach.Token, coach.Id, assocs)
    if (created) {
      setShowAddClient(false)
      setShowActivityIndicator(true)
      setTimeout(() => {
        setShowActivityIndicator(false)
        setShowClientAddSuccessForm(true)
      }, 500)
    } else {
      console.log("Invalid creation.")
    }
  }

  const exitClientAddSuccessForm = () => {
    setShowClientAddSuccessForm(false)
    setShowActivityIndicator(true)
    setTimeout(() => {
      setShowActivityIndicator(false)
      setShowViewProgram(true)
    }, 500)
  }

  return (<ScrollView contentContainerStyle={styles.scrollView}>
    <View style={styles.container}>
      <View style={styles.main}>
        <View style={styles.body}>

          {showActivityIndicator && (<ActivityIndicatorView />)}

          {showAll && (<View style={styles.promptListContainer}>
            <View style={styles.promptHeader}>
              <Text style={styles.promptHeaderTitle}>All Programs</Text>
              <Button
                title='Add New'
                titleStyle={styles.promptAddButtonTitle}
                buttonStyle={styles.promptAddButton}
                containerStyle={styles.promptAddButtonContainer}
                onPress={addProgram} 
              />
            </View>
            {programs.length == 0 && (<View style={styles.programs}>
              <Text style={styles.noProgramsText}>No programs yet!</Text>
            </View>) || (<View style={styles.programs}>
              {programs.map((program, index) => {
                return (<View key={'program_'+index} style={styles.program}>
                  <View style={styles.programHeader}>
                    <Text style={styles.programHeaderTitle}>{program.Title}</Text>
                    <Text style={styles.programHeaderCreated}>Created {parseSimpleDateText(sqlToJsDate(program.Created))}</Text>
                  </View>
                  <Text style={styles.programHeaderDescription}>{program.Description}</Text>
                  <View style={styles.programStats}>
                    <View style={[styles.programStatTop,{paddingRight:10}]}>
                      <Text style={styles.programStatTopNumber}>{program.Tasks.length}</Text>
                      <Text style={styles.programStatTopText}>Tasks</Text>
                    </View>
                    <View style={styles.programStatTop}>
                      <Text style={styles.programStatTopNumber}>{program.Assocs.length}</Text>
                      <Text style={styles.programStatTopText}>Members</Text>
                    </View>
                    <View style={[styles.programStatTop,{borderRightWidth:2}]}>
                      <Text style={styles.programStatTopNumber}>{programGrads[index]}</Text>
                      <Text style={styles.programStatTopText}>Graduates</Text>
                    </View>
                    <View style={[styles.programStatTop,{justifyContent:'flex-end',borderRightWidth:0}]}>
                      <Button 
                        title='View Data'
                        buttonStyle={styles.viewProgramButton}
                        containerStyle={styles.viewProgramButtonContainer}
                        titleStyle={styles.mainProgramButton}
                        onPress={() => viewProgram(index)}
                      />
                      <Button 
                        title='Add Client'
                        buttonStyle={styles.addProgramMemberButton}
                        containerStyle={styles.addProgramMemberButtonContainer}
                        titleStyle={styles.mainProgramButton}
                        onPress={() => viewAddClient(index)}
                      />
                    </View>
                  </View>
                </View>)
              })}
            </View>)} 
          </View>)}

          {showViewProgram && (<View style={styles.promptListContainer}>
            <View style={styles.viewProgramMainHeader}>
              <View style={styles.promptHeader}>
                <View style={{flexDirection: 'row',alignItems:'center'}}>
                  <Icon
                    name='chevron-back'
                    type='ionicon'
                    size={28}
                    color={colors.mainTextColor}
                    style={{marginRight:0}}
                    onPress={() => navTo(0)}
                  />
                  <Text style={styles.promptHeaderTitle}>Viewing {programs[viewProgramIndex].Title}</Text>
                </View>
              </View>
              <Text style={[styles.programHeaderDescription,{marginTop:20}]}>{programs[viewProgramIndex].Description}</Text>
            </View>
            <View style={styles.programStats}>
              <View style={[styles.programStatTop,{paddingRight:10}]}>
                <Text style={styles.programStatTopNumber}>{programs[viewProgramIndex].Tasks.length}</Text>
                <Text style={styles.programStatTopText}>Tasks</Text>
              </View>
              <View style={styles.programStatTop}>
                <Text style={styles.programStatTopNumber}>{programs[viewProgramIndex].Assocs.length}</Text>
                <Text style={styles.programStatTopText}>Members</Text>
              </View>
              <View style={[styles.programStatTop,{borderRightWidth:2}]}>
                <Text style={styles.programStatTopNumber}>{programGrads[viewProgramIndex]}</Text>
                <Text style={styles.programStatTopText}>Graduates</Text>
              </View>
              <View style={[styles.programStatTop,{justifyContent:'flex-end',borderRightWidth:0}]}>
                <Button 
                  title='Add Client'
                  buttonStyle={styles.addProgramMemberButton}
                  containerStyle={styles.addProgramMemberButtonContainer}
                  titleStyle={styles.mainProgramButton}
                  onPress={() => viewAddClient(viewProgramIndex)}
                />
              </View>
            </View>
            <View style={styles.viewProgramSection}>
              <View style={styles.viewProgramSectionHeader}>
                <Text style={styles.viewProgramSectionTitle}>Program Members</Text>
                {showFullClientList && (<Text style={styles.viewProgramSectionClientToggle}>
                  Show less members
                </Text>) || 
                (<>
                  {programs[viewProgramIndex].Assocs.length > 6 && (<Text style={styles.viewProgramSectionClientToggle}>
                    Show all {programs[viewProgramIndex].Assocs.length} members
                  </Text>)}
                </>)}
              </View>
              <View style={styles.viewProgramSectionClientList}>
                {programs[viewProgramIndex].Assocs.length > 0 && (<>
                  {programs[viewProgramIndex].Assocs.map((client, index) => {
                    console.log('pClient:',client)
                    if (showFullClientList || index < 6) {
                      return (<View key={'programClient_'+index} style={styles.viewProgramSectionClientListItem}>
                        <Image 
                          source={{uri:client.Client.Avatar}}
                          style={styles.viewProgramSectionClientListAvatar}
                        />
                        <Text style={styles.viewProgramSectionClientListName}>
                          {client.Client.FirstName + ' ' + client.Client.LastName}
                        </Text>
                        <View style={styles.viewProgramProgressOuter}>
                          <View style={[styles.viewProgramProgressInner,{width:client.TasksProgressPercent+'%',backgroundColor:progressBarColors[client.TasksProgressColor]}]}>
                          </View>
                        </View>
                        <Text style={styles.viewProgramSectionClientListTasksCompleted}>
                          <Text style={{marginRight:5,color:progressBarColors[client.TasksProgressColor]}}>
                            {client.TasksCompleted} / {programs[viewProgramIndex].Tasks.length}
                          </Text>
                          Tasks Completed
                        </Text>
                      </View>)
                    }

                  })}
                </>) || (<Text style={styles.viewProgramNoMembersText}>No program members yet.</Text>)}
              </View>
            </View>
          </View>)}

          {showAddClient && (<View style={[styles.promptListContainer,{width:'50%',height:'60%'}]}>
            <View style={styles.addClientHeader}>
              <View style={styles.promptHeader}>
                <View style={{flexDirection: 'row',alignItems:'center'}}>
                  <Icon
                    name='chevron-back'
                    type='ionicon'
                    size={28}
                    color={colors.mainTextColor}
                    style={{marginRight:0}}
                    onPress={() => navTo(1)}
                  />
                  <Text style={styles.promptHeaderTitle}>{programs[viewProgramIndex].Title}</Text>
                </View>
              </View>
              <Text style={styles.addClientsEnroll}>Select clients to enroll!</Text>
              {programs[viewProgramIndex].Tasks[0].ReleaseOnAssign == 1 && (<View>
                <Text style={styles.addClientsReleaseOnAssignText}>
                  Clients will be immediately assigned the first Task:
                  <Text style={[styles.boldText,{marginLeft:5}]}>{programs[viewProgramIndex].Tasks[0].Task[0].Title}</Text>
                </Text>
              </View>)}
              <View style={{flexDirection: 'row',alignItems:'center'}}>
                <View style={addClientHasSearchContents && [styles.searchClientsBar,styles.searchClientsBarHighlight] || [styles.searchClientsBar]}>
                  <View style={styles.createGroupAddIcon}>
                    <Icon
                      name='search'
                      type='ionicon'
                      size={28}
                      color={addClientHasSearchContents && colors.mainTextColor || colors.headerBorder}
                      style={[{marginLeft:5,marginTop:2}]}
                    />
                  </View>
                  <TextInput 
                    placeholder='Find clients...'
                    style={styles.createGroupAddInput}
                    onChange={(e) => {
                      searchClients(e.currentTarget.value)
                      setAddClientHasSearchContents((e.currentTarget.value.length > 0))
                    }}
                    className='custom-textinput'
                  />
                </View>
                <View style={styles.addClientListSubmitContainer}>
                  <Button 
                    title={'Add ' + clientAddedCount + ' Clients'}
                    onPress={() => addClientsToProgram()}
                    buttonStyle={styles.addClientListSubmitButton}
                    titleStyle={styles.addClientListSubmitTitle}
                    containerStyle={styles.addClientListSubmitWrapper}
                    disabled={clientAddedCount == 0}
                  />
                </View>
              </View>
              <ScrollView contentContainerStyle={styles.addClientList}>
                {clientList.map((client, cIndex) => {
                  if (client.Visible == 1) {
                    return (<View key={'clientList_'+cIndex} style={styles.addClientListMember}>
                      <View style={styles.clientListInfo}>
                        <View style={styles.clientListAvatarContainer}>
                          <Image 
                            source={{uri:client.Avatar}}
                            style={styles.clientListAvatar}
                          />
                        </View>
                        <Text style={styles.clientListName}>{client.FirstName + ' ' + client.LastName}</Text>
                      </View>
                      {client.Added == 1 && (<Icon
                        name='checkmark'
                        type='ionicon'
                        size={32}
                        color={btnColors.success}
                        style={{marginRight:0}}
                        onPress={() => toggleAddClient(0, cIndex)}
                      />) || (<Icon
                        name='add'
                        type='ionicon'
                        size={32}
                        color={btnColors.primary}
                        style={{marginRight:0}}
                        onPress={() => toggleAddClient(1, cIndex)}
                      />)}
                    </View>)
                  }
                })}
              </ScrollView>
            </View>
          </View>)}

          {showClientAddSuccessForm && (<View style={[styles.promptListContainer,{width:'50%',height:'60%'}]}>
            <Text style={styles.clientAddSuccessTitle}>Success!</Text>
            <Text style={styles.clientAddSuccessDesc}>Added {clientAddedCount} client{clientAddedCount > 1 && 's'} to <Text style={{fontFamily:'PoppinsSemiBold'}}>{programs[viewProgramIndex].Title}</Text>.</Text>
            <Button 
              title='Continue'
              onPress={() => exitClientAddSuccessForm()}
              buttonStyle={styles.addClientListSubmitButton}
              titleStyle={styles.addClientListSubmitTitle}
              containerStyle={styles.addClientListSubmitWrapper}
            />
          </View>)}
          
        </View>
      </View>
    </View>
  </ScrollView>)

}
