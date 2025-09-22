import Api from '../index';
import {requestType, endPoints} from '../../constants/variables';

export const search = params => {
  return Api(`${endPoints.search}${params}`, null, requestType.GET);
};

export const updateProfile = (params, userId) => {
  return Api(`${endPoints.updateProfile}/${userId}`, params, requestType.POST);
};

export const fetchHomeData = () => {
  return Api(endPoints.fetchHomeData, null, requestType.GET);
};
