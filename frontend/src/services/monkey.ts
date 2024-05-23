import type { MonkeyDetail } from '../types/monkey';
// eslint-disable-next-line import/no-named-as-default
import AxiosRequest from './axios.config';

const getallMonkey = async (page: number, limit: number = 2) => {
  return AxiosRequest.get(`monkey/get-all?page=${page}&limit=${limit}`);
};

const AddMonkey = async (data: MonkeyDetail) => {
  return AxiosRequest.post('monkey/create', data);
};

const UpdateMonkey = async (data: MonkeyDetail) => {
  return AxiosRequest.patch(`monkey/${data.id}`, data);
};

const DeleteMonkey = async (id: number) => {
  return AxiosRequest.del(`monkey/${id}`);
};

const getMonkeyById = async (id: number) => {
  return AxiosRequest.get(`monkey/getbyId/${id}`);
};

export const MonkeyAPI = {
  getallMonkey,
  AddMonkey,
  UpdateMonkey,
  DeleteMonkey,
  getMonkeyById,
};
