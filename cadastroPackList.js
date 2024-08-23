var urlOrcamento = "http://127.0.0.1:8000/orcamentos/";

async function carregarDados() {
    const respostaOrcamento = await fetch(urlOrcamento, {
        method: "GET",
        headers: {
          "Content-type": "application/json; charset=UTF-8",
          "Authorization": "token " + localStorage.tokenUsuario
        }
      });
    const dadosOrcamento = await respostaOrcamento.json();
    popularDropDownOrcamento(dadosOrcamento); 
}

carregarDados();

function popularDropDownOrcamento(dados){
    const dropdownOrcamento = document.getElementById('dropdownOrcamento');

    for(const item of dados.results){
        const orcamento = document.createElement("option");
        orcamento.value = item.id;
        orcamento.textContent = item.codigo + ' - ' + item.client.nomeCliente;
        console.log(item.id);
        dropdownOrcamento.appendChild(orcamento);
    }
    dropdownOrcamento.value = localStorage.orcamentoId;
}
function atualizarOrcamento(orcamentoId){
    localStorage.orcamentoId = orcamentoId
    location.reload();
}
function loadScript(url){    
    var head = document.getElementsByTagName('head')[0];
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = url;
    head.appendChild(script);
}

loadScript("scriptTabelaPedidos.js");

function add(){
    const formularioEncomenda = document.getElementById('formularioEncomenda');

    formularioEncomenda.addEventListener('submit', async function(event) {
        event.preventDefault(); // Evita o envio padrão do formulário

        const dados = {
            volume: parseFloat(document.getElementById('volume').value) || null,
            pacote: document.getElementById('pacote').value,
            comprimento: parseInt(document.getElementById('comprimento').value),
            largura: parseInt(document.getElementById('largura').value),
            altura: parseInt(document.getElementById('altura').value),
            peso: parseFloat(document.getElementById('peso').value)
        };

        console.log(dados); 

        await fetch("http://127.0.0.1:8000/pack/", {
            method: "POST",
            body: JSON.stringify({
                    "volume": dados.volume,
                    "pacote": dados.pacote,
                    "comprimento": dados.comprimento,
                    "largura": dados.largura,
                    "altura": dados.altura,
                    "peso": dados.peso,
                    "orcamento": 2
            }),
            headers: {
              "Content-type": "application/json; charset=UTF-8",
              "Authorization": "token " + localStorage.tokenUsuario
            }
          })
            .then((response) => response.json())
            .then((json) => console.log(json)); 
    });
}

function addPacote(){
    add();
}