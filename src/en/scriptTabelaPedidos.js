var orcamentoId = localStorage.orcamentoId;
var pecaCodigo = localStorage.pecaCodigo;
var volume = localStorage.volume;

function loadScript(url)
{    
    var head = document.getElementsByTagName('head')[0];
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = url;
    head.appendChild(script);
}

if (localStorage.pecaCodigo == null){
    pecaCodigo = 0;
}

if (localStorage.volume == null){
    volume = 0;
}

async function  carregarUrl(){
    const urlA = await fetch('../rotaBack.json')
    dados = await urlA.json()
    return dados.API_URL
  }

var urlAPI = "";
var urlPecas = "";
var urlNotificar = "";
var urlCondicao = "";
var urlPacote = "";

var precoTotal = 0.0;
var pesoTotal = 0.0;
var pesoBruto = 0.0;
var volumeTotal = 0.0;
var volumeBruto = 0.0;
var tipo = document.getElementById('pagina');

async function carregarDados() {
    loadScript("../header.js");
    urlA = await carregarUrl()

    urlAPI =  urlA + "/orcamento/" + orcamentoId + "/pedidos/"+ volume + "/" + pecaCodigo + "/";
    urlPecas = urlA + "/orcamento/" + orcamentoId + "/pedidos/"+ volume + "/0/";
    urlNotificar = urlA + "/notificacao/"+ orcamentoId + "/";
    urlCondicao = urlA + "/condicao/"+ orcamentoId + "/";
    urlPacote = urlA + "/packOrcamento/" + orcamentoId;


        const resposta = await fetch(urlAPI, {
            method: "GET",
            //credentials: 'include',
            headers: {
              "Content-type": "application/json; charset=UTF-8",
              "Authorization": "token " + localStorage.tokenUsuario
            }
          });

        const respostaPacote = await fetch(urlPacote, {
            method: "GET",
            headers: {
              "Content-type": "application/json; charset=UTF-8",
              "Authorization": "token " + localStorage.tokenUsuario
            }
        });

        const dadosPacote = await respostaPacote.json();

        var dadosJSON = await resposta.json();

        if(tipo.value != 'packingList2'){
            popularTabelaPedidos(dadosJSON);
        }

        if (tipo.value == "fatura" || tipo.value == "orcamento"){
            const respostaNotificar = await fetch(urlNotificar, {
                method: "GET",
                headers: {
                  "Content-type": "application/json; charset=UTF-8",
                  "Authorization": "token " + localStorage.tokenUsuario
                }
              });
            const dadosNotificar = await respostaNotificar.json();

            const respostaCondicao = await fetch(urlCondicao, {
                method: "GET",
                headers: {
                  "Content-type": "application/json; charset=UTF-8",
                  "Authorization": "token " + localStorage.tokenUsuario
                }
              });
            const dadosCondicao = await respostaCondicao.json();
            
            popularTabelaCondicao(dadosCondicao);
            
            if(tipo.value != "orcamento"){
                popularMarcaEmbarque(dadosJSON);
                popularTabelaDestinatario(dadosJSON);
                popularTabelaNotificar(dadosNotificar);            
                popularTabelaPeso(dadosJSON, dadosPacote.count);
            }
        }

        if (tipo.value == "packingList"  || tipo.value == 'packingList2'){

            const respostaPecas = await fetch(urlPecas, {
                method: "GET",
                headers: {
                  "Content-type": "application/json; charset=UTF-8",
                  "Authorization": "token " + localStorage.tokenUsuario
                }
              });

            
            var dadosPecas = await respostaPecas.json();

            if(dadosPecas.count == 0){
                urlAPI =  urlA + "/orcamento/" + orcamentoId + "/pedidos/"+ 0 + "/" + pecaCodigo + "/";
                urlPecas = urlA + "/orcamento/" + orcamentoId + "/pedidos/"+ 0 + "/0/";
                const respostaPecas2 = await fetch(urlPecas, {
                    method: "GET",
                    headers: {
                      "Content-type": "application/json; charset=UTF-8",
                      "Authorization": "token " + localStorage.tokenUsuario
                    }
                  });

                  const resposta = await fetch(urlAPI, {
                    method: "GET",
                    //credentials: 'include',
                    headers: {
                      "Content-type": "application/json; charset=UTF-8",
                      "Authorization": "token " + localStorage.tokenUsuario
                    }
                  });
    
                dadosJSON = await resposta.json();
                dadosPecas = await respostaPecas2.json();
            }
            
            if(tipo.value == 'packingList2'){
                popularTabelaPacotesPutDelete(dadosPacote);
                popularTabelaPedidos(dadosJSON, dadosPacote);
            }else{
                popularTabelaPacotes(dadosPacote);
                popularTabelaPeso(dadosJSON, dadosPacote.count);
            }  
            popularDownPecas(dadosPecas);  
            popularDownVolume(dadosPacote)
        }

        popularTabelaCliente1(dadosJSON);
        popularTabelaCliente2(dadosJSON);
        popularTabelaCliente3(dadosJSON);
        popularTabelaCliente4(dadosJSON);
    }

