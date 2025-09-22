import {endPoints, requestType} from '../../constants/variables';
import Api from '../index';

export const createGorupJob = params => {
  return Api(endPoints.createGorupJob, params, requestType.POST);
};
