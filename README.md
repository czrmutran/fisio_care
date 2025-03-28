# Fisio Care

Fisio Care é um sistema web desenvolvido para gerenciamento e suporte de atividades de fisioterapia, composto por um backend em Django (com Django REST Framework e autenticação JWT) e um frontend em React com Tailwind CSS. O projeto segue boas práticas de desenvolvimento, incluindo o uso de ambientes virtuais (venv) para isolar dependências.

---

## 🚀 Funcionalidades

- **Cadastro e Autenticação de Usuários:**  
  Permite que os usuários se registrem e façam login utilizando JWT para autenticação segura.

- **API RESTful:**  
  O backend oferece endpoints REST para gerenciar os dados do sistema, com autenticação baseada em tokens.

- **Interface Responsiva:**  
  O frontend foi desenvolvido em React e estilizado com Tailwind CSS, garantindo uma experiência responsiva e moderna.

- **Registro em Etapas:**  
  O sistema de registro de usuários é dividido em etapas, facilitando a inserção de informações essenciais (como dados pessoais, contato e credenciais).

---

## 🛠️ Pré-Requisitos

- **Backend:**  
  - Python 3.8 ou superior  
  - Django  
  - Django REST Framework  
  - djangorestframework-simplejwt  

- **Frontend:**  
  - Node.js (versão 14 ou superior)  
  - npm ou yarn  
  - Vite (se utilizado como bundler)

- **Ambiente Virtual:**  
  Recomenda-se utilizar um ambiente virtual (venv) para isolar as dependências do projeto.

## ⚙️ Instalação e Configuração

## 🐍 Backend (Django)
### Clone o Repositório:

```bash
git clone https://github.com/czrmutran/fisio_care.git
```
```bash
cd fisio_care/backend
```
### Crie e Ative o Ambiente Virtual:

``` bash
python -m venv venv
```
#### No Windows:
``` bash
env\scripts\activate
```
#### No Unix/Mac:
``` bash
source env/bin/activate
```

### Instale as Dependências:

```bash
pip install -r requirements.txt
```


### Configuração do Banco de Dados:

- Certifique-se de configurar as variáveis de ambiente ou editar o arquivo settings.py conforme necessário para o banco de dados (por padrão, o Django utiliza SQLite).

### Migrações:

```bash
python manage.py makemigrations
python manage.py migrate
```
### Crie um Superusuário (Opcional):

```bash
python manage.py createsuperuser
```
### Executar o Servidor:

```bash
python manage.py runserver
```
 - O backend estará disponível em http://127.0.0.1:8000/.

## ⚛️ Frontend (React)
### Clone o Repositório (separado ou dentro da pasta frontend):

``` bash
cd fisio_care/frontend
```

### Instale as Dependências:

#### Se você estiver utilizando npm:

```bash
npm install
```

#### Ou, se preferir yarn:

``` bash
yarn install
```

## Configuração das Variáveis de Ambiente:

    - Crie um arquivo .env na raiz do projeto frontend e defina a URL da API, por exemplo:

``` env
VITE_API_URL=http://127.0.0.1:8000/api
```

## Executar o Frontend:

#### Se estiver utilizando npm:

``` bash
npm run dev
```

#### Ou, se estiver utilizando yarn:

``` bash
yarn dev
```

    - O frontend estará disponível geralmente em http://localhost:5173/.

## 💡 Boas Práticas
### Ambiente Virtual:
    - Sempre utilize um ambiente virtual para isolar as dependências do seu projeto e evitar conflitos com outras instalações Python.

### Gerenciamento de Variáveis de Ambiente:
    - Utilize arquivos .env para armazenar configurações sensíveis (como URL da API, chaves secretas, etc.) e evite versioná-los (adicione-os ao .gitignore).

### Estrutura de Código:
    - Mantenha uma separação clara entre backend e frontend. Siga os padrões do Django para a organização de apps e dos endpoints REST e utilize componentes React bem estruturados e reutilizáveis.

### Autenticação e Segurança:
    - Utilize JWT para autenticação, garantindo que apenas usuários autenticados possam acessar os endpoints protegidos. Nunca retorne senhas ou dados sensíveis na resposta das APIs.

### Estilização e Responsividade:
    - O uso de Tailwind CSS no frontend ajuda a manter uma consistência visual e a construir interfaces responsivas de maneira rápida.

### 🤝 Contribuição
1. Faça um fork do repositório.

2. Crie uma branch para sua feature 
```
git checkout -b minha-feature
```

3. Faça suas alterações e commit 
```
git commit -m 'Adiciona nova feature'
```

4. Faça push para sua branch 
```
git push origin minha-feature.
```
5. Abra um Pull Request.

### 📄 Licença
Este projeto está licenciado sob a MIT License.

### 📞 Contato
Para dúvidas ou suporte, abra uma issue no repositório ou entre em contato com o mantenedor.