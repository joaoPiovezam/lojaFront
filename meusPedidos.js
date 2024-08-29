var pagina = 1;
var i = 1;
var str = "";
var id = 0;
var tipo = document.getElementById("pagina");
var urlAPI = "http://127.0.0.1:8000/orcamentos/?format=json&page="+ pagina;

//var urlAPI = "http://127.0.0.1:8000/orc/";

function loadScript(url)
{    
    var head = document.getElementsByTagName('head')[0];
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = url;
    head.appendChild(script);
}

function proximaPagina(){
    pagina += 1;
    urlAPI = "http://127.0.0.1:8000/orcamentos/?format=json/?page="+ pagina +"&search="+str;
    carregarDados()

}

async function carregarDados() {
        urlAPI = "http://127.0.0.1:8000/orcamento/" + localStorage.email + "/";
        const resposta = await fetch(urlAPI, {
            method: "GET",
            headers: {
              "Content-type": "application/json; charset=UTF-8",
              "Authorization": "token " + localStorage.tokenUsuario
            }
          });
        const dadosJSON = await resposta.json();
        //loadScript("cliente.js")
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
    const colunaDataEmissao = document.createElement("td");
    const colunaDataValidade = document.createElement("td");
    const colunaTipoEntrega = document.createElement("td");
    const colunaFrete = document.createElement("td");
    const colunaMarcasEmbarque = document.createElement("td");
    const colunaNomeEntrega = document.createElement("td");
    const colunaCnpjEntrega = document.createElement("td");
    const colunaEnderecoEntrega = document.createElement("td");
    const colunaCidadeEntrega = document.createElement("td");
    const colunaPaisEntrega = document.createElement("td");
    
    linha.id = "linhas";

    colunaItem.textContent = "ITEM";
    colunaCodigo.textContent = "CODIGO";
    colunaDataEmissao .textContent = "Data Emissão";
    colunaDataValidade.textContent = "Data Validade";
    colunaTipoEntrega.textContent = "Tipo Entrega";
    colunaFrete.textContent = "Frete";
    colunaMarcasEmbarque.textContent = "Marcas Embarque";
    colunaNomeEntrega.textContent = "Nome Entrega";
    colunaCnpjEntrega.textContent = "Cnpj Entrega";
    colunaEnderecoEntrega.textContent = "Endereco Entrega";
    colunaCidadeEntrega.textContent = "Cidade Entrega";
    colunaPaisEntrega.textContent = "Pais Entrega";

    linha.appendChild(colunaItem);
    linha.appendChild(colunaCodigo);
    linha.appendChild(colunaDataEmissao);
    linha.appendChild(colunaDataValidade);
    linha.appendChild(colunaTipoEntrega);
    linha.appendChild(colunaFrete);
    linha.appendChild(colunaMarcasEmbarque);
    linha.appendChild(colunaNomeEntrega);
    linha.appendChild(colunaCnpjEntrega);
    linha.appendChild(colunaEnderecoEntrega);
    linha.appendChild(colunaCidadeEntrega);
    linha.appendChild(colunaPaisEntrega);

    tabela.appendChild(linha);
}

function popularTabela(dados){
    const botao = document.getElementById("atualizar");
    botao.style.display = "none";
    const tabela = document.getElementById("tabela-pecas");
    for (const item of dados.results) {
        const linha = document.createElement("tr");
        const colunaBtnVizualizar = document.createElement("td");
        const colunaItem = document.createElement("td");
        const colunaCodigo = document.createElement("td");
        const colunaDataEmissao = document.createElement("td");
        const colunaDataValidade = document.createElement("td");
        const colunaTipoEntrega = document.createElement("td");
        const colunaFrete = document.createElement("td");
        const colunaMarcasEmbarque = document.createElement("td");
        const colunaNomeEntrega = document.createElement("td");
        const colunaCnpjEntrega = document.createElement("td");
        const colunaEnderecoEntrega = document.createElement("td");
        const colunaCidadeEntrega = document.createElement("td");
        const colunaPaisEntrega = document.createElement("td");
        if (localStorage.tipo == 'cliente'){
            colunaBtnPedido.hidden = true
        }
      
        var qtd = document.createElement("input");
        var btn = document.createElement("button");
        btn.id = "preencher"
        linha.id = "linhas";

        const btnVizualizar = document.createElement("button");

        colunaBtnVizualizar.append(btnVizualizar);

        btnVizualizar.textContent = "Ver Pedido";

        btnVizualizar.id = item.id;

        var id = item.id; 

        btn.setAttribute("onclick", "preencherForm("+ JSON.stringify(item) +")");            
        btnVizualizar.setAttribute("onclick", "vizualizarPedido("+ btnVizualizar.id +")");                       

        colunaItem.textContent = i.toString();
        colunaCodigo.textContent = item.codigo;
        colunaDataEmissao.textContent = item.dataEmissao;
        colunaDataValidade.textContent = item.dataValidade;
        colunaTipoEntrega.textContent = item.tipoEntrega;
        colunaFrete.textContent = item.frete;
        colunaMarcasEmbarque.textContent = item.marcasEmbarque;
        colunaNomeEntrega.textContent = item.nomeEntrega;
        colunaCnpjEntrega.textContent = item.cnpjEntrega;
        colunaEnderecoEntrega.textContent = item.enderecoEntrega;
        colunaCidadeEntrega.textContent = item.cidadeEntrega;
        colunaPaisEntrega.textContent = item.paisEntrega;
        btn.textContent = "adicionar ao orçamento";

        linha.appendChild(colunaItem);
        linha.appendChild(colunaCodigo);
        linha.appendChild(colunaDataEmissao);
        linha.appendChild(colunaDataValidade);
        linha.appendChild(colunaTipoEntrega);
        linha.appendChild(colunaFrete);
        linha.appendChild(colunaMarcasEmbarque);
        linha.appendChild(colunaNomeEntrega);
        linha.appendChild(colunaCnpjEntrega);
        linha.appendChild(colunaEnderecoEntrega);
        linha.appendChild(colunaCidadeEntrega);
        linha.appendChild(colunaPaisEntrega);
        linha.appendChild(colunaBtnVizualizar);
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
    urlAPI = "http://127.0.0.1:8000/orcamentos/?format=json/?page="+ pagina //+"&search="+str;
    var p = document.getElementById("pesquisa");
    p.remove();
    i=1;
    carregarDados();
}



function vizualizarPedido(orcamentoId){
    localStorage.orcamentoId = orcamentoId;
    window.open('/pedido.html', '_blank').focus();
}