var urlOrcamento = "http://127.0.0.1:8000/orcamentos/";

function myFunction() {
    var x = document.getElementById("navbar");
    if (x.className === "navbar") {
        x.className += " responsive";
    } else {
        x.className = "navbar";
    }
}
async function carregarDados() {
    const respostaOrcamento = await fetch(urlOrcamento);
    const dadosOrcamento = await respostaOrcamento.json();
    popularDropDownOrcamento(dadosOrcamento); 
}

carregarDados()

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

function redirecionarFatura(){
    localStorage.orcamentoId
}