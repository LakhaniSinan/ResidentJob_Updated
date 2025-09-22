import Api from '../index';
import {requestType, endPoints} from '../../constants/variables';

export const sendHelpMessage = params => {
  return Api(`${endPoints.getInTouch}`, params, requestType.POST);
};
