import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

function decodeToken(token) {
  try {
    if (!token) return null;
    const base64Url = token.split('.')[1];
    if (!base64Url) return null;
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      window
        .atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error('Error decoding JWT token:', e);
    return null;
  }
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => sessionStorage.getItem('token') || localStorage.getItem('token') || null);

  const payload = decodeToken(token);
  const storedRole = sessionStorage.getItem('role') || localStorage.getItem('role') || null;
  const role = payload?.role || storedRole || null;

  const user = payload
    ? {
        id: payload.userId,
        nombre: payload.nombre,
        email: payload.email || (payload.role === 'SUB_ADMIN' ? 'subadmin@uniformespro.com' : payload.role === 'MANAGEMENT' ? 'gestor@uniformespro.com' : 'admin@uniformespro.com'),
        areaId: payload.areaId,
        areaNombre: payload.areaNombre,
      }
    : null;

  const login = (newToken, recordarme, userRole) => {
    const storage = recordarme ? localStorage : sessionStorage;
    storage.setItem('token', newToken);
    if (userRole) {
      storage.setItem('role', userRole);
    }
    setToken(newToken);
  };

  const logout = () => {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('role');
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    setToken(null);
  };

  const isAdmin = role === 'ADMIN';
  const isSubAdmin = role === 'SUB_ADMIN';
  const isManagement = role === 'MANAGEMENT';
  const canDelete = isAdmin;

  return (
    <AuthContext.Provider value={{ token, role, user, login, logout, isAdmin, isSubAdmin, isManagement, canDelete }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
