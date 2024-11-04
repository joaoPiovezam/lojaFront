var pagina = 1;
var i = 1;
var str = "";
var id = 0;

function loadScript(url){    
    var head = document.getElementsByTagName('head')[0];
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = url;
    head.appendChild(script);
}

/*var urlAPI = "http://127.0.0.1:8000/pecasFornecedor/?format=json&page="+ pagina;

async function carregarDados() {
    const resposta = await fetch(urlAPI);
    const dadosJSON = await resposta.json();
    loadScript("pecasLista.js")
    /*if(pagina == 1){
        carregarTabela();
    }
    popularTabela(dadosJSON);
    
}*/

async function  carregarUrl(){
  const urlA = await fetch('./rotaBack.json')
  dados = await urlA.json()
  return dados.API_URL
}

var urlAPI = "";

async function carregarDados() {
    urlA = await carregarUrl()
        const resposta = await fetch(urlA + '/fornecedor/', {
            method: "GET",
            headers: {
              "Content-type": "application/json; charset=UTF-8",
              "Authorization": "token " + localStorage.tokenUsuario
            }
          });
        const dadosJSON = await resposta.json();
        loadScript("pecasLista.js");
        popularTabela(dadosJSON); 
    }

carregarDados();

function popularTabela(dados){
    const dropDownFornecedores = document.getElementById('dropDownFornecedor');

    for(const item of dados.results){
        const fornecedor = document.createElement("option");
        fornecedor.value = item.id;
        fornecedor.textContent = item.nome_fornecedor + ' - ' + item.cpfcnpj;
        console.log(item.nome_fornecedor + ' - ' + item.cpfcnpj);
        dropDownFornecedores.appendChild(fornecedor);
    }
    dropDownFornecedores.value = localStorage.idFornececedor
}


async function addCatalogoFornec(json) {
  urlA = await carregarUrl()
    fornecedor = document.getElementById("dropDownFornecedor").value
    const resposta = await fetch(urlA + "/addPecaFornecedor/" + json  +"/" + fornecedor + "/", {
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
  
  async function addPecasCatalogoFornecedor() {
    const input = document.getElementById('myFileCatalogoFornecedor');
    const file = input.files[0];
    if (file) {
      const reader = new FileReader();
  
      reader.onload = async (e) => {
        const content = e.target.result;
        console.log(content);
        const pecas = content.replace(/['\n']/g,";")
        console.log(pecas)
        await addCatalogoFornec(pecas)
      };
  
      reader.onerror = (e) => {
        console.error('Erro ao ler o arquivo:', e);
      };
  
      reader.readAsText(file);
    } else {
      console.log('Nenhum arquivo selecionado');
    }
  
  }



function enviarArquivo(){

}