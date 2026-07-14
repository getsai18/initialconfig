import { Navigate, Route, Routes } from "react-router-dom";
import { Login } from "@/modules/public/auth/pages/Login";

export function PublicRouter({ onLogin, usuarios = [], areas = [], setUsuarios }) {

  return (
    <Routes>
      {/* Fallbacks de navegación */}
      <Route path="/" element={<Navigate to={"/login"} />} />
      <Route path="/*" element={<Navigate to={"/login"} />} />

      {/* Rutas de navegación */}
      <Route path="/login" element={<Login onLogin={onLogin} usuarios={usuarios} areas={areas} setUsuarios={setUsuarios} />} />
    </Routes>
  )
}
