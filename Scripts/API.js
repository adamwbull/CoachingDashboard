/* eslint-env node */
import React from 'react'
import * as Crypto from 'expo-crypto'
const { DateTime } = require("luxon")
import { View, Text, StyleSheet } from 'react-native'

export const url = 'https://api.coachsync.me'
export const uploadUrl = 'https://db.coachsync.me'
export const key = 'c75c8309094b9bcc21fbcabeb17e0f7a1a4c4f547f041376bfdb71826bcc84db'
export const captchaKey = '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI'
export const stripeKey = 'pk_test_51Ibda0Doo38J0s0VtHeC0WxsqtMWNxu6xy9FcAwt9Tch77641I6LeIAmWHcbzVSeiFh6m2smQt3C9OgSYIlo4RAK00ZPlZhqub'

// Helper functions
export const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

export function getTimezoneName() {
  const today = new Date();
  const short = today.toLocaleDateString(undefined);
  const full = today.toLocaleDateString(undefined, { timeZoneName: 'short' });

  // Trying to remove date from the string in a locale-agnostic way
  const shortIndex = full.indexOf(short);
  if (shortIndex >= 0) {
    const trimmed = full.substring(0, shortIndex) + full.substring(shortIndex + short.length);
    
    // by this time `trimmed` should be the timezone's name with some punctuation -
    // trim it from both sides
    return trimmed.replace(/^[\s,.\-:;]+|[\s,.\-:;]+$/g, '');

  } else {
    // in some magic case when short representation of date is not present in the long one, just return the long one as a fallback, since it should contain the timezone's name
    return full;
  }
}

export function getTimezoneOffset() {
  return (new Date()).getTimezoneOffset()/60
}
export function currentDate() {
  var date = new Date()
  var pad = function(num) { return ('00'+num).slice(-2) }
  date = date.getUTCFullYear()         + '-' +
        pad(date.getUTCMonth() + 1)  + '-' +
        pad(date.getUTCDate())       + ' ' +
        pad(date.getUTCHours())      + ':' +
        pad(date.getUTCMinutes())    + ':' +
        pad(date.getUTCSeconds())
  return date
}

export function sqlToJsDate(sqlDate) {
  if (sqlDate.split('.').length == 1) {
    sqlDate = sqlDate.replace(' ', 'T') + '.000Z'
  }

  var t = sqlDate.split(/[-:T.Z]/)
  return new Date(Date.UTC(t[0], t[1]-1, t[2], t[3], t[4], t[5], t[6]))
}

export function parseDateText(date) {

    var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    var hours = date.getHours()
    var minutes = date.getMinutes()
    var ampm = hours >= 12 ? 'PM' : 'AM'
    hours = hours % 12
    hours = hours ? hours : 12
    minutes = minutes < 10 ? '0'+minutes : minutes
    const dateText = months[date.getMonth()] +
                          " " + date.getDate() +
                          ", " + date.getFullYear() +
                          " " + hours + ":" + minutes +
                          " " + ampm
    return dateText

}

export function toFullDate(date) {

    date = date.toISOString()
    var d = DateTime.fromISO(date).toFormat('LLLL dd, y TT ZZ')
    return d
}

export function getTimeSince(milliseconds) {
  var seconds = parseInt(milliseconds/1000)
  var ret = 'now'
  var time = 0
  if (seconds > 5 && seconds <= 60) {
    ret = (seconds > 1) ? seconds + ' secs' : seconds + ' sec'
  } else if (seconds > 60 && seconds < 3600) {
    time = parseInt(seconds/60)
    ret = (time > 1) ? time + ' mins' : time + ' min'
  } else if (seconds >= 3600 && seconds < 86400) {
    time = parseInt(seconds/3600)
    ret = (time > 1) ? time + ' hours' : time + ' hour'
  } else if (seconds >= 86400 && seconds < 31536000) {
    time = parseInt(seconds/86400)
    ret = (time > 1) ? time + ' days' : time + ' day'
  } else if (seconds >= 31536000) {
    time = parseInt(seconds/31536000)
    ret = (time > 1) ? time + ' yrs' : time + ' yr'
  }
  return ret
}

export function parseSimpleDateText(date) {
  if (!Object.prototype.toString.call(date) === "[object Date]") {
    date = Date.parse(date)
  }

  var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  const dateText = months[date.getMonth()] +
                          " " + date.getDate() +
                          ", " + date.getFullYear()
  
  return dateText
}

export function parseTime(date) {

  var hours = date.getHours()
  var minutes = date.getMinutes()
  var ampm = hours >= 12 ? 'PM' : 'AM'
  hours = hours % 12
  hours = hours ? hours : 12
  minutes = minutes < 10 ? '0'+minutes : minutes
  const dateText = hours + ":" + minutes + " " + ampm
  return dateText
}

