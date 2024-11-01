var pagina = 1;
var i = 1;
var str = "";

async function  carregarUrl(){
  const urlA = await fetch('./rotaBack.json')
  dados = await urlA.json()
  return dados.API_URL
}

async function proximaPagina(){
  urlA = await carregarUrl()
    pagina += 1;
    urlAPI = urlA + "/pedidosCompra/?page="+ pagina +"&search="+str;
    carregarDados()

}

var urlAPI = "";
var urlFornecedor = "";
var urlOrcamento = "";

async function carregarDados() {
  urlA = await carregarUrl()
  urlAPI = urlA + "/pedidosCompra/?format=json&page="+ pagina
  urlFornecedor = urlA + "/fornecedor/"
  urlOrcamento = urlA + "/orcamentos/";
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
      orcamento.textContent = item.codigo + ' - ' + item.client.nome_cliente;
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
  console.log(urlFornecedor)
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
      fornecedor.textContent = item.nome_fornecedor + ' - ' + item.cpfcnpj;
      console.log(item.nome_fornecedor + ' - ' + item.cpfcnpj);
      dropDownFornecedores.appendChild(fornecedor);
  }
  dropDownFornecedores.value = localStorage.idFornececedor;
}

function filtrarFornecedor(Fornececedor){
  localStorage.idFornececedor = Fornececedor;
  location.reload();
}

async function addPedido(){
  urlA = await carregarUrl()
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
        fetch(urlA + "/pedidosCompra/", {
            method: "POST",
            body: JSON.stringify({
                    "operacao_fiscal": dados.operacaoFiscal,
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

