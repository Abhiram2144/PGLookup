import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "../contexts/UserContext";

const Protected = ({ children, role }) => {
  const { user } = useContext(UserContext);

  // If not logged in
  if (!user) return <Navigate to="/login" />;

  // If role is specified and user is not that role
  if (role && user.role !== role) return <Navigate to="/" />;

  return children;
};

export default Protected;
