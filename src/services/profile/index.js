import {endPoints, requestType} from '../../constants/variables';
import Api from '../index';

export const updateDetails = params => {
  return Api(endPoints.updateDetails, params, requestType.POST);
};
