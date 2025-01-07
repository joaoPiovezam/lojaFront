var pagina = 1;
var i = 1;
var j = 1;
var str = "";
var tipo = document.getElementById('pagina');

function loadScript(url)
{    
    var head = document.getElementsByTagName('head')[0];
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = url;
    head.appendChild(script);
}

async function  carregarUrl(){
  const urlA = await fetch('./rotaBack.json')
  dados = await urlA.json()
  return dados.API_URL
}

async function proximaPagina(){
    pagina += 1;
    urlA = await carregarUrl()
    urlAPI = urlA + "/peca/0/?page="+ pagina +"&search="+str;
    carregarDados()

}

if(localStorage.idFornececedor == null){
  localStorage.idFornececedor = 0
}

var urlAPI = ""
var urlOrcamento = ""
var urlPecaFornecedor = ""

async function carregarDados() {
  
  loadScript("header.js");
  urlA = await carregarUrl()
  var urlAPI = urlA + "/peca/0/?format=json&page="+ pagina + "&search="+str;
  var urlOrcamento = urlA + "/orcamento/"+ localStorage.orcamentoId +"/pedidos/0/0/";
  var urlPecaFornecedor = urlA + "/pecaFornecedor/0/"+ localStorage.idFornececedor+"/?search="+str;
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
        const respostaPecaFornecedor = await fetch(urlPecaFornecedor, {
            method: "GET",
            headers: {
              "Content-type": "application/json; charset=UTF-8",
              "Authorization": "token " + localStorage.tokenUsuario
            }
          });
        const dadosJSON = await resposta.json();
        const dadosOrcamento = await respostaOrcamento.json();
        const dadosPecaFornecedor = await respostaPecaFornecedor.json();
        
        if(pagina == 1){
            //carregarTabela();
            if(tipo == "1"){
              carregarTabelaOrcamento();
            }
            if(tipo == "2"){
              carregarTabelaCatalogoFornec();
            }
        }
        popularTabelaPecas(dadosJSON);
        if(tipo == "1"){
          popularTabelaOrcamento(dadosOrcamento);
        }
        if(tipo == "2"){
          popularPecaFornecedor(dadosPecaFornecedor)
        }
    }

async function converterDolar(){
  resposta =  await fetch("https://economia.awesomeapi.com.br/json/last/BRL-USD", {
    method: "GET",
    headers: {
      "Content-type": "application/json; charset=UTF-8"
    }
  });
  dados = await resposta.json();
  return dados.BRLUSD.ask
}

async function converterColon(){
  respostaReal =  await fetch("https://economia.awesomeapi.com.br/json/last/BRL-USD", {
    method: "GET",
    headers: {
      "Content-type": "application/json; charset=UTF-8"
    }
  });
  dadosReal = await respostaReal.json();

  respostaColon =  await fetch("https://economia.awesomeapi.com.br/json/last/USD-CRC", {
    method: "GET",
    headers: {
      "Content-type": "application/json; charset=UTF-8"
    }
  });
  dadosColon = await respostaColon.json();


  return dadosColon.USDCRC.ask * dadosReal.BRLUSD.ask
}

async function converterEuro(){
  resposta =  await fetch("https://economia.awesomeapi.com.br/json/last/BRL-EUR", {
    method: "GET",
    headers: {
      "Content-type": "application/json; charset=UTF-8"
    }
  });
  dados = await resposta.json();
  return dados.BRLEUR.ask
}

async function converterMoeda(valor){
  valorConvertido = 0
  switch(localStorage.Moeda) {
    case 'USD':
      valorConvertido = await converterDolar() * valor;
      break;
    case 'EUR':
      valorConvertido = await converterEuro() * valor;
      break;
    case 'CRC':
      valorConvertido = await converterColon() * valor;
      break;
    case 'BRL':
      valorConvertido = valor;
      break;
  }
  return valorConvertido
}

async function formatarPreco(preco) {
    var precoConvertido = await converterMoeda(preco)
    switch(localStorage.Moeda){
      case 'USD':
        return ` US$ ${precoConvertido.toFixed(2).replace(",", ".")}`;
      case 'EUR':
        return ` € ${precoConvertido.toFixed(2).replace(".", ",")}`;
      case 'CRC':
        return ` ₡ ${precoConvertido.toFixed(2).replace(".", ",")}`;
      case 'BRL':
        return ` R$ ${precoConvertido.toFixed(2).replace(".", ",")}`;
    }

}  

