import ApiGateway from '@/kernel/api/ApiGateway';

export async function getDoc(key, defaultVal) {
  try {
    const val = localStorage.getItem(key);
    if (val) return JSON.parse(val);
    return defaultVal;
  } catch (e) {
    console.error('Error al leer storage:', key, e);
    return defaultVal;
  }
}

export async function setDoc(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    return true;
  } catch (e) {
    console.error('Error al guardar storage:', key, e);
    return false;
  }
}

export async function deleteDoc(key) {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (e) {
    console.error('Error al eliminar storage:', key, e);
    return false;
  }
}
