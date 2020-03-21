import { NEWS_URL } from 'react-native-dotenv';

import axios from 'axios';

const agent = axios.create({
  baseURL: NEWS_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

const send = ( method, url, data, params, token, responseType ) => {
  const headers = token ? {
    Authorization: `Bearer ${token}`
  } : {};
  return agent.request({
    method,
    url,
    headers,
    data,
    params,
    responseType: responseType || 'json'
  }).catch((error) => {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx.
      throw new Error(error.response.data.error);
    } else if (error.request) {
      // The request was made but no response was received.
      throw new Error('OOPS');
    } else {
      // Something happened in setting up the request that triggered an Error
      throw new Error('OOPS');
    }
  });
};

export default { send }