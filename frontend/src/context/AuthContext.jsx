"use client"

import { createContext, useState, useContext, useEffect } from "react"

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [role, setRole] = useState(null) // <- Adicionado para diferenciar cliente/fisioterapeuta
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

  const login = (userData, userRole) => {
    localStorage.setItem("user", JSON.stringify(userData))
    localStorage.setItem("role", userRole)
    localStorage.setItem("token", "mock-token") // Substitua se for token real
    setUser(userData)
    setRole(userRole)
  }

  const logout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("refreshToken")
    localStorage.removeItem("user")
    localStorage.removeItem("role")
    setUser(null)
    setRole(null)
  }

  return (
    <AuthContext.Provider value={{ user, role, login, logout, loading, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)