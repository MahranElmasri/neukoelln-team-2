import React from 'react';
import { useAuthContext } from './useAuthContext';
export function useLogout() {
  const { dispatch } = useAuthContext();

  const logout = () => {
    localStorage.removeItem('user');

    //dispatch logout action
    dispatch({ type: 'LOGOUT' });
  };

  return { logout };
}
