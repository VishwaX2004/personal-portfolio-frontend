import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import API from "../services/api";


// ============================================================
// CREATE CONTEXT
// ============================================================

const AuthContext = createContext(null);


// ============================================================
// PROVIDER
// ============================================================

export function AuthProvider({ children }) {

  const [user, setUser] = useState(null);

  const [loading, setLoading] =
    useState(true);


  // ==========================================================
  // LOAD USER FROM LOCAL STORAGE
  // ==========================================================

  useEffect(() => {

    const storedUser =
      localStorage.getItem("user");

    const token =
      localStorage.getItem("token");


    if (
      storedUser &&
      token
    ) {

      try {

        setUser(
          JSON.parse(storedUser)
        );

      } catch (error) {

        console.error(
          "Invalid stored user"
        );

        localStorage.removeItem(
          "user"
        );

        localStorage.removeItem(
          "token"
        );

      }

    }


    setLoading(false);

  }, []);


  // ==========================================================
  // LOGIN
  // ==========================================================

  const login = async (
    email,
    password
  ) => {

    const response =
      await API.post(
        "/auth/login",
        {
          email,
          password,
        }
      );


    const userData =
      response.data;


    if (!userData.isAdmin) {

      throw new Error(
        "You don't have admin access."
      );

    }


    // Save token

    localStorage.setItem(
      "token",
      userData.token
    );


    // Save user

    const cleanUser = {

      id: userData._id,

      name: userData.name,

      email: userData.email,

      isAdmin: userData.isAdmin,

    };


    localStorage.setItem(
      "user",
      JSON.stringify(cleanUser)
    );


    setUser(cleanUser);


    return userData;

  };


  // ==========================================================
  // LOGOUT
  // ==========================================================

  const logout = () => {

    localStorage.removeItem(
      "token"
    );

    localStorage.removeItem(
      "user"
    );

    setUser(null);

  };


  // ==========================================================
  // AUTH CHECK
  // ==========================================================

  const isAuthenticated =
    Boolean(
      user &&
      localStorage.getItem("token")
    );


  // ==========================================================
  // ADMIN CHECK
  // ==========================================================

  const isAdmin =
    Boolean(
      user?.isAdmin
    );


  // ==========================================================
  // CONTEXT VALUE
  // ==========================================================

  const value = {

    user,

    token:
      localStorage.getItem(
        "token"
      ),

    loading,

    isAuthenticated,

    isAdmin,

    login,

    logout,

  };


  return (
    <AuthContext.Provider
      value={value}
    >
      {children}
    </AuthContext.Provider>
  );
}


// ============================================================
// CUSTOM HOOK
// ============================================================

export function useAuth() {

  const context =
    useContext(
      AuthContext
    );


  if (!context) {

    throw new Error(
      "useAuth must be used inside AuthProvider"
    );

  }


  return context;
}