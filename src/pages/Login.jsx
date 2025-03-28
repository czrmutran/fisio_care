import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '@fontsource/poppins';

const Login = () => {
  const [loginMethod, setLoginMethod] = useState('user'); // Alterna entre "user" e "email"
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Se já houver um token, redireciona para a home automaticamente.
  useEffect(() => {
    if (localStorage.getItem('accessToken')) {
      navigate('/');
    }
  }, [navigate]);

  const handleToggle = (e) => {
    e.preventDefault();
    setLoginMethod((prev) => (prev === 'user' ? 'email' : 'user'));
  };

  const handleRegister = () => {
    navigate('/register');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    // Define o valor de login de acordo com o método selecionado.
    // Aqui, mesmo que o backend espere "username", enviamos o valor correto.
    const loginValue = loginMethod === 'user' ? username : email;

    try {
      const response = await fetch('http://127.0.0.1:8000/api/token/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: loginValue, password }),
      });

      if (response.ok) {
        const data = await response.json();
        // Armazena os tokens no localStorage
        localStorage.setItem('accessToken', data.access);
        localStorage.setItem('refreshToken', data.refresh);
        // Redireciona para a homepage após login bem-sucedido
        navigate('/');
      } else {
        setError('Credenciais inválidas, verifique seu login e senha.');
      }
    } catch (err) {
      console.error(err);
      setError('Ocorreu um erro, tente novamente mais tarde.');
    }
  };

  return (
    <div className="flex h-screen font-[poppins]">
      {/* Área do formulário */}
      <div className="flex flex-col items-center justify-center w-full p-8 bg-white md:w-1/2">
        <div className="w-full max-w-md">
          <h1 className="mb-2 text-3xl font-bold text-blue-700">Bem-vindo(a) à FisioCare</h1>
          <p className="mb-6 text-lg text-gray-600">Faça login para continuar</p>

          {error && <p className="mb-4 text-red-500">{error}</p>}

          <form onSubmit={handleSubmit}>
            {loginMethod === 'user' && (
              <div className="mb-4">
                <label htmlFor="user" className="block mb-2 font-semibold">
                  Usuário
                </label>
                <input
                  id="user"
                  type="text"
                  placeholder="Digite seu nome de usuário"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                />
              </div>
            )}

            {loginMethod === 'email' && (
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
            )}

            <div className="mb-6">
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
              <a
                href="#"
                className="inline-block mt-2 text-xs text-blue-800 transition duration-300 hover:underline hover:opacity-80"
              >
                Esqueceu a senha?
              </a>
            </div>

            <button
              type="button"
              onClick={handleToggle}
              className="w-full px-4 py-2 mb-4 font-semibold text-blue-600 transition duration-500 bg-transparent border border-blue-600 rounded cursor-pointer hover:text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
            >
              {loginMethod === 'user'
                ? 'Entrar com Email'
                : 'Entrar com Usuário'}
            </button>

            <button
              type="submit"
              className="w-full px-4 py-2 font-semibold text-white transition-colors bg-blue-500 rounded cursor-pointer hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
            >
              Entrar
            </button>
          </form>

          <p
            onClick={handleRegister}
            className="mt-8 text-base text-center text-blue-800 transition duration-300 cursor-pointer hover:underline hover:opacity-80"
          >
            Não tem uma conta? <span className="font-medium">Crie agora</span>
          </p>
        </div>
      </div>

      {/* Imagem de fundo para telas maiores */}
      <div className="hidden w-full md:block md:w-1/2 bg-cover bg-top bg-[url('/loginImg.jpg')]"></div>
    </div>
  );
};

export default Login;
