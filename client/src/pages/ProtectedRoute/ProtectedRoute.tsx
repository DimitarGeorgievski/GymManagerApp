import { Navigate, Outlet } from "react-router-dom";
import { tokenService } from "../../services/tokenService";

export function ProtectedRoute() {
  const token = tokenService.getAccessToken();
  return token ? <Outlet /> : <Navigate to="/login" replace />;
}