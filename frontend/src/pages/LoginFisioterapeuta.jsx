"use client"

import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { ArrowLeft, Stethoscope } from "lucide-react"
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
      console.log("Tentando login com:", email) // Log para debug

      // Verificar se são as credenciais de demonstração
      if (email === "fisio@demo.com" && password === "demo123") {
        console.log("Usando credenciais de demonstração") // Log para debug

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

        console.log("Redirecionando para dashboard-fisioterapeuta") // Log para debug

        // Adicionando um pequeno atraso para garantir que o login seja processado
        setTimeout(() => {
          navigate("/dashboard-fisioterapeuta")
        }, 500)
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

      console.log("Login normal bem-sucedido, redirecionando") // Log para debug

      // Adicionando um pequeno atraso para garantir que o login seja processado
      setTimeout(() => {
        navigate("/dashboard-fisioterapeuta")
      }, 500)
    } catch (err) {
      console.error("Erro de login:", err) // Log para debug
      setError(err.message || "Erro ao fazer login.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <Link to="/" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-8 transition-colors">
            <ArrowLeft className="h-4 w-4 mr-2" />
            <span>Voltar para a página inicial</span>
          </Link>

          <div className="flex items-center mb-8">
            <div className="bg-blue-100 p-3 rounded-full">
              <Stethoscope className="h-8 w-8 text-blue-600" />
            </div>
            <h1 className="ml-4 text-3xl font-bold text-gray-900">Portal Fisioterapeuta</h1>
          </div>

          <p className="text-gray-600 mb-8">Acesso exclusivo para profissionais</p>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded">
              <p>{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="Digite seu e-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                required
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Senha
                </label>
                <Link to="/esqueci-senha" className="text-sm text-blue-600 hover:text-blue-800">
                  Esqueceu sua senha?
                </Link>
              </div>
              <input
                id="password"
                type="password"
                placeholder="Digite sua senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Processando...
                </>
              ) : (
                "Entrar"
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Não tem uma conta de fisioterapeuta?{" "}
              <Link to="/cadastro-fisioterapeuta" className="text-blue-600 hover:text-blue-800 font-medium">
                Cadastre-se
              </Link>
            </p>
          </div>
        </div>
      </div>

      <div className="hidden lg:block lg:w-1/2 bg-cover bg-center relative overflow-hidden">
        <div className="absolute inset-0 bg-blue-600 opacity-90"></div>
        <div className="absolute inset-0 flex flex-col justify-center px-12">
          <h2 className="text-4xl font-bold text-white mb-6">Portal do Profissional</h2>
          <p className="text-xl text-blue-100 mb-8">
            Gerencie sua agenda, pacientes e tratamentos em uma única plataforma.
          </p>
          <div className="bg-white/10 p-6 rounded-xl backdrop-blur-sm">
            <p className="text-white text-lg font-medium mb-4">Recursos exclusivos para fisioterapeutas:</p>
            <ul className="space-y-3">
              <li className="flex items-center text-blue-100">
                <div className="w-2 h-2 rounded-full bg-blue-200 mr-3"></div>
                Agenda inteligente com notificações
              </li>
              <li className="flex items-center text-blue-100">
                <div className="w-2 h-2 rounded-full bg-blue-200 mr-3"></div>
                Prontuário eletrônico completo
              </li>
              <li className="flex items-center text-blue-100">
                <div className="w-2 h-2 rounded-full bg-blue-200 mr-3"></div>
                Relatórios de evolução dos pacientes
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginFisioterapeuta
