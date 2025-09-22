import Api from '../index';
import {requestType, endPoints} from '../../constants/variables';

export const fetchFAQ = type => {
  return Api(`${endPoints.faq}/${type}`, null, requestType.GET);
};
