import axios from "axios";
import { requestStatusStore } from "./store";
import Cookies from "js-cookie";

const instance = axios.create({
  baseURL: "/api",
  headers: {
    Accept: "application/json",
    "Content-type": "application/json",
  },
  withCredentials: true,
});

const on_request = (config) => {
  config.headers["X-CSRF-TOKEN"] = Cookies.get("csrf_access_token");

  if (!config.ignoreTracking) {
    requestStatusStore.requestStarted();
  }

  return config;
};

const on_response = (response) => {
  if (!response.config.ignoreTracking) {
    requestStatusStore.requestFinished();
  }

  return response.data;
};

const on_response_error = (error) => {
  if (!error.response.config.ignoreTracking) {
    requestStatusStore.setError(error.response.data);
    requestStatusStore.requestFinished();
  }

  return Promise.reject(error.response.data);
};

instance.interceptors.request.use(on_request);
instance.interceptors.response.use(on_response, on_response_error);

export default instance;
