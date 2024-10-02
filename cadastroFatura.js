var urlOrcamento = "http://127.0.0.1:8000/orcamentos/";

async function carregarDados() {
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
        orcamento.textContent = item.codigo + ' - ' + item.client.nomeCliente;
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
    const formularioCadastro = document.getElementById('formularioCadastro');

    const dados = {
        frete: document.getElementById('frete').value,
        marcasEmbarque: document.getElementById('marcasEmbarque').value,
    };
    console.log('Dados do formulário:', dados);

     await fetch("http://127.0.0.1:8000/orcamentos/" + localStorage.orcamentoId + "/", {
        method: "PATCH",
        body: JSON.stringify({
                "frete": dados.frete,
                "marcasEmbarque": dados.marcasEmbarque
        }),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
          "Authorization": "token " + localStorage.tokenUsuario
        }
      })
        .then((response) => response.json())
        .then((json) => console.log(json));
    
}