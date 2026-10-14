// ============================================================
// FORMAT DATE
// ============================================================

export const formatDate = (dateString) => {
  if (!dateString) return "";

  try {
    return new Date(dateString).toLocaleString();
  } catch (error) {
    return dateString;
  }
};

// ============================================================
// VALIDATE PROJECT FORM
// ============================================================

export const validateProjectForm = (formData) => {
  const errors = [];

  if (!formData.title?.trim()) {
    errors.push("Project title is required");
  }

  if (!formData.slug?.trim()) {
    errors.push("Project slug is required");
  }

  if (!formData.description?.trim()) {
    errors.push("Project description is required");
  }

  if (!formData.category?.trim()) {
    errors.push("Project category is required");
  }

  return errors;
};

// ============================================================
// VALIDATE EDUCATION FORM
// ============================================================

export const validateEducationForm = (formData) => {
  const errors = [];

  if (!formData.title?.trim()) {
    errors.push("Degree/title is required");
  }

  if (!formData.school?.trim()) {
    errors.push("Institution/school is required");
  }

  if (!formData.year) {
    errors.push("Year is required");
  } else {
    const year = parseInt(formData.year, 10);
    if (year < 1900 || year > 2099) {
      errors.push("Year must be between 1900 and 2099");
    }
  }

  return errors;
};

// ============================================================
// PARSE ERROR MESSAGE
// ============================================================

export const parseErrorMessage = (error) => {
  // Try common error response structures
  if (error.response?.data?.message) {
    return error.response.data.message;
  }

  if (error.response?.data?.error) {
    return error.response.data.error;
  }

  if (error.response?.data) {
    if (typeof error.response.data === "string") {
      return error.response.data;
    }
  }

  if (error.message) {
    return error.message;
  }

  return "An error occurred";
};
