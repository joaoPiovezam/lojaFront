var pagina = 1;
var i = 1;
var j = 1;
var str = "";
var id = 0;
var urlNaoFaturados = "";
var urlFaturados = "";
var urlC = ""

async function  carregarUrl(){
    const urlA = await fetch('./rotaBack.json')
    dados = await urlA.json()
    return dados.API_URL
}

var urlOrcamento = "http://127.0.0.1:8000/orcamento/";

 function loadScript(url)
{    
    var head = document.getElementsByTagName('head')[0];
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = url;
    head.appendChild(script);
}

function proximaPagina(){
    pagina += 1;
    carregarDados();
}

function myFunction() {
    var x = document.getElementById("navbar");
    if (x.className === "navbar") {
        x.className += " responsive";
    } else {
        x.className = "navbar";
    }
}
async function carregarDados() {
    loadScript("header.js");
    urlA = await carregarUrl()
    urlC =  urlA + "/clientes/"
    urlNaoFaturados =  urlA + "/orcamentosNaoFaturados/?page="+ pagina +"&search="+str;
        const resposta = await fetch(urlNaoFaturados, {
            method: "GET",
            headers: {
              "Content-type": "application/json; charset=UTF-8",
              "Authorization": "token " + localStorage.tokenUsuario
            }
          });
        const dadosJSON = await resposta.json();

        //loadScript("cliente.js")
        if(pagina == 1){
            carregarTabelaOrcamentos();
        }
        popularTabelaOrcamentos(dadosJSON);
    urlFaturados =  urlA + "/orcamentosFaturados/?page="+ pagina +"&search="+str;
        const respostaFatura = await fetch(urlFaturados, {
            method: "GET",
            headers: {
              "Content-type": "application/json; charset=UTF-8",
              "Authorization": "token " + localStorage.tokenUsuario
            }
          });
        const dadosJSONFatura = await respostaFatura.json();

        //loadScript("cliente.js")
        if(pagina == 1){
            carregarTabelaFaturas();
        }
        popularTabelaFaturas(dadosJSONFatura);
        if(pagina == 1){
            carregarTabelaCotacao();
        }
        popularTabelaCotacao(dadosJSONFatura);
        
}

carregarDados()

function carregarTabelaOrcamentos(){
    const tabela = document.getElementById("tabela-orcamento");

    const pesquisa = document.createElement("input");
    pesquisa.id = "pesquisa";
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
    const colunaDataEmissao = document.createElement("td");
    const colunaDataValidade = document.createElement("td");
    const colunaTipoEntrega = document.createElement("td");
    const colunaResponsavel = document.createElement("td");
    const colunaFrete = document.createElement("td");
    const colunaMarcasEmbarque = document.createElement("td");
    const colunaNomeEntrega = document.createElement("td");
    const colunaCnpjEntrega = document.createElement("td");
    const colunaEnderecoEntrega = document.createElement("td");
    const colunaCidadeEntrega = document.createElement("td");
    const colunaPaisEntrega = document.createElement("td");
    const colunaCliente = document.createElement("td");
    
    linha.id = "linhas";

    colunaItem.textContent = "ITEM";
    colunaCodigo.textContent = "CODIGO";
    colunaDataEmissao .textContent = "Data Emissão";
    colunaDataValidade.textContent = "Data Validade";
    colunaTipoEntrega.textContent = "Tipo Entrega";
    colunaResponsavel.textContent = "Responsavel";
    colunaFrete.textContent = "Frete";
    colunaMarcasEmbarque.textContent = "Marcas Embarque";
    colunaNomeEntrega.textContent = "Nome Entrega";
    colunaCnpjEntrega.textContent = "Cnpj Entrega";
    colunaEnderecoEntrega.textContent = "Endereco Entrega";
    colunaCidadeEntrega.textContent = "Cidade Entrega";
    colunaPaisEntrega.textContent = "Pais Entrega";
    colunaCliente.textContent = "Cliente";

    linha.appendChild(colunaItem);
    linha.appendChild(colunaCodigo);
    linha.appendChild(colunaDataEmissao);
    linha.appendChild(colunaDataValidade);
    linha.appendChild(colunaTipoEntrega);
    linha.appendChild(colunaResponsavel);
    linha.appendChild(colunaFrete);
    linha.appendChild(colunaMarcasEmbarque);
    linha.appendChild(colunaNomeEntrega);
    linha.appendChild(colunaCnpjEntrega);
    linha.appendChild(colunaEnderecoEntrega);
    linha.appendChild(colunaCidadeEntrega);
    linha.appendChild(colunaPaisEntrega);
    linha.appendChild(colunaCliente);

    tabela.appendChild(linha);
}

