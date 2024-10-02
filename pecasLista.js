var pagina = 1;
var i = 1;
var j = 1;
var str = "";
var tipo = document.getElementById('pagina');

function proximaPagina(){
    pagina += 1;
    urlAPI = "http://127.0.0.1:8000/peca/?page="+ pagina +"&search="+str;
    carregarDados()

}

var urlAPI = "http://127.0.0.1:8000/peca/?format=json&page="+ pagina;
var urlOrcamento = "http://127.0.0.1:8000/orcamento/"+ localStorage.orcamentoId +"/pedidos/0/0/";

async function carregarDados() {   
        const resposta = await fetch(urlAPI, {
            method: "GET",
            headers: {
              "Content-type": "application/json; charset=UTF-8",
              "Authorization": "token " + localStorage.tokenUsuario
            }
          });
        const respostaOrcamento = await fetch(urlOrcamento, {
            method: "GET",
            headers: {
              "Content-type": "application/json; charset=UTF-8",
              "Authorization": "token " + localStorage.tokenUsuario
            }
          });
        const dadosJSON = await resposta.json();
        const dadosOrcamento = await respostaOrcamento.json();
        
        if(pagina == 1){
            carregarTabela();
            carregarTabelaOrcamento();
        }
        popularTabelaPecas(dadosJSON);
        popularTabelaOrcamento(dadosOrcamento);
    }

function formatarPreco(preco) {
    return ` ${preco.toFixed(2).replace(".", ",")}`;
}  

carregarDados();

function carregarTabela(){
    tipo = document.getElementById('pagina').value;
    const tabela = document.getElementById("tabela-pecas");

    const pesquisa = document.createElement("input");
    pesquisa.id = "pesquisa";
    pesquisa.placeholder = "pesquisar peça"
    tabela.appendChild(pesquisa);

    pesquisa.addEventListener("keypress", function(event) {
        if (event.key === "Enter") {
          event.preventDefault();
          pesquisar();
        }
      });

    const linha = document.createElement("tr");
    const colunaItem = document.createElement("td");
    const colunaCodigo = document.createElement("td");
    const colunaDescricao = document.createElement("td");
    const colunaMarca = document.createElement("td");
    const colunaPreco = document.createElement("td");
      
    linha.id = "linhas";

    colunaItem.textContent = "ITEM";
    colunaCodigo.textContent = "CODIGO";
    colunaDescricao.textContent = "DESCRIÇÂO";
    colunaMarca.textContent = "MARCA";
    colunaPreco.textContent = "PREÇO";

    linha.appendChild(colunaItem);
    linha.appendChild(colunaCodigo);
    linha.appendChild(colunaDescricao);
    linha.appendChild(colunaMarca);
    linha.appendChild(colunaPreco);
    console.log(tipo);
    if (tipo == "1"){
        const colunaQtd = document.createElement("td");
        colunaQtd.textContent = "QUANTIDADE";
        linha.appendChild(colunaQtd);
    }
    if (tipo == "2"){
        const colunaPrecoFornec = document.createElement("td");
        colunaPrecoFornec.textContent = "PREÇO do FORNECEDOR";
        linha.appendChild(colunaPrecoFornec);        
    }

    tabela.appendChild(linha);
}

function carregarTabelaOrcamento(){
    const tabela = document.getElementById("tabela-orcamento");

    const btnOrc = document.createElement("button");

    const linha = document.createElement("tr");
    const colunaItem = document.createElement("td");
    const colunaCodigo = document.createElement("td");
    const colunaDescricao = document.createElement("td");
    const colunaPreco = document.createElement("td");
      
    linha.id = "linhas";

    btnOrc.textContent = "Ver Orcamento";
    colunaItem.textContent = "ITEM";
    colunaCodigo.textContent = "CODIGO";
    colunaDescricao.textContent = "DESCRIÇÂO";
    colunaPreco.textContent = "PREÇO";

    linha.appendChild(colunaItem);
    linha.appendChild(colunaCodigo);
    linha.appendChild(colunaDescricao);
    linha.appendChild(colunaPreco);

    const colunaQtd = document.createElement("td");
    colunaQtd.textContent = "QUANTIDADE";
    linha.appendChild(colunaQtd);

    btnOrc.setAttribute("onclick", "abrirOrcamento()")

    tabela.append(btnOrc)
    tabela.appendChild(linha);
}

