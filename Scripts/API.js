import React from 'react';
import * as Crypto from 'expo-crypto';

export const url = 'https://api.coachsync.me';
export const uploadUrl = 'https://db.coachsync.me';
export const key = 'donthackme,imjustadevelopertryingmybest!';

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

export async function verifyCaptcha(response) {

  var ret = false;

  console.log('Verifying captcha...');
  const res = await fetch(url + '/captcha/verify/' + response, {
    method:'GET'
  });

  const payload = await res.json();
  console.log(payload);
  
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
