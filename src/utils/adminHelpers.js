/**
 * Parse error message from various error sources
 * @param {Error | Object} error - The error object
 * @returns {string} - A user-friendly error message
 */
export function parseErrorMessage(error) {
  if (!error) {
    return "An unknown error occurred";
  }

  // Axios error with response
  if (error.response?.data?.message) {
    return error.response.data.message;
  }

  // Axios error with status
  if (error.response?.status === 401) {
    return "Unauthorized. Please log in again.";
  }

  if (error.response?.status === 404) {
    return "Resource not found.";
  }

  if (error.response?.status === 400) {
    return "Invalid request. Please check your input.";
  }

  if (error.response?.status >= 500) {
    return "Server error. Please try again later.";
  }

  // Generic error message
  if (error.message) {
    return error.message;
  }

  return "Something went wrong. Please try again.";
}
