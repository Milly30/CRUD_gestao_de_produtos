const API_BASE_URL = 'https://649a1d4a79fbe9bcf8404b5a.mockapi.io/users/20201214010007/products';

const productForm = document.getElementById('productForm');
const productTableBody = document.getElementById('productTableBody');

function buscarProdutos() {
  fetch(API_BASE_URL)
    .then(response => response.json())
    .then(produtos => {
      productTableBody.innerHTML = '';

      produtos.forEach(produto => {
        const row = criarLinhaTabela(produto);
        productTableBody.appendChild(row);
      });
    })
    .catch(error => {
      console.error('Erro ao buscar os produtos:', error);
    });
}

function criarLinhaTabela(produto) {
  const row = document.createElement('tr');

  const idCell = document.createElement('td');
  idCell.textContent = produto.id;
  row.appendChild(idCell);

  const nomeCell = document.createElement('td');
  nomeCell.textContent = produto.nome;
  row.appendChild(nomeCell);

  const categoriaCell = document.createElement('td');
  categoriaCell.textContent = produto.categoria;
  row.appendChild(categoriaCell);

  const precoCell = document.createElement('td');
  precoCell.textContent = produto.preco;
  row.appendChild(precoCell);

  const descricaoCell = document.createElement('td');
  descricaoCell.textContent = produto.descricao;
  row.appendChild(descricaoCell);

  const imagemCell = document.createElement('td');
  const imagem = document.createElement('img');
  imagem.src = produto.imagem;
  imagem.alt = produto.nome;
  imagem.classList.add('product-image');
  imagemCell.appendChild(imagem);
  row.appendChild(imagemCell);

  const acoesCell = document.createElement('td');
  const excluirButton = document.createElement('button');
  excluirButton.textContent = 'Excluir';
  excluirButton.classList.add('excluir-button');
  excluirButton.addEventListener('click', () => {
    excluirProduto(produto.id);
  });
  acoesCell.appendChild(excluirButton);
  row.appendChild(acoesCell);

  return row;
}

function criarProduto(dadosProduto) {
  fetch(API_BASE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(dadosProduto),
  })
    .then(response => response.json())
    .then(produtoCriado => {
      const novaLinha = criarLinhaTabela(produtoCriado);
      productTableBody.appendChild(novaLinha);
      limparFormulario();
    })
    .catch(error => {
      console.error('Erro ao criar o produto:', error);
    });
}

function excluirProduto(idProduto) {
  fetch(`${API_BASE_URL}/${idProduto}`, {
    method: 'DELETE',
  })
    .then(() => {
      const linhaExcluir = document.querySelector(`[data-product-id="${idProduto}"]`);
      linhaExcluir.remove();
    })
    .catch(error => {
      console.error('Erro ao excluir o produto:', error);
    });
}

function limparFormulario() {
  productForm.reset();
}

productForm.addEventListener('submit', event => {
  event.preventDefault();

  const nomeInput = document.getElementById('nameInput');
  const categoriaInput = document.getElementById('categoryInput');
  const precoInput = document.getElementById('priceInput');
  const descricaoInput = document.getElementById('descriptionInput');
  const imagemInput = document.getElementById('imageInput');

  const dadosProduto = {
    nome: nomeInput.value,
    categoria: categoriaInput.value,
    preco: parseFloat(precoInput.value),
    descricao: descricaoInput.value,
    imagem: URL.createObjectURL(imagemInput.files[0]),
  };

  criarProduto(dadosProduto);
});

buscarProdutos();
