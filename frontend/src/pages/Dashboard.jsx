"use client"

import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import api from "../api"
import { Calendar, Clock, FileText } from "lucide-react"

const Dashboard = () => {
  const { user } = useAuth()
  const [consultations, setConsultations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchConsultations = async () => {
      try {
        const response = await api.get("/consultations/")
        setConsultations(response.data)
      } catch (err) {
        setError("Falha ao carregar consultas")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchConsultations()
  }, [])

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Carregando...</div>
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <Link to="/" className="text-3xl font-bold text-blue-700">
            Fisio Care
          </Link>
          <div className="flex space-x-4">
            <Link to="/agendar-consulta" className="px-4 py-2 text-blue-600 hover:text-blue-800">
              Agendar Consulta
            </Link>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {error && <p className="text-red-500 mb-4">{error}</p>}

        <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6 mb-6">
          <h2 className="text-2xl font-bold mb-4">Bem-vindo, {user?.name || user?.username}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-lg font-medium">Informações Pessoais</h3>
              <p className="mt-2">
                <span className="font-semibold">Nome:</span> {user?.name}
              </p>
              <p>
                <span className="font-semibold">Email:</span> {user?.email}
              </p>
              <p>
                <span className="font-semibold">Telefone:</span> {user?.phone}
              </p>
            </div>
            <div>
              <h3 className="text-lg font-medium">Documentos</h3>
              <p className="mt-2">
                <span className="font-semibold">CPF:</span> {user?.cpf}
              </p>
              <p>
                <span className="font-semibold">RG:</span> {user?.rg}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold">Minhas Consultas</h3>
            <Link
              to="/agendar-consulta"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
            >
              Nova Consulta
            </Link>
          </div>

          {consultations.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">Você ainda não tem consultas agendadas.</p>
              <Link
                to="/agendar-consulta"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
              >
                Agendar sua primeira consulta
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Serviço
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Data
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Horário
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {consultations.map((consultation) => (
                    <tr key={consultation.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center bg-blue-100 rounded-full">
                            <FileText className="h-5 w-5 text-blue-600" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{consultation.service}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 text-gray-500 mr-2" />
                          <div className="text-sm text-gray-900">
                            {new Date(consultation.date).toLocaleDateString("pt-BR")}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 text-gray-500 mr-2" />
                          <div className="text-sm text-gray-900">
                            {new Date(`2000-01-01T${consultation.time}`).toLocaleTimeString("pt-BR", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          Confirmada
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default Dashboard
