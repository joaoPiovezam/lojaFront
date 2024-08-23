var pagina = 1;
var i = 1;
var str = "";
var tipo = document.getElementById('pagina');

function proximaPagina(){
    pagina += 1;
    urlAPI = "http://127.0.0.1:8000/peca/?page="+ pagina +"&search="+str;
    carregarDados()

}

var urlAPI = "http://127.0.0.1:8000/peca/?format=json&page="+ pagina;

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
        popularTabelaPecas(dadosJSON);
    }

function formatarPreco(preco) {
    return ` ${preco.toFixed(2).replace(".", ",")}`;
}  

carregarDados();

function carregarTabela(){
    tipo = document.getElementById('pagina').value;
    const tabela = document.getElementById("tabela-pecas");

    const pesquisa = document.createElement("input");
    pesquisa.id = "pesquisa";
    pesquisa.placeholder = "pesquisar peça"
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
      
    linha.id = "linhas";

    colunaItem.textContent = "ITEM";
    colunaCodigo.textContent = "CODIGO";
    colunaDescricao.textContent = "DESCRIÇÂO";
    colunaMarca.textContent = "MARCA";
    colunaPreco.textContent = "PREÇO";

    linha.appendChild(colunaItem);
    linha.appendChild(colunaCodigo);
    linha.appendChild(colunaDescricao);
    linha.appendChild(colunaMarca);
    linha.appendChild(colunaPreco);
    console.log(tipo);
    if (tipo == "1"){
        const colunaQtd = document.createElement("td");
        colunaQtd.textContent = "QUANTIDADE";
        linha.appendChild(colunaQtd);
    }
    if (tipo == "2"){
        const colunaPrecoFornec = document.createElement("td");
        colunaPrecoFornec.textContent = "PREÇO do FORNECEDOR";
        linha.appendChild(colunaPrecoFornec);        
    }

    tabela.appendChild(linha);
}

function popularTabelaPecas(dados){
    tipo = document.getElementById('pagina').value;
    const tabela = document.getElementById("tabela-pecas");
    for (const item of dados.results) {
        const linha = document.createElement("tr");
        const colunaItem = document.createElement("td");
        const colunaCodigo = document.createElement("td");
        const colunaDescricao = document.createElement("td");
        const colunaMarca = document.createElement("td");
        const colunaPreco = document.createElement("td");

        var qtd = document.createElement("input");
        var btnQtd = document.createElement("button");

        var preco = document.createElement("input");
        var btnPreco = document.createElement("button");

        linha.id = "linhas";
        
        qtd.type = "number";
        qtd.value = "0";
        qtd.min = "0";
        qtd.id =  "q" + i;      

        preco.type = "number";
        preco.value = "0";
        preco.min = "0";
        preco.id = "preco" + i;

        var id = item.id; 

        btnQtd.setAttribute("onclick", "criarPedido("+ id + "," + i +")");  
                 
        colunaItem.textContent = i.toString();
        colunaCodigo.textContent = item.codigo;
        colunaDescricao.textContent = item.descricao;
        colunaMarca.textContent = item.marca;
        colunaPreco.textContent = formatarPreco(item.precoVenda * 1.2);
        btnQtd.textContent = "adicionar ao orçamento";
        btnPreco.textContent = "adicionar";

        linha.appendChild(colunaItem);
        linha.appendChild(colunaCodigo);
        linha.appendChild(colunaDescricao);
        linha.appendChild(colunaMarca);
        linha.appendChild(colunaPreco);

        if (tipo == "1"){
            const colunaQtd = document.createElement("td");
            colunaQtd.appendChild(qtd);
            colunaQtd.appendChild(btnQtd);
            linha.appendChild(colunaQtd);
        }

        if (tipo == "2"){
            const colunaPrecoFornec = document.createElement("td");
            colunaPrecoFornec.appendChild(preco);
            colunaPrecoFornec.appendChild(btnPreco);
            linha.appendChild(colunaPrecoFornec);  
            btnPreco.setAttribute("onclick", "adicionarPecaFornec("+ id + "," + i +")");       
        }        

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
    urlAPI = "http://127.0.0.1:8000/peca/?page="+ pagina +"&search="+str;
    var p = document.getElementById("pesquisa");
    p.remove();
    i=1;
    carregarDados()
}

async function getClienteByOrcamentoId(orcamentoId){
    var urlAPI = "http://127.0.0.1:8000/orcamentos/" + orcamentoId + "/";
        const resposta = await fetch(urlAPI, {
            method: "GET",
            headers: {
              "Content-type": "application/json; charset=UTF-8",
              "Authorization": "token " + localStorage.tokenUsuario
            }
          });
        const dadosJSON = await resposta.json();
    return dadosJSON.cliente
}


async function criarPedido(idPeca, i){
    var qtd = document.getElementById('q' + i);

    console.log("pedido adicionado" + qtd.value);
    var cliente = await getClienteByOrcamentoId(localStorage.orcamentoId);

    await fetch("http://127.0.0.1:8000/pedidos/", {
        method: "POST",
        body: JSON.stringify({
            "codigoPedido": 1,
            "dataCriacao": "2024-03-19",
            "dataEntrega": "2024-01-01",
            "quantidade": qtd.value,
            "pesoBruto": "20.000",
            "volumeBruto": "20.000",
            "unidade": "unit",
            "pacote": "caixa de madeira",
            "volume": 0,
            "codigoPeca": idPeca,
            "codigoOrcamento": localStorage.orcamentoId,
            "codigoCliente": cliente
        }),
        headers: {
          "Content-type": "application/json; charset=UTF-8"
        }
      })
        .then((response) => response.json())
        .then((json) => console.log(json));    
}

async function adicionarPecaFornec(idPeca, i){
    
    var url = "http://127.0.0.1:8000/peca/"+ idPeca + "/fornecedor/" + dropDownFornecedor.value;
    const resposta = await fetch(url, {
        method: "GET",
        headers: {
          "Content-type": "application/json; charset=UTF-8",
          "Authorization": "token " + localStorage.tokenUsuario
        }
      });
    const dados = await resposta.json();

    if(dados.results[i-1] === undefined){
        addPecaFornecedor(idPeca, i)
    }else{
        updatePecaFornecedor(dados, idPeca, i)
    }
}

async function addPecaFornecedor(idPeca, i){
    var preco = document.getElementById('preco'+i);
    await fetch("http://127.0.0.1:8000/pecasFornecedor/", {
        method: "POST",
        body: JSON.stringify({
                "codigo": codigo.value,
                "preco": preco.value,
                "peca": idPeca,
                "fonecedor": dropDownFornecedor.value
        }),
        headers: {
        "Content-type": "application/json; charset=UTF-8"
        }
    })
        .then((response) => response.json())
        .then((json) => console.log(json));
}

async function updatePecaFornecedor(dados, idPeca, i){
    var preco = document.getElementById('preco'+i);
    await fetch("http://127.0.0.1:8000/pecasFornecedor/" + dados.results[i-1].id + "/", {
            method: "PUT",
            body: JSON.stringify({
                    "codigo": codigo.value,
                    "preco": preco.value,
                    "peca": idPeca,
                    "fonecedor": dropDownFornecedor.value
            }),
            headers: {
            "Content-type": "application/json; charset=UTF-8"
            }
        })
            .then((response) => response.json())
            .then((json) => console.log(json));
    }
