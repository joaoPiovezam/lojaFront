async function  carregarUrl(){
  const urlA = await fetch('./rotaBack.json')
  dados = await urlA.json()
  return dados.API_URL
}

var urlAPI = "";
var urlCondicao = "";
var total = 0.0;

function loadScript(url)
{    
    var head = document.getElementsByTagName('head')[0];
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = url;
    head.appendChild(script);
}

async function carregarDados() {
      loadScript("header.js");
        urlA = await carregarUrl()
        urlAPI = urlA + "/orcamentos/"
        urlCondicao = urlA + "/condicao/"+ localStorage.orcamentoId + "/";
        const resposta = await fetch(urlAPI, {
            method: "GET",
            headers: {
              "Content-type": "application/json; charset=UTF-8",
              "Authorization": "token " + localStorage.tokenUsuario
            }
          });
        const dadosJSON = await resposta.json();
        //popularTabela(dadosJSON); 
        popularDropDownOrcamento(dadosJSON);

        const respostaCondicao = await fetch(urlCondicao, {
          method: "GET",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
            "Authorization": "token " + localStorage.tokenUsuario
          }
        });
      const dadosCondicao = await respostaCondicao.json(); 
      popularTabelaCondicao(dadosCondicao)
    }

carregarDados();

function formatarData(data) {
  const dataFormatada = new Date(data);
  return `${dataFormatada.getDate()}/${dataFormatada.getMonth() + 1}/${dataFormatada.getFullYear()}`;
}

function formatarPreco(preco) {
  return ` ${preco.toFixed(2).replace(".", ",")}`;
}  

function popularDropDownOrcamento(dados){
    const dropdownOrcamento = document.getElementById('dropdownOrcamento');

    for(const item of dados.results){
        const orcamento = document.createElement("option");
        orcamento.value = item.id;
        orcamento.textContent = item.codigo + ' - ' + item.client.nome_cliente;
        console.log(item.id);
        dropdownOrcamento.appendChild(orcamento);
    }
    dropdownOrcamento.value = localStorage.orcamentoId
}

async function addCondicao(){
  urlA = await carregarUrl()
    const dadosFatura = {
        cota: document.getElementById('cota').value,
        porcentagem: parseFloat(document.getElementById('porcentagem').value),
        data: document.getElementById('data').value
    };

    if((parseFloat(dadosFatura.porcentagem)+ total) <= 100){

    console.log(dadosFatura); // Exibe os dados da fatura no console
    await fetch(urlA + "/condicoes/", {
        method: "POST",
        body: JSON.stringify({
            "status": 1,
            "cota": dadosFatura.cota,
            "porcentagem": dadosFatura.porcentagem,
            "data": dadosFatura.data,
            "total": 0,
            "orcamento": localStorage.orcamentoId
        }),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
          "Authorization": "token " + localStorage.tokenUsuario
        }
      })
        .then((response) => response.json())
        .then((json) => console.log(json));
    }else{
      document.getElementById('alerta').classList.remove('d-none');
    }

}

function add(){
    addCondicao();
}

function popularTabelaCondicao(dados){
  const tabela = document.getElementById("tabela-condicao");

  const linhaCondicao = document.createElement("td");
  linhaCondicao.textContent = "CONDIÇÕES DE PAGAMENTO";
  linhaCondicao.colSpan = 5;
  linhaCondicao.id = "linhaCondicao";
  tabela.appendChild(linhaCondicao);

  const linha = document.createElement("tr");
  const colunaCondicao = document.createElement("td");
  const colunaPorcetagem = document.createElement("td");
  const colunaData = document.createElement("td");


  colunaCondicao.textContent = "CONDIÇÕES DE PAGAMENTO";
  colunaPorcetagem.textContent = "%";
  colunaData.textContent = "DATA";

  linha.appendChild(colunaCondicao);
  linha.appendChild(colunaPorcetagem);
  linha.appendChild(colunaData);

  tabela.appendChild(linha);


  for (const item of dados.results) {
      const linha = document.createElement("tr");
      const colunaCondicao = document.createElement("td");
      const colunaPorcetagem = document.createElement("td");
      const colunaData = document.createElement("td");

     
      colunaCondicao.textContent = item.cota;
      colunaPorcetagem.textContent = item.porcentagem;
      colunaData.textContent =  formatarData(item.data);   

      linha.appendChild(colunaCondicao);
      linha.appendChild(colunaPorcetagem);
      linha.appendChild(colunaData);

      tabela.appendChild(linha);
      total += parseFloat(item.porcentagem)
    }
  const linha1 = document.createElement("tr");
  const colunaTotal = document.createElement("td")
  colunaTotal.textContent = total + "%"

  linha1.appendChild(colunaTotal)

  tabela.appendChild(linha1)
}