function abrirOrcamento(){
  localStorage.pecaCodigo = 0;
  localStorage.volume = 0;
    window.open(
        "/orcamento.html",
        '_blank'
      );  
}

function popularTabelaPecas(dados){
    tipo = document.getElementById('pagina').value;
    const tabela = document.getElementById("tabela-pecas");
    for (const item of dados.results) {
        const linha = document.createElement("tr");
        const colunaItem = document.createElement("td");
        const colunaCodigo = document.createElement("td");
        const colunaDescricao = document.createElement("td");
        const colunaMarca = document.createElement("td");
        const colunaPreco = document.createElement("td");

        var qtd = document.createElement("input");
        var btnQtd = document.createElement("button");
        
        const alerta = document.createElement("div");
        alerta.id = "alert" + i;
        alerta.setAttribute("class", "alert alert-success d-none")
        alerta.role = "alert"
        alerta.textContent = "peça adicionada ao orçamento"

        const alertaQtd = document.createElement("div");
        alertaQtd.id = "alertQtd" + i;
        alertaQtd.setAttribute("class", "alert alert-success d-none")
        alertaQtd.role = "alert"
        alertaQtd.textContent = "quantidade de peça alterada"

        var preco = document.createElement("input");
        var btnPreco = document.createElement("button");

        linha.id = "linhas";
        
        qtd.type = "number";
        qtd.value = "0";
        qtd.min = "0";
        qtd.id =  "q" + i;      

        preco.type = "number";
        preco.value = "0";
        preco.min = "0";
        preco.id = "preco" + i;

        var id = item.codigo; 

        btnQtd.setAttribute("onclick", "criarPedido("+ item.id + "," + i +")");  
                 
        colunaItem.textContent = i.toString();
        colunaCodigo.textContent = item.codigo;
        colunaDescricao.textContent = item.descricao;
        colunaMarca.textContent = item.marca;
        colunaPreco.textContent = formatarPreco(item.precoVenda * 1.2);
        btnQtd.textContent = "adicionar ao orçamento";
        btnPreco.textContent = "adicionar";

        linha.appendChild(colunaItem);
        linha.appendChild(colunaCodigo);
        linha.appendChild(colunaDescricao);
        linha.appendChild(colunaMarca);
        linha.appendChild(colunaPreco);

        if (tipo == "1"){
            const colunaQtd = document.createElement("td");
            colunaQtd.appendChild(qtd);
            colunaQtd.appendChild(btnQtd);
            linha.appendChild(colunaQtd);
        }

        if (tipo == "2"){
            const colunaPrecoFornec = document.createElement("td");
            colunaPrecoFornec.appendChild(preco);
            colunaPrecoFornec.appendChild(btnPreco);
            linha.appendChild(colunaPrecoFornec);  
            btnPreco.setAttribute("onclick", "adicionarPecaFornec("+ id + "," + i +")");       
        }

        linha.appendChild(alerta);
        linha.appendChild(alertaQtd)

        tabela.appendChild(linha);

        i++;
      }

}

function popularTabelaOrcamento(dados){
    tipo = document.getElementById('pagina').value;
    const tabela = document.getElementById("tabela-orcamento");
    for (const item of dados.results) {
        const linha = document.createElement("tr");
        const colunaItem = document.createElement("td");
        const colunaCodigo = document.createElement("td");
        const colunaDescricao = document.createElement("td");
        const colunaMarca = document.createElement("td");
        const colunaPreco = document.createElement("td");

        var qtd = document.createElement("input");
        var btnQtd = document.createElement("button");

        var btnDelete = document.createElement("button");

        var preco = document.createElement("input");
        var btnPreco = document.createElement("button");

        linha.id = "linhas";
        
        qtd.type = "number";
        qtd.value = "0";
        qtd.min = "0";
        qtd.id =  "qtdOrc" + j;      

        preco.type = "number";
        preco.value = "0";
        preco.min = "0";
        preco.id = "preco" + j;

        const alertaQtd = document.createElement("div");
        alertaQtd.id = "alertaQtd" + j;
        alertaQtd.setAttribute("class", "alert alert-success d-none")
        alertaQtd.role = "alert"
        alertaQtd.textContent = "quantidade de peça alterada"

        const alertaDelete = document.createElement("div");
        alertaDelete.id = "alertaDelete" + j;
        alertaDelete.setAttribute("class", "alert alert-warning d-none")
        alertaDelete.role = "alert"
        alertaDelete.textContent = "peça removida"

        var id = item.peca.codigo; 

        btnQtd.setAttribute("onclick", "updateQtdPeca("+ item.peca.id + "," + j +")");  
        btnDelete.setAttribute("onclick", "deletePeca("+ item.peca.id + "," + j +")");  
                 
        colunaItem.textContent = j.toString();
        colunaCodigo.textContent = item.peca.codigo;
        colunaDescricao.textContent = item.peca.descricao;
        colunaMarca.textContent = formatarPreco(item.peca.precoVenda * 1.2)
        colunaPreco.textContent = item.quantidade ;
        btnQtd.textContent = "alterar quantidade";
        btnDelete.textContent = "remover";
        btnPreco.textContent = "adicionar";

        linha.appendChild(alertaQtd);
        linha.appendChild(alertaDelete);
        linha.appendChild(colunaItem);
        linha.appendChild(colunaCodigo);
        linha.appendChild(colunaDescricao);
        linha.appendChild(colunaMarca);
        linha.appendChild(colunaPreco);

            const colunaQtd = document.createElement("td");
            colunaQtd.appendChild(qtd);
            colunaQtd.appendChild(btnQtd);
            linha.appendChild(colunaQtd);

            const colunaDelete = document.createElement("td");
            colunaDelete.appendChild(btnDelete);
            linha.appendChild(colunaDelete);

        tabela.appendChild(linha);

        j++;
      }

}