function formatarData(data) {
  const dataFormatada = new Date(data);
  return `${dataFormatada.getDate()}/${dataFormatada.getMonth() + 1}/${dataFormatada.getFullYear()}`;
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
        const colunaCodigoFornec = document.createElement("td");
        colunaCodigoFornec.textContent = "Codigo no FORNECEDOR";
        linha.appendChild(colunaCodigoFornec); 

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

function carregarTabelaCatalogoFornec(){
  tabela = document.getElementById("tabela-catalogo");
  const linha = document.createElement("tr");
    const colunaItem = document.createElement("td");
    const colunaCodigo = document.createElement("td");
    const colunaCodigoF = document.createElement("td");
    const colunaDescricao = document.createElement("td");
    const colunaPreco = document.createElement("td");
    const colunaData = document.createElement("td");
      
    linha.id = "linhas";

    colunaItem.textContent = "ITEM";
    colunaCodigo.textContent = "CODIGO";
    colunaCodigoF.textContent = "CODIGO no Fornecedor";
    colunaDescricao.textContent = "DESCRIÇÂO";
    colunaPreco.textContent = "PREÇO";
    colunaData.textContent = "DATA ATUALIZAÇÃO";

    linha.appendChild(colunaItem);
    linha.appendChild(colunaCodigo);
    linha.appendChild(colunaCodigoF);
    linha.appendChild(colunaDescricao);
    linha.appendChild(colunaPreco);
    linha.appendChild(colunaData);

    tabela.appendChild(linha);

}

function popularPecaFornecedor(dados){
  tabela = document.getElementById("tabela-catalogo");
  var data = new Date();
  var data2 = new Date(data.setDate(data.getDate() - 90));

  for(const item of dados.results){

    var data3 = new Date(item.data_atualizacao)

    const linha = document.createElement("tr");
    const colunaItem = document.createElement("td");
    const colunaCodigo = document.createElement("td");
    const colunaCodigoF = document.createElement("td");
    const colunaDescricao = document.createElement("td");
    const colunaPreco = document.createElement("td");
    const colunaData = document.createElement("td");

    linha.id = "linhas";

    colunaItem.textContent = j;
    colunaCodigo.textContent = item.peca.codigo;
    colunaCodigoF.textContent = item.codigo;
    colunaDescricao.textContent = item.peca.descricao;
    colunaPreco.textContent = item.preco;
    colunaData.textContent = formatarData(item.data_atualizacao);

    if(data2.getTime() > data3.getTime()){
      colunaData.setAttribute("class", "atrasado")
    }

    linha.appendChild(colunaItem);
    linha.appendChild(colunaCodigo);
    linha.appendChild(colunaCodigoF);
    linha.appendChild(colunaDescricao);
    linha.appendChild(colunaPreco);
    linha.appendChild(colunaData);



    tabela.appendChild(linha);
    j++
  }
}

function abrirOrcamento(){
  localStorage.pecaCodigo = 0;
  localStorage.volume = 0;
    window.open(
        "/orcamento.html",
        '_blank'
      );  
}

async function popularTabelaPecas(dados){
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
        var codigoF = document.createElement("input");

        linha.id = "linhas";
        
        qtd.type = "number";
        qtd.value = "0";
        qtd.min = "0";
        qtd.id =  "q" + i;      

        preco.type = "number";
        preco.value = "0";
        preco.min = "0";
        preco.id = "preco" + i;

        codigoF.id = "codigoF" + i;

        var id = item.codigo; 

        btnQtd.setAttribute("onclick", "criarPedido("+ item.id + "," + i +")");  
                 
        colunaItem.textContent = i.toString();
        colunaCodigo.textContent = item.codigo;
        colunaDescricao.textContent = item.descricao;
        colunaMarca.textContent = item.marca;
        colunaPreco.textContent = await formatarPreco(item.preco_venda * 1.2);
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
            const colunaCodigoFornec = document.createElement("td");
            colunaCodigoFornec.appendChild(codigoF)
            linha.appendChild(colunaCodigoFornec);

            const colunaPrecoFornec = document.createElement("td");
            colunaPrecoFornec.appendChild(preco);
            colunaPrecoFornec.appendChild(btnPreco);
            linha.appendChild(colunaPrecoFornec);
            console.log(id)  
            btnPreco.setAttribute("onclick", "adicionarPecaFornec("+ item.id + "," + i +")");
            
 
        }

        linha.appendChild(alerta);
        linha.appendChild(alertaQtd)

        tabela.appendChild(linha);

        i++;
      }

}

