async function obterDestinos() {
    const response = await fetch('http://localhost:3000/destinos');
    return await response.json();
}

// Página index.html
async function carregarDestinosIndex() {
    const container = document.querySelector('.dmpDiv');
    if (!container) return;

    const destinos = await obterDestinos();
    container.innerHTML = '';

    destinos.forEach(destino => {
        const card = document.createElement('div');
        card.innerHTML = `
            <img class="ImagensClasse" src="${destino.imagem}" alt="${destino.nome}">
            <h3>${destino.nome}</h3>
            <p>${destino.descricao}</p>
            <a href="detalhes.html?id=${destino.id}" class="btn btn-dark">Ver Detalhes</a>
        `;
        container.appendChild(card);
    });
}

// Página detalhes.html
async function carregarDetalhes() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    if (!id) return;

    const destinos = await obterDestinos();
    const destino = destinos.find(d => d.id == id);

    if (!destino) {
        document.getElementById('detalhes-container').innerHTML = `<p class="text-danger text-center">Destino não encontrado.</p>`;
        return;
    }

    document.getElementById('detalhe-imagem').src = destino.imagem;
    document.getElementById('detalhe-nome').textContent = destino.nome;
    document.getElementById('detalhe-descricao').textContent = destino.descricao;
    document.getElementById('detalhe-detalhes').textContent = destino.detalhes;
    document.getElementById('detalhe-recomendado').textContent = destino.recomendado;
    document.getElementById('detalhe-epoca').textContent = destino.epoca;

    const fotos = [
        { titulo: `Vista aérea de ${destino.nome}`, imagem: destino.imagem },
        { titulo: `Ponto turístico de ${destino.nome}`, imagem: destino.imagem },
        { titulo: `Cultura local em ${destino.nome}`, imagem: destino.imagem }
    ];

    const container = document.getElementById('fotos-container');
    fotos.forEach(foto => {
        const col = document.createElement('div');
        col.className = 'col-md-4 mb-3';
        col.innerHTML = `
            <div class="card">
                <img src="${foto.imagem}" class="card-img-top" alt="${foto.titulo}">
                <div class="card-body">
                    <h5 class="card-title">${foto.titulo}</h5>
                </div>
            </div>
        `;
        container.appendChild(col);
    });
}

// Página cadastro_destinos.html
async function cadastrarDestino(event) {
    event.preventDefault();

    const form = event.target;
    const dados = {
        nome: form.nome.value,
        imagem: form.imagem.value,
        descricao: form.descricao.value,
        detalhes: form.detalhes.value,
        recomendado: form.recomendado.value,
        epoca: form.epoca.value,
        dias: form.dias.value
    };

    const response = await fetch('http://localhost:3000/destinos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dados)
    });

    if (response.ok) {
        alert('Destino cadastrado com sucesso!');
        form.reset();
    } else {
        alert('Erro ao cadastrar destino.');
    }
}
form.addEventListener('submit', e => {
  e.preventDefault();
  const termo = searchInput.value.toLowerCase();
  const destinosFiltrados = destinos.filter(dest => dest.titulo.toLowerCase().includes(termo));
  renderDestinos(destinosFiltrados);
});
// Chamada condicional
window.addEventListener('DOMContentLoaded', () => {
    if (document.querySelector('.dmpDiv')) carregarDestinosIndex();
    if (document.getElementById('detalhe-nome')) carregarDetalhes();
    const form = document.querySelector('form');
    if (form) form.addEventListener('submit', cadastrarDestino);
});