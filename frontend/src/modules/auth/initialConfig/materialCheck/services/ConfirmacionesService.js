import ApiGateway from '@/kernel/api/ApiGateway';

const ENDPOINT = '/confirmaciones';

const ConfirmacionesService = {
  getAll: () => ApiGateway.doGet(ENDPOINT),
  getEntregas: () => ApiGateway.doGet(`${ENDPOINT}/entregas`),
  getFinalizaciones: () => ApiGateway.doGet(`${ENDPOINT}/finalizaciones`),
  create: (payload) => ApiGateway.doPost(ENDPOINT, payload),
};

export default ConfirmacionesService;
