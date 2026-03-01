import { APP_SECRET } from '@/config/config.js';
import axios from 'axios';
const BASE_URL = 'https://gc.das-ai.com/';
import CryptoJS from 'crypto-js';
export function generateSign(appKey, appSecret) {
  const timestamp = Date.now();
  const data = `${timestamp}\n${appSecret}\n${appKey}`;
  const sign = CryptoJS.HmacSHA256(data, appSecret).toString(CryptoJS.enc.Base64);
  return `${timestamp}${sign}`;
}

export function createApiRequest(appKey, sign) {
  return axios.create({
    baseURL: BASE_URL,
    timeout: 10000,
    headers: {
      'appKey': appKey,
      'sign': sign,
      'Content-Type': 'application/json'
    }
  });
}