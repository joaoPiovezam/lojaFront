var pagina = 1;
var i = 1;
var str = "";
var id = 0;

function proximaPagina(){
    pagina += 1;
    urlAPI = "http://127.0.0.1:8000/fornecedores/?format=json/?page="+ pagina +"&search="+str;
    carregarDados()

}

var urlAPI = "http://127.0.0.1:8000/fornecedores/?format=json&page="+ pagina;

async function carregarDados() {
        const resposta = await fetch(urlAPI);
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
    const colunaCodigo = document.createElement("td");
    const colunaDescricao = document.createElement("td");
    const colunaMarca = document.createElement("td");
    const colunaPreco = document.createElement("td");
    const colunaQtd = document.createElement("td");
    linha.id = "linhas";

    colunaItem.textContent = "ITEM";
    colunaCodigo.textContent = "CODIGO";
    colunaDescricao.textContent = "DESCRIÇÂO";
    colunaMarca.textContent = "MARCA";
    colunaPreco.textContent = "PREÇO";
    colunaQtd.textContent = "QUANTIDADE";

    linha.appendChild(colunaItem);
    linha.appendChild(colunaCodigo);
    linha.appendChild(colunaDescricao);
    linha.appendChild(colunaMarca);
    linha.appendChild(colunaPreco);
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
        const colunaCodigo = document.createElement("td");
        const colunaDescricao = document.createElement("td");
        const colunaMarca = document.createElement("td");
        const colunaPreco = document.createElement("td");
        const colunaQtd = document.createElement("td");
        var qtd = document.createElement("input");
        var btn = document.createElement("button");
        btn.id = "preencher"
        linha.id = "linhas";
        
        qtd.type = "number";
        qtd.value = "0";
        qtd.min = "0";
        qtd.id =  "q" + i;      

        var id = item.id; 

        btn.setAttribute("onclick", "preencherForm("+ JSON.stringify(item) +")");            
        
        colunaQtd.appendChild(qtd);
        colunaQtd.appendChild(btn);

        colunaItem.textContent = i.toString();
        colunaCodigo.textContent = item.cpfCnpj;
        colunaDescricao.textContent = item.nomeFornecedor;
        colunaMarca.textContent = item.pais;
        colunaPreco.textContent = item.cidade;
        btn.textContent = "adicionar ao orçamento";

        linha.appendChild(colunaItem);
        linha.appendChild(colunaCodigo);
        linha.appendChild(colunaDescricao);
        linha.appendChild(colunaMarca);
        linha.appendChild(colunaPreco);
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
    urlAPI = "http://127.0.0.1:8000/fornecedor/?page="+ pagina +"&search="+str;
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
    nomeFornecedor.value = Fornec.nomeFornecedor;
    cpfCnpj.value = Fornec.cpfCnpj;
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

function add(){
    const formularioCadastro = document.getElementById('formularioCadastro');

    formularioCadastro.addEventListener('submit', function(event) {
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
    fetch("http://127.0.0.1:8000/fornecedores/", {
        method: "POST",
        body: JSON.stringify({
            "tipoPessoa": p,
            "nomeFornecedor": dados.nomeFornecedor,
            "cpfCnpj": dados.cpfCnpj,
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

function addFornecedor(){
    add();
}

function updateFornecedor(){
    const formularioCadastro = document.getElementById('formularioCadastro');

    formularioCadastro.addEventListener('submit', function(event) {
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
    fetch("http://127.0.0.1:8000/fornecedores/" + id + "/", {
        method: "PUT",
        body: JSON.stringify({
            "id": id,
            "tipoPessoa": p,
            "nomeFornecedor": dados.nomeFornecedor,
            "cpfCnpj": dados.cpfCnpj,
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
    location.reload();
}