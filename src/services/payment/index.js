import {endPoints, requestType} from '../../constants/variables';
import Api from '../index';

export const SavePaymentCard = params => {
  return Api(endPoints.saveCard, params, requestType.POST);
};
export const fetchSavedCard = id => {
  return Api(`${endPoints.fetchSavedCard}/${id}`, null, requestType.GET);
};
export const deleteCard = params => {
  return Api(endPoints.deleteCard, params, requestType.POST);
};
