var pagina = 1;
var i = 1;
var str = "";

function proximaPagina(){
    pagina += 1;
    urlAPI = "http://127.0.0.1:8000/pedidosCompra/?page="+ pagina +"&search="+str;
    carregarDados()

}

var urlAPI = "http://127.0.0.1:8000/pedidosCompra/?format=json&page="+ pagina;

async function carregarDados() {
    const resposta = await fetch(urlAPI);
    const dadosJSON = await resposta.json();
    
    /*if(pagina == 1){
        carregarTabela();
    }
    popularTabelaPecas(dadosJSON);*/
}

carregarDados()

function addPedido(){
    const formularioCadastro = document.getElementById('formularioCadastro');

    //formularioCadastro.addEventListener('submit', (event) => {
      //  event.preventDefault();
    
        const dados = {
            operacaoFiscal: document.getElementById('operacaoFiscal').value,
            vencimento: document.getElementById('vencimento').value,
            comprador: document.getElementById('comprador').value,
            email: document.getElementById('email').value,
            observacoes: document.getElementById('observacoes').value,
            frete: document.getElementById('frete').value,
            cotacao: document.getElementById('cotacao').value,
            transportadora: document.getElementById('transportadora').value,
        };
        fetch("http://127.0.0.1:8000/pedidosCompra/", {
            method: "POST",
            body: JSON.stringify({
                    "operacaoFiscal": dados.operacaoFiscal,
                    "vencimento": dados.vencimento,
                    "comprador": dados.comprador,
                    "email": dados.email,
                    "observacoes": dados.observacoes,
                    "frete": dados.frete,
                    "cotacao": dados.cotacao,
                    "transportadora": dados.transportadora
            }),
            headers: {
              "Content-type": "application/json; charset=UTF-8"
            }
          })
            .then((response) => response.json())
            .then((json) => console.log(json)); 
        formularioCadastro.reset();
    //});

   
}