export function containsSpecialCharacters(str){
    var regex = /[ !@#$%^&*()_+\-=[\]{}':"\\|,.<>/?]/g
	return regex.test(str)
}

export function hasUpperCase(str) {
    return (/[A-Z]/.test(str))
}

export function dateToSql(str) {
  var pad = function(num) { return ('00'+num).slice(-2) }
  str = str.getUTCFullYear()         + '-' +
        pad(str.getUTCMonth() + 1)  + '-' +
        pad(str.getUTCDate())       + ' ' +
        pad(str.getUTCHours())      + ':' +
        pad(str.getUTCMinutes())    + ':' +
        pad(str.getUTCSeconds())
  return str
}

export function lightenHex(col, amt) {

    var usePound = true;

    if (col[0] == "#") {
        col = col.slice(1);
        usePound = true;
    }

    var num = parseInt(col,16);

    var r = (num >> 16) + amt;

    if (r > 255) r = 255;
    else if  (r < 0) r = 0;

    var b = ((num >> 8) & 0x00FF) + amt;

    if (b > 255) b = 255;
    else if  (b < 0) b = 0;

    var g = (num & 0x0000FF) + amt;

    if (g > 255) g = 255;
    else if (g < 0) g = 0;

    return (usePound?"#":"") + (g | (b << 8) | (r << 16)).toString(16);

}

/* Example

    method:'POST',
    body: JSON.stringify(arr),
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    }

export async function check() {

  var ret = false

  console.log('')
  const res = await fetch(url + '', {
    method:'GET'
  })

  const payload = await res.json()

  if (payload) {
    console.log('')
    ret = true
  }

  return ret

}

*/

export async function completeRegistration(id, token) {

  var ret = false
  var arr = {CoachId:id, Token:token}
  console.log('Completing registration for free plan...')
  const res = await fetch(url + '/user/coach/complete-registration', {
    method:'POST',
    body: JSON.stringify(arr),
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    }
  })

  const payload = await res.json()

  if (payload.affectedRows > 0) {
    console.log('Completed!')
    ret = true
  }

  return ret

}

export async function getAddProgramData(id, token) {

  var ret = false

  console.log('Getting add program data...')
  const res = await fetch(url + '/user/coach/add-program-data/' + id + '/' + token, {
    method:'GET'
  })

  const payload = await res.json()

  if (payload.length > 0) {
    console.log('Data found!')
    ret = payload
  }

  return ret

}

export async function updateOnboarding(type, ids, id, token) {

  var ret = false
  var arr = {
    Type:type, 
    Survey:ids[0], 
    Payment:ids[1], 
    Contract:ids[2], 
    CoachId:id, 
    Token:token
  }

  console.log('Updating onboarding...')
  const res = await fetch(url + '/user/coach/update-onboarding', {
    method:'POST',
    body: JSON.stringify(arr),
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    }
  })

  const payload = await res.json()

  if (payload.success) {
    console.log('Success!')
    ret = true
  }

  return ret

}

export async function getOnboardingData(id, token) {

  var ret = false

  console.log('Getting onboarding data...')
  const res = await fetch(url + '/user/coach/onboarding-data/' + id + '/' + token, {
    method:'GET'
  })

  const payload = await res.json()

  console.log('pay:',payload)
  if (payload.success == true) {
    console.log('Data found!')
    ret = payload
  }

  return ret

}

export async function deleteTemplate(ids, coachId, token) {

  var ret = false
  var arr = {Ids:ids, CoachId:coachId, Token:token}
  console.log(arr)
  console.log('Deleting template...')
  const res = await fetch(url + '/template/delete', {
    method:'POST',
    body: JSON.stringify(arr),
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    }
  })

  const payload = await res.json()

  if (payload.affectedRows > 0) {
    console.log('Template deleted!')
    ret = true
  }

  return ret

}

export async function createTemplate(message, coachId, token) {

  var ret = false
  var arr = {Message:message, CoachId:coachId, Token:token}

  console.log('Creating template...')
  const res = await fetch(url + '/template/create', {
    method:'POST',
    body: JSON.stringify(arr),
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    }
  })

  const payload = await res.json()

  if (payload.affectedRows > 0) {
    console.log('Template created!')
    ret = payload.insertId
  }

  return ret

}

export async function updateGroup(token, conversationId, coachId, title, clients) {

  var ret = false
  var arr = {Token:token, ConversationId:conversationId, CoachId:coachId, Title:title, Clients:clients}
  
  console.log('Updating group...')
  console.log(arr)
  const res = await fetch(url + '/conversation/coach-update', {
    method:'POST',
    body: JSON.stringify(arr),
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    }
  })

  const payload = await res.json()
  
  if (payload.affectedRows == 1) {
    console.log('Group updated!')
    ret = true
  }

  return ret

}

export async function createGroup(token, coachId, title, clients) {

  var ret = false
  var arr = {Token:token, CoachId:coachId, Title:title, Clients:clients}
  
  console.log('Creating group...')
  console.log(arr)
  const res = await fetch(url + '/conversation/coach-create', {
    method:'POST',
    body: JSON.stringify(arr),
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    }
  })

  const payload = await res.json()
  
  if (payload.affectedRows == 1) {
    console.log('Group created!')
    ret = true
  }

  return ret

}

export async function uploadMessageImage(uri, fileType, token, id) {
  
  console.log('sending:', uri, fileType, token, id);
  var ret = false;
  let formData = new FormData();
  formData.append('photo', uri, `${token}_${id}.${fileType}`);

  console.log('formData:', formData)

  console.log('Attempting message attachment upload...');
  const res = await fetch(uploadUrl + '/api/message-attachment', {
    method:'POST',
    body: formData,
  });

  const payload = await res.json();

  console.log('payload:',payload)

  if (payload.affectedRows == 1) {
    console.log('Upload complete!');
    ret = true;
  }

  return ret;

}

export async function postMessage(conversationId, message, id, token, title) {

  var ret = false
  var arr = {Token:token, ConversationId:conversationId, UserId:id, Title:title, Text:message}
  console.log('arr:', arr)
  console.log('Posting message...')
  const res = await fetch(url + '/message/create', {
    method:'POST',
    body: JSON.stringify(arr),
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    }
  })

  const payload = await res.json()

  if (payload.affectedRows > 0) {
    console.log('Message posted!')
    ret = payload.insertId
  }

  return ret

}

