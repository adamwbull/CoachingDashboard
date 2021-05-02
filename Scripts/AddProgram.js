import { StatusBar } from 'expo-status-bar'
import React, { useEffect, useState } from 'react'
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { addProgramLight, colorsLight, btnColors } from '../Scripts/Styles.js'
import { homeDark, colorsDark, innerDrawerDark } from '../Scripts/StylesDark.js'
import { useLinkTo, Link } from '@react-navigation/native'
import LoadingScreen from '../Scripts/LoadingScreen.js'
import { Helmet } from "react-helmet"
import { Icon, Button } from 'react-native-elements'
import { set, get, getTTL, ttl } from './Storage.js'
import { TextInput } from 'react-native-web'
import { Search } from 'semantic-ui-react'

export default function AddProgram() {
  const linkTo = useLinkTo()
  const [refreshing, setRefreshing] = useState(true)
  const [styles, setStyles] = useState(addProgramLight)
  const [colors, setColors] = useState(colorsLight)
  const [coach, setCoach] = useState({})

  // Stage controls.
  const [showMain, setMain] = useState(false)
  const [dropdownVisible, setDropdownVisible] = useState(false)
  const [addPaymentDisabled, setAddPaymentDisabled] = useState(true)
  const [addContractDisabled, setAddContractDisabled] = useState(true)
  const [hoverBackground1, setHoverBackground1] = useState({})
  const [hoverBackground2, setHoverBackground2] = useState({})
  const [hoverBackground3, setHoverBackground3] = useState({})
  const [hoverBackground4, setHoverBackground4] = useState({})
  const [hoverBackground5, setHoverBackground5] = useState({})
  // Task controls.
  const [taskTitle, setTaskTitle] = useState('')
  const [taskCategory, setTaskCategory] = useState(0)
  const [task, setTask] = useState({})

  // Data.
  const [taskList, setTaskList] = useState([])
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')

  useEffect(() => {
    const sCoach = get('Coach')
    if (sCoach != null) {
      setCoach(sCoach)
      console.log(sCoach)
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

  // Add Text Prompt controls.
  const addTextPrompt = () => {
    closeDropdown()
    setTaskTitle('')
    setTaskCategory(0)
  }

  // Add Text Prompt controls.
  const addSurvey = () => {
    closeDropdown()
  }

  // Add Text Prompt controls.
  const addPayment = () => {
    closeDropdown()
  }

  // Add Text Prompt controls.
  const addContract = () => {
    closeDropdown()
  }

  // Add Text Prompt controls.
  const addConcept = () => {
    closeDropdown()
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

                </View>
                {dropdownVisible && (<View style={styles.addProgramListDropdown}>

                  <Pressable style={[styles.addProgramListDropdownTouch,hoverBackground1]} onPress={addTextPrompt} onPressIn={() => setHoverBackground1({backgroundColor:colors.secondaryBackground})} onPressOut={() => setHoverBackground1({})}>
                    <Text style={styles.addProgramListDropdownText}>Add Text Prompt</Text>
                  </Pressable>

                  <Pressable style={[styles.addProgramListDropdownTouch,hoverBackground2]} onPress={addSurvey} onPressIn={() => setHoverBackground2({backgroundColor:colors.secondaryBackground})} onPressOut={() => setHoverBackground2({})}>
                    <Text style={styles.addProgramListDropdownText}>Add Survey</Text>
                  </Pressable>

                  {addPaymentDisabled && (<Pressable disabled={addPaymentDisabled} style={[styles.addProgramListDropdownTouch,hoverBackground3]} onPress={addPayment} onPressIn={() => setHoverBackground3({backgroundColor:colors.secondaryBackground})} onPressOut={() => setHoverBackground3({})}>
                    <Text style={[styles.addProgramListDropdownText,{textDecorationLine:'line-through',textDecorationColor:colors.mainTextColor}]}>Add Payment</Text>
                    <Text style={styles.planRequiredText}>
                      <Text style={{color:btnColors.success}}>Standard Plan</Text> Required
                    </Text>
                  </Pressable>)
                  || (<Pressable disabled={addPaymentDisabled} style={[styles.addProgramListDropdownTouch,hoverBackground3]} onPress={addPayment} onPressIn={() => setHoverBackground3({backgroundColor:colors.secondaryBackground})} onPressOut={() => setHoverBackground3({})}>
                    <Text style={styles.addProgramListDropdownText}>Add Payment</Text>
                  </Pressable>)}

                  {addContractDisabled && (<Pressable disabled={addContractDisabled} style={[styles.addProgramListDropdownTouch,hoverBackground4]} onPress={addContract} onPressIn={() => setHoverBackground4({backgroundColor:colors.secondaryBackground})} onPressOut={() => setHoverBackground4({})}>
                    <Text style={[styles.addProgramListDropdownText,{textDecorationLine:'line-through',textDecorationColor:colors.mainTextColor}]}>Add Contract</Text>
                    <Text style={styles.planRequiredText}>
                      <Text style={{color:btnColors.danger}}>Professional Plan</Text> Required
                    </Text>
                  </Pressable>)
                  || (<Pressable disabled={addContractDisabled} style={[styles.addProgramListDropdownTouch,hoverBackground4]} onPress={addContract} onPressIn={() => setHoverBackground4({backgroundColor:colors.secondaryBackground})} onPressOut={() => setHoverBackground4({})}>
                    <Text style={[styles.addProgramListDropdownText]}>Add Contract</Text>
                  </Pressable>)}

                  <Pressable style={[styles.addProgramListDropdownTouchBottom,hoverBackground5]} onPress={addConcept} onPressIn={() => setHoverBackground5({backgroundColor:colors.secondaryBackground})} onPressOut={() => setHoverBackground5({})}>
                    <Text style={styles.addProgramListDropdownText}>Add Concept</Text>
                  </Pressable>

                </View>)}
              </View>
              <View style={styles.addProgramMainContainer}>
                {showMain &&
                (<View style={styles.addProgramMain}>
                  <View style={styles.addProgramMainHeader}>
                    <Text style={styles.addProgramMainHeaderTitle}>{taskTitle}</Text>
                  </View>
                </View>)
                ||
                (<Text style={styles.addProgramMainHelpText}>
                  {taskList.length > 0 && ('Select a Task to configure.') || (`Add a Task to configure.${"\n"}Tasks are existing Prompts, Surveys, Payments, Contracts, or Concepts.`)}
                </Text>)}
              </View>
            </View>
            <View style={styles.addProgramFooter}>
              <View style={{flex:1}}>
                <Button
                  title='Publish Program'
                  buttonStyle={[styles.addProgramListButton]}
                  containerStyle={styles.addProgramListButtonContainer}
                />
                <Text style={[styles.addProgramMainHelpText,{marginBottom:20}]}>Editable until assigned to Clients.</Text>
              </View>
              <View style={{flex:1}}>
                <Button
                  title='Create Draft'
                  buttonStyle={[styles.addProgramListButton,{backgroundColor:btnColors.caution}]}
                  containerStyle={styles.addProgramListButtonContainer}
                />
                <Text style={[styles.addProgramMainHelpText,{marginBottom:20}]}>Cannot assign to Clients until draft is published.</Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    </View>
  </ScrollView>)

}
