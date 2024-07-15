var pagina = 1;
var i = 1;
var str = "";
var id = 0;

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
    urlAPI = "http://127.0.0.1:8000/orcamentos/?format=json/?page="+ pagina +"&search="+str;
    carregarDados()

}

var urlAPI = "http://127.0.0.1:8000/orcamentos/?format=json&page="+ pagina;

async function carregarDados() {
        const resposta = await fetch(urlAPI);
        const dadosJSON = await resposta.json();
        loadScript("cliente.js")
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

        const btnVizualizar = document.createElement("button");
        const btnFatura = document.createElement("button");
        const btnPacotes = document.createElement("button");
        const btnPedidos = document.createElement("button");

        colunaBtnVizualizar.append(btnVizualizar);
        colunaBtnFatura.append(btnFatura);
        colunaBtnPacotes.append(btnPacotes);
        colunaBtnPedido.append(btnPedidos);

        btnVizualizar.textContent = "Vizualizar Orcamento";
        btnFatura.textContent = "Vizualizar Fatura";
        btnPacotes.textContent = "Packing List";
        btnPedidos.textContent = "Pedidos de Compras";

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
        btnVizualizar.setAttribute("onclick", "vizualizarOrcamento("+ btnVizualizar.id +")");            
        btnAdicionar.setAttribute("onclick", "adicionarPecas("+ btnAdicionar.id +")");            
        btnFatura.setAttribute("onclick", "vizualizarFatura("+ btnFatura.id +")");            
        btnPacotes.setAttribute("onclick", "vizualizarPacotes("+ btnPacotes.id +")");            
        btnPedidos.setAttribute("onclick", "vizualizarPedidoCompra("+ btnPedidos.id +")");            
        
        /*colunaQtd.appendChild(qtd);
        colunaQtd.appendChild(btn);*/

        colunaItem.textContent = i.toString();
        colunaCodigo.textContent = item.codigo;
        colunaDataEmissao.textContent = item.dataEmissao;
        colunaDataValidade.textContent = item.dataValidade;
        colunaTipoEntrega.textContent = item.tipoEntrega;
        colunaResponsavel.textContent = item.responsavel;
        colunaFrete.textContent = item.frete;
        colunaMarcasEmbarque.textContent = item.marcasEmbarque;
        colunaNomeEntrega.textContent = item.nomeEntrega;
        colunaCnpjEntrega.textContent = item.cnpjEntrega;
        colunaEnderecoEntrega.textContent = item.enderecoEntrega;
        colunaCidadeEntrega.textContent = item.cidadeEntrega;
        colunaPaisEntrega.textContent = item.paisEntrega;
        colunaCliente.textContent = item.cliente;
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
    urlAPI = "http://127.0.0.1:8000/orcamentos/?format=json/?page="+ pagina //+"&search="+str;
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

function add(){
    const formularioCadastro = document.getElementById('formularioCadastro');

    formularioCadastro.addEventListener('submit', function(event) {
    event.preventDefault();
    const dados = {
        codigo: document.getElementById('codigo').value,
        dataEmissao: document.getElementById('dataEmissao').value,
        dataValidade: document.getElementById('dataValidade').value,
        tipoEntrega: document.getElementById('tipoEntrega').value,
        responsavel: document.getElementById('responsavel').value,
        frete: document.getElementById('frete').value,
        marcasEmbarque: document.getElementById('marcasEmbarque').value,
        nomeEntrega: document.getElementById('nomeEntrega').value,
        cnpjEntrega: document.getElementById('cnpjEntrega').value,
        enderecoEntrega: document.getElementById('enderecoEntrega').value,
        cidadeEntrega: document.getElementById('cidadeEntrega').value,
        paisEntrega: document.getElementById('paisEntrega').value,
        cliente: document.getElementById('dropDownClientes').value
    };
    console.log('Dados do formulário:', dados);

    fetch("http://127.0.0.1:8000/orcamentos/", {
        method: "POST",
        body: JSON.stringify({
                "codigo": dados.codigo,
                "dataEmissao": dados.dataEmissao,
                "dataValidade": dados.dataValidade,
                "tipoEntrega": dados.tipoEntrega,
                "responsavel": dados.responsavel,
                "frete": dados.frete,
                "marcasEmbarque": dados.marcasEmbarque,
                "nomeEntrega": dados.nomeEntrega,
                "cnpjEntrega": dados.cnpjEntrega,
                "enderecoEntrega": dados.enderecoEntrega,
                "cidadeEntrega": dados.cidadeEntrega,
                "paisEntrega": dados.paisEntrega,
                "cliente": dados.cliente
        }),
        headers: {
          "Content-type": "application/json; charset=UTF-8"
        }
      })
        .then((response) => response.json())
        .then((json) => console.log(json));
    });
    
}

async function addOrcamento(){
     await add();
}

function updateFornecedor(){
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
    fetch("http://127.0.0.1:8000/orcamentos/" + id + "/", {
        method: "PUT",
        body: JSON.stringify({
            "id": id,
            "tipoPessoa": p,
            "nomeFornecedor": dados.nomeFornecedor,
            "cpfCnpj": dados.cpfCnpj,
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
          "Content-type": "application/json; charset=UTF-8"
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