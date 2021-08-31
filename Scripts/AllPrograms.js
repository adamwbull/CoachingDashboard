import { StatusBar } from 'expo-status-bar'
import React, { useEffect, useState, useContext } from 'react'
import { Image, ScrollView, StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import { programsLight, colorsLight, innerDrawerLight, btnColors } from '../Scripts/Styles.js'
import { homeDark, colorsDark, innerDrawerDark } from '../Scripts/Styles.js'
import { useLinkTo, Link, useFocusEffect } from '@react-navigation/native'
import LoadingScreen from '../Scripts/LoadingScreen.js'
import { Icon, Button, Chip } from 'react-native-elements'
import { set, get, getTTL, ttl } from './Storage.js'
import { getClientsData, getPrograms, parseSimpleDateText, sqlToJsDate, createProgramAssocs, lightenHex } from './API.js'
import ActivityIndicatorView from '../Scripts/ActivityIndicatorView.js'
import { Progress } from 'semantic-ui-react'
import { TextInput } from 'react-native-web'
import { ResponsivePie } from '@nivo/pie'

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
    btnColors.info,
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
  const [showClientListPage, setShowClientListPage] = useState(true)
  const [showTaskListPage, setShowTaskListPage] = useState(false)
  const [showClientData, setShowClientData] = useState(false)
  const [selectedCounts, setSelectedCounts] = useState([])
  
  // View client data variables.
  const [selectedClientIndex, setSelectedClientIndex] = useState(false)

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
    console.log('data:', data)
    // Get grads and selectedClients statistics.
    var grads = []
    var selecteds = []
    for (var i = 0; i < data.length; i++) {
      selecteds.push(0)
      var num = 0
      for (var j = 0; j < data[i].Assocs.length; j++) {
        if (data[i].Assocs[j].CurrentTaskId == 0) {
          num++
        }
      }
      grads.push(num)
    }
    setSelectedCounts(selecteds)
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

    // CODING NOTE //
    // This is an example coding note.

    // An array of the task IDs to use later. 
    var taskIds = []
    for (var i = 0; i < programs[index].Tasks.length; i++) {
      taskIds.push(programs[index].Tasks[i].Id)
    }

    // Loop through all clients.
    for (var i = 0; i < clients[1].length; i++) {

      // Check if this client is already enrolled, as well as how many tasks were completed.
      var alreadyEnrolled = false
      var completedCount = 0

      for (var j = 0; j < programs[index].Assocs.length; j++) {
        var assoc = programs[index].Assocs[j]
        if (assoc.Client.Id == clients[1][i].Id) {
          // Assign this client as enrolled.
          alreadyEnrolled = true
          // Determine how many tasks have been completed.
          for (var k = 0; k < taskIds.length; k++) {
            if (taskIds[k] == assoc.CurrentTaskId) {
              break
            } else {
              completedCount++
            }
          }
          break
        }
      }

      if (alreadyEnrolled) {
        clients[1][i].Visible = 0
      } else {
        clients[1][i].Visible = 1
      }

      clients[1][i].TasksAssigned = completedCount

      // Variable for manipulating whether a client is selected.
      clients[1][i].Added = 0 
      
      for (var j = 0; j < programs[index].Tasks.length; j++) {
        if (programs[index].Tasks[j].Id == clients[1][i].Something) {

        }
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
  const viewProgramClientList = () => {
    setShowTaskListPage(false)
    setShowClientListPage(true)
  }

  const viewProgramTaskList = () => {
    setShowClientListPage(false)
    setShowTaskListPage(true)
  }

  const toggleViewAllClients = () => {
    setShowFullClientList(!showFullClientList)
  }

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

  const toggleSelectedClient = (index) => {

    var newPrograms = JSON.parse(JSON.stringify(programs))
    for (var i = 0; i < newPrograms[viewProgramIndex].Assocs.length; i++) {
      if (i == index) {
        newPrograms[viewProgramIndex].Assocs[i].Selected = (newPrograms[viewProgramIndex].Assocs[i].Selected == 0) ? 1 : 0
        var newCounts = JSON.parse(JSON.stringify(selectedCounts)) 
        newCounts[viewProgramIndex] += (newPrograms[viewProgramIndex].Assocs[i].Selected == 0) ? -1 : 1
        setSelectedCounts(newCounts)
        break
      }
    }
    setPrograms(newPrograms)

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

  const advanceNextTasks = async () => {
    // Collect data for API call.
    var advancees = []
    // Make call.
    var posted = await advanceProgramTasks(advancees, coach.Token, coach.Id)
    if (posted) {
      // Show success message.
    }
  }

  const viewIndividualClient = (i) => {
    setSelectedClientIndex(i)
    setShowClientData(true)
  }



  return (<ScrollView contentContainerStyle={styles.scrollView}>
    <View style={styles.container}>
      <View style={styles.main}>
        <View style={styles.body}>

          {showActivityIndicator && (<ActivityIndicatorView />)}

          {showAll && (<View style={styles.body}>
            <View style={styles.promptListContainer}>
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
            </View>
            {programs.length == 0 && (<View style={styles.promptListContainer}>
              <View style={styles.programs}>
                <Text style={styles.noProgramsText}>No programs yet!</Text>
              </View>
            </View>) || (<View style={styles.programs}>
              {programs.map((program, index) => {
                return (<View key={'program_'+index} style={styles.program}>
                  <View style={styles.programHeader}>
                    <Text style={styles.programHeaderTitle}>{program.Title}</Text>
                    <Text style={styles.programHeaderCreated}>Created {parseSimpleDateText(sqlToJsDate(program.Created))}</Text>
                  </View>
                  <Text style={[styles.programHeaderDescription,{marginLeft:20}]}>{program.Description}</Text>
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

          {showViewProgram && (<View style={styles.body}>
            <View style={styles.program}>
              <View style={styles.programHeader}>
                <View style={{flexDirection: 'row',alignItems: 'center'}}>
                  <Icon
                    name='chevron-back'
                    type='ionicon'
                    size={28}
                    color={colors.mainTextColor}
                    style={{marginRight:0}}
                    onPress={() => navTo(0)}
                  />
                  <Text style={styles.programHeaderTitle}>{programs[viewProgramIndex].Title}</Text>
                </View>
                <Text style={styles.programHeaderCreated}>Created {parseSimpleDateText(sqlToJsDate(programs[viewProgramIndex].Created))}</Text>
              </View>
              <Text style={[styles.programHeaderDescription,{marginLeft:20}]}>{programs[viewProgramIndex].Description}</Text>
              <View style={styles.programStats}>
                <View style={[styles.programStatTop]}>
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
            </View>
            <View style={styles.promptListContainer}>
              <View style={[styles.tabListContainer]}>
                {showClientListPage && (<View style={styles.viewProgramTabHighlighted}>
                  <Text style={styles.viewProgramTabHighlightedText}>
                    Program Members
                  </Text>
                </View>) || (<TouchableOpacity style={styles.viewProgramTab} onPress={() => viewProgramClientList()}>
                  <Text style={styles.viewProgramTabText}>
                    Program Members
                  </Text>
                </TouchableOpacity>)}
                {showTaskListPage && (<View style={styles.viewProgramTabHighlighted}>
                  <Text style={styles.viewProgramTabHighlightedText}>
                    Task Data
                  </Text>
                </View>) || (<TouchableOpacity style={styles.viewProgramTab} onPress={() => viewProgramTaskList()}>
                  <Text style={styles.viewProgramTabText}>
                    Task Data
                  </Text>
                </TouchableOpacity>)}
              </View>
              {showClientListPage && (<View style={styles.viewProgramSection}>
                {showClientData && (<View style={styles.viewProgramSection}>
                  {programs[viewProgramIndex].Tasks.map((task, index) => {
                    // This is the first time I have done this, but it's pretty awesome. Just wait...
                    var responseArray = []
                    // Check if this client completed this task.
                    task.Responses.forEach((res, i) => {
                      // Check if this is a survey response.
                      if (task.Type == 1) {
                        // Handle as a survey.
                        if (responseArray.length == 0 && res[0].Client.Id == programs[viewProgramIndex].Assocs[selectedClientIndex].ClientId) {
                          responseArray.push(res)
                        }
                      } else {
                        if (responseArray.length == 0 && res.Client.Id == programs[viewProgramIndex].Assocs[selectedClientIndex].ClientId) {
                          responseArray.push(res)
                        }
                      }
                    })    
                    var headerStyling = {}
                    if (responseArray.length == 0) {
                      headerStyling = {borderRadius:10}
                    }
                    return (<View key={'taskIndex_'+index} style={styles.task}>
                      <View style={[styles.taskHeader,headerStyling]}>
                        <View style={styles.taskHeaderTitle}>
                          <Text style={styles.taskHeaderTitleCount}>Task #{index+1}:</Text>
                          <Text style={styles.taskHeaderTitleName}>{task.Task[0].Title}</Text>
                        </View>
                        <Text style={styles.taskHeaderStatus}>
                          {responseArray.length == 0 && 'No response yet.'}
                        </Text>
                      </View>
                      <View>
                        {responseArray.length > 0 &&
                        (<View style={styles.taskData}>
                          {responseArray.map((response, rIndex) => {

                            var view = null
                            
                            if (task.Type == 0) {
                              // Prompt response.
                              view = <View key={'taskRes_'+rIndex} style={styles.responseClientContainer}>
                                <Image 
                                  source={response.Client.Avatar}
                                  style={styles.responseClientAvatar}
                                />
                                <Text style={styles.responseClientText}>
                                  <Text style={styles.responseClientName}>{response.Client.FirstName + ' ' + response.Client.LastName}</Text>
                                  {response.Text}
                                </Text>
                              </View>
                            } else if (task.Type == 1) {
                              // Survey response.
                              // Only show compiled data on first rIndex.
                              if (rIndex == 0) {
                                view = <View style={styles.surveyData} key={'taskRes_'+rIndex}>
                                  {task.Task[0].Items.map((q, index) => {
                                    var i;
                                    // Get list of input responses.
                                    var responses = []
                                    for (i = 0; i < task.Responses.length; i++) {
                                      var cur = task.Responses[i][index]
                                      responses.push(cur)
                                    }
                                    if (q.Type == 0) {
                                      return (<View style={styles.surveyDataRow} key={index + '-'}>
                                        <Text style={styles.surveyQuestion}>Q{(index+1) + ': ' + q.Question}</Text>
                                        {responses.map((res, ind) => {
                                          var avatar = 'https://coachsync.me/assets/img/default.png'
                                          var name = ''
                                          return (<View key={ind + '--+'} style={styles.responseClientContainer}>
                                            <Image 
                                              source={res.Client.Avatar}
                                              style={styles.responseClientAvatar}
                                            />
                                            <Text style={styles.responseClientText}>
                                              <Text style={styles.responseClientName}>{res.Client.FirstName + ' ' + res.Client.LastName}</Text>
                                              {res.Response}
                                            </Text>
                                          </View>)
                                        })}
                                      </View>)
                                    } else if (q.Type == 1) {
                                      // Get range.
                                      var rangeStrs = q.SliderRange.split(',')
                                      var minRange = parseInt(rangeStrs[0])
                                      var maxRange = parseInt(rangeStrs[1])
                                      // Get average.
                                      var top = 0
                                      var cnt = 0
                                      for (i = 0; i < task.Responses.length; i++) {
                                        var cur = parseFloat(task.Responses[i][index].Response)
                                        top += cur
                                        cnt++
                                      }
                                      var average = parseFloat((top/cnt).toFixed(2))
                                      var genWidth = parseInt((average/maxRange)*100)
                                      genWidth = genWidth + '%'
                                      var sliderInnerWidth = {width:genWidth}

                                      return (<View style={[styles.surveyDataRow,{width:'100%',height:150}]} key={index + '-'}>
                                        <Text style={styles.surveyQuestion}>Q{(index+1) + ': ' + q.Question}</Text>
                                        <View style={styles.sliderOuter}>
                                          <View style={[styles.sliderInner,sliderInnerWidth]}>
                                            <Text style={styles.sliderInnerText}>Average: {average}</Text>
                                          </View>
                                        </View>
                                        <View style={{flexDirection:'row',justifyContent:'space-between',margin:10}}>
                                          <View>
                                            <Text style={[styles.responseClientText,{fontFamily:'PoppinsSemiBold',textAlign:'left',margin:0}]}>{minRange}</Text>
                                            <Text style={[styles.responseClientText,{textAlign:'left',margin:0}]}>{q.SliderLeft}</Text>
                                          </View>
                                          <View>
                                            <Text style={[styles.responseClientText,{fontFamily:'PoppinsSemiBold',textAlign:'right'}]}>{maxRange}</Text>
                                            <Text style={[styles.responseClientText,{textAlign:'right'}]}>{q.SliderRight}</Text>
                                          </View>
                                        </View>
                                      </View>)
                                    } else if (q.Type == 2) {
                                      var data = []
                                      var ids = q.BoxOptionsArray.split(',')
                                      for (i = 0; i < ids.length; i++) {
                                        var color = colors.primaryHighlight
                                        if (i >= 1 && i <= 5) {
                                          var colorsArr = [colors.secondaryHighlight]
                                          for (var k = 0; k < 4; k++) {
                                            colorsArr.push(lightenHex(colorsArr[colorsArr.length-1], 20))
                                          }
                                          color = colorsArr[(i % 5)]
                                        }
                                        var total = 0
                                        for (var j = 0; j < task.Responses.length; j++) {
                                          var thisPersonsResponses = task.Responses[j][index].Response.split(',')
                                          if (thisPersonsResponses[i] == 'true') {
                                            total++;
                                          }
                                        }
                                        var cur = {
                                          "id":ids[i],
                                          "label":ids[i],
                                          "value":total,
                                          "color":color
                                        }
                                        data.push(cur)
                                      }
                                      return (<View style={[styles.surveyDataRow]} key={index + '-'}>
                                        <Text style={styles.surveyQuestion}>Q{(index+1) + ': ' + q.Question}</Text>
                                        <ResponsivePie
                                          data={data}
                                          colors={{ datum: 'data.color' }}
                                          margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
                                          innerRadius={0.5}
                                          padAngle={0.7}
                                          cornerRadius={3}
                                          activeOuterRadiusOffset={8}
                                          borderWidth={1}
                                          borderColor={colors.headerBorder}
                                          arcLinkLabelsSkipAngle={10}
                                          arcLinkLabelsTextColor={colors.mainTextColor}
                                          arcLinkLabelsThickness={2}
                                          arcLinkLabelsColor={colors.mainTextColor}
                                          arcLabelsSkipAngle={10}
                                          arcLabelsTextColor={colors.mainTextColor}
                                          legends={[
                                              {
                                                  anchor: 'bottom',
                                                  direction: 'row',
                                                  justify: false,
                                                  translateX: 40,
                                                  translateY: 56,
                                                  itemsSpacing: 0,
                                                  itemWidth: 100,
                                                  itemHeight: 18,
                                                  itemTextColor: colors.mainTextColor,
                                                  itemDirection: 'left-to-right',
                                                  itemOpacity: 1,
                                                  symbolSize: 18,
                                                  symbolShape: 'circle',
                                                  effects: [
                                                      {
                                                          on: 'hover',
                                                          style: {
                                                              itemTextColor: '#000'
                                                          }
                                                      }
                                                  ]
                                              }
                                          ]}
                                      />
                                      </View>)
                                    } else {
                                      var data = []
                                      var ids = q.BoxOptionsArray.split(',')
                                      for (i = 0; i < ids.length; i++) {
                                        var color = colors.primaryHighlight
                                        if (i >= 1 && i <= 5) {
                                          var colorsArr = [colors.secondaryHighlight]
                                          for (var k = 0; k < 4; k++) {
                                            colorsArr.push(lightenHex(colorsArr[colorsArr.length-1], 20))
                                          }
                                          color = colorsArr[(i % 5)]
                                        }
                                        var total = 0
                                        for (var j = 0; j < task.Responses.length; j++) {
                                          var thisPersonsResponse = task.Responses[j][index].Response
                                          if (thisPersonsResponse == ids[i]) {
                                            total++;
                                          }
                                        }
                                        var cur = {
                                          "id":ids[i],
                                          "label":ids[i],
                                          "value":total,
                                          "color":color
                                        }
                                        data.push(cur)
                                      }
                                      return (<View style={[styles.surveyDataRow,{width:'100%',height:300,marginBottom:30}]} key={index + '-'}>
                                        <Text style={styles.surveyQuestion}>Q{(index+1) + ': ' + q.Question}</Text>
                                        <ResponsivePie
                                          data={data}
                                          colors={{ datum: 'data.color' }}
                                          margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
                                          innerRadius={0.5}
                                          padAngle={0.7}
                                          cornerRadius={3}
                                          activeOuterRadiusOffset={8}
                                          borderWidth={1}
                                          borderColor={colors.headerBorder}
                                          arcLinkLabelsSkipAngle={10}
                                          arcLinkLabelsTextColor={colors.mainTextColor}
                                          arcLinkLabelsThickness={2}
                                          arcLinkLabelsColor={colors.mainTextColor}
                                          arcLabelsSkipAngle={10}
                                          arcLabelsTextColor={colors.mainTextColor}
                                          legends={[
                                              {
                                                  anchor: 'bottom',
                                                  direction: 'row',
                                                  justify: false,
                                                  translateX: 40,
                                                  translateY: 56,
                                                  itemsSpacing: 0,
                                                  itemWidth: 100,
                                                  itemHeight: 18,
                                                  itemTextColor: colors.mainTextColor,
                                                  itemDirection: 'left-to-right',
                                                  itemOpacity: 1,
                                                  symbolSize: 18,
                                                  symbolShape: 'circle',
                                                  effects: [
                                                      {
                                                          on: 'hover',
                                                          style: {
                                                              itemTextColor: '#000'
                                                          }
                                                      }
                                                  ]
                                              }
                                          ]}
                                      />
                                      </View>)
                                    }
                                  })}
                                </View>
                              } else {
                                view = <View key={'taskRes_'+rIndex}>
                                </View>
                              }
                            } else if (task.Type == 2) {
                              // Payment response.
                              if (rIndex == 0) {
                                view = <View style={styles.paymentResponse} key={'taskRes_'+rIndex}>
                                  <View style={styles.paymentsControls}>
                                    <TouchableOpacity style={styles.paymentControlsTouchAmount}>
                                      <Text style={styles.paymentsControlsText}>Client</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.paymentControlsTouchAmount}>
                                      <Text style={styles.paymentsControlsText}>Amount</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.paymentControlsNumber}>
                                      <Text style={styles.paymentsControlsText}>Status</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.paymentControlsTouchDescription}>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.paymentControlsTouchDate}>
                                      <Text style={[styles.paymentsControlsText,]}>Created</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.paymentControlsTouchView}>
                                      <Text style={[styles.paymentsControlsText,{textAlign:'right'}]}>View Receipt</Text>
                                    </TouchableOpacity>
                                  </View>
                                  <View style={styles.paymentsPreviousInvoices}>
                                    {task.Responses.map((line, paymentLineIndex) => {
                                      // Amount/total, Chip/status, Invoice Number/number, Due/period_end, Created/created, View/hosted_invoice_url
                                      return (<View key={line.id} style={styles.paymentRow}>
                                          <View style={[styles.paymentRowTouchAmount]}>
                                            <Text style={[styles.paymentRowText]}>
                                              {line.Client.FirstName + ' ' + line.Client.LastName}
                                            </Text>
                                          </View>
                                          <View style={[styles.paymentRowTouchAmount]}>
                                            <Text style={[styles.paymentRowText]}>
                                              ${(parseInt(line.Amount)/100).toFixed(2)}
                                            </Text>
                                          </View>
                                          <View style={styles.paymentRowTouchAmountStatus}>
                                            {line.IsPaid == 0 && (<><Chip
                                              title='Uncollected'
                                              type='outline'
                                              icon={{
                                                name:'checkmark-outline',
                                                type:'ionicon',
                                                size:16,
                                                color:'#fff'
                                              }}
                                              disabledStyle={{backgroundColor:btnColors.caution,borderColor:btnColors.caution,color:btnColors.caution,margin:5,paddingLeft:3,paddingTop:3,paddingBottom:3,paddingRight:8}}
                                              disabledTitleStyle={{color:'#fff'}}
                                              disabled={true}
                                            /></>) ||
                                              (<>{line.IsPaid == 1 && (<>
                                                <Chip
                                                  title='Paid'
                                                  type='outline'
                                                  icon={{
                                                    name:'checkmark-outline',
                                                    type:'ionicon',
                                                    size:16,
                                                    color:'#fff'
                                                  }}
                                                  disabledStyle={{backgroundColor:btnColors.success,borderColor:btnColors.success,color:btnColors.success,margin:5,paddingLeft:3,paddingTop:3,paddingBottom:3,paddingRight:8}}
                                                  disabledTitleStyle={{color:'#fff'}}
                                                  disabled={true}
                                                />
                                              </>) || (<Chip
                                                title='Void'
                                                type='outline'
                                                icon={{
                                                  name:'checkmark-outline',
                                                  type:'ionicon',
                                                  size:16,
                                                  color:'#fff'
                                                }}
                                                disabledStyle={{backgroundColor:btnColors.danger,borderColor:btnColors.danger,color:btnColors.danger,margin:5,paddingLeft:3,paddingTop:3,paddingBottom:3,paddingRight:8}}
                                                disabledTitleStyle={{color:'#fff'}}
                                                disabled={true}
                                              />)}
                                            </>)}
                                          </View>
                                          <View style={styles.paymentRowTouchDescription}>
                                          </View>
                                          <View style={styles.paymentRowTouchDate}>
                                            <Text style={styles.paymentRowText}>{parseSimpleDateText(sqlToJsDate(line.Created))}</Text>
                                          </View>
                                          <View style={styles.paymentRowTouchView}>
                                            <Chip
                                                title='View'
                                                type='outline'
                                                onPress={() => {
                                                  window.open(line.Receipt, '_blank')
                                                }}
                                                buttonStyle={{
                                                  padding:5,
                                                  margin:5
                                                }}
                                              />
                                          </View>
                                        </View>)
                                    })}
                                  </View>
                                </View>
                              } else {
                                view = <View key={'taskRes_'+rIndex}>
                                </View>
                              }
                              
                            } else if (task.Type == 3) {
                              // Contract response.
                              if (rIndex == 0) {
                                view = <View style={styles.paymentResponse} key={'taskRes_'+rIndex}>
                                  <View style={styles.paymentsControls}>
                                    <TouchableOpacity style={[styles.paymentControlsTouchAmount,{flex:95}]}>
                                      <Text style={styles.paymentsControlsText}>Client</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.paymentControlsTouchDate}>
                                      <Text style={[styles.paymentsControlsText,]}>Created</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.paymentControlsTouchView}>
                                      <Text style={[styles.paymentsControlsText,{textAlign:'right'}]}>View Contract</Text>
                                    </TouchableOpacity>
                                  </View>
                                  <View style={styles.paymentsPreviousInvoices}>
                                    {task.Responses.map((line, paymentLineIndex) => {
                                      return (<View key={line.id} style={styles.paymentRow}>
                                          <View style={[styles.paymentRowTouchAmount,{flex:91}]}>
                                            <Text style={[styles.paymentRowText]}>
                                              {line.Client.FirstName + ' ' + line.Client.LastName}
                                            </Text>
                                          </View>
                                          <View style={styles.paymentRowTouchDate}>
                                            <Text style={styles.paymentRowText}>{parseSimpleDateText(sqlToJsDate(line.Created))}</Text>
                                          </View>
                                          <View style={styles.paymentRowTouchView}>
                                            <Chip
                                                title='View'
                                                type='outline'
                                                onPress={() => {
                                                  window.open(line.File, '_blank')
                                                }}
                                                buttonStyle={{
                                                  padding:5,
                                                  margin:5
                                                }}
                                              />
                                          </View>
                                        </View>)
                                    })}
                                  </View>
                                </View>
                              } else {
                                view = <View key={'taskRes_'+rIndex}>
                                </View>
                              }
                            } else {
                              view = <View key={'taskRes_'+rIndex}>
                              </View>
                            }

                            return view 

                          })}
                        </View>)}
                      </View>
                    </View>)
                  })}
                </View>) || (<View>
                  {selectedCounts[viewProgramIndex] > 0 && (<View style={styles.viewProgramClientListOptions}>
                    <Text style={styles.clientListOptionsCount}>
                      {selectedCounts[viewProgramIndex]} selected
                    </Text>
                    <Button 
                      title='Release Next Task'
                      buttonStyle={styles.advanceNextTaskButton}
                      onPress={() => advanceNextTasks()}
                    />
                  </View>)}
                  <View style={styles.viewProgramSectionClientList}>
                    {programs[viewProgramIndex].Assocs.length > 0 && (<>
                      {programs[viewProgramIndex].Assocs.map((client, index) => {
                        if (showFullClientList || index < 8) {
                          return (<View key={'programClient_'+index} style={styles.viewProgramSectionClientListItemContainer}>
                            <View style={client.Selected == 0 && styles.viewProgramSectionClientListItem || styles.viewProgramSectionClientListItemSelected}>
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
                              <View style={styles.viewProgramStatsRow}>
                                <View style={styles.viewProgramSectionClientListStatColumn}>
                                  <Text style={[styles.viewProgramSectionClientListStatNumber,{color:progressBarColors[client.TasksProgressColor]}]}>
                                    {client.TasksCompleted} / {programs[viewProgramIndex].Tasks.length}
                                  </Text>
                                  <Text style={styles.viewProgramSectionClientListTasksCompleted}>
                                    Tasks Assigned
                                  </Text>
                                </View>
                                <View style={styles.viewProgramSectionClientListStatColumn}>
                                  <Text style={[styles.viewProgramSectionClientListStatNumber,{color:progressBarColors[client.TasksProgressColor]}]}>
                                    {client.TasksCompleted} / {programs[viewProgramIndex].Tasks.length}
                                  </Text>
                                  <Text style={styles.viewProgramSectionClientListTasksCompleted}>
                                    Tasks Completed
                                  </Text>
                                </View>
                              </View>
                              <View style={styles.viewProgramSectionClientListButtons}>
                                {client.CurrentTaskId != 0 && (<Button 
                                  title={client.Selected == 0 && 'Select' || 'Deselect'}
                                  onPress={() => toggleSelectedClient(index)}
                                  buttonStyle={client.Selected == 0 && styles.clientListSelect || styles.clientListDeselect}
                                  titleStyle={styles.clientListViewDataTitle}
                                  containerStyle={styles.clientListViewDataContainer}
                                />)}
                                <Button 
                                  title='View Data'
                                  onPress={() => viewIndividualClient(index)}
                                  buttonStyle={styles.clientListViewData}
                                  titleStyle={[styles.clientListViewDataTitle,{color:colors.mainTextColor}]}
                                  containerStyle={[styles.clientListViewDataContainer,{flex:2}]}
                                />
                              </View>
                            </View>
                          </View>)
                        }
                      })}
                      {showFullClientList && (<TouchableOpacity style={styles.viewProgramSectionClientToggleMain}
                        onPress={() => toggleViewAllClients()}>
                        <Text style={styles.viewProgramSectionClientToggle}>
                          Show less members
                        </Text>
                      </TouchableOpacity>) || 
                      (<>
                        {programs[viewProgramIndex].Assocs.length > 6 && (<TouchableOpacity style={styles.viewProgramSectionClientToggleMain}
                          onPress={() => toggleViewAllClients()}>
                          <Text style={styles.viewProgramSectionClientToggle}>
                            Show {programs[viewProgramIndex].Assocs.length-8} more
                          </Text>
                        </TouchableOpacity>)}
                      </>)}
                    </>) || (<Text style={styles.viewProgramNoMembersText}>No program members yet.</Text>)}
                  </View>
                </View>)}
              </View>)}
              {showTaskListPage && (<View style={styles.viewProgramSection}>
                {programs[viewProgramIndex].Tasks.map((task, index) => {
                  var memberCount = programs[viewProgramIndex].Assocs.length
                  return (<View key={'taskIndex_'+index} style={styles.task}>
                    <View style={styles.taskHeader}>
                      <View style={styles.taskHeaderTitle}>
                        <Text style={styles.taskHeaderTitleCount}>Task #{index+1}:</Text>
                        <Text style={styles.taskHeaderTitleName}>{task.Task[0].Title}</Text>
                      </View>
                      <Text style={styles.taskHeaderStatus}>{task.Responses.length} Responses</Text>
                    </View>
                    <View style={styles.taskData}>
                      {task.Responses.length == 0 &&
                      (<Text style={styles.noResponseText}>No responses yet.</Text>) || 
                      (<View>
                        {task.Responses.map((response, rIndex) => {

                          var view = null
                          
                          if (task.Type == 0) {
                            // Prompt response.
                            view = <View key={'taskRes_'+rIndex} style={styles.responseClientContainer}>
                              <Image 
                                source={response.Client.Avatar}
                                style={styles.responseClientAvatar}
                              />
                              <Text style={styles.responseClientText}>
                                <Text style={styles.responseClientName}>{response.Client.FirstName + ' ' + response.Client.LastName}</Text>
                                {response.Text}
                              </Text>
                            </View>
                          } else if (task.Type == 1) {
                            // Survey response.
                            // Only show compiled data on first rIndex.
                            if (rIndex == 0) {
                              view = <View style={styles.surveyData} key={'taskRes_'+rIndex}>
                                {task.Task[0].Items.map((q, index) => {
                                  var i;
                                  // Get list of input responses.
                                  var responses = []
                                  for (i = 0; i < task.Responses.length; i++) {
                                    var cur = task.Responses[i][index]
                                    responses.push(cur)
                                  }
                                  if (q.Type == 0) {
                                    return (<View style={styles.surveyDataRow} key={index + '-'}>
                                      <Text style={styles.surveyQuestion}>Q{(index+1) + ': ' + q.Question}</Text>
                                      {responses.map((res, ind) => {
                                        var avatar = 'https://coachsync.me/assets/img/default.png'
                                        var name = ''
                                        return (<View key={ind + '--+'} style={styles.responseClientContainer}>
                                          <Image 
                                            source={res.Client.Avatar}
                                            style={styles.responseClientAvatar}
                                          />
                                          <Text style={styles.responseClientText}>
                                            <Text style={styles.responseClientName}>{res.Client.FirstName + ' ' + res.Client.LastName}</Text>
                                            {res.Response}
                                          </Text>
                                        </View>)
                                      })}
                                    </View>)
                                  } else if (q.Type == 1) {
                                    // Get range.
                                    var rangeStrs = q.SliderRange.split(',')
                                    var minRange = parseInt(rangeStrs[0])
                                    var maxRange = parseInt(rangeStrs[1])
                                    // Get average.
                                    var top = 0
                                    var cnt = 0
                                    for (i = 0; i < task.Responses.length; i++) {
                                      var cur = parseFloat(task.Responses[i][index].Response)
                                      top += cur
                                      cnt++
                                    }
                                    var average = parseFloat((top/cnt).toFixed(2))
                                    var genWidth = parseInt((average/maxRange)*100)
                                    genWidth = genWidth + '%'
                                    var sliderInnerWidth = {width:genWidth}

                                    return (<View style={[styles.surveyDataRow,{width:'100%',height:150}]} key={index + '-'}>
                                      <Text style={styles.surveyQuestion}>Q{(index+1) + ': ' + q.Question}</Text>
                                      <View style={styles.sliderOuter}>
                                        <View style={[styles.sliderInner,sliderInnerWidth]}>
                                          <Text style={styles.sliderInnerText}>Average: {average}</Text>
                                        </View>
                                      </View>
                                      <View style={{flexDirection:'row',justifyContent:'space-between',margin:10}}>
                                        <View>
                                          <Text style={[styles.responseClientText,{fontFamily:'PoppinsSemiBold',textAlign:'left',margin:0}]}>{minRange}</Text>
                                          <Text style={[styles.responseClientText,{textAlign:'left',margin:0}]}>{q.SliderLeft}</Text>
                                        </View>
                                        <View>
                                          <Text style={[styles.responseClientText,{fontFamily:'PoppinsSemiBold',textAlign:'right'}]}>{maxRange}</Text>
                                          <Text style={[styles.responseClientText,{textAlign:'right'}]}>{q.SliderRight}</Text>
                                        </View>
                                      </View>
                                    </View>)
                                  } else if (q.Type == 2) {
                                    var data = []
                                    var ids = q.BoxOptionsArray.split(',')
                                    for (i = 0; i < ids.length; i++) {
                                      var color = colors.primaryHighlight
                                      if (i >= 1 && i <= 5) {
                                        var colorsArr = [colors.secondaryHighlight]
                                        for (var k = 0; k < 4; k++) {
                                          colorsArr.push(lightenHex(colorsArr[colorsArr.length-1], 20))
                                        }
                                        color = colorsArr[(i % 5)]
                                      }
                                      var total = 0
                                      for (var j = 0; j < task.Responses.length; j++) {
                                        var thisPersonsResponses = task.Responses[j][index].Response.split(',')
                                        if (thisPersonsResponses[i] == 'true') {
                                          total++;
                                        }
                                      }
                                      var cur = {
                                        "id":ids[i],
                                        "label":ids[i],
                                        "value":total,
                                        "color":color
                                      }
                                      data.push(cur)
                                    }
                                    return (<View style={[styles.surveyDataRow]} key={index + '-'}>
                                      <Text style={styles.surveyQuestion}>Q{(index+1) + ': ' + q.Question}</Text>
                                      <ResponsivePie
                                        data={data}
                                        colors={{ datum: 'data.color' }}
                                        margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
                                        innerRadius={0.5}
                                        padAngle={0.7}
                                        cornerRadius={3}
                                        activeOuterRadiusOffset={8}
                                        borderWidth={1}
                                        borderColor={colors.headerBorder}
                                        arcLinkLabelsSkipAngle={10}
                                        arcLinkLabelsTextColor={colors.mainTextColor}
                                        arcLinkLabelsThickness={2}
                                        arcLinkLabelsColor={colors.mainTextColor}
                                        arcLabelsSkipAngle={10}
                                        arcLabelsTextColor={colors.mainTextColor}
                                        legends={[
                                            {
                                                anchor: 'bottom',
                                                direction: 'row',
                                                justify: false,
                                                translateX: 40,
                                                translateY: 56,
                                                itemsSpacing: 0,
                                                itemWidth: 100,
                                                itemHeight: 18,
                                                itemTextColor: colors.mainTextColor,
                                                itemDirection: 'left-to-right',
                                                itemOpacity: 1,
                                                symbolSize: 18,
                                                symbolShape: 'circle',
                                                effects: [
                                                    {
                                                        on: 'hover',
                                                        style: {
                                                            itemTextColor: '#000'
                                                        }
                                                    }
                                                ]
                                            }
                                        ]}
                                    />
                                    </View>)
                                  } else {
                                    var data = []
                                    var ids = q.BoxOptionsArray.split(',')
                                    for (i = 0; i < ids.length; i++) {
                                      var color = colors.primaryHighlight
                                      if (i >= 1 && i <= 5) {
                                        var colorsArr = [colors.secondaryHighlight]
                                        for (var k = 0; k < 4; k++) {
                                          colorsArr.push(lightenHex(colorsArr[colorsArr.length-1], 20))
                                        }
                                        color = colorsArr[(i % 5)]
                                      }
                                      var total = 0
                                      for (var j = 0; j < task.Responses.length; j++) {
                                        var thisPersonsResponse = task.Responses[j][index].Response
                                        if (thisPersonsResponse == ids[i]) {
                                          total++;
                                        }
                                      }
                                      var cur = {
                                        "id":ids[i],
                                        "label":ids[i],
                                        "value":total,
                                        "color":color
                                      }
                                      data.push(cur)
                                    }
                                    return (<View style={[styles.surveyDataRow,{width:'100%',height:300,marginBottom:30}]} key={index + '-'}>
                                      <Text style={styles.surveyQuestion}>Q{(index+1) + ': ' + q.Question}</Text>
                                      <ResponsivePie
                                        data={data}
                                        colors={{ datum: 'data.color' }}
                                        margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
                                        innerRadius={0.5}
                                        padAngle={0.7}
                                        cornerRadius={3}
                                        activeOuterRadiusOffset={8}
                                        borderWidth={1}
                                        borderColor={colors.headerBorder}
                                        arcLinkLabelsSkipAngle={10}
                                        arcLinkLabelsTextColor={colors.mainTextColor}
                                        arcLinkLabelsThickness={2}
                                        arcLinkLabelsColor={colors.mainTextColor}
                                        arcLabelsSkipAngle={10}
                                        arcLabelsTextColor={colors.mainTextColor}
                                        legends={[
                                            {
                                                anchor: 'bottom',
                                                direction: 'row',
                                                justify: false,
                                                translateX: 40,
                                                translateY: 56,
                                                itemsSpacing: 0,
                                                itemWidth: 100,
                                                itemHeight: 18,
                                                itemTextColor: colors.mainTextColor,
                                                itemDirection: 'left-to-right',
                                                itemOpacity: 1,
                                                symbolSize: 18,
                                                symbolShape: 'circle',
                                                effects: [
                                                    {
                                                        on: 'hover',
                                                        style: {
                                                            itemTextColor: '#000'
                                                        }
                                                    }
                                                ]
                                            }
                                        ]}
                                    />
                                    </View>)
                                  }
                                })}
                              </View>
                            } else {
                              view = <View key={'taskRes_'+rIndex}>
                              </View>
                            }
                          } else if (task.Type == 2) {
                            // Payment response.
                            if (rIndex == 0) {
                              view = <View style={styles.paymentResponse} key={'taskRes_'+rIndex}>
                                <View style={styles.paymentsControls}>
                                  <TouchableOpacity style={styles.paymentControlsTouchAmount}>
                                    <Text style={styles.paymentsControlsText}>Client</Text>
                                  </TouchableOpacity>
                                  <TouchableOpacity style={styles.paymentControlsTouchAmount}>
                                    <Text style={styles.paymentsControlsText}>Amount</Text>
                                  </TouchableOpacity>
                                  <TouchableOpacity style={styles.paymentControlsNumber}>
                                    <Text style={styles.paymentsControlsText}>Status</Text>
                                  </TouchableOpacity>
                                  <TouchableOpacity style={styles.paymentControlsTouchDescription}>
                                  </TouchableOpacity>
                                  <TouchableOpacity style={styles.paymentControlsTouchDate}>
                                    <Text style={[styles.paymentsControlsText,]}>Created</Text>
                                  </TouchableOpacity>
                                  <TouchableOpacity style={styles.paymentControlsTouchView}>
                                    <Text style={[styles.paymentsControlsText,{textAlign:'right'}]}>View Receipt</Text>
                                  </TouchableOpacity>
                                </View>
                                <View style={styles.paymentsPreviousInvoices}>
                                  {task.Responses.map((line, paymentLineIndex) => {
                                    // Amount/total, Chip/status, Invoice Number/number, Due/period_end, Created/created, View/hosted_invoice_url
                                    return (<View key={line.id} style={styles.paymentRow}>
                                        <View style={[styles.paymentRowTouchAmount]}>
                                          <Text style={[styles.paymentRowText]}>
                                            {line.Client.FirstName + ' ' + line.Client.LastName}
                                          </Text>
                                        </View>
                                        <View style={[styles.paymentRowTouchAmount]}>
                                          <Text style={[styles.paymentRowText]}>
                                            ${(parseInt(line.Amount)/100).toFixed(2)}
                                          </Text>
                                        </View>
                                        <View style={styles.paymentRowTouchAmountStatus}>
                                          {line.IsPaid == 0 && (<><Chip
                                            title='Uncollected'
                                            type='outline'
                                            icon={{
                                              name:'checkmark-outline',
                                              type:'ionicon',
                                              size:16,
                                              color:'#fff'
                                            }}
                                            disabledStyle={{backgroundColor:btnColors.caution,borderColor:btnColors.caution,color:btnColors.caution,margin:5,paddingLeft:3,paddingTop:3,paddingBottom:3,paddingRight:8}}
                                            disabledTitleStyle={{color:'#fff'}}
                                            disabled={true}
                                          /></>) ||
                                            (<>{line.IsPaid == 1 && (<>
                                              <Chip
                                                title='Paid'
                                                type='outline'
                                                icon={{
                                                  name:'checkmark-outline',
                                                  type:'ionicon',
                                                  size:16,
                                                  color:'#fff'
                                                }}
                                                disabledStyle={{backgroundColor:btnColors.success,borderColor:btnColors.success,color:btnColors.success,margin:5,paddingLeft:3,paddingTop:3,paddingBottom:3,paddingRight:8}}
                                                disabledTitleStyle={{color:'#fff'}}
                                                disabled={true}
                                              />
                                            </>) || (<Chip
                                              title='Void'
                                              type='outline'
                                              icon={{
                                                name:'checkmark-outline',
                                                type:'ionicon',
                                                size:16,
                                                color:'#fff'
                                              }}
                                              disabledStyle={{backgroundColor:btnColors.danger,borderColor:btnColors.danger,color:btnColors.danger,margin:5,paddingLeft:3,paddingTop:3,paddingBottom:3,paddingRight:8}}
                                              disabledTitleStyle={{color:'#fff'}}
                                              disabled={true}
                                            />)}
                                          </>)}
                                        </View>
                                        <View style={styles.paymentRowTouchDescription}>
                                        </View>
                                        <View style={styles.paymentRowTouchDate}>
                                          <Text style={styles.paymentRowText}>{parseSimpleDateText(sqlToJsDate(line.Created))}</Text>
                                        </View>
                                        <View style={styles.paymentRowTouchView}>
                                          <Chip
                                              title='View'
                                              type='outline'
                                              onPress={() => {
                                                window.open(line.Receipt, '_blank')
                                              }}
                                              buttonStyle={{
                                                padding:5,
                                                margin:5
                                              }}
                                            />
                                        </View>
                                      </View>)
                                  })}
                                </View>
                              </View>
                            } else {
                              view = <View key={'taskRes_'+rIndex}>
                              </View>
                            }
                            
                          } else if (task.Type == 3) {
                            // Contract response.
                            if (rIndex == 0) {
                              view = <View style={styles.paymentResponse} key={'taskRes_'+rIndex}>
                                <View style={styles.paymentsControls}>
                                  <TouchableOpacity style={[styles.paymentControlsTouchAmount,{flex:95}]}>
                                    <Text style={styles.paymentsControlsText}>Client</Text>
                                  </TouchableOpacity>
                                  <TouchableOpacity style={styles.paymentControlsTouchDate}>
                                    <Text style={[styles.paymentsControlsText,]}>Created</Text>
                                  </TouchableOpacity>
                                  <TouchableOpacity style={styles.paymentControlsTouchView}>
                                    <Text style={[styles.paymentsControlsText,{textAlign:'right'}]}>View Contract</Text>
                                  </TouchableOpacity>
                                </View>
                                <View style={styles.paymentsPreviousInvoices}>
                                  {task.Responses.map((line, paymentLineIndex) => {
                                    return (<View key={line.id} style={styles.paymentRow}>
                                        <View style={[styles.paymentRowTouchAmount,{flex:91}]}>
                                          <Text style={[styles.paymentRowText]}>
                                            {line.Client.FirstName + ' ' + line.Client.LastName}
                                          </Text>
                                        </View>
                                        <View style={styles.paymentRowTouchDate}>
                                          <Text style={styles.paymentRowText}>{parseSimpleDateText(sqlToJsDate(line.Created))}</Text>
                                        </View>
                                        <View style={styles.paymentRowTouchView}>
                                          <Chip
                                              title='View'
                                              type='outline'
                                              onPress={() => {
                                                window.open(line.File, '_blank')
                                              }}
                                              buttonStyle={{
                                                padding:5,
                                                margin:5
                                              }}
                                            />
                                        </View>
                                      </View>)
                                  })}
                                </View>
                              </View>
                            } else {
                              view = <View key={'taskRes_'+rIndex}>
                              </View>
                            }
                          } else {
                            view = <View key={'taskRes_'+rIndex}>
                            </View>
                          }

                          return view 

                        })}
                      </View>)}
                    </View>
                  </View>)
                })}
              </View>)}
            </View>
          </View>)}

          {showAddClient && (<View style={[styles.promptListContainer,{width:'50%',height:'60%',flex:1}]}>
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