export async function refreshMessageInfo(id, token) {  

  var ret = false

  console.log('Getting chat list and templates...')
  const res = await fetch(url + '/coach-conversations/'+id+'/'+token, {
    method:'GET'
  })

  const payload = await res.json()

  if (payload.length > 0) {
    console.log('Data found!')
    ret = payload
  } else {
    console.log('No data found!')
    ret = []
  }

  return ret

}

export async function getMessageInfo(id, token) {  

  var ret = false

  console.log('Getting chat list and templates...')
  const res = await fetch(url + '/coach-conversations-templates/'+id+'/'+token, {
    method:'GET'
  })

  const payload = await res.json()

  if (payload.length > 0) {
    console.log('Data found!')
    ret = payload
  } else {
    console.log('No data found!')
    ret = []
  }

  return ret

}

export async function checkUpdateEmailToken(token) {

  var ret = false
  var arr = {Token:token, Key:key}

  console.log('Checking update email token')
  const res = await fetch(url + '/update-email-token/check', {
    method:'POST',
    body: JSON.stringify(arr),
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    }
  })



  const payload = await res.json()

  console.log('payload:',payload)

  if (payload.length > 0) {
    console.log('Token passed!')
    ret = true
  } else {
    console.log('Token expired')
  }

  return ret

}

export async function changeEmailRequest(email, token) {

  var ret = false

  var arr = {Email:email, Token:token}

  console.log('Updating email...')
  const res = await fetch(url + '/system-email/update-email', {
    method:'POST',
    body: JSON.stringify(arr),
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    }
  })

  const payload = await res.json()

  if (payload.success == true) {
    console.log('Password updated!')
    ret = true
  } else {
    console.log('Password updated.')
  }

  return ret

}

export async function checkUpdatePasswordToken(token) {

  var ret = false
  var arr = {Token:token, Key:key}

  console.log('Checking update password token')
  const res = await fetch(url + '/update-password-token/check', {
    method:'POST',
    body: JSON.stringify(arr),
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    }
  })



  const payload = await res.json()

  console.log('payload:',payload)

  if (payload.length > 0) {
    console.log('Token passed!')
    ret = true
  } else {
    console.log('Token expired')
  }

  return ret

}

export async function changePasswordRequest(password, token) {

  var ret = false

  var pw = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    password
  )

  var arr = {Password:pw, Token:token}

  console.log('Updating password...')
  const res = await fetch(url + '/system-email/update-password', {
    method:'POST',
    body: JSON.stringify(arr),
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    }
  })

  const payload = await res.json()

  if (payload.success == true) {
    console.log('Password updated!')
    ret = true
  } else {
    console.log('Password updated.')
  }

  return ret

}

export async function forgotPasswordRequest(email) {

  var ret = false
  var arr = {Email:email, Token:key}

  console.log('Requesting email update...')
  const res = await fetch(url + '/system-email/forgot-email', {
    method:'POST',
    body: JSON.stringify(arr),
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    }
  })

  const payload = await res.json()

  if (payload.success == true) {
    console.log('Request passed!')
    ret = true
  } else {
    console.log('Request failed.')
  }

  return ret

}

export async function deletePayment(paymentId, coachId, coachToken) {

  var ret = false
  var arr = {PaymentId:paymentId, CoachId:coachId, Token:coachToken}
  
  console.log('Deleting payment...')
  const res = await fetch(url + '/payment/delete', {
    method:'POST',
    body: JSON.stringify(arr),
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    }
  })

  const payload = await res.json()

  if (payload.affectedRows > 0) {
    console.log('Payment deleted.')
    ret = true
  }

  return ret

}

export async function updatePayment(coachToken, coachId, id, type) {

  var ret = false
  var arr = {Token:coachToken, CoachId:coachId, PaymentId:id, Type:type}

  console.log('Updating this payment...')
  const res = await fetch(url + '/payment/update', {
    method:'POST',
    body: JSON.stringify(arr),
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    }
  })

  const payload = await res.json()

  if (payload.success) {
    console.log('Payment updated!')
    ret = true
  }

  return ret

}

export async function getPaymentResponses(paymentId, coachId, coachToken) {

  var ret = []

  console.log('Getting payment responses...')
  const res = await fetch(url + '/payment-charges/coach/'+paymentId+'/'+coachId+'/'+coachToken, {
    method:'GET'
  })

  const payload = await res.json()

  if (payload.length > 0) {
    console.log('Responses found!')
    ret = payload
  } else {
    console.log('No responses found!')
  }

  return ret

}

export async function createPayment(token, coachId, amount, title, memo, type, paymentRoute) {

  var ret = false
  var arr = {Token:token, CoachId:coachId, Amount:amount, Title:title, Memo:memo, Type:type, PaymentRoute:paymentRoute}

  console.log('Creating payment...')
  const res = await fetch(url + '/payment/create', {
    method:'POST',
    body: JSON.stringify(arr),
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    }
  })

  const payload = await res.json()

  if (payload.affectedRows > 0) {
    console.log('Payment created.')
    ret = true
  }

  return ret

}

export async function downvoteFeature(coachId, coachToken, featureId) {

  var ret = false
  var arr = {CoachId:coachId, Token:coachToken, FeatureId:featureId}

  console.log('Downvoting feature...')
  const res = await fetch(url + '/feature-upvote/delete', {
    method:'POST',
    body: JSON.stringify(arr),
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    }
  })

  const payload = await res.json()

  if (payload.affectedRows > 0) {
    console.log('Feature downvoted!')
    ret = true
  }

  return ret

}

