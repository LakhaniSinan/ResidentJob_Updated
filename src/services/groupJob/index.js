import {endPoints, requestType} from '../../constants/variables';
import Api from '../index';

export const createGorupJob = params => {
  return Api(endPoints.createGorupJob, params, requestType.POST);
};
export const updatedJob = (id, params) => {
  return Api(`${endPoints.updatedJob}/${id}`, params, requestType.PUT);
};
