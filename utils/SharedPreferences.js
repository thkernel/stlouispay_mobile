import { AsyncStorage } from "@react-native-community/async-storage";

export default class SharedPreferences {

  async put(key, value, onError) {
    try {
      await AsyncStorage.setItem(key, value);
      return this;
    } catch (Error) {
      onError?onError(Error):console.log(Error);
    }
  }

  async persist(key, data, onError) {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(data));
      return this;
    } catch (Error) {
      onError?onError(Error):console.log(Error);
    }
  }

  async get(key, onError) {
    
    try {
      const value = await AsyncStorage.getItem(key);
      return value;
    } catch (Error) {
      onError?onError(Error):console.log(Error);
    }
  }
}
