var pagina = 1;
var i = 1;
var str = "";
var id = 0;
var urlAPI = "";
var urlC = ""
async function  carregarUrl(){
    const urlA = await fetch('./rotaBack.json')
    dados = await urlA.json()
    return dados.API_URL
  }

//var urlAPI = "http://127.0.0.1:8000/orc/";

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
    //urlAPI = "http://127.0.0.1:8000/orcamentos/?format=json/?page="+ pagina +"&search="+str;
    carregarDados()

}

async function carregarDados() {
    loadScript("header.js");
    urlA = await carregarUrl()
    urlC =  urlA + "/clientes/"
        urlAPI =  urlA + "/orcamentos/?page="+ pagina +"&search="+str;
        const resposta = await fetch(urlAPI, {
            method: "GET",
            headers: {
              "Content-type": "application/json; charset=UTF-8",
              "Authorization": "token " + localStorage.tokenUsuario
            }
          });
        const dadosJSON = await resposta.json();
        const respostaC = await fetch(urlC, {
            method: "GET",
            headers: {
              "Content-type": "application/json; charset=UTF-8",
              "Authorization": "token " + localStorage.tokenUsuario
            }
          });
        const dadosJSONC = await respostaC.json();
        popularDropDown(dadosJSONC)
        //loadScript("cliente.js")
        if(pagina == 1){
            carregarTabela();
        }
        popularTabela(dadosJSON);
        
    }

function formatarPreco(preco) {
    return ` ${preco.toFixed(2).replace(".", ",")}`;
}  

carregarDados();

function carregarTabela(){
    const tabela = document.getElementById("tabela-pecas");

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

function popularTabela(dados){
    const botao = document.getElementById("atualizar");
    botao.style.display = "none";
    const tabela = document.getElementById("tabela-pecas");
    for (const item of dados.results) {
        const linha = document.createElement("tr");
        const colunaBtnEditar = document.createElement("td");
        const colunaBtnVizualizar = document.createElement("td");
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
        colunaBtnVizualizar.append(btnVizualizar);
        colunaBtnFatura.append(btnFatura);
        colunaBtnPacotes.append(btnPacotes);
        colunaBtnPedido.append(btnPedidos);

        btnEditar.textContent = "Editar Pedidos";
        btnVizualizar.textContent = "Vizualizar Orcamento";
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
        btnVizualizar.setAttribute("onclick", "vizualizarOrcamento("+ btnVizualizar.id +")");            
        btnAdicionar.setAttribute("onclick", "adicionarPecas("+ btnAdicionar.id +")");            
        btnFatura.setAttribute("onclick", "vizualizarFatura("+ btnFatura.id +")");            
        btnPacotes.setAttribute("onclick", "vizualizarPacotes("+ btnPacotes.id +")");            
        btnPedidos.setAttribute("onclick", "vizualizarPedidoCompra("+ btnPedidos.id +")");            
        
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
        linha.appendChild(colunaBtnFatura);       
        linha.appendChild(colunaBtnPacotes);       
        linha.appendChild(colunaBtnPedido);       
        linha.appendChild(colunaBtnAdicionar);       

        tabela.appendChild(linha);

        i++;
      }

}

function pesquisar(){
    pagina = 1
    for(var j = 1; j<=i; j++ ){
        var linhas = document.getElementById("linhas");
        linhas.remove();
    }
    str = document.getElementById("pesquisa").value;
    //urlAPI = "http://127.0.0.1:8000/orcamentos/?format=json/?page="+ pagina //+"&search="+str;
    var p = document.getElementById("pesquisa");
    p.remove();
    i=1;
    carregarDados();
}

function preencherForm(Fornecedor){
    const botaoCad = document.getElementById('cadastro');
    const botaoAtu = document.getElementById("atualizar");
    const Fornec = Fornecedor;
    var tipoPessoa =  document.getElementById('tipoPessoa');
    var nomeFornecedor = document.getElementById('nomeFornecedor');
    var cpfCnpj = document.getElementById('cpfCnpj');
    var endereco = document.getElementById('endereco');
    var cep = document.getElementById('cep');
    var cidade = document.getElementById('cidade');
    var pais = document.getElementById('pais');
    var telefone = document.getElementById('telefone');
    var site = document.getElementById('site');
    var email = document.getElementById('email');
    var detalhe = document.getElementById('detalhe');


    if (Fornec.tipoPessoa == 'f'){
        tipoPessoa.value = "fisica";
    }else{
        tipoPessoa.value = "juridica";
    }
    nomeFornecedor.value = Fornec.nomeFornecedor;
    cpfCnpj.value = Fornec.cpfCnpj;
    endereco.value = Fornec.endereco;
    cep.value = Fornec.cep;
    cidade.value = Fornec.cidade;
    pais.value = Fornec.pais;
    telefone.value = Fornec.telefone;
    site.value = Fornec.site;
    email.value = Fornec.email;
    detalhe.value = Fornec.detalhe;
    id = Fornec.id;

    botaoCad.style.display = "none";
    botaoAtu.style.display = "block";

}        
function addZero(i) {
    if (i < 10) {
        i = "0" + i;
    }
    return i;
}


async function add(){
    urlA = await carregarUrl()
    const formularioCadastro = document.getElementById('formularioCadastro');
    var data = new Date();
    
    
    ano = data.getFullYear();
    mes = data.getMonth()+1;
    dia = data.getDate();
    var data2 = new Date(data.setDate(data.getDate() +15));
    console.log(data2);
    ano2 = data2.getFullYear();
    mes2 = data2.getMonth()+1;
    dia2 = data2.getDate();
    const dados = {
        dataEmissao: ano + "-" + addZero(mes) + "-" + dia,
        dataValidade: ano2 + "-" + addZero(mes2) + "-" + addZero(dia2),
        tipoEntrega: document.getElementById('tipoEntrega').value,
        responsavel: document.getElementById('responsavel').value,
        nomeEntrega: document.getElementById('nomeEntrega').value,
        cnpjEntrega: document.getElementById('cnpjEntrega').value,
        enderecoEntrega: document.getElementById('enderecoEntrega').value,
        cidadeEntrega: document.getElementById('cidadeEntrega').value,
        paisEntrega: document.getElementById('paisEntrega').value,
        cliente: document.getElementById('dropDownClientes').value
    };
    console.log('Dados do formulário:', dados);

     await fetch( urlA + "/orcamento/", {
        method: "POST",
        body: JSON.stringify({
                "data_emissao": dados.dataEmissao,
                "data_validade": dados.dataValidade,
                "tipo_entrega": dados.tipoEntrega,
                "responsavel": dados.responsavel,
                "frete": 0,
                "marcas_embarque": "0",
                "nome_entrega": dados.nomeEntrega,
                "cnpj_entrega": dados.cnpjEntrega,
                "endereco_entrega": dados.enderecoEntrega,
                "cidade_entrega": dados.cidadeEntrega,
                "pais_entrega": dados.paisEntrega,
                "cliente": dados.cliente
        }),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
          "Authorization": "token " + localStorage.tokenUsuario
        }
      })
        .then((response) => response.json())
        .then((json) => console.log(json));
    
}

