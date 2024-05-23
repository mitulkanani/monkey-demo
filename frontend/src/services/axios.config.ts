/* eslint-disable no-param-reassign */
/* eslint-disable no-underscore-dangle */
import type {
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';
import axios from 'axios';

interface Config extends AxiosRequestConfig {}

const BASE = process.env.NEXT_PUBLIC_API_ENDPOINT;

axios.defaults.baseURL = BASE;

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_ENDPOINT,
  timeout: 5000,
});

axiosInstance.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    // const accessToken = process.env.NEXT_PUBLIC_API_ACCESS_TOKEN; // Cookies.get("accessToken");
    // config.headers.Authorization = accessToken ? `Bearer ${accessToken}` : "";

    return Promise.resolve(config);
  },
  (err) => {
    return Promise.reject(err);
  }
);

const get = (url: string, config: Config = {}): Promise<AxiosResponse> =>
  axiosInstance.get(url, config);

const post = <T>(
  url: string,
  data: T,
  config: Config = {}
): Promise<AxiosResponse> => axiosInstance.post(url, data, config);

const put = <T>(
  url: string,
  data: T,
  config: Config = {}
): Promise<AxiosResponse> => axiosInstance.put(url, data, config);

const patch = <T>(
  url: string,
  data: T,
  config: Config = {}
): Promise<AxiosResponse> => axiosInstance.patch(url, data, config);

const del = (url: string, config: Config = {}): Promise<AxiosResponse> =>
  axiosInstance.delete(url, config);

const AxiosRequest = {
  get,
  post,
  put,
  patch,
  del,
};

export default AxiosRequest;
