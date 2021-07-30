import { StatusBar } from 'expo-status-bar'
import React, { useEffect, useState, useContext } from 'react'
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native'

import { programsLight, colorsLight, innerDrawerLight } from '../Scripts/Styles.js'
import { homeDark, colorsDark, innerDrawerDark } from '../Scripts/Styles.js'
import { useLinkTo, Link, useFocusEffect } from '@react-navigation/native'
import LoadingScreen from '../Scripts/LoadingScreen.js'
import { Helmet } from "react-helmet"
import { Icon, Button } from 'react-native-elements'
import { set, get, getTTL, ttl } from './Storage.js'
import { getPrograms, parseSimpleDateText, sqlToJsDate } from './API.js'
 import ActivityIndicatorView from '../Scripts/ActivityIndicatorView.js'

import userContext from './Context.js'

export default function AllPrograms() {

  const linkTo = useLinkTo()
  const user = useContext(userContext)
  
  const [refreshing, setRefreshing] = useState(true)
  const [styles, setStyles] = useState(programsLight)
  const [colors, setColors] = useState(colorsLight)
  const [coach, setCoach] = useState(user)

  // Data.
  const [programs, setPrograms] = useState([])
  const [programGrads, setProgramGrads] = useState([])
  const [clientList, setClientList] = useState([])

  // Display variables.
  const [showActivityIndicator, setShowActivityIndicator] = useState(true)
  const [showAll, setShowAll] = useState(false)
  const [showAddClient, setShowAddClient] = useState(false)
  const [showViewProgram, setShowViewProgram] = useState(false)
  const [viewProgramIndex, setViewProgramIndex] = useState(-1)
  
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
    console.log ('Add new program...')
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

  const viewAddClient = (index) => {
    setViewProgramIndex(index)
    setShowAll(false)
    setShowViewProgram(false)
    setShowActivityIndicator(true)
    setTimeout(() => {
      setShowActivityIndicator(false)
      setShowAddClient(true)
    }, 500)
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
      setShowAll(true)
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
                console.log('program:',program)
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
                <Text style={styles.promptHeaderTitle}>{programs[viewProgramIndex].Title}</Text>
              </View>
            </View>
            <Text style={[styles.programHeaderDescription,{marginTop:20}]}>{programs[viewProgramIndex].Description}</Text>
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
          </View>)}

          {showAddClient && (<View style={styles.promptListContainer}>
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
              <Text style={styles.addClientsEnroll}>Select clients to enroll:</Text>
              <View style={styles.addClientList}>
                {clientList.map((client, cIndex) => {
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
                    <Icon
                      name='chevron-back'
                      type='ionicon'
                      size={28}
                      color={colors.mainTextColor}
                      style={{marginRight:0}}
                    />
                  </View>)
                })}
              </View>
            </View>
          </View>)}

        </View>
      </View>
    </View>
  </ScrollView>)

}
