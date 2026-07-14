import ApiGateway from '@/kernel/api/ApiGateway';

const ENDPOINT = '/prendas';

const PrendasService = {
  getAll: () => ApiGateway.doGet(`${ENDPOINT}?size=100`),
  create: (payload) => ApiGateway.doPost(ENDPOINT, payload),
  update: (id, payload) => ApiGateway.doPut(`${ENDPOINT}/${id}`, payload),
  remove: (id) => ApiGateway.doDelete(`${ENDPOINT}/${id}`),
};

export default PrendasService;
