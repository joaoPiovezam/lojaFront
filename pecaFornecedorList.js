var pagina = 1;
var i = 1;
var iC = 1;
var str = "";
var id = 0;
//var idPeca = localStorage.idPeca;
//var idFornececedor = localStorage.idFornececedor;

function loadScript(url){    
    var head = document.getElementsByTagName('head')[0];
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = url;
    head.appendChild(script);
}

function proximaPagina(){
    pagina += 1;
    urlPecaFornecedor = "http://127.0.0.1:8000/pecaFornecedor/" + localStorage.idPeca + "/" + localStorage.idFornececedor + "/?ordering=preco&page=" + pagina + "&search=" + str;
    carregarDados();

}

function popularDropDownOrcamento(dados){
    console.log(dados)
    const dropdownOrcamento = document.getElementById('dropdownOrcamento');

    for(const item of dados.results){
        const orcamento = document.createElement("option");
        orcamento.value = item.id;
        orcamento.textContent = item.codigo + ' - ' + item.client.nomeCliente;
        console.log(item.id);
        dropdownOrcamento.appendChild(orcamento);
    }
    dropdownOrcamento.value = localStorage.orcamentoId;
}
function atualizarOrcamento(orcamentoId){
    localStorage.orcamentoId = orcamentoId;
    location.reload();
}

var urlPecaFornecedor = "http://127.0.0.1:8000/pecaFornecedor/" + localStorage.idPeca + "/" + localStorage.idFornececedor + "/?ordering=preco";
var urlPedidos = "http://127.0.0.1:8000/orcamento/"+ localStorage.orcamentoId +"/pedidos/0/";
var urlFornecedor = "http://127.0.0.1:8000/fornecedor/";
var urlPedidoCompra = 'http://127.0.0.1:8000/pedidoCompra/' + localStorage.orcamentoId + '/' + localStorage.idFornececedor;
var urlPedidosCompra = 'http://127.0.0.1:8000/pedidosCompra/';
var urlCotacao = "http://127.0.0.1:8000/cotacaoOrcamento/"+ localStorage.orcamentoId + "/";
var urlOrcamento = "http://127.0.0.1:8000/orcamentos/";

async function carregarDados() { 
        const respostaPecas = await fetch(urlPecaFornecedor, {
            method: "GET",
            headers: {
              "Content-type": "application/json; charset=UTF-8",
              "Authorization": "token " + localStorage.tokenUsuario
            }
          });
        const dadosJSONPecas = await respostaPecas.json();
        const respostaOrcamento = await fetch(urlOrcamento, {
            method: "GET",
            headers: {
              "Content-type": "application/json; charset=UTF-8",
              "Authorization": "token " + localStorage.tokenUsuario
            }
          });
        const dadosOrcamento = await respostaOrcamento.json();
        popularDropDownOrcamento(dadosOrcamento); 
        if(pagina == 1 ){
            carregarTabela();
        }
        popularTabela(dadosJSONPecas); 
    }

carregarDados();
carregarTabelaCotacao();
popularDropDownFornecedor();
popularDropDownPedidos();
dropDownPedidoCompra();

async function popularDropDownFornecedor(){
    const respostaFornecedor = await fetch(urlFornecedor, {
        method: "GET",
        headers: {
          "Content-type": "application/json; charset=UTF-8",
          "Authorization": "token " + localStorage.tokenUsuario
        }
      });
    const dados = await respostaFornecedor.json();
    const dropDownFornecedores = document.getElementById('dropDownFornecedor');
    

    for(const item of dados.results){
        const fornecedor = document.createElement("option");
        fornecedor.value = item.id;
        fornecedor.textContent = item.nomeFornecedor + ' - ' + item.cpfCnpj;
        console.log(item.nomeFornecedor + ' - ' + item.cpfCnpj);
        dropDownFornecedores.appendChild(fornecedor);
    }
    dropDownFornecedores.value = localStorage.idFornececedor;
}

async function dropDownPedidoCompra(){
    const respostaPedidoCompra = await fetch(urlPedidoCompra, {
        method: "GET",
        headers: {
          "Content-type": "application/json; charset=UTF-8",
          "Authorization": "token " + localStorage.tokenUsuario
        }
      });
    const dados = await respostaPedidoCompra.json();
    const dropDownPedidoCompra = document.getElementById('dropDownPedidoCompra');
    

    for(const item of dados.results){
        const PedidoCompra = document.createElement("option");
        PedidoCompra.value = item.id;
        PedidoCompra.textContent = item.nomePedidoCompra + ' - ' + item.cpfCnpj;
        console.log(item.nomePedidoCompra + ' - ' + item.cpfCnpj);
        dropDownPedidoCompra.appendChild(PedidoCompra);
    }
    dropDownPedidoCompra.value = localStorage.idFornececedor;
}

