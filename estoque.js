var urlPedidos = "http://127.0.0.1:8000/pedidoPeca/";
var urlEstoque = 'http://127.0.0.1:8000/estoquePecas/';

async function carregarDados() {
        const respostaPedidos = await fetch(urlPedidos, {
            method: "GET",
            headers: {
              "Content-type": "application/json; charset=UTF-8",
              "Authorization": "token " + localStorage.tokenUsuario
            }
          });
        const dadosPedidos = await respostaPedidos.json();
        const respostaEstoque = await fetch(urlEstoque, {
            method: "GET",
            headers: {
              "Content-type": "application/json; charset=UTF-8",
              "Authorization": "token " + localStorage.tokenUsuario
            }
          });
        const dadosEstoque = await respostaEstoque.json();
        popularDropDown(dadosPedidos); 
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
    const colunaCodigo = document.createElement("td");
    const colunaDescricao = document.createElement("td");
    const colunaCliente = document.createElement("td");
    const colunaOrcamento = document.createElement("td");
    const colunaDataEntrada = document.createElement("td");
    const colunaDataSaida = document.createElement("td");

    colunaItem.textContent = "Item";
    colunaCodigo.textContent = "Codigo";
    colunaDescricao.textContent = "Descricao";
    colunaCliente.textContent = "Cliente";
    colunaOrcamento.textContent = "Orcamento";
    colunaDataEntrada.textContent = "Data Entrada";
    colunaDataSaida.textContent = 'Data Saida';

    linha.appendChild(colunaItem);
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
        const colunaCodigo = document.createElement("td");
        const colunaDescricao = document.createElement("td");
        const colunaCliente = document.createElement("td");
        const colunaOrcamento = document.createElement("td");
        const colunaDataEntrada = document.createElement("td");
        const colunaDataSaida = document.createElement("td");
    
        colunaItem.textContent = i;
        console.log(item);
        colunaCodigo.textContent = item.pedido.peca.codigo;
        colunaDescricao.textContent = item.pedido.peca.descricao;
        colunaCliente.textContent = item.pedido.orcamento.client.nomeCliente;
        colunaOrcamento.textContent = item.pedido.orcamento.codigo;
        colunaDataEntrada.textContent = formatarData(item.dataEntrada);
        colunaDataSaida.textContent = formatarData(item.dataSaida);
    
        linha.appendChild(colunaItem);
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
    const dropDownPecas = document.getElementById('dropDownPecas');

    for(const item of dados.results){
        const cliente = document.createElement("option");
        cliente.value = item.id;
        cliente.textContent = item.orcamento.codigo + ' - ' + item.peca.codigo + ' - ' + item.peca.descricao;
        console.log(item.id);
        dropDownPecas.appendChild(cliente);
    }
}

function add(){
    const formularioEstoque = document.getElementById('formularioEstoque');

    formularioEstoque.addEventListener('submit', function(event) {
        event.preventDefault(); // Evita o envio padrão do formulário
    
        const dadosEstoque = {
            codigoPedido: document.getElementById('dropDownPecas').value,
            dataEntrada: document.getElementById('dataEntrada').value,
            dataSaida: document.getElementById('dataSaida').value
        };
    
        console.log(dadosEstoque); // Exibe os dados do pedido no console
        fetch("http://127.0.0.1:8000/estoque/", {
            method: "POST",
            body: JSON.stringify({
                "dataEntrada": dadosEstoque.dataEntrada,
                "dataSaida": dadosEstoque.dataSaida,
                "codigoPedido": dadosEstoque.codigoPedido
            }),
            headers: {
              "Content-type": "application/json; charset=UTF-8"
            }
          })
            .then((response) => response.json())
            .then((json) => console.log(json));
    });

}

function addEstoque(){
    add();
}