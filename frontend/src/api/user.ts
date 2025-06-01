import api from './api';

export const getUser = async () => {
    return api.get('/api/v1/user/self');
};

export const updateUser = async (data: Record<string, any>) => {
    return api.put('/api/v1/user/self', data);
};