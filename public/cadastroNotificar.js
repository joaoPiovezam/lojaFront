async function  carregarUrl(){
    const urlA = await fetch('./rotaBack.json')
    dados = await urlA.json()
    return dados.API_URL
  }

  function loadScript(url)
  {    
      var head = document.getElementsByTagName('head')[0];
      var script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = url;
      head.appendChild(script);
  }

var urlAPI = "";

async function carregarDados() {
  //loadScript("header.js");
    urlA = await carregarUrl()
    /*urlAPI = urlA + "/orcamentos/"
        const resposta = await fetch(urlAPI, {
            method: "GET",
            headers: {
              "Content-type": "application/json; charset=UTF-8",
              "Authorization": "token " + localStorage.tokenUsuario
            }
          });
        const dadosJSON = await resposta.json();
        //popularTabela(dadosJSON); 
        popularDropDownOrcamento(dadosJSON);*/ 
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
}

async function addNotificar(){
    urlA = await carregarUrl()
    const formularioCadastro = document.getElementById('formularioCadastro');

    //formularioCadastro.addEventListener('submit', async function(event) {
    //event.preventDefault(); // Evita o envio padrão do formulário

    const dadosNotificar = {
        nome: document.getElementById('nome').value,
        telefone: document.getElementById('telefone').value,
        email: document.getElementById('email').value,
    };

    console.log(dadosNotificar); // Exibe os dados da fatura no console
    await fetch(urlA + "/notificar/", {
        method: "POST",
        body: JSON.stringify({
            "nome": dadosNotificar.nome,
            "telefone": dadosNotificar.telefone,
            "email": dadosNotificar.email,
            "orcamento": localStorage.orcamentoId
        }),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
          "Authorization": "token " + localStorage.tokenUsuario
        }
      })
        .then((response) => response.json())
        .then((json) => console.log(json));
    //});

}

function add(){
    addNotificar();
}