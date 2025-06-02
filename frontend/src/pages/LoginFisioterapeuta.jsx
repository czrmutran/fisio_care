"use client"

import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { Stethoscope } from "lucide-react"
import { loginWithUsername } from "../api/loginService"
import { useAuth } from "../context/AuthContext"

const LoginFisioterapeuta = () => {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const navigate = useNavigate()
  const { login } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      await loginWithUsername({ username, password })

      const mockFisioterapeuta = {
        username,
        foto: "/physiotherapist-profile.png"
      }

      login(mockFisioterapeuta, "fisioterapeuta")
      navigate("/dashboard-fisioterapeuta")
    } catch (err) {
      console.error("Erro ao logar:", err)
      setError(err.message || "Credenciais inválidas. Tente novamente.")
    } finally {
      setIsLoading(false)
    }
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
