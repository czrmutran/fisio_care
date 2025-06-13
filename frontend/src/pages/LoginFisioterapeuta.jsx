"use client"

import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { Stethoscope, Info } from "lucide-react"
import { supabase } from "../lib/supabaseClient"
import { useAuth } from "../context/AuthContext"

const LoginFisioterapeuta = () => {
  const [email, setEmail] = useState("")
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
      // Verificar se são as credenciais de demonstração
      if (email === "fisio@demo.com" && password === "demo123") {
        // Login de demonstração
        login(
          {
            id: "demo-fisio-id",
            email: "fisio@demo.com",
            nome_completo: "Fisioterapeuta Demonstração",
            especialidade: "Fisioterapia Ortopédica",
            crefito: "12/34567-AB",
            telefone: "(11) 98765-4321",
          },
          "fisioterapeuta",
        )
        navigate("/dashboard-fisioterapeuta")
        return
      }

      // Login normal no Supabase Auth
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (authError || !data?.user) {
        throw new Error("Email ou senha inválidos.")
      }

      const userId = data.user.id

      // Buscar o perfil do fisioterapeuta
      const { data: perfil, error: perfilError } = await supabase
        .from("fisioterapeutas")
        .select("*")
        .eq("id", userId)
        .single()

      if (perfilError || !perfil) {
        throw new Error("Perfil do fisioterapeuta não encontrado.")
      }

      // Salvar dados no contexto
      login(perfil, "fisioterapeuta")

      navigate("/dashboard-fisioterapeuta")
    } catch (err) {
      setError(err.message || "Erro ao fazer login.")
    } finally {
      setIsLoading(false)
    }
  }

  // Função para preencher as credenciais de demonstração
  const fillDemoCredentials = () => {
    setEmail("fisio@demo.com")
    setPassword("demo123")
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

          {/* Bloco de informações de demonstração */}
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-start">
            <Info className="h-5 w-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm text-blue-800 font-medium">Credenciais de demonstração</p>
              <p className="text-sm text-blue-600 mt-1">
                Email: <span className="font-mono">fisio@demo.com</span>
              </p>
              <p className="text-sm text-blue-600">
                Senha: <span className="font-mono">demo123</span>
              </p>
              <button
                type="button"
                onClick={fillDemoCredentials}
                className="mt-2 text-xs text-blue-700 hover:text-blue-900 underline"
              >
                Preencher automaticamente
              </button>
            </div>
          </div>

          {error && <p className="mb-4 text-red-500">{error}</p>}

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="email" className="block mb-2 font-semibold">
                E-mail
              </label>
              <input
                id="email"
                type="email"
                placeholder="Digite seu e-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
