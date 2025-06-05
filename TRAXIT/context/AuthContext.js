import React, { createContext, useState } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [role, setRole] = useState('patient');
  const [userToken, setUserToken] = useState('dummy-token');

  return (
    <AuthContext.Provider value={{ role, setRole, userToken, setUserToken }}>
      {children}
    </AuthContext.Provider>
  );
};
