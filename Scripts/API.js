import React from 'react';
import * as Crypto from 'expo-crypto';
const { DateTime } = require("luxon");

export const url = 'https://api.coachsync.me';
export const uploadUrl = 'https://db.coachsync.me';
export const key = 'c75c8309094b9bcc21fbcabeb17e0f7a1a4c4f547f041376bfdb71826bcc84db';

// Helper Functions
export function currentDate() {
  var date = new Date();
  var pad = function(num) { return ('00'+num).slice(-2) };
  date = date.getUTCFullYear()         + '-' +
        pad(date.getUTCMonth() + 1)  + '-' +
        pad(date.getUTCDate())       + ' ' +
        pad(date.getUTCHours())      + ':' +
        pad(date.getUTCMinutes())    + ':' +
        pad(date.getUTCSeconds());
  return date;
}

export function sqlToJsDate(sqlDate) {
  var t = sqlDate.split(/[-:T.Z]/);
  return new Date(Date.UTC(t[0], t[1]-1, t[2], t[3], t[4], t[5], t[6]));
}

export function parseDateText(date) {

    var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    minutes = minutes < 10 ? '0'+minutes : minutes;
    const dateText = months[date.getMonth()] +
                          " " + date.getDate() +
                          ", " + date.getFullYear() +
                          " " + hours + ":" + minutes +
                          " " + ampm;
    return dateText;
}

export function toFullDate(date) {

    date = date.toISOString()
    var d = DateTime.fromISO(date).toFormat('LLLL dd, y TT ZZ')
    return d;
}

export function getTimeSince(milliseconds) {
  var seconds = parseInt(milliseconds/1000);
  var ret = 'now';
  var time = 0;
  if (seconds > 5 && seconds <= 60) {
    ret = (seconds > 1) ? seconds + ' secs' : seconds + ' sec';
  } else if (seconds > 60 && seconds < 3600) {
    time = parseInt(seconds/60);
    ret = (time > 1) ? time + ' mins' : time + ' min';
  } else if (seconds >= 3600 && seconds < 86400) {
    time = parseInt(seconds/3600);
    ret = (time > 1) ? time + ' hours' : time + ' hour';
  } else if (seconds >= 86400 && seconds < 31536000) {
    time = parseInt(seconds/86400);
    ret = (time > 1) ? time + ' days' : time + ' day';
  } else if (seconds >= 31536000) {
    time = parseInt(seconds/31536000);
    ret = (time > 1) ? time + ' yrs' : time + ' yr';
  }
  return ret;
}

export function parseSimpleDateText(date) {

    if (!Object.prototype.toString.call(date) === "[object Date]") {
      date = Date.parse(date);
    }

    var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const dateText = months[date.getMonth()] +
                          " " + date.getDate() +
                          ", " + date.getFullYear();
    return dateText;
}

export function parseTime(date) {

  var hours = date.getHours();
  var minutes = date.getMinutes();
  var ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12;
  minutes = minutes < 10 ? '0'+minutes : minutes;
  const dateText = hours + ":" + minutes + " " + ampm;
  return dateText;
}

export function containsSpecialCharacters(str){
    var regex = /[ !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/g;
	return regex.test(str);
}

export function hasUpperCase(str) {
    return (/[A-Z]/.test(str));
}

export function dateToSql(str) {
  var pad = function(num) { return ('00'+num).slice(-2) };
  str = str.getUTCFullYear()         + '-' +
        pad(str.getUTCMonth() + 1)  + '-' +
        pad(str.getUTCDate())       + ' ' +
        pad(str.getUTCHours())      + ':' +
        pad(str.getUTCMinutes())    + ':' +
        pad(str.getUTCSeconds());
  return str
}

/* Example

method:'POST',
body: JSON.stringify(arr),
headers: {
  'Accept': 'application/json',
  'Content-Type': 'application/json',
}

export async function check() {

  var ret = false;

  console.log('');
  const res = await fetch(url + '', {
    method:'GET'
  });

  const payload = await res.json();

  if (payload) {
    console.log('');
    ret = true;
  }

  return ret;

}

*/

export async function refreshCoach(id, token) {

  var ret = false;
  var arr = {Id:id, Token:token};

  console.log('Refreshing coach from DB...');
  const res = await fetch(url + '/user/coach/refresh', {
    method:'POST',
    body: JSON.stringify(arr),
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    }
  });

  const payload = await res.json();

  if (payload.length > 0) {
    console.log('Refreshed!');
    ret = payload[0];
  }

  return ret;

}

export async function getNumCoaches() {

  var ret = false;

  console.log('Getting coach count...');
  const res = await fetch(url + '/user/total-coaches/' + key, {
    method:'GET'
  });

  const payload = await res.json();

  if (payload) {
    console.log('Coach count found!');
    ret = payload.length;
  }

  return ret;

}


export async function getPlans(t) {

  var ret = false;

  console.log('Getting plans...');
  const res = await fetch(url + '/plans/' + t, {
    method:'GET'
  });

  const payload = await res.json();

  if (payload.length > 0) {
    console.log('Plans retrieved!');
    ret = payload;
  }

  return ret;

}

export async function getActiveDiscount() {

  var ret = false;

  console.log('Getting active discount...');
  const res = await fetch(url + '/discount/active/' + key, {
    method:'GET'
  });

  const payload = await res.json();

  if (payload.length > 0) {
    console.log('Discount received.');
    ret = payload[0];
  }

  return ret;

}

export async function emailCheck(email) {

  var ret = false;

  if (email === '') {
    email = 'blankEmail';
  }

  console.log('Checking for existing email...');
  const res = await fetch(url + '/user/email/' + email + '/' + key, {
    method:'GET'
  });

  const payload = await res.json();

  if (payload.length > 0) {
    console.log('Email taken!');
  } else {
    console.log('Email not taken!')
    ret = true;
  }

  return ret;

}

export async function createAccount(email, dob, firstName, lastName, password) {

  var ret = false;

  var pw = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    password
  );

  var created = new Date()

  var token = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    pw + parseDateText(created)
  );

  dob = dateToSql(dob)

  var arr = {Token:token, Email:email, DoB:dob, FirstName:firstName, LastName:lastName, Password:pw, WebAPIKey:key}

  console.log('Creating basic coach account...');
  const res = await fetch(url + '/user/coach/create', {
    method:'POST',
    body: JSON.stringify(arr),
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    }
  });

  const payload = await res.json();
  console.log('account:',payload)
  if (payload[0].Id > 0) {
    console.log('Account created!');
    console.log(payload)
    ret = payload[0];
  }

  return ret;

}

export async function verifyCaptcha(response) {

  var ret = false;

  console.log('Verifying captcha...');
  const res = await fetch(url + '/captcha/verify/' + response, {
    method:'GET'
  });

  const payload = await res.json();

  if (payload.success == true) {
    console.log('Success!');
    ret = true;
  } else {
    console.log('Failed.');
  }

  return ret;

}

export async function loginCheck(email, password) {

  var pw = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    password
  );

  var ret = null;

  console.log('Attempting login...');
  const res = await fetch(url + '/user/coach/login-check/' + email + '/' + pw + '/' + key, {
    method:'GET'
  });

  const payload = await res.json();

  if (payload.length == 1) {
    console.log('Login check passed!');
    ret = JSON.stringify(payload[0]);
  } else {
    console.log('Login failed!');
  }

  return ret;

}
