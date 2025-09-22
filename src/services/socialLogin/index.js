import Api from '../index';
import {endPoints, requestType} from '../../constants/variables';

export const googleLogin = params => {
  return Api(endPoints.googleLogin, params, requestType.POST);
};
