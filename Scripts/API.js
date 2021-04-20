import React from 'react';
export const url = 'https://api.coachsync.me';
export const uploadUrl = 'https://db.coachsync.me';
export const key = 'donthackme,imjustadevelopertryingmybest!';

export async function loginCheck(email, password) {

  var ret = null;

  console.log('Attempting login...');
  const res = await fetch(url + '/user/coach/login-check/' + email + '/' + password + '/' + key, {
    method:'GET'
  });

  const payload = await res.json();

  if (payload.length == 1) {
    console.log('Login check passed!');
    ret = JSON.stringify(payload[0]);
  }

  return ret;

}
