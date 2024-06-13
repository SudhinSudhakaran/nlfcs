import Toast from 'react-native-toast-message';

export default class Utilities {
  static showToast(
    message = '',
    subMessage = '',
    type = 'error',
    position = 'bottom',
  ) {
    Toast.show({
      type: type, //'success | error | info '
      text1: message,
      text2: subMessage,
      position: position,
      topOffset: 60,
      bottomOffset: 100,
      visibilityTime: 3000,
      // text1Style: {marginLeft: 30, marginRight:30},
    });
  }
  //Validations
  static isEmailValid(email) {
    const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return reg.test(email) === true;
  }
}
