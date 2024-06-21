var urlAPI = "http://127.0.0.1:8000/pedidoCompra/"+ localStorage.orcamentoId +"/0?format=json";
var urlFornecedor = "http://127.0.0.1:8000/fornecedor/";

var precoTotal = 0.0;
var pesoTotal = 0.0;
var volumeTotal = 0.0;

async function carregarDados() {
        const resposta = await fetch(urlAPI);
        const dadosJSON = await resposta.json();        
        const respostaFornecedores = await fetch(urlFornecedor);
        const dadosFornecedores= await respostaFornecedores.json();

        popularDownFornecedores(dadosFornecedores);     
        popularTabelaCliente1(dadosJSON);
        popularTabelaCliente2(dadosJSON);
        /*popularTabelaCliente3(dadosJSON);
        popularTabelaCliente4(dadosJSON);*/
        popularTabelaPedidos(dadosJSON);
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

function popularDownFornecedores(dados){
    const dropDownFornecedores = document.getElementById('dropDownFornecedor');

    for(const item of dados.results){
        const fornecedor = document.createElement("option");
        fornecedor.value = item.id;
        fornecedor.textContent = item.nomeFornecedor + ' - ' + item.cpfCnpj;
        console.log(item.nomeFornecedor + ' - ' + item.cpfCnpj);
        dropDownFornecedores.appendChild(fornecedor);
    }
}    
function atualizarFonecedor(fornecedorId){
    urlAPI = "http://127.0.0.1:8000/pedidoCompra/"+ localStorage.orcamentoId +"/" + fornecedorId + "?format=json";
    carregarDados();
}

function popularTabelaCliente1(dados){
    const tabela = document.getElementById("tabela-cliente");

    const fornecedor = dados.results[0].cotacao.pecaFornecedor.fornecedor;

    const linha = document.createElement("tr");
    const colunacpfCnpj = document.createElement("td");
    const colunanomeFornecedor = document.createElement("td");
    const colunaTelefone = document.createElement("td");
    const colunaEmail = document.createElement("td");
   
    colunacpfCnpj.textContent = "CNPJ:";
    colunanomeFornecedor.textContent = "FORNECEDOR:";
    colunaTelefone.textContent = "TELEFONE:";
    colunaEmail.textContent = "EMAIL:";

    linha.appendChild(colunacpfCnpj);
    linha.appendChild(colunanomeFornecedor);
    linha.appendChild(colunaTelefone);
    linha.appendChild(colunaEmail);

    tabela.appendChild(linha);
    
    const linha1 = document.createElement("tr");
    const colunacpfCnpj1 = document.createElement("td");
    const colunanomeFornecedor1 = document.createElement("td");
    const colunaTelefone1 = document.createElement("td");
    const colunaEmail1 = document.createElement("td");

    colunacpfCnpj1.textContent = fornecedor.cpfCnpj;
    colunanomeFornecedor1.textContent = fornecedor.nomeFornecedor;
    colunaTelefone1.textContent = fornecedor.telefone;
    colunaEmail1.textContent = fornecedor.email;


    linha1.appendChild(colunacpfCnpj1);
    linha1.appendChild(colunanomeFornecedor1);
    linha1.appendChild(colunaTelefone1);
    linha1.appendChild(colunaEmail1);

    tabela.appendChild(linha1);
}

function popularTabelaCliente2(dados){
    const tabela = document.getElementById("tabela-cliente");

    const fornecedor = dados.results[0].cotacao.pecaFornecedor.fornecedor;

    const linha = document.createElement("tr");
    const colunaCep = document.createElement("td");
    const colunaEndereco = document.createElement("td");
    const colunaCidade = document.createElement("td");

    colunaCep.textContent = "CEP:";
    colunaEndereco.textContent = "ENDEREÇO:";
    colunaCidade.textContent = "CIDADE:";

    linha.appendChild(colunaCep);
    linha.appendChild(colunaEndereco);
    linha.appendChild(colunaCidade);

    tabela.appendChild(linha);
    
    const linha1 = document.createElement("tr");
    const colunaCep1 = document.createElement("td");
    const colunaEndereco1 = document.createElement("td");
    const colunaCidade1 = document.createElement("td");

    colunaCep1.textContent = fornecedor.cep;
    colunaEndereco1.textContent = fornecedor.endereco;
    colunaCidade1.textContent = fornecedor.cidade;

    linha1.appendChild(colunaCep1);
    linha1.appendChild(colunaEndereco1);
    linha1.appendChild(colunaCidade1);

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

function popularTabelaPedidos(dados){
    const tabela = document.getElementById("tabela-pedidos");
    
    const linha = document.createElement("tr");
    const colunaItem = document.createElement("td");
    const colunaCodigo = document.createElement("td");
    const colunaDescricao = document.createElement("td");
    const colunaQuantidade = document.createElement("td");
    //const colunaDataEntrega = document.createElement("td");
    const colulaPrecoUnit = document.createElement("td");
    const colunaPreco = document.createElement("td");
    const colunaNcm = document.createElement("td");
    //const colunaVolume = document.createElement("td");
    const colunaPeso = document.createElement("td");
    colunaDescricao.setAttribute('width', '188px');
    

    colunaItem.textContent = "ITEM";
    colunaCodigo.textContent = "CODIGO";
    colunaDescricao.textContent = "PRODUTOS";
    colunaQuantidade.textContent = "QTDE.";
    //colunaDataEntrega.textContent = "ENTREGA";
    colulaPrecoUnit.textContent = "PREÇO UN.";
    colunaPreco.textContent = 'PREÇO';
    //colunaVolume.textContent = 'VOLUME';
    colunaPeso.textContent = 'PESO';
    colunaNcm.textContent = 'NCM';

    linha.appendChild(colunaItem);
    linha.appendChild(colunaCodigo);
    linha.appendChild(colunaDescricao);
    //linha.appendChild(colunaDataEntrega);
    linha.appendChild(colunaNcm);
    linha.appendChild(colunaQuantidade);
    linha.appendChild(colulaPrecoUnit);
    linha.appendChild(colunaPreco);
    //linha.appendChild(colunaVolume);
    linha.appendChild(colunaPeso);

    tabela.appendChild(linha);

    var i = 1
    for (const item of dados.results) {
        const linha = document.createElement("tr");
        const colunaItem = document.createElement("td");
        const colunaCodigo = document.createElement("td");
        const colunaDescricao = document.createElement("td");
        const colunaQuantidade = document.createElement("td");
        //const colunaDataEntrega = document.createElement("td");
        const colulaPrecoUnit = document.createElement("td");
        const colunaPreco = document.createElement("td");
        const colunaNcm = document.createElement("td");
        //const colunaVolume = document.createElement("td");
        const colunaPeso = document.createElement("td");

        colunaItem.textContent = i.toString();
        colunaCodigo.textContent = item.cotacao.pecaFornecedor.peca.codigo;
        colunaDescricao.textContent = item.cotacao.pecaFornecedor.peca.descricao;
        colunaQuantidade.textContent = item.cotacao.pedido.quantidade;
        //colunaDataEntrega.textContent = formatarData(item.dataEntrega);
        colulaPrecoUnit.textContent = formatarPreco(item.cotacao.pecaFornecedor.preco *1);
        colunaPreco.textContent = formatarPreco(item.cotacao.pecaFornecedor.preco * item.cotacao.pedido.quantidade);
        colunaNcm.textContent = item.cotacao.pecaFornecedor.peca.ncm;
        //colunaVolume.textContent = item.peca.volume;
        colunaPeso.textContent = item.cotacao.pecaFornecedor.peca.peso

        precoTotal  += item.cotacao.pecaFornecedor.preco * item.cotacao.pedido.quantidade;
        //volumeTotal += item.cotacao.pecaFornecedor.peca.volume     * item.cotacao.pedido.quantidade;
        pesoTotal   += item.cotacao.pecaFornecedor.peca.peso       * item.cotacao.pedido.quantidade;        

        linha.appendChild(colunaItem);
        linha.appendChild(colunaCodigo);
        linha.appendChild(colunaDescricao);
        //linha.appendChild(colunaDataEntrega);
        linha.appendChild(colunaNcm);
        linha.appendChild(colunaQuantidade);
        linha.appendChild(colulaPrecoUnit);
        linha.appendChild(colunaPreco);
        //linha.appendChild(colunaVolume);
        linha.appendChild(colunaPeso);

        tabela.appendChild(linha);

        i++;
      }
      const totalOrcado = document.getElementById("total-orcado");
      const totalPeso = document.getElementById("total-peso");
      const comprador = document.getElementById("comprador");
      //const totalVolume = document.getElementById("total-volume");
      const operacaoFiscal = document.getElementById("opercaoFiscal");
      const vencimento = document.getElementById("vencimento");
      const transportadora = document.getElementById("transportadora");
      const transportadoraFone = document.getElementById("traportadoraFone");
      const frete = document.getElementById("frete");

      
      totalOrcado.append('PREÇO TOTAL  = ');
      totalOrcado.append(formatarPreco(precoTotal));

      /*totalVolume.append('VOLUME TOTAL = ');
      totalVolume.append(formatarPreco(volumeTotal));*/

      vencimento.append("VENCIMENTOS:    ");
      vencimento.append(dados.results[0].vencimento);

      operacaoFiscal.append('OPERAÇÂO FISCAL:    ');
      operacaoFiscal.append(dados.results[0].operacaoFiscal);

      totalPeso.append('PESO TOTAL     = ');
      totalPeso.append(formatarPreco(pesoTotal));

      comprador.append('COMPRADOR: ');
      comprador.append(dados.results[0].comprador);

      transportadora.append('TRASPORTADORA: ');
      transportadora.append(dados.results[0].transportadora.nome);

      transportadoraFone.append("FONE:");
      transportadoraFone.append(dados.results[0].transportadora.telefone);

      frete.append("FRETE: ");
      frete.append(dados.results[0].frete);

}