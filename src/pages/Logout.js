import { useContext, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import UserContext from '../UserContext';

export default function Logout() {
  const { unsetUser, setUser } = useContext(UserContext);

  useEffect(() => {
    // clear local storage and reset user state
    unsetUser();
    setUser({
      id: null,
      isAdmin: null
    });
  }, [unsetUser, setUser]);

  return <Navigate to="/login" />;
}