async function popularDropDownPedidos(){
    const respostaPedidos = await fetch(urlPedidos, {
        method: "GET",
        headers: {
          "Content-type": "application/json; charset=UTF-8",
          "Authorization": "token " + localStorage.tokenUsuario
        }
      });
    const dados = await respostaPedidos.json();
    const dropDownpedido = document.getElementById('dropDownPedidos');

    for(const item of dados.results){
        const pedido = document.createElement("option");
        pedido.value = item.id;
        pedido.textContent = item.peca.codigo + ' - ' + item.peca.descricao;
        console.log(item.nomepedido + ' - ' + item.cpfCnpj);
        dropDownpedido.appendChild(pedido);
    }
    dropDownpedido.value = localStorage.idPeca;
}

function carregarTabela(){
    const tabela = document.getElementById("tabela-pecas");

    const linha = document.createElement("tr");
    const colunaItem = document.createElement("td");
    const colunaCodigo = document.createElement("td");
    const colunaDescricao = document.createElement("td");
    const colunaMarca = document.createElement("td");
    const colunaPreco = document.createElement("td");
    const colulaFornecedor = document.createElement("td");
    const colunaQtd = document.createElement("td");
      
    linha.id = "linhas";

    colunaItem.textContent = "ITEM";
    colunaCodigo.textContent = "CODIGO";
    colunaDescricao.textContent = "DESCRIÇÂO";
    colunaMarca.textContent = "MARCA";
    colunaPreco.textContent = "PREÇO";
    colulaFornecedor.textContent = "FORNECEDOR";

    linha.appendChild(colunaItem);
    linha.appendChild(colunaCodigo);
    linha.appendChild(colunaDescricao);
    linha.appendChild(colunaMarca);
    linha.appendChild(colunaPreco);
    linha.appendChild(colulaFornecedor);
    linha.appendChild(colunaQtd);

    tabela.appendChild(linha);
}

async function carregarTabelaCotacao(){
    const resposta = await fetch(urlCotacao, {
        method: "GET",
        headers: {
          "Content-type": "application/json; charset=UTF-8",
          "Authorization": "token " + localStorage.tokenUsuario
        }
      });
    const dados = await resposta.json();
    console.log(dados)

    const tabela = document.getElementById("tabela-remover");

    const linha = document.createElement("tr");
    const colunaItem = document.createElement("td");
    const colunaCodigo = document.createElement("td");
    const colunaDescricao = document.createElement("td");
    const colunaMarca = document.createElement("td");
    const colunaPreco = document.createElement("td");
    const colulaFornecedor = document.createElement("td");
    const colunaQtd = document.createElement("td");
      
    linha.id = "linhas";

    colunaItem.textContent = "ITEM";
    colunaCodigo.textContent = "CODIGO";
    colunaDescricao.textContent = "DESCRIÇÂO";
    colunaMarca.textContent = "MARCA";
    colunaPreco.textContent = "PREÇO";
    colulaFornecedor.textContent = "FORNECEDOR";

    linha.appendChild(colunaItem);
    linha.appendChild(colunaCodigo);
    linha.appendChild(colunaDescricao);
    linha.appendChild(colunaMarca);
    linha.appendChild(colunaPreco);
    linha.appendChild(colulaFornecedor);
    linha.appendChild(colunaQtd);

    tabela.appendChild(linha);

    for (const item of dados.results) {
        const linha = document.createElement("tr");
        const colunaItem = document.createElement("td");
        const colunaCodigo = document.createElement("td");
        const colunaDescricao = document.createElement("td");
        const colunaMarca = document.createElement("td");
        const colunaPreco = document.createElement("td");
        const colulaFornecedor = document.createElement("td");
        const colunaQtd = document.createElement("td");

        var btnQtd = document.createElement("button");

        linha.id = "linhas";    

        var idCotacao = item.id; 

        btnQtd.setAttribute("onclick", "removerCotacao("+ idCotacao +")");  
                 
        colunaItem.textContent = iC.toString();
        colunaCodigo.textContent = item.pecasFornecedor.peca.codigo;
        colunaDescricao.textContent = item.pecasFornecedor.peca.descricao;
        colunaMarca.textContent = item.pecasFornecedor.peca.marca;
        colunaPreco.textContent = item.pecasFornecedor.preco;
        colulaFornecedor.textContent = item.pecasFornecedor.fornecedor.nomeFornecedor;
        btnQtd.textContent = "remover da cotação";

        linha.appendChild(colunaItem);
        linha.appendChild(colunaCodigo);
        linha.appendChild(colunaDescricao);
        linha.appendChild(colunaMarca);
        linha.appendChild(colunaPreco);
        linha.appendChild(colulaFornecedor);

        colunaQtd.appendChild(btnQtd);
        linha.appendChild(colunaQtd);

        tabela.appendChild(linha);

        iC++;
      }
}

