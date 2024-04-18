var pagina = 1;
var i = 1;
var str = "";

function proximaPagina(){
    pagina += 1;
    urlAPI = "http://127.0.0.1:8000/peca/?page="+ pagina +"&search="+str;
    carregarDados()

}

var urlAPI = "http://127.0.0.1:8000/peca/?format=json&page="+ pagina;

async function carregarDados() {
        const resposta = await fetch(urlAPI);
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

function popularTabelaPecas(dados){
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

        linha.id = "linhas";
        
        qtd.type = "number";
        qtd.value = "0";
        qtd.min = "0";
        qtd.id =  "q" + i;      

        var id = item.id; 

        btn.setAttribute("onclick", "criarPedido("+ id + "," + i +")");            
        
        colunaQtd.appendChild(qtd);
        colunaQtd.appendChild(btn);

        colunaItem.textContent = i.toString();
        colunaCodigo.textContent = item.codigo;
        colunaDescricao.textContent = item.descricao;
        colunaMarca.textContent = item.marca;
        colunaPreco.textContent = formatarPreco(item.precoVenda * 1.2);
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
    urlAPI = "http://127.0.0.1:8000/peca/?page="+ pagina +"&search="+str;
    var p = document.getElementById("pesquisa");
    p.remove();
    i=1;
    carregarDados()
}

function criarPedido(idPeca, i){
    var qtd = document.getElementById('q' + i);

    console.log("pedido adicionado" + qtd.value);

    fetch("http://127.0.0.1:8000/pedidos/", {
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
            "codigoOrcamento": 1,
            "codigoCliente": 1
        }),
        headers: {
          "Content-type": "application/json; charset=UTF-8"
        }
      })
        .then((response) => response.json())
        .then((json) => console.log(json));
}
