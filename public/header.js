const template = document.createElement('template');

template.innerHTML = `
<meta http-equiv="Content-Security-Policy" content="upgrade-insecure-requests">
            <div class="navbar" id="navbar"> 
                <select onchange = "atualizarMoeda()" id = 'dropDownMoeda'>
                    <option value = "BRL">R$ BRL</option>
                    <option value = "USD">US$ USD</option>
                    <option value = "EUR">€ EUR</option>
                    <option value = "CRC">₡ CRC</option>
                </select>
                <ul id = "geral">
                        <a href="/#" >HOME</a>
                        <a href="/pecas.html" >Peça</a>
                        <a href="/cadastroOrcamento.html">Orçamento</a>
                        <a href="/cadastroFatura.html">Fatura</a>
                        <a href="/cadastroCotacao.html">Cotação</a>
                        <a href="/cadastroPedidoCompra.html">Pedido de Compra</a>
                        <a href="/cadastroPacotes.html">Packing List</a>
                        <a href="/cadastroEstoque.html">Estoque</a>                
                        <a href="/fornecedores.html">Fornecedores</a>                
                        <a href="/cadastroTransportadora.html">Transportadoras</a>                
                </ul>
                <ul id = "cliente">
                    <a href="/pecas.html" >Catálogo</a>
                    <a href="/meusPedidos.html">Meus Pedidos</a>
                </ul>

            <div class="login-link"  id='login'>
                <button id='login' type="button" style="border-radius: 10px;" onclick="logIn()"><i class="fas fa-user" ></i> Fazer Login</button>
            </div>
            
            <div class="login-link" id='logout'>
                <button id='logout' type="button" style="border-radius: 10px;" onclick="logOut()"><i class="fas fa-user" ></i>Sair</button>
            </div>

            

            </div>
                     
            
`;

//document.body.appendChild(template.content);
document.getElementById('header').appendChild(template.content)
login = document.getElementById('login');
logout = document.getElementById('logout');
if(localStorage.email == 'null'){
    login.hidden = false;
    logout.hidden = true;
}else{       
    login.hidden = true;
    logout.hidden = false;
}
if (localStorage.tipo == 'cliente'){
    document.getElementById('geral').hidden = true
}

document.getElementById('dropDownMoeda').value = localStorage.Moeda

function atualizarMoeda(){
    localStorage.Moeda = document.getElementById('dropDownMoeda').value;
    location.reload()
}