"use client"

import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { supabase } from "../lib/supabaseClient"

const Login = () => {
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
      // Faz o login no Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (authError) throw new Error("Email ou senha incorretos.")

      // Busca o perfil do cliente na tabela `clientes` usando o ID do auth
      const { data: userFound, error: profileError } = await supabase
        .from("clientes")
        .select("*")
        .eq("id", authData.user.id)
        .single()

      if (profileError || !userFound) throw new Error("Perfil não encontrado.")

      // Realiza o login salvando dados no localStorage
      login({
        id: userFound.id,
        email: authData.user.email,
        nome_completo: userFound.nome_completo,
        telefone: userFound.telefone,
        cpf: userFound.cpf,
        rg: userFound.rg,
      }, "paciente")

      navigate("/dashboard")
    } catch (err) {
      setError(err.message || "Erro ao fazer login.")
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

          <h1 className="mb-2 text-3xl font-bold text-blue-700">Bem-vindo(a) de volta</h1>
          <p className="mb-6 text-lg text-gray-600">Faça login para continuar</p>

          {error && <p className="mb-4 text-red-500">{error}</p>}

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="email" className="block mb-2 font-semibold">
                Email
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
            Não tem uma conta?{" "}
            <Link to="/register" className="text-blue-600 hover:text-blue-800">
              Cadastre-se
            </Link>
          </p>
        </div>
      </div>

      <div className="hidden w-full md:block md:w-1/2 bg-cover bg-top bg-[url('/loginImg.jpg')]"></div>
    </div>
  )
}

export default Login
