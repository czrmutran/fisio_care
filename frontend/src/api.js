import axios from "axios"

// Create axios instance with base URL
const API_URL = "http://127.0.0.1:8000/api"

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

// Add a request interceptor to include JWT token in requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token")
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Add a response interceptor to handle token refresh or logout on 401
api.interceptors.response.use(
  (response) => {
    return response
  },
  async (error) => {
    // Handle 401 Unauthorized errors
    if (error.response && error.response.status === 401) {
      // Clear token and redirect to login
      localStorage.removeItem("token")
      window.location.href = "/login"
    }
    return Promise.reject(error)
  },
)

// Auth services
export const authService = {
  register: async (userData) => {
    try {
      const response = await api.post("/register/", userData)
      return response.data
    } catch (error) {
      throw handleApiError(error)
    }
  },

  login: async (credentials) => {
    try {
      const response = await api.post("/token/", credentials)
      // Store tokens in localStorage
      localStorage.setItem("token", response.data.access)
      localStorage.setItem("refreshToken", response.data.refresh)
      return response.data
    } catch (error) {
      throw handleApiError(error)
    }
  },

  logout: () => {
    localStorage.removeItem("token")
    localStorage.removeItem("refreshToken")
  },
}

// Helper function to handle API errors
function handleApiError(error) {
  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    const errorData = error.response.data

    // Format error message
    if (typeof errorData === "object") {
      const errorMessages = []
      for (const key in errorData) {
        if (Array.isArray(errorData[key])) {
          errorMessages.push(`${key}: ${errorData[key].join(", ")}`)
        } else {
          errorMessages.push(`${key}: ${errorData[key]}`)
        }
      }
      return new Error(errorMessages.join("\n"))
    }

    return new Error(errorData.message || "An error occurred")
  } else if (error.request) {
    // The request was made but no response was received
    return new Error("No response from server. Please check your connection.")
  } else {
    // Something happened in setting up the request that triggered an Error
    return new Error("Error setting up request: " + error.message)
  }
}

export default api