function pesquisar(){
    pagina = 1
    for(var j = 1; j<=i; j++ ){
        var linhas = document.getElementById("linhas");
        linhas.remove();
    }
    str = document.getElementById("pesquisa").value;
    urlAPI = "http://127.0.0.1:8000/peca/?page="+ pagina +"&search="+str;
    var p = document.getElementById("pesquisa");
    p.remove();
    i=1;
    carregarDados()
}

async function getClienteByOrcamentoId(orcamentoId){
    var urlAPI = "http://127.0.0.1:8000/orcamentos/" + orcamentoId + "/";
        const resposta = await fetch(urlAPI, {
            method: "GET",
            headers: {
              "Content-type": "application/json; charset=UTF-8",
              "Authorization": "token " + localStorage.tokenUsuario
            }
          });
        const dadosJSON = await resposta.json();
    return dadosJSON.cliente
}

async function getPedidoId(pecaCodigo){
    var urlAPI = "http://127.0.0.1:8000/orcamento/" + localStorage.orcamentoId + "/pedidos/0/" + pecaCodigo + "/";
    console.log(pecaCodigo)
    const resposta = await fetch(urlAPI, {
        method: "GET",
        headers: {
          "Content-type": "application/json; charset=UTF-8",
          "Authorization": "token " + localStorage.tokenUsuario
        }
      });

    const dadosJSON = await resposta.json();
    return dadosJSON
}


async function criarPedido(idPeca, i){
    var qtd = document.getElementById('q' + i);

    pedidoId = await getPedidoId(idPeca.toString())
    if (pedidoId.count == 0){
        console.log("testes")
    

      console.log("pedido adicionado" + qtd.value);
      var cliente = await getClienteByOrcamentoId(localStorage.orcamentoId);

      await fetch("http://127.0.0.1:8000/pedidos/", {
          method: "POST",
          body: JSON.stringify({
              "codigoPedido": 1,
              "dataCriacao": "2024-03-19",
              "dataEntrega": "2024-01-01",
              "quantidade": qtd.value,
              "pesoBruto": "20.000",
              "volumeBruto": "20.000",
              "unidade": "unit",
              "pacote": "caixa de madeira",
              "volume": 0,
              "codigoPeca": idPeca,
              "codigoOrcamento": localStorage.orcamentoId,
              "codigoCliente": cliente
          }),
          headers: {
            "Content-type": "application/json; charset=UTF-8",
            "Authorization": "token " + localStorage.tokenUsuario
          }
        })
          .then((response) => response.json())
          .then((json) => console.log(json));
          
          document.getElementById('alert' + i).classList.remove('d-none');
    }else{
        console.log("atualizar qtd" + pedidoId.results[0].id)
        await updateQtdPedido(qtd.value, pedidoId.results[0], i)
    }
}

async function updateQtdPedido(qtd, pedido, i){
    console.log(pedido)
    await fetch("http://127.0.0.1:8000/pedidos/" + pedido.id + "/", {
        method: "PATCH",
        body: JSON.stringify({
            "quantidade": Number(qtd) + Number(pedido.quantidade)
        }),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
          "Authorization": "token " + localStorage.tokenUsuario
        }
      })
        .then((response) => response.json())
        .then((json) => console.log(json));

        document.getElementById('alertQtd' + i).classList.remove('d-none');
}

