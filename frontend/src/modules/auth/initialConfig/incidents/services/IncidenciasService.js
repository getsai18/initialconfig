import ApiGateway from '@/kernel/api/ApiGateway';

const ENDPOINT = '/incidencias';

const IncidenciasService = {
  getAll: (estado = '') => ApiGateway.doGet(`${ENDPOINT}${estado ? `?estado=${estado}` : ''}`),
  getById: (id) => ApiGateway.doGet(`${ENDPOINT}/${id}`),
  create: (payload) => ApiGateway.doPost(ENDPOINT, payload),
  resolver: (id, payload) => ApiGateway.doPut(`${ENDPOINT}/${id}/resolver`, payload),
  remove: (id) => ApiGateway.doDelete(`${ENDPOINT}/${id}`),
};

export default IncidenciasService;
