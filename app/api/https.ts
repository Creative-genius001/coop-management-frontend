import axios from 'axios';


export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  withCredentials: true,
});

api.interceptors.response.use(
  function onFulfilled(response){
    return response;
  }, 
  function onRejected(error) {
     // if (error.response?.status === 401) {
  //   await refreshToken();
  //   return instance(error.config); // Retry original request
  // }
    if (error.response?.status === 401) {
      return Promise.reject(new Error('UNAUTHORIZED'));
    }
    return Promise.reject(error);
    }
 );
