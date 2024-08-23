var pagina = 1;
var i = 1;
var str = "";
var id = 0;

function proximaPagina(){
    pagina += 1;
    urlAPI = "http://127.0.0.1:8000/transportadora/?format=json/?page="+ pagina;// +"&search="+str;
    carregarDados()

}

var urlAPI = "http://127.0.0.1:8000/transportadora/?format=json&page="+ pagina;

async function carregarDados() {
        const resposta = await fetch(urlAPI, {
            method: "GET",
            headers: {
              "Content-type": "application/json; charset=UTF-8",
              "Authorization": "token " + localStorage.tokenUsuario
            }
          });
        const dadosJSON = await resposta.json();
        
        if(pagina == 1){
            carregarTabela();
        }
        popularTabela(dadosJSON);
        
    }

function formatarPreco(preco) {
    return ` ${preco.toFixed(2).replace(".", ",")}`;
}  

carregarDados();

function carregarTabela(){
    const tabela = document.getElementById("tabela-transportadora");

    const pesquisa = document.createElement("input");
    pesquisa.id = "pesquisa";
    tabela.appendChild(pesquisa);

    pesquisa.addEventListener("keypress", function(event) {
        if (event.key === "Enter") {
          event.preventDefault();
          pesquisar();
        }
      });

    const linha = document.createElement("tr");
    const colunaItem = document.createElement("td");
    const colunaCnpj = document.createElement("td");
    const colunaNome = document.createElement("td");
    const colunaEndereco = document.createElement("td");
    const colunaCidade = document.createElement("td");
    const colunaQtd = document.createElement("td");
    linha.id = "linhas";

    colunaItem.textContent = "ITEM";
    colunaCnpj.textContent = "Cnpj";
    colunaNome.textContent = "DESCRIÇÂO";
    colunaEndereco.textContent = "ENDEREÇO";
    colunaCidade.textContent = "CIDADE";

    linha.appendChild(colunaItem);
    linha.appendChild(colunaCnpj);
    linha.appendChild(colunaNome);
    linha.appendChild(colunaEndereco);
    linha.appendChild(colunaCidade);
    linha.appendChild(colunaQtd);

    tabela.appendChild(linha);
}

function popularTabela(dados){
    const botao = document.getElementById("atualizar");
    botao.style.display = "none";
    const tabela = document.getElementById("tabela-transportadora");
    for (const item of dados.results) {
        const linha = document.createElement("tr");
        const colunaItem = document.createElement("td");
        const colunaCnpj = document.createElement("td");
        const colunaNome = document.createElement("td");
        const colunaEndereco = document.createElement("td");
        const colunaCidade = document.createElement("td");
        const colunaQtd = document.createElement("td");
        var btn = document.createElement("button");
        btn.id = "preencher"
        linha.id = "linhas";

        btn.setAttribute("onclick", "preencherForm("+ JSON.stringify(item) +")");            
        
        colunaQtd.appendChild(btn);

        colunaItem.textContent = i.toString();
        colunaCnpj.textContent = item.cnpj;
        colunaNome.textContent = item.nome;
        colunaEndereco.textContent = item.endereco;
        colunaCidade.textContent = item.cidade;
        btn.textContent = "atulizar";

        linha.appendChild(colunaItem);
        linha.appendChild(colunaCnpj);
        linha.appendChild(colunaNome);
        linha.appendChild(colunaEndereco);
        linha.appendChild(colunaCidade);
        linha.appendChild(colunaQtd);
        

        tabela.appendChild(linha);

        i++;
      }

}

function pesquisar(){
    pagina = 1
    for(var j = 1; j<=i; j++ ){
        var linhas = document.getElementById("linhas");
        linhas.remove();
    }
    str = document.getElementById("pesquisa").value;
    urlAPI = "http://127.0.0.1:8000/transportadora/?page="+ pagina +"&search="+str;
    var p = document.getElementById("pesquisa");
    p.remove();
    i=1;
    carregarDados()
}

