var pagina = 1;
var i = 1;
var iC = 1;
var str = "";
var id = 0;
var idPeca = 0;
var idFornececedor = 0;

function loadScript(url){    
    var head = document.getElementsByTagName('head')[0];
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = url;
    head.appendChild(script);
}

function proximaPagina(){
    pagina += 1;
    urlPecaFornecedor = "http://127.0.0.1:8000/pecaFornecedor/" +idPeca+ "/"+ idFornececedor + "/?ordering=preco&page="+ pagina +"&search="+str;
    carregarDados();

}

function popularDropDownOrcamento(dados){
    const dropdownOrcamento = document.getElementById('dropdownOrcamento');

    for(const item of dados.results){
        const orcamento = document.createElement("option");
        orcamento.value = item.id;
        orcamento.textContent = item.codigo + ' - ' + item.client.nomeCliente;
        console.log(item.id);
        dropdownOrcamento.appendChild(orcamento);
    }
}
function atualizarOrcamento(orcamentoId){
    localStorage.orcamentoId = orcamentoId;
    location.reload();
}

var urlPecaFornecedor = "http://127.0.0.1:8000/pecaFornecedor/0/0/?ordering=preco";
var urlPedidos = "http://127.0.0.1:8000/orcamento/"+ localStorage.orcamentoId +"/pedidos/";
var urlFornecedor = "http://127.0.0.1:8000/fornecedor/";
var urlCotacao = "http://127.0.0.1:8000/cotacaoOrcamento/"+ localStorage.orcamentoId + "/";
var urlOrcamento = "http://127.0.0.1:8000/orcamentos/";

async function carregarDados() { 
        const respostaPecas = await fetch(urlPecaFornecedor);
        const dadosJSONPecas = await respostaPecas.json();
        const respostaOrcamento = await fetch(urlOrcamento);
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

async function popularDropDownFornecedor(){
    const respostaFornecedor = await fetch(urlFornecedor);
    const dados = await respostaFornecedor.json();
    const dropDownFornecedores = document.getElementById('dropDownFornecedor');

    for(const item of dados.results){
        const fornecedor = document.createElement("option");
        fornecedor.value = item.id;
        fornecedor.textContent = item.nomeFornecedor + ' - ' + item.cpfCnpj;
        console.log(item.nomeFornecedor + ' - ' + item.cpfCnpj);
        dropDownFornecedores.appendChild(fornecedor);
    }
}

async function popularDropDownPedidos(){
    const respostaPedidos = await fetch(urlPedidos);
    const dados = await respostaPedidos.json();
    const dropDownpedido = document.getElementById('dropDownPedidos');

    for(const item of dados.results){
        const pedido = document.createElement("option");
        pedido.value = item.id;
        pedido.textContent = item.peca.codigo + ' - ' + item.peca.descricao;
        console.log(item.nomepedido + ' - ' + item.cpfCnpj);
        dropDownpedido.appendChild(pedido);
    }
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
    const resposta = await fetch(urlCotacao);
    const dados = await resposta.json();

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
        colunaCodigo.textContent = item.pecaFornecedor.peca.codigo;
        colunaDescricao.textContent = item.pecaFornecedor.peca.descricao;
        colunaMarca.textContent = item.pecaFornecedor.peca.marca;
        colunaPreco.textContent = item.pecaFornecedor.preco;
        colulaFornecedor.textContent = item.pecaFornecedor.fornecedor.nomeFornecedor;
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

        btnQtd.setAttribute("onclick", "criarCotacao()");  
                 
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

function filtrarPecas(){
    pagina = 1
    for(var j = 1; j<=i; j++ ){
        var linhas = document.getElementById("linhas");
        linhas.remove();
    }
    idPeca = document.getElementById("dropDownPedidos").value;
    urlPecaFornecedor = "http://127.0.0.1:8000/pecaFornecedor/" +idPeca+ "/"+ idFornececedor + "/?ordering=preco&page="+ pagina +"&search="+str;
    i=1;
    carregarDados()
}

function filtrarFornecedor(){
    pagina = 1
    for(var j = 1; j<=i; j++ ){
        var linhas = document.getElementById("linhas");
        linhas.remove();
    }
    idFornececedor = document.getElementById("dropDownFornecedor").value;
    urlPecaFornecedor = "http://127.0.0.1:8000/pecaFornecedor/" +idPeca+ "/"+ idFornececedor +  "/?ordering=preco&page="+ pagina +"&search="+str;
    i=1;
    carregarDados()
}

function criarCotacao(){
    pedido =  document.getElementById("dropDownPedidos").value;
    fornecedor = document.getElementById("dropDownFornecedor").value;
    fetch("http://127.0.0.1:8000/cotacao/", {
        method: "POST",
        body: JSON.stringify({
            "codigo": "1",
            "codigoPedido": pedido,
            "codigoPecaFornecedor": fornecedor
        }),
        headers: {
        "Content-type": "application/json; charset=UTF-8"
        }
    })
        .then((response) => response.json())
        .then((json) => console.log(json));
}

function removerCotacao(idCotacao){
    fetch("http://127.0.0.1:8000/cotacao/"+idCotacao+"/", {
        method: 'DELETE',
    })
    .then(res => res.text())
    .then(res => console.log(res));

        
}