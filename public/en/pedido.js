var orcamentoId = localStorage.orcamentoId;
var pecaCodigo = localStorage.pecaCodigo;

function loadScript(url)
{    
    var head = document.getElementsByTagName('head')[0];
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = url;
    head.appendChild(script);
}

if (localStorage.pecaCodigo == null){
    pecaCodigo = '';
}
var precoTotal = 0.0;

async function  carregarUrl(){
    const urlA = await fetch('../rotaBack.json')
    dados = await urlA.json()
    return dados.API_URL
  }

var urlAPI = "";
var urlPacote = "";

async function carregarDados() {
    loadScript("../header.js");
    urlA = await carregarUrl()
    urlAPI =  urlA + "/orcamento/" + orcamentoId + "/pedidos/0/0/?search="
    urlPacote =  urlA + "/packOrcamento/" + orcamentoId;
    const resposta = await fetch(urlAPI, {
        method: "GET",
        //credentials: 'include',
        headers: {
          "Content-type": "application/json; charset=UTF-8",
          "Authorization": "token " + localStorage.tokenUsuario
        }
      });

    const respostaPacote = await fetch(urlPacote, {
        method: "GET",
        headers: {
          "Content-type": "application/json; charset=UTF-8",
          "Authorization": "token " + localStorage.tokenUsuario
        }
      });

    const dadosPacote = await respostaPacote.json();
    const dadosJSON = await resposta.json();
    popularTabelaPedidos(dadosJSON, dadosPacote);
}

async function converterDolar(){
    resposta =  await fetch("https://economia.awesomeapi.com.br/json/last/BRL-USD", {
      method: "GET",
      headers: {
        "Content-type": "application/json; charset=UTF-8"
      }
    });
    dados = await resposta.json();
    return dados.BRLUSD.ask
  }
  
  async function converterColon(){
    respostaReal =  await fetch("https://economia.awesomeapi.com.br/json/last/BRL-USD", {
      method: "GET",
      headers: {
        "Content-type": "application/json; charset=UTF-8"
      }
    });
    dadosReal = await respostaReal.json();
  
    respostaColon =  await fetch("https://economia.awesomeapi.com.br/json/last/USD-CRC", {
      method: "GET",
      headers: {
        "Content-type": "application/json; charset=UTF-8"
      }
    });
    dadosColon = await respostaColon.json();
  
  
    return dadosColon.USDCRC.ask * dadosReal.BRLUSD.ask
  }
  
  async function converterEuro(){
    resposta =  await fetch("https://economia.awesomeapi.com.br/json/last/BRL-EUR", {
      method: "GET",
      headers: {
        "Content-type": "application/json; charset=UTF-8"
      }
    });
    dados = await resposta.json();
    return dados.BRLEUR.ask
  }
  
  async function converterMoeda(valor){
    valorConvertido = 0
    switch(localStorage.Moeda) {
      case 'USD':
        valorConvertido = await converterDolar() * valor;
        break;
      case 'EUR':
        valorConvertido = await converterEuro() * valor;
        break;
      case 'CRC':
        valorConvertido = await converterColon() * valor;
        break;
      case 'BRL':
        valorConvertido = valor;
        break;
    }
    return valorConvertido
  }
  
  async function formatarPreco(preco) {
      var precoConvertido = await converterMoeda(preco)
      switch(localStorage.Moeda){
        case 'USD':
          return ` US$ ${precoConvertido.toFixed(2).replace(",", ".")}`;
        case 'EUR':
          return ` € ${precoConvertido.toFixed(2).replace(".", ",")}`;
        case 'CRC':
          return ` ₡ ${precoConvertido.toFixed(2).replace(".", ",")}`;
        case 'BRL':
          return ` R$ ${precoConvertido.toFixed(2).replace(".", ",")}`;
      }
  
  }  

carregarDados();

function formatarData(data) {
    const dataFormatada = new Date(data);
    return `${dataFormatada.getDate()}/${dataFormatada.getMonth() + 1}/${dataFormatada.getFullYear()}`;
}

async function popularTabelaPedidos(dados, dadosPacote){
    const tabela = document.getElementById("tabela");

    const linhaPecas = document.createElement("td");
    linhaPecas.textContent = "PARTS";
    linhaPecas.colSpan = 10;
    linhaPecas.id = "linhaPecas";
    tabela.appendChild(linhaPecas);
    
    const linha = document.createElement("tr");
    const colunaItem = document.createElement("td");
    const colunaCodigo = document.createElement("td");
    const colunaDescricao = document.createElement("td");
    const colunaQuantidade = document.createElement("td");

    colunaItem.setAttribute('width' , '10px')  
    colunaDescricao.setAttribute('width', '50px');    

    colunaItem.textContent = "ITEM";
    colunaCodigo.textContent = "CODE";
    colunaDescricao.textContent = "PRODUCTS";
    colunaQuantidade.textContent = "QTY.";    

    linha.appendChild(colunaItem);

        colunaCodigo.id = "colunaCodigo";
        linha.appendChild(colunaCodigo);
        linha.appendChild(colunaCodigo);
    linha.appendChild(colunaDescricao);
    linha.appendChild(colunaQuantidade);


        const colunaDataEntrega = document.createElement("td");
        colunaDataEntrega.textContent = "DELIVERY";
        linha.appendChild(colunaDataEntrega);
    

        const colulaPrecoUnit = document.createElement("td");
        const colunaPreco = document.createElement("td");

        colulaPrecoUnit.textContent = "UNIT PRICE";
        colunaPreco.textContent = 'TOTAL PRICE';    

        linha.appendChild(colulaPrecoUnit);
        linha.appendChild(colunaPreco); 

        const colunaVolume = document.createElement("td"); 
        colunaVolume.textContent = "volume";
        linha.appendChild(colunaVolume);
    
    
    tabela.appendChild(linha);

    var i = 1
    for (const item of dados.results) {
        const linha = document.createElement("tr");
        const colunaItem = document.createElement("td");
        const colunaCodigo = document.createElement("td");
        const colunaDescricao = document.createElement("td");
        const colunaQuantidade = document.createElement("td");               

        colunaItem.textContent = i.toString();
        colunaCodigo.textContent = item.peca.codigo;
        colunaDescricao.textContent = item.peca.descricao;
        colunaQuantidade.textContent = item.quantidade;                 

        precoTotal  += item.peca.precoVenda * item.quantidade;     

        linha.appendChild(colunaItem);
        linha.appendChild(colunaCodigo);
        linha.appendChild(colunaDescricao); 
        linha.appendChild(colunaQuantidade); 

            const colunaDataEntrega = document.createElement("td");
            colunaDataEntrega.textContent = formatarData(item.data_entrega);
            linha.appendChild(colunaDataEntrega);

            const colulaPrecoUnit = document.createElement("td");
            const colunaPreco = document.createElement("td");
    
            colulaPrecoUnit.textContent = await formatarPreco(item.peca.preco_venda * 1.2);
            colunaPreco.textContent = await formatarPreco(item.peca.preco_venda * item.quantidade * 1.2);
    
            linha.appendChild(colulaPrecoUnit);
            linha.appendChild(colunaPreco); 

            const colunaVolume = document.createElement("td"); 
            colunaVolume.textContent = item.volume;
            linha.appendChild(colunaVolume);

        tabela.appendChild(linha);

        i++;
      }

}

function vizualizarFatura(){
    window.open('/fatura.html', '_blank').focus();
}

function vizualizarPacotes(){
    window.open('/packingList.html', '_blank').focus();
}