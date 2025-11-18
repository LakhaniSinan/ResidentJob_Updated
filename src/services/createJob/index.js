import Api from '../index';
import {requestType, endPoints} from '../../constants/variables';

export const createJob = params => {
  return Api(`${endPoints.createJob}`, params, requestType.POST);
};

export const fetchJob = (customerId, params) => {
  return Api(`${endPoints.fetchJob}/${customerId}`, params, requestType.POST);
};
export const fetchGroupJobs = id => {
  return Api(`${endPoints.groupJobs}/${id}`, null, requestType.GET);
};
export const fetchWorkerGroupJobs = id => {
  return Api(`${endPoints.workerGroupJobs}/${id}`, null, requestType.GET);
};

export const fetchJobDetails = params => {
  return Api(endPoints.fetchJobDetails, params, requestType.POST);
};
export const getCalenderJobsByWorker = workerId => {
  return Api(`${endPoints.calendarJobs}/${workerId}`, null, requestType.GET);
};

export const updateJobStatus = (jobId, params) => {
  return Api(`${endPoints.updateJobStatus}/${jobId}`, params, requestType.POST);
};
export const cancelJob = (jobId, params) => {
  return Api(`${endPoints.cancelJob}/${jobId}`, params, requestType.POST);
};

export const createJobForAdmin = params => {
  return Api(endPoints.createJobForAdmin, params, requestType.POST);
};
export const updateJobForAdmin = params => {
  return Api(endPoints.updateJobForAdmin, params, requestType.PUT);
};

export const fetchProviderJob = (id, params) => {
  return Api(`${endPoints.fetchProviderJob}/${id}`, params, requestType.POST);
};

export const checkIn = params => {
  return Api(endPoints.checkIn, params, requestType.POST);
};
export const checkOut = params => {
  return Api(endPoints.checkOut, params, requestType.POST);
};
