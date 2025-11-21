import axios from 'axios';

// export let baseUrl = 'https://sirldigital.com/residentJob/api';
export let baseUrl = 'https://0g01d8wd-4000.inc1.devtunnels.ms/api';
// export let baseUrl = 'https://1qsx0vd0-5000.inc1.devtunnels.ms/api';
// export let baseUrl = 'http://192.168.100.89:5000/api';

const api = async (path, params, method) => {
  let options = {
    headers: {
      'Content-Type': 'application/json',
    },
    method: method,
    ...(params && {data: JSON.stringify(params)}),
  };

  console.log(`${baseUrl}${path}`, options, 'options');

  return axios(baseUrl + path, options)
    .then(response => {
      return response;
    })
    .catch(async error => {
      return error.response;
    });
};

export default api;