// Função para formatar data
function formatarData(data) {
    const dataFormatada = new Date(data);
    return `${dataFormatada.getDate()}/${dataFormatada.getMonth() + 1}/${dataFormatada.getFullYear()}`;
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

function  formatarPeso(peso){
    return `  ${peso.toFixed(2).replace(".", ",")}`;
}

carregarDados();
    
function popularTabelaCliente1(dados){
    console.log(dados)
    const tabela = document.getElementById("tabela-cliente");

    const linhaComprador = document.createElement("td");
    linhaComprador.textContent = "CLIENT";
    linhaComprador.colSpan = 6;
    linhaComprador.id = "linhaComprador";
    

    const orcamento = dados.results[0].orcamento;

    const linha = document.createElement("tr");
    const colunaDataEmissao = document.createElement("td");
    const colunaDataValidade = document.createElement("td");
    const colunaTipoEntrega = document.createElement("td");
    const colunaFrete = document.createElement("td");
    const colunaResponsavel = document.createElement("td");
    const colunaCodigo = document.createElement("td");
   
    colunaDataEmissao.textContent = "DATE OF ISSUE";
    colunaDataValidade.textContent = "DATA VALIDADE";
    colunaTipoEntrega.textContent = "INCOTERM";
    colunaFrete.textContent = "FREIGHT";
    colunaResponsavel.textContent = "RESPONSIBLE";
    colunaCodigo.textContent = "QUOTATION";

    linha.appendChild(colunaDataEmissao);
    linha.appendChild(colunaDataValidade);
    linha.appendChild(colunaTipoEntrega);
    linha.appendChild(colunaFrete);
    linha.appendChild(colunaResponsavel);
    linha.appendChild(colunaCodigo);
    

    tabela.appendChild(linha);
    
    const linha1 = document.createElement("tr");
    const colunaDataEmissao1 = document.createElement("td");
    const colunaDataValidade1 = document.createElement("td");
    const colunaTipoEntrega1 = document.createElement("td");
    const colunaFrete1 = document.createElement("td");
    const colunaResponsavel1 = document.createElement("td");
    const colunaCodigo1 = document.createElement("td");

    colunaDataEmissao1.textContent = formatarData(orcamento.data_emissao);
    colunaDataValidade1.textContent = formatarData(orcamento.data_validade);
    colunaTipoEntrega1.textContent = orcamento.tipo_entrega;
    colunaFrete1.textContent = orcamento.frete;
    colunaResponsavel1.textContent = orcamento.responsavel;
    colunaCodigo1.textContent = orcamento.codigo;

    linha1.appendChild(colunaDataEmissao1);
    linha1.appendChild(colunaDataValidade1);
    linha1.appendChild(colunaTipoEntrega1);
    linha1.appendChild(colunaFrete1);
    linha1.appendChild(colunaResponsavel1);
    linha1.appendChild(colunaCodigo1);

    tabela.appendChild(linha1);
    tabela.appendChild(linhaComprador);
}

function popularTabelaCliente2(dados){
    const tabela = document.getElementById("tabela-cliente");

    const cliente = dados.results[0].cliente.client;

    const linha = document.createElement("tr");
    const colunaNome = document.createElement("td");
    colunaNome.setAttribute('colspan', '6');
    
    colunaNome.textContent = "CLIENT NAME";

    linha.appendChild(colunaNome);

    tabela.appendChild(linha);
    
    const linha1 = document.createElement("tr");
    const colunaNome1 = document.createElement("td");
    colunaNome1.setAttribute('colspan', '6');

    colunaNome1.textContent = cliente.nome_cliente;

    linha1.appendChild(colunaNome1);

    tabela.appendChild(linha1);
}

function popularTabelaCliente3(dados){
    const tabela = document.getElementById("tabela-cliente");

    const cliente = dados.results[0].cliente.client;

    const linha = document.createElement("tr");
    const colunaEndereco = document.createElement("td");
    const colunaCEP = document.createElement("td");
    const colunaCidade = document.createElement("td");
    const colunaPais = document.createElement("td");
    colunaEndereco.setAttribute('colspan', '3');
    
    colunaEndereco.textContent = "ADDRESS";
    colunaCEP.textContent = "POSTAL CODE";
    colunaCidade.textContent = "CITY";
    colunaPais.textContent = "Country";

    linha.appendChild(colunaEndereco);
    linha.appendChild(colunaCEP);
    linha.appendChild(colunaCidade);
    linha.appendChild(colunaPais);

    tabela.appendChild(linha);
    
    const linha1 = document.createElement("tr");
    const colunaEndereco1 = document.createElement("td");
    const colunaCEP1 = document.createElement("td");
    const colunaCidade1 = document.createElement("td");
    const colunaPais1 = document.createElement("td");
    colunaEndereco1.setAttribute('colspan', '3');

    colunaEndereco1.textContent = cliente.endereco;
    colunaCEP1.textContent = cliente.cep;
    colunaCidade1.textContent = cliente.cidade;
    colunaPais1.textContent = cliente.pais;

    linha1.appendChild(colunaEndereco1);
    linha1.appendChild(colunaCEP1);
    linha1.appendChild(colunaCidade1);
    linha1.appendChild(colunaPais1);

    tabela.appendChild(linha1);
}

function popularTabelaCliente4(dados){
    const tabela = document.getElementById("tabela-cliente");

    const cliente = dados.results[0].cliente.client;

    const linha = document.createElement("tr");
    const colunaTelefone = document.createElement("td");
    const colunaEmail = document.createElement("td");
    colunaEmail.setAttribute('colspan', '5');

    colunaTelefone.textContent = "TELEPHONE";
    colunaEmail.textContent = "E-MAIL";

    linha.appendChild(colunaTelefone);
    linha.appendChild(colunaEmail);

    tabela.appendChild(linha);
    
    const linha1 = document.createElement("tr");
    const colunaTelefone1 = document.createElement("td");
    const colunaEmail1 = document.createElement("td");
    colunaEmail1.setAttribute('colspan', '5');

    colunaTelefone1.textContent = cliente.telefone;
    colunaEmail1.textContent = cliente.email;

    linha1.appendChild(colunaTelefone1);
    linha1.appendChild(colunaEmail1);

    tabela.appendChild(linha1);
}

function popularTabelaDestinatario(dados){
    const tabela = document.getElementById("tabela-destinatario");

    const linhaDestinatario = document.createElement("td");

    linhaDestinatario.textContent = "CONSIGNEE";
    linhaDestinatario.colSpan = 5;
    linhaDestinatario.id = "linhaDestinatario";

    tabela.append(linhaDestinatario)

    const destinatario = dados.results[0].orcamento;

    const linha = document.createElement("tr");

    const colunaNome = document.createElement("td");
    const colunaCnpj = document.createElement("td");
    const colunaEndereco = document.createElement("td");
    const colunaCidade = document.createElement("td");
    const colunaPais = document.createElement("td");

    colunaNome.textContent = "Name";
    colunaCnpj.textContent = "CNPJ";
    colunaEndereco.textContent = "Address";
    colunaCidade.textContent = "CITY";
    colunaPais.textContent = "Country";

    linha.appendChild(colunaNome);
    linha.appendChild(colunaCnpj);
    linha.appendChild(colunaEndereco);
    linha.appendChild(colunaCidade);
    linha.appendChild(colunaPais);

    const linha1 = document.createElement("tr");

    const colunaNome1 = document.createElement("td");
    const colunaCnpj1 = document.createElement("td");
    const colunaEndereco1 = document.createElement("td");
    const colunaCidade1 = document.createElement("td");
    const colunaPais1 = document.createElement("td");

    colunaNome1.textContent = destinatario.nome_entrega;
    colunaCnpj1.textContent = destinatario.cnpj_entrega;
    colunaEndereco1.textContent = destinatario.endereco_entrega;
    colunaCidade1.textContent = destinatario.cidade_entrega;
    colunaPais1.textContent = destinatario.pais_entrega;

    linha1.appendChild(colunaNome1);
    linha1.appendChild(colunaCnpj1);
    linha1.appendChild(colunaEndereco1);
    linha1.appendChild(colunaCidade1);
    linha1.appendChild(colunaPais1);


    /*nomeEntrega": "jao",
            "cnpjEntrega": "123",
            "enderecoEntrega": "tamioios, 262",
            "cidadeEntrega": "ribeiraõ",
            "paisEntrega": "brasil",*/

    tabela.append(linha)
    tabela.append(linha1)

}

function popularMarcaEmbarque(dados){
    const tabela = document.getElementById("tabela-marca-embarque");

    const linha = document.createElement("td");
    const marca = document.createElement("td");

    linha.id = "marca-embarque"

    linha.textContent = "Shipping Marks:";
    marca.textContent = dados.results[0].orcamento.marcas_embarque

    tabela.append(linha)
    tabela.append(marca)

}

function popularTabelaNotificar(dados){
    const tabela = document.getElementById("tabela-notificar");

    const linhaNotificar = document.createElement("td");
    linhaNotificar.textContent = "NOTIFY";
    linhaNotificar.colSpan = 3;
    linhaNotificar.id = "linhaNotificar";
    tabela.appendChild(linhaNotificar);

    const linha = document.createElement("tr");
    const colunaNome = document.createElement("td");
    const colunaTelefone = document.createElement("td");
    const colunaEmail = document.createElement("td");

    colunaNome.textContent = "NAME:";
    colunaTelefone.textContent = "TELEPHONE:";
    colunaEmail.textContent = "E-MAIL:";

    linha.appendChild(colunaNome);
    linha.appendChild(colunaTelefone);
    linha.appendChild(colunaEmail);

    tabela.appendChild(linha);

    const linha1 = document.createElement("tr");
    const colunaNome1 = document.createElement("td");
    const colunaTelefone1 = document.createElement("td");
    const colunaEmail1 = document.createElement("td");

    colunaNome1.textContent = dados.results[0].nome;
    colunaTelefone1.textContent = dados.results[0].telefone;
    colunaEmail1.textContent = dados.results[0].email;

    linha1.appendChild(colunaNome1);
    linha1.appendChild(colunaTelefone1);
    linha1.appendChild(colunaEmail1);

    tabela.appendChild(linha1);

}

async function popularTabelaCondicao(dados){
    const tabela = document.getElementById("tabela-condicao");

    const linhaCondicao = document.createElement("td");
    linhaCondicao.textContent = "PAYMENT CONDITIONS";
    linhaCondicao.colSpan = 5;
    linhaCondicao.id = "linhaCondicao";
    tabela.appendChild(linhaCondicao);

    const linha = document.createElement("tr");
    const colunaCondicao = document.createElement("td");
    const colunaPorcetagem = document.createElement("td");
    const colunaData = document.createElement("td");
    const colunaTotal = document.createElement("td");

    colunaCondicao.textContent = "PAYMENT CONDITIONS";
    colunaPorcetagem.textContent = "%";
    colunaData.textContent = "DATE";
    colunaTotal.textContent = "TOTAL";

    linha.appendChild(colunaCondicao);
    linha.appendChild(colunaPorcetagem);
    linha.appendChild(colunaData);
    linha.appendChild(colunaTotal);

    tabela.appendChild(linha);

 
    for (const item of dados.results) {
        const linha = document.createElement("tr");
        const colunaCondicao = document.createElement("td");
        const colunaPorcetagem = document.createElement("td");
        const colunaData = document.createElement("td");
        const colunaTotal = document.createElement("td");
       
        colunaCondicao.textContent = item.cota;
        colunaPorcetagem.textContent = item.porcentagem;
        colunaData.textContent =  formatarData(item.data);
        colunaTotal.textContent = await formatarPreco(precoTotal * item.porcentagem / 100);     

        linha.appendChild(colunaCondicao);
        linha.appendChild(colunaPorcetagem);
        linha.appendChild(colunaData);
        linha.appendChild(colunaTotal);

        tabela.appendChild(linha);
      }

      const linhna1 = document.createElement("tr");
      const colunaTotal1 = document.createElement("td");

      colunaTotal1.textContent = "TOTAL = " + await formatarPreco(precoTotal);
      linhna1.appendChild(colunaTotal1);
      tabela.appendChild(linhna1);

}

function popularTabelaPeso(dados, qtdPacotes){
    tabela = document.getElementById("tabela-peso");

    const linhaPacote = document.createElement("td");
    linhaPacote.textContent = "PACKAGE";
    linhaPacote.colSpan = 5;
    linhaPacote.id = "linhaPacote";
    tabela.appendChild(linhaPacote);

    const linha = document.createElement("tr");
    const colunaQtd = document.createElement("td");
    const colunaPesoLiq = document.createElement("td");
    const colunaPesoBruto = document.createElement("td");
    const colunaVolume = document.createElement("td");
    const colunaEntrega = document.createElement("td");
    
    colunaQtd.textContent = "Qty. Packages"
    colunaPesoLiq.textContent = "NET WEIGHT"
    colunaPesoBruto.textContent = "GROSS WEIGHT";
    colunaVolume.textContent = "VOLUME";
    colunaEntrega.textContent = "DELIVERY";

    linha.appendChild(colunaQtd);
    linha.appendChild(colunaPesoLiq);
    linha.appendChild(colunaPesoBruto);
    linha.appendChild(colunaVolume);
    linha.appendChild(colunaEntrega);

    tabela.appendChild(linha);

    const linha1 = document.createElement("tr");
    const colunaQtd1 = document.createElement("td");
    const colunaPesoLiq1 = document.createElement("td");
    const colunaPesoBruto1 = document.createElement("td");
    const colunaVolume1 = document.createElement("td");
    const colunaEntrega1 = document.createElement("td");

    colunaQtd1.textContent = qtdPacotes;
    colunaPesoLiq1.textContent = pesoTotal;
    colunaPesoBruto1.textContent = pesoBruto;
    colunaVolume1.textContent = volumeBruto;
    colunaEntrega1.textContent = formatarData(dados.results[0].data_entrega);

    linha1.appendChild(colunaQtd1);
    linha1.appendChild(colunaPesoLiq1);
    linha1.appendChild(colunaPesoBruto1);
    linha1.appendChild(colunaVolume1);
    linha1.appendChild(colunaEntrega1);

    tabela.appendChild(linha1);
}

async function popularTabelaPedidos(dados, dadosPacote){
    const tabela = document.getElementById("tabela-pedidos");

    const linhaPecas = document.createElement("td");
    linhaPecas.textContent = "PARTS";
    linhaPecas.colSpan = 10;
    linhaPecas.id = "linhaPecas";
    tabela.appendChild(linhaPecas);
    
    const linha = document.createElement("tr");
    const colunaItem = document.createElement("td");
    const colunaCodigo = document.createElement("td");
    const colunaDescricao = document.createElement("td");
    const colunaQuantidade = document.createElement("td");

    colunaItem.setAttribute('width' , '10px')  
    colunaDescricao.setAttribute('width', '50px');    

    colunaItem.textContent = "ITEM";
    colunaCodigo.textContent = "CODE";
    colunaDescricao.textContent = "PRODUCTS";
    colunaQuantidade.textContent = "QTY.";    

    linha.appendChild(colunaItem);
    if (tipo.value == 'packingList' || tipo.value == 'packingList2'){
        const colunaCodigoS = document.createElement("select");
        colunaCodigoS.id = "colunaCodigoS";
        colunaCodigoS.value = "0";
        colunaCodigoS.setAttribute("onchange","filtrarCodigo()");
        linha.appendChild(colunaCodigoS);

        const opcaoCodigo = document.createElement("option");
        opcaoCodigo.textContent = "CODIGO";
        opcaoCodigo.value = '0';
        colunaCodigoS.append(opcaoCodigo);
        colunaCodigo.id = "colunaCodigo";
        colunaCodigo.hidden = true;
        linha.appendChild(colunaCodigo);
    }else{
        linha.appendChild(colunaCodigo);
    }
    linha.appendChild(colunaDescricao);
    linha.appendChild(colunaQuantidade);

    if (tipo.value != 'orcamento'){
        const colunaUnid = document.createElement("td");
        colunaUnid.textContent = "UNID";
        linha.appendChild(colunaUnid);
    }else{
        const colunaDataEntrega = document.createElement("td");
        colunaDataEntrega.textContent = "DELIVERY";
        linha.appendChild(colunaDataEntrega);
    }

    if (tipo.value != 'packingList' && tipo.value != 'packingList2'){
        const colulaPrecoUnit = document.createElement("td");
        const colunaPreco = document.createElement("td");
        const colunaNcm = document.createElement("td");

        colulaPrecoUnit.textContent = "UNIT PRICE";
        colunaPreco.textContent = 'TOTAL PRICE';    
        colunaNcm.textContent = 'NCM';

        linha.appendChild(colunaNcm);
        linha.appendChild(colulaPrecoUnit);
        linha.appendChild(colunaPreco); 
    }
    
    if (tipo.value != "fatura"){ 

        const colunaPeso = document.createElement("td");
        colunaPeso.textContent = 'WEIGHT';
        linha.appendChild(colunaPeso);

        const colunaPesoTotal = document.createElement("td");
        colunaPesoTotal.textContent = 'TOTAL WEIGHT';
        linha.appendChild(colunaPesoTotal);
    }

    if (tipo.value == 'packingList2' ){
        const colunaVolume = document.createElement("td");
        colunaVolume.textContent = 'VOLUME';
        colunaVolume.id = "volumePdf"
        linha.appendChild(colunaVolume);
    }

    if (tipo.value == 'packingList'){
/*        const colunaCodigoS = document.createElement("select");
        colunaCodigoS.id = "colunaCodigoS";
        colunaCodigoS.value = "0";
        colunaCodigoS.setAttribute("onchange","filtrarCodigo()");
        linha.appendChild(colunaCodigoS);

        const opcaoCodigo = document.createElement("option");
        opcaoCodigo.textContent = "CODIGO";
        opcaoCodigo.value = '';
        colunaCodigoS.append(opcaoCodigo);*/
        const colunaVolumeS = document.createElement("td");
        colunaVolumeS.textContent = 'VOLUME';
        colunaVolumeS.id = "volumePdf"
        linha.appendChild(colunaVolumeS);
        colunaVolumeS.hidden = true

        const colunaVolume = document.createElement("select");
        colunaVolume.id = "volume";
        colunaVolume.value = "0"
        colunaVolume.setAttribute("onchange", "filtrarVolume()");
        linha.appendChild(colunaVolume);

        const opcao = document.createElement("option")
        opcao.textContent = 'VOLUME';
        opcao.value = "0"
        colunaVolume.append(opcao)
        
    }

    tabela.appendChild(linha);

    var i = 1
    for (const item of dados.results) {
        const linha = document.createElement("tr");
        const colunaItem = document.createElement("td");
        const colunaCodigo = document.createElement("td");
        const colunaDescricao = document.createElement("td");
        const colunaQuantidade = document.createElement("td");               

        colunaItem.textContent = i.toString();
        colunaCodigo.textContent = item.peca.codigo;
        colunaDescricao.textContent = item.peca.descricao;
        colunaQuantidade.textContent = item.quantidade;                 

        precoTotal  += item.peca.preco_venda * item.quantidade;
        volumeTotal += item.peca.volume     * item.quantidade;
        volumeBruto += item.volume_bruto     * item.quantidade;
        pesoBruto   += item.peso_bruto       * item.quantidade;
        pesoTotal   += item.peca.peso       * item.quantidade;        

        linha.appendChild(colunaItem);
        linha.appendChild(colunaCodigo);
        linha.appendChild(colunaDescricao); 
        linha.appendChild(colunaQuantidade); 

        if (tipo.value != 'orcamento'){
            const colunaUnid = document.createElement("td");
            colunaUnid.textContent = item.unidade;
            linha.appendChild(colunaUnid);
        }else{
            const colunaDataEntrega = document.createElement("td");
            colunaDataEntrega.textContent = formatarData(item.data_entrega);
            linha.appendChild(colunaDataEntrega);
        }

        if (tipo.value != 'packingList' && tipo.value != 'packingList2'){
            const colulaPrecoUnit = document.createElement("td");
            const colunaPreco = document.createElement("td");
            const colunaNcm = document.createElement("td");
    
            colulaPrecoUnit.textContent = await formatarPreco(item.peca.preco_venda * 1.2);
            colunaPreco.textContent = await formatarPreco(item.peca.preco_venda * item.quantidade * 1.2);
            colunaNcm.textContent = item.peca.ncm;
    
            linha.appendChild(colunaNcm);
            linha.appendChild(colulaPrecoUnit);
            linha.appendChild(colunaPreco); 
        }

        if (tipo.value != "fatura"){ 
            const colunaPeso = document.createElement("td");
            colunaPeso.textContent = formatarPeso(item.peca.peso*1);
            linha.appendChild(colunaPeso);

            const colunaPesoTotal = document.createElement("td");
            colunaPesoTotal.textContent = formatarPeso(item.peca.peso * item.quantidade);
            linha.appendChild(colunaPesoTotal);
        }
        
        if (tipo.value == 'packingList'){
            const colunaVolume = document.createElement("td"); 
            colunaVolume.textContent = item.volume;
            linha.appendChild(colunaVolume);
        }

        if(tipo.value == 'packingList2'){
            const colunaVolume = document.createElement("td");
            const select = document.createElement("select");
            colunaVolume.append(select);
            const option = document.createElement("option");
            option.textContent = "volume";
            select.append(option);
            //console.log(dadosPacote)
            for(const opcao of dadosPacote.results){
                const option = document.createElement("option");
                option.textContent = opcao.volume;
                option.value = opcao.pacote;
                option.id = item.id;
                select.setAttribute("onchange","adicionarVolumePeca(" + JSON.stringify(item)  +  ",this)");
                select.append(option);
            } 
            linha.appendChild(colunaVolume);
        }

        tabela.appendChild(linha);

        i++;
      }
      if (tipo.value != "packingList"  && tipo.value != 'packingList2'){
      const totalOrcado = document.getElementById("total-orcado");
      const totalPeso = document.getElementById("total-peso");
      const totalVolume = document.getElementById("total-volume");
      
      totalOrcado.append('TOTAL PRICE = ');
      totalOrcado.append(await formatarPreco(precoTotal));
      
      if (tipo.value != "fatura"){ 

        totalVolume.append('TOTAL VOLUME = ');
        totalVolume.append(formatarPeso(volumeTotal));

        totalPeso.append('TOTAL WEIGHT     = ');
        totalPeso.append(formatarPeso(pesoTotal));

      }
    }
}

function popularDownPecas(dados){
    const coluna = document.getElementById("colunaCodigoS");
    for(const item of dados.results){        
        const opcaoCodigo = document.createElement("option");
        opcaoCodigo.textContent = item.peca.codigo;
        opcaoCodigo.value = item.peca.id;
        coluna.append(opcaoCodigo);
    }
    coluna.value = localStorage.pecaCodigo;
}

function popularDownVolume(dados){
    const coluna = document.getElementById("volume");
    for(const item of dados.results){        
        const opcaoCodigo = document.createElement("option");
        opcaoCodigo.textContent = item.volume;
        opcaoCodigo.value = item.volume;
        coluna.append(opcaoCodigo);
    }
    coluna.value = localStorage.volume;
}    

function popularTabelaPacotes(dados){
    const tabela = document.getElementById("tabela-pacotes");
    const linha = document.createElement("tr");

    const linhaPecas = document.createElement("td");
    linhaPecas.textContent = "PACKAGES";
    linhaPecas.colSpan = 10;
    linhaPecas.id = "linhaPecas";
    tabela.appendChild(linhaPecas);

    const colunaVolume = document.createElement("td");
    const colunaPacote = document.createElement("td");
    const colunaLargura = document.createElement("td");
    const colunaComprimento = document.createElement("td");
    const colunaAltura = document.createElement("td");
    const colunaVol = document.createElement("td");
    const colunaPeso = document.createElement("td");

    colunaVolume.textContent = "VOLUME";
    colunaPacote.textContent = "PACKAGE";
    colunaLargura.textContent = "WIDTH";
    colunaComprimento.textContent = "LENGTH";
    colunaAltura.textContent = "HEIGHT";
    colunaVol.textContent = "Vol (m³)";
    colunaPeso.textContent = "GROSS WEIGHT(Kg)";

    linha.appendChild(colunaVolume);
    linha.appendChild(colunaPacote);
    linha.appendChild(colunaLargura);
    linha.appendChild(colunaComprimento);
    linha.appendChild(colunaAltura);
    linha.appendChild(colunaVol);
    linha.appendChild(colunaPeso);

    tabela.appendChild(linha);

    for (const item of dados.results) {
        const linha = document.createElement("tr");
        linha.id = item.id;

        const colunaVolume = document.createElement("td");
        const colunaPacote = document.createElement("td");
        const colunaLargura = document.createElement("td");
        const colunaComprimento = document.createElement("td");
        const colunaAltura = document.createElement("td");
        const colunaVol = document.createElement("td");
        const colunaPeso = document.createElement("td");
    
        colunaVolume.textContent = item.volume;
        colunaPacote.textContent = item.pacote;
        colunaLargura.textContent = item.largura;
        colunaComprimento.textContent = item.comprimento;
        colunaAltura.textContent = item.altura;
        colunaVol.textContent = item.volumePack;
        colunaPeso.textContent = item.peso;
    
        linha.appendChild(colunaVolume);
        linha.appendChild(colunaPacote);
        linha.appendChild(colunaLargura);
        linha.appendChild(colunaComprimento);
        linha.appendChild(colunaAltura);
        linha.appendChild(colunaVol);
        linha.appendChild(colunaPeso);
    
        tabela.appendChild(linha);
    }

}

function popularTabelaPacotesPutDelete(dados){
    const tabela = document.getElementById("tabela-pacotes");
    const linha = document.createElement("tr");

    const colunaVolume = document.createElement("td");
    const colunaPacote = document.createElement("td");
    const colunaLargura = document.createElement("td");
    const colunaComprimento = document.createElement("td");
    const colunaAltura = document.createElement("td");
    const colunaVol = document.createElement("td");
    const colunaPeso = document.createElement("td");

    colunaVolume.textContent = "VOLUME";
    colunaPacote.textContent = "PACOTE";
    colunaLargura.textContent = "LARGURA";
    colunaComprimento.textContent = "COMPRIMENTO";
    colunaAltura.textContent = "ALTURA";
    colunaVol.textContent = "Vol (m³)";
    colunaPeso.textContent = "PESO BRUTO(Kg)";

    linha.appendChild(colunaVolume);
    linha.appendChild(colunaPacote);
    linha.appendChild(colunaLargura);
    linha.appendChild(colunaComprimento);
    linha.appendChild(colunaAltura);
    linha.appendChild(colunaVol);
    linha.appendChild(colunaPeso);

    tabela.appendChild(linha);

    for (const item of dados.results) {
        const linha = document.createElement("tr");
        linha.id = item.id;

        const colunaVolume = document.createElement("td");
        const colunaPacote = document.createElement("td");
        const colunaLargura = document.createElement("td");
        const colunaComprimento = document.createElement("td");
        const colunaAltura = document.createElement("td");
        const colunaVol = document.createElement("td");
        const colunaPeso = document.createElement("td");
        const colunaPut = document.createElement("td");
        const colunaDelete = document.createElement("td");

        const inputLargura = document.createElement("input");
        const inputComprimento = document.createElement("input");
        const inputAltura = document.createElement("input");
        const inputPeso = document.createElement("input");
        const btnPut = document.createElement("button");
        const btnDelete = document.createElement("button");
    
        colunaVolume.textContent = item.volume;
        colunaPacote.textContent = item.pacote;
        colunaVol.textContent = item.volumePack;

        inputLargura.value = item.largura;
        inputComprimento.value = item.comprimento;
        inputAltura.value = item.altura;
        inputPeso.value = item.peso;
        
        inputLargura.id = item.id + "largura";
        inputComprimento.id = item.id + "comprimento";
        inputAltura.id = item.id + "altura";
        inputPeso.id = item.id + "peso";

        btnPut.textContent = "ATUALIZAR";
        btnDelete.textContent = "DELETAR";

        btnPut.setAttribute("onclick","atualizarPacote("+ JSON.stringify(item) +  ")");
        btnDelete.setAttribute("onclick","excluirPacote("+ item.id +  ")");

        colunaLargura.append(inputLargura);
        colunaComprimento.append(inputComprimento);
        colunaAltura.append(inputAltura);
        colunaPeso.append(inputPeso);
        colunaPut.append(btnPut);
        colunaDelete.append(btnDelete);
    
        linha.appendChild(colunaVolume);
        linha.appendChild(colunaPacote);
        linha.appendChild(colunaLargura);
        linha.appendChild(colunaComprimento);
        linha.appendChild(colunaAltura);
        linha.appendChild(colunaVol);
        linha.appendChild(colunaPeso);
        linha.appendChild(colunaPut);
        linha.appendChild(colunaDelete);
    
        tabela.appendChild(linha);
    }
}

function filtrarCodigo(){
    codigoPeca = document.getElementById("colunaCodigoS").value;
    localStorage.pecaCodigo = codigoPeca;
    location.reload();
}

function filtrarVolume(){
    volume = document.getElementById("volume").value;
    localStorage.volume = volume;
    location.reload();
}

function adicionarVolumePeca(pedido,sel ){
    var volume = sel.options[sel.selectedIndex].text;
    var pacote = sel.options[sel.selectedIndex].value;
    updateVolumePeca(pedido, volume, pacote);
}

async function updateVolumePeca(pedido, volume, pacote){
    urlA = await carregarUrl()
    console.log(pedido)
    await fetch(urlA + "/pedidos/" + pedido.id + "/", {
        method: "PATCH",
        body: JSON.stringify({
            "volume": volume,
        }),
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            "Authorization": "token " + localStorage.tokenUsuario
        }
      })
        .then((response) => response.json())
        .then((json) => console.log(json));
}

async function atualizarPacote(pacote){
    urlA = await carregarUrl()
    var largura = document.getElementById(pacote.id+"largura").value
    var comprimento = document.getElementById(pacote.id+"comprimento").value
    var altura = document.getElementById(pacote.id+"altura").value
    var peso = document.getElementById(pacote.id+"peso").value
    
    await fetch(urlA + "/pack/" + pacote.id + "/", {
        method: "PUT",
        body: JSON.stringify({
                "volume": pacote.volume,
                "pacote": pacote.pacote,
                "comprimento": comprimento,
                "largura": largura,
                "altura": altura,
                "peso": peso,
                "orcamento": pacote.orcamento
        }),
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            "Authorization": "token " + localStorage.tokenUsuario
        }
      })
        .then((response) => response.json())
        .then((json) => console.log(json));
}

async function excluirPacote(item){
    urlA = await carregarUrl()
    await fetch(urlA + "/pack/"+item+"/", {
        method: 'DELETE',
        headers:{
            "Authorization": "token " + localStorage.tokenUsuario
        }
    })
    .then(res => res.text())
    .then(res => console.log(res));
}