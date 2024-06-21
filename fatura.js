var urlAPI = "http://127.0.0.1:8000/orcamentos/";

async function carregarDados() {
        const resposta = await fetch(urlAPI);
        const dadosJSON = await resposta.json();
        popularTabela(dadosJSON); 
    }

carregarDados();


function popularTabela(dados){

}

function addCondicao(){
    const formularioCadastro = document.getElementById('formularioCadastro');

    formularioCadastro.addEventListener('submit', function(event) {
    event.preventDefault(); // Evita o envio padrão do formulário

    const dadosFatura = {
        cota: document.getElementById('cota').value,
        porcentagem: parseFloat(document.getElementById('porcentagem').value),
        data: document.getElementById('data').value,
        total: parseFloat(document.getElementById('total').value),
    };

    console.log(dadosFatura); // Exibe os dados da fatura no console
    fetch("http://127.0.0.1:8000/condicoes/", {
        method: "POST",
        body: JSON.stringify({
            "status": 1,
            "cota": dadosFatura.cota,
            "porcentagem": dadosFatura.porcentagem,
            "data": dadosFatura.data,
            "total": dadosFatura.total,
            "orcamento": localStorage.orcamentoId
        }),
        headers: {
          "Content-type": "application/json; charset=UTF-8"
        }
      })
        .then((response) => response.json())
        .then((json) => console.log(json));
    });

}

function addNotificar(){
    const formularioCadastro = document.getElementById('formularioCadastro');

    formularioCadastro.addEventListener('submit', function(event) {
    event.preventDefault(); // Evita o envio padrão do formulário

    const dadosNotificar = {
        nome: document.getElementById('nome').value,
        telefone: document.getElementById('telefone').value,
        email: document.getElementById('email').value,
    };

    console.log(dadosNotificar); // Exibe os dados da fatura no console
    fetch("http://127.0.0.1:8000/notificar/", {
        method: "POST",
        body: JSON.stringify({
            "nome": dadosNotificar.nome,
            "telefone": dadosNotificar.telefone,
            "email": dadosNotificar.email,
            "orcamento": localStorage.orcamentoId
        }),
        headers: {
          "Content-type": "application/json; charset=UTF-8"
        }
      })
        .then((response) => response.json())
        .then((json) => console.log(json));
    });

}

function add(){
    addCondicao();
    addNotificar();
}