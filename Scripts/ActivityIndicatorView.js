import React, { useEffect, useState, useCallback } from 'react'
import { View, ActivityIndicator } from 'react-native'
import { colorsLight } from '../Scripts/Styles.js'
import { set, get, getTTL, ttl } from '../Scripts/Storage.js'

export default function ActivityIndicatorView() {
  const [style, setColorStyle] = useState(colorsLight)

  return(<View style={{flexDirection:'column',justifyContent:'center',alignItems:'center'}}>
    <ActivityIndicator color={style.secondaryHighlight} size='large' color={style.secondaryHighlight} />
  </View>)
}
