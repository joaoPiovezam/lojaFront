var orcamentoId = localStorage.orcamentoId;
var pecaCodigo = localStorage.pecaCodigo;

if (localStorage.pecaCodigo == null){
    pecaCodigo = '';
}
var precoTotal = 0.0;

async function  carregarUrl(){
    const urlA = await fetch('./rotaBack.json')
    dados = await urlA.json()
    return dados.API_URL
  }

var urlAPI = "";
var urlPacote = "";

async function carregarDados() {
    urlA = await carregarUrl()
    urlAPI =  urlA + "/orcamento/" + orcamentoId + "/pedidos/?search="
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

function formatarPreco(preco) {
    return ` ${preco.toFixed(2).replace(".", ",")}`;
}  

carregarDados();

function formatarData(data) {
    const dataFormatada = new Date(data);
    return `${dataFormatada.getDate()}/${dataFormatada.getMonth() + 1}/${dataFormatada.getFullYear()}`;
}

function popularTabelaPedidos(dados, dadosPacote){
    const tabela = document.getElementById("tabela");

    const linhaPecas = document.createElement("td");
    linhaPecas.textContent = "PEÇAS";
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
    colunaCodigo.textContent = "CODIGO";
    colunaDescricao.textContent = "PRODUTOS";
    colunaQuantidade.textContent = "QTDE.";    

    linha.appendChild(colunaItem);

        colunaCodigo.id = "colunaCodigo";
        linha.appendChild(colunaCodigo);
        linha.appendChild(colunaCodigo);
    linha.appendChild(colunaDescricao);
    linha.appendChild(colunaQuantidade);


        const colunaDataEntrega = document.createElement("td");
        colunaDataEntrega.textContent = "ENTREGA";
        linha.appendChild(colunaDataEntrega);
    

        const colulaPrecoUnit = document.createElement("td");
        const colunaPreco = document.createElement("td");

        colulaPrecoUnit.textContent = "PREÇO UN.";
        colunaPreco.textContent = 'PREÇO TOTAL';    

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
    
            colulaPrecoUnit.textContent = formatarPreco(item.peca.precoVenda * 1.2);
            colunaPreco.textContent = formatarPreco(item.peca.precoVenda * item.quantidade * 1.2);
    
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