export function normalizeApiError(error) {
  const status = error.response?.status || 0;
  const responseData = error.response?.data;
  const correlationId = error.response?.headers?.['x-correlation-id'] || '';

  let message = 'The request failed unexpectedly.';

  if (responseData?.fieldErrors) {
    message = Object.values(responseData.fieldErrors).join(' ');
  } else if (Array.isArray(responseData?.errors)) {
    message = responseData.errors
      .map((validationError) => validationError.defaultMessage || validationError.message)
      .filter(Boolean)
      .join(' ');
  } else if (responseData?.error) {
    message = responseData.error;
  } else if (responseData?.message) {
    message = responseData.message;
  } else if (status === 401) {
    message = 'Your session has expired. Sign in again to continue.';
  } else if (status === 403) {
    message = 'Your role does not allow this action.';
  } else if (status >= 500) {
    message = 'The transaction service is unavailable. Try again shortly.';
  } else if (error.code === 'ECONNABORTED') {
    message = 'The request timed out. Check that the backend service is running.';
  } else if (!error.response) {
    message = 'Unable to reach the transaction service. Start the backend and try again.';
  }

  return {
    status,
    message,
    correlationId,
    isUnauthorized: status === 401,
    isForbidden: status === 403,
    original: error
  };
}

export function getApiErrorMessage(error) {
  return error.normalized?.message || normalizeApiError(error).message;
}