export async function upvoteFeature(coachId, coachToken, featureId) {

  var ret = false
  var arr = {CoachId:coachId, Token:coachToken, FeatureId:featureId}

  console.log('Upvoting feature...')
  const res = await fetch(url + '/feature-upvote/create', {
    method:'POST',
    body: JSON.stringify(arr),
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    }
  })

  const payload = await res.json()

  if (payload.affectedRows > 0) {
    console.log('Feature upvoted!')
    ret = true
  }

  return ret

}

export async function postBugReport(coachId, title, text, token) {

  var ret = false
  var arr = {ClientId:coachId, PageText:title, Description:text, Token:token}

  console.log('Submitting bug report...')
  const res = await fetch(url + '/bug-report/create', {
    method:'POST',
    body: JSON.stringify(arr),
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    }
  })

  const payload = await res.json()

  if (payload.affectedRows > 0) {
    console.log('Bug report submitted!')
    ret = true
  }

  return ret

}

export async function postFeatureRequest(coachId, title, text, token) {

  var ret = false
  var arr = {CoachId:coachId, Title:title, Text:text, Token:token}

  console.log('Submitting feature request...')
  const res = await fetch(url + '/feature/create', {
    method:'POST',
    body: JSON.stringify(arr),
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    }
  })

  const payload = await res.json()

  if (payload.affectedRows > 0) {
    console.log('Feature request submitted!')
    ret = true
  }

  return ret

}

export async function getFeatureBoardData(token) {

  var ret = false

  console.log('Getting feature board data...')
  const res = await fetch(url + '/features-and-release-notes/' + token, {
    method:'GET'
  })

  const payload = await res.json()

  if (payload.length > 0) {
    console.log('Data retrieved!')
    ret = payload
  } else {
    console.log('There was a problem getting feature board data.')
  }

  return ret

}

export async function getNotes(clientId, coachId, token) {

  var ret = false

  console.log('Getting notes...')
  const res = await fetch(url + '/notes/' + clientId + '/' + coachId + '/' + token, {
    method:'GET'
  })

  const payload = await res.json()

  if (payload.length > 0) {
    console.log('Notes found!')
    ret = payload
  } else {
    console.log('No notes found!')
    ret = []
  }

  return ret

}


export async function updateNote(token, coachId, id, title, richText) {

  var ret = false
  var arr = {Token:token, CoachId:coachId, Id:id, Title:title, RichText:richText}

  console.log('Updating note...')
  const res = await fetch(url + '/notes/update', {
    method:'POST',
    body: JSON.stringify(arr),
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    }
  })

  const payload = await res.json()

  if (payload[1].affectedRows > 0) {
    console.log('Note modified!')
    ret = true
  }

  return ret

}

export async function insertNote(token, coachId, clientId, title, richText) {

  var ret = false
  var arr = {Token:token, CoachId:coachId, ClientId:clientId, Title:title, RichText:richText}

  console.log('Inserting note...')
  const res = await fetch(url + '/notes/create', {
    method:'POST',
    body: JSON.stringify(arr),
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    }
  })

  const payload = await res.json()
  console.log('note creation payload:',payload)

  if (payload[1].affectedRows > 0) {
    console.log('Note created!')
    ret = payload[1].insertId
  }

  return ret

}

export async function updatePaymentMethod(token, id, cus, sub, pm) {

  var ret = false
  var arr = {Token:token, Id:id, StripeCustomerId:cus, StripeSubscriptionId:sub, PaymentMethodId:pm}
  console.log('Updating payment method...')
  const res = await fetch(url + '/stripe/update-payment-method', {
    method:'POST',
    body: JSON.stringify(arr),
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    }
  })

  const payload = await res.json()

  if (payload.success == true) {
    console.log('Updated successfully!')
    ret = true
  }

  return ret

}

export async function invoiceData(id, token, cus, sub) {

  var ret = false
  var arr = {Token:token, Id:id, StripeCustomerId:cus, StripeSubscriptionId:sub}

  console.log('Getting invoice data...')
  const res = await fetch(url + '/stripe/invoice-data', {
    method:'POST',
    body: JSON.stringify(arr),
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    }
  })

  const payload = await res.json()

  if (payload.length > 0) {
    console.log('Invoices found!')
    ret = payload
  }

  return ret

}


export async function switchSubscription(token, id, plan, period, sub) {

  var ret = false
  var arr = {Token:token, Id:id, TargetPlan:plan, TargetPeriod:period, Subscription:sub}

  console.log('Switching subscription...')
  const res = await fetch(url + '/stripe/switch-subscription', {
    method:'POST',
    body: JSON.stringify(arr),
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    }
  })

  const payload = await res.json()

  if (payload.Plan != undefined) {
    console.log('Subscription updated!')
    ret = payload
  } else {
    console.log('Subscription switch failed.')
  }

  return ret

}

export async function getClientsData(id, token) {

  var ret = []

  console.log('Getting client list and programs...')
  const res = await fetch(url + '/user/coach/client-data/' + id + '/' + token, {
    method:'GET'
  })

  const payload = await res.json()

  if (payload.length > 0) {
    console.log('Client data found!')
    ret = payload
  } else {
    console.log('No clients found.')
  }

  return ret

}