async function popularTabelaOrcamento(dados){
    tipo = document.getElementById('pagina').value;
    const tabela = document.getElementById("tabela-orcamento");
    for (const item of dados.results) {
        const linha = document.createElement("tr");
        const colunaItem = document.createElement("td");
        const colunaCodigo = document.createElement("td");
        const colunaDescricao = document.createElement("td");
        const colunaMarca = document.createElement("td");
        const colunaPreco = document.createElement("td");
        const colunaDesconto = document.createElement("td");
        const colunaTraducao = document.createElement("td");

        var qtd = document.createElement("input");
        var btnQtd = document.createElement("button");

        var desconto = document.createElement("input");
        var btnDesconto = document.createElement("button");

        var traducao = document.createElement("input");
        var btnTraducao = document.createElement("button");

        var btnDelete = document.createElement("button");

        var preco = document.createElement("input");
        var btnPreco = document.createElement("button");

        linha.id = "linhas";
        
        qtd.type = "number";
        qtd.value = "0";
        qtd.min = "0";
        qtd.id =  "qtdOrc" + j;      

        desconto.type = "number";
        desconto.value = "0";
        desconto.min = "0";
        desconto.id =  "descontoOrc" + j;      
        traducao.id =  "traducaoOrc" + j;      

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
        btnDesconto.setAttribute("onclick", "updateDescontoPeca("+ item.peca.id + "," + j +")");  
        btnTraducao.setAttribute("onclick", "updateTraducaoPeca("+ item.peca.id + "," + j +")");  
        btnDelete.setAttribute("onclick", "deletePeca("+ item.peca.id + "," + j +")");  
                 
        colunaItem.textContent = j.toString();
        colunaCodigo.textContent = item.peca.codigo;
        colunaDescricao.textContent = item.peca.descricao;
        colunaMarca.textContent = await formatarPreco(item.peca.preco_venda * 1.2)
        colunaPreco.textContent = item.quantidade ;
        btnQtd.textContent = "alterar quantidade";
        btnDesconto.textContent = "alterar desconto";
        btnTraducao.textContent = "alterar tradução";
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


            colunaDesconto.appendChild(desconto);
            colunaDesconto.appendChild(btnDesconto);
            linha.appendChild(colunaDesconto);

            colunaTraducao.appendChild(traducao);
            colunaTraducao.appendChild(btnTraducao);
            linha.appendChild(colunaTraducao);

            const colunaDelete = document.createElement("td");
            colunaDelete.appendChild(btnDelete);
            linha.appendChild(colunaDelete);

        tabela.appendChild(linha);

        j++;
      }

}

async function pesquisar(){
    urlA = await carregarUrl()
    pagina = 1
    for(var m = 1; m<=i+j; m++ ){
        var linhas = document.getElementById("linhas");
        linhas.remove();
    }
    str = document.getElementById("pesquisa").value;
    urlAPI = urlA + "/peca/0/?page="+ pagina +"&search="+str;
    //urlPecaFornecedor = urlA + "/pecaFornecedor/0/"+ localStorage.idFornececedor+"/?search="+str;
    var p = document.getElementById("pesquisa");
    p.remove();
    i=1;
    carregarDados()
}

