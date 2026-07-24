/**
 * ApiGateway hace response.json() en TODAS las respuestas sin revisar el
 * status code (ver el mismo comentario en GlobalExceptionHandler del
 * backend), así que un 400/404/409/500 nunca lanza — resuelve con el cuerpo
 * de ApiError{status, error, message, fieldErrors, timestamp}. Hay que
 * reconocer esa forma explícitamente para no tratar un error como éxito.
 */
export function isApiError(result) {
  return !!result && typeof result === 'object' && typeof result.status === 'number' && typeof result.error === 'string';
}

export function apiErrorMessage(result, fallback = 'Ocurrió un error. Intenta nuevamente.') {
  return (isApiError(result) && result.message) || fallback;
}
