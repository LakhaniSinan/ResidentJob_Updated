import {endPoints, requestType} from '../../constants/variables';
import Api from '../index';

export const fetchWalletData = id => {
  return Api(`${endPoints.fetchWalletData}/${id}`, null, requestType.GET);
};
export const clearPayment = id => {
  return Api(`${endPoints.clearPayment}/${id}`, null, requestType.GET);
};
export const updateJobByAdmin = (id, params) => {
  return Api(`${endPoints.updateJobByAdmin}/${id}`, params, requestType.POST);
};
export const updateJobAfterPayment = (id, params) => {
  return Api(
    `${endPoints.updateJobAfterPayment}/${id}`,
    params,
    requestType.POST,
  );
};