async function updateQtdPeca(idPeca ,j ){
    var qtd = document.getElementById('qtdOrc' + j);
    pedidoResult = await getPedidoId(idPeca);

    pedido = pedidoResult.results[0];
    console.log(pedido)

    await fetch("http://127.0.0.1:8000/pedidos/" + pedido.id + "/", {
        method: "PATCH",
        body: JSON.stringify({
            "quantidade": qtd.value
        }),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
          "Authorization": "token " + localStorage.tokenUsuario
        }
      })
        .then((response) => response.json())
        .then((json) => console.log(json));
        document.getElementById('alertaQtd' + j).classList.remove('d-none');
    
}

async function deletePeca(idPeca , j){
    pedidoResult = await getPedidoId(idPeca);

    pedido = pedidoResult.results[0];

    await fetch("http://127.0.0.1:8000/pedidos/" + pedido.id + "/", {
        method: "DELETE",
        headers: {
          "Content-type": "application/json; charset=UTF-8",
          "Authorization": "token " + localStorage.tokenUsuario
        }
      })
      .then(res => res.text())
      .then(res => console.log(res));
      
      document.getElementById('alertaDelete' + j).classList.remove('d-none');
    
}

async function adicionarPecaFornec(idPeca, i){
    
    var url = "http://127.0.0.1:8000/peca/"+ idPeca + "/fornecedor/" + dropDownFornecedor.value;
    const resposta = await fetch(url, {
        method: "GET",
        headers: {
          "Content-type": "application/json; charset=UTF-8",
          "Authorization": "token " + localStorage.tokenUsuario
        }
      });
    const dados = await resposta.json();

    if(dados.results[i-1] === undefined){
        addPecaFornecedor(idPeca, i)
    }else{
        updatePecaFornecedor(dados, idPeca, i)
    }
}

async function addPecaFornecedor(idPeca, i){
    var preco = document.getElementById('preco'+i);
    await fetch("http://127.0.0.1:8000/pecasFornecedor/", {
        method: "POST",
        body: JSON.stringify({
                "codigo": codigo.value,
                "preco": preco.value,
                "peca": idPeca,
                "fonecedor": dropDownFornecedor.value
        }),
        headers: {
        "Content-type": "application/json; charset=UTF-8",
        "Authorization": "token " + localStorage.tokenUsuario
        }
    })
        .then((response) => response.json())
        .then((json) => console.log(json));
}

async function updatePecaFornecedor(dados, idPeca, i){
    var preco = document.getElementById('preco'+i);
    await fetch("http://127.0.0.1:8000/pecasFornecedor/" + dados.results[i-1].id + "/", {
            method: "PUT",
            body: JSON.stringify({
                    "codigo": codigo.value,
                    "preco": preco.value,
                    "peca": idPeca,
                    "fonecedor": dropDownFornecedor.value
            }),
            headers: {
            "Content-type": "application/json; charset=UTF-8",
            "Authorization": "token " + localStorage.tokenUsuario
            }
        })
            .then((response) => response.json())
            .then((json) => console.log(json));
    }



async function addPecas(json) {
  const resposta = await fetch("http://127.0.0.1:8000/AddPedidoOrcamentoView/" + json +"/" + "1" + "/" + localStorage.orcamentoId +"/", {
    method: "GET",
    headers: {
      "Content-type": "application/json; charset=UTF-8",
      "Authorization": "token " + localStorage.tokenUsuario
    }
  });
  const dados = await resposta.json();
  const alerta = document.getElementById('alertaCsv')
  alerta.textContent = dados
  alerta.classList.remove('d-none'); 
  console.log(dados)
}

async function addPecasOrcamendo() {
  const input = document.getElementById('myFile');
  const file = input.files[0];
  if (file) {
    const reader = new FileReader();

    reader.onload = async (e) => {
      const content = e.target.result;
      console.log(content);
      const pecas = content.replace(/['\n']/g,";")
      console.log(pecas)
      await addPecas(pecas)
    };

    reader.onerror = (e) => {
      console.error('Erro ao ler o arquivo:', e);
    };

    reader.readAsText(file);
  } else {
    console.log('Nenhum arquivo selecionado');
  }

}