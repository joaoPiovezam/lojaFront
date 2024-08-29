var orcamentoId = localStorage.orcamentoId;
var pecaCodigo = localStorage.pecaCodigo;

if (localStorage.pecaCodigo == null){
    pecaCodigo = '';
}

const urlAPI = "http://127.0.0.1:8000/orcamento/" + orcamentoId + "/pedidos/?search=" + pecaCodigo;
const urlPecas = "http://127.0.0.1:8000/orcamento/" + orcamentoId + "/pedidos/";
const urlNotificar = "http://127.0.0.1:8000/notificacao/"+ orcamentoId + "/";
const urlCondicao = "http://127.0.0.1:8000/condicao/"+ orcamentoId + "/";
const urlPacote = "http://127.0.0.1:8000/packOrcamento/" + orcamentoId;

var precoTotal = 0.0;
var pesoTotal = 0.0;
var pesoBruto = 0.0;
var volumeTotal = 0.0;
var volumeBruto = 0.0;
var tipo = document.getElementById('pagina');

async function carregarDados() {
        const resposta = await fetch(urlAPI, {
            method: "GET",
            //credentials: 'include',
            headers: {
              "Content-type": "application/json; charset=UTF-8",
              "Authorization": "token " + localStorage.tokenUsuario
            }
          });
        const dadosJSON = await resposta.json();

        if(tipo.value != 'packingList2'){
            popularTabelaPedidos(dadosJSON);
        }

        if (tipo.value == "fatura"){
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

            popularTabelaNotificar(dadosNotificar);
            popularTabelaCondicao(dadosCondicao);
            popularTabelaPeso(dadosJSON);
        }

        if (tipo.value == "packingList"  || tipo.value == 'packingList2'){
            const respostaPacote = await fetch(urlPacote, {
                method: "GET",
                headers: {
                  "Content-type": "application/json; charset=UTF-8",
                  "Authorization": "token " + localStorage.tokenUsuario
                }
              });

            const respostaPecas = await fetch(urlPecas, {
                method: "GET",
                headers: {
                  "Content-type": "application/json; charset=UTF-8",
                  "Authorization": "token " + localStorage.tokenUsuario
                }
              });

            const dadosPacote = await respostaPacote.json();
            const dadosPecas = await respostaPecas.json();
            
            if(tipo.value == 'packingList2'){
                popularTabelaPacotesPutDelete(dadosPacote);
                popularTabelaPedidos(dadosJSON, dadosPacote);
            }else{
                popularTabelaPacotes(dadosPacote);
            }  
            popularDownPecas(dadosPecas);  
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

// Função para formatar preço
function formatarPreco(preco) {
    return ` ${preco.toFixed(2).replace(".", ",")}`;
}    
carregarDados();
    
function popularTabelaCliente1(dados){
    console.log(dados)
    const tabela = document.getElementById("tabela-cliente");

    const linhaComprador = document.createElement("td");
    linhaComprador.textContent = "CLIENTE";
    linhaComprador.colSpan = 5;
    linhaComprador.id = "linhaComprador";
    tabela.appendChild(linhaComprador);

    const orcamento = dados.results[0].orcamento;

    const linha = document.createElement("tr");
    const colunaDataEmissao = document.createElement("td");
    const colunaDataValidade = document.createElement("td");
    const colunaTipoEntrega = document.createElement("td");
    const colunaResponsavel = document.createElement("td");
    const colunaCodigo = document.createElement("td");
   
    colunaDataEmissao.textContent = "DATA DE EMISSÃO";
    colunaDataValidade.textContent = "DATA VALIDADE";
    colunaTipoEntrega.textContent = "INCOTERM";
    colunaResponsavel.textContent = "RESPONSÁVEL";
    colunaCodigo.textContent = "ORÇAMENTO";

    linha.appendChild(colunaDataEmissao);
    linha.appendChild(colunaDataValidade);
    linha.appendChild(colunaTipoEntrega);
    linha.appendChild(colunaResponsavel);
    linha.appendChild(colunaCodigo);

    tabela.appendChild(linha);
    
    const linha1 = document.createElement("tr");
    const colunaDataEmissao1 = document.createElement("td");
    const colunaDataValidade1 = document.createElement("td");
    const colunaTipoEntrega1 = document.createElement("td");
    const colunaResponsavel1 = document.createElement("td");
    const colunaCodigo1 = document.createElement("td");

    colunaDataEmissao1.textContent = formatarData(orcamento.dataEmissao);
    colunaDataValidade1.textContent = formatarData(orcamento.dataValidade);
    colunaTipoEntrega1.textContent = orcamento.tipoEntrega;
    colunaResponsavel1.textContent = orcamento.responsavel;
    colunaCodigo1.textContent = orcamento.codigo;

    linha1.appendChild(colunaDataEmissao1);
    linha1.appendChild(colunaDataValidade1);
    linha1.appendChild(colunaTipoEntrega1);
    linha1.appendChild(colunaResponsavel1);
    linha1.appendChild(colunaCodigo1);

    tabela.appendChild(linha1);
}

function popularTabelaCliente2(dados){
    const tabela = document.getElementById("tabela-cliente");

    const cliente = dados.results[0].cliente.client;

    const linha = document.createElement("tr");
    const colunaNome = document.createElement("td");
    colunaNome.setAttribute('colspan', '5');
    
    colunaNome.textContent = "NOME CLINETE";

    linha.appendChild(colunaNome);

    tabela.appendChild(linha);
    
    const linha1 = document.createElement("tr");
    const colunaNome1 = document.createElement("td");
    colunaNome1.setAttribute('colspan', '5');

    colunaNome1.textContent = cliente.nomeCliente;

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
    colunaEndereco.setAttribute('colspan', '2');
    
    colunaEndereco.textContent = "ENDERECO";
    colunaCEP.textContent = "POSTAL CODE";
    colunaCidade.textContent = "CIDADE";
    colunaPais.textContent = "PAÍS";

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
    colunaEndereco1.setAttribute('colspan', '2');

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
    colunaEmail.setAttribute('colspan', '4');

    colunaTelefone.textContent = "TELEFONE";
    colunaEmail.textContent = "EMAIL";

    linha.appendChild(colunaTelefone);
    linha.appendChild(colunaEmail);

    tabela.appendChild(linha);
    
    const linha1 = document.createElement("tr");
    const colunaTelefone1 = document.createElement("td");
    const colunaEmail1 = document.createElement("td");
    colunaEmail1.setAttribute('colspan', '4');

    colunaTelefone1.textContent = cliente.telefone;
    colunaEmail1.textContent = cliente.email;

    linha1.appendChild(colunaTelefone1);
    linha1.appendChild(colunaEmail1);

    tabela.appendChild(linha1);
}

function popularTabelaNotificar(dados){
    const tabela = document.getElementById("tabela-notificar");

    const linhaNotificar = document.createElement("td");
    linhaNotificar.textContent = "NOTIFICAR";
    linhaNotificar.colSpan = 3;
    linhaNotificar.id = "linhaNotificar";
    tabela.appendChild(linhaNotificar);

    const linha = document.createElement("tr");
    const colunaNome = document.createElement("td");
    const colunaTelefone = document.createElement("td");
    const colunaEmail = document.createElement("td");

    colunaNome.textContent = "NOME:";
    colunaTelefone.textContent = "TELEFONE:";
    colunaEmail.textContent = "EMAIL:";

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

function popularTabelaCondicao(dados){
    const tabela = document.getElementById("tabela-condicao");

    const linhaCondicao = document.createElement("td");
    linhaCondicao.textContent = "CONDIÇÕES DE PAGAMENTO";
    linhaCondicao.colSpan = 5;
    linhaCondicao.id = "linhaCondicao";
    tabela.appendChild(linhaCondicao);

    const linha = document.createElement("tr");
    const colunaCondicao = document.createElement("td");
    const colunaPorcetagem = document.createElement("td");
    const colunaData = document.createElement("td");
    const colunaTotal = document.createElement("td");

    colunaCondicao.textContent = "CONDIÇÕES DE PAGAMENTO";
    colunaPorcetagem.textContent = "%";
    colunaData.textContent = "DATA";
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
        colunaTotal.textContent = formatarPreco(precoTotal * item.porcentagem / 100);     

        linha.appendChild(colunaCondicao);
        linha.appendChild(colunaPorcetagem);
        linha.appendChild(colunaData);
        linha.appendChild(colunaTotal);

        tabela.appendChild(linha);
      }

      const linhna1 = document.createElement("tr");
      const colunaTotal1 = document.createElement("td");

      colunaTotal1.textContent = "TOTAL = " + formatarPreco(precoTotal);
      linhna1.appendChild(colunaTotal1);
      tabela.appendChild(linhna1);

}

function popularTabelaPeso(dados){
    tabela = document.getElementById("tabela-peso");

    const linhaPacote = document.createElement("td");
    linhaPacote.textContent = "PACOTE";
    linhaPacote.colSpan = 5;
    linhaPacote.id = "linhaPacote";
    tabela.appendChild(linhaPacote);

    const linha = document.createElement("tr");
    const colunaPesoLiq = document.createElement("td");
    const colunaPesoBruto = document.createElement("td");
    const colunaVolume = document.createElement("td");
    const colunaEntrega = document.createElement("td");
    
    colunaPesoLiq.textContent = "PESO LIQ."
    colunaPesoBruto.textContent = "PESO BRUTO";
    colunaVolume.textContent = "VOLUME";
    colunaEntrega.textContent = "ENTREGA";

    linha.appendChild(colunaPesoLiq);
    linha.appendChild(colunaPesoBruto);
    linha.appendChild(colunaVolume);
    linha.appendChild(colunaEntrega);

    tabela.appendChild(linha);

    const linha1 = document.createElement("tr");
    const colunaPesoLiq1 = document.createElement("td");
    const colunaPesoBruto1 = document.createElement("td");
    const colunaVolume1 = document.createElement("td");
    const colunaEntrega1 = document.createElement("td");

    colunaPesoLiq1.textContent = pesoTotal;
    colunaPesoBruto1.textContent = pesoBruto;
    colunaVolume1.textContent = volumeBruto;
    colunaEntrega1.textContent = formatarData(dados.results[0].dataEntrega);

    linha1.appendChild(colunaPesoLiq1);
    linha1.appendChild(colunaPesoBruto1);
    linha1.appendChild(colunaVolume1);
    linha1.appendChild(colunaEntrega1);

    tabela.appendChild(linha1);
}

function popularTabelaPedidos(dados, dadosPacote){
    const tabela = document.getElementById("tabela-pedidos");

    const linhaPecas = document.createElement("td");
    linhaPecas.textContent = "PEÇAS";
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
    colunaCodigo.textContent = "CODIGO";
    colunaDescricao.textContent = "PRODUTOS";
    colunaQuantidade.textContent = "QTDE.";    

    linha.appendChild(colunaItem);
    if (tipo.value == 'packingList' || tipo.value == 'packingList2'){
        const colunaCodigoS = document.createElement("select");
        colunaCodigoS.id = "colunaCodigoS";
        colunaCodigoS.value = "0";
        colunaCodigoS.setAttribute("onchange","filtrarCodigo()");
        linha.appendChild(colunaCodigoS);

        const opcaoCodigo = document.createElement("option");
        opcaoCodigo.textContent = "CODIGO";
        opcaoCodigo.value = '';
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
        colunaDataEntrega.textContent = "ENTREGA";
        linha.appendChild(colunaDataEntrega);
    }

    if (tipo.value != 'packingList' && tipo.value != 'packingList2'){
        const colulaPrecoUnit = document.createElement("td");
        const colunaPreco = document.createElement("td");
        const colunaNcm = document.createElement("td");

        colulaPrecoUnit.textContent = "PREÇO UN.";
        colunaPreco.textContent = 'PREÇO TOTAL';    
        colunaNcm.textContent = 'NCM';

        linha.appendChild(colunaNcm);
        linha.appendChild(colulaPrecoUnit);
        linha.appendChild(colunaPreco); 
    }
    
    if (tipo.value != "fatura"){ 

        const colunaPeso = document.createElement("td");
        colunaPeso.textContent = 'PESO';
        linha.appendChild(colunaPeso);

        const colunaPesoTotal = document.createElement("td");
        colunaPesoTotal.textContent = 'PESO TOTAL';
        linha.appendChild(colunaPesoTotal);
    }

    if (tipo.value == 'packingList' || tipo.value == 'packingList2'){
        const colunaVolume = document.createElement("td");
        colunaVolume.textContent = 'VOLUME';
        linha.appendChild(colunaVolume);
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

        precoTotal  += item.peca.precoVenda * item.quantidade;
        volumeTotal += item.peca.volume     * item.quantidade;
        volumeBruto += item.volumeBruto     * item.quantidade;
        pesoBruto   += item.pesoBruto       * item.quantidade;
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
            colunaDataEntrega.textContent = formatarData(item.dataEntrega);
            linha.appendChild(colunaDataEntrega);
        }

        if (tipo.value != 'packingList' && tipo.value != 'packingList2'){
            const colulaPrecoUnit = document.createElement("td");
            const colunaPreco = document.createElement("td");
            const colunaNcm = document.createElement("td");
    
            colulaPrecoUnit.textContent = formatarPreco(item.peca.precoVenda * 1.2);
            colunaPreco.textContent = formatarPreco(item.peca.precoVenda * item.quantidade * 1.2);
            colunaNcm.textContent = item.peca.ncm;
    
            linha.appendChild(colunaNcm);
            linha.appendChild(colulaPrecoUnit);
            linha.appendChild(colunaPreco); 
        }

        if (tipo.value != "fatura"){ 
            const colunaPeso = document.createElement("td");
            colunaPeso.textContent = formatarPreco(item.peca.peso*1);
            linha.appendChild(colunaPeso);

            const colunaPesoTotal = document.createElement("td");
            colunaPesoTotal.textContent = formatarPreco(item.peca.peso * item.quantidade);
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
      
      totalOrcado.append('PREÇO TOTAL  = ');
      totalOrcado.append(formatarPreco(precoTotal));
      
      if (tipo.value != "fatura"){ 

        totalVolume.append('VOLUME TOTAL = ');
        totalVolume.append(formatarPreco(volumeTotal));

        totalPeso.append('PESO TOTAL     = ');
        totalPeso.append(formatarPreco(pesoTotal));

      }
    }
}

function popularDownPecas(dados){
    const coluna = document.getElementById("colunaCodigoS");
    for(const item of dados.results){        
        const opcaoCodigo = document.createElement("option");
        opcaoCodigo.textContent = item.peca.codigo;
        opcaoCodigo.value = item.peca.codigo;
        coluna.append(opcaoCodigo);
    }
    coluna.value = localStorage.pecaCodigo;
}    

function popularTabelaPacotes(dados){
    const tabela = document.getElementById("tabela-pacotes");
    const linha = document.createElement("tr");

    const linhaPecas = document.createElement("td");
    linhaPecas.textContent = "PACOTES";
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

function adicionarVolumePeca(pedido,sel ){
    var volume = sel.options[sel.selectedIndex].text;
    var pacote = sel.options[sel.selectedIndex].value;
    updateVolumePeca(pedido, volume, pacote);
}

async function updateVolumePeca(pedido, volume, pacote){
    console.log(pedido)
    await fetch("http://127.0.0.1:8000/pedidos/" + pedido.id + "/", {
        method: "PUT",
        body: JSON.stringify({
            "codigoPedido": pedido.codigoPedido,
            "dataCriacao": pedido.dataCriacao,
            "dataEntrega": pedido.dataEntrega,
            "quantidade": pedido.quantidade,
            "pesoBruto": pedido.pesoBruto,
            "volumeBruto": pedido.volumeBruto,
            "unidade": pedido.unidade,
            "pacote": pacote,
            "volume": volume,
            "codigoPeca": pedido.codigoPeca,
            "codigoOrcamento": pedido.codigoOrcamento,
            "codigoCliente": pedido.codigoCliente
        }),
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
      })
        .then((response) => response.json())
        .then((json) => console.log(json));
}

async function atualizarPacote(pacote){
    var largura = document.getElementById(pacote.id+"largura").value
    var comprimento = document.getElementById(pacote.id+"comprimento").value
    var altura = document.getElementById(pacote.id+"altura").value
    var peso = document.getElementById(pacote.id+"peso").value
    
    await fetch("http://127.0.0.1:8000/pack/" + pacote.id + "/", {
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
            "Content-type": "application/json; charset=UTF-8"
        }
      })
        .then((response) => response.json())
        .then((json) => console.log(json));
}

async function excluirPacote(item){
    await fetch("http://127.0.0.1:8000/pack/"+item+"/", {
        method: 'DELETE',
    })
    .then(res => res.text())
    .then(res => console.log(res));
}