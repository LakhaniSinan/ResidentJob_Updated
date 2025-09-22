import Api from '../index';
import {requestType, endPoints} from '../../constants/variables';

export const fetchDetails = type => {
  return Api(`${endPoints.fetchDetails}/${type}`, null, requestType.GET);
};