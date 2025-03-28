import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import RegisterOne from '../components/registerStep/RegisterOne';
import RegisterTwo from '../components/registerStep/RegisterTwo';
import RegisterThree from '../components/registerStep/RegisterThree';

const Register = () => {
  const [step, setStep] = useState(0);

  // Estados para os campos do formulário
  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [cpf, setCpf] = useState('');
  const [rg, setRg] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const navigate = useNavigate();

  const nextStep = () => setStep((prev) => Math.min(prev + 1, 2));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 0));

  const handleLogin = () => {
    navigate('/login');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');

    if (password !== confirmPassword) {
      setError('As senhas não coincidem!');
      return;
    }

    // Monta o payload com os campos obrigatórios
    const payload = {
      username,
      password,
      name,
      cpf,
      rg,
      phone,
      email,
      address,
      birth_date: birthDate,
    };

    try {
      const response = await fetch('http://127.0.0.1:8000/api/register/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setSuccess('Usuário registrado com sucesso! Redirecionando para o login...');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        const errorData = await response.json();
        console.error('Erro no registro:', errorData);
        setError(
          errorData.message ||
            'Erro ao registrar usuário. Verifique os dados e tente novamente.'
        );
      }
    } catch (err) {
      console.error(err);
      setError('Erro no servidor. Tente novamente mais tarde.');
    }
  };

  return (
    <div className="flex h-screen">
      <div className="flex flex-col items-center justify-center w-full p-8 bg-white md:w-1/2">
        <div className="w-full max-w-md">
          <h1 className="mb-2 text-3xl font-bold text-blue-700">
            Bem-vindo(a) a Fisio Care
          </h1>
          <p className="mb-6 text-lg text-gray-600">Faça Register para continuar</p>

          {error && <p className="mb-4 text-red-500">{error}</p>}
          {success && <p className="mb-4 text-green-500">{success}</p>}

          <form
            onSubmit={
              step === 2
                ? handleSubmit
                : (e) => {
                    e.preventDefault();
                    nextStep();
                  }
            }
          >
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
                >
                  Voltar
                </button>
              )}
              {step < 2 && (
                <button
                  type="button"
                  onClick={nextStep}
                  className="px-4 py-2 text-blue-500 transition border border-blue-500 rounded hover:bg-blue-500 hover:text-white"
                >
                  Avançar
                </button>
              )}
              {step === 2 && (
                <button
                  type="submit"
                  className="px-4 py-2 text-white transition bg-blue-600 rounded hover:bg-blue-700"
                >
                  Finalizar
                </button>
              )}
            </div>
          </form>

          <p
            onClick={handleLogin}
            className="w-32 m-auto mt-8 text-base text-center text-blue-800 border-b cursor-pointer hover:border-b"
          >
            Já possuo conta.
          </p>
        </div>
      </div>

      <div className="hidden w-full md:block md:w-1/2 bg-cover bg-top bg-[url('/loginImg.jpg')]"></div>
    </div>
  );
};

export default Register;
