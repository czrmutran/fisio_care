import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { AuthProvider } from "./context/AuthContext"

import Home from "./pages/Home"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Dashboard from "./pages/Dashboard"
import AgendarConsulta from "./pages/AgendarConsulta"
import LoginFisioterapeuta from "./pages/LoginFisioterapeuta"
import CadastroFisioterapeuta from "./pages/CadastroFisioterapeuta"
import DashboardFisioterapeuta from "./pages/DashboardFisioterapeuta"

import ProtectedRoutePaciente from "./components/ProtectedRoutes/ProtectedRoutePaciente"
import ProtectedRouteFisioterapeuta from "./components/ProtectedRoutes/ProtectedRouteFisioterapeuta"

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Página Inicial */}
          <Route path="/" element={<Home />} />

          {/* Login e Cadastro */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login-fisioterapeuta" element={<LoginFisioterapeuta />} />
          <Route path="/cadastro-fisioterapeuta" element={<CadastroFisioterapeuta />} />

          {/* Rotas protegidas para pacientes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoutePaciente>
                <Dashboard />
              </ProtectedRoutePaciente>
            }
          />
          <Route
            path="/agendar-consulta"
            element={
              <ProtectedRoutePaciente>
                <AgendarConsulta />
              </ProtectedRoutePaciente>
            }
          />

          {/* Rota protegida para fisioterapeutas */}
          <Route
            path="/dashboard-fisioterapeuta"
            element={
              <ProtectedRouteFisioterapeuta>
                <DashboardFisioterapeuta />
              </ProtectedRouteFisioterapeuta>
            }
          />

          {/* Redireciona rotas inválidas */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App
