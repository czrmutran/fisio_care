"use client"

import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { ArrowLeft, CheckCircle, AlertCircle } from "lucide-react"
import RegisterOne from "../components/registerStep/RegisterOne"
import RegisterTwo from "../components/registerStep/RegisterTwo"
import RegisterThree from "../components/registerStep/RegisterThree"
import { supabase } from "../lib/supabaseClient"

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
      if (cpf.length !== 11) {
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

    try {
      // 1. Cria o usuário no Supabase Auth
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { username },
        },
      })

      if (signUpError) throw signUpError

      // ⚠️ Aguarda o ID do usuário
      const userId = signUpData?.user?.id
      if (!userId) {
        throw new Error("ID do usuário não encontrado após cadastro.")
      }

      // 2. Insere os dados na tabela clientes
      const { error: insertError } = await supabase.from("clientes").insert({
        id: userId,
        nome_completo: name,
        cpf,
        rg,
        telefone: phone,
        endereco: address,
        data_nascimento: formattedDate,
      })

      if (insertError) throw insertError

      // 3. Redireciona
      setSuccess("Cadastro realizado com sucesso! Redirecionando para o login...")
      setTimeout(() => navigate("/login"), 2000)
    } catch (err) {
      console.error(err)

      // Mensagens de erro mais amigáveis
      if (err.message.includes("already registered")) {
        setError("Este email já está cadastrado. Tente fazer login ou recuperar sua senha.")
      } else if (err.message.includes("duplicate key")) {
        setError("CPF ou RG já cadastrado no sistema.")
      } else {
        setError("Erro no cadastro: " + err.message)
      }
    } finally {
      setIsLoading(false)
    }
  }

  // Calcular progresso
  const progress = ((step + 1) / 3) * 100

  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="flex flex-col w-full md:w-1/2 p-8">
        <div className="max-w-md mx-auto w-full">
          <div className="mb-6">
            <Link to="/" className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors">
              <ArrowLeft className="h-4 w-4 mr-2" />
              <span>Voltar para a página inicial</span>
            </Link>
          </div>

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Crie sua conta</h1>
            <p className="text-gray-600">
              Junte-se à Fisio Care e comece sua jornada para uma melhor qualidade de vida.
            </p>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-gray-200 rounded-full h-2.5 mb-6">
            <div
              className="bg-blue-600 h-2.5 rounded-full transition-all duration-300 ease-in-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>

          {/* Error and success messages */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-md flex items-center">
              <AlertCircle className="h-5 w-5 text-red-500 mr-3" />
              <p className="text-red-700">{error}</p>
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 rounded-md flex items-center">
              <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
              <p className="text-green-700">{success}</p>
            </div>
          )}

          <form onSubmit={handleStepSubmit} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
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

            <div className="flex items-center justify-between mt-8">
              {step > 0 ? (
                <button
                  type="button"
                  onClick={prevStep}
                  className="px-6 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  disabled={isLoading}
                >
                  Voltar
                </button>
              ) : (
                <div></div>
              )}

              <button
                type="submit"
                className={`px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300 flex items-center ${isLoading ? "cursor-not-allowed" : ""}`}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                ) : step < 2 ? (
                  "Próximo"
                ) : (
                  "Finalizar Cadastro"
                )}
              </button>
            </div>
          </form>

          <p className="mt-6 text-center text-gray-600">
            Já tem uma conta?{" "}
            <Link to="/login" className="text-blue-600 hover:text-blue-800 font-medium">
              Faça login
            </Link>
          </p>
        </div>
      </div>

      <div className="hidden md:block md:w-1/2 bg-cover bg-center bg-[url('/loginImg.jpg')]">
        <div className="h-full w-full bg-blue-900 bg-opacity-20 backdrop-filter backdrop-blur-sm flex items-center justify-center">
          <div className="max-w-md p-8 text-white">
            <h2 className="text-3xl font-bold mb-4">Bem-vindo à Fisio Care</h2>
            <p className="text-lg mb-6">
              Sua plataforma completa para agendamento e acompanhamento de tratamentos fisioterapêuticos.
            </p>
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-white bg-opacity-20 flex items-center justify-center mr-3">
                  <CheckCircle className="h-5 w-5" />
                </div>
                <p>Agendamento online rápido e fácil</p>
              </div>
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-white bg-opacity-20 flex items-center justify-center mr-3">
                  <CheckCircle className="h-5 w-5" />
                </div>
                <p>Acompanhamento personalizado do seu tratamento</p>
              </div>
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-white bg-opacity-20 flex items-center justify-center mr-3">
                  <CheckCircle className="h-5 w-5" />
                </div>
                <p>Profissionais qualificados e especializados</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register