export async function getUpcomingChangePlanProration(id, token, targetPlan, targetPeriod, sub, cus) {

  var ret = false
  var arr = {Id:id, Token:token, TargetPlan:targetPlan, TargetPeriod:targetPeriod, Subscription:sub, Customer:cus}
  console.log('prorations args:',arr)
  console.log('Getting upcoming proration...')
  const res = await fetch(url + '/stripe/proration/change-plan', {
    method:'POST',
    body: JSON.stringify(arr),
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    }
  })

  const payload = await res.json()

  if (payload.length > 0) {
    console.log('Proration found!')
    ret = payload
  }

  return ret

}

export async function getUpcomingSwitchPeriodProration(id, token, period, plan, sub, cus) {

  var ret = false
  var arr = {Id:id, Token:token, PaymentPeriod:period, Plan:plan, Subscription:sub, Customer:cus}
  console.log('prorations args:',arr)
  console.log('Getting upcoming proration...')
  const res = await fetch(url + '/stripe/proration/switch-period', {
    method:'POST',
    body: JSON.stringify(arr),
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    }
  })

  const payload = await res.json()

  if (payload.length > 0) {
    console.log('Proration found!')
    ret = payload[0]
  }

  return ret

}

export async function getActiveCoachDiscount(t, a) {

  var ret = false

  console.log('Getting active discount...')
  const res = await fetch(url + '/discount/coach/' + a + '/' + t, {
    method:'GET',
  })

  const payload = await res.json()

  if (payload.length > 0) {
    console.log('Discount found.')
    ret = payload[0]
  }

  return ret

}

export async function updateCoachInfo(id, token, firstName, lastName, pronouns, addressLine1, addressLine2, city, state, country, zip) {

  var ret = false
  var arr = {Id:id, Token:token, FirstName:firstName, LastName:lastName, Pronouns:pronouns, AddressLine1:addressLine1, AddressLine2:addressLine2, City:city, State:state, Country:country, Zip:zip}

  console.log('Updating coach info...')
  const res = await fetch(url + '/user/coach/update-info', {
    method:'POST',
    body: JSON.stringify(arr),
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    }

  })

  const payload = await res.json()

  if (payload[0].affectedRows > 0 && payload[1].affectedRows > 0) {
    console.log('Coach info updated!')
    ret = true
  } else {
    console.log('Coach info not updated!')
  }

  return ret

}

export async function updateEmail(id, token, email, name) {

  var ret = false
  var arr = {Id:id, Token:token, Email:email, FirstName:name}

  console.log('Requesting email update...')
  const res = await fetch(url + '/system-email/change-email', {
    method:'POST',
    body: JSON.stringify(arr),
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    }
  })

  const payload = await res.json()

  if (payload.success == true) {
    console.log('Request passed!')
    ret = true
  } else {
    console.log('Request failed.')
  }

  return ret

}


export async function getPaymentCharges(id, token) {

  var ret = false

  console.log('Refreshing payment charges...')
  const res = await fetch(url + '/payment-charges/' + id + '/' + token, {
    method:'GET'
  })

  const payload = await res.json()

  if (payload.length > 0) {
    console.log('Found payment charges!')
    ret = payload
  } else {
    console.log('No payment charges found.')
    ret = []
  }

  return ret

}

export async function refreshOnboardingId(id, token) {

  var ret = false
  var newId = Math.floor(100000 + Math.random() * 900000);
  var arr = {Id:id, Token:token, OnboardingId:newId}

  console.log('Refreshing OnboardingId...')
  const res = await fetch(url + '/user/coach/refresh-onboarding-id', {
    method:'POST',
    body: JSON.stringify(arr),
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    }
  })

  const payload = await res.json()

  if (payload.affectedRows > 0) {
    console.log('OnboardingId refreshed.')
    ret = newId
  }

  return ret

}


export async function stripeCheckUser(id, token, stripeAccountId) {

  var ret = false
  var arr = {Token:token, Id:id, StripeAccountId:stripeAccountId}

  console.log('Checking Stripe account...')
  const res = await fetch(url + '/stripe-check-user', {
    method:'POST',
    body: JSON.stringify(arr),
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    }
  })

  const payload = await res.json()

  if (payload.chargesEnabled) {
    console.log('Charges are enabled!')
    ret = true
  } else {
    console.log('Charges are not enabled.')
  }

  return ret

}

export async function stripeOnboardUser(id, token, stripeAccountId) {

  var ret = false
  var arr = {Token:token, Id:id, StripeAccountId:stripeAccountId}

  console.log('Getting onboarding link...')
  const res = await fetch(url + '/stripe-onboard-user', {
    method:'POST',
    body: JSON.stringify(arr),
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    }
  })

  const payload = await res.json()

  if (payload.url != false) {
    console.log('Url found:', payload.url)
    ret = payload.url
  } else {
    console.log('Account link failed.')
  }

  return ret

}

export async function updateContract(coachToken, coachId, id, type, canBeOptedOut) {

  var ret = false
  var arr = {Token:coachToken, CoachId:coachId, Id:id, Type:type, CanBeOptedOut:canBeOptedOut}

  console.log('Updating this contract...')
  const res = await fetch(url + '/contract/update', {
    method:'POST',
    body: JSON.stringify(arr),
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    }
  })

  const payload = await res.json()

  if (payload.success) {
    console.log('Contract updated!')
    ret = true
  }

  return ret

}

export async function createContract(coachToken, coachId, title, file, type, canBeOptedOut) {

  var ret = false
  var arr = {Token:coachToken, CoachId:coachId, Title:title, File:file, Type:type, CanBeOptedOut:canBeOptedOut}

  console.log('Uploading this contract...')
  const res = await fetch(url + '/contract/create', {
    method:'POST',
    body: JSON.stringify(arr),
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    }
  })

  const payload = await res.json()

  if (payload.success) {
    console.log('Contract uploaded!')
    ret = true
  }

  return ret

}

