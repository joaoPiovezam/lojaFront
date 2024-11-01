async function  carregarUrl(){
    const urlA = await fetch('./rotaBack.json')
    dados = await urlA.json()
    return dados.API_URL
  }

preecheEnderecoCEP()
cpf()

async function criarConta(){

    await cadastrarUsuario();

}

async function cadastrarUsuario(){
    urlA = await carregarUrl()
    const dados = {
        empresa: document.getElementById("empresa").value,
        email: document.getElementById("email").value,
        username: document.getElementById("username").value,
        password: document.getElementById("password").value,
        passwordC: document.getElementById("passwordC").value,
        cpf: document.getElementById("cpf").value,
        cep: document.getElementById("cep").value,
        endereco: "rua: " + document.getElementById("rua").value + ", número: " + document.getElementById("numero").value + 
                  ", complemento: " + document.getElementById("complemento").value + ", bairro: " + document.getElementById("bairro").value,
        cidade: document.getElementById("cidade").value,
        pais: "Brasil",
        telefone: document.getElementById("telefone").value,
        site: document.getElementById("site").value,
        detalhe: document.getElementById("detalhe").value,
        tipoPessoa: document.getElementById("tipoPessoa").value,
    }

    //validate(dados.cpf)

    if(dados.passwordC != dados.password){
        alert("Senhas não coferem");
    }else{

        await fetch(urlA + "/signup", {
            method: "POST",
            body: JSON.stringify({
                "email": dados.email,
                "username": dados.username,
                "password": dados.password 
            }),
            headers: {
            "Content-type": "application/json; charset=UTF-8"
            }
        })
            .then((response) => response.json())
            .then((json) => console.log(json));

        await fetch(urlA + "/clientes/", {
            method: "POST",
            body: JSON.stringify({
                    "nomeCliente": dados.username,
                    "empresa": dados.empresa,
                    "email":  dados.email,
                    "cpfCnpj": dados.cpf,
                    "endereco": dados.endereco,
                    "cep": dados.cep,
                    "cidade": dados.cidade,
                    "pais": dados.pais,
                    "telefone": dados.pais,
                    "tipoPessoa": dados.tipoPessoa,
                    "site": dados.site,
                    "detalhe": dados.detalhe
            }),
            headers: {
            "Content-type": "application/json; charset=UTF-8"
            }
        })
            .then((response) => response.json())
            .then((json) => console.log(json));

    }
}

function cpf(){
    var cpf = document.querySelector("#cpf");

    cpf.addEventListener("blur", function(){
       if(cpf.value) cpf.value = cpf.value.match(/.{1,3}/g).join(".").replace(/\.(?=[^.]*$)/,"-");
    });
}

function preecheEnderecoCEP(){
    const cepInput = document.getElementById('cep');

    cepInput.addEventListener('blur', () => {
        const cep = cepInput.value;
        const url = `https://viacep.com.br/ws/${cep}/json/`;

        fetch(url)
            .then(response => response.json())
            .then(data => {
                if (data.erro) {
                    alert('CEP não encontrado');
                } else {
                    document.getElementById('rua').value = data.logradouro;
                    document.getElementById('bairro').value = data.bairro;
                    document.getElementById('cidade').value = data.localidade;
                    document.getElementById('estado').value = data.uf;
                }
            })
            .catch(error => {
                console.error('Erro ao buscar CEP:', error);
            });
    });
}