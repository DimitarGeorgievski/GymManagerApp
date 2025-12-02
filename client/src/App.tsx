import { Routes, Route, Navigate } from "react-router-dom";
import { tokenService } from "./services/tokenService";
import { ProtectedRoute } from "./pages/ProtectedRoute/ProtectedRoute";
import { MainLayout } from "./pages/MainLayout/MainLayout";
import { Login } from "./pages/Login/Login";
import { Register } from "./pages/Register/Register";
import { HomePage } from "./pages/HomePage/HomePage";
import { ErrorPage } from "./pages/ErrorPage/ErrorPage";

function App() {
  return (
    <Routes>
      <Route
        path="/login"
        element={
          tokenService.getAccessToken() ? <Navigate to="/" /> : <Login />
        }
      />
      <Route
        path="/register"
        element={
          tokenService.getAccessToken() ? <Navigate to="/" /> : <Register />
        }
      />
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
        </Route>
      </Route>
      <Route path="*" element={<ErrorPage />} />
    </Routes>
  );
}

export default App;
