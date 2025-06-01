"use client"

import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { Stethoscope, CheckCircle } from "lucide-react"
import { supabase } from "../lib/supabaseClient"




const CadastroFisioterapeuta = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    nome: "",
    email: "",
    crefito: "",
    cargo: "",
    telefone: "",
  })
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const navigate = useNavigate()

  const specialties = [
    "Fisioterapia Ortopédica",
    "Fisioterapia Neurológica",
    "Fisioterapia Respiratória",
    "Fisioterapia Esportiva",
    "Fisioterapia Pediátrica",
    "Fisioterapia Geriátrica",
    "Pilates Clínico",
    "Acupuntura",
  ]

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    if (formData.password !== formData.confirmPassword) {
      setError("As senhas não coincidem!")
      return
    }

    if (formData.password.length < 8) {
      setError("A senha deve ter pelo menos 8 caracteres.")
      return
    }

    setIsLoading(true)

    try {
      // 1. Cadastra no auth
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            username: formData.username
          }
        }
      })


      if (signUpError) throw signUpError

      // 2. Insere dados na tabela `fisioterapeutas`
      const { error: insertError } = await supabase.from("fisioterapeutas").insert({
        id: signUpData.user.id,
        nome_completo: formData.nome,
        crefito: formData.crefito,
        especialidade: formData.cargo,
        telefone: formData.telefone
      })

      if (insertError) throw insertError

      setSuccess("Cadastro realizado com sucesso! Verifique seu e-mail.")
      setTimeout(() => navigate("/login-fisioterapeuta"), 2000)
    } catch (err) {
      console.error(err)
      setError("Erro ao cadastrar: " + err.message)
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
            <h1 className="text-3xl font-bold text-blue-700">Cadastro Fisioterapeuta</h1>
          </div>

          {error && <p className="mb-4 text-red-500">{error}</p>}
          {success && (
            <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md flex items-center">
              <CheckCircle className="h-5 w-5 mr-2" />
              <p>{success}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="nome" className="block mb-2 font-semibold">
                Username
              </label>
              <input
                id="username"
                type="text"
                name="username"
                placeholder="Digite seu username"
                value={formData.username}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
              <label htmlFor="nome" className="block mb-2 font-semibold">
                Nome Completo
              </label>
              <input
                id="nome"
                type="text"
                name="nome"
                placeholder="Digite seu nome completo"
                value={formData.nome}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="block mb-2 font-semibold">
                Email
              </label>
              <input
                id="email"
                type="email"
                name="email"
                placeholder="Digite seu email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>

            <div>
              <label htmlFor="crefito" className="block mb-2 font-semibold">
                CREFITO
              </label>
              <input
                id="crefito"
                type="text"
                name="crefito"
                placeholder="Digite seu CREFITO"
                value={formData.crefito}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>

            <div>
              <label htmlFor="cargo" className="block mb-2 font-semibold">
                Especialidade
              </label>
              <select
                id="cargo"
                name="cargo"
                value={formData.cargo}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              >
                <option value="">Selecione uma especialidade</option>
                {specialties.map((specialty) => (
                  <option key={specialty} value={specialty}>
                    {specialty}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="telefone" className="block mb-2 font-semibold">
                Telefone
              </label>
              <input
                id="telefone"
                type="text"
                name="telefone"
                placeholder="Digite seu telefone"
                value={formData.telefone}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block mb-2 font-semibold">
                Senha
              </label>
              <input
                id="password"
                type="password"
                name="password"
                placeholder="Digite sua senha"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block mb-2 font-semibold">
                Confirmar Senha
              </label>
              <input
                id="confirmPassword"
                type="password"
                name="confirmPassword"
                placeholder="Confirme sua senha"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full px-4 py-2 text-white transition bg-blue-600 rounded hover:bg-blue-700 disabled:bg-blue-300"
              disabled={isLoading}
            >
              {isLoading ? "Processando..." : "Cadastrar"}
            </button>
          </form>

          <p className="mt-8 text-center text-gray-600">
            Já tem uma conta?{" "}
            <Link to="/login-fisioterapeuta" className="text-blue-600 hover:text-blue-800">
              Faça login
            </Link>
          </p>
        </div>
      </div>

      <div className="hidden w-full md:block md:w-1/2 bg-cover bg-center bg-[url('/placeholder-ehz8f.png')]"></div>
    </div>
  )
}

export default CadastroFisioterapeuta
