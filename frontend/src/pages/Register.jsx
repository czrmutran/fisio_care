"use client"

import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import RegisterOne from "../components/registerStep/RegisterOne"
import RegisterTwo from "../components/registerStep/RegisterTwo"
import RegisterThree from "../components/registerStep/RegisterThree"
import { authService } from "../api"

const Register = () => {
  const [step, setStep] = useState(0)

  // Estados para os campos do formulário
  const [username, setUsername] = useState("")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [cpf, setCpf] = useState("")
  const [rg, setRg] = useState("")
  const [phone, setPhone] = useState("")
  const [address, setAddress] = useState("")
  const [birthDate, setBirthDate] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const navigate = useNavigate()

  const nextStep = () => setStep((prev) => Math.min(prev + 1, 2))
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 0))

  const validateCurrentStep = () => {
    setError("")

    if (step === 0) {
      if (!username || !name || !email) {
        setError("Todos os campos são obrigatórios.")
        return false
      }
      // Basic email validation
      if (!/\S+@\S+\.\S+/.test(email)) {
        setError("Email inválido.")
        return false
      }
    } else if (step === 1) {
      if (!cpf || !rg || !phone || !address) {
        setError("Todos os campos são obrigatórios.")
        return false
      }
      // Basic CPF validation (11 digits)
      if (cpf.length !== 11 || !/^\d+$/.test(cpf)) {
        setError("CPF inválido. Deve conter 11 dígitos numéricos.")
        return false
      }
    } else if (step === 2) {
      if (!birthDate || !password || !confirmPassword) {
        setError("Todos os campos são obrigatórios.")
        return false
      }
      if (password !== confirmPassword) {
        setError("As senhas não coincidem!")
        return false
      }
      if (password.length < 8) {
        setError("A senha deve ter pelo menos 8 caracteres.")
        return false
      }
    }

    return true
  }

  const handleStepSubmit = (e) => {
    e.preventDefault()

    if (validateCurrentStep()) {
      if (step < 2) {
        nextStep()
      } else {
        handleSubmit()
      }
    }
  }

  const handleSubmit = async () => {
    setError("")
    setSuccess("")
    setIsLoading(true)

    const formattedDate = new Date(birthDate).toISOString().split("T")[0]

    const payload = {
      username,
      password,
      name,
      cpf,
      rg,
      phone,
      email,
      address,
      birth_date: formattedDate,
    }

    try {
      await authService.register(payload)
      setSuccess("Usuário registrado com sucesso! Redirecionando para o login...")
      setTimeout(() => {
        navigate("/login")
      }, 2000)
    } catch (err) {
      setError(err.message || "Erro ao registrar usuário. Verifique os dados e tente novamente.")
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

          <h1 className="mb-2 text-3xl font-bold text-blue-700">Bem-vindo(a) a Fisio Care</h1>
          <p className="mb-6 text-lg text-gray-600">Faça seu cadastro para continuar</p>

          {error && <p className="mb-4 text-red-500">{error}</p>}
          {success && <p className="mb-4 text-green-500">{success}</p>}

          <form onSubmit={handleStepSubmit}>
            {step === 0 && (
              <RegisterOne
                username={username}
                setUsername={setUsername}
                name={name}
                setName={setName}
                email={email}
                setEmail={setEmail}
              />
            )}
            {step === 1 && (
              <RegisterTwo
                cpf={cpf}
                setCpf={setCpf}
                rg={rg}
                setRg={setRg}
                phone={phone}
                setPhone={setPhone}
                address={address}
                setAddress={setAddress}
              />
            )}
            {step === 2 && (
              <RegisterThree
                birthDate={birthDate}
                setBirthDate={setBirthDate}
                password={password}
                setPassword={setPassword}
                confirmPassword={confirmPassword}
                setConfirmPassword={setConfirmPassword}
              />
            )}

            <div className="flex items-center justify-between mt-6">
              {step > 0 && (
                <button
                  type="button"
                  onClick={prevStep}
                  className="px-4 py-2 text-blue-500 transition border border-blue-500 rounded hover:bg-blue-500 hover:text-white"
                  disabled={isLoading}
                >
                  Voltar
                </button>
              )}
              {step < 2 && (
                <button
                  type="submit"
                  className="px-4 py-2 text-blue-500 transition border border-blue-500 rounded hover:bg-blue-500 hover:text-white"
                  disabled={isLoading}
                >
                  Avançar
                </button>
              )}
              {step === 2 && (
                <button
                  type="submit"
                  className="px-4 py-2 text-white transition bg-blue-600 rounded hover:bg-blue-700 disabled:bg-blue-300"
                  disabled={isLoading}
                >
                  {isLoading ? "Processando..." : "Finalizar"}
                </button>
              )}
            </div>
          </form>

          <p className="mt-8 text-center text-gray-600">
            Já tem uma conta?{" "}
            <Link to="/login" className="text-blue-600 hover:text-blue-800">
              Faça login
            </Link>
          </p>
        </div>
      </div>

      <div className="hidden w-full md:block md:w-1/2 bg-cover bg-top bg-[url('/loginImg.jpg')]"></div>
    </div>
  )
}

export default Register
