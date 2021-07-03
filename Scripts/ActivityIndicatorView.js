/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-no-duplicate-props */
import React, { useEffect, useState, useCallback } from 'react'
import { View, ActivityIndicator } from 'react-native'
import { colorsLight } from '../Scripts/Styles.js'
import { set, get, getTTL, ttl } from '../Scripts/Storage.js'

export default function ActivityIndicatorView({ size }) {
  const [style, setColorStyle] = useState(colorsLight)
  const [aSize, setSize] = useState('large')
  useEffect(() => {
    if (size == undefined) {
      setSize('large')
    } else {
      setSize(size)
    }
  }, [])

  return(<View style={{flexDirection:'column',justifyContent:'center',alignItems:'center'}}>
    <ActivityIndicator color={style.secondaryHighlight} size={aSize} color={style.secondaryHighlight} />
  </View>)
}