export async function createPDFConcept(coachToken, coachId, title, file) {

  var ret = false
  var arr = {Token:coachToken, CoachId:coachId, Title:title, File:file}

  console.log('Uploading this concept...')
  const res = await fetch(url + '/concept/pdf/create', {
    method:'POST',
    body: JSON.stringify(arr),
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    }
  })

  const payload = await res.json()

  if (payload.affectedRows == 1) {
    console.log('Prompt uploaded!')
    ret = true
  }

  return ret

}

export async function uploadPDF(file) {

  var ret = false
  let formData = new FormData()
  formData.append('pdf', file)

  console.log('Attempting pdf upload...')
  const res = await fetch(uploadUrl + '/api/pdf', {
    method:'POST',
    body: formData,
  })

  const payload = await res.json()

  if (payload.affectedRows == 1) {
    console.log('Upload complete!')
    ret = uploadUrl
  }

  return ret

}

export async function deleteConcept(conceptId, coachId, token) {

  var ret = false
  var arr = {Token:token, Id:conceptId, CoachId:coachId}

  console.log('Deleting concept...')
  const res = await fetch(url + '/concept/delete', {
    method:'POST',
    body: JSON.stringify(arr),
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    }
  })

  const payload = await res.json()
  console.log('deletion payload:',payload)
  if (payload) {
    console.log('Concept and assocs deleted!')
    ret = true
  }

  return ret

}

export async function createConcept(coachToken, coachId, title, type, text, video) {

  var ret = false
  var arr = {Token:coachToken, CoachId:coachId, Title:title, Type:type, Text:text, Video:video}

  console.log('Uploading this concept...')
  const res = await fetch(url + '/concept/create', {
    method:'POST',
    body: JSON.stringify(arr),
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    }
  })

  const payload = await res.json()

  if (payload.affectedRows == 1) {
    console.log('Prompt uploaded!')
    ret = true
  }

  return ret

}

export async function getConcepts(id, token) {

  var ret = [[],[]]

  console.log('Getting concepts...')
  const res = await fetch(url + '/concepts/' + id + '/' + token, {
    method:'GET'
  })

  const payload = await res.json()

  if (payload.length > 0) {
    console.log('Connection established, lists returned!')
    ret = payload
  }

  return ret

}

export async function getSurveyResponses(surveyId, id, token) {

  var ret = []

  console.log('Getting survey responses...')
  const res = await fetch(url + '/prompt-assoc/survey-responses/' + surveyId + '/' + id + '/' + token, {
    method:'GET'
  })

  const payload = await res.json()

  if (payload.length > 0) {
    console.log('Survey responses found!')
    ret = payload
  } else {
    console.log('No responses found.')
  }

  return ret

}

export async function getPromptResponses(promptId, id, token) {

  var ret = []

  console.log('Getting prompt responses...')
  const res = await fetch(url + '/prompt-assoc/responses/' + promptId + '/' + id + '/' + token, {
    method:'GET'
  })

  const payload = await res.json()

  if (payload.length > 0) {
    console.log('Prompt responses found!')
    ret = payload
  } else {
    console.log('No responses found.')
  }

  return ret

}


export async function deleteSurvey(surveyId, id, token) {

  var ret = false
  var arr = {Id:surveyId, CoachId:id, Token:token}

  console.log('Deleting survey...')
  const res = await fetch(url + '/survey/delete', {
    method:'POST',
    body: JSON.stringify(arr),
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    }
  })

  const payload = await res.json()

  if (payload.affectedRows > 0) {
    console.log('Survey deleted!')
    ret = true
  }

  return ret

}

export async function updateBrandHeaders(id, token, home, prompts, concepts) {

  var ret = false
  var arr = {Id:id, Token:token, HomeSectionName:home, PromptsSectionName:prompts, ConceptsSectionName:concepts}

  console.log('Updating brand headers...')
  const res = await fetch(url + '/coach-data/update-brand-headers', {
    method:'POST',
    body: JSON.stringify(arr),
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    }
  })

  const payload = await res.json()

  if (payload.affectedRows > 0) {
    console.log('Brand headers updated!')
    ret = true
  }

  return ret

}

export async function setLogoDefault(id, token) {

  var ret = false
  var arr = {Id:id, Token:token}

  console.log('Setting logo to default...')
  const res = await fetch(url + '/coach-data/update-logo-default', {
    method:'POST',
    body: JSON.stringify(arr),
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    }
  })

  const payload = await res.json()

  if (payload.affectedRows > 0) {
    console.log('Default set!')
    ret = true
  }

  return ret

}

export async function uploadLogo(file) {

  var ret = false
  let formData = new FormData()
  formData.append('logo', file)

  console.log('Attempting logo upload...')
  const res = await fetch(uploadUrl + '/api/logo', {
    method:'POST',
    body: formData,
  })

  const payload = await res.json()

  if (payload.affectedRows == 1) {
    console.log('Upload complete!')
    ret = uploadUrl
  }

  return ret

}

export async function updateCoachColoring(id, token, primary, secondary) {

  var ret = false
  var arr = {Token:token, Id:id, Primary:primary, Secondary:secondary}

  console.log('Updating coach colors...')
  const res = await fetch(url + '/coach-data/update-coloring', {
    method:'POST',
    body: JSON.stringify(arr),
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    }
  })

  const payload = await res.json()

  if (payload.affectedRows > 0) {
    console.log('Colors updated')
    ret = true
  }

  return ret

}

