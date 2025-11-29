import { Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import { tokenService } from "./services/tokenService";
import { ProtectedRoute } from "./pages/ProtectedRoute/ProtectedRoute";
import { MainLayout } from "./pages/MainLayout/MainLayout";
import { ErrorPage } from "./pages/ErrorPage/ErrorPage";
import { Login } from "./pages/Login/Login";

function App() {
  return (
    <Routes>
      <Route
        path="/login"
        element={
          tokenService.getAccessToken() ? (
            <Navigate to="/" replace />
          ) : (
            <Login />
          )
        }
      />
      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
        </Route>
      </Route>
      <Route
        path="/"
        element={
          tokenService.getAccessToken() ? (
            <Navigate to="/" replace />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
      <Route path="*" element={<ErrorPage />}></Route>
    </Routes>
  );
}

export default App;
