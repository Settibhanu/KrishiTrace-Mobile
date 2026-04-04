import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = 'https://krishitrace-one.vercel.app/api';

// Create axios instance
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

// Auto-attach JWT token to every request
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('krishitrace_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ── AUTH ──────────────────────────────────────────────
export const login = (mobile, password) =>
  api.post('/auth/login', { mobile, password });

export const register = (data) =>
  api.post('/auth/register', data);

export const getMe = () => api.get('/auth/me');

export const updateProfile = (data) =>
  api.patch('/auth/profile', data);

// ── HARVEST ───────────────────────────────────────────
export const getHarvests = () => api.get('/harvest');
export const addHarvest = (data) => api.post('/harvest', data);
export const getHarvestById = (id) => api.get(`/harvest/${id}`);

// ── QR / TRACE ────────────────────────────────────────
export const getQRData = (id) => api.get(`/qr/${id}`);

// ── MARKET ────────────────────────────────────────────
export const getMarketPrices = () => api.get('/market');

// ── IOT ───────────────────────────────────────────────
export const getIoTReadings = () => api.get('/iot/alerts');
export const getIoTAlerts   = () => api.get('/iot/alerts');

// ── LEDGER ────────────────────────────────────────────
export const getLedger = () => api.get('/ledger');

// ── REPORTS ───────────────────────────────────────────
export const getReports = () => api.get('/reports/summary');

// ── GIS ───────────────────────────────────────────────
export const getGISData = () => api.get('/gis');

export default api;
