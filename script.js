const API_BASE_URL = 'https://649a1d4a79fbe9bcf8404b5a.mockapi.io/users/20201214010007/products';

const productForm = document.getElementById('productForm');
const productTableBody = document.getElementById('productTableBody');
const cancelButton = document.getElementById('cancelButton');

let isEditing = false;
let editingProductId = null;

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
  row.setAttribute('data-product-id', produto.id);

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
  const editarButton = document.createElement('button');
  editarButton.textContent = 'Editar';
  editarButton.classList.add('editar-button');
  editarButton.addEventListener('click', () => {
    editarProduto(produto.id);
  });
  acoesCell.appendChild(editarButton);

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

function preencherFormulario(produto) {
  document.getElementById('productId').value = produto.id;
  document.getElementById('nameInput').value = produto.nome;
  document.getElementById('categoryInput').value = produto.categoria;
  document.getElementById('priceInput').value = produto.preco;
  document.getElementById('descriptionInput').value = produto.descricao;
  document.getElementById('imageInput').value = '';
}

function salvarProduto(dadosProduto) {
  if (isEditing) {
    editarProdutoAPI(dadosProduto);
  } else {
    criarProdutoAPI(dadosProduto);
  }
}

function criarProdutoAPI(dadosProduto) {
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

function editarProdutoAPI(dadosProduto) {
  fetch(`${API_BASE_URL}/${editingProductId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(dadosProduto),
  })
    .then(response => response.json())
    .then(produtoAtualizado => {
      const linhaAtualizada = document.querySelector(`[data-product-id="${editingProductId}"]`);
      linhaAtualizada.replaceWith(criarLinhaTabela(produtoAtualizado));
      limparFormulario();
    })
    .catch(error => {
      console.error('Erro ao editar o produto:', error);
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

function editarProduto(idProduto) {
  fetch(`${API_BASE_URL}/${idProduto}`)
    .then(response => response.json())
    .then(produto => {
      preencherFormulario(produto);
      isEditing = true;
      editingProductId = idProduto;
    })
    .catch(error => {
      console.error('Erro ao buscar o produto para edição:', error);
    });
}

cancelButton.addEventListener('click', () => {
  limparFormulario();
});

productForm.addEventListener('submit', event => {
  event.preventDefault();

  const productIdInput = document.getElementById('productId');
  const nameInput = document.getElementById('nameInput');
  const categoryInput = document.getElementById('categoryInput');
  const priceInput = document.getElementById('priceInput');
  const descriptionInput = document.getElementById('descriptionInput');
  const imageInput = document.getElementById('imageInput');

  const dadosProduto = {
    id: productIdInput.value,
    nome: nameInput.value,
    categoria: categoryInput.value,
    preco: parseFloat(priceInput.value),
    descricao: descriptionInput.value,
    imagem: URL.createObjectURL(imageInput.files[0]),
  };

  salvarProduto(dadosProduto);
});

buscarProdutos();
