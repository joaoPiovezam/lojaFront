async function  carregarUrl(){
  const urlA = await fetch('./rotaBack.json')
  dados = await urlA.json()
  return dados.API_URL
}

var urlOrcamento = "";
var urlEstoque = '';

async function carregarDados() {
  urlA = await carregarUrl()
  urlOrcamento = urlA + "/orcamentos/"
  urlEstoque = urlA + "/estoquePecas/";
        const respostaOrcamento = await fetch(urlOrcamento, {
            method: "GET",
            headers: {
              "Content-type": "application/json; charset=UTF-8",
              "Authorization": "token " + localStorage.tokenUsuario
            }
          });
        const dadosOrcamento = await respostaOrcamento.json();
        const respostaEstoque = await fetch(urlEstoque, {
            method: "GET",
            headers: {
              "Content-type": "application/json; charset=UTF-8",
              "Authorization": "token " + localStorage.tokenUsuario
            }
          });
        const dadosEstoque = await respostaEstoque.json();
        popularDropDown(dadosOrcamento); 
        popularTabela(dadosEstoque); 
    }

carregarDados();

function formatarData(data) {
    const dataFormatada = new Date(data);
    return `${dataFormatada.getDate()}/${dataFormatada.getMonth() + 1}/${dataFormatada.getFullYear()}`;
}

var i = 1;
function popularTabela(dados){
    const tabela = document.getElementById("tabela");
    const linha = document.createElement("tr");
    const colunaItem = document.createElement("td");
    const colunaQuantidade = document.createElement("td");
    const colunaCodigo = document.createElement("td");
    const colunaDescricao = document.createElement("td");
    const colunaCliente = document.createElement("td");
    const colunaOrcamento = document.createElement("td");
    const colunaDataEntrada = document.createElement("td");
    const colunaDataSaida = document.createElement("td");

    colunaItem.textContent = "Item";
    colunaQuantidade.textContent = "Quantidade";
    colunaCodigo.textContent = "Codigo";
    colunaDescricao.textContent = "Descricao";
    colunaCliente.textContent = "Cliente";
    colunaOrcamento.textContent = "Orcamento";
    colunaDataEntrada.textContent = "Data Entrada";
    colunaDataSaida.textContent = 'Data Saida';

    linha.appendChild(colunaItem);
    linha.appendChild(colunaQuantidade);
    linha.appendChild(colunaCodigo);
    linha.appendChild(colunaDescricao);
    linha.appendChild(colunaCliente);
    linha.appendChild(colunaOrcamento);
    linha.appendChild(colunaDataEntrada);
    linha.appendChild(colunaDataSaida);

    tabela.appendChild(linha);

    for(const item of dados.results){
        const linha = document.createElement("tr");
        const colunaItem = document.createElement("td");
        const colunaQuantidade = document.createElement("td");
        const colunaCodigo = document.createElement("td");
        const colunaDescricao = document.createElement("td");
        const colunaCliente = document.createElement("td");
        const colunaOrcamento = document.createElement("td");
        const colunaDataEntrada = document.createElement("td");
        const colunaDataSaida = document.createElement("td");
    
        colunaItem.textContent = i;
        //console.log(item);
        colunaCodigo.textContent = item.pedido.peca.codigo;
        if (item.estado == "1"){
          colunaQuantidade.textContent =  "-" + item.pedido.quantidade.toString();
        }else{
          colunaQuantidade.textContent = item.pedido.quantidade;
        }        
        colunaDescricao.textContent = item.pedido.peca.descricao;
        colunaCliente.textContent = item.pedido.orcamento.client.nome_cliente;
        colunaOrcamento.textContent = item.pedido.orcamento.codigo;
        colunaDataEntrada.textContent = formatarData(item.data_entrada);
        colunaDataSaida.textContent = formatarData(item.data_saida);
    
        linha.appendChild(colunaItem);
        linha.appendChild(colunaQuantidade);
        linha.appendChild(colunaCodigo);
        linha.appendChild(colunaDescricao);
        linha.appendChild(colunaCliente);
        linha.appendChild(colunaOrcamento);
        linha.appendChild(colunaDataEntrada);
        linha.appendChild(colunaDataSaida);
    
        tabela.appendChild(linha);
        i++;
    }
}

function popularDropDown(dados){
    const dropDownOrcamento = document.getElementById('dropDownOrcamento');

    for(const item of dados.results){
        const opcao = document.createElement("option");
        opcao.value = item.id;
        opcao.textContent = item.codigo + ' - ' + item.client.nome_cliente;
        console.log(item.id);
        dropDownOrcamento.appendChild(opcao);
    }
}

async function add(){
  urlA = await carregarUrl()
    const formularioEstoque = document.getElementById('formularioEstoque');

    formularioEstoque.addEventListener('submit', async function(event) {
        event.preventDefault(); // Evita o envio padrão do formulário
    
        codigoOrcamento =  document.getElementById('dropDownOrcamento').value,

        await fetch(urlA + "/addEstoque/" + codigoOrcamento, {
            method: "GET",
            headers: {
              "Content-type": "application/json; charset=UTF-8",
              "Authorization": "token " + localStorage.tokenUsuario
            }
          })
            .then((response) => response.json())
            .then((json) => console.log(json));
    });

}

function addEstoque(){
    add();
}