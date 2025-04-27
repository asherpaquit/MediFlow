import { Navigate } from 'react-router-dom';

const AdminProtectedRoute = ({ children }) => {
  const isAdminAuthenticated = sessionStorage.getItem('isAdminAuthenticated') === 'true';  // for admins
  
  if (!isAdminAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }
  
  return children;
};

export default AdminProtectedRoute;