async function getClienteByOrcamentoId(orcamentoId){
    urlA = await carregarUrl()
    var urlAPI = urlA + "/orcamentos/" + orcamentoId + "/";
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
    urlA = await carregarUrl()
    var urlAPI = urlA + "/orcamento/" + localStorage.orcamentoId + "/pedidos/0/" + pecaCodigo + "/";
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
    urlA = await carregarUrl()
    var qtd = document.getElementById('q' + i);

    pedidoId = await getPedidoId(idPeca.toString())
    if (pedidoId.count == 0){
        console.log("testes")
    

      console.log("pedido adicionado" + qtd.value);
      var cliente = await getClienteByOrcamentoId(localStorage.orcamentoId);

      await fetch(urlA + "/pedidos/", {
          method: "POST",
          body: JSON.stringify({
              "codigo_pedido": 1,
              "data_criacao": "2024-03-19",
              "data_entrega": "2024-01-01",
              "quantidade": qtd.value,
              "peso_bruto": "20.000",
              "volume_bruto": "20.000",
              "unidade": "unit",
              "pacote": "caixa de madeira",
              "volume": 0,
              "peca": idPeca,
              "orcamento": localStorage.orcamentoId,
              "cliente": cliente
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
    urlA = await carregarUrl()
    
    console.log(pedido)
    await fetch(urlA + "/pedidos/" + pedido.id + "/", {
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
    urlA = await carregarUrl()
    var qtd = document.getElementById('qtdOrc' + j);
    pedidoResult = await getPedidoId(idPeca);

    pedido = pedidoResult.results[0];
    console.log(pedido)

    await fetch(urlA + "/pedidos/" + pedido.id + "/", {
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

async function updateDescontoPeca(idPeca ,j ){
    urlA = await carregarUrl()
    var desconto = document.getElementById('descontoOrc' + j);
    pedidoResult = await getPedidoId(idPeca);

    pedido = pedidoResult.results[0];
    console.log(desconto.value)

    await fetch(urlA + "/pedidos/" + pedido.id + "/", {
        method: "PATCH",
        body: JSON.stringify({
            "desconto": desconto.value
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

async function updateTraducaoPeca(idPeca ,j ){
    urlA = await carregarUrl()
    var traducao = document.getElementById('traducaoOrc' + j);
    pedidoResult = await getPedidoId(idPeca);

    pedido = pedidoResult.results[0];
    console.log(traducao.value)

    await fetch(urlA + "/pedidos/" + pedido.id + "/", {
        method: "PATCH",
        body: JSON.stringify({
            "descricao": traducao.value
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
    urlA = await carregarUrl()
    pedidoResult = await getPedidoId(idPeca);

    pedido = pedidoResult.results[0];

    await fetch(urlA + "/pedidos/" + pedido.id + "/", {
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
    urlA = await carregarUrl()
    var url = urlA + "/peca/"+ idPeca + "/fornecedor/" + dropDownFornecedor.value;
    const resposta = await fetch(url, {
        method: "GET",
        headers: {
          "Content-type": "application/json; charset=UTF-8",
          "Authorization": "token " + localStorage.tokenUsuario
        }
      });
    const dados = await resposta.json();

    if(dados.results[0] === undefined){
        addPecaFornecedor(idPeca, i)
    }else{
        updatePecaFornecedor(dados, idPeca, i)
    }
}

async function addPecaFornecedor(idPeca, i){
    urlA = await carregarUrl()
    var preco = document.getElementById('preco'+i);
    var codigo = document.getElementById("codigoF"+i);
    var fornecedor  = document.getElementById("dropDownFornecedor")
    await fetch(urlA + "/pecasFornecedor/", {
        method: "POST",
        body: JSON.stringify({
                "codigo": codigo.value,
                "preco": preco.value,
                "peca": idPeca,
                "fornecedor": fornecedor.value
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
    urlA = await carregarUrl()
    var preco = document.getElementById('preco'+i);
    console.log(dados)
    await fetch(urlA + "/pecasFornecedor/" + dados.results[0].id + "/", {
            method: "PATCH",
            body: JSON.stringify({
                    "codigo": dados.results[0].codigo,
                    "preco": preco.value
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
  urlA = await carregarUrl()
  const resposta = await fetch(urlA + "/AddPedidoOrcamentoView/" + json +"/" + "1" + "/" + localStorage.orcamentoId +"/", {
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

async function addCatalogo(json) {
  urlA = await carregarUrl()
  const resposta = await fetch(urlA + "/AddPeca/" + json  +"/", {
    method: "GET",
    headers: {
      "Content-type": "application/json; charset=UTF-8",
      "Authorization": "token " + localStorage.tokenUsuario
    }
  });
  const dados = await resposta.json();
  const alerta = document.getElementById('alertaCatalogo')
  alerta.textContent = dados
  alerta.classList.remove('d-none'); 
  console.log(dados)
}

async function addPecasCatalogo() {
  const input = document.getElementById('myFileCatalogo');
  const file = input.files[0];
  if (file) {
    const reader = new FileReader();

    reader.onload = async (e) => {
      const content = e.target.result;
      console.log(content);
      const pecas = content.replace(/['\n']/g,";")
      console.log(pecas)
      await addCatalogo(pecas)
    };

    reader.onerror = (e) => {
      console.error('Erro ao ler o arquivo:', e);
    };

    reader.readAsText(file);
  } else {
    console.log('Nenhum arquivo selecionado');
  }

}