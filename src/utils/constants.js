export const API_BASE_URL =
  process.env.NODE_ENV === 'development' ? 'http://localhost:4000' : 'https://theodercafe.com/api';
export const API_GATEWAY_URL =
  process.env.NODE_ENV === 'development' ? 'http://localhost:4002' : 'https://theodercafe.com';
export const API_GATEWAY_PATH = process.env.NODE_ENV === 'development' ? '/socket.io' : '/gw/socket.io';
