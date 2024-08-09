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
          document.cookie = `jwt=${data.token}; Secure; HttpOnly`;
          document.cookie = `email=${data.user.email};`;
          console.log(data.user.email)
        })
        .catch(error => console.error('Error:', error));        
        

        if(cookie.email == null){
          alert("usuario ou senha incorreta");
        }else{
          location.href = "/index.html";
        }

}