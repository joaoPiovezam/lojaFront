function loadScript(url)
{    
    var head = document.getElementsByTagName('head')[0];
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = url;
    head.appendChild(script);
}


loadScript("header.js");

async function logar(){

    await fazerLogin()

}

async function  carregarUrl(){
  const urlA = await fetch('./rotaBack.json')
  dados = await urlA.json()
  return dados.API_URL
}

async function fazerLogin(){
  urlA = await carregarUrl()
    const dados = {
        username: document.getElementById("username").value,
        password: document.getElementById("password").value
    }

    await fetch(urlA + "/login", {
        method: "POST",
        body: JSON.stringify({ 
            "username": dados.username,
            "password": dados.password 
        }),
        headers: {
          "Content-type": "application/json; charset=UTF-8"
        }
      })
        .then((response) => response.json())
        .then(data => {
          //document.cookie = `jwt=${data.token}; Secure; HttpOnly`;
          //document.cookie = `email=${data.user.email};`;
          //document.cookie = `tipo=${data.tipo}`;
          localStorage.email = data.user.email
          localStorage.tipo = data.tipo
          localStorage.tokenUsuario = data.token;
          localStorage.clienteId = data.user.id;
          console.log(data)
        })
        .catch(error => console.error('Error:', error));

        if (localStorage.email == 'null'){
          document.getElementById('alert').classList.remove('d-none')
        }else{
          document.getElementById('alert').classList.add('d-none');
          //location.href('/src/index.html');
          window.location.href = '/index.html';
        }
        
        

}