function popularTabela(dados){
    const tabela = document.getElementById('tabela-pecas');

    for (const item of dados.results) {
        const linha = document.createElement("tr");
        const colunaItem = document.createElement("td");
        const colunaCodigo = document.createElement("td");
        const colunaDescricao = document.createElement("td");
        const colunaMarca = document.createElement("td");
        const colunaPreco = document.createElement("td");
        const colulaFornecedor = document.createElement("td");
        const colunaQtd = document.createElement("td");

        var btnQtd = document.createElement("button");

        var preco = document.createElement("input");
        var btnPreco = document.createElement("button");

        linha.id = "linhas";    

        preco.type = "number";
        preco.value = "0";
        preco.min = "0";
        preco.id = "preco" + i;

        var id = item.peca.id; 

        btnQtd.setAttribute("onclick", "criarCotacao("+ item.peca.codigo + "," + item.fornecedor.id +")");  
                 
        colunaItem.textContent = i.toString();
        colunaCodigo.textContent = item.peca.codigo;
        colunaDescricao.textContent = item.peca.descricao;
        colunaMarca.textContent = item.peca.marca;
        colunaPreco.textContent = item.preco;
        colulaFornecedor.textContent = item.fornecedor.nomeFornecedor;
        btnQtd.textContent = "adicionar à cotação";
        btnPreco.textContent = "adicionar";

        linha.appendChild(colunaItem);
        linha.appendChild(colunaCodigo);
        linha.appendChild(colunaDescricao);
        linha.appendChild(colunaMarca);
        linha.appendChild(colunaPreco);
        linha.appendChild(colulaFornecedor);


            
            colunaQtd.appendChild(btnQtd);
            linha.appendChild(colunaQtd);

            btnPreco.setAttribute("onclick", "adicionarPecaFornec("+ id + "," + i +")");       
       

        tabela.appendChild(linha);

        i++;
      }

}

function filtrarPecas(Peca){
    /*pagina = 1
    for(var j = 1; j<=i; j++ ){
        var linhas = document.getElementById("linhas");
        linhas.remove();
    }*/
    localStorage.idPeca = Peca;
    //urlPecaFornecedor = "http://127.0.0.1:8000/pecaFornecedor/" + idFornececedor.idPeca+ "/"+ idFornececedor.idFornececedor + "/?ordering=preco&page="+ pagina +"&search="+str;
    //i=1;
    location.reload();
    //carregarDados()
}

function filtrarFornecedor(Fornececedor){
    /*pagina = 1
    for(var j = 1; j<=i; j++ ){
        var linhas = document.getElementById("linhas");
        linhas.remove();
    }*/
    localStorage.idFornececedor = Fornececedor;
   //urlPecaFornecedor = "http://127.0.0.1:8000/pecaFornecedor/" + idFornececedor.idPeca+ "/"+ idFornececedor.idFornececedor +  "/?ordering=preco&page="+ pagina +"&search="+str;
    //i=1;
    location.reload();
    //carregarDados()
}

async function getPedidoId(pecaCodigo){
    var urlAPI = "http://127.0.0.1:8000/orcamento/" + localStorage.orcamentoId + "/pedidos/0/?search=" + pecaCodigo;
    console.log(pecaCodigo)
    const resposta = await fetch(urlAPI, {
        method: "GET",
        headers: {
          "Content-type": "application/json; charset=UTF-8",
          "Authorization": "token " + localStorage.tokenUsuario
        }
      });

    const dadosJSON = await resposta.json();
    return dadosJSON
}

async function criarCotacao(pecaCodigo, fornecedor){
    pedido =  await getPedidoId(pecaCodigo)
    console.log(pedido,fornecedor)
    //fornecedor = document.getElementById("dropDownFornecedor").value;
    await fetch("http://127.0.0.1:8000/cotacoes/", {
        method: "POST",
        body: JSON.stringify({
            "codigoPedido": pedido.results[0].id,
            "codigoPecaFornecedor": fornecedor
        }),
        headers: {
        "Content-type": "application/json; charset=UTF-8",
        "Authorization": "token " + localStorage.tokenUsuario
        }
    })
        .then((response) => response.json())
        .then((json) => console.log(json));
}

async function removerCotacao(idCotacao){
    await fetch("http://127.0.0.1:8000/cotacao/"+idCotacao+"/", {
        method: 'DELETE',
        headers: {
            "Authorization": "token " + localStorage.tokenUsuario
        }
    })
    .then(res => res.text())
    .then(res => console.log(res));

        
}