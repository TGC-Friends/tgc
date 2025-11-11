import axios from 'axios';
import type { FormData as FormDataType, ApiResponse } from './types';

// Use relative URLs for Vercel API routes, or absolute URL if specified
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

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

