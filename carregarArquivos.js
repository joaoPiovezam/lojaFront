function enviarArquivo() {
    const arquivo = document.getElementById('arquivoSelecionado').files[0];
    const formData = new FormData();
    formData.append('arquivo', arquivo);

    const request = new XMLHttpRequest();
    request.open('POST', '/teste'); // Altere para a URL do seu servidor
    request.onload = function() {
        if (request.status === 200) {
            const resultado = JSON.parse(request.responseText);
            const mensagem = document.getElementById('resultado');
            mensagem.innerHTML = resultado.mensagem;
        } else {
            console.error('Erro ao enviar arquivo:', request.statusText);
        }
    };

    request.send(formData);
}