async function addOrcamento(){
     await add();
}

async function updateFornecedor(){
    urlA = await carregarUrl()
    const formularioCadastro = document.getElementById('formularioCadastro');

    formularioCadastro.addEventListener('submit', function(event) {
    event.preventDefault();

    const dados = {
        tipoPessoa: document.getElementById('tipoPessoa').value,
        nomeFornecedor: document.getElementById('nomeFornecedor').value,
        cpfCnpj: document.getElementById('cpfCnpj').value,
        endereco: document.getElementById('endereco').value,
        cep: document.getElementById('cep').value,
        cidade: document.getElementById('cidade').value,
        pais: document.getElementById('pais').value,
        telefone: document.getElementById('telefone').value,
        site: document.getElementById('site').value,
        email: document.getElementById('email').value,
        detalhe: document.getElementById('detalhe').value
    };
    console.log('Dados do formulário:', dados);
    if (dados.tipoPessoa == "Física"){
        var p = "f"
    }else{
        var p = "j"
    }
    fetch( urlA + "/orcamentos/" + id + "/", {
        method: "PUT",
        body: JSON.stringify({
            "id": id,
            "tipoPessoa": p,
            "nome_fornecedor": dados.nomeFornecedor,
            "cpfcnpj": dados.cpfCnpj,
            "endereco": dados.endereco,
            "cep": dados.cep,
            "cidade": dados.cidade,
            "pais": dados.pais,
            "telefone": dados.telefone,
            "site": dados.site,
            "email": dados.email,
            "detalhe": dados.detalhe
        }),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
          "Authorization": "token " + localStorage.tokenUsuario
        }
      })
        .then((response) => response.json())
        .then((json) => console.log(json));
    });
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

function popularDropDown(dados){
    const dropDownClientes = document.getElementById('dropDownClientes');

    for(const item of dados.results){
        const cliente = document.createElement("option");
        cliente.value = item.id;
        cliente.textContent = item.nome_cliente + ' - ' + item.cpfcnpj;
        console.log(item.nome_cliente + ' - ' + item.cpfcnpj);
        dropDownClientes.appendChild(cliente);
    }
}