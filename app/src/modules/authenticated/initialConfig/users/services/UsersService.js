import ApiGateway from '@/kernel/api/ApiGateway';

const ENDPOINT = '/users';

const UsersService = {
  getAll: () => ApiGateway.doGet(`${ENDPOINT}?size=100`),
  getPage: ({ page = 0, size = 10, q = '' } = {}) =>
    ApiGateway.doGet(`${ENDPOINT}?${ApiGateway.buildQuery({ page, size, q })}`),
  getById: (id) => ApiGateway.doGet(`${ENDPOINT}/${id}`),
  create: (payload) => ApiGateway.doPost(ENDPOINT, payload),
  update: (id, payload) => ApiGateway.doPut(`${ENDPOINT}/${id}`, payload),
  remove: (id) => ApiGateway.doDelete(`${ENDPOINT}/${id}`),
};

export default UsersService;
