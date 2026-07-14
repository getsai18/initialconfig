const API_URL = import.meta.env.VITE_API_URL;

function buildHeaders() {
  const token = sessionStorage.getItem('token') || localStorage.getItem('token');
  return {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
}

async function handleMethod(endpoint, method, body) {
  const config = { method, headers: buildHeaders() };
  if (method !== 'GET') config.body = JSON.stringify(body);

  const response = await fetch(`${API_URL}${endpoint}`, config);
  return response.json();
}

function buildQuery(params = {}) {
  const usp = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') usp.set(key, value);
  });
  return usp.toString();
}

const ApiGateway = {
  doGet: (endpoint) => handleMethod(endpoint, 'GET'),
  doPost: (endpoint, body) => handleMethod(endpoint, 'POST', body),
  doPut: (endpoint, body) => handleMethod(endpoint, 'PUT', body),
  doDelete: (endpoint, body) => handleMethod(endpoint, 'DELETE', body),
  buildQuery,
};

export default ApiGateway;
