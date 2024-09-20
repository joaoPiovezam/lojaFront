var urlAPI = "http://127.0.0.1:8000/orcamentos/";

async function carregarDados() {
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
    }

carregarDados();

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

async function addCondicao(){

    const dadosFatura = {
        cota: document.getElementById('cota').value,
        porcentagem: parseFloat(document.getElementById('porcentagem').value),
        data: document.getElementById('data').value,
        total: parseFloat(document.getElementById('total').value),
    };

    console.log(dadosFatura); // Exibe os dados da fatura no console
    await fetch("http://127.0.0.1:8000/condicoes/", {
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

}

function add(){
    addCondicao();
}