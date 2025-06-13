"use client"

import { Navigate } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"

const ProtectedRouteFisioterapeuta = ({ children }) => {
  const { user, role, loading, isAuthenticated } = useAuth()

  // Mostrar indicador de carregamento enquanto verifica autenticação
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  // Verificar se o usuário está autenticado
  if (!isAuthenticated || !user) {
    console.log("Usuário não autenticado, redirecionando para login-fisioterapeuta")
    return <Navigate to="/login-fisioterapeuta" replace />
  }

  // Verificar se o usuário tem o papel de fisioterapeuta
  if (role !== "fisioterapeuta") {
    console.log("Usuário não é fisioterapeuta, redirecionando para página apropriada")
    return <Navigate to="/" replace />
  }

  // Se estiver autenticado e for fisioterapeuta, renderizar o conteúdo
  return children
}

export default ProtectedRouteFisioterapeuta
