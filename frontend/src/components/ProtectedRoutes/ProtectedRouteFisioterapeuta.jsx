import { Navigate } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"

const ProtectedRouteFisioterapeuta = ({ children }) => {
  const { isAuthenticated, role } = useAuth()

  if (!isAuthenticated) return <Navigate to="/login-fisioterapeuta" replace />
  if (role !== "fisioterapeuta") return <Navigate to="/login-fisioterapeuta" replace />

  return children
}

export default ProtectedRouteFisioterapeuta
