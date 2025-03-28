import React from 'react';

const RegisterTwo = ({ cpf, setCpf, rg, setRg, phone, setPhone, address, setAddress }) => {
  return (
    <>
      <div className="mb-4">
        <label htmlFor="cpf" className="block mb-2 font-semibold">
          CPF
        </label>
        <input
          id="cpf"
          type="text"
          placeholder="Digite seu CPF"
          value={cpf}
          onChange={(e) => setCpf(e.target.value)}
          maxLength={11}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        />
      </div>

      <div className="mb-4">
        <label htmlFor="rg" className="block mb-2 font-semibold">
          RG
        </label>
        <input
          id="rg"
          type="text"
          placeholder="Digite seu RG"
          value={rg}
          onChange={(e) => setRg(e.target.value)}
          maxLength={10}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        />
      </div>

      <div className="mb-4">
        <label htmlFor="phone" className="block mb-2 font-semibold">
          Telefone
        </label>
        <input
          id="phone"
          type="text"
          placeholder="Digite seu telefone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          maxLength={14}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        />
      </div>

      <div className="mb-4">
        <label htmlFor="address" className="block mb-2 font-semibold">
          Endereço
        </label>
        <input
          id="address"
          type="text"
          placeholder="Digite seu endereço"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        />
      </div>
    </>
  );
};

export default RegisterTwo;
