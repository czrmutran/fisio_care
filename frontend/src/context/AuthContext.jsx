"use client"

import { createContext, useState, useContext, useEffect } from "react"
import api from "../api"

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in on component mount
    const token = localStorage.getItem("token")
    if (token) {
      // Fetch user data if token exists
      fetchUserData()
    } else {
      setLoading(false)
    }
  }, [])

  const fetchUserData = async () => {
    try {
      const response = await api.get("/user/")
      setUser(response.data)
    } catch (error) {
      console.error("Failed to fetch user data:", error)
      // If token is invalid, clear it
      localStorage.removeItem("token")
      localStorage.removeItem("refreshToken")
    } finally {
      setLoading(false)
    }
  }

  const login = async (credentials) => {
    const response = await api.post("/token/", credentials)
    localStorage.setItem("token", response.data.access)
    localStorage.setItem("refreshToken", response.data.refresh)
    await fetchUserData()
    return response.data
  }

  const logout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("refreshToken")
    setUser(null)
  }

  const register = async (userData) => {
    return await api.post("/register/", userData)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, register, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
