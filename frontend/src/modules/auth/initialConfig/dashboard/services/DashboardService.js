import ApiGateway from '@/kernel/api/ApiGateway';

const ENDPOINT = '/dashboard/summary';

const DashboardService = {
  getSummary: () => ApiGateway.doGet(ENDPOINT),
};

export default DashboardService;
