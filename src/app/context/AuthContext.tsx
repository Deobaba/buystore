"use client"
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import {jwtDecode} from 'jwt-decode';



interface User {
    email: string;
}

// Define the initial user object
export const INITIAL_USER = {
  email: "",
};

// Define the initial state for the context
const INITIAL_STATE = {
  user: INITIAL_USER,
  token: "",
  isAuthenticated: false,
  login: () => {},
  logout: () => {}
};

// Define the type for the context state
interface AuthContextType {
  user: User;
  token: string;
  isAuthenticated: boolean;
  login: (userData: User, token: string) => void;
  logout: () => void;
}

interface JWTPayload {
  exp: number;  
  [key: string]: any;  
}

// Create the AuthContext with a default value of null
const AuthContext = createContext<AuthContextType>(INITIAL_STATE);

// AuthProvider component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User>(INITIAL_USER);
  const [token, setToken] = useState<string>('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  // Decode the JWT and check if it has expired
  const isTokenExpired = (authToken: string) => {
    try {
      const decodedToken: JWTPayload = jwtDecode(authToken);
      if (decodedToken.exp) {
        const currentTime = Date.now() / 1000;  // Convert to seconds
        return decodedToken.exp < currentTime;  // Compare expiration time
      }
      return false;
    } catch (error) {
      console.error("Invalid token format", error);
      return true; // Consider the token expired in case of an error
    }
  };

  // Load token and user data from local storage (if present)
  useEffect(() => {
    console.log('Checking token validity on route change or component mount...');
    const storedToken = localStorage.getItem('authToken');
    const storedUser = localStorage.getItem('user');
    
    if (storedToken && storedUser) {
      if (isTokenExpired(storedToken)) {
        // If token is expired, logout the user
        logout();
      } else {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
        setIsAuthenticated(true);
      }
    } else {
      router.push('/homepage'); // Automatically redirect to login page if no token
    }
  }, [router]);

  // Function to log in the user
  const login = (userData: User, authToken: string) => {
    setUser(userData);
    setToken(authToken);
    setIsAuthenticated(true);

    // Store the user and token in local storage
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("authToken", authToken);

    router.push('/');
  };

  // Function to log out the user
  const logout = () => {
    setUser(INITIAL_USER);
    setToken('');
    setIsAuthenticated(false);
    localStorage.removeItem('user');
    localStorage.removeItem('authToken');
    router.push('/homepage');
  };

  // Context value to be shared
  const contextValue: AuthContextType = {
    user,
    token,
    isAuthenticated,
    login,
    logout,
  };

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};

// Custom hook to use AuthContext
export const useAuthContext = () => useContext(AuthContext);
