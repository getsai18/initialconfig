import ApiGateway from '@/kernel/api/ApiGateway';

const ENDPOINT = '/areas';

const AreasService = {
  getAll: () => ApiGateway.doGet(ENDPOINT),
  getById: (id) => ApiGateway.doGet(`${ENDPOINT}/${id}`),
  create: (payload) => ApiGateway.doPost(ENDPOINT, payload),
  update: (id, payload) => ApiGateway.doPut(`${ENDPOINT}/${id}`, payload),
  remove: (id) => ApiGateway.doDelete(`${ENDPOINT}/${id}`),
};

export default AreasService;
