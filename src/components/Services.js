import axios from 'axios';

const API_URL = 'https://fakestoreapi.com';

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const fetchProducts = async () => {
  try {
    const response = await apiClient.get('/products');
    return response.data;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

export const fetchProductById = async (id) => {
  try {
    const response = await apiClient.get(`/products/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching product ${id}:`, error);
    throw error;
  }
};

export const fetchCategories = async () => {
  try {
    const response = await apiClient.get('/products/categories');
    return response.data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};

export const fetchProductsByCategory = async (category) => {
  try {
    const response = await apiClient.get(`/products/category/${category}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching category ${category}:`, error);
    throw error;
  }
};
