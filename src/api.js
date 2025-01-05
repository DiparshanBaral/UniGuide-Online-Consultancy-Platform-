import axios from 'axios';

// Set up the base URL for your backend API
const API = axios.create({
  baseURL: 'http://localhost:5000', // Replace with your backend URL
});

export default API;
