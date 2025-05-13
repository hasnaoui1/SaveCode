import axios from "axios";
import Swal from "sweetalert2";

const axiosInstance = axios.create({
  baseURL: "http://localhost:3002",
  timeout: 100000,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use((req) => {
  if (localStorage.getItem("token")) {
    req.headers.Authorization = `Bearer ${localStorage.getItem("token")}`;
  }
  return req;
});

axiosInstance.interceptors.response.use(
  (response) => response.data,
  (error) => {
    console.error("Axios Error:", error);
    let interceptorError = { message: "An unexpected error occurred" };
    
    if (error.response) {
      if (error.response.status === 404) {
        Swal.fire({
          title: "Server Error",
          icon: "error",
          toast: true,
          timer: 3000,
          showConfirmButton: false,
          position: "bottom-end",
        });
      }
      interceptorError.message =
        error.response.data.message || error.response.data.error || "Server error";
    } else if (error.request) {
      interceptorError.message = "No response from server";
    } else {
      interceptorError.message = error.message;
    }
    
    return Promise.reject(interceptorError);
  }
);

export default axiosInstance;