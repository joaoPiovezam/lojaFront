var urlAPI = "http://127.0.0.1:8000/clientes/";

async function carregarDados() {
        const resposta = await fetchfetch(urlAPI, {
            method: "GET",
            headers: {
              "Content-type": "application/json; charset=UTF-8",
              "Authorization": "token " + localStorage.tokenUsuario
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