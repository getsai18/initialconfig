const API_URL = import.meta.env.VITE_API_URL;

function buildHeaders() {
  return {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    Authorization: `Bearer ${sessionStorage.getItem('token')}`,
  };
}

async function handleMethod(endpoint, method, body) {
  const config = { method, headers: buildHeaders() };
  if (method !== 'GET') config.body = JSON.stringify(body);

  const response = await fetch(`${API_URL}${endpoint}`, config);
  return response.json();
}

const ApiGateway = {
  doGet: (endpoint) => handleMethod(endpoint, 'GET'),
  doPost: (endpoint, body) => handleMethod(endpoint, 'POST', body),
  doPut: (endpoint, body) => handleMethod(endpoint, 'PUT', body),
  doDelete: (endpoint, body) => handleMethod(endpoint, 'DELETE', body),
};

export default ApiGateway;
