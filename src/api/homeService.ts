import api from './api';

export const getHomeData = async () => {
  try {
    const response = await api.get('/invoices');
    return response.data;
    } catch (error) {
    console.log('homeService getHomeData error:', error);
    throw error;
  }
};

export const getOrdersData = async () => {
    try {
        const response = await api.get('/orders');
        return response.data;
    } catch (error) {
        console.log('homeService getOrdersData error:', error);
        throw error;
    }
};

export const getCustomerData = async () => {
    try {
        const response = await api.get('/customers');
        return response.data;
    } catch (error) {
        console.log('homeService getCustomerData error:', error);
        throw error;
    }
};

export const getKapsterData = async () => {
    try {
        const response = await api.get('/kapsters');
        return response.data;
    } catch (error) {
        console.log('homeService getKapsterData error:', error);
        throw error;
    }
};
