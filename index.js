var urlOrcamento = "http://127.0.0.1:8000/orcamento/";

function myFunction() {
    var x = document.getElementById("navbar");
    if (x.className === "navbar") {
        x.className += " responsive";
    } else {
        x.className = "navbar";
    }
}
async function carregarDados() {
    login = document.getElementById('login');
    logout = document.getElementById('logout');
    if(localStorage.email == 'null'){
        login.hidden = false;
        logout.hidden = true;
    }else{       
        login.hidden = true;
        logout.hidden = false;
    }
    if (localStorage.tipo == 'cliente'){
        document.getElementById('geral').hidden = true
    }

    //const respostaOrcamento = await fetch(urlOrcamento);
   // const dadosOrcamento = await respostaOrcamento.json();
    //popularDropDownOrcamento(dadosOrcamento); 
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
    localStorage.email = 'null';
    localStorage.tokenUsuario = null;
    location.reload();
}