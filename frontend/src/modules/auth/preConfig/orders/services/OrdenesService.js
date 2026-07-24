import ApiGateway from '@/kernel/api/ApiGateway';

const ENDPOINT = '/ordenes';

const OrdenesService = {
  getAll: (params = {}) => ApiGateway.doGet(`${ENDPOINT}?${ApiGateway.buildQuery(params)}`),
  getById: (id) => ApiGateway.doGet(`${ENDPOINT}/${id}`),
  create: (payload) => ApiGateway.doPost(ENDPOINT, payload),
  update: (id, payload) => ApiGateway.doPut(`${ENDPOINT}/${id}`, payload),
  avanzarArea: (id, payload) => ApiGateway.doPut(`${ENDPOINT}/${id}/avanzar-area`, payload),
  remove: (id) => ApiGateway.doDelete(`${ENDPOINT}/${id}`),
};

export default OrdenesService;