function popularTabelaOrcamentos(dados){
    const tabela = document.getElementById("tabela-orcamento");
    for (const item of dados.results) {
        const linha = document.createElement("tr");
        const colunaBtnEditar = document.createElement("td");
        const colunaBtnVizualizar = document.createElement("td");
        const colunaBtnAdicionar = document.createElement("td");
        const colunaItem = document.createElement("td");
        const colunaCodigo = document.createElement("td");
        const colunaDataEmissao = document.createElement("td");
        const colunaDataValidade = document.createElement("td");
        const colunaTipoEntrega = document.createElement("td");
        const colunaResponsavel = document.createElement("td");
        const colunaFrete = document.createElement("td");
        const colunaMarcasEmbarque = document.createElement("td");
        const colunaNomeEntrega = document.createElement("td");
        const colunaCnpjEntrega = document.createElement("td");
        const colunaEnderecoEntrega = document.createElement("td");
        const colunaCidadeEntrega = document.createElement("td");
        const colunaPaisEntrega = document.createElement("td");
        const colunaCliente = document.createElement("td");
      
        var qtd = document.createElement("input");
        var btn = document.createElement("button");
        btn.id = "preencher"
        linha.id = "linhas";

        const btnEditar = document.createElement("button");
        const btnVizualizar = document.createElement("button");

        colunaBtnEditar.append(btnEditar);
        colunaBtnVizualizar.append(btnVizualizar);

        btnEditar.textContent = "Editar Pedidos";
        btnVizualizar.textContent = "Vizualizar Orcamento";

        btnEditar.id = item.id;
        btnVizualizar.id = item.id;

        const btnAdicionar = document.createElement("button");
        colunaBtnAdicionar.append(btnAdicionar);
        btnAdicionar.textContent = "Adicionar Peças";
        btnAdicionar.id = item.id;

        var id = item.id; 

        btn.setAttribute("onclick", "preencherForm("+ JSON.stringify(item) +")");            
        btnEditar.setAttribute("onclick", "editarOrcamento("+ btnEditar.id +")");            
        btnVizualizar.setAttribute("onclick", "vizualizarOrcamento("+ btnVizualizar.id +")");            
        btnAdicionar.setAttribute("onclick", "adicionarPecas("+ btnAdicionar.id +")");                      
        
        /*colunaQtd.appendChild(qtd);
        colunaQtd.appendChild(btn);*/

        colunaItem.textContent = i.toString();
        colunaCodigo.textContent = item.codigo;
        colunaDataEmissao.textContent = item.data_emissao;
        colunaDataValidade.textContent = item.data_validade;
        colunaTipoEntrega.textContent = item.tipo_entrega;
        colunaResponsavel.textContent = item.responsavel;
        colunaFrete.textContent = item.frete;
        colunaMarcasEmbarque.textContent = item.marcas_embarque;
        colunaNomeEntrega.textContent = item.nome_entrega;
        colunaCnpjEntrega.textContent = item.cnpj_entrega;
        colunaEnderecoEntrega.textContent = item.endereco_entrega;
        colunaCidadeEntrega.textContent = item.cidade_entrega;
        colunaPaisEntrega.textContent = item.pais_entrega;
        console.log(item)
        colunaCliente.textContent = item.client.nome_cliente;
        btn.textContent = "adicionar ao orçamento";

        linha.appendChild(colunaItem);
        linha.appendChild(colunaCodigo);
        linha.appendChild(colunaDataEmissao);
        linha.appendChild(colunaDataValidade);
        linha.appendChild(colunaTipoEntrega);
        linha.appendChild(colunaResponsavel);
        linha.appendChild(colunaFrete);
        linha.appendChild(colunaMarcasEmbarque);
        linha.appendChild(colunaNomeEntrega);
        linha.appendChild(colunaCnpjEntrega);
        linha.appendChild(colunaEnderecoEntrega);
        linha.appendChild(colunaCidadeEntrega);
        linha.appendChild(colunaPaisEntrega);
        linha.appendChild(colunaCliente); 
        linha.appendChild(colunaBtnEditar);
        linha.appendChild(colunaBtnVizualizar);            
        linha.appendChild(colunaBtnAdicionar);       

        tabela.appendChild(linha);

        i++;
      }

}

