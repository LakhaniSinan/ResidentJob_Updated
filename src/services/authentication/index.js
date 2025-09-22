import Api from '../index';
import {requestType, endPoints} from '../../constants/variables';

export const sendOtp = params => {
  return Api(endPoints.sendCode, params, requestType.POST);
};

export const registerUser = params => {
  return Api(endPoints.registerUser, params, requestType.POST);
};

export const loginUser = params => {
  return Api(endPoints.login, params, requestType.POST);
};

export const GetCategory = () => {
  return Api(endPoints.allCategory, null, requestType.GET);
};
export const fetchProvidersByCate = id => {
  return Api(`${endPoints.fetchProvidersByCate}/${id}`, null, requestType.GET);
};

export const GetJobTitle = params => {
  return Api(endPoints.jobTitle, params, requestType.GET);
};

export const ForgotPassword = params => {
  return Api(endPoints.forgotPassword, params, requestType.POST);
};

export const ChangePassword = params => {
  return Api(endPoints.resetPassword, params, requestType.POST);
};
export const changeUserPassword = params => {
  return Api(endPoints.changePassword, params, requestType.POST);
};
export const getUserProfile = userId => {
  return Api(`${endPoints.getUserProfile}/${userId}`, null, requestType.GET);
};
