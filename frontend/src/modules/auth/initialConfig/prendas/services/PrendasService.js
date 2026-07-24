import ApiGateway from '@/kernel/api/ApiGateway';

const ENDPOINT = '/prendas';

// Catálogo acotado (tipos de prenda, no registros operativos) — se trae
// completo de una vez; ver nota en usePrendas.js sobre por qué no pagina.
const PrendasService = {
  getAll: () => ApiGateway.doGet(`${ENDPOINT}?size=500`),
  create: (payload) => ApiGateway.doPost(ENDPOINT, payload),
  update: (id, payload) => ApiGateway.doPut(`${ENDPOINT}/${id}`, payload),
  remove: (id) => ApiGateway.doDelete(`${ENDPOINT}/${id}`),
};

export default PrendasService;
