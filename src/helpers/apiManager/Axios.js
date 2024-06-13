import axios from 'axios';
export const axiosGet = async (url, headers = {}) => {
  try {
    const response = await axios.get(`${url}`, {
      headers: {
        ...headers,
      },
    });
    return response.data;
  } catch (error) {
    console.log(error);
  }
};
export const axiosPost = async (url, data, headers = {}) => {
  // console.log('axios post-------------------------', data);

  let config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: url,
    headers: headers,
    data: data,
  };
  console.log('API req-------------------------', config);
  axios
    .request(config)
    .then(response => {
      // const _response = JSON.stringify(response.data);
      // console.log('_response', _response);
      return response;
    })
    .catch(error => {
      console.log('error', error);
    });
};

export const axiosPut = async (url, data, headers = {}) => {
  try {
    const response = await axios.put(`${url}`, data, {
      headers: {
        ...headers,
      },
    });
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const axiosDelete = async (url, headers = {}) => {
  try {
    const response = await axios.delete(`${url}`, {
      headers: {
        ...headers,
      },
    });
    return response.data;
  } catch (error) {
    console.log(error);
  }
};
export default {
  axiosGet,
  axiosPost,
  axiosPut,
  axiosDelete,
};
