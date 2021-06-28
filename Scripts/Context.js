/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-no-duplicate-props */
import React, { useState } from 'react'
import { set, get, getTTL, ttl } from '../Scripts/Storage.js'
import { refreshCoach } from './API.js'

const userContext = React.createContext(get('Coach'));
const { Provider, Consumer } = userContext;

export { Provider };
export default userContext;
