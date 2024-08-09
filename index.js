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

    if(localStorage.emailUsuario == 'null'){
        document.getElementById("login").setAttribute("hidden","false");
        document.getElementById("logout").setAttribute("hidden","true");
    }else{
        document.getElementById("login").setAttribute("hidden","true");
        document.getElementById("logout").setAttribute("hidden","false");
    }
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

function logIn(){
    location.href = "/login.html";
}

function logOut(){
    console.log("teste")
    localStorage.emailUsuario = null;
    localStorage.tokenUsuario = null;
    location.reload();
}