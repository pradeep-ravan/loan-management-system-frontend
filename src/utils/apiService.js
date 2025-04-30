import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL

// User API calls
export const createUser = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/users`, userData);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};

export const getUserById = async (userId) => {
  try {
    const response = await axios.get(`${API_URL}/users/${userId}`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};

export const getUserByPAN = async (pan) => {
  try {
    const response = await axios.get(`${API_URL}/users/pan/${pan}`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};

// Loan API calls
export const createLoan = async (loanData) => {
  try {
    const response = await axios.post(`${API_URL}/loans`, loanData);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};

export const getLoanById = async (loanId) => {
  try {
    const response = await axios.get(`${API_URL}/loans/${loanId}`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};

export const getLoansByUserId = async (userId) => {
  try {
    const response = await axios.get(`${API_URL}/loans/user/${userId}`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};

export const downloadLoanLedgerCSV = async (loanId) => {
  try {
    const response = await axios.get(`${API_URL}/loans/${loanId}/csv`, {
      responseType: 'blob'
    });
    
    // Create download link
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `loan_ledger_${loanId}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    return true;
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};