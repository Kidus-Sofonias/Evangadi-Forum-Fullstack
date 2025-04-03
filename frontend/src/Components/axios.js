import axios from 'axios'

const axiosBase = axios.create({
  baseURL:'http://localhost:4000/api'
  // baseURL: "https://evangadi-forum-backend-t1gd.onrender.com/api",
});


axiosBase.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );
  
  // Add response interceptor
  axiosBase.interceptors.response.use(
    (response) => response,
    (error) => {
      console.error("API Error:", error.response?.data);
      return Promise.reject(error);
    }
  );

export default axiosBase

