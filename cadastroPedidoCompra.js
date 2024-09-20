var pagina = 1;
var i = 1;
var str = "";

function proximaPagina(){
    pagina += 1;
    urlAPI = "http://127.0.0.1:8000/pedidosCompra/?page="+ pagina +"&search="+str;
    carregarDados()

}

var urlAPI = "http://127.0.0.1:8000/pedidosCompra/?format=json&page="+ pagina;
var urlFornecedor = "http://127.0.0.1:8000/fornecedor/";
var urlOrcamento = "http://127.0.0.1:8000/orcamentos/";

async function carregarDados() {

    await popularDropDownFornecedor();

    const resposta = await fetch(urlFornecedor, {
        method: "GET",
        headers: {
          "Content-type": "application/json; charset=UTF-8",
          "Authorization": "token " + localStorage.tokenUsuario
        }
      });
    const dadosJSON = await resposta.json();
    const respostaOrcamento = await fetch(urlOrcamento, {
      method: "GET",
      headers: {
        "Content-type": "application/json; charset=UTF-8",
        "Authorization": "token " + localStorage.tokenUsuario
      }
    });
  const dadosOrcamento = await respostaOrcamento.json();
  popularDropDownOrcamento(dadosOrcamento);
    
    /*if(pagina == 1){
        carregarTabela();
    }
    popularTabelaPecas(dadosJSON);*/
}

carregarDados()

function popularDropDownOrcamento(dados){
  console.log(dados)
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
  localStorage.orcamentoId = orcamentoId;
  location.reload();
}

async function popularDropDownFornecedor(){
  const respostaFornecedor = await fetch(urlFornecedor, {
      method: "GET",
      headers: {
        "Content-type": "application/json; charset=UTF-8",
        "Authorization": "token " + localStorage.tokenUsuario
      }
    });
  const dados = await respostaFornecedor.json();
  const dropDownFornecedores = document.getElementById('fornecedor');
  

  for(const item of dados.results){
      const fornecedor = document.createElement("option");
      fornecedor.value = item.id;
      fornecedor.textContent = item.nomeFornecedor + ' - ' + item.cpfCnpj;
      console.log(item.nomeFornecedor + ' - ' + item.cpfCnpj);
      dropDownFornecedores.appendChild(fornecedor);
  }
  dropDownFornecedores.value = localStorage.idFornececedor;
}

function filtrarFornecedor(Fornececedor){
  localStorage.idFornececedor = Fornececedor;
  location.reload();
}

function addPedido(){
    const formularioCadastro = document.getElementById('formularioCadastro');

    //formularioCadastro.addEventListener('submit', (event) => {
      //  event.preventDefault();
    
        const dados = {
            orcamento: document.getElementById('dropdownOrcamento').value,
            fornecedor: document.getElementById('fornecedor').value,
            operacaoFiscal: document.getElementById('operacaoFiscal').value,
            vencimento: document.getElementById('vencimento').value,
            comprador: document.getElementById('comprador').value,
            email: document.getElementById('email').value,
            observacoes: document.getElementById('observacoes').value,
            frete: document.getElementById('frete').value,
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
                    "transportadora": dados.transportadora,
                    "fornecedor": dados.fornecedor,
                    "orcamento": dados.orcamento
            }),
            headers: {
              "Content-type": "application/json; charset=UTF-8",
              "Authorization": "token " + localStorage.tokenUsuario
            }
          })
            .then((response) => response.json())
            .then((json) => console.log(json)); 
        formularioCadastro.reset();
    //});

   
}

