"use client"

import { useState, useEffect, createContext, useContext } from "react"
import { supabase } from "../lib/supabaseClient"

// Contexto de autenticação
const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [role, setRole] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    // Verificar sessão atual ao carregar
    const checkSession = async () => {
      try {
        // First check localStorage for demo users
        const storedUser = localStorage.getItem("user")
        const storedRole = localStorage.getItem("role")

        if (storedUser && storedRole) {
          setUser(JSON.parse(storedUser))
          setRole(storedRole)
          setIsAuthenticated(true)
          setLoading(false)
          return
        }

        // Then check Supabase session
        const {
          data: { session },
        } = await supabase.auth.getSession()

        if (session) {
          // Buscar dados do usuário baseado no ID
          const { data: userData } = await supabase.from("users_view").select("role").eq("id", session.user.id).single()

          setUser(session.user)
          setRole(userData?.role || null)
          setIsAuthenticated(true)
        } else {
          setUser(null)
          setRole(null)
          setIsAuthenticated(false)
        }
      } catch (error) {
        console.error("Erro ao verificar sessão:", error)
        setUser(null)
        setRole(null)
        setIsAuthenticated(false)
      } finally {
        setLoading(false)
      }
    }

    checkSession()

    // Configurar listener para mudanças de autenticação
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        try {
          const { data } = await supabase.from("users_view").select("role").eq("id", session.user.id).single()

          setUser(session.user)
          setRole(data?.role || null)
          setIsAuthenticated(true)
        } catch (error) {
          console.error("Erro ao buscar role:", error)
          setUser(session.user)
          setRole(null)
          setIsAuthenticated(true)
        }
      } else {
        // Check localStorage for demo users
        const storedUser = localStorage.getItem("user")
        const storedRole = localStorage.getItem("role")

        if (storedUser && storedRole) {
          setUser(JSON.parse(storedUser))
          setRole(storedRole)
          setIsAuthenticated(true)
        } else {
          setUser(null)
          setRole(null)
          setIsAuthenticated(false)
        }
      }

      setLoading(false)
    })

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [])

  const login = (userData, userRole) => {
    console.log("Login executado com:", userData, userRole) // Log para debug
    setUser(userData)
    setRole(userRole)
    setIsAuthenticated(true)
    localStorage.setItem("user", JSON.stringify(userData))
    localStorage.setItem("role", userRole)
  }

  const logout = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setRole(null)
    setIsAuthenticated(false)
    localStorage.removeItem("user")
    localStorage.removeItem("role")
  }

  return (
    <AuthContext.Provider value={{ user, role, loading, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider")
  }
  return context
}
