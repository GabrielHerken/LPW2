const janela = document.querySelector("#janela-login")
const botaoFechaLogin = document.querySelector("#botao-fecha-login")
const botaoIniciarSessao = document.querySelector("#botao-iniciar-sessao")
const titulo = document.querySelector("#titulo")
const alternarOpcoes = document.querySelector("#criar-conta")
const textoConta = document.querySelector("#texto-conta")
const formulario = janela.querySelector("form")
const usuarioLogado = document.querySelector("#usuario-logado")
const botaoSair = document.querySelector("#botao-sair")
let fotoUsuario = document.querySelector("#foto-perfil")

let criandoConta = false


const loginValido = document.querySelector("#login-valido")
const loginInvalido = document.querySelector("#login-errado")
const loginCriado = document.querySelector("#conta-criada")

const nomeLoginInput = document.querySelector("#login-nome")
const senhaLoginInput = document.querySelector("#login-senha")
const botaoLogar = document.querySelector("#logar")

loginValido.style.display = "none"
loginInvalido.style.display = "none"
loginCriado.style.display = "none"


botaoIniciarSessao.addEventListener("click", () => {
    loginInvalido.style.display = "none"
    loginCriado.style.display = "none"

    janela.showModal()
})


botaoFechaLogin.addEventListener("click", () => {
    janela.close()
})

alternarOpcoes.addEventListener("click", (event) => {
    event.preventDefault()

    criandoConta = !criandoConta

    senhaLoginInput.value = ""
    nomeLoginInput.value = ""

    loginInvalido.style.display = "none"
    loginValido.style.display = "none"
    loginCriado.style.display = "none"

    if (criandoConta == false) {
        titulo.textContent = "Entrar"
        textoConta.textContent = "Não possui uma conta?"
        alternarOpcoes.textContent = "Crie agora"
        botaoLogar.textContent = "Entrar"
    } else {
        titulo.textContent = "Cadastrar"
        textoConta.textContent = "Já possui uma conta?"
        alternarOpcoes.textContent = "Entrar"
        botaoLogar.textContent = "Criar"
    }
})

formulario.addEventListener("submit", (event) => {
    event.preventDefault()

    const nome = nomeLoginInput.value.trim()
    const senha = senhaLoginInput.value

    if (nome === "" || senha === "") {
        return
    }

    if (criandoConta) {

        if (localStorage.getItem(nome) !== null) {
            loginInvalido.textContent = "Esse usuário já existe!"
            loginInvalido.style.display = "block"
            loginCriado.style.display = "none"
            loginValido.style.display = "none"
            return
        }


        if (senha.length < 6) {
            loginInvalido.textContent =
                "A senha precisa de no mínimo 6 caracteres."
            loginInvalido.style.display = "block"
            loginCriado.style.display = "none"
            return
        }


        localStorage.setItem(nome, senha)

        loginCriado.textContent = "Conta criada com sucesso!"
        loginCriado.style.display = "block"
        loginInvalido.style.display = "none"
        loginValido.style.display = "none"


        criandoConta = false

        titulo.textContent = "Entrar"
        textoConta.textContent = "Não possui uma conta?"
        alternarOpcoes.textContent = "Crie agora"
        botaoLogar.textContent = "Entrar"

        senhaLoginInput.value = ""
        nomeLoginInput.value = ""

    } else {

        if (
            localStorage.getItem(nome) !== null &&
            localStorage.getItem(nome) === senha
        ) {
            usuarioLogado.style.display = 'flex'
            loginValido.textContent = nome
            loginValido.style.display = "block"
            loginInvalido.style.display = "none"
            loginCriado.style.display = "none"
            botaoIniciarSessao.style.display = "none"
            fotoUsuario.textContent = `${nome[0]}`
            localStorage.setItem("usuarioLogado", nome)

            janela.close()

        } else {
            loginInvalido.textContent = "Nome de usuário ou senha inválidos!"
            loginInvalido.style.display = "block"
            loginValido.style.display = "none"

            senhaLoginInput.focus()
        }
    }
})


botaoSair.addEventListener('click', () => {
    usuarioLogado.style.display = "none"
    botaoIniciarSessao.style.display = "block"

    loginValido.textContent = ""
    localStorage.removeItem("usuarioLogado")
})