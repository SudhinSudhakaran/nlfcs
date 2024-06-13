import AsyncStorage from '@react-native-async-storage/async-storage';
export const AppStorage = {
  getItem: async (key) => {
    try {
      let result = await AsyncStorage.getItem(key);
      return JSON.parse(result);
    } catch (e) {
      console.log(`AsyncStorage clearItems ${key} failed:`, e);
      throw e;
    }
  },
  setItem: async (key, value) => {
    try {
      const item = JSON.stringify(value);
      return await AsyncStorage.setItem(key, item);
    } catch (e) {
      console.log(`AsyncStorage clearItems ${key} failed:`, e);
      throw e;
    }
  },

  clearAll: async () => {
    try {
      await AsyncStorage.clear();
    } catch (e) {
      console.log('AsyncStorage clearItems failed:', e);
      throw e;
    }
  },

  clearItems: async (keys) => {
    try {
      await AsyncStorage.multiRemove(keys);
    } catch (e) {
      console.log(`AsyncStorage clearItems ${keys} failed:`, e);
      throw e;
    }
  },
};
