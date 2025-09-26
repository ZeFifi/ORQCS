import AsyncStorage from '@react-native-async-storage/async-storage';

export const setHasLaunched = async () => {
  try {
    await AsyncStorage.setItem('hasLaunched', 'true');
  } catch (error) {
    console.error('Error setting hasLaunched:', error);
  }
};

export const setUserToken = async (token: string) => {
  try {
    await AsyncStorage.setItem('userToken', token);
  } catch (error) {
    console.error('Error setting user token:', error);
  }
};

export const removeUserToken = async () => {
  try {
    await AsyncStorage.removeItem('userToken');
  } catch (error) {
    console.error('Error removing user token:', error);
  }
};

export const getHasLaunched = async (): Promise<boolean> => {
  try {
    const hasLaunched = await AsyncStorage.getItem('hasLaunched');
    return hasLaunched !== null;
  } catch (error) {
    console.error('Error getting hasLaunched:', error);
    return false;
  }
};

export const getUserToken = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem('userToken');
  } catch (error) {
    console.error('Error getting user token:', error);
    return null;
  }
};

export const resetOnboarding = async () => {
  try {
    await AsyncStorage.removeItem('hasLaunched');
  } catch (error) {
    console.error('Error resetting onboarding:', error);
  }
};