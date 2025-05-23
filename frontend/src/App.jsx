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

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Set Home as the default route */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/agendar-consulta" element={<AgendarConsulta />} />

          {/* Fisioterapeuta routes */}
          <Route path="/login-fisioterapeuta" element={<LoginFisioterapeuta />} />
          <Route path="/cadastro-fisioterapeuta" element={<CadastroFisioterapeuta />} />
          <Route path="/dashboard-fisioterapeuta" element={<DashboardFisioterapeuta />} />

          {/* Redirect unknown routes to home */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App
