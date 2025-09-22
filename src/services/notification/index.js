import Api from '../index';
import {endPoints, requestType} from '../../constants/variables';

export const getAllNotificationById = id => {
  return Api(`${endPoints.notifications}/${id}`, null, requestType.GET);
};
export const sendNotification = params => {
  return Api(endPoints.sendNotification, params, requestType.POST);
};
