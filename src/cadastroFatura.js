async function  carregarUrl(){
  const urlA = await fetch('./rotaBack.json')
  dados = await urlA.json()
  return dados.API_URL
}

var urlOrcamento = "";

async function carregarDados() {
  urlA = await carregarUrl()
    urlOrcamento = urlA + "/orcamentos/";
    const respostaOrcamento = await fetch(urlOrcamento, {
        method: "GET",
        headers: {
          "Content-type": "application/json; charset=UTF-8",
          "Authorization": "token " + localStorage.tokenUsuario
        }
      });
    const dadosOrcamento = await respostaOrcamento.json();
    popularDropDownOrcamento(dadosOrcamento); 
}

carregarDados();

function popularDropDownOrcamento(dados){
    const dropdownOrcamento = document.getElementById('dropdownOrcamento');

    for(const item of dados.results){
        const orcamento = document.createElement("option");
        orcamento.value = item.id;
        orcamento.textContent = item.codigo + ' - ' + item.client.nome_cliente;
        console.log(item.id);
        dropdownOrcamento.appendChild(orcamento);
    }
    dropdownOrcamento.value = localStorage.orcamentoId;
}
function atualizarOrcamento(orcamentoId){
    localStorage.orcamentoId = orcamentoId
    location.reload();
}


async function patch(){
  urlA = await carregarUrl()
    const formularioCadastro = document.getElementById('formularioCadastro');

    const dados = {
        frete: document.getElementById('frete').value,
        marcasEmbarque: document.getElementById('marcasEmbarque').value,
    };
    console.log('Dados do formulário:', dados);

     await fetch(urlA + "/orcamentos/" + localStorage.orcamentoId + "/", {
        method: "PATCH",
        body: JSON.stringify({
                "frete": dados.frete,
                "marcas_embarque": dados.marcasEmbarque
        }),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
          "Authorization": "token " + localStorage.tokenUsuario
        }
      })
        .then((response) => response.json())
        .then((json) => console.log(json));
    
}