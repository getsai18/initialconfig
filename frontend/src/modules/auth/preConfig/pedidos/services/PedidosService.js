import ApiGateway from '@/kernel/api/ApiGateway';

const ENDPOINT = '/pedidos';

const PedidosService = {
  getAll: (params = {}) => ApiGateway.doGet(`${ENDPOINT}?${ApiGateway.buildQuery(params)}`),
  getById: (id) => ApiGateway.doGet(`${ENDPOINT}/${id}`),
  create: (payload) => ApiGateway.doPost(ENDPOINT, payload),
  update: (id, payload) => ApiGateway.doPut(`${ENDPOINT}/${id}`, payload),
  remove: (id) => ApiGateway.doDelete(`${ENDPOINT}/${id}`),
};

export default PedidosService;
