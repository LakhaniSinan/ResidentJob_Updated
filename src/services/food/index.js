import Api from '../index';
import {requestType, endPoints} from '../../constants/variables';

export const addFood = params => {
  return Api(endPoints.addProviderFood, params, requestType.POST);
};

export const updateFood = (userId, params) => {
  return Api(`${endPoints.updateFood}/${userId}`, params, requestType.POST);
};
export const onDeleteFood = userId => {
  return Api(`${endPoints.onDeleteFood}/${userId}`, null, requestType.DELETE);
};

export const fetchFood = params => {
  return Api(
    `${endPoints.fetchProviderFood}?foodCategoryId=${params.foodCategoryId}&providerId=${params.providerId}`,
    null,
    requestType.GET,
  );
};
