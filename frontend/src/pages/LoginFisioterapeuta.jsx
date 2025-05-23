"use client"

import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { Stethoscope } from "lucide-react"

// Mock credentials for testing
const MOCK_CREDENTIALS = {
  username: "fisio",
  password: "password123",
}

// Mock fisioterapeuta data
const MOCK_FISIOTERAPEUTA = {
  id: 1,
  nome: "Dr. Ana Silva",
  email: "ana.silva@fisiocare.com",
  crefito: "12345-F",
  cargo: "Fisioterapia Ortopédica",
  telefone: "(11) 98765-4321",
  foto: "/physiotherapist-profile.png",
  is_active: true,
  created_at: "2023-01-15T10:30:00Z",
}

const LoginFisioterapeuta = () => {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    // Simulate API delay
    setTimeout(() => {
      // Check mock credentials
      if (username === MOCK_CREDENTIALS.username && password === MOCK_CREDENTIALS.password) {
        // Store mock data in localStorage
        localStorage.setItem("fisioterapeutaToken", "mock-jwt-token-fisioterapeuta")
        localStorage.setItem("fisioterapeutaData", JSON.stringify(MOCK_FISIOTERAPEUTA))
        navigate("/dashboard-fisioterapeuta")
      } else {
        setError("Credenciais inválidas. Tente novamente.")
      }
      setIsLoading(false)
    }, 1000)
  }

  return (
    <div className="flex h-screen">
      <div className="flex flex-col items-center justify-center w-full p-8 bg-white md:w-1/2">
        <div className="w-full max-w-md">
          <div className="mb-6">
            <Link to="/" className="text-blue-600 hover:text-blue-800 flex items-center">
              ← Voltar para a página inicial
            </Link>
          </div>

          <div className="flex items-center justify-center mb-6">
            <Stethoscope className="h-12 w-12 text-blue-600 mr-3" />
            <h1 className="text-3xl font-bold text-blue-700">Portal Fisioterapeuta</h1>
          </div>

          <p className="mb-6 text-lg text-gray-600 text-center">Acesso exclusivo para profissionais</p>

          {error && <p className="mb-4 text-red-500">{error}</p>}

          

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="username" className="block mb-2 font-semibold">
                Username
              </label>
              <input
                id="username"
                type="text"
                placeholder="Digite seu username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>

            <div className="mb-6">
              <label htmlFor="password" className="block mb-2 font-semibold">
                Senha
              </label>
              <input
                id="password"
                type="password"
                placeholder="Digite sua senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full px-4 py-2 text-white transition bg-blue-600 rounded hover:bg-blue-700 disabled:bg-blue-300"
              disabled={isLoading}
            >
              {isLoading ? "Processando..." : "Entrar"}
            </button>
          </form>

          <p className="mt-8 text-center text-gray-600">
            Não tem uma conta de fisioterapeuta?{" "}
            <Link to="/cadastro-fisioterapeuta" className="text-blue-600 hover:text-blue-800">
              Cadastre-se
            </Link>
          </p>
        </div>
      </div>

      <div className="hidden w-full md:block md:w-1/2 bg-cover bg-center bg-[url('/medical-professional-working.png')]"></div>
    </div>
  )
}

export default LoginFisioterapeuta
