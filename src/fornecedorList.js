var pagina = 1;
var i = 1;
var str = "";
var id = 0;

function loadScript(url)
{    
    var head = document.getElementsByTagName('head')[0];
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = url;
    head.appendChild(script);
}

async function  carregarUrl(){
    const urlA = await fetch('./rotaBack.json')
    dados = await urlA.json()
    return dados.API_URL
  }

async function proximaPagina(){
    urlA = await carregarUrl()
    pagina += 1;
    urlAPI = urlA + "/fornecedores/?format=json/?page="+ pagina +"&search="+str;
    carregarDados()

}

var urlAPI = ""

async function carregarDados() {
        loadScript("header.js");
        urlA = await carregarUrl()
        urlAPI = urlA + "/fornecedores/?format=json&page="+ pagina;
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
    const tabela = document.getElementById("tabela-pecas");

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
    const colunaPais = document.createElement("td");
    const colunaCidade = document.createElement("td");
    const colunaQtd = document.createElement("td");
    linha.id = "linhas";

    colunaItem.textContent = "ITEM";
    colunaCnpj.textContent = "CNPJ";
    colunaNome.textContent = "DESCRIÇÂO";
    colunaPais.textContent = "PAÍS";
    colunaCidade.textContent = "CIDADE";

    linha.appendChild(colunaItem);
    linha.appendChild(colunaCnpj);
    linha.appendChild(colunaNome);
    linha.appendChild(colunaPais);
    linha.appendChild(colunaCidade);
    linha.appendChild(colunaQtd);

    tabela.appendChild(linha);
}

function popularTabela(dados){
    const botao = document.getElementById("atualizar");
    botao.style.display = "none";
    const tabela = document.getElementById("tabela-pecas");
    for (const item of dados.results) {
        const linha = document.createElement("tr");
        const colunaItem = document.createElement("td");
        const colunaCnpj = document.createElement("td");
        const colunaNome = document.createElement("td");
        const colunaPais = document.createElement("td");
        const colunaCidade = document.createElement("td");
        const colunaQtd = document.createElement("td");
        var btn = document.createElement("button");
        btn.id = "preencher"
        linha.id = "linhas"; 

        var id = item.id; 

        btn.setAttribute("onclick", "preencherForm("+ JSON.stringify(item) +")");            
        
        colunaQtd.appendChild(btn);

        colunaItem.textContent = i.toString();
        colunaCnpj.textContent = item.cpfcnpj;
        colunaNome.textContent = item.nome_fornecedor;
        colunaPais.textContent = item.pais;
        colunaCidade.textContent = item.cidade;
        btn.textContent = "atualizar";

        linha.appendChild(colunaItem);
        linha.appendChild(colunaCnpj);
        linha.appendChild(colunaNome);
        linha.appendChild(colunaPais);
        linha.appendChild(colunaCidade);
        linha.appendChild(colunaQtd);
        

        tabela.appendChild(linha);

        i++;
      }

}

async function pesquisar(){
    urlA = await carregarUrl()
    pagina = 1
    for(var j = 1; j<=i; j++ ){
        var linhas = document.getElementById("linhas");
        linhas.remove();
    }
    str = document.getElementById("pesquisa").value;
    urlAPI = urlA + "/fornecedor/?page="+ pagina +"&search="+str;
    var p = document.getElementById("pesquisa");
    p.remove();
    i=1;
    carregarDados()
}