function preencherForm(Transportadora){
    const botaoCad = document.getElementById('cadastro');
    const botaoAtu = document.getElementById("atualizar");
    const transportadora = Transportadora;
    const nome = document.getElementById('nome');
    const cnpj = document.getElementById('cnpj');
    const endereco = document.getElementById('endereco');
    const cep = document.getElementById('cep');
    const cidade = document.getElementById('cidade');
    const pais = document.getElementById('pais');
    const telefone = document.getElementById('telefone');
    const site = document.getElementById('site');
    const email = document.getElementById('email');
    const detalhe = document.getElementById('detalhe')

    nome.value = transportadora.nome;
    cnpj.value = transportadora.cnpj;
    endereco.value = transportadora.endereco;
    cep.value = transportadora.cep;
    cidade.value = transportadora.cidade;
    pais.value = transportadora.pais;
    telefone.value = transportadora.telefone;
    site.value = transportadora.site;
    email.value = transportadora.email;
    detalhe.value = transportadora.detalhe;
    id = transportadora.id;

    botaoCad.style.display = "none";
    botaoAtu.style.display = "block";

}

function add(){
    const formularioCadastro = document.getElementById('formularioCadastro');

    formularioCadastro.addEventListener('submit', async function(event) {
    event.preventDefault();

    const dados = {
        nome: document.getElementById('nome').value,
        cnpj: document.getElementById('cnpj').value,
        endereco: document.getElementById('endereco').value,
        cep: document.getElementById('cep').value,
        cidade: document.getElementById('cidade').value,
        pais: document.getElementById('pais').value,
        telefone: document.getElementById('telefone').value,
        site: document.getElementById('site').value,
        email: document.getElementById('email').value,
        detalhe: document.getElementById('detalhe').value
    };
    await fetch("http://127.0.0.1:8000/transportadora/", {
        method: "POST",
        body: JSON.stringify({
            "nome": dados.nome,
            "cnpj": dados.cnpj,
            "endereco": dados.endereco,
            "cep": dados.cep,
            "cidade": dados.cidade,
            "pais": dados.pais,
            "telefone": dados.telefone,
            "site": dados.site,
            "email": dados.email,
            "detalhe": dados.detalhe
        }),
        headers: {
          "Content-type": "application/json; charset=UTF-8"
        }
      })
        .then((response) => response.json())
        .then((json) => console.log(json));
    });
}

function addTranpostadora(){
    add();
    setTimeout(() => {  location.reload(); }, 500)
}

function update(){
    const formularioCadastro = document.getElementById('formularioCadastro');

    formularioCadastro.addEventListener('submit', async function(event) {
    event.preventDefault();

    const dados = {
        nome: document.getElementById('nome').value,
        cnpj: document.getElementById('cnpj').value,
        endereco: document.getElementById('endereco').value,
        cep: document.getElementById('cep').value,
        cidade: document.getElementById('cidade').value,
        pais: document.getElementById('pais').value,
        telefone: document.getElementById('telefone').value,
        site: document.getElementById('site').value,
        email: document.getElementById('email').value,
        detalhe: document.getElementById('detalhe').value
    };
    await fetch("http://127.0.0.1:8000/transportadora/" + id + "/", {
        method: "PUT",
        body: JSON.stringify({
            "id": id,
            "nome": dados.nome,
            "cnpj": dados.cnpj,
            "endereco": dados.endereco,
            "cep": dados.cep,
            "cidade": dados.cidade,
            "pais": dados.pais,
            "telefone": dados.telefone,
            "site": dados.site,
            "email": dados.email,
            "detalhe": dados.detalhe
        }),
        headers: {
          "Content-type": "application/json; charset=UTF-8"
        }
      })
        .then((response) => response.json())
        .then((json) => console.log(json));
    });
}

function updateTranpostadora(){
    update();
    setTimeout(() => {  location.reload(); }, 500)
}