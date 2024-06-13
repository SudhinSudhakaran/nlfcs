import {Globals} from '../../constants';
import {Alert} from 'react-native';
export const NetworkManager = {
  get,
  post,
  put,
  delete: _delete,
  uploadFiles,
};

function get(url, headers = {}, customUrlValue = '') {
  let encodeUrl = encodeURI(decodeURI(url)) + customUrlValue;
  const header = {
    'Content-Type': 'application/json',
  };
  // console.log("get",Globals.TOKEN);
  const requestOptions = {
    method: 'GET',
    headers: header,
  };
  _logApiRequest(encodeUrl, requestOptions);
  return fetch(encodeUrl, requestOptions).then(handleResponse);
}

function post(url, body, headers = {}) {
  console.log('Headers', headers);

  const requestOptions = {
    method: 'POST',
    headers: headers,
    // body: JSON.stringify(body),
    body: body,
    redirect: 'follow',
  };
  _logApiRequest(url, requestOptions);
  return fetch(url, requestOptions).then(handleResponse);
}

function put(url, body) {
  const header = {
    'Content-Type': 'application/json',
    'X-Auth-Token': Globals.TOKEN,
  };

  const requestOptions = {
    method: 'PUT',
    headers: header,
    body: JSON.stringify(body),
  };
  _logApiRequest(url, requestOptions);
  return fetch(url, requestOptions).then(handleResponse);
}

// prefixed with underscored because delete is a reserved word in javascript
function _delete(url) {
  const header = {
    'Content-Type': 'application/json',
    'x-auth-token': '',
  };
  const requestOptions = {
    method: 'DELETE',
    headers: header,
  };
  _logApiRequest(url, requestOptions);
  return fetch(url, requestOptions).then(handleResponse);
}
/*https://medium.com/@ariel.salem1989/how-to-upload-multiple-files-react-native-e9577a5de106
  *https://stackoverflow.com/a/61637713/10476608
  EG:
      Setup A Form:

      let data = new FormData();
      Fill Form Out:

      this.state.selectedImages.forEach((item, i) => {
      data.append("doc[]", {
          uri: item.uri,
          type: "image/jpeg",
          name: item.filename || `filename${i}.jpg`,
      });
      });
  */
function uploadFiles(url, body, headers = {}) {
  const requestOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    //body: JSON.stringify(body)
    body: body,
  };
  _logApiRequest(url, requestOptions);
  return fetch(url, requestOptions).then(handleResponse);
}

function handleResponse(response) {
  return response.text().then((text) => {
    console.log('Response: ', response);
    console.log('Response status code : ', response.status);
    if (response.status === 401) {
      //Session expired
      console.log('Session expired!');
      createForceLogoutAlert();
    } else {
      if (response.headers.get('Content-Type').includes('application/json')) {
        const data = JSON.parse(text);
        _logApiCallSuccess(data);
        return data;
      } else {
        _logApiCallSuccess(text);
        return text;
      }
    }
    return null;
  });
}

// Logs
function _logApiRequest(url, request) {
  console.log('API req URL: ', url);
  console.log('API req: ', {request});
}
function _logApiCallSuccess(data) {
  console.log('Success!', data);
}

function _logApiCallError(error) {
  console.error('There was an error!', error);
}

const createForceLogoutAlert = () =>
  Alert.alert(
    'Session expired',
    'Your session has been expired, Please login to continue',
    [{text: 'Sign out', onPress: () => clearDataAndNavigateToHome()}],
  );

const clearDataAndNavigateToHome = () => {
  //Utils.ClearUserRelatedData(); //NEED TO CHANGE TO CLEAR ONLY USER DETAILS
  // RootNavigation.reset();
  //console.log('onLogout at set: ', props.onAuthChange)
  // try {
  //   reloadApp();
  //   // Helper.resetViewLogout()
  //   // if ((props.onAuthChange != null) || (this.props.onAuthChange != undefined)) {
  //   //     props.onAuthChange(null)
  //   // }
  // } catch (e) {
  //   console.log(e);
  // }
};
// async function reloadApp() {
//   await Updates.reloadAsync();
// }
