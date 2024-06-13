import axios from 'axios';
import {Globals} from '../../constants';
import APIConnections from './APIConnections';
import querystring from 'querystring';
import {url} from 'inspector';
import {axiosGet} from './Axios';
import NetworkUtils from '../utils/networkUtils/NetWorkUtils';
import Utilities from '../utils/Utilities';
import {NetworkManager} from './NetworkManager';
export default class DataManager {
  static fetchQrData = async (url) => {
    const isConnected = await NetworkUtils.isNetworkAvailable();
    // const isConnected = await NetworkUtils.isNetworkAvailable();
    if (isConnected === false) {
      return [true, 'No Internet available', null];
    } else {
      try {
        const config = {
          method: 'post',
          maxBodyLength: Infinity,
          url: url,
          headers: {},
        };
        console.log('Api req====', config);
        const res = await axios.request(config);

        console.log('API response =>', res);

        const regex = /<img\s[^>]*>/i;

        const imgTag = res?.data.match(regex);
        console.log('imgTag', imgTag);

        if (imgTag) {
          console.log(imgTag[0]); // Output: <img src='https://chart.googleapis.com/chart?cht=qr&chs=300x300&chl=otpauth%3A%2F%2Ftotp%2FSudhin%3Fsecret%3DKRVXQR2RGFGXITKUJF5E4RCZGNHUGMKPKRCVURCVPJAXO%26issuer%3DNLFCS' border=0>
        } else {
          console.log('No  tag found.');
        }

        if (res.status === 200) {
          return [true, '', imgTag[0]];
        } else {
          return [false, '', null];
        }
      } catch (error) {
        console.log('API error', error.message);
        return [false, error.message, null];
      }
    }
  };

