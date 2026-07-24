import ApiGateway from '@/kernel/api/ApiGateway';

const ENDPOINT = '/auth';

const AuthService = {
  login: (usuario, password) => ApiGateway.doPost(`${ENDPOINT}/login`, { usuario, password }),
  requestPasswordRecovery: (usuario, email) =>
    ApiGateway.doPost(`${ENDPOINT}/password-recovery/request`, { usuario, email }),
  verifyPasswordRecovery: (usuario, otpCode) =>
    ApiGateway.doPost(`${ENDPOINT}/password-recovery/verify`, { usuario, otpCode }),
  resetPassword: (resetToken, nuevaPassword) =>
    ApiGateway.doPost(`${ENDPOINT}/password-recovery/reset`, { resetToken, nuevaPassword }),
};

export default AuthService;
