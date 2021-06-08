/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-no-duplicate-props */
import React, { useState } from 'react'
import { set, get, getTTL, ttl } from '../Scripts/Storage.js'
import { refreshCoach } from './API.js'

const userContext = React.createContext(null);
const { Provider, Consumer } = userContext;

const MyProvider = ({ children }) => {
  const [coach, setCoach] = useState(get('Coach'))

  useEffect(() => {
    if (coach != null) {
      refreshCoach(coach.Id, coach.Token).then(res => {
        setCoach(res)
        set('Coach',res,ttl)
      })
    }
  }, [])

  return (<Provider value={coach}>
    {children}
  </Provider>)
}

export { MyProvider };
export default userContext;
