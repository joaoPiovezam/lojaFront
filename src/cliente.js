async function  carregarUrl(){
  const urlA = await fetch('./rotaBack.json')
  dados = await urlA.json()
  return dados.API_URL
} 

var urlAPI = "";

async function carregarDados() {
  urlA = await carregarUrl()
  urlAPI = urlA + "/clientes/";
        const resposta = await fetch(urlAPI, {
            method: "GET",
            headers: {
              "Content-type": "application/json; charset=UTF-8",
              "Authorization": "token " + document.cookie.jwt
            }
          });
        const dadosJSON = await resposta.json();
        popularTabela(dadosJSON); 
    }

carregarDados();

function popularTabela(dados){
    const dropDownClientes = document.getElementById('dropDownClientes');

    for(const item of dados.results){
        const cliente = document.createElement("option");
        cliente.value = item.id;
        cliente.textContent = item.nomeCliente + ' - ' + item.cpfCnpj;
        console.log(item.nomeCliente + ' - ' + item.cpfCnpj);
        dropDownClientes.appendChild(cliente);
    }
}