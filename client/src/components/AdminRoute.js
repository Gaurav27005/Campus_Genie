import React from 'react';
import { Navigate } from 'react-router-dom';

const AdminRoute = ({ children }) => {
  const adminToken = localStorage.getItem('adminToken');
  const isAdmin = localStorage.getItem('isAdmin');
  
  if (!adminToken || isAdmin !== 'true') {
    return <Navigate to="/admin/login" />;
  }
  
  return children;
};

export default AdminRoute;