  static validateOTP = async (url) => {
    try {
      const isConnected = await NetworkUtils.isNetworkAvailable();
      if (!isConnected) {
        throw new Error('No internet available');
      }
      const config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: url,
        headers: {},
      };
      console.log('Api req====', config);
      const res = await axios.request(config);

      console.log('API response =>', res);

      if (res.status === 200) {
        return [true, '', res.data];
      } else {
        return [false, '', false];
      }
    } catch (error) {
      console.log('API error', error.message);
      return [false, error.message, null];
    }
  };
  /**
   * Purpose: perform email login
   * Created/Modified By: Monisha Sreejith
   * Created/Modified Date: 9 Jun 2023
   * Steps:
       1.Check network status
       2.Fetch the data
       3.Return data and other info
    */

  static performEmailLogin = async (body) => {
    let url = APIConnections.BASE_URL + APIConnections.ENDPOINTS.LOGIN;
    const urlEncodedData = querystring.stringify(body);
    let headers = {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
      // Authorization: 'Bearer ' + Globals.TOKEN,
    };
    try {
      const isConnected = await NetworkUtils.isNetworkAvailable();
      if (!isConnected) {
        throw new Error('No internet available');
      }
      const config = {
        method: 'post',
        maxBodyLength: Infinity,
        headers: headers,
        url: url,
        data: body,
      };
      console.log('Api req====', config);
      const res = await axios.request(config);
      if (res.status === 200) {
        return [true, '', res.data];
      } else {
        return [false, '', res.data];
      }
    } catch (error) {
      console.log('1', error);
      if (
        error?.response?.status === 400 &&
        error?.response?.status !== undefined
      ) {
        return [
          false,
          error.response.data.message,
          error.response.data.message,
        ];
      } else {
        console.log('API error', error);
        return [false, error.message, error.message];
      }
    }
  };
  /**
    * Purpose: Get user details
    * Created/Modified By: Monisha Sreejith
    * Created/Modified Date: 12 Jun 2023
    * Steps:
           1.Check network status
           2.Fetch the data
           3.Return data and other info
   */
  static getUserDetails = async (body) => {
    let url = APIConnections.BASE_URL + APIConnections.ENDPOINTS.ACCOUNT;
    const urlEncodedData = querystring.stringify(body);
    let headers = {
      Authorization: 'Bearer ' + Globals.TOKEN,
    };
    try {
      const isConnected = await NetworkUtils.isNetworkAvailable();
      if (!isConnected) {
        throw new Error('No internet available');
      }
      const config = {
        method: 'get',
        headers: headers,
        url: url,
        data: undefined,
      };
      const res = await axios.request(config);
      if (res.status === 200) {
        return [true, '', res.data];
      } else {
        return [false, '', false];
      }
    } catch (error) {
      console.log('API error', error.message);
      return [false, error.message, ''];
    }
  };
  /**
    * Purpose: Get Transaction details
    * Created/Modified By: Monisha Sreejith
    * Created/Modified Date: 14 Jun 2023
    * Steps:
           1.Check network status
           2.Fetch the data
           3.Return data and other info
   */
  static getTransactionDetails = async (body) => {
    let url = APIConnections.BASE_URL + APIConnections.ENDPOINTS.TRANSACTION;
    const urlEncodedData = querystring.stringify(body);
    let headers = {
      Authorization: 'Bearer ' + Globals.TOKEN,
    };
    const isConnected = await NetworkUtils.isNetworkAvailable();
    if (isConnected === false) {
      return [true, 'No Internet available', null];
    } else {
      try {
        const config = {
          method: 'get',
          headers: headers,
          url: url,
          data: undefined,
        };
        const res = await axios.request(config);
        console.log('====', res);
        if (res.status === 200) {
          return [true, '', res.data];
        } else {
          return [false, '', false];
        }
      } catch (error) {
        console.log('API error', error.message);
        return [false, error.message, null];
      }
    }
  };
  /**
    * Purpose: Get Share Transaction details
    * Created/Modified By: Monisha Sreejith
    * Created/Modified Date: 7 July 2023
    * Steps:
           1.Check network status
           2.Fetch the data
           3.Return data and other info
   */
  static getShareTransactionDetails = async (body) => {
    let url =
      APIConnections.BASE_URL + APIConnections.ENDPOINTS.SHARE_TRANSACTION;
    const urlEncodedData = querystring.stringify(body);
    let headers = {
      Authorization: 'Bearer ' + Globals.TOKEN,
    };
    const isConnected = await NetworkUtils.isNetworkAvailable();
    if (isConnected === false) {
      return [true, 'No Internet available', null];
    } else {
      try {
        const config = {
          method: 'get',
          headers: headers,
          url: url,
          data: undefined,
        };
        const res = await axios.request(config);
        console.log('====', res);
        if (res.status === 200) {
          return [true, '', res.data];
        } else {
          return [false, '', false];
        }
      } catch (error) {
        console.log('API error', error.message);
        return [false, error.message, null];
      }
    }
  };
  /**
    * Purpose: Get Benefit details
    * Created/Modified By: Monisha Sreejith
    * Created/Modified Date: 15 Jun 2023
    * Steps:
           1.Check network status
           2.Fetch the data
           3.Return data and other info
   */
  static getBenefitDetails = async (body) => {
    let url = APIConnections.BASE_URL + APIConnections.ENDPOINTS.BENEFIT;
    const urlEncodedData = querystring.stringify(body);
    let headers = {
      Authorization: 'Bearer ' + Globals.TOKEN,
    };
    const isConnected = await NetworkUtils.isNetworkAvailable();
    if (isConnected === false) {
      return [true, 'No Internet available', null];
    } else {
      try {
        const config = {
          method: 'get',
          headers: headers,
          url: url,
          data: undefined,
        };
        const res = await axios.request(config);
        console.log('====', res);
        if (res.status === 200) {
          return [true, '', res.data];
        } else {
          return [false, '', false];
        }
      } catch (error) {
        console.log('API error', error.message);
        return [false, error.message, null];
      }
    }
  };
  /**
    * Purpose: Get Loans details
    * Created/Modified By: Monisha Sreejith
    * Created/Modified Date: 15 Jun 2023
    * Steps:
           1.Check network status
           2.Fetch the data
           3.Return data and other info
   */
  static getLoans = async (body) => {
    let url = APIConnections.BASE_URL + APIConnections.ENDPOINTS.LOANS;
    const urlEncodedData = querystring.stringify(body);
    let headers = {
      Authorization: 'Bearer ' + Globals.TOKEN,
    };
    const isConnected = await NetworkUtils.isNetworkAvailable();
    if (isConnected === false) {
      return [true, 'No Internet available', null];
    } else {
      try {
        const config = {
          method: 'get',
          headers: headers,
          url: url,
          data: undefined,
        };
        const res = await axios.request(config);
        console.log('====', res);
        if (res.status === 200) {
          return [true, '', res.data];
        } else {
          return [false, '', false];
        }
      } catch (error) {
        console.log('API error', error.message);
        return [false, error.message, null];
      }
    }
  };
  /**
    * Purpose: Get Fdrs
    * Created/Modified By: Monisha Sreejith
    * Created/Modified Date: 4 July 2023
    * Steps:
           1.Check network status
           2.Fetch the data
           3.Return data and other info
   */
  static getFdrs = async (body) => {
    let url = APIConnections.BASE_URL + APIConnections.ENDPOINTS.FDR;
    const urlEncodedData = querystring.stringify(body);
    let headers = {
      Authorization: 'Bearer ' + Globals.TOKEN,
    };
    const isConnected = await NetworkUtils.isNetworkAvailable();
    if (isConnected === false) {
      return [true, 'No Internet available', null];
    } else {
      try {
        const config = {
          method: 'get',
          headers: headers,
          url: url,
          data: undefined,
        };
        const res = await axios.request(config);
        console.log('====', res);
        if (res.status === 200) {
          return [true, '', res.data];
        } else {
          return [false, '', false];
        }
      } catch (error) {
        console.log('API error', error.message);
        return [false, error.message, null];
      }
    }
  };
  /**
    * Purpose: Get DocumentTypes
    * Created/Modified By: Monisha Sreejith
    * Created/Modified Date: 19 Jun 2023
    * Steps:
           1.Check network status
           2.Fetch the data
           3.Return data and other info
   */
  static getDocumentTypes = async (body) => {
    let url = APIConnections.BASE_URL + APIConnections.ENDPOINTS.DOCUMENT_TYPES;
    const urlEncodedData = querystring.stringify(body);
    let headers = {
      Authorization: 'Bearer ' + Globals.TOKEN,
    };
    try {
      const isConnected = await NetworkUtils.isNetworkAvailable();
      if (!isConnected) {
        throw new Error('No internet available');
      }
      const config = {
        method: 'get',
        headers: headers,
        url: url,
        data: undefined,
      };
      const res = await axios.request(config);
      console.log('====', res);
      if (res.status === 200) {
        return [true, '', res.data];
      } else {
        return [false, '', false];
      }
    } catch (error) {
      console.log('API error', error.message);
      return [false, error.message, ''];
    }
  };
  /**
    * Purpose: Get Search member id
    * Created/Modified By: Monisha Sreejith
    * Created/Modified Date: 19 Jun 2023
    * Steps:
           1.Check network status
           2.Fetch the data
           3.Return data and other info
   */
  static getSearchMember = async () => {
    let url =
      APIConnections.BASE_URL +
      APIConnections.ENDPOINTS.SEARCH_MEMBER_ID +
      '=' +
      Globals.SEARCH_MEMBER;
    let headers = {
      Authorization: 'Bearer ' + Globals.TOKEN,
      'Content-Type': 'application/json',
    };
    try {
      const isConnected = await NetworkUtils.isNetworkAvailable();
      if (!isConnected) {
        throw new Error('No internet available');
      }
      const config = {
        method: 'get',
        headers: headers,
        url: url,
        data: undefined,
      };
      console.log('===================', config);
      const res = await axios.request(config);
      if (res.status === 200) {
        return [true, res.message, res.data];
      } else {
        return [false, res.message, false];
      }
    } catch (error) {
      console.log('API error', error);
      return [false, error.message, ''];
    }
  };
  /**
    * Purpose: perform upload documents
    * Created/Modified By: Monisha Sreejith
    * Created/Modified Date: 20 Jun 2023
    * Steps:
           1.Check network status
           2.Fetch the data
           3.Return data and other info
   */
  static performUploadDocument = async (body) => {
    let url =
      APIConnections.BASE_URL + APIConnections.ENDPOINTS.UPLOAD_DOCUMENT;

    let headers = {
      'Content-Type': 'multipart/form-data',
      Authorization: 'Bearer ' + Globals.TOKEN,
    };

    try {
      const isConnected = await NetworkUtils.isNetworkAvailable();
      if (!isConnected) {
        throw new Error('No internet available');
      }

      const config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: url,
        headers: headers,
        data: body,
        timeout: 60000,
      };
      console.log('config===', config);
      const res = await axios.request(config);
      if (res?.status === 200) {
        return [true, res.data.message, res];
      } else {
        return [false, '', false];
      }

      // if (isConnected === false) {
      //   return [false, 'No internet available', null];
      // } else {
      //   //2
      //   const response = await NetworkManager.uploadFiles(url, body);
      //   //3
      //   if (response.status === false) {
      //     return [false, response.message, null];
      //   } else {
      //     return [true, response.message, response.data];
      //   }
      // }
    } catch (error) {
      return [false, error.message, error];
    }
  };
  /**
   * Purpose: perform 2FA Verify 2FA
   * Created/Modified By: Monisha Sreejith
   * Created/Modified Date: 9 Jun 2023
   * Steps:
       1.Check network status
       2.Fetch the data
       3.Return data and other info
    */
  static perform2FAVerify2FA = async (body) => {
    let url = APIConnections.BASE_URL + APIConnections.ENDPOINTS.VERIFY_2FA;
    let headers = {
      'Content-Type': 'multipart/form-data',
      Authorization: 'Bearer ' + Globals.TEMP_TOKEN,
    };
    try {
      const isConnected = await NetworkUtils.isNetworkAvailable();
      if (!isConnected) {
        throw new Error('No internet available');
      }

      const config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: url,
        headers: headers,
        data: body,
      };
      console.log('config===', config);
      const res = await axios.request(config);
      if (res?.status === 200) {
        return [true, res.data.message, res];
      } else {
        return [false, '', false];
      }
    } catch (error) {
      if (
        error?.response?.status === 422 &&
        error?.response?.status !== undefined
      ) {
        return [
          false,
          error.response.data.message,
          error.response.data.message,
        ];
      } else {
        console.log('API error', error);
        return [
          false,
          error.response.data.message,
          error.response.data.message,
        ];
      }
    }
  };
  /**
   * Purpose: perform Change Password
   * Created/Modified By: Monisha Sreejith
   * Created/Modified Date: 9 Jun 2023
   * Steps:
       1.Check network status
       2.Fetch the data
       3.Return data and other info
    */

  static performChangePassword = async (body) => {
    let url =
      APIConnections.BASE_URL + APIConnections.ENDPOINTS.CHANGE_PASSWORD;
    const urlEncodedData = querystring.stringify(body);
    let headers = {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
      Authorization: 'Bearer ' + Globals.TOKEN,
    };
    const isConnected = await NetworkUtils.isNetworkAvailable();
    if (isConnected === false) {
      return [true, 'No Internet available', null];
    } else {
      try {
        const config = {
          method: 'post',
          maxBodyLength: Infinity,
          headers: headers,
          url: url,
          data: body,
        };
        console.log('Api req====', config);
        const res = await axios.request(config);
        if (res.status === 200) {
          return [true, '', res.data];
        } else {
          return [false, '', false];
        }
      } catch (error) {
        console.log('API error', error.message);
        return [false, error.message, null];
      }
    }
  };

  static performResetPassword = async (body) => {
    let url = APIConnections.BASE_URL + APIConnections.ENDPOINTS.RESET_PASSWORD;
    const urlEncodedData = querystring.stringify(body);
    let headers = {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
      Authorization: 'Bearer ' + Globals.TOKEN,
    };
    const isConnected = await NetworkUtils.isNetworkAvailable();
    if (isConnected === false) {
      return [true, 'No Internet available', null];
    } else {
      try {
        const config = {
          method: 'post',
          maxBodyLength: Infinity,
          headers: headers,
          url: url,
          data: body,
        };
        console.log('Api req====', config);
        const res = await axios.request(config);
        if (res.status === 200) {
          return [true, '', res.data];
        } else {
          return [false, '', false];
        }
      } catch (error) {
        console.log('API error', error.message);
        return [false, error.message, null];
      }
    }
  };
  /**
    * Purpose: Get Documents
    * Created/Modified By: Monisha Sreejith
    * Created/Modified Date: 26 Jun 2023
    * Steps:
           1.Check network status
           2.Fetch the data
           3.Return data and other info
   */
  static getDocuments = async (body) => {
    let url = APIConnections.BASE_URL + APIConnections.ENDPOINTS.DOCUMENTS;
    const urlEncodedData = querystring.stringify(body);
    let headers = {
      Authorization: 'Bearer ' + Globals.TOKEN,
    };
    try {
      const isConnected = await NetworkUtils.isNetworkAvailable();
      if (!isConnected) {
        throw new Error('No internet available');
      }
      const config = {
        method: 'get',
        headers: headers,
        url: url,
        data: undefined,
      };
      const res = await axios.request(config);
      console.log('====', res);
      if (res.status === 200) {
        return [true, '', res.data];
      } else {
        return [false, '', false];
      }
    } catch (error) {
      console.log('API error', error.message);
      return [false, error.message, ''];
    }
  };
  /**
    * Purpose: Get Announcements
    * Created/Modified By: Monisha Sreejith
    * Created/Modified Date: 26 Jun 2023
    * Steps:
           1.Check network status
           2.Fetch the data
           3.Return data and other info
   */
  static getAnnouncements = async (body) => {
    let url = APIConnections.BASE_URL + APIConnections.ENDPOINTS.ANNOUNCEMENTS;
    const urlEncodedData = querystring.stringify(body);
    let headers = {
      Authorization: 'Bearer ' + Globals.TOKEN,
    };
    try {
      const isConnected = await NetworkUtils.isNetworkAvailable();
      if (!isConnected) {
        throw new Error('No internet available');
      }
      const config = {
        method: 'get',
        headers: headers,
        url: url,
        data: undefined,
      };
      const res = await axios.request(config);
      console.log('====', res);
      if (res.status === 200) {
        return [true, '', res.data];
      } else {
        return [false, '', false];
      }
    } catch (error) {
      console.log('API error', error.message);
      return [false, error.message, ''];
    }
  };
  /**
    * Purpose: Get Notifications
    * Created/Modified By: Monisha Sreejith
    * Created/Modified Date: 26 Jun 2023
    * Steps:
           1.Check network status
           2.Fetch the data
           3.Return data and other info
   */
  static getNotifications = async (body) => {
    let url = APIConnections.BASE_URL + APIConnections.ENDPOINTS.NOTIFICATIONS;
    const urlEncodedData = querystring.stringify(body);
    let headers = {
      Authorization: 'Bearer ' + Globals.TOKEN,
    };
    try {
      const isConnected = await NetworkUtils.isNetworkAvailable();
      if (!isConnected) {
        throw new Error('No internet available');
      }
      const config = {
        method: 'get',
        headers: headers,
        url: url,
        data: undefined,
      };
      const res = await axios.request(config);
      console.log('====', res);
      if (res.status === 200) {
        return [true, '', res.data];
      } else {
        return [false, '', false];
      }
    } catch (error) {
      console.log('API error', error.message);
      return [false, error.message, ''];
    }
  };
  /**
    * Purpose: Get Read Notifications
    * Created/Modified By: Monisha Sreejith
    * Created/Modified Date: 4 July 2023
    * Steps:
           1.Check network status
           2.Fetch the data
           3.Return data and other info
   */
  static PerformReadNotification = async (body) => {
    let url =
      APIConnections.BASE_URL +
      APIConnections.ENDPOINTS.READ_NOTIFICATION +
      Globals?.READ_NOTIFICATION_ID;
    let headers = {
      'Content-Type': 'multipart/form-data',
      Authorization: 'Bearer ' + Globals.TOKEN,
    };
    try {
      const isConnected = await NetworkUtils.isNetworkAvailable();
      if (!isConnected) {
        throw new Error('No internet available');
      }

      const config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: url,
        headers: headers,
      };
      const res = await axios.request(config);
      console.log('res===', res);
      if (res?.status === 200) {
        return [true, res.success, res];
      } else {
        return [false, res.success, false];
      }
    } catch (error) {
      if (
        error?.response?.status === 422 &&
        error?.response?.status !== undefined
      ) {
        return [
          false,
          error.response.data.message,
          error.response.data.message,
        ];
      } else {
        console.log('API error', error);
        return [
          false,
          error.response.data.message,
          error.response.data.message,
        ];
      }
    }
  };
  /**
   * Purpose: perform Create Ticket
   * Created/Modified By: Monisha Sreejith
   * Created/Modified Date: 28 Jun 2023
   * Steps:
       1.Check network status
       2.Fetch the data
       3.Return data and other info
    */
  static performCreateTicket = async (body) => {
    let url = APIConnections.BASE_URL + APIConnections.ENDPOINTS.CREATE_TICKET;
    let headers = {
      'Content-Type': 'multipart/form-data',
      Authorization: 'Bearer ' + Globals.TOKEN,
    };
    try {
      const isConnected = await NetworkUtils.isNetworkAvailable();
      if (!isConnected) {
        throw new Error('No internet available');
      }

      const config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: url,
        headers: headers,
        data: body,
      };
      console.log('config===', config);
      const res = await axios.request(config);
      if (res?.status === 200 && res?.data?.result !== 'error') {
        return [true, res.data.message, res];
      } else {
        return [false, res.data.message, false];
      }
    } catch (error) {
      if (
        error?.response?.status === 422 &&
        error?.response?.status !== undefined
      ) {
        return [
          false,
          error.response.data.message,
          error.response.data.message,
        ];
      } else {
        console.log('API error', error);
        return [
          false,
          error.response.data.message,
          error.response.data.message,
        ];
      }
    }
  };
  /**
   * Purpose: perform My Tickets
   * Created/Modified By: Monisha Sreejith
   * Created/Modified Date: 28 Jun 2023
   * Steps:
       1.Check network status
       2.Fetch the data
       3.Return data and other info
    */
  static performMyTicket = async (body) => {
    let url = APIConnections.BASE_URL + APIConnections.ENDPOINTS.MY_TICKET;
    let headers = {
      'Content-Type': 'multipart/form-data',
      Authorization: 'Bearer ' + Globals.TOKEN,
    };
    try {
      const isConnected = await NetworkUtils.isNetworkAvailable();
      if (!isConnected) {
        throw new Error('No internet available');
      }

      const config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: url,
        headers: headers,
        data: body,
      };
      const res = await axios.request(config);
      console.log('====', res);
      if (res?.status === 200) {
        return [true, res.data.message, res];
      } else {
        return [false, '', false];
      }
    } catch (error) {
      if (
        error?.response?.status === 422 &&
        error?.response?.status !== undefined
      ) {
        return [
          false,
          error.response.data.message,
          error.response.data.message,
        ];
      } else {
        console.log('API error', error);
        return [
          false,
          error.response.data.message,
          error.response.data.message,
        ];
      }
    }
  };
  /**
   * Purpose: perform Reply Ticket
   * Created/Modified By: Monisha Sreejith
   * Created/Modified Date: 30 Jun 2023
   * Steps:
       1.Check network status
       2.Fetch the data
       3.Return data and other info
    */
  static performReplyTicket = async (body) => {
    let url =
      APIConnections.BASE_URL +
      APIConnections.ENDPOINTS.REPLY_TICKET +
      Globals.TICKET_ID;
    let headers = {
      'Content-Type': 'multipart/form-data',
      Authorization: 'Bearer ' + Globals.TOKEN,
    };
    try {
      const isConnected = await NetworkUtils.isNetworkAvailable();
      if (!isConnected) {
        throw new Error('No internet available');
      }

      const config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: url,
        headers: headers,
        data: body,
      };
      const res = await axios.request(config);
      console.log('====', res);
      if (res?.status === 200 && res?.data?.result !== 'error') {
        return [true, res.data.success, res];
      } else {
        return [false, res.data.success, false];
      }
    } catch (error) {
      if (
        error?.response?.status === 422 &&
        error?.response?.status !== undefined
      ) {
        return [
          false,
          error.response.data.error.message,
          error.response.data.error.message,
        ];
      } else {
        console.log('API error', error);
        return [
          false,
          error.response.data.error.message,
          error.response.data.error.message,
        ];
      }
    }
  };
}