function preencherForm(Fornecedor){
    const botaoCad = document.getElementById('cadastro');
    const botaoAtu = document.getElementById("atualizar");
    const Fornec = Fornecedor;
    var tipoPessoa =  document.getElementById('tipoPessoa');
    var nomeFornecedor = document.getElementById('nomeFornecedor');
    var cpfCnpj = document.getElementById('cpfCnpj');
    var endereco = document.getElementById('endereco');
    var cep = document.getElementById('cep');
    var cidade = document.getElementById('cidade');
    var pais = document.getElementById('pais');
    var telefone = document.getElementById('telefone');
    var site = document.getElementById('site');
    var email = document.getElementById('email');
    var detalhe = document.getElementById('detalhe');


    if (Fornec.tipoPessoa == 'f'){
        tipoPessoa.value = "fisica";
    }else{
        tipoPessoa.value = "juridica";
    }
    nomeFornecedor.value = Fornec.nome_fornecedor;
    cpfCnpj.value = Fornec.cpfcnpj;
    endereco.value = Fornec.endereco;
    cep.value = Fornec.cep;
    cidade.value = Fornec.cidade;
    pais.value = Fornec.pais;
    telefone.value = Fornec.telefone;
    site.value = Fornec.site;
    email.value = Fornec.email;
    detalhe.value = Fornec.detalhe;
    id = Fornec.id;

    botaoCad.style.display = "none";
    botaoAtu.style.display = "block";

}

async function add(){
    console.log("urlAPI")
    urlA = await carregarUrl()
    const formularioCadastro = document.getElementById('formularioCadastro');
    

    formularioCadastro.addEventListener('submit', async function(event) {
    event.preventDefault();

    const dados = {
        tipoPessoa: document.getElementById('tipoPessoa').value,
        nomeFornecedor: document.getElementById('nomeFornecedor').value,
        cpfCnpj: document.getElementById('cpfCnpj').value,
        endereco: document.getElementById('endereco').value,
        cep: document.getElementById('cep').value,
        cidade: document.getElementById('cidade').value,
        pais: document.getElementById('pais').value,
        telefone: document.getElementById('telefone').value,
        site: document.getElementById('site').value,
        email: document.getElementById('email').value,
        detalhe: document.getElementById('detalhe').value
    };
    console.log('Dados do formulário:', dados);
    if (dados.tipoPessoa == "Física"){
        var p = "f"
    }else{
        var p = "j"
    }
    await fetch(urlA + "/fornecedores/", {
        method: "POST",
        body: JSON.stringify({
            "tipo_pessoa": p,
            "nome_fornecedor": dados.nomeFornecedor,
            "cpfcnpj": dados.cpfCnpj,
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
          "Content-type": "application/json; charset=UTF-8",
          "Authorization": "token " + localStorage.tokenUsuario
        }
      })
        .then((response) => response.json())
        .then((json) => console.log(json));
    });
}

function addFornecedor(){
    add();
}

async function updateFornecedor(){
    urlA = await carregarUrl()
    const formularioCadastro = document.getElementById('formularioCadastro');

    //formularioCadastro.addEventListener('submit', async function(event) {
    //event.preventDefault();

    const dados = {
        tipoPessoa: document.getElementById('tipoPessoa').value,
        nomeFornecedor: document.getElementById('nomeFornecedor').value,
        cpfCnpj: document.getElementById('cpfCnpj').value,
        endereco: document.getElementById('endereco').value,
        cep: document.getElementById('cep').value,
        cidade: document.getElementById('cidade').value,
        pais: document.getElementById('pais').value,
        telefone: document.getElementById('telefone').value,
        site: document.getElementById('site').value,
        email: document.getElementById('email').value,
        detalhe: document.getElementById('detalhe').value
    };
    console.log('Dados do formulário:', dados);
    if (dados.tipoPessoa == "Física"){
        var p = "f"
    }else{
        var p = "j"
    }
    await fetch(urlA + "/fornecedores/" + id + "/", {
        method: "PUT",
        body: JSON.stringify({
            "id": id,
            "tipoPessoa": p,
            "nome_fornecedor": dados.nomeFornecedor,
            "cpfcnpj": dados.cpfCnpj,
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
          "Content-type": "application/json; charset=UTF-8",
          "Authorization": "token " + localStorage.tokenUsuario
        }
      })
        .then((response) => response.json())
        .then((json) => console.log(json));
    //});
}