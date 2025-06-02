import { Navigate } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"

const ProtectedRoutePaciente = ({ children }) => {
  const { isAuthenticated, role } = useAuth()

  if (!isAuthenticated) return <Navigate to="/login" replace />
  if (role !== "paciente") return <Navigate to="/login" replace />

  return children
}

export default ProtectedRoutePaciente
