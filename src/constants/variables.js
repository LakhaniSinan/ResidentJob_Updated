export const constants = {};
export const buyandsell = {};
export const notifications = {};
export const GOOGLE_MAPS_APIKEY = '';
export const STRIPE_PUBLIC = '';
export const STRIPE_SECRET = '';

export const requestType = {
  POST: 'post',
  PUT: 'put',
  GET: 'get',
  DELETE: 'delete',
};

export const apiHeaders = {
  contentType: 'Content-Type',
  application_json: 'application/json',
  multipart_data: 'multipart/form-data',
  language: 'LANG',
  authorization: 'Authorization',
};
export const endPoints = {
  login: '/user/login',
  sendCode: '/user/sendCode',
  registerUser: '/user/register',
  allCategory: '/admin/category/fetch',
  jobTitle: '/admin/job-title/fetch',
  search: '/search',
  forgotPassword: '/user/sendCode/forgot-password',
  resetPassword: '/user/forgot-password',
  updateProfile: '/user/update-profile',
  faq: '/admin/faq/fetch',
  getInTouch: '/user/create/get-touch',
  findjobhome: '/find-job/home',
  addProviderFood: '/jobSeeker/food/add',
  fetchProviderFood: '/jobSeeker/food/fetch',
  fetchDetails: '/jobSeeker/detail',
  addProviderFood: '/jobSeeker/food/add',
  fetchDetails: '/jobSeeker/detail',
  createJob: '/user/job/create',
  fetchJob: '/user/job/fetch',
  groupJobs: '/user/group-jobs/fetch',
  workerGroupJobs: '/worker/group-jobs/fetch',
  fetchProviderJob: '/jobSeeker/job/fetch',
  fetchJobDetails: '/worker/job-detail',
  calendarJobs: '/worker/calendar-jobs',
  updateJobStatus: '/user/job-status/update',
  createReveiw: '/user/review/create',
  fetchHomeData: '/home/fetch',
  notifications: '/user/notification/fetch',
  googleLogin: '/user/socialLogin',
  getUserProfile: '/user/profile/fetch',
  fetchProvidersByCate: '/users/fetchProvidersByCategoryId',
  updateFood: '/jobSeeker/food/update',
  onDeleteFood: '/jobSeeker/food/delete',
  fetchWalletData: '/user/wallet/fetch',
  clearPayment: '/user/wallet/clear-payment',
  fetchReviews: '/user/review/fetch',
  changePassword: '/user/profile/change-password',
  sendNotification: '/user/send-notification',
  updateDetails: '/user/job-seeker/detail',
  createGorupJob: '/create/group-job',
  createJobForAdmin: '/admin/create-job',
  updateJobByAdmin: '/admin/group-jobs/update',
  checkIn: '/check-in',
  checkOut: '/check-out',
  fetchAvilbleJob: '/fetch/available-jobs',
  findJobsByDate: '/fetch/available-jobs-by-date',
  acceptJob: '/admin/assign-jobs',
  getSettings: '/admin/settings/fetch',
  updateJobAfterPayment: '/admin/group-jobs/update-after-payment',
  cancelJob: '/admin/group-jobs/cancel',
  updatedJob: '/update/group-job',
  updateJobForAdmin: '/admin/update-job',
  getAssingedWorkers: '/admin/group-job/assigned-workers',

  //Payment Card
  saveCard: '/card/save',
  fetchSavedCard: '/card/fetch',
  deleteCard: '/card/remove',
};

export const stripePublishKey =
  'pk_test_51Qk8OoFHArl14nFMCYx7oNGLfWKuXqKk6HlxGkm9GYYw2PVKsz98wYjKPAgZjL4OMqUWmbtqxMga8cW3GfcJLGXW00kkSmSVEA';
export const stripeSecrethKey =
  'sk_test_51Qk8OoFHArl14nFMWDOHxJMFRzI9sGWqt9SidUeghHVcfkQkfJh3IbWXRvUN1tGBVo6R20alGdPF74ivttpDtTQd00OIGN4wJ5';
