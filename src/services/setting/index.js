import Api from '../index';
import {endPoints, requestType} from '../../constants/variables';

export const getSettings = () => {
  return Api(endPoints.getSettings, null, requestType.GET);
};
