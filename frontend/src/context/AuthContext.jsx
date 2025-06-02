"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { supabase } from "../lib/supabaseClient"

// ✅ Define o contexto explicitamente com valor inicial undefined
const AuthContext = createContext(undefined)

// ✅ Função nomeada (evita problemas com Fast Refresh)
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [role, setRole] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem("token")
    const storedUser = localStorage.getItem("user")
    const storedRole = localStorage.getItem("role")

    if (token && storedUser && storedRole) {
      setUser(JSON.parse(storedUser))
      setRole(storedRole)
    }

    setLoading(false)
  }, [])

  const login = async (userData, userRole) => {
    try {
      const table = userRole === "cliente" ? "clientes" : "fisioterapeutas"

      const { data: profileData, error } = await supabase
        .from(table)
        .select("*")
        .eq("id", userData.id)
        .single()

      if (error) {
        console.error(`Erro ao buscar dados do ${userRole}:`, error)
        return
      }

      const finalUser = { ...userData, ...profileData }

      localStorage.setItem("user", JSON.stringify(finalUser))
      localStorage.setItem("role", userRole)
      localStorage.setItem("token", "mock-token")

      setUser(finalUser)
      setRole(userRole)
    } catch (err) {
      console.error("Erro ao fazer login:", err)
    }
  }

  const logout = () => {
    localStorage.clear()
    setUser(null)
    setRole(null)
  }

  return (
    <AuthContext.Provider value={{ user, role, login, logout, loading, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  )
}

// ✅ Hook nomeado fora do componente
export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth deve ser usado dentro de <AuthProvider>")
  }
  return context
}
