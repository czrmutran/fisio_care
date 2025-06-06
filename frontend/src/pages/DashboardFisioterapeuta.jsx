"use client"

import { useEffect, useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { supabase } from "../lib/supabaseClient"
import {
  Stethoscope,
  Users,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Search,
} from "lucide-react"

const DashboardFisioterapeuta = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [fisioterapeuta, setFisioterapeuta] = useState(null)
  const [consultations, setConsultations] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: { user }, error: userError } = await supabase.auth.getUser()
        if (userError || !user) return navigate("/login-fisioterapeuta")

        const { data: fisioData, error: fisioError } = await supabase
          .from("fisioterapeutas")
          .select("*")
          .eq("id", user.id)
          .single()
        if (fisioError) throw fisioError
        setFisioterapeuta(fisioData)

        const { data: consultasData, error: consultasError } = await supabase
          .from("consultas")
          .select("*")
          .eq("fisioterapeuta_id", user.id)
          .order("date", { ascending: true })

        if (consultasError) throw consultasError
        setConsultations(consultasData)
      } catch (err) {
        console.error(err)
        setError("Erro ao carregar dados.")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [navigate])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate("/")
  }

  const filteredConsultations = consultations.filter((c) =>
    c.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.service.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getStatusIcon = (status) => {
    switch (status) {
      case "confirmada": return <CheckCircle className="h-5 w-5 text-green-500" />
      case "concluida": return <CheckCircle className="h-5 w-5 text-blue-500" />
      case "cancelada": return <XCircle className="h-5 w-5 text-red-500" />
      default: return <AlertCircle className="h-5 w-5 text-yellow-500" />
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "confirmada": return "bg-green-100 text-green-800"
      case "concluida": return "bg-blue-100 text-blue-800"
      case "cancelada": return "bg-red-100 text-red-800"
      default: return "bg-yellow-100 text-yellow-800"
    }
  }

  if (loading) return <div className="flex items-center justify-center h-screen">Carregando...</div>

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 flex justify-between items-center">
          <div className="flex items-center">
            <Stethoscope className="h-8 w-8 text-blue-600 mr-3" />
            <Link to="/" className="text-3xl font-bold text-blue-700">Fisio Care</Link>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-medium">{fisioterapeuta?.nome_completo}</p>
              <p className="text-xs text-gray-500">{fisioterapeuta?.especialidade}</p>
            </div>
            <button onClick={handleLogout} className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700">
              Sair
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4">
        {error && <p className="text-red-500 mb-4">{error}</p>}

        <div className="mb-6">
          <h2 className="text-xl font-bold mb-2">Consultas</h2>
          <input
            type="text"
            placeholder="Buscar paciente ou serviço..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 w-full md:w-96 border rounded-lg"
          />
        </div>

        <div className="bg-white shadow overflow-hidden rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Paciente</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Serviço</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Data</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Hora</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contato</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredConsultations.map((c) => (
                <tr key={c.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center bg-blue-100 rounded-full">
                        <Users className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{c.full_name}</div>
                        <div className="text-sm text-gray-500">{c.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">{c.service}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    <Calendar className="inline h-4 w-4 text-gray-500 mr-1" />
                    {new Date(c.date).toLocaleDateString("pt-BR")}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    <Clock className="inline h-4 w-4 text-gray-500 mr-1" />
                    {c.time?.substring(0, 5) || "—"}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      {getStatusIcon(c.status)}
                      <span className={`ml-2 px-2 inline-flex text-xs font-semibold rounded-full ${getStatusColor(c.status)}`}>
                        {c.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    <div>{c.phone}</div>
                    {c.symptoms && (
                      <div className="text-xs text-gray-400 mt-1">
                        Sintomas: {c.symptoms.substring(0, 50)}...
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  )
}

export default DashboardFisioterapeuta
