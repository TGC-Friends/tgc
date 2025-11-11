import axios from 'axios';
import type { FormData as FormDataType, ApiResponse } from './types';

// Use relative URLs for Vercel API routes, or absolute URL if specified
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add request interceptor for debugging
api.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`, config.data);
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for debugging
api.interceptors.response.use(
  (response) => {
    console.log(`API Response: ${response.config.url}`, response.data);
    return response;
  },
  (error) => {
    console.error(`API Error: ${error.config?.url}`, error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const submitFormDetails = async (data: FormDataType): Promise<ApiResponse> => {
  // Send as JSON (serverless functions handle JSON better)
  const response = await api.post('/submitformdetails', data, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return response.data;
};

export const processCustomerAccount = async (data: FormDataType): Promise<ApiResponse> => {
  const response = await api.post('/processcustomeracct', data, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return response.data;
};

export const processOrders = async (data: FormDataType): Promise<ApiResponse> => {
  const response = await api.post('/processorders', data, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return response.data;
};

export const retrieveFormDetails = async (email: string, phone: string): Promise<FormDataType | { error: string }> => {
  const response = await api.post('/retrieveformdetails', { email, phone }, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return response.data;
};

export const updateCustomerInGS = async (customerNum: string): Promise<ApiResponse> => {
  const response = await api.post('/updatecustomerings', { customernum: customerNum }, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return response.data;
};

export const updateOrderInGS = async (orderNum: string, orderId: string): Promise<ApiResponse> => {
  const response = await api.post('/updateorderings', { ordernum: orderNum, orderid: orderId }, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return response.data;
};

export const updateInvoiceInGS = async (invoiceNum: string): Promise<ApiResponse> => {
  const response = await api.post('/updateinvoiceings', { invoicenum: invoiceNum }, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return response.data;
};

export const updateFittingDatesInGS = async (): Promise<ApiResponse> => {
  const response = await api.post('/updatefittingdatesings', {}, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return response.data;
};

