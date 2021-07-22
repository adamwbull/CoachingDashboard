import { StatusBar } from 'expo-status-bar'
import React, { useEffect, useState, useContext } from 'react'
import { TouchableOpacity, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import { addProgramLight, colorsLight, btnColors } from '../Scripts/Styles.js'
import { homeDark, colorsDark, innerDrawerDark } from '../Scripts/StylesDark.js'
import { useLinkTo, Link } from '@react-navigation/native'
import LoadingScreen from '../Scripts/LoadingScreen.js'
import { Helmet } from "react-helmet"
import { Icon, Button } from 'react-native-elements'
import { set, get, getTTL, ttl } from './Storage.js'
import { TextInput } from 'react-native-web'
import _ from 'lodash'
import { Search, Popup, Checkbox } from 'semantic-ui-react'
import ActivityIndicatorView from '../Scripts/ActivityIndicatorView.js'
import { getTimezoneName, getTimezoneOffset, getAddProgramData } from '../Scripts/API.js'
import 'semantic-ui-css/semantic.min.css'
import './CSS/custom-search.css'
import { TimePicker, InputNumber } from 'antd';
import 'antd/dist/antd.css';
import moment from 'moment'

import userContext from './Context.js'

export default function AddProgram() {

  const linkTo = useLinkTo()
  const user = useContext(userContext)

  const [refreshing, setRefreshing] = useState(true)
  const [styles, setStyles] = useState(addProgramLight)
  const [colors, setColors] = useState(colorsLight)
  const [coach, setCoach] = useState(user)

  // Stage controls.
  const [showMain, setMain] = useState(false)
  const [showMainActivityIndicator, setMainActivityIndicator] = useState(false)
  const [dropdownVisible, setDropdownVisible] = useState(false)
  const [addPaymentDisabled, setAddPaymentDisabled] = useState(true)
  const [addContractDisabled, setAddContractDisabled] = useState(true)
  const [hoverBackground1, setHoverBackground1] = useState({})
  const [hoverBackground2, setHoverBackground2] = useState({})
  const [hoverBackground3, setHoverBackground3] = useState({})
  const [hoverBackground4, setHoverBackground4] = useState({})
  const [hoverBackground5, setHoverBackground5] = useState({})

  // Task controls.
  const [taskCategory, setTaskCategory] = useState(0)
  const [task, setTask] = useState({})
  const [currentIndex, setCurrentIndex] = useState(0)
  const [typeText, setTypeText] = useState('')
  const [typeVisit, setTypeVisit] = useState('')

  // Data.
  const [canPublish, setCanPublish] = useState(false)
  const [taskList, setTaskList] = useState([])
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [error, setError] = useState('')
  
  // Search data.
  const [loading, setLoading] = useState(false)
  const [searchList, setSearchList] = useState([]) 
  const [searchValue, setSearchValue] = useState('')
  const [hasSearchContents, setHasSearchContents] = useState(0)

  const [textPrompts, setTextPrompts] = useState([])
  const [surveys, setSurveys] = useState([])
  const [payments, setPayments] = useState([])
  const [contracts, setContracts] = useState([])
  const [concepts, setConcepts] = useState([])
  const [allData, setAllData] = useState([[], [], [], [], []])
  
  const timeoutRef = React.useRef()

  const properlySetTaskList = (list) => {
    for (var i = 0; i < list.length; i++) {
      if (list[i].DueAtTimeValue != null) {
        list[i].DueAtTimeValue = moment(list[i].DueAtTimeValue)
      }
    }
    setTaskList(list)
  }

  const getData = async () => {
    var data = await getAddProgramData(coach.Id, coach.Token)
    setAllData(data)
    // Text Prompts
    var tp = JSON.parse(JSON.stringify(data[0]))
    for (var i = 0; i < tp.length; i++) {
      tp[i].Visible = true
    }
    setTextPrompts(tp)
    // Surveys
    var s = JSON.parse(JSON.stringify(data[1]))
    for (var i = 0; i < s.length; i++) {
      s[i].Visible = true
    }
    setSurveys(s)
    // Payments
    var p = JSON.parse(JSON.stringify(data[2]))
    for (var i = 0; i < p.length; i++) {
      p[i].Visible = true
    }
    setPayments(p)
    // Contracts
    var c = JSON.parse(JSON.stringify(data[3]))
    for (var i = 0; i < c.length; i++) {
      c[i].Visible = true
    }
    setContracts(c)
    // Concepts
    var co = JSON.parse(JSON.stringify(data[4]))
    for (var i = 0; i < co.length; i++) {
      co[i].Visible = true
    }
    setConcepts(co)
  }

  useEffect(() => {
    getData()
    if (coach != null) {
      if (coach.Plan == 2) {
        setAddContractDisabled(false)
        setAddPaymentDisabled(false)
      } else if (coach.Plan == 1) {
        setAddPaymentDisabled(false)
      }
    }
  },[])

  // Add Program controls.
  const addProgram = () => {
    console.log ('Add new program...')
    // Need to add ProgramId and ItemOrder to each Task.
    var program = {
      CoachId:coach.Id,
      IsEditable:1,
      Title:title,
      Description:description
    }
    var programTasks = []
    var itemOrder = 1
    for (var i = 0; i < taskList.length; i++) {
      var task = taskList[i]
      task.ItemOrder = itemOrder
      itemOrder++
      programTasks.push(task)
    }

    console.log('program:', program)
    console.log('programTasks:',programTasks)
  }

  const publishCheck = (t, d, l) => {
    var publishAllowed = true
    // Check title/description.
    if (t.length == 0 || d.length == 0) {
      publishAllowed = false
    }
    // Check tasks.
    if (l.length == 0) {
      publishAllowed = false
    } else {
      for (var i = 0; i < l.length; i++) {
        if (l[i].TaskId == 0) {
          publishAllowed = false
          break
        }
      }
    }
    setCanPublish(publishAllowed)
  }

  const handleBlur = (type, e) => {
    
    var t = e.target.value
    if (type == 0) {
      setTitle(t)
      publishCheck(t, description, taskList)
    } else {
      setDescription(t)
      publishCheck(title, t, taskList)
    }

  }

  const toggleDropdown = () => {
    if (dropdownVisible) {
      setDropdownVisible(false)
    } else {
      setDropdownVisible(true)
      window.addEventListener('click', closeDropdown)
    }
  }

  const closeDropdown = () => {
    setDropdownVisible(false)
    window.removeEventListener('click', closeDropdown)
  }

  // Search controls.
  const getSearchList = async (type) => {
    var list = []
    switch (type) {
      case 0:
        list = JSON.parse(JSON.stringify(textPrompts))
      break
      case 1:
        list = JSON.parse(JSON.stringify(surveys))
      break
      case 2:
        list = JSON.parse(JSON.stringify(payments))
      break
      case 3:
        list = JSON.parse(JSON.stringify(contracts))
      break
      case 4:
        list = JSON.parse(JSON.stringify(concepts))
      break
      default:
        list = JSON.parse(JSON.stringify(textPrompts))
      break
    }
    setSearchList(list)
  }

  const selectFromSearchList = (index) => {
    var list = JSON.parse(JSON.stringify(taskList))
    list[currentIndex].TaskId = searchList[index].Id
    list[currentIndex].Title = searchList[index].Title
    if (searchList[index].Memo == undefined) {
      list[currentIndex].Text = searchList[index].Text
    } else {
      list[currentIndex].Text = searchList[index].Memo
    }
    properlySetTaskList(list)
    publishCheck(title, description, list)
  }

  const search = (text) => {
    
    // Update content highlight.
    var newHasSearchContents = (text.length > 0) ? 1 : 0
    setHasSearchContents(newHasSearchContents)

    // Filter.
    var len = text.length

    var newSearchList = JSON.parse(JSON.stringify(searchList))
    for (var i = 0; i < newSearchList.length; i++) {
      if (len == 0) {
        newSearchList[i].Visible = true
      } else if (newSearchList[i].Title.includes(text)) {
        newSearchList[i].Visible = true
      } else {
        newSearchList[i].Visible = false
      }
    }
    setSearchList(newSearchList)

  }

  // Add Task controls.
  const addTask = (type) => {
    closeDropdown()
    var title = ''
    var t = ''
    var v = ''
    switch (type) {
      case 0:
        title = 'Unchosen Text Prompt'
        t = 'Text Prompts'
        v = 'Prompts'
      break
      case 1:
        title = 'Unchosen Survey'
        t = 'Surveys'
        v = 'Prompts'
      break
      case 2:
        title = 'Unchosen Payment'
        t = 'Payments'
        v = 'Prompts'
      break
      case 3:
        title = 'Unchosen Contract'
        t = 'Contracts'
        v = 'Prompts'
      break
      case 4:
        title = 'Unchosen Concept'
        t = 'Concepts'
        v = 'Concepts'
      break
      default:
        title = 'Unchosen Text Prompt'
        t = 'Text Prompts'
        v = 'Prompts'
      break
    }
    setTypeText(t)
    setTypeVisit(v)
    setSearchValue('')
    getSearchList(type)
    setCurrentIndex(taskList.length)
    var newTask = {
      Type:type,
      TaskId:0,
      Title:title,
      DueAfterDays:1,
      DueAtTime:'12:00 am',
      DueAtTimeValue:moment('12:00 am', 'HH:mm a'),
      SendNotification:1,
      ReleaseOnAssign:1,
    }
    var list = JSON.parse(JSON.stringify(taskList))
    list.push(newTask)
    properlySetTaskList(list)
    setMainActivityIndicator(true)
    setTimeout(() => {
      setMain(true)
      setMainActivityIndicator(false)
    }, 800)

  }

  const moveTaskUp = (index, l) => {
    var list = l
    var newList = JSON.parse(JSON.stringify(list))
    newList[index] = list[index-1]
    newList[index-1] = list[index]
    if (currentIndex == index) {
      setCurrentIndex(index-1)
    } else if (currentIndex == index-1) {
      setCurrentIndex(index)
    }
    properlySetTaskList(newList)
  }

  const moveTaskDown = (index, l) => {
    var list = l
    var newList = JSON.parse(JSON.stringify(list))
    newList[index] = list[index+1]
    newList[index+1] = list[index]
    if (currentIndex == index) {
      setCurrentIndex(index+1)
    } else if (currentIndex == index+1) {
      setCurrentIndex(index)
    }
    properlySetTaskList(newList)
  }

  const selectTask = (index, type, t, v) => {
    getSearchList(type)
    setTypeText(t)
    setTypeVisit(v)
    setCurrentIndex(index)
    setSearchValue('')
  }

  const deleteTask = () => {
    var list = JSON.parse(JSON.stringify(taskList))
    if (list.length == 1) {
      setMain(false)
      setCurrentIndex(0)
    }
    setSearchValue('')
    list.splice(currentIndex, 1)
    properlySetTaskList(list)
    if (currentIndex == 0) {
      setCurrentIndex(0)
    } else {
      setCurrentIndex(currentIndex-1)
    }
    publishCheck(title, description, list)
  }

  // Update Task settings.
  const updateReleaseOnAssign = () => {
    var list = JSON.parse(JSON.stringify(taskList))
    list[currentIndex].ReleaseOnAssign = (list[currentIndex].ReleaseOnAssign == 1) ? 0 : 1
    properlySetTaskList(list)
  }

  const updateSendNotification = () => {
    var list = JSON.parse(JSON.stringify(taskList))
    list[currentIndex].SendNotification = (list[currentIndex].SendNotification == 1) ? 0 : 1
    properlySetTaskList(list)
  }

  const updateHasDueDate = () => {
    var list = JSON.parse(JSON.stringify(taskList))
    list[currentIndex].DueAfterDays = (list[currentIndex].DueAfterDays == 0) ? 1 : 0
    properlySetTaskList(list)
  }

  const changeDueAfterDays = (value) => {
    console.log(value)
    var list = taskList
    list[currentIndex].DueAfterDays = value
    properlySetTaskList(list)
  }

  const changeDueAtTime = (time, timeString) => {
    console.log(time, timeString)
    var list = JSON.parse(JSON.stringify(taskList))
    list[currentIndex].DueAtTime = timeString
    list[currentIndex].DueAtTimeValue = time
    properlySetTaskList(list)
  }

  return (<ScrollView contentContainerStyle={styles.scrollView}>
    <View style={styles.container}>
      <View style={styles.main}>
        <View style={styles.body}>

          <View style={styles.bodyHeader}>
            <View style={styles.bodyTitleGroup}>
              <Text style={styles.bodyTitle}>New Program</Text>
              <Text style={styles.bodyDesc}>Create a new program to add Clients to.</Text>
            </View>
          </View>

          <View style={styles.addProgramContainer}>
            <View style={styles.addProgramHeader}>
              <Text style={styles.addProgramLabel}>Program Title</Text>
              <TextInput
                style={styles.inputStyle}
                placeholder='ex. 30 Days to a Growth Mindset'
                onBlur={(e) => handleBlur(0, e)}
              />
              <Text style={[styles.addProgramLabel,{marginTop:10}]}>Description</Text>
              <TextInput
                style={styles.inputStyle}
                multiline={true}
                numberOfLines={3}
                placeholder='ex. Your awesome program description! Only seen by you.'
                onBlur={(e) => handleBlur(1, e)}
              />
            </View>

            <View style={styles.addProgramBody}>
              <View style={styles.addProgramListContainer}>
                <Button
                  title='Add Task'
                  onPress={toggleDropdown}
                  buttonStyle={[styles.addProgramListButton,{backgroundColor:btnColors.success}]}
                  containerStyle={styles.addProgramListButtonContainer}
                />
                <View contentContainerStyle={styles.addProgramList}>
                {taskList.map((item, index) => {
                  const isCurrent = (index == currentIndex) ? {borderBottomColor:btnColors.info,borderTopColor:btnColors.info} : {}
                  var icon = ''
                  var t = ''
                  var v = ''
                  switch (item.Type) {
                    case 0:
                      icon = 'create'
                      t = 'Text Prompts'
                      v = 'Prompts'
                    break
                    case 1:
                      icon = 'clipboard'
                      t = 'Surveys'
                      v = 'Prompts'
                    break
                    case 2:
                      icon = 'card'
                      t = 'Payments'
                      v = 'Prompts'
                    break
                    case 3:
                      icon = 'document-text'
                      t = 'Contracts'
                      v = 'Prompts'
                    break
                    case 4:
                      icon = 'book'
                      t = 'Concepts'
                      v = 'Concepts'
                    break
                    default:
                      icon = 'create'
                      t = 'Text Prompts'
                      v = 'Prompts'
                    break
                  }
                  return (<View style={[styles.programTask,isCurrent]} key={index}>
                    <Pressable style={styles.programTaskMain} onPress={() => selectTask(index, item.Type, t, v)}>
                      <Icon
                        name={icon}
                        type='ionicon'
                        size={26}
                        style={styles.programTaskIcon}
                        color={colors.mainTextColor}
                      />
                      <Text style={styles.programTaskTitle}>{item.Title}</Text>
                    </Pressable>
                    <View style={styles.programTaskNav}>
                      <Icon
                        name='chevron-up'
                        type='ionicon'
                        size={25}
                        color={(index == 0) ? colors.mainBackground : colors.mainTextColor}
                        onPress={() => moveTaskUp(index, taskList)}
                        disabledStyle={{backgroundColor:colors.mainBackground}}
                        disabled={(index == 0) ? true : false}
                      />
                      <Icon
                        name='chevron-down'
                        type='ionicon'
                        size={25}
                        color={(index == taskList.length-1) ? colors.mainBackground : colors.mainTextColor}
                        onPress={() => moveTaskDown(index, taskList)}
                        disabledStyle={{backgroundColor:colors.mainBackground}}
                        disabled={(index == taskList.length-1) ? true : false}
                      />
                    </View>
                  </View>)
                })}
                </View>
                {dropdownVisible && (<View style={styles.addProgramListDropdown}>

                  <Pressable style={[styles.addProgramListDropdownTouch,hoverBackground1]} onPress={() => addTask(0)} onPressIn={() => setHoverBackground1({backgroundColor:colors.secondaryBackground})} onPressOut={() => setHoverBackground1({})}>
                    <Text style={styles.addProgramListDropdownText}>Add Text Prompt</Text>
                  </Pressable>

                  <Pressable style={[styles.addProgramListDropdownTouch,hoverBackground2]} onPress={() => addTask(1)} onPressIn={() => setHoverBackground2({backgroundColor:colors.secondaryBackground})} onPressOut={() => setHoverBackground2({})}>
                    <Text style={styles.addProgramListDropdownText}>Add Survey</Text>
                  </Pressable>

                  {addPaymentDisabled && (<Pressable disabled={addPaymentDisabled} style={[styles.addProgramListDropdownTouch]}>
                    <Text style={[styles.addProgramListDropdownText,{textDecorationLine:'line-through',textDecorationColor:colors.mainTextColor}]}>Add Payment</Text>
                    <Text style={styles.planRequiredText}>
                      <Text style={{color:btnColors.success}}>Standard Plan</Text> Required
                    </Text>
                  </Pressable>)
                  || (<Pressable style={[styles.addProgramListDropdownTouch,hoverBackground3]} onPress={() => addTask(2)} onPressIn={() => setHoverBackground3({backgroundColor:colors.secondaryBackground})} onPressOut={() => setHoverBackground3({})}>
                    <Text style={styles.addProgramListDropdownText}>Add Payment</Text>
                  </Pressable>)}

                  {addContractDisabled && (<Pressable disabled={addContractDisabled} style={[styles.addProgramListDropdownTouch]}>
                    <Text style={[styles.addProgramListDropdownText,{textDecorationLine:'line-through',textDecorationColor:colors.mainTextColor}]}>Add Contract</Text>
                    <Text style={styles.planRequiredText}>
                      <Text style={{color:btnColors.danger}}>Professional Plan</Text> Required
                    </Text>
                  </Pressable>)
                  || (<Pressable style={[styles.addProgramListDropdownTouch,hoverBackground4]} onPress={() => addTask(3)} onPressIn={() => setHoverBackground4({backgroundColor:colors.secondaryBackground})} onPressOut={() => setHoverBackground4({})}>
                    <Text style={[styles.addProgramListDropdownText]}>Add Contract</Text>
                  </Pressable>)}

                  <Pressable style={[styles.addProgramListDropdownTouchBottom,hoverBackground5]} onPress={() => addTask(4)} onPressIn={() => setHoverBackground5({backgroundColor:colors.secondaryBackground})} onPressOut={() => setHoverBackground5({})}>
                    <Text style={styles.addProgramListDropdownText}>Add Concept</Text>
                  </Pressable>

                </View>)}
              </View>
              <View style={styles.addProgramMainContainer}>
                {showMainActivityIndicator && (<ActivityIndicatorView />)
                || (<>
                  {showMain &&
                  (<View style={styles.addProgramMain}>
                    <View style={styles.addProgramMainHeader}>
                      <View style={styles.addProgramMainHeaderLeft}>
                        <Text style={styles.addProgramMainHeaderTaskText}>Task #{currentIndex+1}</Text>
                        <Text style={styles.addProgramMainHeaderTitle}>{taskList[currentIndex].Title}</Text>
                      </View>
                      <Pressable style={styles.addProgramMainHeaderRight} onPress={() => deleteTask()}>
                        <Text style={styles.addProgramMainHeaderDelete}>Delete</Text>
                      </Pressable>
                    </View>
                    <View style={styles.addProgramMainBody}>
                      {taskList[currentIndex].TaskId !== 0 && (<View style={{
                        width:'100%',
                        flexDirection:'row',
                        justifyContent:'flex-start',
                        flex:1
                      }}>
                        <View style={styles.chosenTaskContainer}>
                          <View style={styles.chosenTaskSettings}>
                            <Text style={styles.chosenTaskTitle}>Task Settings</Text>
                            <View style={styles.chosenTaskSettingsRow}>
                              <Checkbox 
                                checked={taskList[currentIndex].ReleaseOnAssign == 1}
                                toggle 
                                onChange={() => updateReleaseOnAssign()}
                              />
                              <Text style={styles.chosenTaskSettingText}>Release Immediately</Text>
                            </View>
                            <View style={styles.chosenTaskSettingsRow}>
                              <Checkbox 
                                checked={taskList[currentIndex].SendNotification == 1}
                                toggle 
                                onChange={() => updateSendNotification()}
                              />
                              <Text style={styles.chosenTaskSettingText}>Show Mobile Notification</Text>
                            </View>
                            <View style={styles.chosenTaskSettingsRow}>
                              <Checkbox 
                                checked={taskList[currentIndex].DueAfterDays !== 0}
                                toggle 
                                onChange={() => updateHasDueDate()}
                              />
                              <Text style={styles.chosenTaskSettingText}>Due Date</Text>
                            </View>
                            {taskList[currentIndex].DueAfterDays !== 0 && (<View style={styles.chosenTaskSettingsRow}>
                              <InputNumber min={1} max={365} defaultValue={1} onChange={changeDueAfterDays} value={taskList[currentIndex].DueAfterDays}/>
                              <Text style={styles.chosenTaskSettingTextDetail}>day{taskList[currentIndex].DueAfterDays > 1 && '' || ''} after assigned at</Text>
                              <TimePicker use12Hours format="hh:mm a" onChange={changeDueAtTime} defaultValue={moment('12:00 am', 'HH:mm a')} value={taskList[currentIndex].DueAtTimeValue} />
                              <Text style={styles.chosenTaskSettingTextDetail}>{getTimezoneName()}</Text>
                            </View>)}
                          </View>
                        </View>
                      </View>)
                      || (<>
                        {searchList.length > 0 && (<Text style={styles.addProgramMainHelpText}>Choose from the {typeText} to the right.</Text>) ||
                        (<Text style={styles.addProgramMainHelpText}>No {typeText} created yet! Visit the {typeVisit} tab on the left.</Text>)}
                      </>)}
                    </View>
                  </View>)
                  ||
                  (<Text style={styles.addProgramMainHelpText}>
                    {taskList.length > 0 && ('Select a Task to configure.') || (`Add a Task to configure.${"\n"}Tasks are existing Prompts, Surveys, Payments, Contracts, or Concepts.`)}
                  </Text>)}
                </>)}
              </View>
              {(showMain && showMainActivityIndicator == false) && (<View style={styles.addTaskSearchList}>
                <Text style={styles.searchTaskText}>{taskList[currentIndex].Id !== undefined && 'Replace' || 'Choose'} {typeText.substring(0,typeText.length-1)}</Text>
                <View style={hasSearchContents == 1 && [styles.searchHighlight] || [styles.searchHighlight,{borderColor:colors.headerBorder}]}>
                  <View style={styles.searchIcon}>
                    <Icon
                      name='search'
                      type='ionicon'
                      size={28}
                      color={hasSearchContents == 1 && colors.mainTextColor || colors.headerBorder}
                      style={[{marginLeft:5,marginTop:2}]}
                    />
                  </View>
                  <TextInput 
                    placeholder='Search...'
                    style={styles.searchInput}
                    onChange={(e) => {
                      search(e.currentTarget.value)
                    }}
                    className='custom-textinput'
                  />
                </View>
                <ScrollView contentContainerStyle={styles.addTaskSearchElements}>
                  {searchList.map((item, index) => {

                    var highlight = {borderColor:colors.secondaryBackground,borderWidth:2}
                    if (item.Id == taskList[currentIndex].TaskId) {
                      highlight = {
                        borderColor:btnColors.info,
                        borderWidth:2
                      }
                    }

                    if (item.Visible == true) {
                      return (<TouchableOpacity key={'search'+index} style={[styles.searchElement,highlight]}
                        onPress={() => selectFromSearchList(index)}
                      >
                        <Text style={styles.searchElementTitle}>{item.Title}</Text>
                        {item.Memo == undefined && (<Text style={styles.searchElementText}>{item.Text}</Text>) || 
                        (<Text style={styles.searchElementText}>{item.Memo}</Text>)}
                      </TouchableOpacity>)
                    }

                  })}
                </ScrollView>
              </View>)}
            </View>

            <View style={styles.addProgramFooter}>
              <View style={{flex:1}}>
                {canPublish && (<>
                  <Button
                    title='Create Program'
                    buttonStyle={[styles.addProgramListButton]}
                    containerStyle={styles.addProgramListButtonContainer}
                    onPress={() => addProgram()}
                  />
                </>)
                || (<>
                  <Popup content='Cannot be created until Title/Description are filled out and all created Tasks are chosen.'
                  trigger={<Button
                    title='Create Program'
                    disabled={true}
                    position={'top center'}
                    inverted
                    buttonStyle={[styles.addProgramListButton]}
                    containerStyle={styles.addProgramListButtonContainer} />}
                    style={{backgroundColor:colors.secondaryBackground,padding:5,borderRadius:10,fontFamily:'Poppins',marginBottom:-10,marginLeft:10}}
                  />
                </>)}
              </View>
              <View style={{flex:1}}>
                {}
              </View>
            </View>

          </View>
        </View>
      </View>
    </View>
  </ScrollView>)

}
