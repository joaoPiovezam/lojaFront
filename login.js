async function logar(){

    await fazerLogin()

}

async function fazerLogin(){
    const dados = {
        username: document.getElementById("username").value,
        password: document.getElementById("password").value
    }

    await fetch("http://127.0.0.1:8000/login", {
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
          location.href('/index.html');
        }
        
        

}