function carregarTabelaFaturas(){
    const tabela = document.getElementById("tabela-faturas");

    pesquisa.addEventListener("keypress", function(event) {
        if (event.key === "Enter") {
          event.preventDefault();
          pesquisar();
        }
      });

    const linha = document.createElement("tr");
    const colunaItem = document.createElement("td");
    const colunaCodigo = document.createElement("td");
    const colunaDataEmissao = document.createElement("td");
    const colunaDataValidade = document.createElement("td");
    const colunaTipoEntrega = document.createElement("td");
    const colunaResponsavel = document.createElement("td");
    const colunaFrete = document.createElement("td");
    const colunaMarcasEmbarque = document.createElement("td");
    const colunaNomeEntrega = document.createElement("td");
    const colunaCnpjEntrega = document.createElement("td");
    const colunaEnderecoEntrega = document.createElement("td");
    const colunaCidadeEntrega = document.createElement("td");
    const colunaPaisEntrega = document.createElement("td");
    const colunaCliente = document.createElement("td");
    
    linha.id = "linhas";

    colunaItem.textContent = "ITEM";
    colunaCodigo.textContent = "CODIGO";
    colunaDataEmissao .textContent = "Data Emissão";
    colunaDataValidade.textContent = "Data Validade";
    colunaTipoEntrega.textContent = "Tipo Entrega";
    colunaResponsavel.textContent = "Responsavel";
    colunaFrete.textContent = "Frete";
    colunaMarcasEmbarque.textContent = "Marcas Embarque";
    colunaNomeEntrega.textContent = "Nome Entrega";
    colunaCnpjEntrega.textContent = "Cnpj Entrega";
    colunaEnderecoEntrega.textContent = "Endereco Entrega";
    colunaCidadeEntrega.textContent = "Cidade Entrega";
    colunaPaisEntrega.textContent = "Pais Entrega";
    colunaCliente.textContent = "Cliente";

    linha.appendChild(colunaItem);
    linha.appendChild(colunaCodigo);
    linha.appendChild(colunaDataEmissao);
    linha.appendChild(colunaDataValidade);
    linha.appendChild(colunaTipoEntrega);
    linha.appendChild(colunaResponsavel);
    linha.appendChild(colunaFrete);
    linha.appendChild(colunaMarcasEmbarque);
    linha.appendChild(colunaNomeEntrega);
    linha.appendChild(colunaCnpjEntrega);
    linha.appendChild(colunaEnderecoEntrega);
    linha.appendChild(colunaCidadeEntrega);
    linha.appendChild(colunaPaisEntrega);
    linha.appendChild(colunaCliente);

    tabela.appendChild(linha);
}

