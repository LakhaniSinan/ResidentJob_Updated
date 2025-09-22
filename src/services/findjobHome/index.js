import Api from '../index';
import {requestType, endPoints} from '../../constants/variables';

export const findJobHomeApi = id => {
  return Api(`${endPoints.findjobhome}/${id}`, null, requestType.GET);
};
export const fetchAvailbleJob = parmas => {
  return Api(endPoints.fetchAvilbleJob, parmas, requestType.POST);
};
export const findJobsByDate = parmas => {
  return Api(endPoints.findJobsByDate, parmas, requestType.POST);
};
export const acceptJob = parmas => {
  return Api(endPoints.acceptJob, parmas, requestType.POST);
};
