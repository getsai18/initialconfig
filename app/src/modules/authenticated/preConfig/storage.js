import ApiGateway from '@/kernel/api/ApiGateway';

export async function getDoc(key, defaultVal) {
  try {
    const val = localStorage.getItem(key);
    return val ? JSON.parse(val) : defaultVal;
  } catch (e) {
    console.error('Error reading from localStorage for key:', key, e);
    return defaultVal;
  }
}

export async function setDoc(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    return true;
  } catch (e) {
    console.error('Error writing to localStorage for key:', key, e);
    return false;
  }
}

export async function deleteDoc(key) {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (e) {
    console.error('Error deleting key from localStorage:', key, e);
    return false;
  }
}
