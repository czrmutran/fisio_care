import React from 'react';

const RegisterThree = ({ birthDate, setBirthDate, password, setPassword, confirmPassword, setConfirmPassword }) => {
  return (
    <>
      <div className="mb-4">
        <label htmlFor="birthDate" className="block mb-2 font-semibold">
          Data de Nascimento
        </label>
        <input
          id="birthDate"
          type="date"
          value={birthDate}
          onChange={(e) => setBirthDate(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        />
      </div>

      <div className="mb-4">
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

      <div className="mb-6">
        <label htmlFor="confirmPassword" className="block mb-2 font-semibold">
          Confirmar Senha
        </label>
        <input
          id="confirmPassword"
          type="password"
          placeholder="Confirme sua senha"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        />
      </div>
    </>
  );
};

export default RegisterThree;
