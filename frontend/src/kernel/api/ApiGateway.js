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

/** Arma un query string para los listados paginados (page/size/q), omitiendo
 *  valores vacíos — usado por getPage() en Users/Areas/Clientes/Activities. */
function buildQuery(params = {}) {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') return;
    searchParams.set(key, value);
  });
  return searchParams.toString();
}

const ApiGateway = {
  doGet: (endpoint) => handleMethod(endpoint, 'GET'),
  doPost: (endpoint, body) => handleMethod(endpoint, 'POST', body),
  doPut: (endpoint, body) => handleMethod(endpoint, 'PUT', body),
  doDelete: (endpoint, body) => handleMethod(endpoint, 'DELETE', body),
  buildQuery,
};

export default ApiGateway;
