const urlAPI = "http://127.0.0.1:8000/orcamento/2/pedidos/?format=json";
const urlNotificar = "http://127.0.0.1:8000/notificacao/2/";
const urlCondicao = "http://127.0.0.1:8000/condicao/2/";

var precoTotal = 0.0;
var pesoTotal = 0.0;
var pesoBruto = 0.0;
var volumeTotal = 0.0;
var volumeBruto = 0.0;
var tipo = document.getElementById('pagina');

async function carregarDados() {
        const resposta = await fetch(urlAPI);
        const dadosJSON = await resposta.json();

        popularTabelaPedidos(dadosJSON);

        if (tipo.value == "fatura"){
            const respostaNotificar = await fetch(urlNotificar);
            const dadosNotificar = await respostaNotificar.json();

            const respostaCondicao = await fetch(urlCondicao);
            const dadosCondicao = await respostaCondicao.json();

            popularTabelaNotificar(dadosNotificar);
            popularTabelaCondicao(dadosCondicao);
            popularTabelaPeso(dadosJSON);
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
    const tabela = document.getElementById("tabela-cliente");

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

function popularTabelaPedidos(dados){
    const tabela = document.getElementById("tabela-pedidos");
    
    const linha = document.createElement("tr");
    const colunaItem = document.createElement("td");
    const colunaCodigo = document.createElement("td");
    const colunaDescricao = document.createElement("td");
    const colunaQuantidade = document.createElement("td");

    const colulaPrecoUnit = document.createElement("td");
    const colunaPreco = document.createElement("td");
    const colunaNcm = document.createElement("td");   
    colunaDescricao.setAttribute('width', '188px');    

    colunaItem.textContent = "ITEM";
    colunaCodigo.textContent = "CODIGO";
    colunaDescricao.textContent = "PRODUTOS";
    colunaQuantidade.textContent = "QTDE.";
    
    colulaPrecoUnit.textContent = "PREÇO UN.";
    colunaPreco.textContent = 'PREÇO TOTAL';    
    
    colunaNcm.textContent = 'NCM';

    linha.appendChild(colunaItem);
    linha.appendChild(colunaCodigo);
    linha.appendChild(colunaDescricao);
    if (tipo.value != "fatura"){ 
        const colunaDataEntrega = document.createElement("td");
        colunaDataEntrega.textContent = "ENTREGA";
        linha.appendChild(colunaDataEntrega);

        const colunaPeso = document.createElement("td");
        colunaPeso.textContent = 'PESO';
        linha.appendChild(colunaPeso);

        const colunaVolume = document.createElement("td");
        colunaVolume.textContent = 'VOLUME';
        linha.appendChild(colunaVolume);
    }else{
        const colunaUnid = document.createElement("td");
        colunaUnid.textContent = "UNID";
        linha.appendChild(colunaUnid);
    }
    linha.appendChild(colunaNcm);
    linha.appendChild(colunaQuantidade);
    linha.appendChild(colulaPrecoUnit);
    linha.appendChild(colunaPreco);    

    tabela.appendChild(linha);

    var i = 1
    for (const item of dados.results) {
        const linha = document.createElement("tr");
        const colunaItem = document.createElement("td");
        const colunaCodigo = document.createElement("td");
        const colunaDescricao = document.createElement("td");
        const colunaQuantidade = document.createElement("td");

        const colulaPrecoUnit = document.createElement("td");
        const colunaPreco = document.createElement("td");
        const colunaNcm = document.createElement("td");
               

        colunaItem.textContent = i.toString();
        colunaCodigo.textContent = item.peca.codigo;
        colunaDescricao.textContent = item.peca.descricao;
        colunaQuantidade.textContent = item.quantidade;
        
        colulaPrecoUnit.textContent = formatarPreco(item.peca.precoVenda * 1.2);
        colunaPreco.textContent = formatarPreco(item.peca.precoVenda * item.quantidade * 1.2);
        colunaNcm.textContent = item.peca.ncm;
                

        precoTotal  += item.peca.precoVenda * item.quantidade;
        volumeTotal += item.peca.volume     * item.quantidade;
        volumeBruto += item.volumeBruto     * item.quantidade;
        pesoBruto   += item.pesoBruto       * item.quantidade;
        pesoTotal   += item.peca.peso       * item.quantidade;        

        linha.appendChild(colunaItem);
        linha.appendChild(colunaCodigo);
        linha.appendChild(colunaDescricao); 
        if (tipo.value != "fatura"){ 
            const colunaDataEntrega = document.createElement("td");
            colunaDataEntrega.textContent = formatarData(item.dataEntrega);
            linha.appendChild(colunaDataEntrega);

            const colunaPeso = document.createElement("td");
            colunaPeso.textContent = item.peca.peso;
            linha.appendChild(colunaPeso);

            const colunaVolume = document.createElement("td"); 
            colunaVolume.textContent = item.peca.volume;
            linha.appendChild(colunaVolume);
        }else{
            const colunaUnid = document.createElement("td");
            colunaUnid.textContent = item.unidade;
            linha.appendChild(colunaUnid);
        }
        linha.appendChild(colunaNcm);
        linha.appendChild(colunaQuantidade);
        linha.appendChild(colulaPrecoUnit);
        linha.appendChild(colunaPreco);               

        tabela.appendChild(linha);

        i++;
      }
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