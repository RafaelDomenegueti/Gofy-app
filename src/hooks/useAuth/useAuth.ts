import { useContext } from 'react';
import { AuthContext, AuthProvider } from './AuthContext';

function useAuth() {
  const auth = useContext(AuthContext);

  return auth;
}


export { AuthProvider, useAuth };
