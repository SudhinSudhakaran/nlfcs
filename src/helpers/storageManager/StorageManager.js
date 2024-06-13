import {Globals} from '../../constants';
import {AppStorage} from './AppStorage';
export default class StorageManager {
  /**
    * Purpose:Save the value in to result in Async storage
    * Created/Modified By: Monisha Sreejith
    * Created/Modified Date:  9 Jun 2023
    * Steps:
        1.Create the value true
        2.Store the value into result
    */
  static saveUserEmail = async (memberId) => {
    try {
      await AppStorage.setItem(Globals.STORAGE_KEYS.USER_EMAIL, memberId);
    } catch (e) {}
  };

  /**
       *
       Purpose:Get the value
      * Created/Modified By: Monisha Sreejith
      * Created/Modified Date: 9 Jun 2023
      * Steps:
          1.Get the value from Async storage
          2.return the value
       */
  static getUserEmail = async () => {
    try {
      let res = await AppStorage.getItem(Globals.STORAGE_KEYS.USER_EMAIL);
      return res;
    } catch (e) {}
  };
  /**
    * Purpose:Save the value in to result in Async storage
    * Created/Modified By: Monisha Sreejith
    * Created/Modified Date:  14 Jun 2023
    * Steps:
        1.Create the value true
        2.Store the value into result
    */
  static saveUserPassword = async (password) => {
    try {
      await AppStorage.setItem(Globals.STORAGE_KEYS.PASSWORD, password);
    } catch (e) {}
  };

  /**
             *
             Purpose:Get the value
            * Created/Modified By: Monisha Sreejith
            * Created/Modified Date: 14 Jun 2023
            * Steps:
                1.Get the value from Async storage
                2.return the value
             */
  static getUserPassword = async () => {
    try {
      let res = await AppStorage.getItem(Globals.STORAGE_KEYS.PASSWORD);
      return res;
    } catch (e) {}
  };
  /**
    * Purpose:Save the value in to result in Async storage
    * Created/Modified By: Monisha Sreejith
    * Created/Modified Date:  12 Jun 2023
    * Steps:
        1.Create the value true
        2.Store the value into result
    */

  static saveUserDetails = async (info) => {
    try {
      await AppStorage.setItem(Globals.STORAGE_KEYS.USER_DETAILS, info);
      await AppStorage.setItem(Globals.STORAGE_KEYS.IS_AUTH, 'true');
    } catch (e) {}
  };

  /**
             *
             Purpose:Get the value
            * Created/Modified By: Monisha Sreejith
            * Created/Modified Date: 12 Jun 2023
            * Steps:
                1.Get the value from Async storage
                2.return the value
             */
  static getUserDetails = async () => {
    try {
      let res = await AppStorage.getItem(Globals.STORAGE_KEYS.USER_DETAILS);
      return res;
    } catch (e) {}
  };

  /**
  *
  Purpose:Save the value in to result in Async storage
 * Created/Modified By: Monisha Sreejith
 * Created/Modified Date:  12 Jun 2023
 * Steps:
     1.Create the value true
     2.Store the value into result
  */

  static saveToken = async (info) => {
    try {
      await AppStorage.setItem(Globals.STORAGE_KEYS.TOKEN, info);
    } catch (e) {}
  };

  /**
         *
         Purpose:Get the value
        * Created/Modified By: Monisha Sreejith
        * Created/Modified Date: 12 Jun 2023
        * Steps:
            1.Get the value from Async storage
            2.return the value
         */
  static getSavedToken = async () => {
    try {
      let res = await AppStorage.getItem(Globals.STORAGE_KEYS.TOKEN);
      return res;
    } catch (e) {}
  };

  /**
  *
  Purpose:Save the value in to result in Async storage
 * Created/Modified By: Monisha Sreejith
 * Created/Modified Date:  12 Jun 2023
 * Steps:
     1.Create the value true
     2.Store the value into result
  */
  static saveIsAuth = async (info) => {
    try {
      await AppStorage.setItem(Globals.STORAGE_KEYS.IS_AUTH, info);
    } catch (e) {}
  };
  /**
       *
       Purpose:Get the value
      * Created/Modified By: Monisha Sreejith
      * Created/Modified Date: 12 Jun 2023
      * Steps:
          1.Get the value from Async storage
          2.return the value
       */
  static getIsAuth = async () => {
    try {
      let res = await AppStorage.getItem(Globals.STORAGE_KEYS.IS_AUTH);
      return res;
    } catch (e) {}
  };

  /**
        *
        Purpose:clear data from Async storage
       * Created/Modified By: Monisha Sreejith
       * Created/Modified Date: 12 Jun 2023
       * Steps:
           1.Clear the data in the Async storage
        */
  static clearUserRelatedData = async () => {
    try {
      //Clearing from globals
      Globals.USER_DETAILS = {};
      Globals.IS_AUTHORIZED = false;
      Globals.TOKEN = '';
      //Clearing from db
      let res = await AppStorage.clearAll();
      return res;
    } catch (e) {
      console.log('ClearUserRelatedData: ', e);
    }
  };
}
