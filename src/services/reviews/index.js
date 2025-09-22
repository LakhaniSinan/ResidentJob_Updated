import {endPoints, requestType} from '../../constants/variables';
import Api from '../index';

export const createReveiw = (params, userId) => {
  return Api(endPoints.createReveiw, params, requestType.POST);
};

export const fetchAllReviews = userId => {
  return Api(`${endPoints.fetchReviews}/${userId}`, null, requestType.GET);
};