function popularTabelaFaturas(dados){
    const tabela = document.getElementById("tabela-faturas");
    for (const item of dados.results) {
        const linha = document.createElement("tr");
        const colunaBtnEditar = document.createElement("td");
        const colunaBtnFatura = document.createElement("td");
        const colunaBtnPacotes = document.createElement("td");
        const colunaBtnPedido = document.createElement("td");
        const colunaBtnAdicionar = document.createElement("td");
        const colunaItem = document.createElement("td");
        const colunaCodigo = document.createElement("td");
        const colunaDataEmissao = document.createElement("td");
        const colunaDataValidade = document.createElement("td");
        const colunaTipoEntrega = document.createElement("td");
        const colunaResponsavel = document.createElement("td");
        const colunaFrete = document.createElement("td");
        const colunaMarcasEmbarque = document.createElement("td");
        const colunaNomeEntrega = document.createElement("td");
        const colunaCnpjEntrega = document.createElement("td");
        const colunaEnderecoEntrega = document.createElement("td");
        const colunaCidadeEntrega = document.createElement("td");
        const colunaPaisEntrega = document.createElement("td");
        const colunaCliente = document.createElement("td");
      
        var qtd = document.createElement("input");
        var btn = document.createElement("button");
        btn.id = "preencher"
        linha.id = "linhas";

        const btnEditar = document.createElement("button");
        const btnVizualizar = document.createElement("button");
        const btnFatura = document.createElement("button");
        const btnPacotes = document.createElement("button");
        const btnPedidos = document.createElement("button");

        colunaBtnEditar.append(btnEditar);
        colunaBtnFatura.append(btnFatura);
        colunaBtnPacotes.append(btnPacotes);
        colunaBtnPedido.append(btnPedidos);

        btnEditar.textContent = "Editar Pedidos";
        btnFatura.textContent = "Vizualizar Fatura";
        btnPacotes.textContent = "Packing List";
        btnPedidos.textContent = "Pedidos de Compras";

        btnEditar.id = item.id;
        btnVizualizar.id = item.id;
        btnFatura.id = item.id;
        btnPacotes.id = item.id;
        btnPedidos.id = item.id;

        const btnAdicionar = document.createElement("button");
        colunaBtnAdicionar.append(btnAdicionar);
        btnAdicionar.textContent = "Adicionar Peças";
        btnAdicionar.id = item.id;

        var id = item.id; 

        btn.setAttribute("onclick", "preencherForm("+ JSON.stringify(item) +")");            
        btnEditar.setAttribute("onclick", "editarOrcamento("+ btnEditar.id +")");                     
        btnAdicionar.setAttribute("onclick", "adicionarPecas("+ btnAdicionar.id +")");            
        btnFatura.setAttribute("onclick", "vizualizarFatura("+ btnFatura.id +")");            
        btnPacotes.setAttribute("onclick", "vizualizarPacotes("+ btnPacotes.id +")");            
        btnPedidos.setAttribute("onclick", "vizualizarPedidoCompra("+ btnPedidos.id +")");            
        
        /*colunaQtd.appendChild(qtd);
        colunaQtd.appendChild(btn);*/

        colunaItem.textContent = j.toString();
        colunaCodigo.textContent = item.codigo;
        colunaDataEmissao.textContent = item.data_emissao;
        colunaDataValidade.textContent = item.data_validade;
        colunaTipoEntrega.textContent = item.tipo_entrega;
        colunaResponsavel.textContent = item.responsavel;
        colunaFrete.textContent = item.frete;
        colunaMarcasEmbarque.textContent = item.marcas_embarque;
        colunaNomeEntrega.textContent = item.nome_entrega;
        colunaCnpjEntrega.textContent = item.cnpj_entrega;
        colunaEnderecoEntrega.textContent = item.endereco_entrega;
        colunaCidadeEntrega.textContent = item.cidade_entrega;
        colunaPaisEntrega.textContent = item.pais_entrega;
        console.log(item)
        colunaCliente.textContent = item.client.nome_cliente;
        btn.textContent = "adicionar ao orçamento";

        linha.appendChild(colunaItem);
        linha.appendChild(colunaCodigo);
        linha.appendChild(colunaDataEmissao);
        linha.appendChild(colunaDataValidade);
        linha.appendChild(colunaTipoEntrega);
        linha.appendChild(colunaResponsavel);
        linha.appendChild(colunaFrete);
        linha.appendChild(colunaMarcasEmbarque);
        linha.appendChild(colunaNomeEntrega);
        linha.appendChild(colunaCnpjEntrega);
        linha.appendChild(colunaEnderecoEntrega);
        linha.appendChild(colunaCidadeEntrega);
        linha.appendChild(colunaPaisEntrega);
        linha.appendChild(colunaCliente); 
        linha.appendChild(colunaBtnEditar);
        linha.appendChild(colunaBtnFatura);       
        linha.appendChild(colunaBtnPacotes);       
        linha.appendChild(colunaBtnPedido);       
        linha.appendChild(colunaBtnAdicionar);       

        tabela.appendChild(linha);

        j++;
      }

}
function carregarTabelaCotacao(){
    const tabela = document.getElementById("tabela-cotacoes");

    pesquisa.addEventListener("keypress", function(event) {
        if (event.key === "Enter") {
          event.preventDefault();
          pesquisar();
        }
      });

    const linha = document.createElement("tr");
    const colunaItem = document.createElement("td");
    const colunaCodigo = document.createElement("td");
    const colunaDataEmissao = document.createElement("td");
    const colunaDataValidade = document.createElement("td");
    const colunaTipoEntrega = document.createElement("td");
    const colunaResponsavel = document.createElement("td");
    const colunaFrete = document.createElement("td");
    const colunaMarcasEmbarque = document.createElement("td");
    const colunaNomeEntrega = document.createElement("td");
    const colunaCnpjEntrega = document.createElement("td");
    const colunaEnderecoEntrega = document.createElement("td");
    const colunaCidadeEntrega = document.createElement("td");
    const colunaPaisEntrega = document.createElement("td");
    const colunaCliente = document.createElement("td");
    
    linha.id = "linhas";

    colunaItem.textContent = "ITEM";
    colunaCodigo.textContent = "CODIGO";
    colunaDataEmissao .textContent = "Qtd. Peças";
    colunaDataValidade.textContent = "Qtd. Cotadas";
    colunaTipoEntrega.textContent = "Tipo Entrega";
    colunaResponsavel.textContent = "Responsavel";
    colunaFrete.textContent = "Frete";
    colunaMarcasEmbarque.textContent = "Marcas Embarque";
    colunaNomeEntrega.textContent = "Nome Entrega";
    colunaCnpjEntrega.textContent = "Cnpj Entrega";
    colunaEnderecoEntrega.textContent = "Endereco Entrega";
    colunaCidadeEntrega.textContent = "Cidade Entrega";
    colunaPaisEntrega.textContent = "Pais Entrega";
    colunaCliente.textContent = "Cliente";

    linha.appendChild(colunaItem);
    linha.appendChild(colunaCodigo);
    linha.appendChild(colunaDataEmissao);
    linha.appendChild(colunaDataValidade);
    linha.appendChild(colunaTipoEntrega);
    linha.appendChild(colunaResponsavel);
    linha.appendChild(colunaFrete);
    linha.appendChild(colunaMarcasEmbarque);
    linha.appendChild(colunaNomeEntrega);
    linha.appendChild(colunaCnpjEntrega);
    linha.appendChild(colunaEnderecoEntrega);
    linha.appendChild(colunaCidadeEntrega);
    linha.appendChild(colunaPaisEntrega);
    linha.appendChild(colunaCliente);

    tabela.appendChild(linha);
}

