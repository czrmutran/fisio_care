"use client"

import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { supabase } from "../lib/supabaseClient"
import {
  Clock,
  User,
  Mail,
  Phone,
  FileText,
  CheckCircle,
  AlertCircle,
  ChevronRight,
  Stethoscope,
  CalendarDays,
  X,
} from "lucide-react"

const AgendarConsulta = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [fisioterapeutas, setFisioterapeutas] = useState([])
  const [availableTimes, setAvailableTimes] = useState([])
  const [isCheckingAvailability, setIsCheckingAvailability] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [selectedFisioterapeuta, setSelectedFisioterapeuta] = useState(null)

  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    service: "",
    fisioterapeuta_id: "",
    date: "",
    time: "",
    symptoms: "",
  })

  const services = [
    "Fisioterapia Ortopédica",
    "Fisioterapia Neurológica",
    "Fisioterapia Respiratória",
    "Fisioterapia Esportiva",
    "Fisioterapia Geriátrica",
    "Fisioterapia Pediátrica",
    "Pilates Clínico",
    "Acupuntura",
  ]

  const timeSlots = ["08:00", "09:00", "10:00", "11:00", "13:00", "14:00", "15:00", "16:00", "17:00"]

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        full_name: user.nome_completo || "",
        email: user.email || "",
        phone: user.telefone || "",
      }))
    }
  }, [user])

  useEffect(() => {
    const fetchFisioterapeutas = async () => {
      if (!formData.service) return

      try {
        const { data, error } = await supabase
          .from("fisioterapeutas")
          .select("id, nome_completo, especialidade, crefito")
          .eq("especialidade", formData.service)

        if (error) throw error
        setFisioterapeutas(data || [])
      } catch (err) {
        console.error("Erro ao buscar fisioterapeutas:", err)
        setError("Não foi possível carregar os fisioterapeutas disponíveis.")
      }
    }

    fetchFisioterapeutas()
  }, [formData.service])

  // Efeito para buscar detalhes do fisioterapeuta selecionado
  useEffect(() => {
    const fetchFisioterapeutaDetails = async () => {
      if (!formData.fisioterapeuta_id) {
        setSelectedFisioterapeuta(null)
        return
      }

      try {
        const { data, error } = await supabase
          .from("fisioterapeutas")
          .select("*")
          .eq("id", formData.fisioterapeuta_id)
          .single()

        if (error) throw error
        setSelectedFisioterapeuta(data)
      } catch (err) {
        console.error("Erro ao buscar detalhes do fisioterapeuta:", err)
      }
    }

    fetchFisioterapeutaDetails()
  }, [formData.fisioterapeuta_id])

  // Função para verificar horários disponíveis
  const checkAvailability = async () => {
    if (!formData.fisioterapeuta_id || !formData.date) return

    setIsCheckingAvailability(true)
    setAvailableTimes([])

    try {
      // Buscar consultas existentes para o fisioterapeuta na data selecionada
      const { data: existingAppointments, error } = await supabase
        .from("consultas")
        .select("time")
        .eq("fisioterapeuta_id", formData.fisioterapeuta_id)
        .eq("date", formData.date)
        .neq("status", "cancelada")

      if (error) throw error

      // Horários ocupados
      const bookedTimes = existingAppointments.map((app) => app.time)

      // Filtrar horários disponíveis
      const available = timeSlots.filter((time) => !bookedTimes.includes(time))
      setAvailableTimes(available)
    } catch (err) {
      console.error("Erro ao verificar disponibilidade:", err)
      setError("Erro ao verificar horários disponíveis.")
    } finally {
      setIsCheckingAvailability(false)
    }
  }

  // Verificar disponibilidade quando a data ou fisioterapeuta mudar
  useEffect(() => {
    if (formData.fisioterapeuta_id && formData.date) {
      checkAvailability()
    } else {
      setAvailableTimes([])
    }
  }, [formData.fisioterapeuta_id, formData.date])

  // Função para formatar telefone
  const formatPhone = (value) => {
    const digits = value.replace(/\D/g, "")
    if (digits.length <= 2) return `(${digits}`
    if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`
  }

  const handleChange = (e) => {
    const { name, value } = e.target

    if (name === "phone") {
      const digits = value.replace(/\D/g, "")
      setFormData((prev) => ({
        ...prev,
        [name]: formatPhone(digits),
      }))
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    // Validações básicas
    if (
      !formData.full_name ||
      !formData.email ||
      !formData.phone ||
      !formData.service ||
      !formData.fisioterapeuta_id ||
      !formData.date ||
      !formData.time
    ) {
      setError("Por favor, preencha todos os campos obrigatórios.")
      return
    }

    // Mostrar modal de confirmação
    setShowConfirmation(true)
  }

  const confirmAppointment = async () => {
    setLoading(true)
    setError("")
    setSuccess("")

    try {
      if (!user?.id) {
        setError("Usuário não autenticado. Faça login novamente.")
        return
      }

      const { error } = await supabase.from("consultas").insert({
        cliente_id: user.id,
        fisioterapeuta_id: formData.fisioterapeuta_id,
        full_name: formData.full_name,
        email: formData.email,
        phone: formData.phone,
        service: formData.service,
        date: formData.date,
        time: formData.time,
        symptoms: formData.symptoms,
        status: "agendada",
      })

      if (error) throw error

      setSuccess("Consulta agendada com sucesso!")
      setShowConfirmation(false)

      // Redirecionar após 2 segundos
      setTimeout(() => navigate("/dashboard"), 2000)
    } catch (err) {
      console.error("Erro ao agendar consulta:", err)
      setError(err.message || "Erro ao agendar consulta. Tente novamente.")
    } finally {
      setLoading(false)
    }
  }

  // Formatar data para exibição
  const formatDate = (dateString) => {
    if (!dateString) return ""
    const date = new Date(dateString)
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link to="/" className="flex items-center">
              <span className="text-2xl font-bold text-blue-600">Fisio Care</span>
            </Link>

            <div className="flex items-center space-x-4">
              <Link to="/dashboard" className="px-4 py-2 text-blue-600 hover:text-blue-800 transition-colors">
                Dashboard
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-6">
          <ol className="flex items-center space-x-2 text-sm text-gray-500">
            <li>
              <Link to="/" className="hover:text-blue-600">
                Home
              </Link>
            </li>
            <li>
              <ChevronRight className="h-4 w-4" />
            </li>
            <li>
              <Link to="/dashboard" className="hover:text-blue-600">
                Dashboard
              </Link>
            </li>
            <li>
              <ChevronRight className="h-4 w-4" />
            </li>
            <li className="font-medium text-gray-900">Agendar Consulta</li>
          </ol>
        </nav>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900">Agendar Consulta</h2>
            <p className="text-gray-600 mt-1">Preencha o formulário abaixo para agendar sua consulta</p>
          </div>

          {error && (
            <div className="mx-6 mt-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-md flex items-center">
              <AlertCircle className="h-5 w-5 text-red-500 mr-3" />
              <p className="text-red-700">{error}</p>
              <button onClick={() => setError("")} className="ml-auto text-red-700 hover:text-red-900">
                <X className="h-5 w-5" />
              </button>
            </div>
          )}

          {success && (
            <div className="mx-6 mt-6 p-4 bg-green-50 border-l-4 border-green-500 rounded-md flex items-center">
              <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
              <p className="text-green-700">{success}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Informações Pessoais */}
              <div className="md:col-span-2">
                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                  <User className="h-5 w-5 mr-2 text-blue-600" />
                  Informações Pessoais
                </h3>
              </div>

              <div>
                <label htmlFor="full_name" className="block text-sm font-medium text-gray-700 mb-1">
                  Nome Completo
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="full_name"
                    type="text"
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleChange}
                    required
                    className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2.5"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2.5"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                  Telefone
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="phone"
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    placeholder="(00) 00000-0000"
                    className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2.5"
                  />
                </div>
              </div>

              {/* Detalhes da Consulta */}
              <div className="md:col-span-2 mt-4">
                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                  <FileText className="h-5 w-5 mr-2 text-blue-600" />
                  Detalhes da Consulta
                </h3>
              </div>

              <div>
                <label htmlFor="service" className="block text-sm font-medium text-gray-700 mb-1">
                  Serviço
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Stethoscope className="h-5 w-5 text-gray-400" />
                  </div>
                  <select
                    id="service"
                    name="service"
                    value={formData.service}
                    onChange={handleChange}
                    required
                    className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2.5"
                  >
                    <option value="">Selecione um serviço</option>
                    {services.map((service) => (
                      <option key={service} value={service}>
                        {service}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="fisioterapeuta_id" className="block text-sm font-medium text-gray-700 mb-1">
                  Fisioterapeuta
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <select
                    id="fisioterapeuta_id"
                    name="fisioterapeuta_id"
                    value={formData.fisioterapeuta_id}
                    onChange={handleChange}
                    required
                    disabled={!formData.service}
                    className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2.5 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  >
                    <option value="">
                      {formData.service
                        ? fisioterapeutas.length > 0
                          ? "Selecione um fisioterapeuta"
                          : "Nenhum fisioterapeuta disponível"
                        : "Selecione um serviço primeiro"}
                    </option>
                    {fisioterapeutas.map((f) => (
                      <option key={f.id} value={f.id}>
                        {f.nome_completo}
                      </option>
                    ))}
                  </select>
                </div>
                {selectedFisioterapeuta && (
                  <div className="mt-2 text-sm text-gray-600">
                    <p>CREFITO: {selectedFisioterapeuta.crefito}</p>
                  </div>
                )}
              </div>

              <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                  Data
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <CalendarDays className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="date"
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    min={new Date().toISOString().split("T")[0]}
                    required
                    disabled={!formData.fisioterapeuta_id}
                    className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2.5 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-1">
                  Horário
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Clock className="h-5 w-5 text-gray-400" />
                  </div>
                  <select
                    id="time"
                    name="time"
                    value={formData.time}
                    onChange={handleChange}
                    required
                    disabled={!formData.date || isCheckingAvailability || availableTimes.length === 0}
                    className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2.5 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  >
                    <option value="">
                      {isCheckingAvailability
                        ? "Verificando horários..."
                        : !formData.date
                          ? "Selecione uma data primeiro"
                          : availableTimes.length === 0
                            ? "Nenhum horário disponível"
                            : "Selecione um horário"}
                    </option>
                    {availableTimes.map((time) => (
                      <option key={time} value={time}>
                        {time}
                      </option>
                    ))}
                  </select>
                </div>
                {formData.date && availableTimes.length === 0 && !isCheckingAvailability && (
                  <p className="mt-1 text-sm text-red-500">
                    Não há horários disponíveis nesta data. Por favor, selecione outra data.
                  </p>
                )}
              </div>

              <div className="md:col-span-2">
                <label htmlFor="symptoms" className="block text-sm font-medium text-gray-700 mb-1">
                  Sintomas ou Observações
                </label>
                <textarea
                  id="symptoms"
                  name="symptoms"
                  value={formData.symptoms}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Descreva seus sintomas ou adicione observações importantes para o fisioterapeuta"
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2.5"
                />
              </div>
            </div>

            <div className="mt-8 flex justify-end space-x-4">
              <Link
                to="/dashboard"
                className="px-6 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancelar
              </Link>
              <button
                type="submit"
                className="px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300 flex items-center"
                disabled={loading}
              >
                {loading ? (
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
                ) : (
                  "Agendar Consulta"
                )}
              </button>
            </div>
          </form>
        </div>
      </main>

      {/* Modal de Confirmação */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Confirmar Agendamento</h3>

            <div className="bg-gray-50 rounded-md p-4 mb-6">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Serviço:</span>
                  <span className="text-sm font-medium">{formData.service}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Fisioterapeuta:</span>
                  <span className="text-sm font-medium">{selectedFisioterapeuta?.nome_completo || ""}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Data:</span>
                  <span className="text-sm font-medium">{formatDate(formData.date)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Horário:</span>
                  <span className="text-sm font-medium">{formData.time}</span>
                </div>
              </div>
            </div>

            <p className="text-gray-700 mb-6">
              Ao confirmar, você está agendando uma consulta de {formData.service} com{" "}
              {selectedFisioterapeuta?.nome_completo} para o dia {formatDate(formData.date)} às {formData.time}.
            </p>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowConfirmation(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                disabled={loading}
              >
                Voltar
              </button>
              <button
                onClick={confirmAppointment}
                className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 flex items-center"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                    Processando...
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" /> Confirmar Agendamento
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AgendarConsulta
