// import { logout, refreshToken } from '@/store/slices/auth';
// import { store } from '../store/store';
import { CookieNames, getCookieItem } from "../utils/cookies";
import { accessTokenURL } from "./Urls";
import {
  clearSession,
  clearAccessTokenInSession,
  setAccessTokenInSession,
} from "../utils/cookies";
import axios from "axios";

const client = axios.create({
  headers: { "Content-Type": "application/json" },
});

client.interceptors.request.use(
  (request) => {
    //const authRoutes = ROUTE_WITHOUT_TOKEN.some((i) => request?.url?.includes(i));
    let accessToken = getCookieItem(CookieNames.ACCESS_TOKEN);
    if (accessToken) {
      request.headers.Authorization = `Bearer ${accessToken}`;
    } else {
      accessToken = getCookieItem(CookieNames.REFRESH_TOKEN);
      request.headers.Authorization = `Bearer ${accessToken}`;
    }
    return request;
  },
  (error) => {
    return Promise.reject(error);
  }
);

client.interceptors.response.use(
  (response) => {
    if (response.data.error) {
      return Promise.reject(response.data);
    }
    return Promise.resolve(response.data);
  },
  async (error) => {
    try {
      const originalRequest = error.config;
      const authRoutes = ["accessToken", "refreshToken"].some((i) =>
        originalRequest?.url?.includes(i)
      );
      if (
        !authRoutes &&
        error.response?.status === 401 &&
        !originalRequest?.retry
      ) {
        originalRequest.retry = true;
        clearAccessTokenInSession();
        let accessTokenRes = await client.get(accessTokenURL);
        if (accessTokenRes?.reason) {
          throw accessTokenRes;
        }
        if (accessTokenRes.accessToken) {
          setAccessTokenInSession(accessTokenRes.accessToken);
          originalRequest.headers["Authorization"] =
            `Bearer ${accessTokenRes.accessToken}`;
          const retryData = await Promise.resolve(axios(originalRequest));
          return retryData.data;
        }
      }
    } catch (errorOnError) {
      clearSession();
    }
    return Promise.reject(error.response?.data);
  }
);

export default client;
