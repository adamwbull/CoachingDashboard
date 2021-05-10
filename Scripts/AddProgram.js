import { StatusBar } from 'expo-status-bar'
import React, { useEffect, useState } from 'react'
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'

import { addProgramLight, colorsLight, btnColors } from '../Scripts/Styles.js'
import { homeDark, colorsDark, innerDrawerDark } from '../Scripts/StylesDark.js'
import { useLinkTo, Link } from '@react-navigation/native'
import LoadingScreen from '../Scripts/LoadingScreen.js'
import { Helmet } from "react-helmet"
import { Icon, Button } from 'react-native-elements'
import { set, get, getTTL, ttl } from './Storage.js'
import { TextInput } from 'react-native-web'
import _ from 'lodash'
import { Search, Popup } from 'semantic-ui-react'
import ActivityIndicatorView from '../Scripts/ActivityIndicatorView.js'
import { getTextPrompts, getSurveys, getPayments, getContracts, getConcepts } from '../Scripts/API.js'
import 'semantic-ui-css/semantic.min.css'
import './CSS/custom-search.css'

export default function AddProgram() {
  const linkTo = useLinkTo()
  const [refreshing, setRefreshing] = useState(true)
  const [styles, setStyles] = useState(addProgramLight)
  const [colors, setColors] = useState(colorsLight)
  const [coach, setCoach] = useState({})

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
  // Search data.
  const [loading, setLoading] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const [searchList, setSearchList] = useState([])
  const [searchHardlist, setSearchHardlist] = useState([])
  const [chosenTask, setChosenTask] = useState({})
  const [searchResults, setSearchResults] = useState([])

  const timeoutRef = React.useRef()

  useEffect(() => {
    clearTimeout(timeoutRef.current)
    const sCoach = get('Coach')
    if (sCoach != null) {
      setCoach(sCoach)
      if (sCoach.Plan == 2) {
        setAddContractDisabled(false)
        setAddPaymentDisabled(false)
      } else if (sCoach.Plan == 1) {
        setAddPaymentDisabled(false)
      }
    }
  },[])

  // Add Program controls.
  const addProgram = () => {
    console.log ('Add new program...')
  }

  const onTitle = (t) => {
    setTitle(t)
  }

  const onDescription = (t) => {
    setDescription(t)
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
    switch (type) {
      case 0:
        var list = JSON.parse(JSON.stringify(await getTextPrompts(coach.Id, coach.Token)))
        var ret = []
        list.forEach((item, index) => {
          var set = {}
          set.title = item.Title
          set.description = item.Text
          set.id = item.Id
          set.index = index
          ret.push(set)
        })
        setSearchList(ret)
        setSearchHardlist(list)
      break
      case 1:
        var list = JSON.parse(JSON.stringify(await getSurveys(coach.Id, coach.Token)))
        var ret = []
        list.forEach((item, index) => {
          var set = {}
          set.title = item.Title
          set.description = item.Text
          set.id = item.Id
          set.index = index
          ret.push(set)
        })
        setSearchList(ret)
        setSearchHardlist(list)
      break
      case 2:
        var list = JSON.parse(JSON.stringify(await getPayments(coach.Id, coach.Token)))
        var ret = []
        list.forEach((item, index) => {
          var set = {}
          set.title = item.Title
          set.description = item.Memo
          set.id = item.Id
          set.index = index
          ret.push(set)
        })
        setSearchList(ret)
        setSearchHardlist(list)
      break
      case 3:
        var list = JSON.parse(JSON.stringify(await getContracts(coach.Id, coach.Token)))
        var ret = []
        list.forEach((item, index) => {
          var set = {}
          set.title = item.Title
          var fileArr = item.File.split('/')
          set.description = fileArr[fileArr.length-1]
          set.id = item.Id
          set.index = index
          ret.push(set)
        })
        setSearchList(ret)
        setSearchHardlist(list)
      break
      case 4:
        var list = JSON.parse(JSON.stringify(await getConcepts(coach.Id, coach.Token)))
        var ret = []
        list.forEach((item, index) => {
          var set = {}
          set.title = item.Title
          var parser = new DOMParser();
          var htmlDoc = parser.parseFromString(txt, 'text/html');
          set.description = htmlDoc.body.firstChild.textContent
          set.id = item.Id
          set.index = index
          ret.push(set)
        })
        setSearchList(ret)
        setSearchHardlist(list)
      break
      default:
        var list = JSON.parse(JSON.stringify(await getTextPrompts(coach.Id, coach.Token)))
        var ret = []
        list.forEach((item, index) => {
          var set = {}
          set.title = item.Title
          set.description = item.Text
          set.id = item.Id
          set.index = index
          ret.push(set)
        })
        setSearchList(ret)
        setSearchHardlist(list)
      break
    }
  }

  const handleSearchChange = React.useCallback((e, data) => {
    clearTimeout(timeoutRef.current)
    setLoading(true)
    setSearchValue(data.value)

    timeoutRef.current = setTimeout(() => {
      if (data.value.length === 0) {
        setSearchResults([])
        setSearchValue('')
        setLoading(false)
        return
      }

      const re = new RegExp(_.escapeRegExp(data.value), 'i')
      const isMatch = (result) => re.test(result.title)

      setLoading(false)
      var res = _.filter(searchList, isMatch)
      console.log(res)
      setSearchResults(res)
    }, 300)
  })

  const chooseSearchResult = (e, data) => {
    var list = JSON.parse(JSON.stringify(taskList))
    list[currentIndex].TaskId = data.result.id
    list[currentIndex].Title = data.result.title
    setTaskList(list)
    setChosenTask(searchHardlist[data.result.index])
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
    setChosenTask({})
    setSearchValue('')
    setCurrentIndex(taskList.length)
    var newTask = {Type:type,TaskId:0,Title:title}
    var list = taskList
    list.push(newTask)
    setTaskList(list)
    setMainActivityIndicator(true)
    getSearchList(type)
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
    setTaskList(newList)
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
    setTaskList(newList)
  }

  const selectTask = (index, type, t, v) => {
    getSearchList(type)
    setTypeText(t)
    setTypeVisit(v)
    setCurrentIndex(index)
    setSearchValue('')
    var id = taskList[index].TaskId
    if (id == 0) {
      setChosenTask({})
    } else {
      var task = searchHardlist.filter(task => task.Id === id)
      setChosenTask(task[0])
    }
  }

  const deleteTask = () => {
    var list = JSON.parse(JSON.stringify(taskList))
    if (list.length == 1) {
      setMain(false)
      setCurrentIndex(0)
    }
    setSearchValue('')
    list.splice(currentIndex, 1)
    setTaskList(list)
    if (currentIndex == 0) {
      setCurrentIndex(0)
    } else {
      setCurrentIndex(currentIndex-1)
    }
  }




  return (<ScrollView contentContainerStyle={styles.scrollView}>
    <View style={styles.container}>
      <View style={styles.main}>
        <View style={styles.body}>
          <View style={styles.bodyHeader}>
            <View style={styles.bodyTitleGroup}>
              <Text style={styles.bodyTitle}>Add Program</Text>
              <Text style={styles.bodyDesc}></Text>
            </View>
          </View>

          <View style={styles.addProgramContainer}>
            <View style={styles.addProgramHeader}>
              <Text style={styles.addProgramLabel}>Program Title</Text>
              <TextInput
                style={styles.inputStyle}
                value={title}
                placeholder='ex. 30 Days to a Growth Mindset'
                onChangeText={onTitle}
              />
              <Text style={[styles.addProgramLabel,{marginTop:10}]}>Description</Text>
              <TextInput
                style={styles.inputStyle}
                value={description}
                multiline={true}
                numberOfLines={3}
                placeholder='ex. Your awesome program description! Only seen by you.'
                onChangeText={onDescription}
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
                      {searchList.length > 0 && (<View style={{flexDirection:'row'}}>
                        <View style={styles.addProgramMainSearch}>
                          <Text style={styles.searchTaskText}>Search {typeText}</Text>
                          <Search
                            loading={loading}
                            onResultSelect={chooseSearchResult}
                            onSearchChange={handleSearchChange}
                            results={searchResults}
                            value={searchValue}
                            className='custom'
                            size={'mini'}
                          />
                        </View>
                        {chosenTask.Id !== undefined && (<View style={styles.chosenTask}>
                          <Text style={styles.chosenTaskTitle}>{chosenTask.Title}</Text>
                          <Text style={styles.chosenTaskText}>{chosenTask.Text}</Text>
                        </View>)}
                      </View>)
                      || (<>
                        <Text style={styles.addProgramMainHelpText}>No {typeText} created yet! Visit the {typeVisit} tab on the left.</Text>
                      </>)}
                    </View>
                  </View>)
                  ||
                  (<Text style={styles.addProgramMainHelpText}>
                    {taskList.length > 0 && ('Select a Task to configure.') || (`Add a Task to configure.${"\n"}Tasks are existing Prompts, Surveys, Payments, Contracts, or Concepts.`)}
                  </Text>)}
                </>)}
              </View>
            </View>
            <View style={styles.addProgramFooter}>
              <View style={{flex:1}}>
                {canPublish && (<>
                  <Button
                    title='Publish Program'
                    buttonStyle={[styles.addProgramListButton]}
                    containerStyle={styles.addProgramListButtonContainer}
                  />
                </>)
                || (<>
                  <Popup content='Cannot be published until Title/Description are filled out and all created Tasks are chosen.'
                  trigger={<Button
                    title='Publish Program'
                    disabled={true}
                    buttonStyle={[styles.addProgramListButton]}
                    containerStyle={styles.addProgramListButtonContainer} />}
                    style={{backgroundColor:colors.secondaryBackground,padding:5,borderRadius:10,fontFamily:'Poppins',marginBottom:-10,marginLeft:10}}
                  />
                </>)}
              </View>
              <View style={{flex:1}}>
                {title.length > 0 && (<>
                  <Button
                    title='Create Draft'
                    buttonStyle={[styles.addProgramListButton,{backgroundColor:btnColors.caution}]}
                    containerStyle={styles.addProgramListButtonContainer}
                  />
                </>)
                || (<>
                  <Popup content='At least the Title needs to be filled out before a draft can be created.'
                  trigger={<Button
                      title='Create Draft'
                      disabled={true}
                      buttonStyle={[styles.addProgramListButton,{backgroundColor:btnColors.caution}]}
                      containerStyle={styles.addProgramListButtonContainer}
                    />}
                    style={{backgroundColor:colors.secondaryBackground,padding:5,borderRadius:10,fontFamily:'Poppins',marginBottom:-10,marginRight:10}}
                  />
                </>)}
              </View>
            </View>
          </View>
        </View>
      </View>
    </View>
  </ScrollView>)

}
