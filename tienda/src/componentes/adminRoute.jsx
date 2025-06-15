import { Navigate } from "react-router-dom";
const AdminRoute = ({ children }) => {
  const rol = localStorage.getItem("rol");

  if (!rol || rol !== "admin") {
    return <Navigate to="/login" />;
  }

  return children;
};

export default AdminRoute;