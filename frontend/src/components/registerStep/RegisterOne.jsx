"use client"

import { User, Mail, AtSign } from "lucide-react"

const RegisterOne = ({ username, setUsername, name, setName, email, setEmail }) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-center mb-6">
        <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
          <span className="text-lg font-semibold">1</span>
        </div>
        <div className="h-1 w-16 bg-gray-200 mx-2"></div>
        <div className="w-10 h-10 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center">
          <span className="text-lg font-semibold">2</span>
        </div>
        <div className="h-1 w-16 bg-gray-200 mx-2"></div>
        <div className="w-10 h-10 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center">
          <span className="text-lg font-semibold">3</span>
        </div>
      </div>

      <h2 className="text-xl font-semibold text-gray-800 mb-4">Informações Básicas</h2>

      <div>
        <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
          Nome de Usuário
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <AtSign className="h-5 w-5 text-gray-400" />
          </div>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2.5"
            placeholder="Seu nome de usuário"
            required
          />
        </div>
      </div>

      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
          Nome Completo
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <User className="h-5 w-5 text-gray-400" />
          </div>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2.5"
            placeholder="Seu nome completo"
            required
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
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2.5"
            placeholder="seu@email.com"
            required
          />
        </div>
        <p className="mt-1 text-xs text-gray-500">Usaremos seu email para login e comunicações importantes</p>
      </div>
    </div>
  )
}

export default RegisterOne