async function popularTabelaCotacao(dados){
    const tabela = document.getElementById("tabela-cotacoes");
    for (const item of dados.results) {

        urlQtdCotacoes =  urlA + "/cotacaoOrcamento/1/";
        const respostaQtdCotacoes = await fetch(urlQtdCotacoes, {
            method: "GET",
            headers: {
              "Content-type": "application/json; charset=UTF-8",
              "Authorization": "token " + localStorage.tokenUsuario
            }
          });
        const dadosJSONQtdCotacoes = await respostaQtdCotacoes.json();

        urlQtdPecas =  urlA + "/orcamento/1/pedidos/0/0/";
        const respostaQtdPecas = await fetch(urlQtdPecas, {
            method: "GET",
            headers: {
              "Content-type": "application/json; charset=UTF-8",
              "Authorization": "token " + localStorage.tokenUsuario
            }
          });
        const dadosJSONQtdPecas = await respostaQtdPecas.json();

        const linha = document.createElement("tr");
        const colunaBtnPedido = document.createElement("td");
        const colunaBtnCotacao = document.createElement("td");
        const colunaItem = document.createElement("td");
        const colunaCodigo = document.createElement("td");
        const colunaDataEmissao = document.createElement("td");
        const colunaDataValidade = document.createElement("td");
        const colunaTipoEntrega = document.createElement("td");
        const colunaResponsavel = document.createElement("td");
        const colunaFrete = document.createElement("td");
        const colunaMarcasEmbarque = document.createElement("td");
        const colunaNomeEntrega = document.createElement("td");
        const colunaCnpjEntrega = document.createElement("td");
        const colunaEnderecoEntrega = document.createElement("td");
        const colunaCidadeEntrega = document.createElement("td");
        const colunaPaisEntrega = document.createElement("td");
        const colunaCliente = document.createElement("td");
      
        var qtd = document.createElement("input");
        var btn = document.createElement("button");
        btn.id = "preencher"
        linha.id = "linhas";

        const btnPedidos = document.createElement("button");
        const btnCotacao = document.createElement("button");

        colunaBtnPedido.append(btnPedidos);
        colunaBtnCotacao.append(btnCotacao);

        btnPedidos.textContent = "Pedidos de Compras";
        btnCotacao.textContent = "Realizar Cotações";

        btnPedidos.id = item.id;
        btnCotacao.id = item.id;


        var id = item.id; 

        btn.setAttribute("onclick", "preencherForm("+ JSON.stringify(item) +")");                       
        btnPedidos.setAttribute("onclick", "vizualizarPedidoCompra("+ btnPedidos.id +")");            
        btnCotacao.setAttribute("onclick", "vizualizarCotacao("+ btnCotacao.id +")");            
        
        /*colunaQtd.appendChild(qtd);
        colunaQtd.appendChild(btn);*/

        colunaItem.textContent = j.toString();
        colunaCodigo.textContent = item.codigo;
        colunaDataEmissao.textContent = dadosJSONQtdPecas.count;
        colunaDataValidade.textContent = dadosJSONQtdCotacoes.count;
        colunaTipoEntrega.textContent = item.tipo_entrega;
        colunaResponsavel.textContent = item.responsavel;
        colunaFrete.textContent = item.frete;
        colunaMarcasEmbarque.textContent = item.marcas_embarque;
        colunaNomeEntrega.textContent = item.nome_entrega;
        colunaCnpjEntrega.textContent = item.cnpj_entrega;
        colunaEnderecoEntrega.textContent = item.endereco_entrega;
        colunaCidadeEntrega.textContent = item.cidade_entrega;
        colunaPaisEntrega.textContent = item.pais_entrega;
        console.log(item)
        colunaCliente.textContent = item.client.nome_cliente;
        btn.textContent = "adicionar ao orçamento";

        linha.appendChild(colunaItem);
        linha.appendChild(colunaCodigo);
        linha.appendChild(colunaDataEmissao);
        linha.appendChild(colunaDataValidade);
        linha.appendChild(colunaTipoEntrega);
        linha.appendChild(colunaResponsavel);
        linha.appendChild(colunaFrete);
        linha.appendChild(colunaMarcasEmbarque);
        linha.appendChild(colunaNomeEntrega);
        linha.appendChild(colunaCnpjEntrega);
        linha.appendChild(colunaEnderecoEntrega);
        linha.appendChild(colunaCidadeEntrega);
        linha.appendChild(colunaPaisEntrega);
        linha.appendChild(colunaCliente);      
        linha.appendChild(colunaBtnPedido);       
        linha.appendChild(colunaBtnCotacao);       

        tabela.appendChild(linha);

        j++;
      }

}

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

