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

  try {
    const response = await fetch(`${API_URL}${endpoint}`, config);
    
    // Check if the response has content-type 'application/json'
    const contentType = response.headers.get('content-type');
    let data = null;
    
    if (contentType && contentType.includes('application/json')) {
      const text = await response.text();
      data = text ? JSON.parse(text) : null;
    } else {
      const text = await response.text();
      data = text ? { message: text } : null;
    }
    
    return data;
  } catch (error) {
    console.error('API request failed:', error);
    return null;
  }
}

const ApiGateway = {
  doGet: (endpoint) => handleMethod(endpoint, 'GET'),
  doPost: (endpoint, body) => handleMethod(endpoint, 'POST', body),
  doPut: (endpoint, body) => handleMethod(endpoint, 'PUT', body),
  doDelete: (endpoint, body) => handleMethod(endpoint, 'DELETE', body),
};

export default ApiGateway;
