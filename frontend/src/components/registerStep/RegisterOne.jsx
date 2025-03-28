import React from 'react';

const RegisterOne = ({ username, setUsername, name, setName, email, setEmail }) => {
  return (
    <>
      <div className="mb-4">
        <label htmlFor="username" className="block mb-2 font-semibold">
          Username
        </label>
        <input
          id="username"
          type="text"
          placeholder="Digite seu username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        />
      </div>

      <div className="mb-4">
        <label htmlFor="name" className="block mb-2 font-semibold">
          Nome Completo
        </label>
        <input
          id="name"
          type="text"
          placeholder="Digite seu nome completo"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        />
      </div>

      <div className="mb-4">
        <label htmlFor="email" className="block mb-2 font-semibold">
          Email
        </label>
        <input
          id="email"
          type="email"
          placeholder="Digite seu email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        />
      </div>
    </>
  );
};

export default RegisterOne;
