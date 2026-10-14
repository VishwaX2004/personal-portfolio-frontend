export const getAdminToken = () => {
  return localStorage.getItem("adminToken");
};

export const setAdminToken = (token) => {
  localStorage.setItem("adminToken", token);
};

export const clearAdminToken = () => {
  localStorage.removeItem("adminToken");
};

export const isAdminLoggedIn = () => {
  return !!getAdminToken();
};
