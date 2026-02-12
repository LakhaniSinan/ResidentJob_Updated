import axios from 'axios';

export let baseUrl = 'https://sirldigital.com/residentJob/api';
// export let baseUrl = 'https://tk4c2l16-4000.euw.devtunnels.ms/api';
// export let baseUrl = 'https://1qsx0vd0-4000.inc1.devtunnels.ms/api';
// export let baseUrl = 'http://192.168.100.89:5000/api';

const api = async (path, params, method) => {
  let options = {
    headers: {
      'Content-Type': 'application/json',
    },
    method: method,
    ...(params && {data: JSON.stringify(params)}),
  };

  return axios(baseUrl + path, options)
    .then(response => {
      return response;
    })
    .catch(async error => {
      return error.response;
    });
};

export default api;