function logIn(){
    location.href = "/login.html";
}

function logOut(){
    localStorage.email = 'null';
    localStorage.tokenUsuario = null;
    location.reload();
}

function vizualizarOrcamento(orcamentoId){
    localStorage.orcamentoId = orcamentoId;
    window.open('/orcamento.html', '_blank').focus();
}

function adicionarPecas(orcamentoId){
    localStorage.orcamentoId = orcamentoId;
    window.open('/pecas.html', '_blank').focus();
}

function vizualizarFatura(orcamentoId){
    localStorage.orcamentoId = orcamentoId;
    window.open('/fatura.html', '_blank').focus();
}

function vizualizarPacotes(orcamentoId){
    localStorage.orcamentoId = orcamentoId;
    window.open('/packingList.html', '_blank').focus();
}

function vizualizarPedidoCompra(orcamentoId){
    localStorage.orcamentoId = orcamentoId;
    window.open( '/pedidoCompra.html', '_blank').focus();
}

function editarOrcamento(orcamentoId){
    localStorage.orcamentoId = orcamentoId;
    window.open( '/editarPedidos.html', '_blank').focus();
}


function vizualizarCotacao(orcamentoId){
    localStorage.orcamentoId = orcamentoId;
    window.open( '/cadastroCotacao.html', '_blank').focus();
}