export async function createSurveyItem(token, surveyId, type, question, richText, sliderRange, sliderLeft, sliderRight, boxOptionsArray, itemOrder) {

  var ret = false
  var arr = {Token:token, SurveyId:surveyId, Active:1, Type:type, KeyboardType:'default', Question:question, RichText:richText, SliderRange:sliderRange, SliderLeft:sliderLeft, SliderRight:sliderRight, BoxOptionsArray:boxOptionsArray, ItemOrder:itemOrder}

  console.log('Creating survey item...')
  const res = await fetch(url + '/survey-item/create', {
    method:'POST',
    body: JSON.stringify(arr),
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    }
  })

  const payload = await res.json()
  if (payload[1].affectedRows > 0) {
    console.log('Survey item created!')
    ret = true
  }

  return ret

}

export async function createMeasurementSurvey(id, token, title, text) {

  var ret = false
  var arr = {CoachId:id, Token:token, Title:title, Text:text, Type:0}

  console.log('Creating survey...')
  const res = await fetch(url + '/survey/create', {
    method:'POST',
    body: JSON.stringify(arr),
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    }
  })

  const payload = await res.json()

  if (payload.affectedRows > 0) {
    console.log('Survey created!')
    ret = payload.insertId
  }

  return ret

}

export async function deletePrompt(promptId, coachId, token) {

  var ret = false
  var arr = {Token:token, Id:promptId, CoachId:coachId}

  console.log('Deleting prompt...')
  const res = await fetch(url + '/prompt/delete', {
    method:'POST',
    body: JSON.stringify(arr),
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    }
  })

  const payload = await res.json()
  console.log('deletion payload:',payload)
  if (payload) {
    console.log('Prompt, assocs, and responses deleted!')
    ret = true
  }

  return ret

}

export function checkStorage(plan, storage) {

  var ret = false
  var check = storage + 209715200

  if (plan == 0) {
    ret = (check >= 629145600) ? true : false
  } else if (plan == 1) {
    ret = (check >= 26843545600) ? true : false
  } else if (plan == 2) {
    ret = (check >= 107374182400) ? true : false
  }

  return ret
}

export function getProgressBar(plan, storage, colors, btn) {

  var styles = StyleSheet.create({
    uploadStorageProgressLabel: {
      width:'100%',
      flexDirection:'row',
      justifyContent:'space-between',
      alignItems:'center',
      marginTop:10
    },
    uploadStorageLabel: {
      fontFamily:'Poppins',
      color:colors.mainTextColor,
      fontSize:16
    },
    progressOuter: {
      height:40,
      width:'100%',
      backgroundColor:colors.secondaryBackground,
      borderRadius:100,
      overflow:'hidden'
    },
    progressInner: {
      height:40,
      overflow:'hidden'
    }
  })

  var maxInBytes = 0
  var leftSuffix = ' GB'
  var rightSuffix = ' GB'
  var baseLabel = ''
  var remainingLabel = ''

  if (plan == 0) {
    // Free Plan.
    maxInBytes = 629145600
    leftSuffix = ' MB'
    rightSuffix = ' MB'
    baseLabel = storage/1024/1024
    remainingLabel = maxInBytes/1024/1024
  } else {
    // Standard Plan or Pro Plan.
    maxInBytes = (plan == 1) ? 26843545600 : 107374182400
    baseLabel = storage/1024/1024/1024
    remainingLabel = maxInBytes/1024/1024/1024
    rightSuffix = ' GB'
    if (baseLabel < 1) {
      leftSuffix = ' MB'
      baseLabel = storage/1024/1024
    }
  }

  var percentI = parseInt((storage/maxInBytes)*100)
  if (percentI < 1) {
    percentI = 1
  }
  var percent = percentI.toString() + '%'

  return (<View style={{width:'60%',marginBottom:20}}>
    {percentI > 99 &&
      (<View style={styles.progressOuter}>
        <View style={[styles.progressInner,{backgroundColor:btn.danger,width:percent}]}>

        </View>
      </View>)
    ||
      (<>{percentI > 70 &&
        (<View style={styles.progressOuter}>
          <View style={[styles.progressInner,{backgroundColor:btn.caution,width:percent}]}>

          </View>
        </View>)
      ||
        (<View style={styles.progressOuter}>
          <View style={[styles.progressInner,{backgroundColor:btn.success,width:percent}]}>

          </View>
        </View>)
      }</>)
    }
    <View style={styles.uploadStorageProgressLabel}>
      <Text style={styles.uploadStorageLabel}>{baseLabel.toFixed(2) + leftSuffix}</Text>
      <Text style={styles.uploadStorageLabel}>of</Text>
      <Text style={styles.uploadStorageLabel}>{remainingLabel + rightSuffix}</Text>
    </View>
  </View>)

}

export async function createPrompt(coachToken, coachId, title, promptType, text, video) {

  var ret = false
  var arr = {Token:coachToken, CoachId:coachId, Title:title, PromptType:promptType, Text:text, Video:video}

  console.log('Uploading this prompt...')
  const res = await fetch(url + '/prompt/create', {
    method:'POST',
    body: JSON.stringify(arr),
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    }
  })

  const payload = await res.json()

  if (payload.affectedRows == 1) {
    console.log('Prompt uploaded!')
    ret = true
  }

  return ret

}

export async function uploadVideo(file) {

  var ret = false
  let formData = new FormData()
  formData.append('video', file)

  console.log('Attempting video upload...')
  const res = await fetch(uploadUrl + '/api/video', {
    method:'POST',
    body: formData,
  })

  const payload = await res.json()

  if (payload.affectedRows == 1) {
    console.log('Upload complete!')
    ret = uploadUrl
  }

  return ret

}

export async function getContracts(id, token) {

  var ret = false

  console.log('Getting contracts...')
  const res = await fetch(url + '/contracts/' + id + '/' + token, {
    method:'GET'
  })

  const payload = await res.json()

  if (payload.length > 0) {
    console.log('Contracts found!')
    ret = payload
  } else {
    console.log('No contracts found!')
    ret = []
  }

  return ret

}

export async function getPayments(id, token) {

  var ret = false

  console.log('Getting payments...')
  const res = await fetch(url + '/payments/' + id + '/' + token, {
    method:'GET'
  })

  const payload = await res.json()

  if (payload.length > 0) {
    console.log('Payments found!')
    ret = payload
  } else {
    console.log('No payments found!')
    ret = []
  }

  return ret

}

export async function getSurveys(id, token) {

  var ret = false

  console.log('Getting surveys...')
  const res = await fetch(url + '/surveys/' + id + '/' + token, {
    method:'GET'
  })

  const payload = await res.json()

  if (payload.length > 0) {
    console.log('Surveys found!')
    ret = payload
  } else {
    console.log('No surveys found!')
    ret = []
  }

  return ret

}

export async function getTextPrompts(id, token) {

  var ret = false
  console.log('Getting text prompts...')
  const res = await fetch(url + '/prompts/' + id + '/' + token, {
    method:'GET'
  })

  const payload = await res.json()

  if (payload.length > 0) {
    console.log('Prompts found!')
    ret = payload
  } else {
    console.log('No prompts found!')
    ret = []
  }

  return ret

}


export async function getPromptsData(id, token) {

  var ret = false
  console.log('Getting all prompts data...')
  const res = await fetch(url + '/user/coach/prompts-data/' + id + '/' + token, {
    method:'GET'
  })

  const payload = await res.json()

  if (payload.length > 0) {
    console.log('Prompts found!')
    ret = payload
  } else {
    console.log('No prompts found!')
    ret = []
  }

  return ret

}

export async function refreshCoach(id, token) {

  var ret = false
  var arr = {Id:id, Token:token}

  console.log('Refreshing coach from DB...')
  const res = await fetch(url + '/user/coach/refresh', {
    method:'POST',
    body: JSON.stringify(arr),
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    }
  })

  const payload = await res.json()

  if (payload.length > 0) {
    console.log('Refreshed!')
    ret = payload[0]
  }

  return ret

}

export async function getNumCoaches() {

  var ret = false

  console.log('Getting coach count...')
  const res = await fetch(url + '/user/total-coaches/' + key, {
    method:'GET'
  })

  const payload = await res.json()

  if (payload) {
    console.log('Coach count found!')
    ret = payload.length
  }

  return ret

}


export async function getPlans(t) {

  var ret = false

  console.log('Getting plans...')
  const res = await fetch(url + '/plans/' + t, {
    method:'GET'
  })

  const payload = await res.json()

  if (payload.length > 0) {
    console.log('Plans retrieved!')
    ret = payload
  }

  return ret

}

export async function getActiveDiscount() {

  var ret = false

  console.log('Getting active discount...')
  const res = await fetch(url + '/discount/active/' + key, {
    method:'GET'
  })

  const payload = await res.json()

  if (payload.length > 0) {
    console.log('Discount received.')
    ret = payload[0]
  }

  return ret

}

export async function emailCheck(email) {

  var ret = false

  if (email === '') {
    email = 'blankEmail'
  }

  console.log('Checking for existing email...')
  const res = await fetch(url + '/user/email/' + email + '/' + key, {
    method:'GET'
  })

  const payload = await res.json()

  if (payload.length > 0) {
    console.log('Email taken!')
  } else {
    console.log('Email not taken!')
    ret = true
  }

  return ret

}

export async function createAccount(email, dob, firstName, lastName, password) {

  var ret = false

  var pw = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    password
  )

  var created = new Date()

  var token = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    pw + parseDateText(created)
  )

  dob = dateToSql(dob)

  var arr = {Token:token, Email:email, DoB:dob, FirstName:firstName, LastName:lastName, Password:pw, WebAPIKey:key}

  console.log('Creating basic coach account...')
  const res = await fetch(url + '/user/coach/create', {
    method:'POST',
    body: JSON.stringify(arr),
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    }
  })

  const payload = await res.json()
  console.log('account:',payload)
  if (payload[0].Id > 0) {
    console.log('Account created!')
    ret = payload[0]
  }

  return ret

}

export async function verifyCaptcha(response) {

  var ret = false

  console.log('Verifying captcha...')
  const res = await fetch(url + '/captcha/verify/' + response, {
    method:'GET'
  })

  const payload = await res.json()

  if (payload.success == true) {
    console.log('Success!')
    ret = true
  } else {
    console.log('Failed.')
  }

  return ret

}

export async function loginCheck(email, password) {

  var pw = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    password
  )

  var ret = null

  console.log('Attempting login...')
  const res = await fetch(url + '/user/coach/login-check/' + email + '/' + pw + '/' + key, {
    method:'GET'
  })

  const payload = await res.json()

  if (payload.length == 1) {
    console.log('Login check passed!')
    ret = payload[0]
  } else {
    console.log('Login failed!')
  }

  return ret

}
